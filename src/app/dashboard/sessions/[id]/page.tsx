"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { TrainingSession, Student } from '@/types/database';
import { Badge, Table, THead, Th, Td } from '@/components/ui/Table';
import { 
  ArrowLeft, CalendarDays, Users, FileSignature, AlertTriangle,
  Clock, CheckCircle2, Trophy, Medal, Send, Zap, Gift, MailWarning, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Interface étendue pour inclure la gamification locale (à ajouter plus tard dans Supabase)
interface GamifiedStudent extends Student {
  score?: number;
  convention_signed?: boolean;
}

export default function SessionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;
  
  const [session, setSession] = useState<TrainingSession | null>(null);
  const [students, setStudents] = useState<GamifiedStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchSessionDetails = async () => {
      const { data: sessionData, error: sessionError } = await supabase
        .from('training_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();
      
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('*')
        .eq('session_id', sessionId);

      if (!sessionError) setSession(sessionData);
      
      if (!studentsError && studentsData) {
        // Simulation de données de gamification pour la démo
        const enrichedStudents = studentsData.map((s, index) => ({
          ...s,
          score: 150 - (index * 30) + Math.floor(Math.random() * 20), // Score fictif décroissant
          convention_signed: index % 3 !== 0 // 1 sur 3 n'a pas signé
        })).sort((a, b) => (b.score || 0) - (a.score || 0)); // Tri par score (Leaderboard)

        setStudents(enrichedStudents);
      }
      
      setLoading(false);
    };

    if (sessionId) fetchSessionDetails();
  }, [sessionId, supabase]);

  // Fonction générique pour déclencher un Webhook N8N
  const triggerN8NAction = async (actionType: string, payload: any, actionId: string) => {
    setActionLoading(actionId);
    try {
      await fetch('/api/actions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mon_super_secret_n8n_habibou_2024'
        },
        body: JSON.stringify({ action_type: actionType, payload })
      });
      // Effet visuel de succès (dans un vrai SaaS on mettrait un toast de notification)
      setTimeout(() => setActionLoading(null), 1000);
    } catch (e) {
      console.error("Erreur d'action", e);
      setActionLoading(null);
    }
  };

  const getRankBadge = (index: number) => {
    if (index === 0) return <Trophy className="text-amber-400" size={20} />;
    if (index === 1) return <Medal className="text-slate-300" size={20} />;
    if (index === 2) return <Medal className="text-amber-600" size={20} />;
    return <span className="text-slate-400 font-bold w-5 text-center">{index + 1}</span>;
  };

  if (loading) return <div className="flex-1 flex items-center justify-center h-full"><span className="animate-pulse text-slate-400 font-medium">Chargement des données...</span></div>;
  if (!session) return <div className="text-center py-20"><h2 className="text-xl font-bold text-slate-900 mb-2">Session introuvable</h2></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto space-y-8">
      
      {/* Header Navigation */}
      <button onClick={() => router.push('/dashboard/sessions')} className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft size={16} /> Retour aux sessions
      </button>

      {/* Hero Card Session (inchangée) */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <CalendarDays size={200} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-1 rounded font-bold uppercase tracking-wider">Source: Digiforma</span>
              <Badge variant={session.status === 'in_progress' ? 'success' : 'info'}>
                {session.status === 'in_progress' ? 'En cours' : 'Planifié'}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{session.title}</h1>
            <p className="text-slate-500 flex items-center gap-2">
              <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">ID: {session.external_id_digiforma || session.id.split('-')[0]}</span>
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center min-w-[120px]">
              <Clock className="text-brand-500 mb-1" size={20} />
              <span className="text-xs text-slate-500 uppercase font-semibold">Début</span>
              <span className="font-bold text-slate-900">{session.start_date ? new Date(session.start_date).toLocaleDateString('fr-FR') : '-'}</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center min-w-[120px]">
              <CheckCircle2 className="text-emerald-500 mb-1" size={20} />
              <span className="text-xs text-slate-500 uppercase font-semibold">Fin</span>
              <span className="font-bold text-slate-900">{session.end_date ? new Date(session.end_date).toLocaleDateString('fr-FR') : '-'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de contenu : 2 colonnes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Colonne Gauche : Administratif & Conventions */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileSignature className="text-slate-400" size={20} />
              Conventions & Émargements
            </h2>
            <button 
              onClick={() => triggerN8NAction('REMIND_ALL_CONVENTIONS', { sessionId: session.id }, 'remind_all')}
              disabled={actionLoading === 'remind_all'}
              className="flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700 bg-orange-50 px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
            >
              {actionLoading === 'remind_all' ? <Loader2 size={16} className="animate-spin" /> : <MailWarning size={16} />}
              Relancer les non-signés
            </button>
          </div>

          <Table>
            <THead>
              <tr>
                <Th>Apprenant</Th>
                <Th>Convention</Th>
                <Th>Action</Th>
              </tr>
            </THead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className={`transition-colors ${!student.convention_signed ? 'bg-red-50/30' : 'hover:bg-slate-50'}`}>
                  <Td className="font-medium text-slate-900">
                    <div className="flex items-center gap-2">
                      {!student.convention_signed && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>}
                      {student.first_name} {student.last_name}
                    </div>
                  </Td>
                  <Td>
                    {student.convention_signed ? (
                      <Badge variant="success">Signée</Badge>
                    ) : (
                      <Badge variant="error">En attente</Badge>
                    )}
                  </Td>
                  <Td>
                    {!student.convention_signed && (
                      <button 
                        onClick={() => triggerN8NAction('REMIND_SINGLE_CONVENTION', { studentId: student.id, email: student.email }, `remind_${student.id}`)}
                        className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Envoyer un rappel SMS/Email"
                      >
                        {actionLoading === `remind_${student.id}` ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                      </button>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Colonne Droite : Gamification & Leaderboard */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Zap className="text-amber-500" size={20} />
              Leaderboard d'Assiduité
            </h2>
            <span className="text-xs font-bold bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full">
              Basé sur présences et signatures
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="divide-y divide-slate-100">
              {students.map((student, index) => (
                <div key={student.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8">
                      {getRankBadge(index)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{student.first_name} {student.last_name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Zap size={12} className="text-amber-500" />
                        <span className="text-xs font-semibold text-slate-500">{student.score} XP</span>
                      </div>
                    </div>
                  </div>

                  {/* Bouton Récompense pour les meilleurs */}
                  {index < 3 && (
                    <button 
                      onClick={() => triggerN8NAction('SEND_REWARD', { studentId: student.id, rank: index + 1, score: student.score }, `reward_${student.id}`)}
                      disabled={actionLoading === `reward_${student.id}`}
                      className="opacity-0 group-hover:opacity-100 flex items-center gap-2 text-xs font-bold text-emerald-600 hover:text-white bg-emerald-50 hover:bg-emerald-500 px-3 py-1.5 rounded-lg transition-all"
                    >
                      {actionLoading === `reward_${student.id}` ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <>
                          <Gift size={14} /> Récompenser
                        </>
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-brand-50 border border-brand-100 rounded-2xl p-6 flex items-start gap-4">
             <Trophy className="text-brand-600 shrink-0" size={24} />
             <div>
               <h4 className="font-bold text-brand-900 mb-1">Mécanique de récompense active</h4>
               <p className="text-sm text-brand-700 leading-relaxed">
                 Le bouton <strong>"Récompenser"</strong> déclenche un Webhook N8N qui enverra automatiquement un email de félicitations accompagné d'un code cadeau (via l'API d'un partenaire comme Wedoogift ou Amazon) au stagiaire méritant.
               </p>
             </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}