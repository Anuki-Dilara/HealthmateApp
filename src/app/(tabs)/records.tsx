
import { StyleSheet, Text, View } from 'react-native';

export default function RecordsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Health Records</Text>

      <Text style={styles.description}>
        Your saved health records will appear here.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666666',
  },
});
