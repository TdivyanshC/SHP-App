import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { theme, toggleTheme } = useTheme();
  const { language } = useLanguage();
  const isDark = theme === 'dark';

  const featuredCards = [
    {
      title: "India's Economic Rise",
      subtitle: "GDP Growth at 7.8%",
      gradient: ['#FF9933', '#FF6B00'],
    },
    {
      title: "Digital Revolution",
      subtitle: "1B+ Connected Citizens",
      gradient: ['#138808', '#0A5505'],
    },
    {
      title: "Swadeshi Movement",
      subtitle: "Building Self-Reliant India",
      gradient: ['#4A90E2', '#2E5C8A'],
    },
  ];

  const playCards = [
    {
      id: '1',
      title: 'Corruption Money',
      icon: 'cash-outline',
      color: '#FF6B6B',
    },
    {
      id: '2',
      title: 'Taxpayer Budget',
      icon: 'wallet-outline',
      color: '#4ECDC4',
    },
    {
      id: '3',
      title: 'Know Your Country',
      icon: 'school-outline',
      color: '#FFD93D',
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#111111' : '#FFFDF5' }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: isDark ? '#FFF' : '#111' }]}>
              Namaste, Citizen 👋
            </Text>
            <Text style={[styles.tagline, { color: isDark ? '#AAA' : '#666' }]}>
              Swadeshi Soch. Swadeshi Rashtra.
            </Text>
          </View>
          <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
            <Ionicons
              name={isDark ? 'sunny' : 'moon'}
              size={24}
              color={isDark ? '#FFF' : '#111'}
            />
          </TouchableOpacity>
        </View>

        {/* Featured Carousel */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#111' }]}>
            Today's Reality
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            decelerationRate="fast"
            snapToInterval={width - 48}
          >
            {featuredCards.map((card, index) => (
              <TouchableOpacity key={index} activeOpacity={0.9}>
                <LinearGradient
                  colors={card.gradient}
                  style={styles.featuredCard}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.featuredTitle}>{card.title}</Text>
                  <Text style={styles.featuredSubtitle}>{card.subtitle}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Play & Learn */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#111' }]}>
            Play & Learn
          </Text>
          <View style={styles.playGrid}>
            {playCards.map((card) => (
              <TouchableOpacity
                key={card.id}
                style={[
                  styles.playCard,
                  {
                    backgroundColor: isDark ? '#1A1A1A' : '#FFF',
                    borderColor: isDark ? '#333' : '#E0E0E0',
                  },
                ]}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.playIcon,
                    { backgroundColor: card.color + '20' },
                  ]}
                >
                  <Ionicons name={card.icon as any} size={32} color={card.color} />
                </View>
                <Text
                  style={[
                    styles.playCardTitle,
                    { color: isDark ? '#FFF' : '#111' },
                  ]}
                >
                  {card.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Action Board */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#111' }]}>
            Action Board
          </Text>
          <TouchableOpacity
            style={[
              styles.actionCard,
              {
                backgroundColor: isDark ? '#1A1A1A' : '#FFF',
                borderColor: isDark ? '#333' : '#E0E0E0',
              },
            ]}
          >
            <Ionicons
              name="poll"
              size={24}
              color="#FF9933"
              style={styles.actionIcon}
            />
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: isDark ? '#FFF' : '#111' }]}>
                Active Polls
              </Text>
              <Text style={[styles.actionSubtitle, { color: isDark ? '#AAA' : '#666' }]}>
                Share your voice on national issues
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isDark ? '#AAA' : '#666'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionCard,
              {
                backgroundColor: isDark ? '#1A1A1A' : '#FFF',
                borderColor: isDark ? '#333' : '#E0E0E0',
              },
            ]}
          >
            <Ionicons
              name="people"
              size={24}
              color="#138808"
              style={styles.actionIcon}
            />
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: isDark ? '#FFF' : '#111' }]}>
                Volunteer
              </Text>
              <Text style={[styles.actionSubtitle, { color: isDark ? '#AAA' : '#666' }]}>
                Join the movement for change
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isDark ? '#AAA' : '#666'}
            />
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
    paddingTop: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
  },
  tagline: {
    fontSize: 14,
    marginTop: 4,
  },
  themeToggle: {
    padding: 8,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 24,
    marginBottom: 16,
  },
  featuredCard: {
    width: width - 48,
    height: 180,
    marginLeft: 24,
    borderRadius: 24,
    padding: 24,
    justifyContent: 'flex-end',
    marginRight: 8,
  },
  featuredTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
  },
  featuredSubtitle: {
    fontSize: 16,
    color: '#FFF',
    opacity: 0.9,
    marginTop: 8,
  },
  playGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 16,
  },
  playCard: {
    width: (width - 64) / 2,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
  },
  playIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  playCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  actionIcon: {
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  actionSubtitle: {
    fontSize: 13,
    marginTop: 4,
  },
});