import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useAuth } from '../context/AuthContext';


type PanelCategory = 'chemistry' | 'lipid' | 'hematology' | 'thyroid' | 'general';

// Colors echo real specimen-tube cap colors (gold/tiger-top for chemistry,
// green heparin for lipid, lavender EDTA for hematology, red serum for
// thyroid) — a small, true-to-the-subject detail rather than an arbitrary
// palette.
const CATEGORY_COLOR: Record<PanelCategory, string> = {
  chemistry: '#C9A227',
  lipid: '#2F855A',
  hematology: '#9F7AEA',
  thyroid: '#DC2626',
  general: '#3B82F6',
};

const CATEGORY_LABEL: Record<PanelCategory, string> = {
  chemistry: 'Chemistry',
  lipid: 'Lipid',
  hematology: 'Hematology',
  thyroid: 'Thyroid',
  general: 'General',
};

export interface Report {
  id: string;
  title: string;
  date: string;
  category: PanelCategory;
  status: 'reviewed' | 'processing';
  thumbnailUri?: string;
}

const MOCK_REPORTS: Report[] = [
  {
    id: 'a1029',
    title: 'Comprehensive Metabolic Panel',
    date: 'Aug 18, 2026',
    category: 'chemistry',
    status: 'reviewed',
  },
  {
    id: 'a1017',
    title: 'Lipid Panel',
    date: 'Jul 30, 2026',
    category: 'lipid',
    status: 'reviewed',
  },
  {
    id: 'a1004',
    title: 'CBC with Differential',
    date: 'Jul 12, 2026',
    category: 'hematology',
    status: 'processing',
  },
  {
    id: 'a0988',
    title: 'Thyroid Panel (TSH, T3, T4)',
    date: 'Jun 02, 2026',
    category: 'thyroid',
    status: 'reviewed',
  },
];

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props): React.JSX.Element {
  const { isLoggedIn, signOut } = useAuth();

  const handleAuthPress = (): void => {
    if (isLoggedIn) {
      signOut();
    } else {
      navigation.navigate('Login');
    }
  };

  const renderCard = ({ item }: { item: Report }): React.JSX.Element => {
    const capColor = CATEGORY_COLOR[item.category];
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('Scan')}
      >
        <View style={[styles.cardCap, { backgroundColor: capColor }]} />
        <View style={styles.thumbnail}>
          {item.thumbnailUri ? (
            <Image source={{ uri: item.thumbnailUri }} style={styles.thumbnailImage} />
          ) : (
            <Text style={styles.thumbnailGlyph}>🧪</Text>
          )}
          <View style={[styles.statusDot, statusDotStyle(item.status)]} />
        </View>
        <View style={styles.cardBody}>
          <Text style={[styles.categoryTag, { color: capColor }]}>
            {CATEGORY_LABEL[item.category]}
          </Text>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.cardMeta}>
            #{item.id} · {item.date}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <View style={styles.wordmarkRow}>
          <View style={styles.capDots}>
            {(['chemistry', 'lipid', 'hematology', 'thyroid'] as PanelCategory[]).map((cat) => (
              <View
                key={cat}
                style={[styles.capDot, { backgroundColor: CATEGORY_COLOR[cat] }]}
              />
            ))}
          </View>
          <Text style={styles.wordmark}>LabDog</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.insightsButton}
            onPress={() => navigation.navigate('Insights')}
            activeOpacity={0.8}
          >
            <Text style={styles.insightsButtonText}>Insights</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.authButton, isLoggedIn && styles.authButtonActive]}
            onPress={handleAuthPress}
            activeOpacity={0.8}
          >
            {isLoggedIn && <View style={styles.onlineDot} />}
            <Text style={styles.authButtonText}>{isLoggedIn ? 'Sign Out' : 'Sign In'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Your Reports</Text>
        <Text style={styles.sectionCount}>{MOCK_REPORTS.length}</Text>
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
            <Text style={styles.emptyGlyph}>🧪</Text>
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
    </SafeAreaView>
  );
}

function statusDotStyle(status: Report['status']) {
  return { backgroundColor: status === 'reviewed' ? '#16a34a' : '#f59e0b' };
}

const CARD_RADIUS = 16;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f1115' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  wordmarkRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  capDots: { flexDirection: 'row', gap: 3 },
  capDot: { width: 6, height: 14, borderRadius: 3 },
  wordmark: { fontSize: 24, fontWeight: '800', color: '#fff', letterSpacing: 0.2 },

  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  insightsButton: { paddingVertical: 8, paddingHorizontal: 10 },
  insightsButtonText: { color: '#9ca3af', fontWeight: '600', fontSize: 13 },

  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1b1e26',
    borderWidth: 1,
    borderColor: '#2a2e38',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  authButtonActive: { borderColor: '#16a34a' },
  authButtonText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#16a34a' },

  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 20,
    marginTop: 12,
    marginBottom: 12,
  },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  sectionCount: { color: '#6b7280', fontSize: 13, fontVariant: ['tabular-nums'] },

  gridContent: { paddingHorizontal: 20, paddingBottom: 100 },
  row: { justifyContent: 'space-between' },

  card: {
    width: '48%',
    backgroundColor: '#1b1e26',
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#232733',
  },
  cardCap: { height: 5, width: '100%' },
  thumbnail: {
    aspectRatio: 1,
    backgroundColor: '#14161d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  thumbnailGlyph: { fontSize: 34, opacity: 0.55 },
  statusDot: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4 },
  cardBody: { padding: 10 },
  categoryTag: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  cardTitle: { color: '#fff', fontSize: 13, fontWeight: '600', lineHeight: 17 },
  cardMeta: { color: '#6b7280', fontSize: 11, marginTop: 6, fontFamily: 'monospace' },

  emptyState: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 40 },
  emptyGlyph: { fontSize: 40, opacity: 0.4, marginBottom: 12 },
  emptyTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 6 },
  emptyBody: { color: '#6b7280', fontSize: 13, textAlign: 'center', lineHeight: 18 },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  fabPlus: { color: '#fff', fontSize: 28, fontWeight: '400', marginTop: -2 },
});