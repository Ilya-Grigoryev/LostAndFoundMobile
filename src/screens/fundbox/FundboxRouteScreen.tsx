import { StyleSheet, Text, View } from 'react-native';
import { colors, typography } from '../../theme';

// Stub — implemented in Step 4.
export default function FundboxRouteScreen() {
  return (
    <View style={styles.container}>
      <Text style={[typography.h3, { color: colors.accent }]}>Fundbox Route</Text>
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
