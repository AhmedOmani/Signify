// translation-app/frontend/screens/SignAnimationScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Text, Image, TouchableOpacity, StyleSheet, I18nManager } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signMap } from '../assets/signMap';
// import Video from 'react-native-video'; // Uncomment if using MP4
import { KeyboardAvoidingView, Platform } from 'react-native';
I18nManager.forceRTL(true); // Ensure RTL for Arabic

export default function SignAnimationScreen() {
  const navigation = useNavigation();
  const [input, setInput] = useState('');
  const [words, setWords] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  // Auto-advance to next word every 2 seconds
  useEffect(() => {
    if (words.length === 0) return;
    const timer = setTimeout(() => {
      if (currentIdx < words.length - 1) {
        setCurrentIdx(currentIdx + 1);
      }
    }, 2000); // 2 seconds per word
    return () => clearTimeout(timer);
  }, [currentIdx, words]);

  const handleTranslate = () => {
    const splitWords = input.trim().split(/\s+/);
    setWords(splitWords);
    setCurrentIdx(0);
  };

  const currentWord = words[currentIdx];
  const animationSource = signMap[currentWord];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
        <View style={styles.container}>
        {/* Back button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>الرجوع</Text>
        </TouchableOpacity>
        {/* Animation area */}
        <View style={styles.animationArea}>
            <View style={styles.animationCard}>
                {currentWord ? (
                animationSource ? (
                    <Image source={animationSource} style={styles.animation} />
                    // <Video source={animationSource} style={styles.animation} repeat /> // For MP4
                ) : (
                    <Text style={styles.notFound}>الإشارة غير متوفرة: {currentWord}</Text>
                )
                ) : (
                <Text style={styles.prompt}>أدخل كلمة أو جملة للترجمة</Text>
                )}
            </View>
        </View>
        {/* Input area */}
        <View style={styles.inputArea}>
            <TouchableOpacity style={styles.addButton} onPress={handleTranslate}>
            <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
            <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="اكتب كلمة أو جملة"
            style={styles.input}
            textAlign="right"
            onSubmitEditing={handleTranslate}
            />
            <TouchableOpacity style={styles.micButton}>
            <Text style={styles.micIcon}>🎤</Text>
            </TouchableOpacity>
        </View>
        {/* Progress indicator */}
        {words.length > 0 && (
            <Text style={styles.progress}>
            {currentIdx + 1} / {words.length}
            </Text>
        )}
        </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5faff' },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: '#3a8dde',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    elevation: 2,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  animationArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animationCard: {
    width: 320,
    height: 320,
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#3a8dde',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: 280,
    height: 280,
    resizeMode: 'contain',
  },
  notFound: { color: 'red', fontSize: 20, textAlign: 'center' },
  prompt: { color: '#3a8dde', fontSize: 20, textAlign: 'center' },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#e0eaff',
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#3a8dde',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  addButtonText: { color: '#fff', fontSize: 24 },
  input: {
    flex: 1,
    borderBottomWidth: 2,
    borderColor: '#3a8dde',
    fontSize: 18,
    marginHorizontal: 8,
    backgroundColor: '#f5faff',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  micButton: {
    marginLeft: 8,
  },
  micIcon: { fontSize: 24, color: '#3a8dde' },
  progress: {
    textAlign: 'center',
    color: '#3a8dde',
    fontSize: 16,
    marginBottom: 8,
  },
});