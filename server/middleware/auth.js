import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

// Strict authentication middleware
// Requires a valid Clerk session token in the request
export const requireAuth = ClerkExpressRequireAuth({
  // options if needed
});

// Optional auth (doesn't block, but populates Auth object if present)
export const optionalAuth = ClerkExpressRequireAuth({
  loose: true
});
