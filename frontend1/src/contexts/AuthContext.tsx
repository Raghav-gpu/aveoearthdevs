import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

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
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, name: string, role?: string) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signInWithGoogle: () => Promise<{ error: AuthError | null }>
  signInWithFacebook: () => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: AuthError | null }>
  loadUserProfile: () => Promise<void>
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
      
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('❌ Error loading user profile:', error)
        console.error('❌ Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        })
        
        // If profile doesn't exist, try to create it
        if (error.code === 'PGRST116') {
          console.log('📝 Profile not found, creating new profile...')
          await createOrUpdateUserProfile(user)
        } else {
          // For other errors, try to create profile anyway
          console.log('📝 Error loading profile, attempting to create...')
          await createOrUpdateUserProfile(user)
        }
        setProfileLoading(false)
        return
      }

      console.log('✅ User profile loaded successfully:', profile)
      setUserProfile(profile)
      setProfileLoading(false)
    } catch (error) {
      console.error('❌ Error loading user profile:', error)
      console.error('❌ Error details:', error)
      
      // Try to create profile as fallback
      try {
        console.log('📝 Fallback: attempting to create profile...')
        await createOrUpdateUserProfile(user)
      } catch (createError) {
        console.error('❌ Failed to create profile as fallback:', createError)
        console.error('❌ Create error details:', createError)
      }
      setProfileLoading(false)
    }
  }, [user])

  const createOrUpdateUserProfile = async (user: User) => {
    try {
      console.log('🔄 Creating/updating user profile for:', user.email, 'ID:', user.id)
      
      // First, try to get existing user
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('❌ Error fetching existing user:', fetchError)
        // Continue to try creating profile anyway
      }

      if (!existingUser) {
        console.log('📝 Creating new user profile...')
        
        // Prepare user data
        const userData = {
          id: user.id,
          name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          email: user.email!,
          role: 'buyer' // Default role
        }
        
        console.log('📝 User data to insert:', userData)
        
        // Create new user profile
        const { data: newProfile, error: insertError } = await supabase
          .from('users')
          .insert(userData)
          .select()
          .single()

        if (insertError) {
          console.error('❌ Error creating user profile:', insertError)
          console.error('❌ Insert error details:', {
            code: insertError.code,
            message: insertError.message,
            details: insertError.details,
            hint: insertError.hint
          })
          return
        }

        if (newProfile) {
          console.log('✅ User profile created successfully:', newProfile)
          setUserProfile(newProfile)
        }
      } else {
        console.log('✅ Existing user profile found:', existingUser)
        setUserProfile(existingUser)
      }
    } catch (error) {
      console.error('❌ Error creating/updating user profile:', error)
      console.error('❌ Error details:', error)
    } finally {
      setProfileLoading(false)
    }
  }

  const signUp = async (email: string, password: string, name: string, role: string = 'buyer') => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
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
    await supabase.auth.signOut()
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!user) throw new Error('No user logged in')

      console.log('🔄 Updating profile for user:', user.id, 'Updates:', updates)

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
        console.error('❌ Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        })
        return { error }
      }

      if (data) {
        console.log('✅ Profile updated successfully:', data)
        setUserProfile(data)
      }

      return { error: null }
    } catch (error) {
      console.error('❌ Exception updating profile:', error)
      return { error: error as AuthError }
    }
  }


  const value = {
    user,
    userProfile,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithFacebook,
    signOut,
    updateProfile,
    loadUserProfile
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
