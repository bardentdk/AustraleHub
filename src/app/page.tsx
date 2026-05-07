"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  Server, 
  Activity 
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Identifiants incorrects. Veuillez réessayer.");
      setLoading(false);
    } else {
      // Redirection vers le dashboard après une connexion réussie
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white">
      
      {/* ============================== */}
      {/* LEFT SIDE : Premium Visuals    */}
      {/* ============================== */}
      <div className="relative hidden lg:flex flex-col justify-between w-1/2 bg-slate-900 overflow-hidden p-12">
        {/* Background Image Grayscale + Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
            alt="Bureaux modernes"
            className="w-full h-full object-cover grayscale opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        </div>

        {/* Top Content */}
        <div className="relative z-10">
          <div className="w-12 h-12 bg-brand-500 rounded-xl flex items-center justify-center text-white shadow-lg mb-8">
            <Server size={24} strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            L'écosystème de formation <br />
            <span className="text-brand-400">totalement unifié.</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-md">
            Pilotez Digiforma, Nell App, Inqom et Hubspot depuis une seule et même interface en temps réel.
          </p>
        </div>

        {/* Floating Cards (Framer Motion) */}
        <div className="relative z-10 flex flex-col gap-4 mt-12">
          
          <motion.div 
            animate={{ y: [-8, 8, -8] }} 
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center gap-4 w-80 shadow-2xl"
          >
            <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="text-emerald-400" size={20} />
            </div>
            <div>
              <p className="text-white font-medium text-sm">N8N Workflows</p>
              <p className="text-slate-400 text-xs">Synchronisation active</p>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [8, -8, 8] }} 
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
            className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center gap-4 w-72 shadow-2xl ml-12"
          >
            <div className="w-10 h-10 bg-brand-500/20 rounded-full flex items-center justify-center">
              <Activity className="text-brand-400" size={20} />
            </div>
            <div>
              <p className="text-white font-medium text-sm">Zéro latence</p>
              <p className="text-slate-400 text-xs">Supabase Realtime</p>
            </div>
          </motion.div>

        </div>

        {/* Bottom Credits */}
        <div className="relative z-10 mt-12">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} AustraleHub. Développé pour La Réunion.
          </p>
        </div>
      </div>

      {/* ============================== */}
      {/* RIGHT SIDE : Login Form        */}
      {/* ============================== */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 sm:p-12">
        <div className="w-full max-w-md">
          
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
              Bienvenue 👋
            </h2>
            <p className="text-slate-500">
              Connectez-vous pour accéder à votre espace d'administration.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 block">
                  Adresse email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" size={20} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-900 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none"
                    placeholder="mme.habibou@australehub.re"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700 block">
                    Mot de passe
                  </label>
                  <a href="#" className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors">
                    Oublié ?
                  </a>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" size={20} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-900 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 cursor-pointer shadow-lg shadow-brand-500/25 active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Se connecter
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

        </div>
      </div>
      
    </div>
  );
}