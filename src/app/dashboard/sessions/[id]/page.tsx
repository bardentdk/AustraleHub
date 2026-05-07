"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { TrainingSession, Student } from '@/types/database';
import { Badge, Table, THead, Th, Td } from '@/components/ui/Table';
import { 
  ArrowLeft, 
  CalendarDays, 
  Users, 
  FileSignature, 
  AlertTriangle,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function SessionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;
  
  const [session, setSession] = useState<TrainingSession | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchSessionDetails = async () => {
      // 1. Récupérer la session
      const { data: sessionData, error: sessionError } = await supabase
        .from('training_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();
      
      // 2. Récupérer les apprenants liés à cette session
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('*')
        .eq('session_id', sessionId);

      if (!sessionError) setSession(sessionData);
      if (!studentsError && studentsData) setStudents(studentsData);
      
      setLoading(false);
    };

    if (sessionId) fetchSessionDetails();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <span className="animate-pulse text-slate-400 font-medium">Chargement des données Digiforma...</span>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Session introuvable</h2>
        <button onClick={() => router.push('/dashboard/sessions')} className="text-brand-600 hover:underline">
          Retour aux sessions
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-8"
    >
      {/* Header Navigation */}
      <button 
        onClick={() => router.push('/dashboard/sessions')}
        className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft size={16} />
        Retour aux sessions
      </button>

      {/* Hero Card Session */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <CalendarDays size={200} />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-1 rounded font-bold uppercase tracking-wider">
                Source: Digiforma
              </span>
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
              <span className="font-bold text-slate-900">{new Date(session.start_date).toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center min-w-[120px]">
              <CheckCircle2 className="text-emerald-500 mb-1" size={20} />
              <span className="text-xs text-slate-500 uppercase font-semibold">Fin</span>
              <span className="font-bold text-slate-900">{new Date(session.end_date).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de contenu */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Colonne Principale : Émargements (Mockup prêt pour Digiforma) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileSignature className="text-slate-400" size={20} />
              Suivi des émargements
            </h2>
            <button className="text-sm font-medium text-brand-600 hover:text-brand-700 bg-brand-50 px-4 py-2 rounded-lg transition-colors">
              Relancer les retardataires
            </button>
          </div>

          <Table>
            <THead>
              <tr>
                <Th>Apprenant</Th>
                <Th>Statut</Th>
                <Th>Assiduité</Th>
              </tr>
            </THead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <Td className="text-center py-8 text-slate-500 italic" colSpan={3}>
                    Aucun apprenant synchronisé pour le moment (En attente de Nell App).
                  </Td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <Td className="font-medium text-slate-900">
                      {student.first_name} {student.last_name}
                    </Td>
                    <Td>
                      <Badge variant="success">Signé (Aujourd'hui)</Badge>
                    </Td>
                    <Td>
                      <div className="w-full bg-slate-100 rounded-full h-2.5">
                        <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </Td>
                  </tr>
                ))
              )}
              {/* Ligne fictive pour montrer le design des retards Digiforma */}
              <tr className="bg-red-50/30">
                <Td className="font-medium text-slate-900 flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Jean Dupont (Exemple)
                </Td>
                <Td>
                  <Badge variant="error">Non signé</Badge>
                </Td>
                <Td>
                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                    <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </Td>
              </tr>
            </tbody>
          </Table>
        </div>

        {/* Sidebar Droite : Planning et Infos */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Users className="text-slate-400" size={18} />
              Infos Groupe
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <span className="text-slate-500 text-sm">Effectif</span>
                <span className="font-bold text-slate-900">{students.length} inscrits</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <span className="text-slate-500 text-sm">Formateur</span>
                <span className="font-medium text-slate-900">Mme Habibou</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-sm">Salle</span>
                <span className="font-medium text-slate-900">Virtuelle (Zoom)</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl">
             <div className="flex items-start gap-3">
               <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={20} />
               <div>
                 <h4 className="font-bold text-amber-900 mb-1">Alertes Digiforma</h4>
                 <p className="text-sm text-amber-700 leading-relaxed">
                   1 apprenant n'a pas encore signé la convention de formation. Une relance automatique est planifiée pour demain 08:00.
                 </p>
               </div>
             </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}