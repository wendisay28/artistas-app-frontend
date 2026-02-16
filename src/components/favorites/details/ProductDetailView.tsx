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

const { width } = Dimensions.get('window');

// --- COMPONENTES DE APOYO ---

const SpecItem = ({ iconName, label, value }: any) => (
  <View style={styles.specBox}>
    <Ionicons name={iconName} size={16} color="#7c3aed" />
    <View style={styles.specTextContent}>
      <Text style={styles.specLabel}>{label}</Text>
      <Text style={styles.specValue}>{value || 'N/A'}</Text>
    </View>
  </View>
);

export default function ProductDetailViewNative({ 
  product, 
  onClose, 
  onToggleFavorite, 
  isFavorite 
}: any) {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleShare = async () => {
    try {
      await Share.share({ 
        message: `Mira este producto: ${product.title} por $${product.price.toLocaleString()}`,
        url: 'https://tuapp.com/productos/' + product.id 
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
                <Text style={styles.categoryText}>{product.category}</Text>
              </View>
              {product.verified && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="shield-checkmark-outline" size={12} color="#059669" />
                  <Text style={styles.verifiedText}>Auténtico</Text>
                </View>
              )}
            </View>
            <Text style={styles.productTitle}>{product.title}</Text>
            <Text style={styles.artistName}>por {product.artist}</Text>
            
            <View style={styles.priceRow}>
              <Text style={styles.priceText}>${product.price.toLocaleString()}</Text>
              <View style={styles.stockStatus}>
                <View style={[styles.stockDot, { backgroundColor: product.available ? '#10b981' : '#ef4444' }]} />
                <Text style={styles.stockText}>
                  {product.available ? `${product.stock} unidades` : 'Agotado'}
                </Text>
              </View>
            </View>
          </View>

          {/* DESCRIPCIÓN */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descripción</Text>
            <Text style={styles.descriptionText}>{product.description}</Text>
          </View>

          {/* ESPECIFICACIONES TÉCNICAS (Grid Dinámico) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Especificaciones</Text>
            <View style={styles.specsGrid}>
              <SpecItem iconName="expand-outline" label="Dimensiones" value={product.dimensions} />
              <SpecItem iconName="options-outline" label="Peso" value={product.weight} />
              <SpecItem iconName="cube-outline" label="Condición" value={product.condition} />
              {product.language && <SpecItem iconName="language-outline" label="Idioma" value={product.language} />}
              {product.pages && <SpecItem iconName="book-outline" label="Páginas" value={product.pages} />}
              {product.certificate && <SpecItem iconName="ribbon-outline" label="Certificado" value="Sí" />}
            </View>
          </View>

          {/* INFO DE ENVÍO */}
          <View style={styles.shippingCard}>
            <Ionicons name="car-outline" size={20} color="#7c3aed" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.shippingTitle}>Envío disponible a {product.city}</Text>
              <Text style={styles.shippingSub}>Entrega estimada: 3-5 días hábiles</Text>
            </View>
          </View>

          {/* ETIQUETAS */}
          <View style={styles.tagsWrapper}>
            {product.tags.map((tag: string, i: number) => (
              <View key={i} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* FOOTER DE ACCIÓN (Sticky) */}
      <View style={styles.footer}>
        <View style={styles.quantitySelector}>
          <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))} style={styles.qtyBtn}>
            <Text style={styles.qtyBtnText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.qtyText}>{quantity}</Text>
          <TouchableOpacity onPress={() => setQuantity(quantity + 1)} style={styles.qtyBtn}>
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={[styles.addToCartBtn, !product.available && styles.disabledBtn]}
          disabled={!product.available}
        >
          <Ionicons name="cart-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.addToCartText}>Agregar al Carrito</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  masterContainer: { flex: 1, backgroundColor: '#FFF' },
  container: { flex: 1 },
  imageContainer: { width: '100%', height: 350 },
  mainImage: { width: '100%', height: '100%', objectFit: 'cover' },
  topOverlay: { ...StyleSheet.absoluteFillObject, height: 100 },
  headerActions: { 
    position: 'absolute', top: 50, left: 20, right: 20, 
    flexDirection: 'row', justifyContent: 'space-between' 
  },
  circleBtn: { 
    width: 40, height: 40, borderRadius: 20, 
    backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' 
  },
  content: { padding: 20, marginTop: -30, backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  headerInfo: { marginBottom: 25 },
  badgeRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  categoryBadge: { backgroundColor: '#f3e8ff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  categoryText: { color: '#7c3aed', fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ecfdf5', paddingHorizontal: 10, borderRadius: 8, gap: 4 },
  verifiedText: { color: '#059669', fontSize: 11, fontWeight: 'bold' },
  productTitle: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  artistName: { fontSize: 16, color: '#6b7280', marginTop: 4 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 },
  priceText: { fontSize: 28, fontWeight: '800', color: '#7c3aed' },
  stockStatus: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  stockDot: { width: 8, height: 8, borderRadius: 4 },
  stockText: { fontSize: 13, color: '#4b5563', fontWeight: '500' },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 10 },
  descriptionText: { fontSize: 15, color: '#4b5563', lineHeight: 22 },
  specsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  specBox: { 
    width: (width - 52) / 2, backgroundColor: '#f9fafb', 
    padding: 12, borderRadius: 12, flexDirection: 'row', 
    alignItems: 'center', gap: 10 
  },
  specTextContent: { flex: 1 },
  specLabel: { fontSize: 11, color: '#9ca3af', textTransform: 'uppercase' },
  specValue: { fontSize: 13, fontWeight: 'bold', color: '#374151' },
  shippingCard: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f3ff', 
    padding: 15, borderRadius: 16, marginBottom: 25 
  },
  shippingTitle: { fontSize: 14, fontWeight: 'bold', color: '#1f2937' },
  shippingSub: { fontSize: 12, color: '#6d28d9', marginTop: 2 },
  tagsWrapper: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 100 },
  tag: { backgroundColor: '#f3f4f6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  tagText: { fontSize: 12, color: '#4b5563' },
  footer: { 
    position: 'absolute', bottom: 0, left: 0, right: 0, 
    backgroundColor: '#FFF', padding: 20, borderTopWidth: 1, 
    borderColor: '#f3f4f6', flexDirection: 'row', gap: 15, 
    paddingBottom: Platform.OS === 'ios' ? 35 : 20 
  },
  quantitySelector: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', 
    borderRadius: 14, paddingHorizontal: 5 
  },
  qtyBtn: { width: 35, height: 35, justifyContent: 'center', alignItems: 'center' },
  qtyBtnText: { fontSize: 20, fontWeight: 'bold', color: '#1f2937' },
  qtyText: { paddingHorizontal: 15, fontSize: 16, fontWeight: 'bold' },
  addToCartBtn: { 
    flex: 1, backgroundColor: '#7c3aed', borderRadius: 14, 
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center' 
  },
  addToCartText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  disabledBtn: { backgroundColor: '#d1d5db' }
});