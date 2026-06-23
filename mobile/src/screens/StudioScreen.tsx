import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../theme/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function StudioScreen({ navigation }: any) {
  const [brickStyle, setBrickStyle] = useState('#cc4518');
  const [roofStyle, setRoofStyle] = useState('#1a1a1a');

  const brickPresets = [
    { name: 'Classic Red', color: '#cc4518' },
    { name: 'Weathered', color: '#965a3e' },
    { name: 'Modern White', color: '#f0f0f0' },
    { name: 'Charcoal', color: '#333333' }
  ];

  const roofPresets = [
    { name: 'Slate Black', color: '#1a1a1a' },
    { name: 'Navy Blue', color: '#1b2a47' },
    { name: 'Terracotta', color: '#9e4624' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* 3D Simulation Placeholder */}
      <View style={styles.viewerContainer}>
        <View style={styles.overlayHeader}>
          <Text style={styles.viewerTitle}>3D Studio Designer</Text>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.placeholderHouse}>
          <View style={[styles.roof, { borderBottomColor: roofStyle }]} />
          <View style={[styles.walls, { backgroundColor: brickStyle }]} />
          <View style={styles.door} />
          <View style={styles.window} />
        </View>

        <View style={styles.instructions}>
          <Text style={styles.instructionText}>3D Engine Loading Preview...</Text>
        </View>
      </View>

      {/* Controls Container */}
      <Animated.View entering={SlideInDown.duration(600)} style={styles.controlsContainer}>
        <View style={styles.handle} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.controlSection}>
            <Text style={styles.sectionLabel}>WALL MATERIAL</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
              {brickPresets.map((preset) => (
                <TouchableOpacity
                  key={preset.name}
                  onPress={() => setBrickStyle(preset.color)}
                  style={styles.presetItem}
                >
                  <View
                    style={[
                      styles.colorCircle,
                      { backgroundColor: preset.color },
                      brickStyle === preset.color && styles.activeBorder
                    ]}
                  />
                  <Text style={styles.presetName}>{preset.name.toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.controlSection}>
            <Text style={styles.sectionLabel}>ROOFING STYLE</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
              {roofPresets.map((preset) => (
                <TouchableOpacity
                  key={preset.name}
                  onPress={() => setRoofStyle(preset.color)}
                  style={styles.presetItem}
                >
                  <View
                    style={[
                      styles.colorCircle,
                      { backgroundColor: preset.color },
                      roofStyle === preset.color && styles.activeBorderDark
                    ]}
                  />
                  <Text style={styles.presetName}>{preset.name.toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <TouchableOpacity style={styles.saveBtn}>
            <Text style={styles.saveBtnText}>SAVE TO MY PROJECTS</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.zinc900,
  },
  viewerContainer: {
    height: SCREEN_HEIGHT * 0.55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayHeader: {
    position: 'absolute',
    top: SPACING.xl,
    left: SPACING.lg,
    right: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  viewerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFF',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: RADIUS.full,
  },
  closeBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholderHouse: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 200,
    height: 200,
  },
  roof: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 100,
    borderRightWidth: 100,
    borderBottomWidth: 70,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  walls: {
    width: 180,
    height: 100,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  door: {
    position: 'absolute',
    bottom: 0,
    width: 30,
    height: 50,
    backgroundColor: '#333',
    left: 85,
  },
  window: {
    position: 'absolute',
    bottom: 40,
    width: 25,
    height: 25,
    backgroundColor: '#87CEEB',
    left: 40,
    borderWidth: 1,
    borderColor: '#FFF',
  },
  instructions: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
  },
  instructionText: {
    color: '#AAA',
    fontSize: 12,
    fontWeight: '600',
  },
  controlsContainer: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    ...SHADOWS.lg,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  controlSection: {
    marginBottom: SPACING.xl,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textLight,
    letterSpacing: 2,
    marginBottom: 16,
  },
  presetScroll: {
    flexDirection: 'row',
  },
  presetItem: {
    alignItems: 'center',
    marginRight: 20,
    gap: 8,
  },
  colorCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    ...SHADOWS.sm,
    borderWidth: 4,
    borderColor: '#FFF',
  },
  activeBorder: {
    borderColor: COLORS.primary,
    transform: [{ scale: 1.1 }],
  },
  activeBorderDark: {
    borderColor: COLORS.zinc900,
    transform: [{ scale: 1.1 }],
  },
  presetName: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textLight,
    letterSpacing: 1,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    marginTop: SPACING.md,
    marginBottom: 40,
    ...SHADOWS.md,
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
});
