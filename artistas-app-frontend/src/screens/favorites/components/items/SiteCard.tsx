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

interface SiteCardProps {
  site: any;
  isSelected: boolean;
  onToggleSelect: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  onPress?: () => void;
}

export const SiteCard: React.FC<SiteCardProps> = ({
  site,
  isSelected,
  onToggleSelect,
  onToggleFavorite,
  onPress,
}) => {

  const renderPrice = () => {
    if (site.price?.type === 'free') {
      return <Text style={styles.freeText}>Entrada Libre</Text>;
    }

    if (site.price?.value) {
      const formatted = (site.price.value * 1000).toLocaleString('es-CO');
      const suffix = site.price.type === 'hourly' ? '/hora' : 'por entrada';
      
      return (
        <View style={styles.priceRow}>
          <Text style={styles.priceValue}>${formatted}</Text>
          <Text style={styles.priceUnit}> {suffix}</Text>
        </View>
      );
    }

    return <Text style={styles.consultText}>Precio a consultar</Text>;
  };

  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.selectedCard]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* SECCIÓN IMAGEN */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: site.image }} style={styles.image} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.imageOverlay}
        />

        {/* Checkbox de selección */}
        <TouchableOpacity
          style={[styles.checkbox, isSelected && styles.checkboxActive]}
          onPress={() => onToggleSelect(site.id)}
        >
          {isSelected && <View style={styles.checkboxInner} />}
        </TouchableOpacity>
      </View>

      {/* CONTENIDO */}
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.name} numberOfLines={1}>{site.name}</Text>
            <Text style={styles.type}>{site.type}</Text>
          </View>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={12} color="#ffd700" />
            <Text style={styles.ratingText}>{site.rating}</Text>
          </View>
        </View>

        {/* Meta Info: Ciudad y Capacidad */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={12} color="#6b7280" />
            <Text style={styles.metaText}>{site.city}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="business-outline" size={12} color="#6b7280" />
            <Text style={styles.metaText}>{site.capacity} pers.</Text>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {site.description}
        </Text>

        {/* FOOTER: Precio y Botones */}
        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Precio</Text>
            {renderPrice()}
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.favButton}
              onPress={() => onToggleFavorite(site.id)}
            >
              <Ionicons
                name={isSelected ? "heart" : "heart-outline"}
                size={18}
                color={isSelected ? "#ef4444" : "#9333ea"}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={onPress}>
              <LinearGradient
                colors={['#9333ea', '#2563eb']}
                style={styles.detailButton}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              >
                <Ionicons name="eye-outline" size={14} color="white" />
                <Text style={styles.detailButtonText}>Detalle</Text>
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
    borderColor: '#f3e8ff',
    ...Platform.select({
      ios: { shadowColor: '#9333ea', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
      android: { elevation: 4 },
    }),
  },
  selectedCard: {
    borderColor: '#9333ea',
    borderWidth: 2,
  },
  imageContainer: {
    height: 160,
    width: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
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
  checkboxActive: {
    backgroundColor: '#9333ea',
    borderColor: '#9333ea',
  },
  checkboxInner: {
    width: 10,
    height: 10,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  content: {
    padding: 15,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#111827',
  },
  type: {
    fontSize: 13,
    color: '#9333ea',
    fontWeight: '600',
    marginTop: 2,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f3ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
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
    marginVertical: 12,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 12,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7e22ce',
  },
  priceUnit: {
    fontSize: 11,
    color: '#6b7280',
  },
  freeText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  consultText: {
    fontSize: 13,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  favButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f3ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  detailButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
});