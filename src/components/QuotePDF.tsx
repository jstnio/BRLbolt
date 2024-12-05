import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Quote } from '../types/quote';
import { formatNumber, formatShortDate } from '../lib/utils';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: 20,
  },
  logo: {
    width: 80,
    height: 40,
    backgroundColor: '#193375',
  },
  logoText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 8,
  },
  headerInfo: {
    textAlign: 'right',
  },
  headerText: {
    fontSize: 10,
    color: '#4b5563',
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#193375',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    backgroundColor: '#f3f4f6',
    padding: 8,
    color: '#193375',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  column: {
    flex: 1,
    padding: 8,
  },
  label: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 4,
  },
  value: {
    fontSize: 11,
    color: '#111827',
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    padding: 8,
    borderBottom: '1px solid #e5e7eb',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #e5e7eb',
    padding: 8,
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
    color: '#374151',
  },
  total: {
    marginTop: 20,
    alignItems: 'flex-end',
    paddingRight: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 11,
    color: '#374151',
    marginRight: 20,
  },
  totalValue: {
    fontSize: 11,
    color: '#111827',
    width: 100,
    textAlign: 'right',
  },
  totalFinal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#193375',
  },
  terms: {
    marginTop: 30,
    padding: 12,
    backgroundColor: '#f9fafb',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#6b7280',
    borderTop: '1px solid #e5e7eb',
    paddingTop: 20,
  },
});

interface Props {
  quote: Quote;
}

export default function QuotePDF({ quote }: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>BRL</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.headerText}>Quote Reference: {quote.reference}</Text>
            <Text style={styles.headerText}>Issue Date: {formatShortDate(quote.createdAt)}</Text>
            <Text style={styles.headerText}>Valid Until: {formatShortDate(quote.validity.validUntil)}</Text>
          </View>
        </View>

        <Text style={styles.title}>
          {quote.type === 'air' ? 'Air Freight' : 'Ocean Freight'} Quote
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Partners</Text>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Shipper</Text>
              <Text style={styles.value}>{quote.shipper.company}</Text>
              <Text style={styles.value}>{quote.shipper.name}</Text>
              <Text style={styles.value}>{quote.shipper.email}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Consignee</Text>
              <Text style={styles.value}>{quote.consignee.company}</Text>
              <Text style={styles.value}>{quote.consignee.name}</Text>
              <Text style={styles.value}>{quote.consignee.email}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Route Details</Text>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>{quote.type === 'air' ? 'Airport of Origin' : 'Port of Origin'}</Text>
              <Text style={styles.value}>{quote.origin.name}</Text>
              <Text style={styles.value}>{quote.origin.city}, {quote.origin.country}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>{quote.type === 'air' ? 'Airport of Destination' : 'Destination Port'}</Text>
              <Text style={styles.value}>{quote.destination.name}</Text>
              <Text style={styles.value}>{quote.destination.city}, {quote.destination.country}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cargo Details</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, { flex: 2 }]}>Description</Text>
              <Text style={styles.tableCell}>Pieces</Text>
              <Text style={styles.tableCell}>Weight (kg)</Text>
              <Text style={styles.tableCell}>Volume (m³)</Text>
            </View>
            {quote.cargoDetails.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 2 }]}>{item.description}</Text>
                <Text style={styles.tableCell}>{item.pieces}</Text>
                <Text style={styles.tableCell}>{formatNumber(item.grossWeight)}</Text>
                <Text style={styles.tableCell}>{formatNumber(item.volume)}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Charges</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, { flex: 2 }]}>Description</Text>
              <Text style={styles.tableCell}>Unit</Text>
              <Text style={styles.tableCell}>Qty</Text>
              <Text style={styles.tableCell}>Rate</Text>
              <Text style={styles.tableCell}>Amount</Text>
            </View>
            {quote.costs.map((cost, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 2 }]}>{cost.description}</Text>
                <Text style={styles.tableCell}>{cost.unit}</Text>
                <Text style={styles.tableCell}>{cost.quantity || 1}</Text>
                <Text style={styles.tableCell}>
                  {quote.currency} {formatNumber(cost.amount)}
                </Text>
                <Text style={styles.tableCell}>
                  {quote.currency} {formatNumber(Number(cost.amount) * (cost.quantity || 1))}
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.total}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>
                {quote.currency} {formatNumber(quote.subtotal)}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Taxes</Text>
              <Text style={styles.totalValue}>
                {quote.currency} {formatNumber(quote.taxes)}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, styles.totalFinal]}>Total</Text>
              <Text style={[styles.totalValue, styles.totalFinal]}>
                {quote.currency} {formatNumber(quote.total)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.terms}>
          <Text style={styles.sectionTitle}>Terms & Conditions</Text>
          {quote.terms.map((term, index) => (
            <Text key={index} style={styles.value}>• {term}</Text>
          ))}
        </View>

        {quote.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Notes</Text>
            <Text style={styles.value}>{quote.notes}</Text>
          </View>
        )}

        <Text style={styles.footer}>
          BRL Global Logistics • www.brlglobal.com • +1 234 567 8900
        </Text>
      </Page>
    </Document>
  );
}