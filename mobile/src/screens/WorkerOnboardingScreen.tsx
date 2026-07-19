import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Image as ImageIcon } from 'lucide-react-native';
import apiClient from '../api/client';
import { SPACING, RADIUS, SHADOWS } from '../theme/theme';
import { useTheme } from '../context/ThemeProvider';

export default function WorkerOnboardingScreen({ navigation }: any) {
  const { theme } = useTheme();
  const COLORS = theme;
  const styles = getStyles(COLORS);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    displayName: '',
    jobTitle: '',
    bio: '',
    skills: '',
    dailyRate: '',
    experienceYears: '',
    location: '',
    address: '',
    homeAddress: '',
    postalCode: '',
    state: '',
    district: '',
    fatherName: '',
    aadharCard: '',
    aadharCardImage: '',
    panCard: '',
    panCardImage: '',
    bankPassbook: '',
    termsAccepted: true,
  });

  const updateForm = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (step === 1 && (!formData.displayName || !formData.jobTitle)) {
      Alert.alert('Required', 'Please fill in your name and job title.');
      return;
    }
    if (step === 2 && (!formData.aadharCard || !formData.panCard || !formData.aadharCardImage || !formData.panCardImage)) {
      Alert.alert('Required', 'Identity documents (numbers and photos) are required for verification.');
      return;
    }
    setStep(step + 1);
  };

  const pickImage = async (field: string) => {
    Alert.alert(
      "Upload Document",
      "Choose a method",
      [
        {
          text: "Camera",
          onPress: async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') return Alert.alert('Permission Denied');
            let result = await ImagePicker.launchCameraAsync({
              base64: true,
              quality: 0.5,
            });
            if (!result.canceled && result.assets[0].base64) {
              updateForm(field, `data:image/jpeg;base64,${result.assets[0].base64}`);
            }
          }
        },
        {
          text: "Gallery",
          onPress: async () => {
            let result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              base64: true,
              quality: 0.5,
            });
            if (!result.canceled && result.assets[0].base64) {
              updateForm(field, `data:image/jpeg;base64,${result.assets[0].base64}`);
            }
          }
        },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // In a real app, you'd fetch the user's worker profile ID first
      const userRes = await apiClient.get('/auth/me');
      const userId = userRes.data.id;

      const workerRes = await apiClient.get(`/workers/user/${userId}`);
      const workerId = workerRes.data._id;

      await apiClient.patch(`/workers/${workerId}/profile`, formData);

      Alert.alert('Application Submitted', 'Your profile is now under review. We will notify you once verified.', [
        { text: 'OK', onPress: () => navigation.navigate('Home') }
      ]);
    } catch (error: any) {      Alert.alert('Error', error.response?.data?.message || 'Failed to submit application.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Basic Professional Info</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Full Name (as per Aadhar)</Text>
        <TextInput
          style={styles.input}
          value={formData.displayName}
          onChangeText={(v) => updateForm('displayName', v)}
          placeholder="John Doe"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Primary Job Skill</Text>
        <TextInput
          style={styles.input}
          value={formData.jobTitle}
          onChangeText={(v) => updateForm('jobTitle', v)}
          placeholder="e.g. Master Plumber"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Daily Rate ($)</Text>
        <TextInput
          style={styles.input}
          value={formData.dailyRate}
          onChangeText={(v) => updateForm('dailyRate', v)}
          keyboardType="numeric"
          placeholder="e.g. 200"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Years of Experience</Text>
        <TextInput
          style={styles.input}
          value={formData.experienceYears}
          onChangeText={(v) => updateForm('experienceYears', v)}
          keyboardType="numeric"
          placeholder="e.g. 8"
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Identity Verification</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Aadhar Card Number</Text>
        <TextInput
          style={styles.input}
          value={formData.aadharCard}
          onChangeText={(v) => updateForm('aadharCard', v)}
          keyboardType="numeric"
          maxLength={12}
        />
        <TouchableOpacity style={styles.imagePickerBtn} onPress={() => pickImage('aadharCardImage')}>
          <Camera size={20} color={COLORS.primary} />
          <Text style={styles.imagePickerText}>
            {formData.aadharCardImage ? 'Aadhar Photo Added' : 'Upload Aadhar Photo'}
          </Text>
        </TouchableOpacity>
        {formData.aadharCardImage ? (
          <Image source={{ uri: formData.aadharCardImage }} style={styles.previewImage} />
        ) : null}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>PAN Card Number</Text>
        <TextInput
          style={styles.input}
          value={formData.panCard}
          onChangeText={(v) => updateForm('panCard', v)}
          autoCapitalize="characters"
          maxLength={10}
        />
        <TouchableOpacity style={styles.imagePickerBtn} onPress={() => pickImage('panCardImage')}>
          <Camera size={20} color={COLORS.primary} />
          <Text style={styles.imagePickerText}>
            {formData.panCardImage ? 'PAN Photo Added' : 'Upload PAN Photo'}
          </Text>
        </TouchableOpacity>
        {formData.panCardImage ? (
          <Image source={{ uri: formData.panCardImage }} style={styles.previewImage} />
        ) : null}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Father's Name</Text>
        <TextInput
          style={styles.input}
          value={formData.fatherName}
          onChangeText={(v) => updateForm('fatherName', v)}
        />
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Banking & Location</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Bank Account / Passbook Number</Text>
        <TextInput
          style={styles.input}
          value={formData.bankPassbook}
          onChangeText={(v) => updateForm('bankPassbook', v)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Current City</Text>
        <TextInput
          style={styles.input}
          value={formData.location}
          onChangeText={(v) => updateForm('location', v)}
          placeholder="e.g. New Delhi"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Full Residential Address</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.address}
          onChangeText={(v) => updateForm('address', v)}
          multiline
          numberOfLines={3}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${(step / 3) * 100}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Worker Onboarding</Text>
        <Text style={styles.subHeader}>Step {step} of 3</Text>

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}

        <View style={styles.footer}>
          {step > 1 && (
            <TouchableOpacity style={styles.backBtn} onPress={() => setStep(step - 1)}>
              <Text style={styles.backBtnText}>Back</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.nextBtn}
            onPress={step === 3 ? handleSubmit : handleNext}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : (
              <Text style={styles.nextBtnText}>{step === 3 ? 'Submit Application' : 'Continue'}</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}


const getStyles = (COLORS: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  progressContainer: {
    height: 4,
    backgroundColor: COLORS.border,
    width: '100%',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.accent,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  header: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: SPACING.md,
  },
  subHeader: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: SPACING.xl,
  },
  stepContainer: {
    marginBottom: SPACING.xl,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontSize: 16,
    color: COLORS.text,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    marginTop: SPACING.xl,
  },
  backBtn: {
    flex: 1,
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    color: COLORS.textLight,
    fontWeight: '700',
  },
  nextBtn: {
    flex: 2,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  nextBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  imagePickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed'
  },
  imagePickerText: {
    marginLeft: SPACING.sm,
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14
  },
  previewImage: {
    width: '100%',
    height: 150,
    borderRadius: RADIUS.md,
    marginTop: SPACING.sm,
    resizeMode: 'cover'
  }
});
