// src/screens/home/components/SectionHeader.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  onSeeAll?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, onSeeAll }) => (
  <View style={s.row}>
    <LinearGradient
      colors={['#7c3aed', '#2563eb']}
      start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
      style={s.accent}
    />
    <View style={s.textWrap}>
      <Text style={s.title}>{title}</Text>
      {subtitle && <Text style={s.sub}>{subtitle}</Text>}
    </View>
    {onSeeAll && (
      <TouchableOpacity onPress={onSeeAll} activeOpacity={0.7} style={s.linkWrap}>
        <Text style={s.link}>Ver todo</Text>
      </TouchableOpacity>
    )}
  </View>
);

const s = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, marginBottom: 14, gap: 10,
  },
  accent:   { width: 3, height: 34, borderRadius: 2 },
  textWrap: { flex: 1 },
  title: {
    fontSize: 17, fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: '#1e1b4b', letterSpacing: -0.3,
  },
  sub: {
    fontSize: 11.5, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(109,40,217,0.45)', marginTop: 2,
  },
  linkWrap: {
    backgroundColor: 'rgba(124,58,237,0.07)',
    borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5,
  },
  link: { fontSize: 12, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#7c3aed' },
});

export default SectionHeader;