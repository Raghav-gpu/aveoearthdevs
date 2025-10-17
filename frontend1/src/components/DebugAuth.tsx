import React from 'react';
import { useAuth } from '../contexts/EnhancedAuthContext';
import { testProfileCreation } from '../utils/testProfile';
import { createProfileManually } from '../utils/manualProfileCreation';
import { testDirectDatabaseAccess } from '../utils/directDatabaseTest';
import { testSupabaseConnection } from '../utils/simpleSupabaseTest';

const DebugAuth = () => {
  const { user, userProfile, session, loading, loadUserProfile } = useAuth();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const handleForceLoadProfile = async () => {
    console.log('🔄 Force loading profile...')
    await loadUserProfile()
  }

  const handleTestProfileCreation = async () => {
    if (!user) return;
    console.log('🧪 Testing profile creation...')
    const result = await testProfileCreation(user.id, user.email!)
    console.log('🧪 Test result:', result)
  }

  const handleManualProfileCreation = async () => {
    if (!user) return;
    console.log('🔧 Manual profile creation...')
    const result = await createProfileManually(user.id, user.email!)
    console.log('🔧 Manual creation result:', result)
    if (result.success) {
      // Force reload profile after manual creation
      await loadUserProfile()
    }
  }

  const handleDirectDatabaseTest = async () => {
    console.log('🧪 Direct database test...')
    const result = await testDirectDatabaseAccess()
    console.log('🧪 Direct test result:', result)
  }

  const handleSupabaseConnectionTest = async () => {
    console.log('🔌 Supabase connection test...')
    const result = await testSupabaseConnection()
    console.log('🔌 Connection test result:', result)
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">🔍 Auth Debug</h3>
      <div className="space-y-1">
        <div>Loading: {loading ? '✅' : '❌'}</div>
        <div>User: {user ? '✅' : '❌'}</div>
        <div>UserProfile: {userProfile ? '✅' : '❌'}</div>
        <div>Session: {session ? '✅' : '❌'}</div>
        {user && (
          <div className="mt-2 pt-2 border-t border-white/20">
            <div>Email: {user.email}</div>
            <div>ID: {user.id}</div>
            <div>Name: {userProfile?.name || 'N/A'}</div>
            {!userProfile && (
              <div className="mt-2 space-y-1">
                <button 
                  onClick={handleSupabaseConnectionTest}
                  className="w-full px-2 py-1 bg-orange-600 text-white rounded text-xs hover:bg-orange-700"
                >
                  Test Supabase
                </button>
                <button 
                  onClick={handleDirectDatabaseTest}
                  className="w-full px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                >
                  Direct DB Test
                </button>
                <button 
                  onClick={handleForceLoadProfile}
                  className="w-full px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                >
                  Force Load Profile
                </button>
                <button 
                  onClick={handleTestProfileCreation}
                  className="w-full px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                >
                  Test Profile Creation
                </button>
                <button 
                  onClick={handleManualProfileCreation}
                  className="w-full px-2 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700"
                >
                  Manual Profile Creation
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DebugAuth;
