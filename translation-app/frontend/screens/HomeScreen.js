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
        <View style={styles.headerIcon}>
          <Ionicons name="home" size={24} color="#fff" />
        </View>
        <Text style={styles.headerTitle}>الصفحة الرئيسية</Text>
      </View>

      <View style={styles.welcomeContainer}>
        <View style={styles.welcomeRow}>
          <Text style={styles.welcomeText}>مرحبا</Text>
          <Text style={styles.userName}>{user?.username}</Text>
        </View>
        <TouchableOpacity style={styles.languageSelector}>
          <Image
            source={require("../assets/home.png")}
            style={styles.flagIcon}
          />
          <Ionicons name="chevron-down" size={16} color="#64748b" />
        </TouchableOpacity>
      </View>

      <Text style={styles.featuresTitle}>Features</Text>

      <View style={styles.optionsContainer}>
        <TouchableOpacity 
          style={[styles.optionCard, styles.signCard]}
          onPress={() => navigation.navigate('WebView')}
        >
          <View style={styles.optionIconContainer}>
            <MaterialCommunityIcons name="hand" size={24} color="#fff" />
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>ترجمة لغة الاشارة</Text>
            <Text style={styles.optionSubtitle}>Sign-to-Text • Sign-to-Speech</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.optionCard, styles.wordCard]}>
          <View style={[styles.optionIconContainer, styles.wordIconContainer]}>
            <MaterialCommunityIcons name="text-box-outline" size={24} color="#fff" />
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>الترجمة الصوتية</Text>
            <Text style={styles.optionSubtitle}>Speech-to-Sign • Text-to-Sign</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          اللغة الافتراضية هي اللغة العربية
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2563eb', // Blue-600
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#1d4ed8', // Blue-700
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  welcomeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 24,
  },
  welcomeRow: {
    flexDirection: 'column',
  },
  welcomeText: {
    fontSize: 14,
    color: '#64748b', // Slate-500
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a', // Slate-900
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0', // Slate-200
    borderRadius: 8,
  },
  flagIcon: {
    width: 20,
    height: 15,
    marginRight: 4,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#64748b', // Slate-500
    marginLeft: 16,
    marginBottom: 12,
  },
  optionsContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  signCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6', // Blue-500
  },
  wordCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#0ea5e9', // Sky-500
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#3b82f6', // Blue-500
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  wordIconContainer: {
    backgroundColor: '#0ea5e9', // Sky-500
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a', // Slate-900
  },
  optionSubtitle: {
    fontSize: 12,
    color: '#64748b', // Slate-500
    marginTop: 2,
  },
  infoContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#eff6ff', // Blue-50
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dbeafe', // Blue-100
    borderStyle: 'dashed',
  },
  infoText: {
    fontSize: 14,
    color: '#1e40af', // Blue-800
    lineHeight: 20,
  },
});

export default HomeScreen;