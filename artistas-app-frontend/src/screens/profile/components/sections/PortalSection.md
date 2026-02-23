// components/profile/sections/PortalSection.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../constants/colors';
import PortalStatCard from '../shared/PortalStatCard';
import EventCard from '../cards/EventCard';
import OfferCard from '../cards/OfferCard';
import type { Event, Offer, PortalStats } from '../../../types/profile';

interface PortalSectionProps {
  stats: PortalStats;
  events: Event[];
  offers: Offer[];
  onEventPress?: (id: string) => void;
  onOfferPress?: (id: string) => void;
}

export default function PortalSection({
  stats,
  events,
  offers,
  onEventPress,
  onOfferPress,
}: PortalSectionProps) {
  return (
    <View style={styles.portalSection}>
      {/* Header */}
      <View style={styles.portalHeader}>
        <Ionicons name="flash" size={20} color={colors.accent} />
        <Text style={styles.portalTitle}>Portal de Autor</Text>
      </View>

      {/* Stats Row */}
      <View style={styles.portalStatsRow}>
        <PortalStatCard
          icon="trending-up"
          value={stats.earnings.value}
          sub={stats.earnings.sub}
          color={colors.success}
        />
        <PortalStatCard
          icon="people"
          value={stats.clients.value}
          sub={stats.clients.sub}
          color={colors.accent}
        />
        <PortalStatCard
          icon="eye"
          value={stats.views.value}
          sub={stats.views.sub}
          color="#6366F1"
        />
      </View>

      {/* Events Section */}
      <View style={styles.portalSubSection}>
        <View style={styles.portalSubHeader}>
          <Ionicons name="calendar" size={16} color={colors.primary} />
          <Text style={styles.portalSubTitle}>Eventos</Text>
        </View>
        {events.map((event) => (
          <EventCard
            key={event.id}
            title={event.title}
            date={event.date}
            location={event.location}
            status={event.status}
            onPress={() => onEventPress?.(event.id)}
          />
        ))}
      </View>

      {/* Offers Section */}
      <View style={styles.portalSubSection}>
        <View style={styles.portalSubHeader}>
          <Ionicons name="mail" size={16} color={colors.accent} />
          <Text style={styles.portalSubTitle}>Ofertas</Text>
        </View>
        {offers.map((offer) => (
          <OfferCard
            key={offer.id}
            client={offer.client}
            type={offer.type}
            amount={offer.amount}
            time={offer.time}
            onPress={() => onOfferPress?.(offer.id)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  portalSection: {
    padding: 16,
  },
  portalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  portalTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.text,
  },
  portalStatsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  portalSubSection: {
    marginBottom: 18,
  },
  portalSubHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  portalSubTitle: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.text,
  },
});