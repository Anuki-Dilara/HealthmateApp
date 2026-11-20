
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useRecordsViewModel } from '@/features/healthrecords/viewmodels/useRecordsViewModel';


function formatRecordDate(recordDate: string) {
  const [year, month, day] = recordDate.split('-').map(Number);

  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
function formatDatabaseDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
export default function RecordsScreen() {
  const {
    healthRecords,
    isLoading,
    loadError,
    deleteRecord,
  } = useRecordsViewModel();

  // Store the date selected for filtering records.
  const [filterDate, setFilterDate] = useState<Date | null>(null);


  //open calender
  function openDateFilter() {
  DateTimePickerAndroid.open({
    value: filterDate ?? new Date(),
    mode: 'date',
    display: 'calendar',
    maximumDate: new Date(),

    onValueChange: (_event, selectedDate) => {
      if (selectedDate) {
        setFilterDate(selectedDate);
      }
    },
  });
}
const filteredHealthRecords = filterDate
  ? healthRecords.filter(
      (record) =>
        record.recordDate === formatDatabaseDate(filterDate)
    )
  : healthRecords;
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
        await deleteRecord(recordId);

        Alert.alert(
          'Success',
          'Health record deleted successfully.'
        );
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
{/*filter records*/}
        <View style={styles.filterContainer}>

          <Text style={styles.filterLabel}>
            🔎 Filter Records by Date
          </Text>

          <View style={styles.filterActions}>

            <Pressable
              style={styles.filterDateButton}
              onPress={openDateFilter}
            >
              <Text style={styles.filterDateText}>
                {filterDate
                  ? filterDate.toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })
                  : 'Select a date'}
              </Text>

              <Text style={styles.calendarIcon}>
                🗓️
              </Text>
            </Pressable>

            {filterDate !== null && (
              <Pressable
                style={styles.clearFilterButton}
                onPress={() => setFilterDate(null)}
              >
                <Text style={styles.clearFilterText}>
                  Clear
                </Text>
              </Pressable>
            )}

          </View>
        </View>
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

            ) : filteredHealthRecords.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyEmoji}>🔍</Text>

              <Text style={styles.emptyTitle}>
                No Records Found
              </Text>

              <Text style={styles.emptyDescription}>
                There are no health records for the selected date.
                Try selecting another date or clear the filter.
              </Text>
            </View>
          ) : (
            filteredHealthRecords.map((record) => (
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
                <Pressable
                  style={styles.editButton}
                  onPress={() =>
                    router.push({
                      pathname: '/editrecord',
                      params: {
                        id: String(record.id),
                      },
                    })
                  }
                >
                  <Text style={styles.editButtonText}>
                    ✏️ Edit Record
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

  editButton: {
  backgroundColor: '#E5F2EA',
  paddingVertical: 11,
  borderRadius: 10,
  alignItems: 'center',
  marginTop: 12,
},

editButtonText: {
  color: '#176B4D',
  fontSize: 14,
  fontWeight: 'bold',
},
filterContainer: {
  backgroundColor: '#FFFFFF',
  padding: 15,
  borderRadius: 14,
  borderWidth: 1,
  borderColor: '#E5EBE7',
  marginBottom: 18,
},

filterLabel: {
  fontSize: 14,
  fontWeight: 'bold',
  color: '#35463B',
  marginBottom: 12,
},

filterActions: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
},

filterDateButton: {
  flex: 1,
  backgroundColor: '#EAF3ED',
  padding: 13,
  borderRadius: 10,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},

filterDateText: {
  fontSize: 14,
  color: '#176B4D',
  fontWeight: '600',
},

calendarIcon: {
  fontSize: 18,
},

clearFilterButton: {
  backgroundColor: '#FDECEC',
  paddingVertical: 13,
  paddingHorizontal: 15,
  borderRadius: 10,
},

clearFilterText: {
  color: '#D64545',
  fontWeight: 'bold',
  fontSize: 13,
},
});
