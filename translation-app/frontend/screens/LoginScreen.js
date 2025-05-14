import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ActivityIndicator, I18nManager } from 'react-native';
import axios from 'axios';

I18nManager.forceRTL(true);

export default function LoginScreen({ onLogin, onNavigateToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      // Use your backend IP if on a real device!
      const res = await axios.post('http://192.168.100.3:4000/login', { email, password });
      setLoading(false);
      onLogin(res.data); // Pass user data up
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'حدث خطأ ما');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/Signify.png')} style={styles.logo} />
      <Text style={styles.title}>تسجيل الدخول إلى Signify</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>البريد الإلكتروني</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="example@email.com"
          textAlign="right"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>كلمة المرور</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="••••••••"
          textAlign="right"
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>تسجيل الدخول</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {}} style={styles.linkContainer}>
        <Text style={styles.link}>هل نسيت كلمة المرور؟</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onNavigateToSignup} style={styles.linkContainer}>
        <Text style={styles.link}>ليس لديك حساب؟ <Text style={styles.linkBold}>إنشاء حساب جديد</Text></Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // ... blue palette and RTL styles ...
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    width: 200,
    height: 150,
    marginBottom: 16,
    borderRadius: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 12,
  },
  label: {
    color: '#1d4ed8',
    fontSize: 16,
    marginBottom: 4,
    textAlign: 'right',
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#2563eb',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#0f172a',
    textAlign: 'right',
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 8,
    marginTop: 16,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  error: {
    color: '#dc2626',
    marginBottom: 8,
    textAlign: 'center',
  },
  linkContainer: {
    marginTop: 12,
  },
  link: {
    color: '#1d4ed8',
    fontSize: 15,
    textAlign: 'center',
  },
  linkBold: {
    fontWeight: 'bold',
    color: '#2563eb',
  },
}); 