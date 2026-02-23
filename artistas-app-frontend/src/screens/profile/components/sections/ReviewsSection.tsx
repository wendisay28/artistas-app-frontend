// src/components/profile/sections/ReviewsSection.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { ReviewCard } from '../cards';
import { Review } from '../types';
import { Colors, Spacing } from '../../../../theme';

const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    reviewerName: 'María González',
    reviewerEmoji: '👩‍🎨',
    reviewerAvatarGradient: ['#FF6B6B', '#4ECDC4'],
    serviceName: 'Retrato Personalizado',
    stars: 5,
    text: 'Excelente trabajo, muy profesional y el resultado fue mejor de lo esperado. ¡Totalmente recomendado!',
    date: 'Hace 2 días',
  },
  {
    id: '2',
    reviewerName: 'Carlos Ruiz',
    reviewerEmoji: '👨‍💼',
    reviewerAvatarGradient: ['#45B7D1', '#96CEB4'],
    serviceName: 'Sesión de Fotos',
    stars: 4,
    text: 'Muy buena experiencia, el artista capturó exactamente lo que buscaba. El tiempo de entrega fue perfecto.',
    date: 'Hace 1 semana',
  },
  {
    id: '3',
    reviewerName: 'Ana Martínez',
    reviewerEmoji: '👩‍🎤',
    reviewerAvatarGradient: ['#F7DC6F', '#BB8FCE'],
    serviceName: 'Diseño de Logo',
    stars: 5,
    text: 'Creativo y profesional. Entendió perfectamente mi visión y la plasmó en un diseño increíble.',
    date: 'Hace 2 semanas',
  },
];

interface ReviewsSectionProps {
  reviews?: Review[];
  isOwner?: boolean;
}

export default function ReviewsSection({ 
  reviews = MOCK_REVIEWS, 
  isOwner = false 
}: ReviewsSectionProps) {
  const renderReview = ({ item }: { item: Review }) => (
    <ReviewCard review={item} />
  );

  if (reviews.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Sin reseñas aún</Text>
        <Text style={styles.emptySubtitle}>
          {isOwner 
            ? 'Aún no tienes reseñas de clientes. ¡Sigue trabajando para obtener tu primera reseña!'
            : 'Este artista aún no tiene reseñas.'
          }
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={reviews}
        renderItem={renderReview}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    gap: Spacing.md,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
