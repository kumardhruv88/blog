import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle, Loader2, Send, Sparkles, Star, Zap } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';

import confetti from 'canvas-confetti';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState('idle');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !agreed) return;

    setStatus('loading');

    setTimeout(() => {
      setStatus('success');
      setEmail('');
      setAgreed(false);

      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563EB', '#7C3AED', '#E11D48']
      });

      setTimeout(() => setStatus('idle'), 5000);
    }, 1500);
  };

  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto relative">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/15 via-purple-400/15 to-pink-400/10 blur-[80px] rounded-full transform scale-90" />

        {/* Floating decorations */}
        <div className="absolute -top-8 -left-4 w-16 h-16 text-amber-300/30" style={{ animation: 'float-slow 7s ease-in-out infinite' }}>
          <Sparkles size={40} />
        </div>
        <div className="absolute -top-4 right-8 w-10 h-10 text-purple-300/25" style={{ animation: 'float-medium 5s ease-in-out infinite 1s' }}>
          <Star size={28} />
        </div>
        <div className="absolute bottom-4 -left-6 w-8 h-8 text-blue-300/20" style={{ animation: 'float-slow 9s ease-in-out infinite 2s' }}>
          <Zap size={24} />
        </div>
        <div className="absolute -bottom-4 right-4 w-6 h-6 rounded-full border-2 border-pink-200/30" style={{ animation: 'float-medium 6s ease-in-out infinite 0.5s' }} />

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 rounded-3xl overflow-hidden gradient-border"
        >
          <div className="bg-white/80 backdrop-blur-xl p-10 md:p-14 text-center">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-xl shadow-purple-500/20 rotate-3"
            >
              <Mail className="w-8 h-8 text-white -rotate-3" />
            </motion.div>

            <h2 className="text-3xl md:text-4xl font-heading font-black text-[#1E293B] mb-3">
              Stay <span className="gradient-text">Updated</span>
            </h2>

            <p className="text-slate-500 mb-10 max-w-lg mx-auto leading-relaxed">
              Get weekly digests of new posts, learning tips, and code snippets directly to your inbox. No spam, ever.
            </p>

            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-emerald-50 border border-emerald-200/50 rounded-2xl p-8 flex flex-col items-center gap-3 max-w-md mx-auto"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle className="w-7 h-7 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1E293B]">Subscribed Successfully!</h3>
                  <p className="text-slate-500 text-sm">Check your email to confirm your subscription.</p>
                </motion.div>
              ) : (
                <motion.form
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="max-w-md mx-auto space-y-4 text-left"
                >
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      icon={Mail}
                      required
                      className="bg-white/90 border-black/[0.06] focus:border-blue-300"
                    />
                  </div>

                  <div className="flex items-start gap-3 pl-1">
                    <div className="flex items-center h-5 mt-0.5">
                      <input
                        id="gdpr"
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        required
                        className="w-4 h-4 rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500/20 focus:ring-offset-0 cursor-pointer"
                      />
                    </div>
                    <label htmlFor="gdpr" className="text-xs text-slate-500 leading-tight cursor-pointer select-none">
                      I agree to receive emails and accept the <a href="/privacy" className="text-blue-600 hover:underline font-medium">Privacy Policy</a>.
                    </label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full shadow-lg shadow-blue-500/10 rounded-xl"
                    size="lg"
                    loading={status === 'loading'}
                    disabled={!email || !agreed}
                  >
                    Subscribe
                    <Send className="w-4 h-4 ml-2" />
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
