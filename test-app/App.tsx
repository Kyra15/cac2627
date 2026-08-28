import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context'
import * as ImagePicker from 'expo-image-picker';
import DocumentScanner, { ResponseType } from 'react-native-document-scanner-plugin';
import type { RootStackParamList } from './navigation/types';
import HomeScreen from './screens/HomeScreen';
import ScanScreen from './screens/ScanScreen';
import { AuthProvider } from './context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator<RootStackParamList>();
 
export default function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: '#0f1115' },
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Scan" component={ScanScreen} />
            {/* <Stack.Screen name="Insights" component={InsightsScreen} /> */}
            {/* <Stack.Screen name="Login" component={LoginScreen} options={{ presentation: 'modal' }} /> */}
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}