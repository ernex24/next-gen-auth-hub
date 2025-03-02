
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Apple, Chrome } from 'lucide-react';
import { cn } from '@/lib/utils';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log({
        email,
        password,
        rememberMe
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">Log in</h1>
        <p className="text-gray-400">
          Don't have an account? <a href="#" className="text-auth-purple-light hover:text-auth-purple transition-colors">Create account</a>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              required
            />
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="auth-input-icon focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 border rounded bg-auth-input border-gray-600 focus:ring-2 focus:ring-auth-purple-light"
            />
            <label htmlFor="remember-me" className="ml-2 text-sm text-gray-300">
              Remember me
            </label>
          </div>
          
          <a href="#" className="text-sm text-auth-purple-light hover:text-auth-purple transition-colors">
            Forgot password?
          </a>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "auth-button",
              isSubmitting && "opacity-70 cursor-not-allowed"
            )}
          >
            {isSubmitting ? "Logging in..." : "Log in"}
          </button>
        </div>
      </form>

      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-700"></div>
        </div>
        <div className="relative px-4 bg-auth-dark text-sm text-gray-400">Or continue with</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <button
          type="button"
          className="social-button flex items-center justify-center text-white"
        >
          <Chrome size={18} className="mr-2" />
          <span>Google</span>
        </button>
        
        <button
          type="button"
          className="social-button flex items-center justify-center text-white"
        >
          <Apple size={18} className="mr-2" />
          <span>Apple</span>
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
