import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SimpleCardProps {
  item: any;
  index: number;
}

const SimpleArtistCard: React.FC<SimpleCardProps> = ({ item }) => (
  <View style={styles.card}>
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>
        {item.displayName?.charAt(0) || item.name?.charAt(0) || 'A'}
      </Text>
    </View>
    <View style={styles.content}>
      <Text style={styles.name}>{item.displayName || item.name || 'Artista'}</Text>
      <Text style={styles.category}>{item.artistData?.artistType || 'Artista'}</Text>
      <View style={styles.footer}>
        <View style={styles.rating}>
          <Ionicons name="star" size={12} color="#fcd34d" />
          <Text style={styles.ratingText}>{item.rating || '5.0'}</Text>
        </View>
        <Text style={styles.price}>
          ${item.artistData?.pricePerHour || item.price || '0'}/hr
        </Text>
      </View>
    </View>
  </View>
);

const SimpleEventCard: React.FC<SimpleCardProps> = ({ item }) => (
  <View style={styles.card}>
    <View style={styles.avatar}>
      <Ionicons name="calendar" size={24} color="#9333ea" />
    </View>
    <View style={styles.content}>
      <Text style={styles.name}>{item.title || 'Evento'}</Text>
      <Text style={styles.category}>{item.eventType || 'Evento'}</Text>
      <View style={styles.footer}>
        <Text style={styles.date}>{new Date(item.startDate).toLocaleDateString()}</Text>
        <Text style={styles.price}>
          {item.isFree ? 'Gratis' : `$${item.ticketPrice || '0'}`}
        </Text>
      </View>
    </View>
  </View>
);

const SimpleVenueCard: React.FC<SimpleCardProps> = ({ item }) => (
  <View style={styles.card}>
    <View style={styles.avatar}>
      <Ionicons name="business" size={24} color="#9333ea" />
    </View>
    <View style={styles.content}>
      <Text style={styles.name}>{item.name || 'Venue'}</Text>
      <Text style={styles.category}>{item.venueType || 'Venue'}</Text>
      <View style={styles.footer}>
        <Text style={styles.capacity}>Cap: {item.capacity || '0'}</Text>
        <Text style={styles.price}>${item.dailyRate || '0'}/día</Text>
      </View>
    </View>
  </View>
);

const SimpleGalleryCard: React.FC<SimpleCardProps> = ({ item }) => (
  <View style={styles.card}>
    <View style={styles.avatar}>
      <Ionicons name="image" size={24} color="#9333ea" />
    </View>
    <View style={styles.content}>
      <Text style={styles.name}>{item.name || 'Obra'}</Text>
      <Text style={styles.category}>{item.category || 'Arte'}</Text>
      <View style={styles.footer}>
        <Text style={styles.artist}>{item.artist?.displayName || 'Artista'}</Text>
        <Text style={styles.price}>${item.price || '0'}</Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f3e8ff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f3e8ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#9333ea',
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#6b7280',
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9333ea',
  },
  date: {
    fontSize: 12,
    color: '#6b7280',
  },
  capacity: {
    fontSize: 12,
    color: '#6b7280',
  },
  artist: {
    fontSize: 12,
    color: '#6b7280',
  },
});

export {
  SimpleArtistCard as ArtistCard,
  SimpleEventCard as EventCard,
  SimpleVenueCard as VenueCard,
  SimpleGalleryCard as GalleryCard,
};
