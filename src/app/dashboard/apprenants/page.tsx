"use client";
import React, { useEffect, useState } from 'react';
import { Table, THead, Th, Td, Badge } from '@/components/ui/Table';
import { createClient } from '@/utils/supabase/client';
import { Student } from '@/types/database';
import { User, CreditCard, ExternalLink, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchStudents = async () => {
      // Jointure Supabase pour récupérer la session et le statut de la dernière facture
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          training_sessions(title),
          invoices(status, amount_ttc)
        `)
        .order('last_name');
      
      if (!error) setStudents(data);
      setLoading(false);
    };
    fetchStudents();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Apprenants</h1>
        <p className="text-slate-500 text-sm">Suivi individuel et état de facturation (Inqom).</p>
      </div>

      <Table>
        <THead>
          <tr>
            <Th>Apprenant</Th>
            <Th>Session</Th>
            <Th>Statut Administratif</Th>
            <Th>État Facture (Inqom)</Th>
            <Th>Actions</Th>
          </tr>
        </THead>
        <tbody>
          {loading ? (
             <tr><Td className="text-center py-12"><span className="animate-pulse">Chargement...</span></Td></tr>
          ) : (
            students.map((student, index) => (
              <motion.tr 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                key={student.id} 
                className="hover:bg-slate-50/50 transition-colors"
              >
                <Td>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-xs">
                      {student.first_name[0]}{student.last_name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{student.first_name} {student.last_name}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1"><Mail size={10} /> {student.email}</p>
                    </div>
                  </div>
                </Td>
                <Td>
                  <span className="text-slate-600 italic text-xs">{student.training_sessions?.title || 'Sans session'}</span>
                </Td>
                <Td>
                  <Badge variant={student.status === 'active' ? 'success' : 'warning'}>
                    {student.status === 'active' ? 'Actif' : 'Désisté'}
                  </Badge>
                </Td>
                <Td>
                   {student.invoices?.[0] ? (
                     <div className="flex items-center gap-2">
                        <Badge variant={student.invoices[0].status === 'paid' ? 'success' : 'error'}>
                          {student.invoices[0].status === 'paid' ? 'Payée' : 'En retard'}
                        </Badge>
                        <span className="text-xs font-mono text-slate-400">{student.invoices[0].amount_ttc}€</span>
                     </div>
                   ) : (
                     <span className="text-xs text-slate-400">Aucune facture</span>
                   )}
                </Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <button title="Voir profil" className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-brand-600 transition-all">
                      <User size={16} />
                    </button>
                    <button title="Générer Devis/Facture" className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-brand-600 transition-all">
                      <CreditCard size={16} />
                    </button>
                  </div>
                </Td>
              </motion.tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
}