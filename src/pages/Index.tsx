
import React, { useState, useEffect } from 'react';
import AuthLayout from '@/components/AuthLayout';
import SignupForm from '@/components/SignupForm';
import LoginForm from '@/components/LoginForm';
import Dashboard from '@/components/Dashboard';
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
      <div className="min-h-screen bg-background">
        <header className="bg-background border-b border-border py-4">
          <div className="container flex justify-between items-center px-6 mx-auto">
            <h1 className="text-xl font-semibold text-foreground">Analytics Dashboard</h1>
            <button 
              onClick={signOut}
              className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm transition-colors"
            >
              Sign Out
            </button>
          </div>
        </header>
        
        <main>
          <Dashboard />
        </main>
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
