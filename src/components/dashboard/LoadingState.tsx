
import React from 'react';

const LoadingState = () => {
  return (
    <div className="container px-6 py-8 mx-auto">
      <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">Loading your dashboard data...</p>
      
      <div className="flex flex-col items-center justify-center mt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Please wait while we load your data...</p>
      </div>
    </div>
  );
};

export default LoadingState;
