// ─────────────────────────────────────────────────────────────────────
// ShopHeader.tsx — Header de la tienda (alineado al diseño BuscArt)
// ─────────────────────────────────────────────────────────────────────

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface ShopHeaderProps {
  title: string;
  onEdit?: () => void;
  onToggleView: () => void;
  isGridView: boolean;
}

export const ShopHeader: React.FC<ShopHeaderProps> = ({
  title, onEdit, onToggleView, isGridView,
}) => (
  <View style={styles.container}>
    {/* Divider líneas + label — igual que SectionDivider en ServicesSection */}
    <View style={styles.dividerRow}>
      <View style={styles.line} />
      <View style={styles.labelWrap}>
        <Ionicons name="storefront-outline" size={10} color="#7c3aed" />
        <Text style={styles.label}>{title}</Text>
      </View>
      <View style={styles.line} />
    </View>

    {/* Acciones */}
    <View style={styles.actions}>
      <TouchableOpacity style={styles.toggleBtn} onPress={onToggleView}>
        <Ionicons
          name={isGridView ? 'list-outline' : 'grid-outline'}
          size={16}
          color="#7c3aed"
        />
      </TouchableOpacity>

      {onEdit && (
        <TouchableOpacity onPress={onEdit}>
          <LinearGradient
            colors={['#7c3aed', '#2563eb']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.addBtnGrad}
          >
            <Ionicons name="add" size={14} color="#fff" />
            <Text style={styles.addBtnText}>Nuevo</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  dividerRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(167,139,250,0.15)',
  },
  labelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontSize: 9.5,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#7c3aed',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 12,
  },
  toggleBtn: {
    backgroundColor: 'rgba(124,58,237,0.08)',
    borderRadius: 20,
    padding: 7,
  },
  addBtnGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
  },
  addBtnText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
  },
});
