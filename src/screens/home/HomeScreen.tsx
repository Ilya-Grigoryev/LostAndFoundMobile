import { StyleSheet, Text, View } from 'react-native';
import { colors, typography } from '../../theme';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={[typography.h2, { color: colors.textPrimary }]}>Home</Text>
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
