// src/screens/home/components/SectionHeader.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeStore } from '../../../store/themeStore';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  onSeeAll?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, onSeeAll }) => {
  const { colors } = useThemeStore();
  
  const styles = getStyles(colors);
  
  return (
    <View style={styles.row}>
      <LinearGradient
        colors={['#7c3aed', '#2563eb']}
        start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
        style={styles.accent}
      />
      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.sub}>{subtitle}</Text>}
      </View>
      {onSeeAll && (
        <TouchableOpacity onPress={onSeeAll} activeOpacity={0.7} style={styles.linkWrap}>
          <Text style={styles.link}>Ver todo</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const getStyles = (colors: any) => StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, marginBottom: 14, gap: 10,
  },
  accent:   { width: 3, height: 34, borderRadius: 2 },
  textWrap: { flex: 1 },
  title: {
    fontSize: 17, fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: colors.text, letterSpacing: -0.3,
  },
  sub: {
    fontSize: 11.5, fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.background === '#000000' ? 'rgba(167,139,250,0.7)' : 'rgba(109,40,217,0.65)', 
    marginTop: 2,
  },
  linkWrap: {
    backgroundColor: colors.background === '#000000' ? 'rgba(139,92,246,0.15)' : 'rgba(124,58,237,0.07)',
    borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5,
  },
  link: { 
    fontSize: 12, 
    fontFamily: 'PlusJakartaSans_600SemiBold', 
    color: colors.primary 
  },
});

export default SectionHeader;