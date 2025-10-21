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
  async getAll(page: number = 1, limit: number = 50, categoryId?: string) {
    console.log('🔍 Fetching products from Supabase...', { page, limit, categoryId });
    
    try {
      let query = supabase
        .from('products')
        .select(`
          id,
          name,
          price,
          image_url,
          discount,
          sustainability_score,
          stock,
          category_id,
          categories(name),
          brand,
          short_description,
          status,
          approval_status
        `, { count: 'exact' })
        .eq('status', 'active')
        .eq('approval_status', 'approved');

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (error) {
        console.error('❌ Supabase query error:', error);
        throw error;
      }

      console.log('✅ Found', data?.length || 0, 'products from Supabase');
      
      return {
        data: data || [],
        count: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      };
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      // Return empty data instead of mock data
      return {
        data: [],
        count: 0,
        totalPages: 0
      };
    }
  },

  // Mock products for fallback
  getMockProducts(page: number = 1, limit: number = 12) {
    const mockProducts = [
      {
        id: 'mock-1',
        name: 'Bamboo Kitchen Utensil Set',
        price: 1299,
        discount: 32,
        image_url: '/api/placeholder/400/400',
        sustainability_score: 95,
        stock: 75,
        categories: { name: 'Home & Living' }
      },
      {
        id: 'mock-2',
        name: 'Organic Cotton Bath Towel',
        price: 999,
        discount: 10,
        image_url: '/api/placeholder/400/400',
        sustainability_score: 90,
        stock: 80,
        categories: { name: 'Home & Living' }
      },
      {
        id: 'mock-3',
        name: 'Beeswax Food Wraps Set',
        price: 1299,
        discount: 20,
        image_url: '/api/placeholder/400/400',
        sustainability_score: 96,
        stock: 80,
        categories: { name: 'Home & Living' }
      },
      {
        id: 'mock-4',
        name: 'Natural Jute Area Rug',
        price: 2999,
        discount: 20,
        image_url: '/api/placeholder/400/400',
        sustainability_score: 85,
        stock: 30,
        categories: { name: 'Home & Living' }
      },
      {
        id: 'mock-5',
        name: 'Eco-Friendly Dish Soap Refill',
        price: 349,
        discount: 5,
        image_url: '/api/placeholder/400/400',
        sustainability_score: 92,
        stock: 200,
        categories: { name: 'Home & Living' }
      },
      {
        id: 'mock-6',
        name: 'Bamboo Water Bottle',
        price: 1299,
        discount: 19,
        image_url: '/api/placeholder/400/400',
        sustainability_score: 95,
        stock: 50,
        categories: { name: 'Home & Living' }
      },
      {
        id: 'mock-7',
        name: 'Organic Cotton T-Shirt',
        price: 899,
        discount: 31,
        image_url: '/api/placeholder/400/400',
        sustainability_score: 89,
        stock: 120,
        categories: { name: 'Sustainable Fashion' }
      },
      {
        id: 'mock-8',
        name: 'Linen Trousers - Earth Dye',
        price: 1899,
        discount: 24,
        image_url: '/api/placeholder/400/400',
        sustainability_score: 89,
        stock: 60,
        categories: { name: 'Sustainable Fashion' }
      }
    ];

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = mockProducts.slice(startIndex, endIndex);

    return {
      data: paginatedProducts,
      count: mockProducts.length,
      totalPages: Math.ceil(mockProducts.length / limit)
    };
  },

  getMockEcoProducts(limit: number = 12) {
    const mockEcoProducts = [
      {
        id: 'eco-1',
        name: 'Solar-Powered Bluetooth Speaker',
        price: 4299,
        discount: 28,
        image_url: '/api/placeholder/400/400',
        sustainability_score: 96,
        stock: 45,
        categories: { name: 'Electronics' },
        badges: ['Solar Powered', 'Recycled Materials'],
        carbonSaved: '2.3kg',
        ecoScore: '96%'
      },
      {
        id: 'eco-2',
        name: 'Organic Bamboo Bed Sheets',
        price: 3499,
        discount: 30,
        image_url: '/api/placeholder/400/400',
        sustainability_score: 94,
        stock: 60,
        categories: { name: 'Home & Living' },
        badges: ['GOTS Certified', 'Bamboo Fiber'],
        carbonSaved: '1.8kg',
        ecoScore: '94%'
      },
      {
        id: 'eco-3',
        name: 'Refillable Glass Water Bottle',
        price: 1899,
        discount: 24,
        image_url: '/api/placeholder/400/400',
        sustainability_score: 98,
        stock: 80,
        categories: { name: 'Home & Living' },
        badges: ['Zero Plastic', 'Lifetime Refills'],
        carbonSaved: '0.9kg',
        ecoScore: '98%'
      },
      {
        id: 'eco-4',
        name: 'Compostable Phone Case',
        price: 1299,
        discount: 28,
        image_url: '/api/placeholder/400/400',
        sustainability_score: 92,
        stock: 70,
        categories: { name: 'Electronics' },
        badges: ['Compostable', 'Plant-Based'],
        carbonSaved: '0.3kg',
        ecoScore: '92%'
      },
      {
        id: 'eco-5',
        name: 'Hemp Yoga Mat',
        price: 2499,
        discount: 20,
        image_url: '/api/placeholder/400/400',
        sustainability_score: 95,
        stock: 40,
        categories: { name: 'Fitness' },
        badges: ['Hemp Fiber', 'Non-Toxic'],
        carbonSaved: '1.2kg',
        ecoScore: '95%'
      },
      {
        id: 'eco-6',
        name: 'Bamboo Toothbrush Set',
        price: 599,
        discount: 25,
        image_url: '/api/placeholder/400/400',
        sustainability_score: 97,
        stock: 150,
        categories: { name: 'Personal Care' },
        badges: ['Biodegradable', 'BPA-Free'],
        carbonSaved: '0.1kg',
        ecoScore: '97%'
      },
      {
        id: 'eco-7',
        name: 'Organic Cotton Tote Bag',
        price: 799,
        discount: 15,
        image_url: '/api/placeholder/400/400',
        sustainability_score: 91,
        stock: 100,
        categories: { name: 'Accessories' },
        badges: ['Organic Cotton', 'Fair Trade'],
        carbonSaved: '0.5kg',
        ecoScore: '91%'
      },
      {
        id: 'eco-8',
        name: 'Recycled Plastic Sunglasses',
        price: 1999,
        discount: 33,
        image_url: '/api/placeholder/400/400',
        sustainability_score: 88,
        stock: 55,
        categories: { name: 'Accessories' },
        badges: ['Recycled Ocean Plastic', 'UV Protection'],
        carbonSaved: '0.8kg',
        ecoScore: '88%'
      },
      {
        id: 'eco-9',
        name: 'Natural Loofah Sponge',
        price: 399,
        discount: 20,
        image_url: '/api/placeholder/400/400',
        sustainability_score: 99,
        stock: 200,
        categories: { name: 'Personal Care' },
        badges: ['100% Natural', 'Compostable'],
        carbonSaved: '0.2kg',
        ecoScore: '99%'
      },
      {
        id: 'eco-10',
        name: 'Bamboo Cutlery Set',
        price: 899,
        discount: 22,
        image_url: '/api/placeholder/400/400',
        sustainability_score: 93,
        stock: 90,
        categories: { name: 'Home & Living' },
        badges: ['Bamboo', 'Travel Friendly'],
        carbonSaved: '0.4kg',
        ecoScore: '93%'
      },
      {
        id: 'eco-11',
        name: 'Organic Tea Infuser',
        price: 699,
        discount: 18,
        image_url: '/api/placeholder/400/400',
        sustainability_score: 90,
        stock: 75,
        categories: { name: 'Home & Living' },
        badges: ['Stainless Steel', 'Organic'],
        carbonSaved: '0.3kg',
        ecoScore: '90%'
      },
      {
        id: 'eco-12',
        name: 'Cork Yoga Block',
        price: 1299,
        discount: 26,
        image_url: '/api/placeholder/400/400',
        sustainability_score: 89,
        stock: 65,
        categories: { name: 'Fitness' },
        badges: ['Cork', 'Sustainable Harvest'],
        carbonSaved: '0.6kg',
        ecoScore: '89%'
      }
    ];

    return mockEcoProducts.slice(0, limit);
  },

  // Get single product
  async getById(id: string) {
    console.log('🔍 Fetching single product from database:', id);
    
    try {
      // Use direct fetch API for single product
      const response = await fetch(`https://ylhvdwizcsoelpreftpy.supabase.co/rest/v1/products?select=*&id=eq.${id}`, {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsaHZkd2l6Y3NvZWxwcmVmdHB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MzI0NTgsImV4cCI6MjA3NTQwODQ1OH0.HXGPUBXQQJb5Ae7RF3kPG2HCmnSbz1orLrbjZlMeb9g',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsaHZkd2l6Y3NvZWxwcmVmdHB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MzI0NTgsImV4cCI6MjA3NTQwODQ1OH0.HXGPUBXQQJb5Ae7RF3kPG2HCmnSbz1orLrbjZlMeb9g',
          'Content-Type': 'application/json'
        },
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      if (!response.ok) {
        console.error('❌ Single product fetch failed:', response.status, response.statusText);
        console.log('📦 Falling back to mock product');
        return this.getMockProductById(id);
      }

      const data = await response.json();
      console.log('🔍 Single product fetch result:', { dataLength: data?.length, sampleData: data?.[0] });

      if (!data || data.length === 0) {
        console.log('📦 No product found, using mock product');
        return this.getMockProductById(id);
      }

      const product = data[0];
      console.log('✅ Found product in database:', product?.name);
      
      // Add missing fields with defaults
      const productWithDefaults = {
        ...product,
        discount: product.discount || 0,
        sustainability_score: product.sustainability_score || 85,
        stock: product.stock || 100,
        category_id: product.category_id || '1',
        categories: { name: 'Sustainable Living', description: 'Eco-friendly products' },
        badges: ['Eco-Friendly', 'Sustainable', 'Organic']
      };
      
      return productWithDefaults;
    } catch (error) {
      console.error('❌ Single product fetch error:', error);
      console.log('📦 Falling back to mock product');
      return this.getMockProductById(id);
    }
  },

  // Mock single product for fallback
  getMockProductById(id: string) {
    const mockProducts = this.getMockProducts(1, 100).data;
    const product = mockProducts.find(p => p.id === id);
    
    if (product) {
      return {
        ...product,
        description: `This is a sustainable ${product.name.toLowerCase()} that helps reduce environmental impact. Made from eco-friendly materials and designed for long-lasting use.`,
        badges: ['Eco-Friendly', 'Sustainable', 'Organic'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        categories: {
          name: product.categories.name,
          description: `Sustainable ${product.categories.name.toLowerCase()} products`
        }
      };
    }
    
    // Default mock product if not found
    return {
      id: id,
      name: 'Sustainable Product',
      description: 'An eco-friendly product designed for sustainability.',
      price: 999,
      discount: 10,
      image_url: '/api/placeholder/600/600',
      sustainability_score: 85,
      stock: 50,
      badges: ['Eco-Friendly', 'Sustainable'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      categories: {
        name: 'Sustainable Living',
        description: 'Products for sustainable living'
      }
    };
  },

  // Search products
  async search(query: string, categoryId?: string) {
    console.log('🔍 Searching products in Supabase:', { query, categoryId });
    
    try {
      let queryBuilder = supabase
        .from('products')
        .select(`
          id,
          name,
          price,
          image_url,
          discount,
          sustainability_score,
          stock,
          category_id,
          categories(name),
          brand,
          short_description,
          status,
          approval_status
        `)
        .eq('status', 'active')
        .eq('approval_status', 'approved')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,short_description.ilike.%${query}%`);

      if (categoryId) {
        queryBuilder = queryBuilder.eq('category_id', categoryId);
      }

      const { data, error } = await queryBuilder
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('❌ Search query error:', error);
        throw error;
      }

      console.log('✅ Search results:', { dataLength: data?.length || 0, query });
      return data || [];
    } catch (error) {
      console.error('❌ Search error:', error);
      return [];
    }
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
  async getFeatured(limit: number = 16) {
    console.log('🔍 Fetching featured products from Supabase:', limit);
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          price,
          image_url,
          discount,
          sustainability_score,
          stock,
          category_id,
          categories(name),
          brand,
          short_description,
          status,
          approval_status
        `)
        .eq('status', 'active')
        .eq('approval_status', 'approved')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('❌ Featured products query error:', error);
        throw error;
      }

      console.log('✅ Found', data?.length || 0, 'featured products from Supabase');
      return data || [];
    } catch (error) {
      console.error('❌ Error fetching featured products:', error);
      return [];
    }
  },

  // Get eco-friendly products (high sustainability score)
  async getEcoFriendly(limit: number = 12) {
    console.log('🌱 Fetching eco-friendly products from Supabase:', limit);
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          price,
          image_url,
          discount,
          sustainability_score,
          stock,
          category_id,
          categories(name),
          brand,
          short_description,
          status,
          approval_status
        `)
        .eq('status', 'active')
        .eq('approval_status', 'approved')
        .gte('sustainability_score', 80)
        .order('sustainability_score', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('❌ Eco-friendly products query error:', error);
        throw error;
      }

      console.log('✅ Found', data?.length || 0, 'eco-friendly products from Supabase');
      return data || [];
    } catch (error) {
      console.error('❌ Error fetching eco-friendly products:', error);
      return [];
    }
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
    try {
      console.log('🔄 Fetching wishlist for user:', userId)
      
      const { data, error } = await supabase
        .from('wishlist')
        .select(`
          *,
          products(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Error fetching wishlist:', error)
        throw error
      }
      
      console.log('✅ Wishlist fetched successfully:', data?.length || 0, 'items')
      return data || []
    } catch (error) {
      console.error('❌ Wishlist fetch failed:', error)
      throw error
    }
  },

  async add(userId: string, productId: string) {
    try {
      console.log('🔄 Adding to wishlist:', { userId, productId })
      
      // First check if item already exists in wishlist
      const { data: existingItem, error: checkError } = await supabase
        .from('wishlist')
        .select('id')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('❌ Error checking existing wishlist item:', checkError)
        throw checkError
      }

      if (existingItem) {
        console.log('⚠️ Item already in wishlist, skipping add')
        return existingItem
      }
      
      const { data, error } = await supabase
        .from('wishlist')
        .insert({ user_id: userId, product_id: productId })
        .select()
        .single()

      if (error) {
        console.error('❌ Error adding to wishlist:', error)
        throw error
      }
      
      console.log('✅ Added to wishlist successfully:', data)
      return data
    } catch (error) {
      console.error('❌ Add to wishlist failed:', error)
      throw error
    }
  },

  async remove(userId: string, productId: string) {
    try {
      console.log('🔄 Removing from wishlist:', { userId, productId })
      
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId)

      if (error) {
        console.error('❌ Error removing from wishlist:', error)
        throw error
      }
      
      console.log('✅ Removed from wishlist successfully')
    } catch (error) {
      console.error('❌ Remove from wishlist failed:', error)
      throw error
    }
  },

  async isInWishlist(userId: string, productId: string) {
    try {
      console.log('🔄 Checking if in wishlist:', { userId, productId })
      
      const { data, error } = await supabase
        .from('wishlist')
        .select('id')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Error checking wishlist status:', error)
        throw error
      }
      
      const isInWishlist = !!data
      console.log('✅ Wishlist check result:', isInWishlist)
      return isInWishlist
    } catch (error) {
      console.error('❌ Wishlist check failed:', error)
      throw error
    }
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
