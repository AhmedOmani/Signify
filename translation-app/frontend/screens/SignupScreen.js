import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ActivityIndicator, I18nManager } from 'react-native';
import axios from 'axios';

I18nManager.forceRTL(true);

export default function SignupScreen({ onSignup, onNavigateToLogin }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setError('');
    if (!username || !email || !password || !confirm) {
      setError('جميع الحقول مطلوبة');
      return;
    }
    if (password !== confirm) {
      setError('كلمتا المرور غير متطابقتين');
      return;
    }
    setLoading(true);
    try {
      // Use your backend IP if on a real device!
      const res = await axios.post('http://192.168.100.3:4000/signup', { username, email, password });
      setLoading(false);
      onSignup(res.data); // Pass user data up
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'حدث خطأ ما');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/Signify.png')} style={styles.logo} />
      <Text style={styles.title}>إنشاء حساب في Signify</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>اسم المستخدم</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="اسم المستخدم"
          textAlign="right"
        />
      </View>
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
      <View style={styles.inputContainer}>
        <Text style={styles.label}>تأكيد كلمة المرور</Text>
        <TextInput
          style={styles.input}
          value={confirm}
          onChangeText={setConfirm}
          secureTextEntry
          placeholder="••••••••"
          textAlign="right"
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>إنشاء حساب</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={onNavigateToLogin} style={styles.linkContainer}>
        <Text style={styles.link}>لديك حساب بالفعل؟ <Text style={styles.linkBold}>تسجيل الدخول</Text></Text>
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