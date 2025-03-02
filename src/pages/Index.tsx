
import React, { useState, useEffect } from 'react';
import AuthLayout from '@/components/AuthLayout';
import SignupForm from '@/components/SignupForm';
import LoginForm from '@/components/LoginForm';
import Dashboard from '@/components/Dashboard';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from '@/integrations/supabase/auth';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const { user, loading, error } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    setIsLoaded(true);
    
    // Display error toast if authentication fails
    if (error) {
      toast({
        title: "Authentication Error",
        description: "Please try signing in again or use incognito mode.",
        variant: "destructive",
      });
      // Clear browser storage to prevent persistence issues
      localStorage.clear();
      sessionStorage.clear();
      console.error("Auth error:", error);
    }
  }, [error, toast]);

  const toggleForm = () => {
    setIsSignup(!isSignup);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      // Clear browser storage on sign out
      localStorage.clear();
      sessionStorage.clear();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        title: "Sign out failed",
        description: "There was a problem signing you out. Please try again.",
        variant: "destructive",
      });
    }
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
              onClick={handleSignOut}
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
