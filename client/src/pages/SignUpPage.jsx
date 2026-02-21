import React from 'react';
import { motion } from 'framer-motion';
import { SignUp } from '@clerk/clerk-react';

const SignUpPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-32 bg-hero-background-gradient">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[480px]"
      >
        <SignUp 
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "glass-card-dark border-white/10 shadow-2xl overflow-hidden",
              headerTitle: "text-white font-heading font-bold text-2xl",
              headerSubtitle: "text-slate-gray",
              formButtonPrimary: "bg-gradient-brand text-deep-code-blue font-black uppercase tracking-widest hover:brightness-110 transition-all border-none py-3",
              formFieldLabel: "text-slate-gray text-xs font-bold uppercase tracking-widest",
              formFieldInput: "bg-white/5 border-white/10 text-white focus:border-electric-cyan",
              footerActionLink: "text-electric-cyan hover:text-white transition-colors",
              identityPreviewText: "text-white",
              socialButtonsBlockButton: "bg-white/5 border-white/5 hover:bg-white/10 text-white transition-all",
              socialButtonsBlockButtonText: "text-slate-gray group-hover:text-white",
              dividerLine: "bg-white/10",
              dividerText: "text-slate-gray"
            }
          }}
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
        />
      </motion.div>
    </div>
  );
};

export default SignUpPage;
