import React, { useEffect } from 'react';
import { View, StyleSheet, Alert, Linking, Image, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const WEB_APP_URL = 'https://6f0d-196-137-136-210.ngrok-free.app';

const WebViewScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      Linking.openURL(WEB_APP_URL).catch(() => {
        Alert.alert(
          'خطأ',
          'تعذر فتح المتصفح. يرجى التحقق من الرابط والمحاولة مرة أخرى.'
        );
      });
    }, 2000); // Show loader for 2 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>الرجوع</Text>
      </TouchableOpacity>
      <Image source={require('./Signify.png')} style={styles.logo} resizeMode="contain" />
      <ActivityIndicator size="large" color="#1e40af" style={styles.loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 24,
  },
  loader: {
    marginTop: 12,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    right: 24,
    zIndex: 10,
    backgroundColor: '#e0e7ef',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    elevation: 2,
  },
  backButtonText: {
    color: '#1e40af',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WebViewScreen; 