// App.js
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Screens
import HomeScreen from './screens/HomeScreen';
import HistoryScreen from './screens/HistoryScreen';
import SettingsScreen from './screens/SettingsScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import WebViewScreen from './screens/WebViewScreen';
import SignAnimationScreen from './screens/SignAnimationScreen'; 
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Create a wrapper component for the tab navigator
function TabNavigator({ user, onLogout }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#94a3b8',
        headerShown: false,
        tabBarStyle: {
          paddingVertical: 5,
          borderTopWidth: 0,
          elevation: 0,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        children={() => <HomeScreen user={user} />}
        options={{ tabBarLabel: 'الرئيسية' }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{ tabBarLabel: 'السجل' }}
      />
      <Tab.Screen
        name="Settings"
        children={() => <SettingsScreen onLogout={onLogout} />}
        options={{ tabBarLabel: 'الإعدادات' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);

  const handleLogout = () => {
    setUser(null);
    setShowSignup(false);
  };

  if (!user) {
    // Show login or signup
    if (showSignup) {
      return (
        <SafeAreaProvider>
          <StatusBar barStyle="dark-content" />
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
          >
            <SignupScreen
              onSignup={setUser}
              onNavigateToLogin={() => setShowSignup(false)}
            />
          </KeyboardAvoidingView>
        </SafeAreaProvider>
      );
    }
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
        >
          <LoginScreen
            onLogin={setUser}
            onNavigateToSignup={() => setShowSignup(true)}
          />
        </KeyboardAvoidingView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTabs">
            {() => <TabNavigator user={user} onLogout={handleLogout} />}
          </Stack.Screen>
          <Stack.Screen name="WebView" component={WebViewScreen} />
          <Stack.Screen
            name="SignAnimationScreen"
            component={SignAnimationScreen}
            options={{ title: 'الترجمة الصوتية' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}