"use client";
import React from 'react';
import { Table, THead, Th, Td, Badge } from '@/components/ui/Table';
import { GenerateInvoiceButton } from '@/components/dashboard/GenerateInvoiceButton';
import { CreditCard, ArrowUpRight, TrendingDown, DollarSign } from 'lucide-react';

// Exemple de données "Inqom style"
const MOCK_INVOICES = [
  {
    id: '1',
    number: 'FAC-2024-001',
    clientName: 'Jean Dupont',
    clientEmail: 'jean.dupont@email.com',
    date: '15/05/2026',
    amount_ttc: 1200.00,
    status: 'paid',
    taxRate: 20,
    items: [{ description: 'Formation Compta Quadratus - 3 jours', qty: 1, price: 1000 }]
  },
  {
    id: '2',
    number: 'FAC-2024-002',
    clientName: 'Marie Payet',
    clientEmail: 'm.payet@orange.re',
    date: '18/05/2026',
    amount_ttc: 450.00,
    status: 'pending',
    taxRate: 8.5, // Taux Réunion
    items: [{ description: 'Module Excel Expert', qty: 1, price: 414.75 }]
  }
];

export default function FinancePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Finance & Facturation</h1>
        <p className="text-slate-500">Centralisation des données Inqom et génération de documents.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign size={20} />
            </div>
            <span className="text-xs font-bold text-emerald-600">+12%</span>
          </div>
          <p className="text-sm text-slate-500 font-medium">Chiffre d'Affaires</p>
          <p className="text-2xl font-bold text-slate-900">42 850 €</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between mb-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
              <TrendingDown size={20} />
            </div>
            <span className="text-xs font-bold text-orange-600">4 en retard</span>
          </div>
          <p className="text-sm text-slate-500 font-medium">Encours clients</p>
          <p className="text-2xl font-bold text-slate-900">3 120 €</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
        <Table>
          <THead>
            <tr>
              <Th>N° Facture</Th>
              <Th>Client</Th>
              <Th>Montant TTC</Th>
              <Th>Statut</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </THead>
          <tbody>
            {MOCK_INVOICES.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                <Td className="font-mono text-xs font-bold text-slate-500">{inv.number}</Td>
                <Td>
                  <p className="font-bold text-slate-900">{inv.clientName}</p>
                  <p className="text-xs text-slate-400">{inv.clientEmail}</p>
                </Td>
                <Td className="font-bold text-slate-900">{inv.amount_ttc.toFixed(2)} €</Td>
                <Td>
                  <Badge variant={inv.status === 'paid' ? 'success' : 'warning'}>
                    {inv.status === 'paid' ? 'Payée' : 'En attente'}
                  </Badge>
                </Td>
                <Td className="text-right">
                  <GenerateInvoiceButton invoiceData={inv} />
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}