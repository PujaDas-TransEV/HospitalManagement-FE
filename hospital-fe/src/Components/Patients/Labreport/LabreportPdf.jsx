
// import React from 'react';
// import { Page, Text, Document, StyleSheet, View, Image } from '@react-pdf/renderer';

// // Replace with your hospital logo path or external URL
// const hospitalLogo = 'https://i.ibb.co/rc5QkC4/hospital-logo.png';

// const styles = StyleSheet.create({
//   page: {
//     padding: 30,
//     fontFamily: 'Helvetica',
//     fontSize: 12,
//     lineHeight: 1.6,
//     backgroundColor: '#f0f4f8',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 25,
//     borderBottom: '2px solid #007bff',
//     paddingBottom: 10,
//   },
//   hospitalInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   logo: {
//     width: 40,
//     height: 40,
//     marginRight: 10,
//   },
//   hospitalName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#007bff',
//   },
//   doctorInfo: {
//     textAlign: 'right',
//     fontSize: 12,
//     color: '#333',
//   },
//   box: {
//     backgroundColor: '#ffffff',
//     borderRadius: 6,
//     padding: 20,
//     boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
//   },
//   label: {
//     fontWeight: 'bold',
//     color: '#007bff',
//   },
//   value: {
//     marginBottom: 8,
//     color: '#333',
//   },
//   section: {
//     marginBottom: 12,
//   },
//   footer: {
//     position: 'absolute',
//     bottom: 30,
//     textAlign: 'center',
//     fontSize: 10,
//     color: '#666',
//     width: '100%',
//   },
// });

// const LabReportPDF = ({ report }) => (
//   <Document>
//     <Page style={styles.page}>

//       {/* Header Section */}
//       <View style={styles.header}>
//         <View style={styles.hospitalInfo}>
//           <Image src={hospitalLogo} style={styles.logo} />
//           <Text style={styles.hospitalName}>LifeCare Hospital</Text>
//         </View>
//         <View style={styles.doctorInfo}>
//           <Text>Doctor Referral:</Text>
//           <Text>{report.doctorreferal}</Text>
//         </View>
//       </View>

//       {/* Report Info Box */}
//       <View style={styles.box}>
//         <View style={styles.section}>
//           <Text style={styles.label}>Lab Report ID:</Text>
//           <Text style={styles.value}>{report.labreportid}</Text>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.label}>Lab Reference ID:</Text>
//           <Text style={styles.value}>{report.labphyreportid}</Text>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.label}>Patient Name:</Text>
//           <Text style={styles.value}>{report.patientname}</Text>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.label}>Patient Age:</Text>
//           <Text style={styles.value}>{report.patientage}</Text>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.label}>Symptoms:</Text>
//           <Text style={styles.value}>{report.patientsymptoms}</Text>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.label}>Type of Test:</Text>
//           <Text style={styles.value}>{report.typeoftest}</Text>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.label}>Final Report:</Text>
//           <Text style={styles.value}>{report.finalreport}</Text>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.label}>Created At:</Text>
//           <Text style={styles.value}>{new Date(report.createdat).toLocaleString()}</Text>
//         </View>
//       </View>

//       {/* Footer */}
//       <Text style={styles.footer}>
//         © {new Date().getFullYear()} LifeCare Hospital. All rights reserved.
//       </Text>
//     </Page>
//   </Document>
// );

// export default LabReportPDF;
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
