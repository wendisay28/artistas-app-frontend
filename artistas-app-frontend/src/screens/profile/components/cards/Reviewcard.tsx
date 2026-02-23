import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Review } from '../types';
import { Colors, Radius, Spacing } from '../../../../theme';

type Props = { review: Review };

export const ReviewCard: React.FC<Props> = ({ review }) => (
  <View style={styles.card}>
    <View style={styles.header}>
      <View style={styles.reviewer}>
        <LinearGradient
          colors={review.reviewerAvatarGradient}
          style={styles.avatar}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.avatarText}>
            {review.reviewerName ? review.reviewerName[0].toUpperCase() : '?'}
          </Text>
        </LinearGradient>
        <View>
          <Text style={styles.name}>{review.reviewerName}</Text>
          <Text style={styles.service}>{review.serviceName}</Text>
        </View>
      </View>
      <Text style={styles.stars}>
        {'★'.repeat(review.stars)}{'☆'.repeat(5 - review.stars)}
      </Text>
    </View>
    <Text style={styles.text}>{review.text}</Text>
    <Text style={styles.date}>{review.date}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  reviewer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 16 },
  name: { fontSize: 13, fontWeight: '600', color: Colors.text },
  service: { fontSize: 11, color: Colors.text, marginTop: 1 },
  stars: { fontSize: 13, color: Colors.accent, letterSpacing: 1 },
  text: { fontSize: 12.5, color: '#b8b4c0', lineHeight: 18 },
  date: { fontSize: 11, color: Colors.text, marginTop: 6 },
});