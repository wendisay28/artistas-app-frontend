// ─────────────────────────────────────────────────────────────────────
// ShopHeader.tsx — Header de la tienda con título y acciones
// ─────────────────────────────────────────────────────────────────────

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ShopHeaderProps {
  title: string;
  onEdit: () => void;
  onToggleView: () => void;
  isGridView: boolean;
}

export const ShopHeader: React.FC<ShopHeaderProps> = ({
  title,
  onEdit,
  onToggleView,
  isGridView,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleSection}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>Gestiona tus productos</Text>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.viewToggle}
          onPress={onToggleView}
        >
          <Ionicons
            name={isGridView ? 'list-outline' : 'grid-outline'}
            size={20}
            color="#0066CC"
          />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.editBtn} onPress={onEdit}>
          <Ionicons name="create-outline" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#111118',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#666666',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  viewToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  editBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0066CC',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0066CC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});
