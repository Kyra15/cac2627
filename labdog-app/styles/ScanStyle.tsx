import { StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.sage },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: colors.sage,
    paddingVertical: 14,
  },

  scroll: { padding: 20, alignItems: 'center', backgroundColor: colors.cream, flex: 1, },

  backLink: { alignSelf: 'flex-start', paddingVertical: 4 },

  backLinkText: { color: colors.white, fontSize: 15, fontFamily: fonts.bold },

  title: { fontSize: 22, fontFamily: fonts.bold, color: colors.navy, marginVertical: 16 },

  imageBox: {
    width: '100%',
    height: 280,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.navy,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 20,
  },

  image: { width: '100%', height: '100%', resizeMode: 'cover' },

  placeholder: { color: colors.navy, opacity: 0.5, fontFamily: fonts.regular },

  row: { flexDirection: 'row', gap: 12, marginBottom: 12 },

  button: {
    flex: 1,
    backgroundColor: colors.sage,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },

  analyzeButton: {
    width: '100%',
    backgroundColor: colors.terracotta,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },

  buttonDisabled: { backgroundColor: colors.gold },

  buttonText: { color: colors.white, fontFamily: fonts.bold, fontSize: 15 },

  summaryBox: {
    width: '100%',
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.navy,
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
  },

  summaryTitle: {
    color: colors.navy,
    opacity: 0.6,
    fontSize: 12,
    fontFamily: fonts.bold,
    marginBottom: 8,
    textTransform: 'uppercase',
  },

  summaryText: { color: colors.navy, fontFamily: fonts.regular, fontSize: 15, lineHeight: 22 },
});