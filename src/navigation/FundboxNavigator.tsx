import { StyleSheet, Text, View } from 'react-native';
import { colors, typography } from '../theme';

// Stub — Ilia replaces in feature/fundbox-flow (Phase 7)
export default function FundboxNavigator() {
  return (
    <View style={styles.container}>
      <Text style={[typography.h3, { color: colors.accent }]}>Fundbox Flow</Text>
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
