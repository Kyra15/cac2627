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
    color: colors.navy,
    letterSpacing: -0.5,
  },
  subheader: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.navy,
    marginTop: 6,
  },
 

});
 