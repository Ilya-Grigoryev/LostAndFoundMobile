import { StyleSheet, Text, View } from 'react-native';
import { colors, typography } from '../theme';

// Stub — Ivan replaces in feature/loser-flow
export default function LoserNavigator() {
  return (
    <View style={styles.container}>
      <Text style={[typography.h3, { color: colors.loserPrimary }]}>Loser Flow</Text>
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
