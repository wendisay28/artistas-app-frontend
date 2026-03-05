// ─────────────────────────────────────────────────────────────────────
// EmptyShopState.tsx — Estado vacío de la tienda (alineado al diseño BuscArt)
// ─────────────────────────────────────────────────────────────────────

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface EmptyShopStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onAddProduct?: () => void;
}

export const EmptyShopState: React.FC<EmptyShopStateProps> = ({
  icon, title, subtitle, onAddProduct,
}) => (
  <View style={styles.wrap}>
    <View style={styles.iconWrap}>
      <Ionicons name={icon} size={32} color="rgba(124,58,237,0.3)" />
    </View>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.subtitle}>{subtitle}</Text>
    {onAddProduct && (
      <TouchableOpacity onPress={onAddProduct} style={styles.btn}>
        <LinearGradient
          colors={['#7c3aed', '#2563eb']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={styles.btnGrad}
        >
          <Ionicons name="add" size={15} color="#fff" />
          <Text style={styles.btnText}>Agregar producto</Text>
        </LinearGradient>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingVertical: 40,
    borderWidth: 1.5,
    borderColor: 'rgba(167,139,250,0.18)',
    borderRadius: 20,
    borderStyle: 'dashed',
    backgroundColor: 'rgba(245,243,255,0.4)',
    marginTop: 4,
  },
  iconWrap: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: 'rgba(124,58,237,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1e1b4b',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(124,58,237,0.45)',
    textAlign: 'center',
    paddingHorizontal: 30,
    lineHeight: 18,
  },
  btn: { marginTop: 20 },
  btnGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
  },
  btnText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
  },
});
