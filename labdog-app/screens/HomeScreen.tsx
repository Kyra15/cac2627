import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useAuth } from '../context/AuthContext';
import { styles } from '../styles/HomeStyle';

export interface Report {
  id: string;
  title: string;
  date: string;
  thumbnailUri?: string;
}

const MOCK_REPORTS: Report[] = [
  { id: 'a1029', title: 'Comprehensive Metabolic Panel', date: 'Aug 18, 2026' },
  { id: 'a1017', title: 'Lipid Panel', date: 'Jul 30, 2026' },
  { id: 'a1004', title: 'CBC with Differential', date: 'Jul 12, 2026' },
  { id: 'a0988', title: 'Thyroid Panel (TSH, T3, T4)', date: 'Jun 02, 2026' },
];

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props): React.JSX.Element {
  const { signOut } = useAuth();

  const renderCard = ({ item }: { item: Report }): React.JSX.Element => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('Scan')}
    >
      <View style={styles.thumbnail}>
        {item.thumbnailUri && (
          <Image source={{ uri: item.thumbnailUri }} style={styles.thumbnailImage} />
        )}
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.cardMeta}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <View style={styles.wordmarkRow}>
          <Text style={styles.wordmark}>LabDog</Text>
        </View>

        <View style={styles.headerActions}>

          <TouchableOpacity style={styles.authButton} onPress={() => signOut()} activeOpacity={0.8}>
            <Text style={styles.authButtonText}>Sign Out</Text>
          </TouchableOpacity>
          
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Your Reports</Text>
        </View>

        <FlatList
          data={MOCK_REPORTS}
          keyExtractor={(item) => item.id}
          renderItem={renderCard}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No reports yet</Text>
              <Text style={styles.emptyBody}>Scan a lab report to see it show up here.</Text>
            </View>
          }
        />

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