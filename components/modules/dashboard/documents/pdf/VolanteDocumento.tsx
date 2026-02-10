import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Registrar fuente (Opcional, usar Helvetica por defecto si no hay fuente externa)
Font.register({
  family: 'Montserrat',
  src: 'https://fonts.gstatic.com/s/montserrat/v15/JTUSjIg1_i6t8kCHKm459Wlhyw.ttf'
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Montserrat',
    fontSize: 10,
    color: '#333'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#9D2449',
    paddingBottom: 10
  },
  logo: {
    width: 120, // Ajustar según logo real
    height: 40
  },
  titleContainer: {
    textAlign: 'center'
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#9D2449',
    marginBottom: 4
  },
  subtitle: {
    fontSize: 8,
    color: '#666'
  },
  folioContainer: {
    marginTop: 10,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderRadius: 4
  },
  folioText: {
    fontSize: 12,
    fontWeight: 'bold'
  },
  section: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#9D2449',
    marginBottom: 5,
    textTransform: 'uppercase'
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4
  },
  label: {
    width: 100,
    fontWeight: 'bold',
    color: '#555'
  },
  value: {
    flex: 1
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 7,
    color: '#999',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10
  },
  qrContainer: {
    marginTop: 5,
    alignItems: 'center'
  }
});

interface VolanteDocumentoProps {
  document: any; // Tipar con DocumentDTO idealmente
  qrCodeUrl?: string;
}

export const VolanteDocumento = ({ document, qrCodeUrl }: VolanteDocumentoProps) => (
  <Document>
    <Page size="LETTER" style={styles.page}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text>ISSSTE</Text> 
        <View style={styles.titleContainer}>
            <Text style={styles.title}>VOLANTE DE TURNADO</Text>
            <Text style={styles.subtitle}>Sistema de Gestión Documental</Text>
        </View>
        <Text>FOVISSSTE</Text>
      </View>

      {/* Folio y Fecha */}
      <View style={styles.folioContainer}>
          <Text style={styles.folioText}>FOLIO: {document.official_number}</Text>
          <Text>Fecha: {format(new Date(document.reception_date), "dd 'de' MMMM yyyy, HH:mm", { locale: es })}</Text>
      </View>

      {/* Remitente */}
      <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos del Remitente</Text>
          <View style={styles.row}>
              <Text style={styles.label}>Nombre:</Text>
              <Text style={styles.value}>{document.sender_name}</Text>
          </View>
          <View style={styles.row}>
              <Text style={styles.label}>Cargo:</Text>
              <Text style={styles.value}>{document.sender_position || 'No especificado'}</Text>
          </View>
          <View style={styles.row}>
              <Text style={styles.label}>Dependencia:</Text>
              <Text style={styles.value}>{document.sender_dependency}</Text>
          </View>
      </View>

      {/* Destinatario */}
      <View style={styles.section}>
          <Text style={styles.sectionTitle}>Asignación Actual</Text>
          <View style={styles.row}>
              <Text style={styles.label}>Área:</Text>
              <Text style={styles.value}>{document.assigned_department?.name || 'Sin Asignar'}</Text>
          </View>
          <View style={styles.row}>
              <Text style={styles.label}>Titular:</Text>
              <Text style={styles.value}>{document.assigned_department?.titular_name || 'No Registrado'}</Text>
          </View>
      </View>

      {/* Detalles del Asunto */}
      <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalles del Documento</Text>
          <View style={styles.row}>
              <Text style={styles.label}>Asunto:</Text>
              <Text style={styles.value}>{document.description}</Text>
          </View>
          <View style={{...styles.row, marginTop: 10}}>
              <Text style={styles.label}>Instrucciones:</Text>
              <Text style={styles.value}>
                  Atender conforme a la normatividad vigente. {document.priority === 'URGENTE' ? 'ASUNTO URGENTE.' : ''}
              </Text>
          </View>
      </View>

      {/* Plazos */}
      <View style={styles.section}>
          <View style={styles.row}>
              <Text style={styles.label}>Prioridad:</Text>
              <Text style={{...styles.value, color: document.priority === 'URGENTE' ? 'red' : 'black'}}>
                  {document.priority}
              </Text>
          </View>
          <View style={styles.row}>
              <Text style={styles.label}>Fecha Límite:</Text>
              <Text style={styles.value}>
                  {format(new Date(document.deadline), "dd 'de' MMMM yyyy", { locale: es })}
              </Text>
          </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
          <Text>Este documento es de carácter informativo y no sustituye al documento original.</Text>
          <Text>Generado el: {format(new Date(), "dd/MM/yyyy HH:mm:ss")} | ID Unico: {document.id}</Text>
          <Text>Fondo de la Vivienda del ISSSTE - Gestión Documental</Text>
          {qrCodeUrl && (
              <View style={styles.qrContainer}>
                  <Image src={qrCodeUrl} style={{ width: 50, height: 50 }} />
              </View>
          )}
      </View>

    </Page>
  </Document>
);
