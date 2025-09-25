// Admin service layer - handles admin operations and API calls
import { tokens } from '../lib/api';

// API Base URL
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

// Generic request handler
async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // non-JSON response
  }

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    if (data) {
      if (typeof data.detail === "string") message = data.detail;
      else if (Array.isArray(data.detail)) {
        message = data.detail
          .map((d) => (d?.msg ? `${d.msg}${d?.loc ? ` at ${d.loc.join('.')}` : ''}` : JSON.stringify(d)))
          .join("; ");
      } else if (data.message) message = data.message;
    }
    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

class AdminService {
  constructor() {
    this.cache = new Map();
    this.cacheTimestamps = new Map();
    this.CACHE_DURATION = 5 * 60 * 1000; // 5 minutes for admin data
  }

  // Get current auth token
  getToken() {
    const userTokens = tokens.get();
    return userTokens?.access_token;
  }

  // Cache management
  isCacheValid(key) {
    const timestamp = this.cacheTimestamps.get(key);
    return timestamp && (Date.now() - timestamp) < this.CACHE_DURATION;
  }

  setCache(key, data) {
    this.cache.set(key, data);
    this.cacheTimestamps.set(key, Date.now());
  }

  getCache(key) {
    if (this.isCacheValid(key)) {
      return this.cache.get(key);
    }
    return null;
  }

  // PRODUCTS API CALLS

  // Get all pending products for review
  async getPendingProducts(params = {}) {
    try {
      const cacheKey = `pending_products_${JSON.stringify(params)}`;
      const cached = this.getCache(cacheKey);
      if (cached) return cached;

      const token = this.getToken();
      if (!token) throw new Error('Authentication required');

      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);

      const path = `/admin/products/pending${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const result = await request(path, { token });
      
      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Failed to get pending products:', error);
      throw error;
    }
  }

  // Get all products with optional filters
  async getAllProducts(params = {}) {
    try {
      const cacheKey = `all_products_${JSON.stringify(params)}`;
      const cached = this.getCache(cacheKey);
      if (cached) return cached;

      const token = this.getToken();
      if (!token) throw new Error('Authentication required');

      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.status_filter) queryParams.append('status_filter', params.status_filter);

      const path = `/admin/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const result = await request(path, { token });
      
      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Failed to get all products:', error);
      throw error;
    }
  }

  // Get single product details
  async getProduct(productId) {
    try {
      const cacheKey = `product_${productId}`;
      const cached = this.getCache(cacheKey);
      if (cached) return cached;

      const token = this.getToken();
      if (!token) throw new Error('Authentication required');

      const result = await request(`/admin/products/${productId}`, { token });
      
      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Failed to get product:', error);
      throw error;
    }
  }

  // Review (approve/reject) a product
  async reviewProduct(productId, approved, approvalNotes = '') {
    try {
      const token = this.getToken();
      if (!token) throw new Error('Authentication required');

      const result = await request(`/admin/products/${productId}/review`, {
        method: 'POST',
        token,
        body: {
          approved,
          approval_notes: approvalNotes
        }
      });

      // Invalidate relevant caches
      this.cache.delete(`product_${productId}`);
      this.invalidateProductCaches();
      
      return result;
    } catch (error) {
      console.error('Failed to review product:', error);
      throw error;
    }
  }

  // Delete a product
  async deleteProduct(productId) {
    try {
      const token = this.getToken();
      if (!token) throw new Error('Authentication required');

      await request(`/admin/products/${productId}`, {
        method: 'DELETE',
        token
      });

      // Invalidate relevant caches
      this.cache.delete(`product_${productId}`);
      this.invalidateProductCaches();
      
      return { success: true };
    } catch (error) {
      console.error('Failed to delete product:', error);
      throw error;
    }
  }

  // Update product status (enable/disable)
  async updateProductStatus(productId, status) {
    try {
      const token = this.getToken();
      if (!token) throw new Error('Authentication required');

      const response = await request(`/admin/products/${productId}/status`, {
        method: 'PUT',
        token,
        body: { status }
      });

      // Invalidate relevant caches
      this.cache.delete(`product_${productId}`);
      this.invalidateProductCaches();
      
      return response;
    } catch (error) {
      console.error('Failed to update product status:', error);
      throw error;
    }
  }

  // ORDERS API CALLS

  // Get all orders with filters
  async getAllOrders(params = {}) {
    try {
      const cacheKey = `all_orders_${JSON.stringify(params)}`;
      const cached = this.getCache(cacheKey);
      if (cached) return cached;

      const token = this.getToken();
      if (!token) throw new Error('Authentication required');

      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.status) queryParams.append('status', params.status);
      if (params.user_id) queryParams.append('user_id', params.user_id);
      if (params.supplier_id) queryParams.append('supplier_id', params.supplier_id);

      const path = `/orders/admin/orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const result = await request(path, { token });
      
      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Failed to get all orders:', error);
      throw error;
    }
  }

  // Get order analytics
  async getOrderAnalytics(params = {}) {
    try {
      const cacheKey = `order_analytics_${JSON.stringify(params)}`;
      const cached = this.getCache(cacheKey);
      if (cached) return cached;

      const token = this.getToken();
      if (!token) throw new Error('Authentication required');

      const queryParams = new URLSearchParams();
      if (params.start_date) queryParams.append('start_date', params.start_date);
      if (params.end_date) queryParams.append('end_date', params.end_date);
      if (params.granularity) queryParams.append('granularity', params.granularity);

      const path = `/orders/admin/analytics${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const result = await request(path, { token });
      
      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Failed to get order analytics:', error);
      throw error;
    }
  }

  // SUPPLIER VERIFICATION

  // Get all suppliers with verification status
  async getAllSuppliers(params = {}) {
    try {
      const cacheKey = `all_suppliers_${JSON.stringify(params)}`;
      const cached = this.getCache(cacheKey);
      if (cached) return cached;

      const token = this.getToken();
      if (!token) throw new Error('Authentication required');

      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.verification_status) queryParams.append('verification_status', params.verification_status);

      // Using admin endpoint to get suppliers
      const path = `/admin/suppliers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const result = await request(path, { token });
      
      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Failed to get all suppliers:', error);
      throw error;
    }
  }

  // Get supplier documents for verification
  async getSupplierDocuments(supplierId) {
    try {
      const cacheKey = `supplier_docs_${supplierId}`;
      const cached = this.getCache(cacheKey);
      if (cached) return cached;

      const token = this.getToken();
      if (!token) throw new Error('Authentication required');

      // Admin endpoint to get supplier documents
      const result = await request(`/admin/suppliers/${supplierId}/documents`, { 
        token
      });
      
      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Failed to get supplier documents:', error);
      throw error;
    }
  }

  // Approve or reject supplier verification
  async reviewSupplierVerification(supplierId, action, comment = '') {
    try {
      const token = this.getToken();
      if (!token) throw new Error('Authentication required');

      const result = await request(`/admin/suppliers/${supplierId}/review`, {
        method: 'POST',
        body: {
          action, // 'approve' or 'reject'
          comment
        },
        token
      });

      // Invalidate supplier-related caches
      this.invalidateSupplierCaches();
      
      return result;
    } catch (error) {
      console.error('Failed to review supplier:', error);
      throw error;
    }
  }

  // Update supplier verification status
  async updateSupplierStatus(supplierId, isVerified, comment = '') {
    try {
      const token = this.getToken();
      if (!token) throw new Error('Authentication required');

      // Map boolean to backend enum values
      const verification_status = isVerified ? 'verified' : 'rejected';
      
      const result = await request(`/admin/suppliers/${supplierId}/verification-status?verification_status=${verification_status}${comment ? `&verification_notes=${encodeURIComponent(comment)}` : ''}`, {
        method: 'PUT',
        token
      });

      // Invalidate supplier-related caches
      this.invalidateSupplierCaches();
      
      return result;
    } catch (error) {
      console.error('Failed to update supplier status:', error);
      throw error;
    }
  }

  // DASHBOARD ANALYTICS

  // Get dashboard overview stats
  async getDashboardStats() {
    try {
      const cacheKey = 'dashboard_stats';
      const cached = this.getCache(cacheKey);
      if (cached) return cached;

      const token = this.getToken();
      if (!token) throw new Error('Authentication required');

      // Combine multiple API calls for dashboard data
      const [productsData, ordersData] = await Promise.all([
        this.getAllProducts({ page: 1, limit: 1 }), // Just for counts
        this.getAllOrders({ page: 1, limit: 1 }) // Just for counts
      ]);

      const stats = {
        totalProducts: productsData.total || 0,
        pendingProducts: 0, // We'll get this separately
        totalOrders: ordersData.total || 0,
        totalRevenue: 0, // Calculate from orders
        totalSuppliers: 0, // We'll get this from suppliers endpoint
        verifiedSuppliers: 0
      };

      // Get pending products count
      try {
        const pendingData = await this.getPendingProducts({ page: 1, limit: 1 });
        stats.pendingProducts = pendingData.total || 0;
      } catch (error) {
        console.warn('Could not fetch pending products count:', error);
      }

      // Get suppliers count
      try {
        const suppliersData = await this.getAllSuppliers({ page: 1, limit: 1 });
        stats.totalSuppliers = suppliersData.total || 0;
        
        // Get verified suppliers count
        const verifiedSuppliersData = await this.getAllSuppliers({ 
          page: 1, 
          limit: 1, 
          verification_status: 'verified' 
        });
        stats.verifiedSuppliers = verifiedSuppliersData.total || 0;
      } catch (error) {
        console.warn('Could not fetch suppliers count:', error);
      }

      this.setCache(cacheKey, stats);
      return stats;
    } catch (error) {
      console.error('Failed to get dashboard stats:', error);
      throw error;
    }
  }

  // HELPER METHODS

  // Invalidate product-related caches
  invalidateProductCaches() {
    const keysToDelete = Array.from(this.cache.keys()).filter(key => 
      key.includes('products') || key.includes('pending_products') || key.includes('dashboard_stats')
    );
    keysToDelete.forEach(key => {
      this.cache.delete(key);
      this.cacheTimestamps.delete(key);
    });
  }

  // Invalidate order-related caches
  invalidateOrderCaches() {
    const keysToDelete = Array.from(this.cache.keys()).filter(key => 
      key.includes('orders') || key.includes('dashboard_stats')
    );
    keysToDelete.forEach(key => {
      this.cache.delete(key);
      this.cacheTimestamps.delete(key);
    });
  }

  // Invalidate supplier-related caches
  invalidateSupplierCaches() {
    const keysToDelete = Array.from(this.cache.keys()).filter(key => 
      key.includes('supplier') || key.includes('dashboard_stats')
    );
    keysToDelete.forEach(key => {
      this.cache.delete(key);
      this.cacheTimestamps.delete(key);
    });
  }

  // Get sales chart data
  async getSalesChartData(params = {}) {
    try {
      const cacheKey = `sales_chart_${JSON.stringify(params)}`;
      const cached = this.getCache(cacheKey);
      if (cached) return cached;

      const token = this.getToken();
      if (!token) throw new Error('Authentication required');

      const queryParams = new URLSearchParams();
      if (params.period) queryParams.append('period', params.period);
      if (params.type) queryParams.append('type', params.type);

      const path = `/admin/analytics/sales-chart${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const result = await request(path, { token });
      
      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Failed to get sales chart data:', error);
      // Return mock data as fallback
      return this.getMockSalesData();
    }
  }

  // Get top products data
  async getTopProducts(params = {}) {
    try {
      const cacheKey = `top_products_${JSON.stringify(params)}`;
      const cached = this.getCache(cacheKey);
      if (cached) return cached;

      const token = this.getToken();
      if (!token) throw new Error('Authentication required');

      const queryParams = new URLSearchParams();
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.period) queryParams.append('period', params.period);

      const path = `/admin/analytics/top-products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const result = await request(path, { token });
      
      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Failed to get top products:', error);
      // Return mock data as fallback
      return this.getMockTopProducts();
    }
  }

  // Mock data fallbacks
  getMockSalesData() {
    return {
      data: [
        { day: "10", value: 20 },
        { day: "11", value: 45 },
        { day: "12", value: 30 },
        { day: "13", value: 65 },
        { day: "14", value: 50 },
        { day: "15", value: 85 },
        { day: "16", value: 90 },
        { day: "17", value: 75 },
        { day: "18", value: 60 },
        { day: "19", value: 40 },
        { day: "20", value: 55 },
        { day: "21", value: 70 },
        { day: "22", value: 80 },
      ],
      maxValue: 90,
      minValue: 20
    };
  }

  getMockTopProducts() {
    return [
      { name: "Bamboo Spoons", orders: 2345, likes: 2223, image: "/spoons.png" },
      { name: "Wooden Baskets", orders: 1890, likes: 1856, image: "/category1.png" },
      { name: "Jute Bags", orders: 1654, likes: 1423, image: "/category1.png" },
      { name: "Eco-friendly Plates", orders: 1432, likes: 1289, image: "/spoons.png" },
    ];
  }
}

export default new AdminService();
