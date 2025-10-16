import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function SupportScreen() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const isDark = theme === 'dark';
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [donationAmount, setDonationAmount] = useState('');
  const [todayQuote, setTodayQuote] = useState<any>(null);
  const [volunteerForm, setVolunteerForm] = useState({
    name: '',
    email: '',
    phone: '',
    state: '',
    message: '',
  });

  useEffect(() => {
    fetchTodayQuote();
  }, []);

  const fetchTodayQuote = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/quotes/today`);
      const data = await response.json();
      setTodayQuote(data);
    } catch (error) {
      console.error('Failed to fetch quote:', error);
    }
  };

  const handleDonate = () => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid donation amount');
      return;
    }
    // Mock payment success
    Alert.alert(
      'Thank You!',
      `Your donation of ₹${donationAmount} has been processed. (Mock Payment)`,
      [{ text: 'OK', onPress: () => setShowDonationModal(false) }]
    );
    setDonationAmount('');
  };

  const handleVolunteerSubmit = async () => {
    if (!volunteerForm.name || !volunteerForm.email || !volunteerForm.phone) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/volunteer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(volunteerForm),
      });
      const data = await response.json();
      if (data.success) {
        Alert.alert(
          'Thank You!',
          'Your volunteer application has been submitted successfully.',
          [
            {
              text: 'OK',
              onPress: () => {
                setShowVolunteerModal(false);
                setVolunteerForm({
                  name: '',
                  email: '',
                  phone: '',
                  state: '',
                  message: '',
                });
              },
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit volunteer form');
      console.error('Failed to submit volunteer form:', error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#111111' : '#FFFDF5' }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: isDark ? '#FFF' : '#111' }]}>Support</Text>
        </View>

        {/* Donation Section */}
        <TouchableOpacity
          onPress={() => setShowDonationModal(true)}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#FF9933', '#FF6B00']}
            style={styles.donationCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="heart" size={40} color="#FFF" />
            <Text style={styles.donationTitle}>Support Our Mission</Text>
            <Text style={styles.donationSubtitle}>
              Help us build a self-reliant India
            </Text>
            <View style={styles.donateButton}>
              <Text style={styles.donateButtonText}>Donate Now</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Fund Distribution */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#111' }]}>
            Where Your Money Goes
          </Text>
          <View
            style={[
              styles.distributionCard,
              {
                backgroundColor: isDark ? '#1A1A1A' : '#FFF',
                borderColor: isDark ? '#333' : '#E0E0E0',
              },
            ]}
          >
            <View style={styles.distributionItem}>
              <View style={styles.distributionBar}>
                <View style={[styles.distributionFill, { width: '60%', backgroundColor: '#FF9933' }]} />
              </View>
              <Text style={[styles.distributionLabel, { color: isDark ? '#DDD' : '#333' }]}>
                Community Programs (60%)
              </Text>
            </View>
            <View style={styles.distributionItem}>
              <View style={styles.distributionBar}>
                <View style={[styles.distributionFill, { width: '25%', backgroundColor: '#138808' }]} />
              </View>
              <Text style={[styles.distributionLabel, { color: isDark ? '#DDD' : '#333' }]}>
                Administrative (25%)
              </Text>
            </View>
            <View style={styles.distributionItem}>
              <View style={styles.distributionBar}>
                <View style={[styles.distributionFill, { width: '15%', backgroundColor: '#4A90E2' }]} />
              </View>
              <Text style={[styles.distributionLabel, { color: isDark ? '#DDD' : '#333' }]}>
                Research & Development (15%)
              </Text>
            </View>
          </View>
        </View>

        {/* Volunteer Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#111' }]}>
            Volunteer with Us
          </Text>
          <TouchableOpacity
            style={[
              styles.volunteerCard,
              {
                backgroundColor: isDark ? '#1A1A1A' : '#FFF',
                borderColor: isDark ? '#333' : '#E0E0E0',
              },
            ]}
            onPress={() => setShowVolunteerModal(true)}
          >
            <Ionicons name="people" size={32} color="#138808" />
            <Text style={[styles.volunteerTitle, { color: isDark ? '#FFF' : '#111' }]}>
              Join the Movement
            </Text>
            <Text style={[styles.volunteerSubtitle, { color: isDark ? '#AAA' : '#666' }]}>
              Be part of the change you want to see
            </Text>
          </TouchableOpacity>
        </View>

        {/* Today's Quote */}
        {todayQuote && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#111' }]}>
              Today's Thought
            </Text>
            <View
              style={[
                styles.quoteCard,
                {
                  backgroundColor: isDark ? '#1A1A1A' : '#FFF',
                  borderColor: isDark ? '#333' : '#E0E0E0',
                },
              ]}
            >
              <Ionicons name="quote" size={32} color="#FF9933" />
              <Text style={[styles.quoteText, { color: isDark ? '#DDD' : '#333' }]}>
                {language === 'en' ? todayQuote.quote_en : todayQuote.quote_hi}
              </Text>
              <Text style={[styles.quoteAuthor, { color: isDark ? '#AAA' : '#666' }]}>
                - {language === 'en' ? todayQuote.author_en : todayQuote.author_hi}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Donation Modal */}
      <Modal
        visible={showDonationModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDonationModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: isDark ? '#1A1A1A' : '#FFF' },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#111' }]}>
                Make a Donation
              </Text>
              <TouchableOpacity onPress={() => setShowDonationModal(false)}>
                <Ionicons name="close" size={24} color={isDark ? '#FFF' : '#111'} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? '#111' : '#F5F5F5',
                  color: isDark ? '#FFF' : '#111',
                },
              ]}
              placeholder="Enter amount (₹)"
              placeholderTextColor={isDark ? '#888' : '#999'}
              keyboardType="numeric"
              value={donationAmount}
              onChangeText={setDonationAmount}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleDonate}>
              <Text style={styles.submitButtonText}>Proceed to Payment (Mock)</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Volunteer Modal */}
      <Modal
        visible={showVolunteerModal}
        animationType="slide"
        transparent={false}
      >
        <SafeAreaView
          style={[styles.fullModalContainer, { backgroundColor: isDark ? '#111111' : '#FFFDF5' }]}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <View style={styles.fullModalHeader}>
              <TouchableOpacity onPress={() => setShowVolunteerModal(false)}>
                <Ionicons name="close" size={28} color={isDark ? '#FFF' : '#111'} />
              </TouchableOpacity>
              <Text style={[styles.fullModalTitle, { color: isDark ? '#FFF' : '#111' }]}>
                Volunteer Application
              </Text>
              <View style={{ width: 28 }} />
            </View>
            <ScrollView style={styles.formContainer}>
              <TextInput
                style={[
                  styles.formInput,
                  {
                    backgroundColor: isDark ? '#1A1A1A' : '#FFF',
                    color: isDark ? '#FFF' : '#111',
                    borderColor: isDark ? '#333' : '#E0E0E0',
                  },
                ]}
                placeholder="Full Name *"
                placeholderTextColor={isDark ? '#888' : '#999'}
                value={volunteerForm.name}
                onChangeText={(text) => setVolunteerForm({ ...volunteerForm, name: text })}
              />
              <TextInput
                style={[
                  styles.formInput,
                  {
                    backgroundColor: isDark ? '#1A1A1A' : '#FFF',
                    color: isDark ? '#FFF' : '#111',
                    borderColor: isDark ? '#333' : '#E0E0E0',
                  },
                ]}
                placeholder="Email *"
                placeholderTextColor={isDark ? '#888' : '#999'}
                keyboardType="email-address"
                value={volunteerForm.email}
                onChangeText={(text) => setVolunteerForm({ ...volunteerForm, email: text })}
              />
              <TextInput
                style={[
                  styles.formInput,
                  {
                    backgroundColor: isDark ? '#1A1A1A' : '#FFF',
                    color: isDark ? '#FFF' : '#111',
                    borderColor: isDark ? '#333' : '#E0E0E0',
                  },
                ]}
                placeholder="Phone Number *"
                placeholderTextColor={isDark ? '#888' : '#999'}
                keyboardType="phone-pad"
                value={volunteerForm.phone}
                onChangeText={(text) => setVolunteerForm({ ...volunteerForm, phone: text })}
              />
              <TextInput
                style={[
                  styles.formInput,
                  {
                    backgroundColor: isDark ? '#1A1A1A' : '#FFF',
                    color: isDark ? '#FFF' : '#111',
                    borderColor: isDark ? '#333' : '#E0E0E0',
                  },
                ]}
                placeholder="State"
                placeholderTextColor={isDark ? '#888' : '#999'}
                value={volunteerForm.state}
                onChangeText={(text) => setVolunteerForm({ ...volunteerForm, state: text })}
              />
              <TextInput
                style={[
                  styles.formInput,
                  styles.textArea,
                  {
                    backgroundColor: isDark ? '#1A1A1A' : '#FFF',
                    color: isDark ? '#FFF' : '#111',
                    borderColor: isDark ? '#333' : '#E0E0E0',
                  },
                ]}
                placeholder="Why do you want to volunteer?"
                placeholderTextColor={isDark ? '#888' : '#999'}
                multiline
                numberOfLines={4}
                value={volunteerForm.message}
                onChangeText={(text) => setVolunteerForm({ ...volunteerForm, message: text })}
              />
              <TouchableOpacity style={styles.submitButton} onPress={handleVolunteerSubmit}>
                <Text style={styles.submitButtonText}>Submit Application</Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
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
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  donationCard: {
    marginHorizontal: 24,
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
  },
  donationTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    marginTop: 16,
  },
  donationSubtitle: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.9,
    marginTop: 8,
  },
  donateButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 20,
  },
  donateButtonText: {
    fontSize: 16,
    fontWeight: '700',
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
  distributionCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    gap: 16,
  },
  distributionItem: {
    gap: 8,
  },
  distributionBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  distributionFill: {
    height: '100%',
    borderRadius: 4,
  },
  distributionLabel: {
    fontSize: 14,
  },
  volunteerCard: {
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
  },
  volunteerTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 12,
  },
  volunteerSubtitle: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  quoteCard: {
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
  },
  quoteText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
  quoteAuthor: {
    fontSize: 14,
    marginTop: 12,
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
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  input: {
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#FF9933',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  fullModalContainer: {
    flex: 1,
  },
  fullModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },
  fullModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    padding: 24,
  },
  formInput: {
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
});