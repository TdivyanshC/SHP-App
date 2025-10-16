import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';

export default function AboutScreen() {
  const { theme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const isDark = theme === 'dark';

  const milestones = [
    { year: '2023', title: 'Party Formation', description: 'Swadeshi Hind Party founded' },
    { year: '2024', title: 'Digital Presence', description: 'Launched official website and social media' },
    { year: '2025', title: 'Mobile App', description: 'Launched Swadeshi Hind mobile app' },
  ];

  const openWebsite = () => {
    Linking.openURL('https://swadeshihindparty.in');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#111111' : '#FFFDF5' }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Language Toggle */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: isDark ? '#FFF' : '#111' }]}>About</Text>
          <TouchableOpacity onPress={toggleLanguage} style={styles.langToggle}>
            <Text style={[styles.langText, { color: isDark ? '#FFF' : '#111' }]}>
              {language === 'en' ? 'EN' : 'हि'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Hero Banner */}
        <LinearGradient
          colors={['#FF9933', '#138808']}
          style={styles.heroCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.heroTitle}>Swadeshi Hind Party</Text>
          <Text style={styles.heroTagline}>Swadeshi Soch. Swadeshi Rashtra.</Text>
        </LinearGradient>

        {/* Who We Are */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#111' }]}>
            {language === 'en' ? 'Who We Are' : 'हम कौन हैं'}
          </Text>
          <View
            style={[
              styles.contentCard,
              {
                backgroundColor: isDark ? '#1A1A1A' : '#FFF',
                borderColor: isDark ? '#333' : '#E0E0E0',
              },
            ]}
          >
            <Text style={[styles.contentText, { color: isDark ? '#DDD' : '#333' }]}>
              {language === 'en'
                ? 'Swadeshi Hind Party is a movement dedicated to building a self-reliant, transparent, and prosperous India. We believe in the power of indigenous solutions, grassroots empowerment, and data-driven governance.'
                : 'स्वदेशी हिन्द पार्टी एक आत्मनिर्भर, पारदर्शी और समृद्ध भारत बनाने के लिए समर्पित एक आंदोलन है। हम स्वदेशी समाधान, जमीनी स्तर पर सशक्तीकरण और डेटा-संचालित शासन की शक्ति में विश्वास करते हैं।'}
            </Text>
          </View>
        </View>

        {/* Our Mission */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#111' }]}>
            {language === 'en' ? 'Our Mission' : 'हमारा मिशन'}
          </Text>
          <View style={styles.missionGrid}>
            <View
              style={[
                styles.missionCard,
                {
                  backgroundColor: isDark ? '#1A1A1A' : '#FFF',
                  borderColor: isDark ? '#333' : '#E0E0E0',
                },
              ]}
            >
              <Ionicons name="shield-checkmark" size={32} color="#FF9933" />
              <Text style={[styles.missionTitle, { color: isDark ? '#FFF' : '#111' }]}>
                {language === 'en' ? 'Transparency' : 'पारदर्शिता'}
              </Text>
            </View>
            <View
              style={[
                styles.missionCard,
                {
                  backgroundColor: isDark ? '#1A1A1A' : '#FFF',
                  borderColor: isDark ? '#333' : '#E0E0E0',
                },
              ]}
            >
              <Ionicons name="people" size={32} color="#138808" />
              <Text style={[styles.missionTitle, { color: isDark ? '#FFF' : '#111' }]}>
                {language === 'en' ? 'Empowerment' : 'सशक्तिकरण'}
              </Text>
            </View>
            <View
              style={[
                styles.missionCard,
                {
                  backgroundColor: isDark ? '#1A1A1A' : '#FFF',
                  borderColor: isDark ? '#333' : '#E0E0E0',
                },
              ]}
            >
              <Ionicons name="trending-up" size={32} color="#4A90E2" />
              <Text style={[styles.missionTitle, { color: isDark ? '#FFF' : '#111' }]}>
                {language === 'en' ? 'Growth' : 'विकास'}
              </Text>
            </View>
          </View>
        </View>

        {/* Timeline */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#111' }]}>
            {language === 'en' ? 'Our Journey' : 'हमारी यात्रा'}
          </Text>
          {milestones.map((milestone, index) => (
            <View
              key={index}
              style={[
                styles.timelineCard,
                {
                  backgroundColor: isDark ? '#1A1A1A' : '#FFF',
                  borderColor: isDark ? '#333' : '#E0E0E0',
                },
              ]}
            >
              <View style={styles.yearBadge}>
                <Text style={styles.yearText}>{milestone.year}</Text>
              </View>
              <View style={styles.timelineContent}>
                <Text style={[styles.timelineTitle, { color: isDark ? '#FFF' : '#111' }]}>
                  {milestone.title}
                </Text>
                <Text style={[styles.timelineDescription, { color: isDark ? '#AAA' : '#666' }]}>
                  {milestone.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Contact */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#111' }]}>
            {language === 'en' ? 'Connect with Us' : 'हमसे जुड़ें'}
          </Text>
          <TouchableOpacity
            style={[
              styles.websiteCard,
              {
                backgroundColor: isDark ? '#1A1A1A' : '#FFF',
                borderColor: isDark ? '#333' : '#E0E0E0',
              },
            ]}
            onPress={openWebsite}
          >
            <Ionicons name="globe" size={24} color="#FF9933" />
            <Text style={[styles.websiteText, { color: isDark ? '#FFF' : '#111' }]}>
              swadeshihindparty.in
            </Text>
            <Ionicons name="chevron-forward" size={20} color={isDark ? '#AAA' : '#666'} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  langToggle: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FF9933',
  },
  langText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  heroCard: {
    marginHorizontal: 24,
    padding: 40,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF',
  },
  heroTagline: {
    fontSize: 16,
    color: '#FFF',
    opacity: 0.9,
    marginTop: 8,
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  contentCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  contentText: {
    fontSize: 15,
    lineHeight: 24,
  },
  missionGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  missionCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  missionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  timelineCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  yearBadge: {
    backgroundColor: '#FF9933',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    height: 32,
  },
  yearText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
  timelineContent: {
    flex: 1,
    marginLeft: 16,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  timelineDescription: {
    fontSize: 13,
    marginTop: 4,
  },
  websiteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  websiteText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
});