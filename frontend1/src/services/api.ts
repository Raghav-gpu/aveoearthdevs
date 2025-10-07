import { supabase } from '../lib/supabase'
import { Database } from '../lib/supabase'

type Product = Database['public']['Tables']['products']['Row']
type ProductInsert = Database['public']['Tables']['products']['Insert']
type ProductUpdate = Database['public']['Tables']['products']['Update']

type Category = Database['public']['Tables']['categories']['Row']
type CategoryInsert = Database['public']['Tables']['categories']['Insert']

type Order = Database['public']['Tables']['orders']['Row']
type OrderInsert = Database['public']['Tables']['orders']['Insert']

type OrderItem = Database['public']['Tables']['order_items']['Row']
type OrderItemInsert = Database['public']['Tables']['order_items']['Insert']

type Review = Database['public']['Tables']['reviews']['Row']
type ReviewInsert = Database['public']['Tables']['reviews']['Insert']

type WishlistItem = Database['public']['Tables']['wishlist']['Row']
type WishlistItemInsert = Database['public']['Tables']['wishlist']['Insert']

// Products API
export const productsApi = {
  // Get all products with pagination
  async getAll(page: number = 1, limit: number = 12, categoryId?: string) {
    let query = supabase
      .from('products')
      .select(`
        id,
        name,
        price,
        discount,
        image_url,
        sustainability_score,
        stock,
        categories(name)
      `, { count: 'exact' })
      .order('sustainability_score', { ascending: false })

    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await query
      .range(from, to)
      .limit(limit)

    if (error) throw error

    return {
      data: data || [],
      count: count || 0,
      totalPages: Math.ceil((count || 0) / limit)
    }
  },

  // Get single product
  async getById(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories(name, description),
        reviews(rating, comment, created_at, users(name))
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Search products
  async search(query: string, categoryId?: string) {
    let supabaseQuery = supabase
      .from('products')
      .select(`
        *,
        categories(name, description)
      `)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)

    if (categoryId) {
      supabaseQuery = supabaseQuery.eq('category_id', categoryId)
    }

    const { data, error } = await supabaseQuery.order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Create product (admin only)
  async create(product: ProductInsert) {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update product (admin only)
  async update(id: string, updates: ProductUpdate) {
    const { data, error } = await supabase
      .from('products')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete product (admin only)
  async delete(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Get featured products
  async getFeatured(limit: number = 8) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        price,
        discount,
        image_url,
        sustainability_score,
        stock,
        categories(name)
      `)
      .order('sustainability_score', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  }
}

// Categories API
export const categoriesApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (error) throw error
    return data || []
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async create(category: CategoryInsert) {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

// Orders API
export const ordersApi = {
  async create(order: OrderInsert, items: OrderItemInsert[]) {
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single()

    if (orderError) throw orderError

    const orderItems = items.map(item => ({
      ...item,
      order_id: orderData.id
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) throw itemsError

    return orderData
  },

  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          products(name, image_url)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async updateStatus(id: string, status: Order['status']) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

// Reviews API
export const reviewsApi = {
  async getByProductId(productId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        users(name)
      `)
      .eq('product_id', productId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async create(review: ReviewInsert) {
    const { data, error } = await supabase
      .from('reviews')
      .insert(review)
      .select(`
        *,
        users(name)
      `)
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<ReviewInsert>) {
    const { data, error } = await supabase
      .from('reviews')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        users(name)
      `)
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// Wishlist API
export const wishlistApi = {
  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from('wishlist')
      .select(`
        *,
        products(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async add(userId: string, productId: string) {
    const { data, error } = await supabase
      .from('wishlist')
      .insert({ user_id: userId, product_id: productId })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async remove(userId: string, productId: string) {
    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId)

    if (error) throw error
  },

  async isInWishlist(userId: string, productId: string) {
    const { data, error } = await supabase
      .from('wishlist')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return !!data
  }
}

// Cart API (using localStorage for now, can be moved to database later)
export const cartApi = {
  getCart() {
    if (typeof window === 'undefined') return []
    const cart = localStorage.getItem('cart')
    return cart ? JSON.parse(cart) : []
  },

  addToCart(product: Product, quantity: number = 1) {
    const cart = this.getCart()
    const existingItem = cart.find((item: any) => item.product.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.push({ product, quantity })
    }
    
    localStorage.setItem('cart', JSON.stringify(cart))
    return cart
  },

  removeFromCart(productId: string) {
    const cart = this.getCart()
    const updatedCart = cart.filter((item: any) => item.product.id !== productId)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    return updatedCart
  },

  updateQuantity(productId: string, quantity: number) {
    const cart = this.getCart()
    const item = cart.find((item: any) => item.product.id === productId)
    
    if (item) {
      if (quantity <= 0) {
        return this.removeFromCart(productId)
      }
      item.quantity = quantity
    }
    
    localStorage.setItem('cart', JSON.stringify(cart))
    return cart
  },

  clearCart() {
    localStorage.removeItem('cart')
    return []
  }
}
