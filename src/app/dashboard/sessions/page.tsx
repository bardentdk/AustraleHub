"use client";
import React, { useEffect, useState } from 'react';
import { Table, THead, Th, Td, Badge } from '@/components/ui/Table';
import { createClient } from '@/utils/supabase/client';
import { TrainingSession } from '@/types/database';
import { Search, Filter, MoreHorizontal, Calendar, Users as UsersIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SessionsPage() {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchSessions = async () => {
      const { data, error } = await supabase
        .from('training_sessions')
        .select('*')
        .order('start_date', { ascending: false });
      
      if (!error) setSessions(data);
      setLoading(false);
    };
    fetchSessions();
  }, []);

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
            <Th>Actions</Th>
          </tr>
        </THead>
        <tbody>
          <AnimatePresence mode='wait'>
            {loading ? (
              <tr><Td className="text-center py-12" ><span className="animate-pulse text-slate-400">Chargement des données...</span></Td></tr>
            ) : (
              sessions.map((session, index) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={session.id} 
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <Td className="font-semibold text-slate-900">{session.title}</Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-slate-400" />
                      {new Date(session.start_date).toLocaleDateString('fr-FR')} - {new Date(session.end_date).toLocaleDateString('fr-FR')}
                    </div>
                  </Td>
                  <Td>
                    <Badge variant={session.status === 'in_progress' ? 'success' : 'info'}>
                      {session.status === 'in_progress' ? 'En cours' : 'Planifié'}
                    </Badge>
                  </Td>
                  <Td>
                    <div className="flex gap-2">
                      {session.external_id_digiforma && <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-bold">DIGIFORMA</span>}
                      {session.external_id_nellapp && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">NELL</span>}
                    </div>
                  </Td>
                  <Td className="text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
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