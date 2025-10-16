import { toast } from '@/hooks/use-toast';

// Configuration
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
const API_PREFIX = import.meta.env.VITE_BACKEND_API_PREFIX || '';

// Types
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  discount?: number;
  image_url?: string;
  sustainability_score?: number;
  stock?: number;
  category_id?: string;
  brand_id?: string;
  created_at?: string;
  updated_at?: string;
  categories?: {
    id: string;
    name: string;
    description?: string;
  };
  brands?: {
    id: string;
    name: string;
    logo_url?: string;
  };
  variants?: ProductVariant[];
  reviews?: ProductReview[];
  badges?: string[];
  carbon_saved?: string;
  eco_score?: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
}

export interface ProductReview {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  user?: {
    name: string;
    avatar_url?: string;
  };
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  parent_id?: string;
  children?: Category[];
  created_at?: string;
  updated_at?: string;
}

export interface Brand {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  website_url?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  total_amount: number;
  shipping_address: Address;
  billing_address: Address;
  payment_method: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
  price: number;
  product: Product;
}

export interface Address {
  id: string;
  user_id: string;
  type: 'shipping' | 'billing';
  first_name: string;
  last_name: string;
  company?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Cart {
  id: string;
  user_id?: string;
  session_id?: string;
  items: CartItem[];
  total_amount: number;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
  product: Product;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product: Product;
}

export interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  avatar_url?: string;
  role: 'buyer' | 'supplier' | 'admin';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: UserProfile;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface SearchRequest {
  query?: string;
  category_id?: string;
  brand_id?: string;
  min_price?: number;
  max_price?: number;
  sustainability_score_min?: number;
  sort_by?: 'name' | 'price' | 'created_at' | 'sustainability_score' | 'relevance';
  sort_order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// API Client Class
class BackendApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = `${BACKEND_URL}${API_PREFIX}`;
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // Authentication
  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  // Auth API
  async signup(email: string, password: string, name: string, phone?: string) {
    return this.request<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, phone }),
    });
  }

  async login(email: string, password: string) {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(response.access_token);
    return response;
  }

  async logout() {
    this.setToken(null);
  }

  async getProfile() {
    return this.request<UserProfile>('/me');
  }

  async updateProfile(updates: Partial<UserProfile>) {
    return this.request<UserProfile>('/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Products API
  async getProducts(params: SearchRequest = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    return this.request<PaginatedResponse<Product>>(`/products?${searchParams}`);
  }

  async getProduct(id: string) {
    return this.request<Product>(`/products/${id}`);
  }

  async searchProducts(query: string, filters: Omit<SearchRequest, 'query'> = {}) {
    return this.request<PaginatedResponse<Product>>('/search/', {
      method: 'POST',
      body: JSON.stringify({ query, ...filters }),
    });
  }

  async getFeaturedProducts(limit: number = 12) {
    return this.request<Product[]>(`/search/trending?limit=${limit}`);
  }

  async getEcoFriendlyProducts(limit: number = 12) {
    return this.request<Product[]>(`/search/eco-friendly?limit=${limit}`);
  }

  async getRecommendations(type: 'trending' | 'personalized' | 'new_arrivals' | 'best_sellers', limit: number = 10) {
    return this.request<Product[]>(`/search/recommendations?type=${type}&limit=${limit}`);
  }

  // Categories API
  async getCategories() {
    return this.request<Category[]>('/products/categories/tree');
  }

  async getCategory(id: string) {
    return this.request<Category>(`/products/categories/${id}`);
  }

  // Brands API
  async getBrands() {
    return this.request<Brand[]>('/products/brands/active');
  }

  async getBrand(id: string) {
    return this.request<Brand>(`/products/brands/${id}`);
  }

  // Cart API
  async getCart() {
    return this.request<Cart>('/buyer/orders/cart');
  }

  async addToCart(productId: string, quantity: number = 1, variantId?: string) {
    return this.request<{ message: string }>('/buyer/orders/cart/items', {
      method: 'POST',
      body: JSON.stringify({
        product_id: productId,
        quantity,
        variant_id: variantId,
      }),
    });
  }

  async updateCartItem(cartItemId: string, quantity: number) {
    return this.request<{ message: string }>(`/buyer/orders/cart/items/${cartItemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeFromCart(cartItemId: string) {
    return this.request<{ message: string }>(`/buyer/orders/cart/items/${cartItemId}`, {
      method: 'DELETE',
    });
  }

  async clearCart() {
    return this.request<{ message: string }>('/buyer/orders/cart', {
      method: 'DELETE',
    });
  }

  // Orders API
  async getOrders(page: number = 1, limit: number = 10) {
    return this.request<PaginatedResponse<Order>>(`/buyer/orders?page=${page}&limit=${limit}`);
  }

  async getOrder(id: string) {
    return this.request<Order>(`/buyer/orders/${id}`);
  }

  async createOrder(orderData: {
    billing_address_id: string;
    shipping_address_id: string;
    payment_method: string;
    customer_notes?: string;
  }) {
    return this.request<Order>('/buyer/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async cancelOrder(id: string, reason: string) {
    return this.request<{ message: string }>(`/buyer/orders/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ cancel_reason: reason }),
    });
  }

  // Wishlist API
  async getWishlist() {
    return this.request<WishlistItem[]>('/products/wishlist');
  }

  async addToWishlist(productId: string) {
    return this.request<{ message: string }>('/products/wishlist', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId }),
    });
  }

  async removeFromWishlist(productId: string) {
    return this.request<{ message: string }>(`/products/wishlist/${productId}`, {
      method: 'DELETE',
    });
  }

  async isInWishlist(productId: string) {
    return this.request<{ in_wishlist: boolean }>(`/products/wishlist/${productId}/check`);
  }

  // Addresses API
  async getAddresses() {
    return this.request<Address[]>('/buyer/addresses');
  }

  async createAddress(address: Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
    return this.request<Address>('/buyer/addresses', {
      method: 'POST',
      body: JSON.stringify(address),
    });
  }

  async updateAddress(id: string, address: Partial<Address>) {
    return this.request<Address>(`/buyer/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(address),
    });
  }

  async deleteAddress(id: string) {
    return this.request<{ message: string }>(`/buyer/addresses/${id}`, {
      method: 'DELETE',
    });
  }

  // Reviews API
  async getProductReviews(productId: string, page: number = 1, limit: number = 10) {
    return this.request<PaginatedResponse<ProductReview>>(
      `/products/${productId}/reviews?page=${page}&limit=${limit}`
    );
  }

  async createReview(productId: string, rating: number, comment: string) {
    return this.request<ProductReview>(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment }),
    });
  }

  async updateReview(reviewId: string, rating: number, comment: string) {
    return this.request<ProductReview>(`/products/reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify({ rating, comment }),
    });
  }

  async deleteReview(reviewId: string) {
    return this.request<{ message: string }>(`/products/reviews/${reviewId}`, {
      method: 'DELETE',
    });
  }

  // Health Check
  async healthCheck() {
    return this.request<{ status: string; version: string }>('/health');
  }
}

// Create singleton instance
export const backendApi = new BackendApiClient();

// Export individual API modules for backward compatibility
export const productsApi = {
  async getAll(page: number = 1, limit: number = 50, categoryId?: string) {
    const response = await backendApi.getProducts({
      page,
      limit,
      category_id: categoryId,
    });
    return {
      data: response.data,
      count: response.total,
      totalPages: response.total_pages,
    };
  },

  async getById(id: string) {
    return backendApi.getProduct(id);
  },

  async search(query: string, categoryId?: string) {
    const response = await backendApi.searchProducts(query, {
      category_id: categoryId,
    });
    return response.data;
  },

  async getFeatured(limit: number = 16) {
    return backendApi.getFeaturedProducts(limit);
  },

  async getEcoFriendly(limit: number = 12) {
    return backendApi.getEcoFriendlyProducts(limit);
  },
};

export const categoriesApi = {
  async getAll() {
    return backendApi.getCategories();
  },

  async getById(id: string) {
    return backendApi.getCategory(id);
  },
};

export const ordersApi = {
  async create(order: any, items: any[]) {
    // This will be handled by the createOrder method
    throw new Error('Use backendApi.createOrder() instead');
  },

  async getByUserId(userId: string) {
    const response = await backendApi.getOrders();
    return response.data;
  },

  async updateStatus(id: string, status: string) {
    // This will be handled by the backend
    throw new Error('Order status updates are handled by the backend');
  },
};

export const wishlistApi = {
  async getByUserId(userId: string) {
    return backendApi.getWishlist();
  },

  async add(userId: string, productId: string) {
    return backendApi.addToWishlist(productId);
  },

  async remove(userId: string, productId: string) {
    return backendApi.removeFromWishlist(productId);
  },

  async isInWishlist(userId: string, productId: string) {
    const response = await backendApi.isInWishlist(productId);
    return response.in_wishlist;
  },
};

export const cartApi = {
  getCart() {
    // This should be replaced with backend API calls
    if (typeof window === 'undefined') return [];
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  },

  async addToCart(product: Product, quantity: number = 1) {
    try {
      await backendApi.addToCart(product.id, quantity);
      toast({
        title: 'Added to cart',
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add item to cart.',
        variant: 'destructive',
      });
      throw error;
    }
  },

  async removeFromCart(productId: string) {
    // This should be replaced with backend API calls
    const cart = this.getCart();
    const updatedCart = cart.filter((item: any) => item.product.id !== productId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    return updatedCart;
  },

  async updateQuantity(productId: string, quantity: number) {
    // This should be replaced with backend API calls
    const cart = this.getCart();
    const item = cart.find((item: any) => item.product.id === productId);
    
    if (item) {
      if (quantity <= 0) {
        return this.removeFromCart(productId);
      }
      item.quantity = quantity;
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    return cart;
  },

  clearCart() {
    localStorage.removeItem('cart');
    return [];
  },
};

export default backendApi;
