// ─────────────────────────────────────────────────────────────────────
// EmptyShopState.tsx — Estado vacío de la tienda
// ─────────────────────────────────────────────────────────────────────

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmptyShopStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onAddProduct?: () => void;
}

export const EmptyShopState: React.FC<EmptyShopStateProps> = ({
  icon,
  title,
  subtitle,
  onAddProduct,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons
          name={icon}
          size={48}
          color="#CCCCCC"
        />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      {onAddProduct && (
        <TouchableOpacity style={styles.addButton} onPress={onAddProduct}>
          <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Agregar producto</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#111118',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0066CC',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 24,
    shadowColor: '#0066CC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});
