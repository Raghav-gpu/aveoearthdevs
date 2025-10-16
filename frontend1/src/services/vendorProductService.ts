import { supabase } from '@/lib/supabase';
import { mockVendorProductService } from './mockVendorServices';

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  sku: string;
  price: number;
  compare_price?: number;
  cost_price?: number;
  stock_quantity: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  attributes: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface VendorProduct {
  id: string;
  vendor_id: string;
  name: string;
  description: string;
  short_description?: string;
  category_id: string;
  subcategory_id?: string;
  brand?: string;
  sku: string;
  price: number;
  compare_price?: number;
  cost_price?: number;
  stock_quantity: number;
  min_stock_quantity: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  images: string[];
  tags: string[];
  is_active: boolean;
  is_featured: boolean;
  is_digital: boolean;
  requires_shipping: boolean;
  taxable: boolean;
  tax_rate?: number;
  seo_title?: string;
  seo_description?: string;
  meta_keywords?: string[];
  sustainability_rating: number;
  eco_friendly_features: string[];
  certifications: string[];
  materials: string[];
  manufacturing_location?: string;
  packaging_type: string;
  return_policy_days: number;
  warranty_period_days?: number;
  shipping_class?: string;
  handling_time_days: number;
  variants: ProductVariant[];
  created_at: string;
  updated_at: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
}

export const vendorProductService = {
  async getProducts(vendorId: string, filters?: {
    category?: string;
    status?: 'active' | 'inactive' | 'draft';
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ products: VendorProduct[]; total: number }> {
    return await mockVendorProductService.getProducts(vendorId, filters);
  },

  async getProduct(productId: string): Promise<VendorProduct | null> {
    return await mockVendorProductService.getProduct(productId);
  },

  async createProduct(product: Partial<VendorProduct>): Promise<VendorProduct | null> {
    return await mockVendorProductService.createProduct(product);
  },

  async updateProduct(productId: string, updates: Partial<VendorProduct>): Promise<VendorProduct | null> {
    return await mockVendorProductService.updateProduct(productId, updates);
  },

  async deleteProduct(productId: string): Promise<boolean> {
    return await mockVendorProductService.deleteProduct(productId);
  },

  async uploadProductImage(productId: string, file: File, imageIndex: number): Promise<string | null> {
    return await mockVendorProductService.uploadProductImage(productId, file, imageIndex);
  },

  async getCategories(): Promise<ProductCategory[]> {
    return await mockVendorProductService.getCategories();
  },

  async updateStock(productId: string, quantity: number): Promise<boolean> {
    return await mockVendorProductService.updateStock(productId, quantity);
  },

  async toggleProductStatus(productId: string, isActive: boolean): Promise<boolean> {
    return await mockVendorProductService.toggleProductStatus(productId, isActive);
  }
};
