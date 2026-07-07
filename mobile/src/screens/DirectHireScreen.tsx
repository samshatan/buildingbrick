import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import apiClient from '../api/client';
import { SPACING, RADIUS, SHADOWS } from '../theme/theme';
import { useTheme } from '../context/ThemeProvider';

export default function DirectHireScreen({ route, navigation }: any) {
  const { theme } = useTheme();
  const COLORS = theme;
  const styles = getStyles(COLORS);
  const { worker } = route.params || {};

  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [buildingType, setBuildingType] = useState('');
  const [loading, setLoading] = useState(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: 28.6139,
    longitude: 77.2090,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setMapRegion({
        ...mapRegion,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      let geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (geocode.length > 0) {
        const addr = `${geocode[0].name || ''} ${geocode[0].street || ''}, ${geocode[0].city || ''}, ${geocode[0].region || ''}`;
        setAddress(addr.trim());
      }
    } catch (error) {
      console.log('Error getting location', error);
    }
  };

  const handleHireRequest = async () => {
    if (!description || !address || !date) {
      Alert.alert('Missing Info', 'Please fill in all details to request this expert.');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/direct-requests', {
        workerId: worker?._id || worker?.id,
        description,
        address,
        buildingType,
        date
      });

      if (response.data) {
        Alert.alert('Request Sent', `Your booking request has been sent to ${worker?.name || 'the expert'}.`, [
          { text: 'View My Jobs', onPress: () => navigation.navigate('Jobs') },
          { text: 'Done', onPress: () => navigation.popToTop() }
        ]);
      }
    } catch (error: any) {
      Alert.alert('Booking Error', error.response?.data?.message || 'Failed to send request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Book {worker?.name || 'Expert'}</Text>
          <Text style={styles.subtitle}>Provide project details for a custom estimate.</Text>
        </View>

        <View style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>PROJECT DESCRIPTION</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe what you need help with..."
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
              placeholderTextColor={COLORS.textLight}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>BUILDING TYPE</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
              {['Corporate', 'Residential', 'High Rise'].map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setBuildingType(type)}
                  style={[
                    styles.input,
                    { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.sm },
                    buildingType === type && { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10' }
                  ]}
                >
                  <Text style={{ fontSize: 12, fontWeight: buildingType === type ? '700' : '500', color: buildingType === type ? COLORS.primary : COLORS.text }}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <Text style={[styles.label, { marginBottom: 0 }]}>SITE LOCATION</Text>
              <TouchableOpacity onPress={getLocation}>
                <Text style={{ color: COLORS.primary, fontSize: 12, fontWeight: '700' }}>Get Current Location</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="e.g. 123 Construction Rd, City"
              value={address}
              onChangeText={setAddress}
              placeholderTextColor={COLORS.textLight}
            />
            <View style={styles.mapContainer}>
              <MapView 
                style={styles.map} 
                region={mapRegion}
                onRegionChangeComplete={(region) => setMapRegion(region)}
              >
                <Marker coordinate={{ latitude: mapRegion.latitude, longitude: mapRegion.longitude }} />
              </MapView>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>PREFERRED START DATE</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. July 15, 2026"
              value={date}
              onChangeText={setDate}
              placeholderTextColor={COLORS.textLight}
            />
          </View>

          <View style={styles.estimateBox}>
            <Text style={styles.estimateTitle}>Pricing Model</Text>
            <View style={styles.estimateRow}>
              <Text style={styles.estimateLabel}>Base Daily Rate</Text>
              <Text style={styles.estimateValue}>${worker?.dailyRate || worker?.pricePerHour || '200'}</Text>
            </View>
            <Text style={styles.estimateNote}>
              The final estimate will be confirmed by the expert after reviewing your project details.
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.submitBtn, loading && styles.disabledBtn]}
            onPress={handleHireRequest}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={styles.btnContent}>
                <Text style={styles.submitBtnText}>SEND BOOKING REQUEST</Text>
                <Text style={styles.btnArrow}>→</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const getStyles = (COLORS: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    padding: SPACING.xl,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 6,
    lineHeight: 20,
  },
  formCard: {
    margin: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textLight,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontSize: 15,
    color: COLORS.text,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  estimateBox: {
    backgroundColor: '#F5F2ED',
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  estimateTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 12,
  },
  estimateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  estimateLabel: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
  },
  estimateValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
  },
  estimateNote: {
    fontSize: 12,
    color: COLORS.primaryDark,
    marginTop: 8,
    fontStyle: 'italic',
    lineHeight: 18,
    opacity: 0.8,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    borderRadius: RADIUS.full,
    ...SHADOWS.lg,
  },
  disabledBtn: {
    opacity: 0.7,
  },
  btnContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 1,
  },
  btnArrow: {
    color: '#FFF',
    fontSize: 20,
  },
  mapContainer: {
    height: 150,
    marginTop: SPACING.md,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
