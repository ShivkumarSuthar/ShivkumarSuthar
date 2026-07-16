/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PortfolioData, ThemeColors, ContactMessage } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, Send, CheckCircle2, MessageSquare, ArrowUpRight, Check, Copy } from 'lucide-react';

interface ContactProps {
  data: PortfolioData;
  colors: ThemeColors;
  onNewMessage: (msg: ContactMessage) => void;
}

export default function Contact({ data, colors, onNewMessage }: ContactProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(data.personal.email);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);

    // Simulate clean network latency
    setTimeout(() => {
      const newMsg: ContactMessage = {
        id: `msg-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };

      onNewMessage(newMsg);
      setIsSubmitting(false);
      setSuccess(true);

      // Reset form fields
      setName('');
      setEmail('');
      setMessage('');

      // Auto-dismiss success notification
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    }, 1200);
  };

  const focusRingAccent = colors.accent.includes('amber')
    ? 'focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20'
    : colors.accent.includes('emerald')
    ? 'focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20'
    : colors.accent.includes('indigo')
    ? 'focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20'
    : colors.accent.includes('rose')
    ? 'focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/20'
    : 'focus:border-zinc-500/50 focus:ring-1 focus:ring-zinc-500/20';

  return (
    <section id="contact" className="py-28 relative overflow-hidden">
      <div className="max-w-[90rem] mx-auto px-6">
        
        {/* Section Heading */}
        <div className="flex items-center gap-4 mb-16">
          <span className={`text-sm font-mono tracking-widest uppercase font-bold ${colors.accent}`}>04 / Connect</span>
          <h2 className="text-2xl sm:text-4xl font-display font-black text-zinc-100 tracking-tight">
            Get In Touch
          </h2>
          <div className="h-px bg-zinc-900 flex-1 max-w-[240px]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Column 1: Call to Action Details */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-zinc-100 leading-tight">
              Let's build something exceptional together.
            </h3>
            
            <p className="text-base text-zinc-400 font-light font-sans leading-relaxed">
              Whether you are looking to hire a full-stack engineer, have a consulting inquiry, want to discuss design layouts, or simply say hello, my inbox is always open. I will do my best to respond within 24 hours.
            </p>

            <div className="pt-4 space-y-3.5 flex flex-col">
              <div 
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-3.5 text-sm font-mono text-zinc-300 hover:text-white transition-all p-1 group cursor-pointer select-none w-fit"
                title="Click to copy email"
              >
                <div className="w-10 h-10 rounded-xl bg-zinc-900/50 flex items-center justify-center border border-zinc-900 group-hover:border-zinc-850 transition-colors">
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Mail className="w-4 h-4 text-zinc-400 group-hover:text-zinc-200" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span>{data.personal.email}</span>
                  {copied ? (
                    <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded animate-pulse">Copied!</span>
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              </div>

              {data.personal.phone && (
                <a 
                  href={`tel:${data.personal.phone}`}
                  className="inline-flex items-center gap-3.5 text-sm font-mono text-zinc-300 hover:text-white transition-all p-1 group cursor-pointer select-none"
                >
                  <div className="w-10 h-10 rounded-xl bg-zinc-900/50 flex items-center justify-center border border-zinc-900 group-hover:border-zinc-850 transition-colors">
                    <Phone className="w-4 h-4 text-zinc-400 group-hover:text-zinc-200" />
                  </div>
                  <span>{data.personal.phone}</span>
                </a>
              )}
            </div>

            {/* Quick Links */}
            <div className="pt-6 border-t border-zinc-900/40">
              <h4 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-3.5 font-bold">Links &amp; Credentials</h4>
              <div className="flex flex-col gap-3">
                {data.personal.github && (
                  <a 
                    href={data.personal.github} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-2 text-sm font-mono text-zinc-450 hover:text-zinc-200 transition-colors group cursor-pointer select-none w-fit"
                  >
                    <span>GitHub Profile</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                )}
                {data.personal.linkedin && (
                  <a 
                    href={data.personal.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-2 text-sm font-mono text-zinc-450 hover:text-zinc-200 transition-colors group cursor-pointer select-none w-fit"
                  >
                    <span>LinkedIn Network</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                )}
                {data.personal.twitter && (
                  <a 
                    href={data.personal.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-2 text-sm font-mono text-zinc-450 hover:text-zinc-200 transition-colors group cursor-pointer select-none w-fit"
                  >
                    <span>Twitter Timeline</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Column 2: Elegant Form Card */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 bg-zinc-900/20 border border-zinc-900 rounded-2xl relative overflow-hidden">
              
              {/* Form Submission Glow Accent */}
              {success && (
                <div className="absolute inset-0 bg-emerald-950/20 backdrop-blur-[3px] flex flex-col justify-center items-center z-20 text-center p-6 animate-fade-in">
                  <motion.div
                    initial={{ scale: 0.94, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="space-y-3 flex flex-col items-center p-6 rounded-2xl bg-zinc-950 border border-zinc-900/80 shadow-[0_10px_35px_rgba(0,0,0,0.6)] max-w-[360px]"
                  >
                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                    <h3 className="text-sm sm:text-base font-display font-bold text-zinc-100">Message Sent Successfully!</h3>
                    <p className="text-xs text-zinc-450 leading-relaxed">
                      Thank you for writing. Your message has been saved to your local inquiry stream. You can inspect it by clicking 'Customize Mode' at the top right!
                    </p>
                  </motion.div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-1">
                    <label htmlFor="form-name" className="block text-xs font-mono text-zinc-500 uppercase tracking-widest mb-1.5 font-bold">
                      Your Name
                    </label>
                    <input
                      id="form-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className={`w-full bg-zinc-950/60 border border-zinc-900/80 focus:outline-none rounded-xl px-4.5 py-3.5 text-sm text-zinc-200 placeholder-zinc-800 transition-all ${focusRingAccent}`}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <label htmlFor="form-email" className="block text-xs font-mono text-zinc-500 uppercase tracking-widest mb-1.5 font-bold">
                      Email Address
                    </label>
                    <input
                      id="form-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className={`w-full bg-zinc-950/60 border border-zinc-900/80 focus:outline-none rounded-xl px-4.5 py-3.5 text-sm text-zinc-200 placeholder-zinc-800 transition-all ${focusRingAccent}`}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="form-message" className="block text-xs font-mono text-zinc-500 uppercase tracking-widest mb-1.5 font-bold">
                    Your Message
                  </label>
                  <textarea
                    id="form-message"
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your project, timeline, or request..."
                    className={`w-full bg-zinc-950/60 border border-zinc-900/80 focus:outline-none rounded-xl px-4.5 py-3.5 text-sm text-zinc-200 placeholder-zinc-800 transition-all resize-none ${focusRingAccent}`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-xl text-sm font-mono tracking-widest uppercase transition-all duration-300 cursor-pointer select-none ${
                    isSubmitting 
                      ? 'bg-zinc-900 text-zinc-600 border border-zinc-950 cursor-not-allowed' 
                      : `${colors.primary} ${colors.primaryHover}`
                  }`}
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Sending Message...' : 'Transmit Message'}
                </button>
              </form>

            </div>
          </div>

        </div>

      </div>

      {/* Floating temporary Copied toast notification */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 bg-zinc-950/90 border border-zinc-800 text-zinc-100 rounded-xl px-4 py-3 flex items-center gap-3 shadow-[0_12px_40px_rgba(0,0,0,0.8)] backdrop-blur-md select-none"
          >
            <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400">
              <Check className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold">Email Copied!</span>
              <span className="text-[10px] font-mono text-zinc-500">{data.personal.email}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
