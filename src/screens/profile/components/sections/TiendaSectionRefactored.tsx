// ─────────────────────────────────────────────────────────────────────
// TiendaSectionRefactored.tsx — Tienda refactorizada con componentes modulares
// ─────────────────────────────────────────────────────────────────────

import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { ShopHeader } from '../../shop/ShopHeader';
import { FilterBar } from '../../shop/FilterBar';
import { ShopGrid } from '../../shop/ShopGrid';
import { EmptyShopState } from '../../shop/EmptyShopState';

// Mock data - reemplazar con datos reales
const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Retrato Digital',
    price: '$150.000',
    type: 'Arte Digital',
    rating: 4.8,
    isFeatured: true,
    gradientStart: '#667EEA',
    gradientEnd: '#764BA2',
    previewColor: '#FFFFFF',
  },
  {
    id: '2',
    name: 'Sesión de Estudio',
    price: '$200.000',
    type: 'Fotografía',
    isNew: true,
    gradientStart: '#F59E0B',
    gradientEnd: '#EF4444',
    previewColor: '#FFFFFF',
  },
];

const SCREEN_W = Dimensions.get('window').width;

interface TiendaSectionRefactoredProps {
  onEditProduct?: () => void;
}

export const TiendaSectionRefactored: React.FC<TiendaSectionRefactoredProps> = ({ onEditProduct }) => {
  const [activeFilter, setActiveFilter] = useState('todo');
  const [isGridView, setIsGridView] = useState(true);
  const [products, setProducts] = useState(MOCK_PRODUCTS);

  const handleFilterChange = useCallback((filter: string) => {
    setActiveFilter(filter as any);
    // Aquí iría la lógica de filtrado real
  }, []);

  const handleToggleView = useCallback(() => {
    setIsGridView(!isGridView);
  }, [isGridView]);

  const handleProductPress = useCallback((product: any) => {
    // Aquí iría la lógica para abrir detalle del producto
    console.log('Producto presionado:', product);
  }, []);

  const handleAddProduct = useCallback(() => {
    // Aquí iría la lógica para agregar nuevo producto
    console.log('Agregar nuevo producto');
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <ShopHeader
        title="Mi Tienda"
        onEdit={onEditProduct}
        onToggleView={handleToggleView}
        isGridView={isGridView}
      />

      {/* Filtros */}
      <FilterBar
        filters={[
          { key: 'todo', label: 'Todo', icon: 'apps-outline' },
          { key: 'digital', label: 'Arte digital', icon: 'image-outline' },
          { key: 'fisico', label: 'Físico', icon: 'cube-outline' },
        ]}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />

      {/* Grid de productos */}
      {products.length > 0 ? (
        <ShopGrid
          products={products}
          onProductPress={handleProductPress}
        />
      ) : (
        <EmptyShopState
          icon="storefront-outline"
          title="No tienes productos"
          subtitle="Comienza agregando tus primeros productos"
          onAddProduct={handleAddProduct}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
