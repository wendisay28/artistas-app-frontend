// components/profile/sections/AboutSection.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../constants/colors';
import DetailRow from '../shared/DetailRow';

interface AboutSectionProps {
  bio: string;
  details: Array<{ icon: string; value: string }>;
  skills: string[];
}

export default function AboutSection({
  bio,
  details,
  skills,
}: AboutSectionProps) {
  return (
    <View style={styles.aboutSection}>
      {/* Bio Card */}
      <View style={styles.aboutCard}>
        <View style={styles.aboutIconRow}>
          <Ionicons name="sparkles" size={18} color={colors.accent} />
        </View>
        <Text style={styles.aboutBio}>{bio}</Text>
      </View>

      {/* Details Card */}
      <View style={styles.aboutDetailsCard}>
        {details.map((detail, index) => (
          <DetailRow
            key={index}
            icon={detail.icon}
            value={detail.value}
          />
        ))}
      </View>

      {/* Skills Card */}
      <View style={styles.skillsCard}>
        <View style={styles.skillsGrid}>
          {skills.map((skill, index) => (
            <View key={index} style={styles.skillChip}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  aboutSection: {
    padding: 16,
    gap: 12,
  },
  aboutCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  aboutIconRow: {
    marginBottom: 10,
  },
  aboutBio: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
    lineHeight: 22,
  },
  aboutDetailsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  skillsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    backgroundColor: colors.primary + '10',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  skillText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.primary,
  },
});