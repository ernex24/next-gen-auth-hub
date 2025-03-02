
import React, { ReactNode, useState, useEffect } from 'react';
import Logo from './Logo';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const heroTexts = [
    { title: "Capturing Moments,", subtitle: "Creating Memories" },
    { title: "Effortless Design,", subtitle: "Stunning Results" },
    { title: "Intuitive Interface,", subtitle: "Powerful Tools" }
  ];

  useEffect(() => {
    setIsLoaded(true);
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroTexts.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [heroTexts.length]);

  return (
    <div className={cn(
      "flex min-h-screen w-full transition-opacity duration-700",
      isLoaded ? "opacity-100" : "opacity-0"
    )}>
      {/* Left side - Hero */}
      <div className="hidden md:flex md:w-1/2 relative bg-gradient-to-br from-auth-purple to-indigo-900 overflow-hidden">
        <div 
          className="absolute inset-0 bg-center bg-cover transition-opacity duration-500"
          style={{ 
            backgroundImage: "url('/lovable-uploads/27413b73-ef17-48d8-b876-2975cab67f2d.png')", 
            opacity: 0.6 
          }}
        />
        
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        
        <div className="relative z-10 flex flex-col justify-between h-full w-full p-12">
          <Logo />
          
          <div className="max-w-md animate-fade-in">
            {heroTexts.map((text, index) => (
              <div
                key={index}
                className={cn(
                  "transition-all duration-700 absolute",
                  activeSlide === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}
              >
                {activeSlide === index && (
                  <h2 className="text-4xl font-semibold text-white">
                    {text.title}<br />{text.subtitle}
                  </h2>
                )}
              </div>
            ))}
          </div>
          
          <div className="hero-dots-container">
            {heroTexts.map((_, index) => (
              <div
                key={index}
                className={cn("hero-dot", activeSlide === index && "active")}
                onClick={() => setActiveSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Right side - Auth form */}
      <div className="w-full md:w-1/2 bg-auth-dark flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="mb-6 md:hidden">
            <Logo />
          </div>
          
          <div className="absolute top-6 right-6">
            <a 
              href="#" 
              className="flex items-center text-sm text-gray-400 hover:text-white transition-colors bg-auth-input bg-opacity-40 px-4 py-2 rounded-full"
            >
              Back to website <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
          
          <div className="animate-fade-in">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
