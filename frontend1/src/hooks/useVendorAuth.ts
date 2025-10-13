import { useState, useEffect } from 'react'

interface VendorSession {
  email: string
  businessName: string
  loginTime: string
}

export const useVendorAuth = () => {
  const [vendor, setVendor] = useState<VendorSession | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkVendorSession = () => {
      try {
        const session = localStorage.getItem('vendorSession')
        if (session) {
          const vendorData = JSON.parse(session)
          setVendor(vendorData)
        }
      } catch (error) {
        console.error('Error checking vendor session:', error)
      } finally {
        setLoading(false)
      }
    }

    checkVendorSession()
  }, [])

  const signOut = () => {
    localStorage.removeItem('vendorSession')
    setVendor(null)
    window.location.href = '/vendor'
  }

  const isAuthenticated = () => {
    return !!vendor
  }

  return {
    vendor,
    loading,
    signOut,
    isAuthenticated
  }
}



