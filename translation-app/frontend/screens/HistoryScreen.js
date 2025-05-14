import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

const HistoryScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>السجل</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.text}>سوف تظهر هنا سجل الترجمات الخاصة بك.</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 16,
    backgroundColor: '#2563eb',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
});

export default HistoryScreen;