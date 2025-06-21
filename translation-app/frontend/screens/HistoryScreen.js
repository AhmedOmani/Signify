import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const HistoryScreen = () => {
  // Example: Replace this with data from backend in the future
  const [history, setHistory] = useState([
    { id: 1, text: 'مرحبا نحن فريق ساينفاي لمساعدة الصم' },
    // Add more items here as needed
  ]);

  const handleDelete = (id) => {
    setHistory(history.filter(item => item.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>السجل</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {history.length > 0 ? (
          history.map(item => (
            <View style={styles.historyCard} key={item.id}>
              <Text style={styles.historyText}>{item.text}</Text>
              <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                <MaterialCommunityIcons name="trash-can-outline" size={22} color="blue" />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.text}>سوف تظهر هنا سجل الترجمات الخاصة بك.</Text>
        )}
      </ScrollView>
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
    padding: 20,
    alignItems: 'stretch',
  },
  text: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 40,
  },
  historyCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#2563eb',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  historyText: {
    fontSize: 18,
    color: '#2563eb',
    fontWeight: 'bold',
    textAlign: 'right',
    flex: 1,
  },
  deleteButton: {
    marginLeft: 12,
    padding: 4,
  },
});

export default HistoryScreen;