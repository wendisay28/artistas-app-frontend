// ─────────────────────────────────────────────────────────────────────────────
// ReviewCard.tsx — Reusable review card for all content types
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../constants/colors';
import type { Review } from '../../../types/explore';

// ── Props ─────────────────────────────────────────────────────────────────────

interface ReviewCardProps {
  review: Review;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ReviewCard({ review }: ReviewCardProps) {
  const { authorName, rating, text, date } = review;

  return (
    <View style={styles.container}>

      {/* Header: avatar + meta + date */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{authorName[0].toUpperCase()}</Text>
        </View>

        <View style={styles.meta}>
          <Text style={styles.authorName}>{authorName}</Text>
          <View style={styles.starsRow}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Ionicons
                key={i}
                name={i < rating ? 'star' : 'star-outline'}
                size={11}
                color={colors.starYellow}
              />
            ))}
          </View>
        </View>

        <Text style={styles.date}>{date}</Text>
      </View>

      {/* Body */}
      <Text style={styles.reviewText}>{text}</Text>

    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafb',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },

  // header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },

  // avatar circle
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary + '28',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.primary,
  },

  // meta (name + stars)
  meta: {
    flex: 1,
    gap: 3,
  },
  authorName: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.text,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },

  // date
  date: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
  },

  // body
  reviewText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
    lineHeight: 20,
  },
});