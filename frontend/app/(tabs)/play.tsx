import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';

const { width } = Dimensions.get('window');
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

interface Game {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export default function PlayScreen() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const isDark = theme === 'dark';
  const [xp, setXp] = useState(0);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [showGameModal, setShowGameModal] = useState(false);
  const [score, setScore] = useState(0);

  const games: Game[] = [
    {
      id: 'corruption',
      title: 'Where the Corruption Money Goes',
      description: 'Track corruption funds and learn about transparency',
      icon: 'cash-outline',
      color: '#FF6B6B',
    },
    {
      id: 'taxpayer',
      title: 'Spend the Taxpayer\'s Money',
      description: 'Allocate budget and see the impact',
      icon: 'wallet-outline',
      color: '#4ECDC4',
    },
    {
      id: 'quiz',
      title: 'Know Your Country',
      description: 'Timed quiz about India\'s governance and culture',
      icon: 'school-outline',
      color: '#FFD93D',
    },
  ];

  const openGame = (game: Game) => {
    setSelectedGame(game);
    setShowGameModal(true);
    setScore(0);
  };

  const completeGame = async () => {
    const earnedXP = Math.floor(Math.random() * 50) + 50;
    setXp(xp + earnedXP);
    
    try {
      await fetch(`${BACKEND_URL}/api/games/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game_id: selectedGame?.id,
          score: score,
          xp_earned: earnedXP,
        }),
      });
    } catch (error) {
      console.error('Failed to submit score:', error);
    }
    
    setShowGameModal(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#111111' : '#FFFDF5' }]}>
      {/* Header with XP */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? '#FFF' : '#111' }]}>Play & Learn</Text>
        <View style={styles.xpBadge}>
          <Ionicons name="star" size={20} color="#FFD93D" />
          <Text style={[styles.xpText, { color: isDark ? '#FFF' : '#111' }]}>{xp} XP</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Games List */}
        <View style={styles.gamesContainer}>
          {games.map((game) => (
            <TouchableOpacity
              key={game.id}
              onPress={() => openGame(game)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[game.color, game.color + 'AA']}
                style={styles.gameCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.gameIcon}>
                  <Ionicons name={game.icon as any} size={40} color="#FFF" />
                </View>
                <Text style={styles.gameTitle}>{game.title}</Text>
                <Text style={styles.gameDescription}>{game.description}</Text>
                <View style={styles.playButton}>
                  <Text style={styles.playButtonText}>Play Now</Text>
                  <Ionicons name="arrow-forward" size={16} color="#FFF" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Badges Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#111' }]}>
            Your Badges
          </Text>
          <View style={styles.badgesGrid}>
            <View
              style={[
                styles.badgeCard,
                {
                  backgroundColor: isDark ? '#1A1A1A' : '#FFF',
                  borderColor: isDark ? '#333' : '#E0E0E0',
                },
              ]}
            >
              <Ionicons name="trophy" size={32} color="#FFD93D" />
              <Text style={[styles.badgeName, { color: isDark ? '#FFF' : '#111' }]}>
                Aware Citizen
              </Text>
            </View>
            <View
              style={[
                styles.badgeCard,
                {
                  backgroundColor: isDark ? '#1A1A1A' : '#FFF',
                  borderColor: isDark ? '#333' : '#E0E0E0',
                  opacity: 0.5,
                },
              ]}
            >
              <Ionicons name="medal" size={32} color="#888" />
              <Text style={[styles.badgeName, { color: isDark ? '#FFF' : '#111' }]}>
                Truth Seeker
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Game Modal */}
      <Modal
        visible={showGameModal}
        animationType="slide"
        transparent={false}
      >
        <SafeAreaView
          style={[styles.modalContainer, { backgroundColor: isDark ? '#111111' : '#FFFDF5' }]}
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowGameModal(false)}>
              <Ionicons name="close" size={28} color={isDark ? '#FFF' : '#111'} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#111' }]}>
              {selectedGame?.title}
            </Text>
            <View style={{ width: 28 }} />
          </View>

          <View style={styles.gameContent}>
            <View
              style={[
                styles.gamePlaceholder,
                { backgroundColor: selectedGame?.color || '#FF9933' },
              ]}
            >
              <Ionicons name={selectedGame?.icon as any || 'game-controller'} size={80} color="#FFF" />
              <Text style={styles.gamePlaceholderText}>Game Interface Here</Text>
              <Text style={styles.gamePlaceholderSubtext}>
                Interactive gameplay will be implemented
              </Text>
            </View>

            <TouchableOpacity
              style={styles.completeButton}
              onPress={completeGame}
            >
              <Text style={styles.completeButtonText}>Complete Game</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
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
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFD93D20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  xpText: {
    fontSize: 16,
    fontWeight: '700',
  },
  gamesContainer: {
    padding: 24,
    gap: 20,
  },
  gameCard: {
    padding: 24,
    borderRadius: 24,
    minHeight: 200,
  },
  gameIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  gameTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 8,
  },
  gameDescription: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.9,
    marginBottom: 16,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  playButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  badgesGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  badgeCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  badgeName: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  gameContent: {
    flex: 1,
    padding: 24,
  },
  gamePlaceholder: {
    flex: 1,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  gamePlaceholderText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    marginTop: 24,
  },
  gamePlaceholderSubtext: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.8,
    marginTop: 8,
    textAlign: 'center',
  },
  completeButton: {
    backgroundColor: '#FF9933',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
});