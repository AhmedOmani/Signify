import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = ({ user }) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="account-circle" size={32} color="#2563eb" />
        <Text style={styles.greeting}>مرحباً ahmed</Text>
      </View>
      <Text style={styles.featuresTitle}>الخدمات</Text>
      <View style={styles.cardContainer}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('WebView')}>
          <MaterialCommunityIcons name="hand-wave" size={36} color="#2563eb" style={styles.cardIcon} />
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>ترجمة لغة الإشارة</Text>
          </View>
         
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('SignAnimationScreen')}>
          <MaterialCommunityIcons name="microphone" size={36} color="#2563eb" style={styles.cardIcon} />
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>الترجمة الصوتية</Text>
          </View>
         
        </TouchableOpacity>
      </View>
      <View style={styles.languageBox}>
        <MaterialCommunityIcons name="translate" size={20} color="#2563eb" />
        <Text style={styles.languageText}>اللغة الافتراضية هي اللغة العربية</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 32,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    marginLeft: 10,
    marginTop: 8,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
    marginLeft: 8,
  },
  featuresTitle: {
    fontSize: 18,
    color: '#64748b',
    fontWeight: 'bold',
    marginBottom: 18,
    marginTop: 8,
    marginRight: 310,
    textAlign: 'right',
    alignSelf: 'flex-end',
  },
  cardContainer: {
    gap: 18,
    marginBottom: 24,
    marginTop: 0,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 18,
    marginBottom: 16,
    marginRight: 10,
    marginLeft: 15,
    elevation: 3,
    shadowColor: '#2563eb',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  cardIcon: {
    marginRight: 14,
  },
  cardText: {
    flex: 1,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#64748b',
  },
  languageBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e7ff',
    borderRadius: 10,
    padding: 10,
    marginTop: 18,
    alignSelf: 'center',
  },
  languageText: {
    color: '#2563eb',
    fontSize: 15,
    marginLeft: 6,
  },
});

export default HomeScreen;