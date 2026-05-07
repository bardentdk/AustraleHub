"use client";
import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { CRMLead } from '@/types/database';
import { 
  Search, 
  Plus, 
  DollarSign, 
  Calendar, 
  Target, 
  TrendingUp,
  MoreVertical,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Définition des colonnes de notre pipeline (Ordre logique de vente)
const PIPELINE_STAGES = [
  { id: 'Nouveau', label: 'Nouveaux Leads', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  { id: 'Devis envoyé', label: 'Devis Envoyés', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'Négociation', label: 'En Négociation', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  { id: 'Gagné', label: 'Gagnés (Inscrits)', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
];

export default function CrmPipelinePage() {
  const [leads, setLeads] = useState<CRMLead[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchCRM = async () => {
      const { data, error } = await supabase
        .from('crm_opportunities')
        .select('*')
        // On exclut les "Perdus" de la vue principale pour garder un board propre
        .neq('stage', 'Perdu') 
        .order('created_at', { ascending: false });
      
      if (!error && data) setLeads(data);
      setLoading(false);
    };
    fetchCRM();
  }, [supabase]);

  // Calcul du montant total du pipeline (hors gagnés/perdus)
  const totalPipelineValue = leads
    .filter(l => l.stage !== 'Gagné' && l.stage !== 'Perdu')
    .reduce((sum, lead) => sum + (Number(lead.amount) || 0), 0);

  // Fonction pour formater en euros
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col space-y-6 overflow-hidden">
      {/* Header du CRM */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0 px-1">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            Pipeline Commercial
            <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-1 rounded font-bold uppercase tracking-wider translate-y-[-2px]">
              Hubspot
            </span>
          </h1>
          <p className="text-slate-500 mt-1 flex items-center gap-2">
            Valeur en cours : <span className="font-bold text-slate-900">{formatCurrency(totalPipelineValue)}</span>
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Rechercher une opportunité..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/10 transition-all w-64"
            />
          </div>
          <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter size={20} />
          </button>
          <button className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-xl font-medium transition-all shadow-lg shadow-brand-500/20 active:scale-95">
            <Plus size={18} />
            Nouveau Deal
          </button>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <div className="flex gap-6 h-full min-w-max px-1">
          
          {PIPELINE_STAGES.map((stage) => {
            // Filtrer les leads pour cette colonne
            const stageLeads = leads.filter(lead => 
              // Si le stage correspond, ou si le stage est vide/inconnu et qu'on est dans la colonne "Nouveau"
              lead.stage === stage.id || (!lead.stage && stage.id === 'Nouveau')
            );
            
            const stageTotal = stageLeads.reduce((sum, l) => sum + (Number(l.amount) || 0), 0);

            return (
              <div key={stage.id} className="w-80 flex flex-col h-full bg-slate-50/50 rounded-2xl border border-slate-200/60 overflow-hidden shrink-0">
                {/* Colonne Header */}
                <div className="p-4 border-b border-slate-200/60 bg-white/50 flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">{stage.label}</h3>
                    <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">
                      {stageLeads.length}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-slate-500">
                    {formatCurrency(stageTotal)}
                  </span>
                </div>

                {/* Zone de cartes (Scrollable verticalement) */}
                <div className="p-4 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                  <AnimatePresence>
                    {loading ? (
                      <div className="animate-pulse space-y-3">
                        <div className="bg-white h-24 rounded-xl border border-slate-200 w-full"></div>
                        <div className="bg-white h-24 rounded-xl border border-slate-200 w-full opacity-50"></div>
                      </div>
                    ) : (
                      stageLeads.map((lead, index) => (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          key={lead.id}
                          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-300 transition-all cursor-pointer group relative"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-slate-900 text-sm leading-tight pr-6">
                              {lead.deal_name}
                            </h4>
                            <button className="text-slate-300 hover:text-slate-600 absolute right-3 top-3">
                              <MoreVertical size={16} />
                            </button>
                          </div>
                          
                          <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                              <DollarSign size={14} />
                              {formatCurrency(Number(lead.amount))}
                            </div>
                            
                            {lead.probability > 0 && (
                              <div className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                                <Target size={12} className="text-slate-400" />
                                {lead.probability}%
                              </div>
                            )}
                          </div>

                          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                              <Calendar size={13} />
                              {lead.close_date ? new Date(lead.close_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : 'Date à définir'}
                            </div>
                            {lead.external_id_hubspot && (
                              <span className="text-[10px] text-slate-400 font-mono bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                                #{lead.external_id_hubspot.slice(-4)}
                              </span>
                            )}
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>

                  {/* Bouton d'ajout rapide en bas de colonne */}
                  {!loading && (
                    <button className="w-full py-2.5 flex items-center justify-center gap-2 text-sm font-medium text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-dashed border-transparent hover:border-slate-300">
                      <Plus size={16} />
                      Ajout rapide
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          
        </div>
      </div>
    </div>
  );
}