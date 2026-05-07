"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  FileText, 
  User, 
  GraduationCap, 
  ArrowRight, 
  Command,
  CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  // Écouteur global pour Cmd+K / Ctrl+K et Echap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Empêcher le scroll du body quand la palette est ouverte
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [isOpen]);

  const handleSelect = (href: string) => {
    setIsOpen(false);
    setSearchQuery('');
    router.push(href);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay flouté */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[100]"
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-[101] flex items-start justify-center pt-[15vh] px-4 pointer-events-none">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden pointer-events-auto"
            >
              {/* Input Zone */}
              <div className="flex items-center px-4 py-4 border-b border-slate-100">
                <Search className="text-slate-400 mr-3" size={24} />
                <input 
                  autoFocus
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un apprenant, une facture, une action..." 
                  className="flex-1 bg-transparent border-none outline-none text-lg text-slate-900 placeholder:text-slate-400"
                />
                <div className="flex items-center gap-1 text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                  ESC
                </div>
              </div>

              {/* Résultats rapides (Mockup intelligent) */}
              <div className="p-2 max-h-[60vh] overflow-y-auto">
                <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Suggestions Rapides
                </div>
                
                <button 
                  onClick={() => handleSelect('/dashboard/apprenants')}
                  className="w-full flex items-center justify-between p-3 hover:bg-brand-50 rounded-xl group transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <User size={18} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-slate-900">Voir tous les apprenants</p>
                      <p className="text-xs text-slate-500">Nell App</p>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-slate-300 group-hover:text-brand-600" />
                </button>

                <button 
                  onClick={() => handleSelect('/dashboard/finance')}
                  className="w-full flex items-center justify-between p-3 hover:bg-brand-50 rounded-xl group transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 text-orange-600 rounded-lg group-hover:bg-orange-600 group-hover:text-white transition-colors">
                      <CreditCard size={18} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-slate-900">Factures en retard</p>
                      <p className="text-xs text-slate-500">Inqom</p>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-slate-300 group-hover:text-brand-600" />
                </button>

                <div className="px-3 py-2 mt-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Actions Spécifiques
                </div>

                <button 
                  onClick={() => handleSelect('/dashboard/sessions/new')}
                  className="w-full flex items-center justify-between p-3 hover:bg-brand-50 rounded-xl group transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <GraduationCap size={18} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-slate-900">Créer une session Digiforma</p>
                      <p className="text-xs text-slate-500">Action N8N</p>
                    </div>
                  </div>
                  <Command size={16} className="text-slate-300 group-hover:text-brand-600" />
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}