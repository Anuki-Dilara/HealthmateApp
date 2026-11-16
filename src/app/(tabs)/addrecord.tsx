
import { StyleSheet, Text, View } from 'react-native';

export default function AddRecordScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Health Record</Text>

      <Text style={styles.description}>
        Enter your daily health information here.
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
