import { useState, useEffect } from 'react'
import { cartApi } from '../services/api'
import { Product } from '../lib/supabase'
import { useToast } from './use-toast'

export interface CartItem {
  product: Product
  quantity: number
}

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const loadCart = () => {
      try {
        const cartData = cartApi.getCart()
        setCart(cartData)
      } catch (error) {
        console.error('Error loading cart:', error)
        setCart([])
      } finally {
        setLoading(false)
      }
    }

    loadCart()

    // Listen for storage changes (for cross-tab sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cart') {
        loadCart()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const addToCart = (product: Product, quantity: number = 1) => {
    try {
      const updatedCart = cartApi.addToCart(product, quantity)
      setCart(updatedCart)
      toast({
        title: "Added to cart successfully!",
        description: `${product.name} has been added to your cart.`,
        duration: 3000,
      })
      return updatedCart
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      })
      return cart
    }
  }

  const removeFromCart = (productId: string) => {
    try {
      const updatedCart = cartApi.removeFromCart(productId)
      setCart(updatedCart)
      return updatedCart
    } catch (error) {
      console.error('Error removing from cart:', error)
      return cart
    }
  }

  const updateQuantity = (productId: string, quantity: number) => {
    try {
      const updatedCart = cartApi.updateQuantity(productId, quantity)
      setCart(updatedCart)
      return updatedCart
    } catch (error) {
      console.error('Error updating quantity:', error)
      return cart
    }
  }

  const clearCart = () => {
    try {
      const updatedCart = cartApi.clearCart()
      setCart(updatedCart)
      return updatedCart
    } catch (error) {
      console.error('Error clearing cart:', error)
      return cart
    }
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const price = item.product.price * (1 - item.product.discount / 100)
      return total + (price * item.quantity)
    }, 0)
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const isInCart = (productId: string) => {
    return cart.some(item => item.product.id === productId)
  }

  const getItemQuantity = (productId: string) => {
    const item = cart.find(item => item.product.id === productId)
    return item ? item.quantity : 0
  }

  return {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    isInCart,
    getItemQuantity
  }
}
