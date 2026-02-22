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

interface GalleryCardProps {
  item: any;
  isSelected: boolean;
  onToggleSelect: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  onPress?: () => void;
}

export const GalleryCard: React.FC<GalleryCardProps> = ({
  item,
  isSelected,
  onToggleSelect,
  onToggleFavorite,
  onPress,
}) => {
  
  const formattedPrice = (item.price * 1000).toLocaleString('es-CO', {
    maximumFractionDigits: 0
  });

  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.selectedCard]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* SECCIÓN IMAGEN */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image || 'https://via.placeholder.com/150' }}
          style={styles.image}
        />
        
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.imageOverlay}
        />

        {/* Checkbox de selección */}
        <TouchableOpacity
          style={[styles.checkbox, isSelected && styles.checkboxActive]}
          onPress={() => onToggleSelect(item.id)}
        >
          {isSelected && <View style={styles.checkboxInner} />}
        </TouchableOpacity>

        {/* Badge de Tipo de Obra/Producto */}
        <View style={styles.typeBadgeContainer}>
          <LinearGradient
            colors={['#9333ea', '#2563eb']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.typeBadge}
          >
            <Text style={styles.typeBadgeText}>{item.type}</Text>
          </LinearGradient>
        </View>
      </View>

      {/* CONTENIDO */}
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.artistName}>{item.artist}</Text>
          </View>
        </View>

        {/* Meta Info: Ubicación y Ventas */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={12} color="#6b7280" />
            <Text style={styles.metaText} numberOfLines={1}>{item.city}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="people-outline" size={12} color="#6b7280" />
            <Text style={styles.metaText}>{item.sales} ventas</Text>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>

        {/* FOOTER: Precio y Acciones */}
        <View style={styles.footer}>
          <View>
            <Text style={styles.priceLabel}>Precio</Text>
            {item.price > 0 ? (
              <View style={styles.priceRow}>
                <Text style={styles.priceValue}>${formattedPrice}</Text>
                {item.priceType === 'hourly' && (
                  <Text style={styles.priceUnit}> /h</Text>
                )}
              </View>
            ) : (
              <Text style={styles.freeText}>Entrada Libre</Text>
            )}
          </View>

          <View style={styles.actionGroup}>
            <TouchableOpacity 
              style={styles.favBtn}
              onPress={() => onToggleFavorite(item.id)}
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
                style={styles.detailBtn}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              >
                <Ionicons name="eye-outline" size={14} color="white" />
                <Text style={styles.detailBtnText}>Detalle</Text>
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
    height: 180,
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
    zIndex: 10,
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
  typeBadgeContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  typeBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  content: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#111827',
  },
  artistName: {
    fontSize: 14,
    color: '#9333ea',
    fontWeight: '600',
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
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
    maxWidth: 120,
  },
  description: {
    fontSize: 13,
    color: '#4b5563',
    marginVertical: 12,
    lineHeight: 18,
    minHeight: 36,
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
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  favBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f3ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    gap: 6,
  },
  detailBtnText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
});