import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Modal,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

interface NewsArticle {
  _id: string;
  title_en: string;
  title_hi: string;
  summary_en: string;
  summary_hi: string;
  content_en: string;
  content_hi: string;
  image_base64: string;
  truth_score: number;
  source: string;
  fact_vs_claim_en: string;
  fact_vs_claim_hi: string;
}

export default function NewsScreen() {
  const { theme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const isDark = theme === 'dark';
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [showFactModal, setShowFactModal] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/news`);
      const data = await response.json();
      setNews(data.news || []);
    } catch (error) {
      console.error('Failed to fetch news:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNews();
    setRefreshing(false);
  };

  const openFactCheck = (article: NewsArticle) => {
    setSelectedArticle(article);
    setShowFactModal(true);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#111111' : '#FFFDF5' }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? '#FFF' : '#111' }]}>News</Text>
        <TouchableOpacity onPress={toggleLanguage} style={styles.langToggle}>
          <Text style={[styles.langText, { color: isDark ? '#FFF' : '#111' }]}>
            {language === 'en' ? 'EN' : 'हि'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {news.map((article) => (
          <TouchableOpacity
            key={article._id}
            style={[
              styles.articleCard,
              {
                backgroundColor: isDark ? '#1A1A1A' : '#FFF',
                borderColor: isDark ? '#333' : '#E0E0E0',
              },
            ]}
            activeOpacity={0.8}
          >
            {/* Article Image */}
            <Image
              source={{ uri: article.image_base64 }}
              style={styles.articleImage}
              resizeMode="cover"
            />

            {/* Truth Score Badge */}
            <View
              style={[
                styles.truthBadge,
                {
                  backgroundColor:
                    article.truth_score >= 0.8 ? '#138808' : article.truth_score >= 0.6 ? '#FFD93D' : '#FF6B6B',
                },
              ]}
            >
              <Text style={styles.truthText}>
                {Math.round(article.truth_score * 100)}% Truth Score
              </Text>
            </View>

            {/* Article Content */}
            <View style={styles.articleContent}>
              <Text style={[styles.articleTitle, { color: isDark ? '#FFF' : '#111' }]}>
                {language === 'en' ? article.title_en : article.title_hi}
              </Text>
              <Text style={[styles.articleSummary, { color: isDark ? '#AAA' : '#666' }]}>
                {language === 'en' ? article.summary_en : article.summary_hi}
              </Text>
              <View style={styles.articleFooter}>
                <Text style={[styles.source, { color: isDark ? '#888' : '#999' }]}>
                  {article.source}
                </Text>
                <TouchableOpacity
                  style={styles.factButton}
                  onPress={() => openFactCheck(article)}
                >
                  <Ionicons name="checkmark-circle" size={16} color="#FF9933" />
                  <Text style={styles.factButtonText}>Fact Check</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Fact vs Claim Modal */}
      <Modal
        visible={showFactModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFactModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: isDark ? '#1A1A1A' : '#FFF' },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#111' }]}>
                Fact vs Claim
              </Text>
              <TouchableOpacity onPress={() => setShowFactModal(false)}>
                <Ionicons name="close" size={24} color={isDark ? '#FFF' : '#111'} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={[styles.factText, { color: isDark ? '#DDD' : '#333' }]}>
                {selectedArticle &&
                  (language === 'en'
                    ? selectedArticle.fact_vs_claim_en
                    : selectedArticle.fact_vs_claim_hi)}
              </Text>
            </ScrollView>
          </View>
        </View>
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
  articleCard: {
    marginHorizontal: 24,
    marginBottom: 20,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  articleImage: {
    width: '100%',
    height: 200,
  },
  truthBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  truthText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  articleContent: {
    padding: 16,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  articleSummary: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  articleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  source: {
    fontSize: 12,
  },
  factButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  factButtonText: {
    color: '#FF9933',
    fontSize: 13,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: '40%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  modalBody: {
    flex: 1,
  },
  factText: {
    fontSize: 15,
    lineHeight: 24,
  },
});