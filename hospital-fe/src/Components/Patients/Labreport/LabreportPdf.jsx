
import React from 'react';
import { Page, Text, Document, StyleSheet, View, Image } from '@react-pdf/renderer';

// Replace with your hospital logo path or external URL
const hospitalLogo = 'https://i.ibb.co/rc5QkC4/hospital-logo.png';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 12,
    lineHeight: 1.6,
    backgroundColor: '#f0f4f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    borderBottom: '2px solid #007bff',
    paddingBottom: 10,
  },
  hospitalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  hospitalName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
  },
  doctorInfo: {
    textAlign: 'right',
    fontSize: 12,
    color: '#333',
  },
  box: {
    backgroundColor: '#ffffff',
    borderRadius: 6,
    padding: 20,
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  label: {
    fontWeight: 'bold',
    color: '#007bff',
  },
  value: {
    marginBottom: 8,
    color: '#333',
  },
  section: {
    marginBottom: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#666',
    width: '100%',
  },
});

const LabReportPDF = ({ report }) => (
  <Document>
    <Page style={styles.page}>

      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.hospitalInfo}>
          <Image src={hospitalLogo} style={styles.logo} />
          <Text style={styles.hospitalName}>LifeCare Hospital</Text>
        </View>
        <View style={styles.doctorInfo}>
          <Text>Doctor Referral:</Text>
          <Text>{report.doctorreferal}</Text>
        </View>
      </View>

      {/* Report Info Box */}
      <View style={styles.box}>
        <View style={styles.section}>
          <Text style={styles.label}>Lab Report ID:</Text>
          <Text style={styles.value}>{report.labreportid}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Lab Reference ID:</Text>
          <Text style={styles.value}>{report.labphyreportid}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Patient Name:</Text>
          <Text style={styles.value}>{report.patientname}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Patient Age:</Text>
          <Text style={styles.value}>{report.patientage}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Symptoms:</Text>
          <Text style={styles.value}>{report.patientsymptoms}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Type of Test:</Text>
          <Text style={styles.value}>{report.typeoftest}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Final Report:</Text>
          <Text style={styles.value}>{report.finalreport}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Created At:</Text>
          <Text style={styles.value}>{new Date(report.createdat).toLocaleString()}</Text>
        </View>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        © {new Date().getFullYear()} LifeCare Hospital. All rights reserved.
      </Text>
    </Page>
  </Document>
);

export default LabReportPDF;
