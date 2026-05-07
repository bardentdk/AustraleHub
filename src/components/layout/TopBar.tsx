"use client";
import React, { useState } from 'react';
import { Search, Bell, UserCircle, X, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function TopBar() {
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Mockup des notifications centralisées
  const notifications = [
    { id: 1, type: 'alert', app: 'Digiforma', text: '3 absences non justifiées détectées ce matin.', time: 'Il y a 10 min', icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-100' },
    { id: 2, type: 'success', app: 'Inqom', text: 'La facture FAC-2024-001 de 1200€ a été payée.', time: 'Il y a 1h', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { id: 3, type: 'info', app: 'Hubspot', text: 'Nouveau deal gagné : Formation Compta (Jean Dupont).', time: 'Il y a 3h', icon: Info, color: 'text-blue-600', bg: 'bg-blue-100' },
  ];

  return (
    <>
      <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-30">
        <div className="flex-1 max-w-xl">
          {/* Fausse barre de recherche qui déclenche le vrai Cmd+K si on clique dessus */}
          <div 
            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'k', 'metaKey': true }))}
            className="relative group cursor-pointer"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-brand-500 transition-colors" size={18} />
            <div className="w-full bg-slate-100 border border-transparent rounded-2xl py-2.5 pl-11 pr-4 text-sm text-slate-500 group-hover:border-brand-500/20 group-hover:bg-white transition-all flex items-center justify-between">
              <span>Rechercher ou lancer une action...</span>
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-white px-2 py-1 rounded shadow-sm border border-slate-200">
                <span className="text-sm leading-none">⌘</span>K
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsNotifOpen(true)}
            className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
          </button>
          
          <div className="flex items-center gap-3 pl-6 border-l border-slate-200 cursor-pointer group">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900 group-hover:text-brand-600 transition-colors">Mme Habibou</p>
              <p className="text-xs text-slate-500 italic">Administratrice</p>
            </div>
            <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden border-2 border-slate-100">
               <UserCircle size={40} className="text-slate-400" />
            </div>
          </div>
        </div>
      </header>

      {/* Slide-over Notification Center */}
      <AnimatePresence>
        {isNotifOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsNotifOpen(false)}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[110]"
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-[120] border-l border-slate-200 flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Notifications</h2>
                  <p className="text-xs text-slate-500">Inbox Zero : 3 non lues</p>
                </div>
                <button onClick={() => setIsNotifOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                  <X size={20} className="text-slate-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm hover:border-brand-200 transition-colors cursor-pointer group">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg shrink-0 ${notif.bg} ${notif.color}`}>
                        <notif.icon size={16} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{notif.app}</span>
                          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                          <span className="text-[10px] text-slate-400">{notif.time}</span>
                        </div>
                        <p className="text-sm font-medium text-slate-900 leading-snug group-hover:text-brand-700 transition-colors">
                          {notif.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                <button className="w-full py-2.5 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
                  Tout marquer comme lu
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}