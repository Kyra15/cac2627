import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useAuth } from '../context/AuthContext';
import { styles } from '../styles/SignInStyle';


type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function SignInScreen({ navigation }: Props): React.JSX.Element {
  // const { isLoggedIn, signOut } = useAuth();

  // const handleAuthPress = (): void => {
  //   if (isLoggedIn) {
  //     signOut();
  //   } else {
  //     navigation.navigate('Login');
  //   }
  // };
  const handleAuthPress = (): void => {};

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <View style={styles.wordmarkRow}>
          <Text style={styles.wordmark}>LabDog</Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Your medical report guide-dog</Text>
        </View>

        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Scan')}
        >
          <Text style={styles.fabPlus}>+</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}