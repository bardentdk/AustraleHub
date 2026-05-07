"use client";
import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { InvoiceTemplate } from '../pdf/InvoiceTemplate';
import { FileText, Download, Loader2 } from 'lucide-react';

interface Props {
  invoiceData: any;
}

export function GenerateInvoiceButton({ invoiceData }: Props) {
  return (
    <PDFDownloadLink
      document={<InvoiceTemplate data={invoiceData} />}
      fileName={`facture-${invoiceData.number}.pdf`}
    >
      {({ loading }) => (
        <button
          disabled={loading}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all
            ${loading 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
              : 'bg-brand-50 text-brand-600 hover:bg-brand-100'}
          `}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          {loading ? 'Génération...' : 'Télécharger PDF'}
        </button>
      )}
    </PDFDownloadLink>
  );
}