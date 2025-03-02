
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  profile: any; // User profile data from the profiles table
  refreshProfile: () => Promise<void>;
  error: Error | null; // Add the error property to the type definition
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  profile: null,
  refreshProfile: async () => {},
  error: null, // Initialize the error property
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null); // Add state for error
  const { toast } = useToast();

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      const profileData = await fetchUserProfile(user.id);
      setProfile(profileData);
    }
  };

  useEffect(() => {
    // Reset any previous errors
    setError(null);
    
    console.log("AuthContext: Initializing auth state...");
    
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (error) {
        setError(error);
        console.error("Session retrieval error:", error);
      }
      
      console.log("AuthContext: Got initial session:", session ? "Logged in" : "Not logged in");
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const profileData = await fetchUserProfile(session.user.id);
        setProfile(profileData);
      }
      
      setLoading(false);
    }).catch(err => {
      setError(err instanceof Error ? err : new Error(String(err)));
      setLoading(false);
      console.error("Auth session error:", err);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        try {
          console.log("AuthContext: Auth state changed:", _event, session ? "Has session" : "No session");
          
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            const profileData = await fetchUserProfile(session.user.id);
            setProfile(profileData);
          } else {
            setProfile(null);
          }
          
          setLoading(false);
        } catch (err) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
          console.error("Auth state change error:", err);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, refreshProfile, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
