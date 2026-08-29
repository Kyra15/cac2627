import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context'
import type { RootStackParamList } from './navigation/types';
import HomeScreen from './screens/HomeScreen';
import ScanScreen from './screens/ScanScreen';
import { AuthProvider } from './context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import "./styles/theme.css";
import "./styles/app.css";

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