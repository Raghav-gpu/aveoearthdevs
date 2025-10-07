import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { wishlistApi } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

export const useWishlist = () => {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['wishlist', user?.id],
    queryFn: () => wishlistApi.getByUserId(user!.id),
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useAddToWishlist = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  
  return useMutation({
    mutationFn: (productId: string) => wishlistApi.add(user!.id, productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', user?.id] })
    },
  })
}

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  
  return useMutation({
    mutationFn: (productId: string) => wishlistApi.remove(user!.id, productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', user?.id] })
    },
  })
}

export const useIsInWishlist = (productId: string) => {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['wishlist', 'check', user?.id, productId],
    queryFn: () => wishlistApi.isInWishlist(user!.id, productId),
    enabled: !!user && !!productId,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}
