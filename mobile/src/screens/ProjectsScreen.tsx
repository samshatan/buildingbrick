import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { FadeIn, FadeInLeft, FadeInDown } from 'react-native-reanimated';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../theme/theme';

const { width } = Dimensions.get('window');

export default function ProjectsScreen() {
  const projects = [
    {
      id: 1,
      title: "Lincoln Park Exterior",
      status: "In Progress",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      location: "Chicago, IL",
      completion: 65,
    },
    {
      id: 2,
      title: "Heritage Brick Resurfacing",
      status: "Completed",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      location: "Evanston, IL",
      completion: 100,
    },
    {
      id: 3,
      title: "Modern Facade Update",
      status: "Planning",
      image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80",
      location: "Oak Park, IL",
      completion: 15,
    }
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Animated.Text entering={FadeInLeft.duration(600)} style={styles.title}>
        Projects
      </Animated.Text>
      <Animated.Text entering={FadeInLeft.delay(100).duration(600)} style={styles.subtitle}>
        TRACK YOUR REMODELING PROGRESS
      </Animated.Text>

      <View style={styles.list}>
        {projects.map((project, index) => (
          <Animated.View
            key={project.id}
            entering={FadeInDown.delay(200 + (index * 100))}
            style={styles.card}
          >
            <View style={styles.imageContainer}>
              <Image source={{ uri: project.image }} style={styles.image} />
              <View style={styles.statusBadge}>
                <Text style={[
                  styles.statusText,
                  { color: project.status === 'Completed' ? COLORS.zinc900 : project.status === 'Planning' ? COLORS.textLight : COLORS.primary }
                ]}>
                  {project.status === 'Completed' ? '✓ ' : '🕒 '}{project.status.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.details}>
              <Text style={styles.projectTitle}>{project.title}</Text>
              <View style={styles.locationRow}>
                <Text style={styles.locationText}>📍 {project.location}</Text>
              </View>

              <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>PROGRESS</Text>
                  <Text style={styles.progressValue}>{project.completion}%</Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${project.completion}%`,
                        backgroundColor: project.completion === 100 ? COLORS.zinc900 : COLORS.primary
                      }
                    ]}
                  />
                </View>
              </View>
            </View>
          </Animated.View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
    paddingTop: SPACING.xl * 2,
    paddingBottom: 100,
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textLight,
    letterSpacing: 2,
    marginBottom: SPACING.xl,
  },
  list: {
    gap: SPACING.lg,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    ...SHADOWS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    ...SHADOWS.sm,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  details: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.xs,
  },
  projectTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  locationText: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  progressContainer: {
    gap: 10,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: 1,
  },
  progressValue: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.text,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
});
