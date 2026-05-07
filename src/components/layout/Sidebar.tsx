"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Users, 
  CreditCard, 
  Target, 
  Calendar, 
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const navigation = [
  { name: 'Vue d\'ensemble', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Sessions (Digiforma)', href: '/dashboard/sessions', icon: GraduationCap },
  { name: 'Apprenants (Nell)', href: '/dashboard/apprenants', icon: Users },
  { name: 'Finance (Inqom)', href: '/dashboard/finance', icon: CreditCard },
  { name: 'Opportunités (Hubspot)', href: '/dashboard/crm', icon: Target },
  { name: 'Ressources Internes', href: '/dashboard/ressources', icon: Calendar },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[var(--sidebar-width)] h-screen border-r border-slate-200 bg-white flex flex-col sticky top-0">
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
          <GraduationCap size={24} strokeWidth={2.5} />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-900">AustraleHub</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div className={`
                group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200
                ${isActive ? 'bg-brand-50 text-brand-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
              `}>
                <div className="flex items-center gap-3">
                  <item.icon size={20} className={isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'} />
                  <span className="font-medium text-[15px]">{item.name}</span>
                </div>
                {isActive && (
                  <motion.div layoutId="activeNav" className="text-brand-600">
                    <ChevronRight size={16} />
                  </motion.div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group">
          <LogOut size={20} className="text-slate-400 group-hover:text-red-500" />
          <span className="font-medium text-[15px]">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}