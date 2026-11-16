
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

// sample health information
const todayHealth = {
  steps: 5280,
  calories: 320,
  waterMl: 1250,
};

// sample daily targets 
const dailyTargets = {
  steps: 8000,
  calories: 500,
  waterMl: 2000,
};

// Calculate progress 
function calculateProgress(current: number, target: number) {
  if (current < 0 || target <= 0) {
    return 0;
  }

  return Math.min(
    Math.round((current / target) * 100),
    100
  );
}

type HealthMetricCardProps = {
  title: string;
  emoji: string;
  value: string;
  unit: string;
  target: string;
  progress: number;
  cardBackground: string;
  iconBackground: string;
  progressColor: string;
};

function HealthMetricCard(props: HealthMetricCardProps) {
  return (
    <View
      style={[
        styles.metricCard,
        { backgroundColor: props.cardBackground },
      ]}
    >
      <View style={styles.metricHeading}>
        <View
          style={[
            styles.emojiBox,
            { backgroundColor: props.iconBackground },
          ]}
        >
          <Text style={styles.emoji}>{props.emoji}</Text>
        </View>

        <Text style={styles.metricTitle}>
          {props.title}
        </Text>
      </View>

      <View style={styles.valueRow}>
        <Text style={styles.metricValue}>
          {props.value}
        </Text>

        <Text style={styles.metricUnit}>
          {props.unit}
        </Text>
      </View>

      <View style={styles.progressBackground}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${props.progress}%`,
              backgroundColor: props.progressColor,
            },
          ]}
        />
      </View>

      <Text style={styles.targetText}>
        🎯 {props.target}
      </Text>
    </View>
  );
}

export default function HomeScreen() {
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* welcome section */}
        <View style={styles.header}>
          <Text style={styles.appName}>
            🌿 HEALTHMATE
          </Text>

          <Text style={styles.greeting}>
            Hello! 👋
          </Text>

          <Text style={styles.headerMessage}>
            Let's make today a healthy day!
          </Text>

          <View style={styles.dateBadge}>
            <Text style={styles.dateText}>
              📅 {today}
            </Text>
          </View>
        </View>

        {/* daily health information */}
        <View style={styles.dashboardSection}>
          <Text style={styles.sectionTitle}>
           Today's Health Overview
          </Text>

          <Text style={styles.sectionDescription}>
            Here is how you are doing today.
          </Text>

          {/* steps card */}
          <HealthMetricCard
            title="Steps"
            emoji="👟"
            value={todayHealth.steps.toLocaleString()}
            unit="steps"
            target={`Daily target: ${dailyTargets.steps.toLocaleString()} steps`}
            progress={calculateProgress(
              todayHealth.steps,
              dailyTargets.steps
            )}
            cardBackground="#EAF0FF"
            iconBackground="#D5E3FF"
            progressColor="#2864DD"
          />

        </View>

        {/* daily encouragement */}
        <View style={styles.reminderCard}>
          <Text style={styles.reminderTitle}>
            💚 Your daily reminder
          </Text>

          <Text style={styles.reminderText}>
            Small healthy habits can make a big difference.
            Keep going and take care of yourself!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4F6FB',
  },

  scrollContent: {
    paddingBottom: 25,
  },

  header: {
    backgroundColor: '#176B4D',
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 28,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },

  appName: {
    color: '#D4F1DF',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 22,
  },

  greeting: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 7,
  },

  headerMessage: {
    fontSize: 15,
    color: '#E4F4E9',
  },

  dateBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#328461',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    marginTop: 18,
  },

  dateText: {
    color: '#FFFFFF',
    fontSize: 13,
  },

  dashboardSection: {
    paddingHorizontal: 18,
    paddingTop: 25,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#26382D',
  },

  sectionDescription: {
    fontSize: 13,
    color: '#78857B',
    marginTop: 6,
    marginBottom: 18,
  },

  metricCard: {
    borderRadius: 22,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },

  metricHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    gap: 13,
  },

  emojiBox: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emoji: {
    fontSize: 26,
  },

  metricTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#536175',
  },

  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 17,
  },

  metricValue: {
    fontSize: 29,
    fontWeight: 'bold',
    color: '#192A50',
  },

  metricUnit: {
    fontSize: 14,
    color: '#718092',
    marginLeft: 7,
  },

  progressBackground: {
    height: 9,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 12,
  },

  progressFill: {
    height: '100%',
    borderRadius: 10,
  },

  targetText: {
    fontSize: 12,
    color: '#718092',
  },

  reminderCard: {
    backgroundColor: '#E9E5FA',
    marginHorizontal: 18,
    marginTop: 3,
    padding: 19,
    borderRadius: 18,
  },

  reminderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#55468C',
    marginBottom: 8,
  },

  reminderText: {
    fontSize: 13,
    lineHeight: 21,
    color: '#645B86',
  },
});
