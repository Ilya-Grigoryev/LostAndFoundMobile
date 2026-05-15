import { StyleSheet, Text, View } from 'react-native';
import { colors, typography } from '../../theme';

// Stub — implemented in Step 7.
export default function ClaimScreen() {
  return (
    <View style={styles.container}>
      <Text style={[typography.h3, { color: colors.loserPrimary }]}>Claim</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
