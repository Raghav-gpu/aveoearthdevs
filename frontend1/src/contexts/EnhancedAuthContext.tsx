import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { backendApi, UserProfile as BackendUserProfile } from '../services/backendApi'

interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  alternate_address?: string
  bio?: string
  avatar_url?: string
  is_active?: boolean
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  session: Session | null
  loading: boolean
  isBackendConnected: boolean
  signUp: (email: string, password: string, name: string, role?: string, phone?: string) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signInWithGoogle: () => Promise<{ error: AuthError | null }>
  signInWithFacebook: () => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: AuthError | null }>
  loadUserProfile: () => Promise<void>
  refreshToken: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)
  const [isBackendConnected, setIsBackendConnected] = useState(false)

  // Check backend connectivity
  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        await backendApi.healthCheck()
        setIsBackendConnected(true)
        console.log('✅ Backend API connected')
      } catch (error) {
        setIsBackendConnected(false)
        console.log('⚠️ Backend API not available, using Supabase fallback')
      }
    }
    checkBackendConnection()
  }, [])

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state change:', event, session?.user?.email)
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)

      // If user signs in, create or update user profile
      if (event === 'SIGNED_IN' && session?.user) {
        await createOrUpdateUserProfile(session.user)
      }
      
      // If user signs out, clear profile
      if (event === 'SIGNED_OUT') {
        setUserProfile(null)
        setProfileLoading(false)
        backendApi.setToken(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Load profile when user changes
  useEffect(() => {
    if (user && !userProfile && !profileLoading) {
      console.log('🔄 User changed, loading profile...')
      loadUserProfile()
    }
  }, [user])

  const loadUserProfile = useCallback(async () => {
    try {
      if (!user) {
        console.log('⚠️ No user found, skipping profile load')
        setUserProfile(null)
        setProfileLoading(false)
        return
      }

      if (profileLoading) {
        console.log('⚠️ Profile already loading, skipping duplicate request')
        return
      }

      setProfileLoading(true)
      console.log('🔄 Loading user profile for:', user.email, 'ID:', user.id)
      
      // Try backend API first if connected
      if (isBackendConnected) {
        try {
          const profile = await backendApi.getProfile()
          console.log('✅ User profile loaded from backend:', profile)
          setUserProfile(profile as UserProfile)
          setProfileLoading(false)
          return
        } catch (error) {
          console.log('⚠️ Backend profile load failed, falling back to Supabase:', error)
        }
      }

      // Fallback to Supabase
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('❌ Error loading user profile:', error)
        
        // If profile doesn't exist, try to create it
        if (error.code === 'PGRST116') {
          console.log('📝 Profile not found, creating new profile...')
          await createOrUpdateUserProfile(user)
        } else {
          console.log('📝 Error loading profile, attempting to create...')
          await createOrUpdateUserProfile(user)
        }
        setProfileLoading(false)
        return
      }

      console.log('✅ User profile loaded successfully from Supabase:', profile)
      setUserProfile(profile)
      setProfileLoading(false)
    } catch (error) {
      console.error('❌ Error loading user profile:', error)
      
      // Try to create profile as fallback
      try {
        console.log('📝 Fallback: attempting to create profile...')
        await createOrUpdateUserProfile(user)
      } catch (createError) {
        console.error('❌ Failed to create profile as fallback:', createError)
      }
      setProfileLoading(false)
    }
  }, [user, isBackendConnected])

  const createOrUpdateUserProfile = async (user: User) => {
    try {
      console.log('🔄 Creating/updating user profile for:', user.email, 'ID:', user.id)
      
      // Try backend API first if connected
      if (isBackendConnected) {
        try {
          // Check if user exists in backend
          const existingProfile = await backendApi.getProfile()
          console.log('✅ User profile exists in backend:', existingProfile)
          setUserProfile(existingProfile as UserProfile)
          setProfileLoading(false)
          return
        } catch (error) {
          console.log('⚠️ User not found in backend, creating new profile...')
          
          // Create new user in backend
          const userData = {
            name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            email: user.email!,
            phone: user.user_metadata?.phone || user.phone,
            role: 'buyer' as const
          }
          
          const newProfile = await backendApi.signup(userData.email, 'temp_password', userData.name, userData.phone)
          console.log('✅ User profile created in backend:', newProfile)
          setUserProfile(newProfile.user as UserProfile)
          setProfileLoading(false)
          return
        }
      }

      // Fallback to Supabase
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('❌ Error fetching existing user:', fetchError)
      }

      if (!existingUser) {
        console.log('📝 Creating new user profile in Supabase...')
        
        const userData = {
          id: user.id,
          name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          email: user.email!,
          role: 'buyer'
        }
        
        const { data: newProfile, error: insertError } = await supabase
          .from('users')
          .insert(userData)
          .select()
          .single()

        if (insertError) {
          console.error('❌ Error creating user profile:', insertError)
          return
        }

        if (newProfile) {
          console.log('✅ User profile created successfully in Supabase:', newProfile)
          setUserProfile(newProfile)
        }
      } else {
        console.log('✅ Existing user profile found in Supabase:', existingUser)
        setUserProfile(existingUser)
      }
    } catch (error) {
      console.error('❌ Error creating/updating user profile:', error)
    } finally {
      setProfileLoading(false)
    }
  }

  const signUp = async (email: string, password: string, name: string, role: string = 'buyer', phone?: string) => {
    try {
      // Try backend API first if connected
      if (isBackendConnected) {
        try {
          const response = await backendApi.signup(email, password, name, phone)
          console.log('✅ User signed up via backend:', response)
          backendApi.setToken(response.access_token)
          return { error: null }
        } catch (error) {
          console.log('⚠️ Backend signup failed, falling back to Supabase:', error)
        }
      }

      // Fallback to Supabase
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            phone
          }
        }
      })
      return { error }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      // Try backend API first if connected
      if (isBackendConnected) {
        try {
          const response = await backendApi.login(email, password)
          console.log('✅ User signed in via backend:', response)
          setUserProfile(response.user as UserProfile)
          return { error: null }
        } catch (error) {
          console.log('⚠️ Backend signin failed, falling back to Supabase:', error)
        }
      }

      // Fallback to Supabase
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      return { error }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      })
      return { error }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  const signInWithFacebook = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      })
      return { error }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  const signOut = async () => {
    if (isBackendConnected) {
      await backendApi.logout()
    }
    await supabase.auth.signOut()
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!user) throw new Error('No user logged in')

      console.log('🔄 Updating profile for user:', user.id, 'Updates:', updates)

      // Try backend API first if connected
      if (isBackendConnected) {
        try {
          const updatedProfile = await backendApi.updateProfile(updates)
          console.log('✅ Profile updated via backend:', updatedProfile)
          setUserProfile(updatedProfile as UserProfile)
          return { error: null }
        } catch (error) {
          console.log('⚠️ Backend profile update failed, falling back to Supabase:', error)
        }
      }

      // Fallback to Supabase
      const { data, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single()

      if (error) {
        console.error('❌ Error updating profile:', error)
        return { error }
      }

      if (data) {
        console.log('✅ Profile updated successfully in Supabase:', data)
        setUserProfile(data)
      }

      return { error: null }
    } catch (error) {
      console.error('❌ Exception updating profile:', error)
      return { error: error as AuthError }
    }
  }

  const refreshToken = async () => {
    try {
      if (isBackendConnected && user) {
        // Backend handles token refresh automatically
        console.log('🔄 Token refresh handled by backend')
      } else {
        // Supabase handles token refresh automatically
        console.log('🔄 Token refresh handled by Supabase')
      }
    } catch (error) {
      console.error('❌ Error refreshing token:', error)
    }
  }

  const value = {
    user,
    userProfile,
    session,
    loading,
    isBackendConnected,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithFacebook,
    signOut,
    updateProfile,
    loadUserProfile,
    refreshToken
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
