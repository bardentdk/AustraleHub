"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Table, THead, Th, Td, Badge } from '@/components/ui/Table';
import { createClient } from '@/utils/supabase/client';
import { TrainingSession } from '@/types/database';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Calendar, 
  Eye, 
  Users as UsersIcon, 
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SessionsPage() {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();
  const menuRef = useRef<HTMLDivElement>(null);

  // Fetch et Filtre des sessions
  useEffect(() => {
    const fetchSessions = async () => {
      const { data, error } = await supabase
        .from('training_sessions')
        .select('*')
        .order('start_date', { ascending: false });
      
      if (!error && data) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // On compare uniquement les dates, pas les heures
        
        const cleanedSessions = data
          .filter(session => {
            // Filtre 1 : Exclure tout ce qui commence par MPI_
            if (session.title && session.title.startsWith('MPI_')) {
              return false;
            }
            return true;
          })
          .map(session => {
            // Filtre 2 : Corriger le statut si la date est dépassée
            let currentStatus = session.status;
            if (session.end_date) {
              const endDate = new Date(session.end_date);
              if (endDate < today && currentStatus !== 'completed') {
                currentStatus = 'completed'; // Force le statut à Terminé
              }
            }
            return { ...session, status: currentStatus };
          });

        setSessions(cleanedSessions);
      }
      setLoading(false);
    };
    fetchSessions();
  }, [supabase]);

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sessions de formation</h1>
          <p className="text-slate-500 text-sm">Gestion des plannings synchronisés via Digiforma.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Rechercher une session..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/10 transition-all"
            />
          </div>
          <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <Table>
        <THead>
          <tr>
            <Th>Intitulé de la formation</Th>
            <Th>Période</Th>
            <Th>Statut</Th>
            <Th>Source</Th>
            <Th className="text-right">Actions</Th>
          </tr>
        </THead>
        <tbody>
          <AnimatePresence mode='wait'>
            {loading ? (
              <tr><Td colSpan={5} className="text-center py-12"><span className="animate-pulse text-slate-400">Chargement des données...</span></Td></tr>
            ) : sessions.length === 0 ? (
              <tr><Td colSpan={5} className="text-center py-12 text-slate-500">Aucune session trouvée.</Td></tr>
            ) : (
              sessions.map((session, index) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={session.id} 
                  className="hover:bg-slate-50/50 transition-colors group relative"
                >
                  <Td className="font-semibold text-slate-900">{session.title}</Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-slate-400" />
                      {session.start_date ? new Date(session.start_date).toLocaleDateString('fr-FR') : 'À définir'} 
                      {' '} - {' '} 
                      {session.end_date ? new Date(session.end_date).toLocaleDateString('fr-FR') : 'À définir'}
                    </div>
                  </Td>
                  <Td>
                    <Badge variant={session.status === 'in_progress' ? 'success' : session.status === 'completed' ? 'default' : 'info'}>
                      {session.status === 'in_progress' ? 'En cours' : session.status === 'completed' ? 'Terminé' : 'Planifié'}
                    </Badge>
                  </Td>
                  <Td>
                    <div className="flex gap-2">
                      {session.external_id_digiforma && <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-bold">DIGIFORMA</span>}
                      {session.external_id_nellapp && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">NELL</span>}
                    </div>
                  </Td>
                  <Td className="text-right">
                    
                    <div className="relative inline-block text-left" ref={openMenuId === session.id ? menuRef : null}>
                      <button 
                        onClick={(e) => toggleMenu(e, session.id)}
                        className={`p-2 rounded-lg transition-colors ${openMenuId === session.id ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}`}
                      >
                        <MoreHorizontal size={18} />
                      </button>

                      <AnimatePresence>
                        {openMenuId === session.id && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1 overflow-hidden"
                          >
                            <button 
                              onClick={() => router.push(`/dashboard/sessions/${session.id}`)}
                              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600 transition-colors text-left"
                            >
                              <Eye size={16} />
                              Voir le détail
                            </button>
                            <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left">
                              <UsersIcon size={16} />
                              Gérer les apprenants
                            </button>
                            <div className="h-px bg-slate-100 my-1"></div>
                            <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left">
                              <FileText size={16} />
                              Bilan financier
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                  </Td>
                </motion.tr>
              ))
            )}
          </AnimatePresence>
        </tbody>
      </Table>
    </div>
  );
}