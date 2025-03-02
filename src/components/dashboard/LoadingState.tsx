
import React from 'react';

interface LoadingStateProps {
  debug?: boolean;
  error?: string | null;
  progress?: number;
  message?: string;
}

const LoadingState = ({ 
  debug = false, 
  error = null, 
  progress = 0,
  message = "Loading your dashboard data..."
}: LoadingStateProps) => {
  return (
    <div className="container px-6 py-8 mx-auto">
      <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">{message}</p>
      
      <div className="flex flex-col items-center justify-center mt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Please wait while we load your data...</p>
        
        {progress > 0 && (
          <div className="w-64 h-2 mt-4 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full" 
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-4 bg-destructive/10 rounded-md text-destructive max-w-md">
            <p className="font-medium">Error loading data:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        {debug && (
          <div className="mt-8 p-4 bg-muted rounded-md text-foreground max-w-md w-full">
            <p className="font-medium mb-2">Debug Information:</p>
            <p className="text-sm">If you're stuck on this screen, it might be due to:</p>
            <ul className="text-sm list-disc pl-5 mt-2 space-y-1">
              <li>Database connection issues</li>
              <li>Missing Row Level Security (RLS) policies</li>
              <li>Authentication problems</li>
              <li>Empty database tables</li>
              <li>Date range filtering issues (no data in selected range)</li>
            </ul>
            <p className="text-sm mt-4">Check the browser console (F12) for more detailed logs.</p>
            <p className="text-sm mt-2">If you're not signed in, please sign in to view the dashboard.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingState;
