// ─────────────────────────────────────────────────────────────────────────────
// TiendaSectionRefactored.tsx — Tienda (alineada al diseño BuscArt)
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { ShopHeader } from './ShopHeader';
import { ShopGrid } from './ShopGrid';
import { EmptyShopState } from './EmptyShopState';
import { ProductDetailModal, ProductDetail } from './ProductDetailModal';

// Mock data — reemplazar con productos reales del backend
const MOCK_PRODUCTS: ProductDetail[] = [
  {
    id: '1',
    name: 'Retrato Digital',
    price: '$150.000',
    type: 'Arte Digital',
    rating: 4.8,
    isFeatured: true,
    gradientStart: '#7c3aed',
    gradientEnd: '#2563eb',
    previewColor: '#FFFFFF',
    availability: 'Disponible',
    verified: true,
    distance: '2.3 km',
    tags: ['Digital', 'Retrato'],
    description: 'Retrato digital de alta resolución pintado a mano en Procreate. Incluye archivo PNG 4K sin marca de agua y archivo PSD por capas. Entrega en 5-7 días hábiles.',
    format: 'PNG 4K + PSD',
    views: 142,
  },
  {
    id: '2',
    name: 'Sesión de Estudio',
    price: '$200.000',
    type: 'Fotografía',
    isNew: true,
    gradientStart: '#2563eb',
    gradientEnd: '#7c3aed',
    previewColor: '#FFFFFF',
    availability: 'Disponible',
    verified: false,
    distance: '5.1 km',
    tags: ['Fotografía', 'Estudio'],
    description: 'Sesión fotográfica profesional en estudio de 2 horas. Incluye maquillaje artístico, 20 fotos editadas en alta resolución y una selección de 5 fotos en impresión 20x28.',
    format: 'Servicio presencial',
    views: 87,
  },
];

interface TiendaSectionRefactoredProps {
  onEditProduct?: () => void;
}

export const TiendaSectionRefactored: React.FC<TiendaSectionRefactoredProps> = ({ onEditProduct }) => {
  const [isGridView, setIsGridView]             = useState(true);
  const [products]                               = useState<ProductDetail[]>(MOCK_PRODUCTS);
  const [selectedProduct, setSelectedProduct]   = useState<ProductDetail | null>(null);
  const [detailVisible, setDetailVisible]       = useState(false);

  const handleToggleView = useCallback(() => setIsGridView(v => !v), []);

  const handleProductPress = useCallback((product: ProductDetail) => {
    setSelectedProduct(product);
    setDetailVisible(true);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setDetailVisible(false);
    setSelectedProduct(null);
  }, []);

  const handleAddProduct = useCallback(() => {
    onEditProduct?.();
  }, [onEditProduct]);

  return (
    <View style={styles.container}>
      <ShopHeader
        title="Tienda"
        onEdit={onEditProduct}
        onToggleView={handleToggleView}
        isGridView={isGridView}
      />

      {products.length > 0 ? (
        <ShopGrid
          products={products}
          onProductPress={handleProductPress}
        />
      ) : (
        <EmptyShopState
          icon="storefront-outline"
          title="Sin productos aún"
          subtitle="Agrega tu primer producto para que los clientes te encuentren"
          onAddProduct={handleAddProduct}
        />
      )}

      <ProductDetailModal
        visible={detailVisible}
        product={selectedProduct}
        onClose={handleCloseDetail}
        onBuy={() => {/* TODO: lógica de compra */}}
        onShare={() => {/* TODO: lógica de compartir */}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
});
