import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Enregistrement d'une police plus moderne (optionnel, sinon utilise Helvetica par défaut)
// Font.register({ family: 'Inter', src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff' });

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#1A1A1A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  companyInfo: {
    flexDirection: 'column',
  },
  brand: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0061FF',
    marginBottom: 4,
  },
  documentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'right',
    textTransform: 'uppercase',
  },
  section: {
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  addressBox: {
    width: '45%',
  },
  label: {
    color: '#666666',
    fontSize: 8,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  bold: {
    fontWeight: 'bold',
  },
  // Table Styles
  table: {
    marginTop: 20,
    width: 'auto',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  colDesc: { width: '60%' },
  colQty: { width: '10%', textAlign: 'center' },
  colPrice: { width: '15%', textAlign: 'right' },
  colTotal: { width: '15%', textAlign: 'right' },
  
  // Totals
  totalsContainer: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  totalsBox: {
    width: '35%',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  grandTotal: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    marginTop: 8,
    paddingTop: 8,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0061FF',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 8,
  }
});

interface InvoiceProps {
  data: {
    number: string;
    date: string;
    clientName: string;
    clientEmail: string;
    items: Array<{ description: string; qty: number; price: number }>;
    taxRate: number;
  };
}

export const InvoiceTemplate = ({ data }: InvoiceProps) => {
  const subtotal = data.items.reduce((acc, item) => acc + item.qty * item.price, 0);
  const tax = subtotal * (data.taxRate / 100);
  const total = subtotal + tax;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            <Text style={styles.brand}>AUSTRALEHUB</Text>
            <Text>123 Rue de la Formation</Text>
            <Text>97400 Saint-Denis, La Réunion</Text>
            <Text>Siret: 123 456 789 00012</Text>
          </View>
          <View>
            <Text style={styles.documentTitle}>FACTURE</Text>
            <Text style={{ textAlign: 'right', marginTop: 4 }}>N° {data.number}</Text>
          </View>
        </View>

        {/* Client Info */}
        <View style={styles.grid}>
          <View style={styles.addressBox}>
            <Text style={styles.label}>Facturé à</Text>
            <Text style={styles.bold}>{data.clientName}</Text>
            <Text>{data.clientEmail}</Text>
          </View>
          <View style={[styles.addressBox, { textAlign: 'right' }]}>
            <Text style={styles.label}>Date d'émission</Text>
            <Text>{data.date}</Text>
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colDesc}>Description</Text>
            <Text style={styles.colQty}>Qté</Text>
            <Text style={styles.colPrice}>Prix Unitaire</Text>
            <Text style={styles.colTotal}>Total HT</Text>
          </View>

          {data.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.colDesc}>{item.description}</Text>
              <Text style={styles.colQty}>{item.qty}</Text>
              <Text style={styles.colPrice}>{item.price.toFixed(2)} €</Text>
              <Text style={styles.colTotal}>{(item.qty * item.price).toFixed(2)} €</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsContainer}>
          <View style={styles.totalsBox}>
            <View style={styles.totalRow}>
              <Text>Sous-total HT</Text>
              <Text>{subtotal.toFixed(2)} €</Text>
            </View>
            <View style={styles.totalRow}>
              <Text>TVA ({data.taxRate}%)</Text>
              <Text>{tax.toFixed(2)} €</Text>
            </View>
            <View style={[styles.totalRow, styles.grandTotal]}>
              <Text>Total TTC</Text>
              <Text>{total.toFixed(2)} €</Text>
            </View>
          </View>
        </View>

        <Footer />
      </Page>
    </Document>
  );
};

const Footer = () => (
  <View style={styles.footer}>
    <Text>AustraleHub - Logiciel de gestion certifié. Paiement par virement sous 30 jours.</Text>
    <Text style={{ marginTop: 2 }}>IBAN: FR76 1234 5678 9012 3456 7890 123 - BIC: AUSTFR2X</Text>
  </View>
);