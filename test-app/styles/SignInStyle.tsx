import { StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';


export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.sage },
  body: { flex: 1, backgroundColor: colors.cream },

  headerColor: {
    backgroundColor: colors.sage,
    
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: colors.sage,
    paddingVertical: 14,
  },
  wordmarkRow: { flexDirection: 'row', alignItems: 'center', gap: 10},
  wordmark: {
    fontSize: 22,
    fontFamily: fonts.bold,
    color: colors.white,
    letterSpacing: 0.2,
  },

  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.navy,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  authButtonActive: { borderColor: colors.sage },
  authButtonText: { color: colors.navy, fontFamily: fonts.regular, fontSize: 12 },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.sage },

  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 20,
    marginTop: 12,
    marginBottom: 12,
  },
  sectionTitle: { color: colors.navy, fontSize: 17, fontFamily: fonts.bold },
  sectionCount: { color: colors.navy, opacity: 0.5, fontSize: 13, fontFamily: fonts.regular },

  emptyState: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 40 },
  emptyTitle: { color: colors.navy, fontSize: 16, fontFamily: fonts.bold, marginBottom: 6 },
  emptyBody: {
    color: colors.navy,
    opacity: 0.6,
    fontSize: 13,
    fontFamily: fonts.regular,
    textAlign: 'center',
    lineHeight: 18,
  },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.sage,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  fabPlus: { color: colors.white, fontSize: 28, fontFamily: fonts.bold, marginTop: -2 },
});