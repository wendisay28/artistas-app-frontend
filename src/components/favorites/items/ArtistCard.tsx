import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Artist {
  id: number;
  name: string;
  type: string; // profession en tu web es 'type'
  rating: number;
  price: number;
  image: string;
  fans: number;
  city: string;
  description: string;
  verified?: boolean;
  availability?: string;
}

interface ArtistCardProps {
  artist: Artist;
  isSelected?: boolean;
  onToggleSelect?: (id: number) => void;
  onToggleFavorite?: (id: number) => void;
  onPress?: () => void;
  listMode?: boolean;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({
  artist,
  isSelected = false,
  onToggleSelect,
  onToggleFavorite,
  onPress,
  listMode = false,
}) => {
  const formattedPrice = (artist.price * 1000).toLocaleString('es-CO', {
    maximumFractionDigits: 0
  });

  return (
    <TouchableOpacity
      style={[
        styles.card,
        listMode && styles.listCard,
        isSelected && styles.selectedCard,
      ]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* --- SECCIÓN IMAGEN --- */}
      <View style={[styles.imageWrapper, listMode && styles.listImageWrapper]}>
        <Image
          source={{ uri: artist.image || 'https://via.placeholder.com/150' }}
          style={[styles.image, listMode && styles.listImage]}
        />
        
        {!listMode && (
          <>
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={styles.imageGradient}
            />
            {/* Badges superiores estilo web */}
            <View style={styles.topBadges}>
              {artist.verified && (
                <View style={[styles.badge, styles.verifiedBadge]}>
                  <Text style={styles.badgeText}>Verificado</Text>
                </View>
              )}
              <LinearGradient
                colors={artist.availability === "Disponible" ? ['#9333ea', '#2563eb'] : ['#6b7280', '#4b5563']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.badge}
              >
                <Text style={styles.badgeText}>{artist.availability}</Text>
              </LinearGradient>
            </View>
          </>
        )}

        {/* Checkbox de selección personalizado */}
        {onToggleSelect && (
          <TouchableOpacity
            style={[styles.checkbox, isSelected && styles.checkboxChecked]}
            onPress={() => onToggleSelect(artist.id)}
          >
            {isSelected && <View style={styles.checkboxInner} />}
          </TouchableOpacity>
        )}
      </View>

      {/* --- SECCIÓN INFO --- */}
      <View style={[styles.infoContainer, listMode && styles.listInfoContainer]}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.name} numberOfLines={1}>{artist.name}</Text>
            <Text style={styles.type}>{artist.type}</Text>
          </View>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={12} color="#ffd700" />
            <Text style={styles.ratingText}>{artist.rating}</Text>
          </View>
        </View>

        {!listMode && (
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={12} color="#6b7280" />
              <Text style={styles.metaText}>{artist.city}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="people-outline" size={12} color="#6b7280" />
              <Text style={styles.metaText}>{artist.fans} fans</Text>
            </View>
          </View>
        )}

        <Text style={styles.description} numberOfLines={listMode ? 1 : 2}>
          {artist.description}
        </Text>

        <View style={styles.footer}>
          <View>
            <Text style={styles.priceLabel}>Desde</Text>
            <Text style={styles.priceValue}>
              <Text style={styles.priceSymbol}>$</Text>
              {formattedPrice}
              <Text style={styles.priceUnit}>/h</Text>
            </Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity 
              style={styles.iconBtn} 
              onPress={() => onToggleFavorite?.(artist.id)}
            >
              <Ionicons
                name={isSelected ? "heart" : "heart-outline"}
                size={18}
                color={isSelected ? "#ef4444" : "#9333ea"}
              />
            </TouchableOpacity>

            <TouchableOpacity>
              <LinearGradient
                colors={['#9333ea', '#2563eb']}
                style={styles.contactBtn}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              >
                <Ionicons name="chatbubble-outline" size={14} color="white" />
                {!listMode && <Text style={styles.contactText}>Contactar</Text>}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f3e8ff', // purple-200
    ...Platform.select({
      ios: { shadowColor: '#9333ea', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
      android: { elevation: 4 },
    }),
  },
  listCard: {
    flexDirection: 'row',
    padding: 10,
  },
  selectedCard: {
    borderColor: '#9333ea',
    borderWidth: 2,
  },
  imageWrapper: {
    height: 180,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  listImageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  listImage: {
    borderRadius: 12,
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  topBadges: {
    position: 'absolute',
    top: 10,
    right: 10,
    gap: 5,
    alignItems: 'flex-end',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  verifiedBadge: {
    backgroundColor: '#a855f7',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
  },
  checkbox: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#9333ea',
    borderColor: '#9333ea',
  },
  checkboxInner: {
    width: 10,
    height: 10,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  infoContainer: {
    padding: 15,
  },
  listInfoContainer: {
    flex: 1,
    paddingVertical: 0,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#111827',
  },
  type: {
    fontSize: 14,
    color: '#9333ea',
    fontWeight: '600',
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f3ff',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6b7280',
  },
  description: {
    fontSize: 13,
    color: '#4b5563',
    marginVertical: 10,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  priceLabel: {
    fontSize: 10,
    color: '#6b7280',
    textTransform: 'uppercase',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7e22ce',
  },
  priceSymbol: {
    fontSize: 14,
  },
  priceUnit: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: 'normal',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f3ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  contactText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
});