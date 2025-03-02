
import { supabase } from "./client";
import { toast } from "@/components/ui/use-toast";

export type AuthError = {
  message: string;
};

export const signUp = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<{ error: AuthError | null }> => {
  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          firstName,
          lastName,
        },
      },
    });

    if (error) {
      return { error: { message: error.message } };
    }

    toast({
      title: "Account created!",
      description: "Please check your email to verify your account.",
    });

    return { error: null };
  } catch (err) {
    console.error("Signup error:", err);
    return { 
      error: { 
        message: "An unexpected error occurred. Please try again." 
      } 
    };
  }
};

export const login = async (
  email: string,
  password: string
): Promise<{ error: AuthError | null }> => {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: { message: error.message } };
    }

    toast({
      title: "Welcome back!",
      description: "You have been successfully logged in.",
    });

    return { error: null };
  } catch (err) {
    console.error("Login error:", err);
    return { 
      error: { 
        message: "An unexpected error occurred. Please try again." 
      } 
    };
  }
};

export const signOut = async (): Promise<void> => {
  await supabase.auth.signOut();
  toast({
    title: "Logged out",
    description: "You have been successfully logged out.",
  });
};
