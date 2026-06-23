import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../theme/theme';

export default function WorkerDetailsScreen({ route, navigation }: any) {
  const { worker } = route.params || {};

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarPlaceholder} />
        <Text style={styles.name}>{worker?.name || worker?.displayName || 'Worker Name'}</Text>
        <Text style={styles.role}>{worker?.jobTitle || worker?.workerType || 'Skilled Professional'}</Text>
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>⭐ {worker?.rating || '4.5'} (120 reviews)</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Hourly Rate</Text>
            <Text style={styles.statValue}>${worker?.pricePerHour || worker?.dailyRate || '25'}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Experience</Text>
            <Text style={styles.statValue}>{worker?.experienceYears || worker?.experience || '5'} Yrs</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Status</Text>
            <Text style={[styles.statValue, { color: COLORS.accent }]}>{worker?.availabilityStatus || 'Available'}</Text>
          </View>
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>About Professional</Text>
          <Text style={styles.aboutText}>
            {worker?.description || worker?.bio ||
              "I am a highly skilled professional with years of experience in my field. I take pride in delivering high-quality work on time and ensuring complete customer satisfaction."}
          </Text>

          <Text style={styles.sectionTitle}>Skills & Expertise</Text>
          <View style={styles.skillsContainer}>
            {(worker?.skills || worker?.workerType || 'Construction, Plumbing').split(',').map((skill: string, i: number) => (
              <View key={i} style={styles.skillTag}>
                <Text style={styles.skillText}>{skill.trim()}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Location</Text>
          <Text style={styles.infoText}>📍 {worker?.location || worker?.address || 'New Delhi, India'}</Text>
        </View>
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.messageBtn}>
          <Text style={styles.messageBtnText}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.hireBtn}
          onPress={() => navigation.navigate('DirectHire', { worker })}
        >
          <Text style={styles.hireBtnText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    padding: SPACING.xl,
    paddingTop: SPACING.xl * 2,
    borderBottomLeftRadius: RADIUS.xl,
    borderBottomRightRadius: RADIUS.xl,
    ...SHADOWS.lg,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: RADIUS.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: SPACING.md,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.surface,
  },
  role: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
  ratingBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    marginTop: SPACING.md,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.warning,
  },
  content: {
    padding: SPACING.md,
    marginTop: -SPACING.xl,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    justifyContent: 'space-between',
    alignItems: 'center',
    ...SHADOWS.md,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.border,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primary,
  },
  detailsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginTop: SPACING.md,
    ...SHADOWS.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  aboutText: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 24,
  },
  infoText: {
    fontSize: 15,
    color: COLORS.textLight,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.xs,
  },
  skillTag: {
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  skillText: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '600',
  },
  actionContainer: {
    flexDirection: 'row',
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  messageBtn: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  messageBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  hireBtn: {
    flex: 2,
    backgroundColor: COLORS.secondary,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    marginLeft: SPACING.sm,
    ...SHADOWS.md,
  },
  hireBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.surface,
  },
});
