
import React from 'react';

interface LoadingStateProps {
  debug?: boolean;
  error?: string | null;
}

const LoadingState = ({ debug = false, error = null }: LoadingStateProps) => {
  return (
    <div className="container px-6 py-8 mx-auto">
      <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">Loading your dashboard data...</p>
      
      <div className="flex flex-col items-center justify-center mt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Please wait while we load your data...</p>
        
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
            </ul>
            <p className="text-sm mt-4">Try checking the console logs for more details.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingState;
