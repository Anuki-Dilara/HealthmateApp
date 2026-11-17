
import { useCallback, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  deleteHealthRecord,
  getHealthRecords,
  HealthRecord,
} from '../../database/healthmateDatabase';


function formatRecordDate(recordDate: string) {
  const [year, month, day] = recordDate.split('-').map(Number);

  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function RecordsScreen() {
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Reload the records 
  // newly saved records to appear without restarting 
  useFocusEffect(
    useCallback(() => {
      let screenIsActive = true;

      async function loadSavedHealthRecords() {
        setIsLoading(true);
        setLoadError('');

        try {
          const savedRecords = await getHealthRecords();

          if (screenIsActive) {
            setHealthRecords(savedRecords);
          }
        } catch (error) {
          if (screenIsActive) {
            setLoadError(
              error instanceof Error
                ? error.message
                : 'Unable to load your health records.'
            );
          }
        } finally {
          if (screenIsActive) {
            setIsLoading(false);
          }
        }
      }

      void loadSavedHealthRecords();

      return () => {
        screenIsActive = false;
      };
    }, [])
  );
  //delete rec
  async function handleDeleteRecord(recordId: number) {
    Alert.alert(
      'Delete Health Record',
      'Are you sure you want to delete this health record?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteHealthRecord(recordId);

              // Remove the deleted record from the screen.
              setHealthRecords((currentRecords) =>
                currentRecords.filter((record) => record.id !== recordId)
              );

              Alert.alert('Success', 'Health record deleted successfully.');
            } catch (error) {
              Alert.alert(
                'Delete Failed',
                error instanceof Error
                  ? error.message
                  : 'Unable to delete this health record.'
              );
            }
          },
        },
      ]
    );
  }
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* records screen head */}
        <View style={styles.header}>
          <Text style={styles.appName}>🌿 HEALTHMATE</Text>

          <Text style={styles.title}>Health Records</Text>

          <Text style={styles.description}>
            View your saved daily health information.
          </Text>
        </View>

        <View style={styles.recordsSection}>
          <Text style={styles.sectionTitle}>
            📋 Your Daily Records
          </Text>

          {/* loading indicator */}
          {isLoading ? (
            <View style={styles.messageContainer}>
              <ActivityIndicator size="large" color="#176B4D" />
              <Text style={styles.messageText}>
                Loading your health records...
              </Text>
            </View>
          ) : loadError !== '' ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyEmoji}>⚠️</Text>
              <Text style={styles.emptyTitle}>
                Unable to load records
              </Text>
              <Text style={styles.emptyDescription}>
                {loadError}
              </Text>
            </View>
          ) : healthRecords.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyEmoji}>📝</Text>

              <Text style={styles.emptyTitle}>
                No health records yet
              </Text>

              <Text style={styles.emptyDescription}>
                Your saved health records will appear here.
                Start by adding your daily health information.
              </Text>
            </View>
          ) : (
            healthRecords.map((record) => (
              <View key={record.id} style={styles.recordCard}>
                <View style={styles.recordHeader}>
                  <Text style={styles.recordDate}>
                    📅 {formatRecordDate(record.recordDate)}
                  </Text>

                  <Text style={styles.recordId}>
                    #{record.id}
                  </Text>
                </View>

                <View style={styles.measurementRow}>
                  <Text style={styles.measurementLabel}>
                    👟 Steps
                  </Text>

                  <Text style={styles.measurementValue}>
                    {record.steps.toLocaleString()}
                  </Text>
                </View>

                <View style={styles.measurementRow}>
                  <Text style={styles.measurementLabel}>
                    🔥 Calories Burned
                  </Text>

                  <Text style={styles.measurementValue}>
                    {record.calories.toLocaleString()} kcal
                  </Text>
                </View>

                <View style={styles.measurementRow}>
                  <Text style={styles.measurementLabel}>
                    💧 Water Intake
                  </Text>

                  <Text style={styles.measurementValue}>
                    {record.waterMl.toLocaleString()} ml
                  </Text>
                </View>
                <Pressable
                  style={styles.deleteButton}
                  onPress={() => handleDeleteRecord(record.id)}
                >
                  <Text style={styles.deleteButtonText}>
                    Delete Record
                  </Text>
                </Pressable>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4F7F5',
  },

  content: {
    paddingBottom: 25,
  },

  header: {
    backgroundColor: '#176B4D',
    paddingHorizontal: 22,
    paddingTop: 25,
    paddingBottom: 28,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },

  appName: {
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 2,
    color: '#D4F1DF',
    marginBottom: 18,
  },

  title: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 7,
  },

  description: {
    fontSize: 14,
    color: '#E4F4E9',
  },

  recordsSection: {
    paddingHorizontal: 18,
    paddingTop: 24,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#26382D',
    marginBottom: 17,
  },

  recordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E5EBE7',
  },

  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 13,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF1EF',
  },

  recordDate: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#176B4D',
  },

  recordId: {
    fontSize: 12,
    color: '#89948C',
  },

  measurementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },

  measurementLabel: {
    fontSize: 14,
    color: '#637168',
  },

  measurementValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#26382D',
  },

  messageContainer: {
    alignItems: 'center',
    padding: 30,
  },

  messageText: {
    fontSize: 14,
    color: '#758178',
    marginTop: 12,
  },

  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5EBE7',
  },

  emptyEmoji: {
    fontSize: 42,
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#35463B',
    marginBottom: 9,
    textAlign: 'center',
  },

  emptyDescription: {
    fontSize: 13,
    color: '#758178',
    textAlign: 'center',
    lineHeight: 20,
  },
  deleteButton: {
    backgroundColor: '#FDECEC',
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },

  deleteButtonText: {
    color: '#D64545',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
