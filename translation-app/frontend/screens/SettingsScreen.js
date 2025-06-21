import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Switch, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { googleSignOut, checkGoogleAuthStatus } from '../src/googleAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = ({ onLogout, user }) => {
  const [googleUser, setGoogleUser] = useState(null);
  const [isGoogleUser, setIsGoogleUser] = useState(false);

  useEffect(() => {
    checkGoogleAuth();
  }, []);

  const checkGoogleAuth = async () => {
    try {
      const authStatus = await checkGoogleAuthStatus();
      if (authStatus.isSignedIn) {
        setGoogleUser(authStatus.user);
        setIsGoogleUser(true);
      }
    } catch (error) {
      console.error('Error checking Google auth status:', error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'تسجيل الخروج',
      'هل أنت متأكد من أنك تريد تسجيل الخروج؟',
      [
        {
          text: 'إلغاء',
          style: 'cancel',
        },
        {
          text: 'تسجيل الخروج',
          style: 'destructive',
          onPress: async () => {
            try {
              // If user signed in with Google, sign out from Google too
              if (isGoogleUser) {
                await googleSignOut();
              }
              
              // Clear any stored user data
              await AsyncStorage.multiRemove([
                'user',
                'googleAccessToken',
                'googleRefreshToken',
                'googleUserInfo'
              ]);
              
              // Call the parent logout function
              onLogout();
            } catch (error) {
              console.error('Logout error:', error);
              // Still logout even if Google signout fails
              onLogout();
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>الإعدادات</Text>
      </View>

      {/* User Profile Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>الملف الشخصي</Text>
        <View style={styles.profileContainer}>
          {isGoogleUser && googleUser?.picture ? (
            <Image source={{ uri: googleUser.picture }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Ionicons name="person" size={24} color="#2563eb" />
            </View>
          )}
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {isGoogleUser ? googleUser?.name : user?.username || 'المستخدم'}
            </Text>
            <Text style={styles.profileEmail}>
              {isGoogleUser ? googleUser?.email : user?.email}
            </Text>
            {isGoogleUser && (
              <View style={styles.googleBadge}>
                <Ionicons name="logo-google" size={12} color="#4285F4" />
                <Text style={styles.googleBadgeText}>Google</Text>
              </View>
            )}
          </View>
        </View>
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
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" style={styles.logoutIcon} />
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
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  googleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  googleBadgeText: {
    fontSize: 12,
    color: '#4285F4',
    fontWeight: '500',
    marginLeft: 4,
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
    backgroundColor: '#dc2626',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default SettingsScreen;