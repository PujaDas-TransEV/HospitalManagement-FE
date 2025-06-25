
import React from 'react';
import { Page, Text, Document, StyleSheet, View, Image, Line } from '@react-pdf/renderer';

const hospitalLogo = 'https://i.ibb.co/rc5QkC4/hospital-logo.png';

const styles = StyleSheet.create({
  page: {
    padding: 35,
    fontSize: 11,
    fontFamily: 'Helvetica',
    backgroundColor: '#f9fafa',
    color: '#333',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: '#007bff',
    paddingBottom: 10,
    marginBottom: 20,
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  hospitalName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
  },
  doctorSection: {
    textAlign: 'right',
  },
  sectionTitle: {
    fontSize: 13,
    marginBottom: 8,
    marginTop: 16,
    color: '#0056b3',
    fontWeight: 'bold',
    textDecoration: 'underline',
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    color: '#555',
    width: '40%',
  },
  value: {
    width: '60%',
    color: '#222',
  },
  box: {
    padding: 16,
    border: '1 solid #ccc',
    borderRadius: 6,
    backgroundColor: '#ffffff',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    fontSize: 9,
    textAlign: 'center',
    width: '100%',
    color: '#999',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: 12,
  },
});

const InfoRow = ({ label, value }) => (
  <View style={styles.infoGrid}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value || '-'}</Text>
  </View>
);

const LabReportPDF = ({ report }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoSection}>
          <Image src={hospitalLogo} style={styles.logo} />
          <Text style={styles.hospitalName}>LifeCare Hospital</Text>
        </View>
        <View style={styles.doctorSection}>
          <Text>Doctor Referral:</Text>
          <Text>{report.doctorreferal}</Text>
        </View>
      </View>

      {/* Report Box */}
      <Text style={styles.sectionTitle}>Patient Information</Text>
      <View style={styles.box}>
        <InfoRow label="Patient Name" value={report.patientname} />
        <InfoRow label="Patient Age" value={report.patientage} />
        <InfoRow label="Symptoms" value={report.patientsymptoms} />
      </View>

      <Text style={styles.sectionTitle}>Test Details</Text>
      <View style={styles.box}>
        <InfoRow label="Lab Report ID" value={report.labreportid} />
        <InfoRow label="Lab Reference ID" value={report.labphyreportid} />
        <InfoRow label="Type of Test" value={report.typeoftest} />
        <InfoRow label="Final Report Summary" value={report.finalreport} />
        <InfoRow label="Created At" value={new Date(report.createdat).toLocaleString()} />
      </View>

      <Text style={styles.sectionTitle}>Remarks</Text>
      <View style={styles.box}>
        <Text style={{ color: '#444' }}>
          This report is electronically generated and does not require a physical signature.
        </Text>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        © {new Date().getFullYear()} LifeCare Hospital — All rights reserved | lifecarehospital.com
      </Text>
    </Page>
  </Document>
);

export default LabReportPDF;
