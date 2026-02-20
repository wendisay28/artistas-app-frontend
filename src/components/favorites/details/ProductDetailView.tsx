import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Share,
  Platform,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { GalleryItem } from '../../../types/explore';

const { width } = Dimensions.get('window');

// --- COMPONENTES DE APOYO ---

const SpecItemComponent = ({
  iconName,
  label,
  value
}: {
  iconName: keyof typeof Ionicons.glyphMap;
  label: string;
  value: any;
}) => (
  <View style={styles.specBox}>
    <View style={styles.infoIconBox}>
      <Ionicons name={iconName} size={16} color="#7c3aed" />
    </View>
    <View>
      <Text style={styles.specLabel}>{label}</Text>
      <Text style={styles.specValue}>{value || 'N/A'}</Text>
    </View>
  </View>
);

// --- VISTA PRINCIPAL ---

interface ProductDetailViewProps {
  product: GalleryItem | null;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  isFavorite?: boolean;
}

export default function ProductDetailViewNative({ 
  product, 
  onClose, 
  onToggleFavorite, 
  isFavorite = false 
}: ProductDetailViewProps) {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleShare = async () => {
    try {
      await Share.share({ 
        message: `Mira esta obra: ${product.name} por $${product.price.toLocaleString()}`,
        url: 'https://tuapp.com/obras/' + product.id 
      });
    } catch (e) { console.log(e); }
  };

  return (
    <View style={styles.masterContainer}>
      <ScrollView style={styles.container} bounces={false}>
        
        {/* GALERÍA / IMAGEN HERO */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.mainImage} />
          <LinearGradient colors={['rgba(0,0,0,0.4)', 'transparent']} style={styles.topOverlay} />
          
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.circleBtn} onPress={onClose}>
              <Ionicons name="close" size={20} color="#FFF" />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity style={styles.circleBtn} onPress={handleShare}>
                <Ionicons name="share-outline" size={20} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.circleBtn} onPress={() => onToggleFavorite(product.id)}>
                <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={20} color={isFavorite ? "#ef4444" : "#FFF"} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {/* CABECERA DE PRODUCTO */}
          <View style={styles.headerInfo}>
            <View style={styles.badgeRow}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{product.medium || 'Arte'}</Text>
              </View>
              {product.verified && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="shield-checkmark-outline" size={12} color="#059669" />
                  <Text style={styles.verifiedText}>Auténtico</Text>
                </View>
              )}
            </View>
            <Text style={styles.title}>{product.name}</Text>
            <Text style={styles.subtitle}>{product.artistName} • {product.location}</Text>
            
            <View style={styles.priceRow}>
              <Text style={styles.priceText}>${product.price.toLocaleString()}</Text>
              <View style={styles.stockStatus}>
                <View style={[styles.stockDot, { backgroundColor: product.forSale ? '#10b981' : '#ef4444' }]} />
                <Text style={styles.stockText}>
                  {product.forSale ? 'En venta' : 'No disponible'}
                </Text>
              </View>
            </View>
          </View>

          {/* DESCRIPCIÓN */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descripción</Text>
            <Text style={styles.description}>{product.bio}</Text>
          </View>

          {/* ESPECIFICACIONES TÉCNICAS */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Especificaciones</Text>
            <View style={styles.specsGrid}>
              <SpecItemComponent iconName="brush-outline" label="Técnica" value={product.medium} />
              <SpecItemComponent iconName="resize-outline" label="Dimensiones" value={product.dimensions} />
              <SpecItemComponent iconName="calendar-outline" label="Año" value={product.year} />
            </View>
          </View>

          {/* INFO DE ENVÍO */}
          <View style={styles.shippingCard}>
            <View style={styles.infoIconBox}><Ionicons name="car-outline" size={18} color="#7c3aed" /></View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.shippingTitle}>Envío disponible a {product.location}</Text>
              <Text style={styles.shippingSub}>Entrega estimada: 3-5 días hábiles</Text>
            </View>
          </View>

          {/* ETIQUETAS */}
          <View style={styles.tagsWrapper}>
            {product.tags.map((tag: string, i: number) => (
              <View key={i} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          {/* BOTONES DE ACCIÓN */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionBtn, styles.actionBtnOutline]} 
              onPress={() => setQuantity(q => Math.max(1, q - 1))}
            >
              <Ionicons name="remove-outline" size={20} color="#7c3aed" />
              <Text style={styles.actionBtnText}>-</Text>
            </TouchableOpacity>
            
            <View style={styles.quantityDisplay}>
              <Text style={styles.quantityText}>Cantidad: {quantity}</Text>
            </View>
            
            <TouchableOpacity 
              style={[styles.actionBtn, styles.actionBtnOutline]} 
              onPress={() => setQuantity(q => q + 1)}
            >
              <Ionicons name="add-outline" size={20} color="#7c3aed" />
              <Text style={styles.actionBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* BOTÓN PRINCIPAL */}
          <TouchableOpacity 
            style={[styles.actionBtn, styles.actionBtnPrimary, !product.forSale && styles.actionBtnDisabled]} 
            onPress={() => {
              if (product.forSale) {
                Alert.alert(
                  'Confirmar compra',
                  `¿Estás seguro de que quieres adquirir "${product.name}"?`,
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Comprar', onPress: () => console.log('Comprar obra') }
                  ]
                );
              }
            }}
            disabled={!product.forSale}
          >
            <Ionicons name="bag-outline" size={20} color="#FFF" />
            <Text style={styles.actionBtnText}>{product.forSale ? 'Adquirir obra' : 'No disponible'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// ── STYLES ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  masterContainer: { 
    flex: 1, 
    backgroundColor: '#f8fafc' 
  },
  container: { 
    flex: 1, 
    padding: 20 
  },
  imageContainer: { 
    width: '100%', 
    height: 300, 
    position: 'relative' 
  },
  mainImage: { 
    width: '100%', 
    height: '100%', 
    objectFit: 'cover' 
  },
  topOverlay: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    height: 120, 
    backgroundColor: 'linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)' 
  },
  headerActions: { 
    position: 'absolute', 
    top: 20, 
    right: 20, 
    flexDirection: 'row', 
    gap: 10 
  },
  circleBtn: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: 'rgba(0,0,0,0.3)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  content: { 
    backgroundColor: '#fff', 
    borderRadius: 20, 
    marginTop: -20, 
    paddingTop: 40, 
    padding: 20 
  },
  headerInfo: { 
    marginBottom: 20 
  },
  badgeRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 10, 
    marginBottom: 10 
  },
  categoryBadge: { 
    backgroundColor: '#7c3aed', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 12 
  },
  categoryText: { 
    color: '#fff', 
    fontWeight: '600', 
    fontSize: 12 
  },
  verifiedBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 4, 
    backgroundColor: 'rgba(5, 209, 98, 0.1)', 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 12 
  },
  verifiedText: { 
    color: '#059669', 
    fontSize: 12, 
    fontWeight: '600' 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#1f2937', 
    marginBottom: 5 
  },
  subtitle: { 
    fontSize: 16, 
    color: '#6b7280', 
    marginBottom: 15 
  },
  priceRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: 20 
  },
  priceText: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#1f2937' 
  },
  stockStatus: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8 
  },
  stockDot: { 
    width: 8, 
    height: 8, 
    borderRadius: 4 
  },
  stockText: { 
    fontSize: 14, 
    color: '#6b7280' 
  },
  section: { 
    marginBottom: 25 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#1f2937', 
    marginBottom: 15 
  },
  description: { 
    fontSize: 15, 
    lineHeight: 22, 
    color: '#4b5563', 
    marginBottom: 15 
  },
  specsGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 15 
  },
  specBox: { 
    width: '48%', 
    backgroundColor: '#f8fafc', 
    padding: 15, 
    borderRadius: 12 
  },
  infoIconBox: { 
    marginBottom: 8 
  },
  specLabel: { 
    fontSize: 12, 
    color: '#6b7280', 
    marginBottom: 4 
  },
  specValue: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#1f2937' 
  },
  shippingCard: { 
    backgroundColor: '#f8fafc', 
    padding: 20, 
    borderRadius: 16, 
    marginBottom: 25 
  },
  shippingTitle: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#1f2937', 
    marginBottom: 5 
  },
  shippingSub: { 
    fontSize: 14, 
    color: '#6b7280' 
  },
  tagsWrapper: { 
    marginBottom: 25 
  },
  tag: { 
    backgroundColor: '#e5e7eb', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 16, 
    marginRight: 8 
  },
  tagText: { 
    fontSize: 14, 
    color: '#374151' 
  },
  actionButtons: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: 20 
  },
  quantityDisplay: { 
    backgroundColor: '#f8fafc', 
    paddingHorizontal: 15, 
    paddingVertical: 10, 
    borderRadius: 12 
  },
  quantityText: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#1f2937' 
  },
  actionBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 12, 
    paddingHorizontal: 20, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#d1d5db' 
  },
  actionBtnOutline: { 
    borderColor: '#f3e8ff', 
    backgroundColor: '#FFF' 
  },
  actionBtnPrimary: { 
    backgroundColor: '#7c3aed', 
    shadowColor: '#7c3aed', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 8, 
    elevation: 5 
  },
  actionBtnDisabled: { 
    backgroundColor: '#d1d5db', 
    shadowOpacity: 0, 
    elevation: 0 
  },
  actionBtnText: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#FFF' 
  },
});
