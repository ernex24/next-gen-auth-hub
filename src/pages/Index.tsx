
import React, { useState, useEffect } from 'react';
import AuthLayout from '@/components/AuthLayout';
import SignupForm from '@/components/SignupForm';
import LoginForm from '@/components/LoginForm';
import Dashboard from '@/components/Dashboard';
import LoadingState from '@/components/dashboard/LoadingState';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from '@/integrations/supabase/auth';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const { user, loading, error } = useAuth();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    // Display error toast if authentication fails
    if (error) {
      toast({
        title: "Authentication Error",
        description: "Please try signing in again or use incognito mode.",
        variant: "destructive",
      });
      console.error("Auth error:", error);
    }

    // Log authentication status for debugging
    console.log("Authentication status:", { 
      user: user ? "Logged in" : "Not logged in", 
      loading, 
      error: error ? String(error) : "None" 
    });
  }, [error, toast, user, loading]);

  const toggleForm = () => {
    setIsSignup(!isSignup);
  };

  const handleResetSession = async () => {
    try {
      // Clear browser storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Sign out the user
      await signOut();
      
      toast({
        title: "Session Reset",
        description: "Your session has been reset. Please sign in again.",
      });
      
      // Force page reload to clear any in-memory state
      window.location.reload();
    } catch (err) {
      console.error("Reset session error:", err);
      toast({
        title: "Reset Failed",
        description: "Could not reset session. Please try refreshing the page.",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      // Clear browser storage on sign out
      localStorage.clear();
      sessionStorage.clear();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
      setIsLoggingOut(false);
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        title: "Sign out failed",
        description: "There was a problem signing you out. Please try again.",
        variant: "destructive",
      });
      setIsLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <LoadingState 
          message="Loading authentication state..." 
          debug={true}
          error={error ? String(error) : null}
          onReset={handleResetSession}
        />
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
              disabled={isLoggingOut}
              className={cn(
                "bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm transition-colors",
                isLoggingOut && "opacity-70 cursor-not-allowed"
              )}
            >
              {isLoggingOut ? "Signing Out..." : "Sign Out"}
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
