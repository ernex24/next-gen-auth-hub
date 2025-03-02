import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Apple, Chrome } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SignupFormProps {
  onToggle: () => void;
}

const SignupForm = ({ onToggle }: SignupFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log({
        firstName,
        lastName,
        email,
        password
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">Create an account</h1>
        <p className="text-gray-400">
          Already have an account? <button onClick={onToggle} className="text-auth-purple-light hover:text-auth-purple transition-colors">Log in</button>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="relative">
              <input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="auth-input"
                required
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="auth-input"
                required
              />
            </div>
          </div>
        </div>
        
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
              placeholder="Enter your password"
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
        
        <div className="flex items-start pt-2">
          <div className="flex items-center h-5">
            <input
              id="terms"
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="w-4 h-4 border rounded bg-auth-input border-gray-600 focus:ring-2 focus:ring-auth-purple-light"
              required
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="terms" className="text-gray-300">
              I agree to the <a href="#" className="text-auth-purple-light hover:text-auth-purple transition-colors">Terms & Conditions</a>
            </label>
          </div>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={!agreedToTerms || isSubmitting}
            className={cn(
              "auth-button",
              (!agreedToTerms || isSubmitting) && "opacity-70 cursor-not-allowed"
            )}
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </div>
      </form>

      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-700"></div>
        </div>
        <div className="relative px-4 bg-auth-dark text-sm text-gray-400">Or register with</div>
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

export default SignupForm;
