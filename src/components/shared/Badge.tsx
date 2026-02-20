import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius } from '../../theme';

type BadgeVariant = 'live' | 'upcoming' | 'draft' | 'nft' | 'low' | 'out' | 'confirmed' | 'pending' | 'online';

type Props = {
  variant: BadgeVariant;
  label?: string;
  showDot?: boolean;
};

const CONFIG: Record<BadgeVariant, { 
  bg: string; 
  color: string; 
  border: string; 
  defaultLabel: string;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
}> = {
  live:      { bg: 'rgba(224,82,82,0.15)',   color: Colors.red,    border: 'rgba(224,82,82,0.25)',   defaultLabel: 'En vivo', icon: 'radio-outline' },
  upcoming:  { bg: 'rgba(212,168,83,0.12)',  color: Colors.accent, border: 'rgba(212,168,83,0.25)',  defaultLabel: 'Próximo', icon: 'calendar-outline' },
  draft:     { bg: Colors.surface2,          color: Colors.text3,  border: Colors.border,             defaultLabel: 'Borrador', icon: 'document-text-outline' },
  nft:       { bg: 'rgba(184,92,58,0.2)',    color: '#e07a58',     border: 'rgba(184,92,58,0.3)',    defaultLabel: 'NFT', icon: 'cube-outline' },
  low:       { bg: 'rgba(212,168,83,0.15)',  color: Colors.accent, border: 'rgba(212,168,83,0.3)',   defaultLabel: 'Últimas', icon: 'alert-circle-outline' },
  out:       { bg: 'rgba(224,82,82,0.12)',   color: Colors.red,    border: 'rgba(224,82,82,0.25)',   defaultLabel: 'Agotado', icon: 'close-circle-outline' },
  confirmed: { bg: 'rgba(62,207,142,0.12)',  color: Colors.green,  border: 'rgba(62,207,142,0.25)', defaultLabel: 'Confirmado', icon: 'checkmark-circle-outline' },
  pending:   { bg: 'rgba(212,168,83,0.12)',  color: Colors.accent, border: 'rgba(212,168,83,0.25)', defaultLabel: 'Pendiente', icon: 'time-outline' },
  online:    { bg: 'rgba(0,0,0,0.55)',       color: Colors.green,  border: 'rgba(62,207,142,0.35)', defaultLabel: 'Activo ahora', icon: 'wifi-outline' },
};

export const Badge: React.FC<Props> = ({ variant, label, showDot }) => {
  const cfg = CONFIG[variant];
  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
      {showDot && <View style={[styles.dot, { backgroundColor: cfg.color }]} />}
      {cfg.icon && <Ionicons name={cfg.icon} size={10} color={cfg.color} style={styles.icon} />}
      <Text style={[styles.text, { color: cfg.color }]}>
        {label ?? cfg.defaultLabel}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.sm,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 4,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 99,
  },
  icon: {
    marginRight: 2,
  },
  text: {
    fontSize: 10,
    fontWeight: '700',
  },
});