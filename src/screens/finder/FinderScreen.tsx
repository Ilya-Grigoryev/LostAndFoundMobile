import { StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily, spacing, typography } from '../../theme';


export default function FinderScreen() {
    return(
      <View style={styles.container}>
          <Text style={[typography.h3, { color: colors.finderPrimary }]}>Finder Screen...</Text>
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