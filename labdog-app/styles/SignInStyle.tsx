import { StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

const FIELD_RADIUS = 14;
const SHEET_RADIUS = 0;
const navyFaint = `${colors.navy}59`;
 
export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.sage },
  flex: { flex: 1 },
 
  header: {
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  wordmark: {
    fontFamily: fonts.title_bold,
    fontSize: 40,
    color: colors.white,
    letterSpacing: -0.5,
  },
  subheader: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.white,
    marginTop: 6,
  },
 
  body: {
    flex: 1,
    backgroundColor: colors.cream,
    borderTopLeftRadius: SHEET_RADIUS,
    borderTopRightRadius: SHEET_RADIUS,
    overflow: 'hidden',
  },
  bodyContent: { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 40 },
  form: { width: '100%', maxWidth: 420, alignSelf: 'center' },
 
  title: { fontFamily: fonts.bold, fontSize: 26, color: colors.navy },
  blurb: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 21,
    color: colors.navy,
    opacity: 0.75,
    marginTop: 6,
    marginBottom: 28,
  },
 
  fieldGroup: { marginBottom: 18 },
  label: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.navy,
    marginBottom: 8,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: navyFaint,
    borderRadius: FIELD_RADIUS,
  },
  fieldFocused: { borderColor: colors.navy },
  fieldError: { borderColor: colors.terracotta },
  input: {
    flex: 1,
    minWidth: 0,
    height: '100%',
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.navy,
  },
  toggle: { marginLeft: 12 },
  toggleText: { fontFamily: fonts.bold, fontSize: 13, color: colors.navy },
  errorText: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.navy,
    marginTop: 6,
  },
 
  button: {
    height: 54,
    marginTop: 10,
    backgroundColor: colors.navy,
    borderRadius: FIELD_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { fontFamily: fonts.bold, fontSize: 16, color: colors.white },
 
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.navy,
    opacity: 0.75,
  },
  footerLink: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.navy,
    textDecorationLine: 'underline',
    paddingVertical: 8,
    paddingLeft: 6,
  },
});
 