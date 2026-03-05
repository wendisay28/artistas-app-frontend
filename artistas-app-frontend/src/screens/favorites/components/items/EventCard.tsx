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

interface EventCardProps {
  event: any;
  isSelected: boolean;
  onToggleSelect: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  onPress?: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  isSelected,
  onToggleSelect,
  onToggleFavorite,
  onPress,
}) => {
  
  // Lógica de formateo de precio igual a la web
  const renderPrice = () => {
    const isFree = event.price === 0 || (typeof event.price === 'object' && event.price?.type === 'free');
    
    if (isFree) {
      return <Text style={styles.freeText}>Entrada Libre</Text>;
    }

    const priceValue = typeof event.price === 'object' ? event.price?.value : event.price;
    const priceType = typeof event.price === 'object' ? event.price?.type : event.priceType;
    
    const formatted = (priceValue * 1000).toLocaleString('es-CO');

    return (
      <View style={styles.priceRow}>
        <Text style={styles.priceValue}>${formatted}</Text>
        <Text style={styles.priceUnit}>
          {priceType === 'hourly' ? ' /hora' : ' /entrada'}
        </Text>
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.selectedCard]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* SECCIÓN IMAGEN */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: event.image }} style={styles.image} />
        
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.imageOverlay}
        />

        {/* Checkbox */}
        <TouchableOpacity
          style={[styles.checkbox, isSelected && styles.checkboxActive]}
          onPress={() => onToggleSelect(event.id)}
        >
          {isSelected && <View style={styles.checkboxInner} />}
        </TouchableOpacity>

        {/* Badge de Categoría */}
        <View style={styles.categoryContainer}>
          <LinearGradient
            colors={['#9333ea', '#2563eb']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.categoryBadge}
          >
            <Text style={styles.categoryText}>{event.category}</Text>
          </LinearGradient>
        </View>
      </View>

      {/* CONTENIDO */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title} numberOfLines={1}>{event.title}</Text>
            {event.mode && (
              <View style={[
                styles.modeBadge,
                { borderColor: event.mode.toLowerCase() === 'online' ? '#3b82f6' : '#22c55e' }
              ]}>
                <Text style={[
                  styles.modeText,
                  { color: event.mode.toLowerCase() === 'online' ? '#3b82f6' : '#16a34a' }
                ]}>
                  {event.mode.toLowerCase() === 'online' ? 'En línea' : 'Presencial'}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Meta Info */}
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={12} color="#6b7280" />
            <Text style={styles.metaText}>{event.city}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="people-outline" size={12} color="#6b7280" />
            <Text style={styles.metaText}>{event.attendees} asistentes</Text>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {event.description}
        </Text>

        {/* FOOTER */}
        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Precio</Text>
            {renderPrice()}
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.favButton}
              onPress={() => onToggleFavorite(event.id)}
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
    position: 'relative',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
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
    height: 60,
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
  categoryContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  categoryText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  content: {
    padding: 15,
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#111827',
  },
  modeBadge: {
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  modeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  metaContainer: {
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
  priceLabel: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 2,
  },
  freeText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#16a34a',
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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