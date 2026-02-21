import React from 'react';

// Mock Provider that just renders children
export const ClerkProvider = ({ children }) => {
  return <>{children}</>;
};

// Default to "Signed Out" state
export const SignedIn = ({ children }) => null;

export const SignedOut = ({ children }) => <>{children}</>;

export const SignInButton = ({ children, mode }) => (
  <div onClick={() => alert("This is a placeholder Sign In button until a valid Clerk Key is provided.")}>
    {children}
  </div>
);

export const UserButton = () => (
  <div className="w-8 h-8 rounded-full bg-slate-gray/20 border border-white/10" />
);

export const useUser = () => ({ isSignedIn: false, user: null });
export const useAuth = () => ({ isSignedIn: false, userId: null });
