"use client";
import React from 'react';
import { Search, Bell, UserCircle } from 'lucide-react';

export function TopBar() {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-bottom border-slate-200 px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher une session, un apprenant..." 
            className="w-full bg-slate-100 border-none rounded-2xl py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-brand-500/20 transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
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
  );
}