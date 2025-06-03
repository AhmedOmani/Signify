import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Switch, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SettingsScreen = ({ onLogout }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>الإعدادات</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>التفضيلات</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="moon-outline" size={22} color="#2563eb" style={styles.settingIcon} />
            <Text style={styles.settingText}>الوضع الليلي</Text>
          </View>
          <Switch
            trackColor={{ false: '#cbd5e1', true: '#93c5fd' }}
            thumbColor={'#f1f5f9'}
            value={false}
            disabled={true}
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>اللغة</Text>
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="language-outline" size={22} color="#2563eb" style={styles.settingIcon} />
            <Text style={styles.settingText}>لغة الإشارة</Text>
          </View>
          <View style={styles.valueContainer}>
            <Text style={styles.valueText}>Arabic</Text>
            <Ionicons name="chevron-forward" size={16} color="#64748b" />
          </View>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>حول التطبيق</Text>
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="information-circle-outline" size={22} color="#2563eb" style={styles.settingIcon} />
            <Text style={styles.settingText}>إصدار التطبيق</Text>
          </View>
          <Text style={styles.versionText}>1.0.0</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      {onLogout && (
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutText}>تسجيل الخروج</Text>
        </TouchableOpacity>
      )}
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
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#64748b',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
    color: '#0f172a',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueText: {
    fontSize: 16,
    color: '#64748b',
    marginRight: 4,
  },
  versionText: {
    fontSize: 16,
    color: '#64748b',
  },
  logoutButton: {
    marginTop: 32,
    marginHorizontal: 16,
    backgroundColor: '#1d4ed8',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default SettingsScreen;