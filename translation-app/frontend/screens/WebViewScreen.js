import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Linking } from 'react-native';

const WebViewScreen = () => {
  // Replace this with your laptop's IP address
  const WEB_APP_URL = 'https://6dbb-197-59-153-78.ngrok-free.app';

  useEffect(() => {
    Linking.openURL(WEB_APP_URL).catch(() => {
      Alert.alert(
        'Error',
        'Could not open the browser. Please check the URL and try again.'
      );
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.infoText}>
        If the browser did not open automatically, please open this link manually:
        {'\n'}
        {WEB_APP_URL}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  infoText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#1e40af',
  },
});

export default WebViewScreen; 