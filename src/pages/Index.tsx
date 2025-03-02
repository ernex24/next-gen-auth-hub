import React, { useState, useEffect } from 'react';
import AuthLayout from '@/components/AuthLayout';
import SignupForm from '@/components/SignupForm';
import LoginForm from '@/components/LoginForm';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from '@/integrations/supabase/auth';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const { user, loading } = useAuth();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const toggleForm = () => {
    setIsSignup(!isSignup);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-auth-dark">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-auth-dark p-6">
        <div className="bg-auth-input bg-opacity-20 p-8 rounded-lg max-w-md w-full">
          <h1 className="text-2xl font-semibold text-white mb-4">Welcome to Your Dashboard</h1>
          <p className="text-white mb-6">You are logged in as: {user.email}</p>
          <button 
            onClick={signOut}
            className="auth-button"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "transition-opacity duration-700",
      isLoaded ? "opacity-100" : "opacity-0"
    )}>
      <AuthLayout>
        {isSignup 
          ? <SignupForm onToggle={toggleForm} /> 
          : <LoginForm onToggle={toggleForm} />
        }
      </AuthLayout>
    </div>
  );
};

export default Index;
