import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type Tab = 'resumen' | 'facturas' | 'ajustes';

interface Props { active: Tab; onChange: (tab: Tab) => void; }

const TABS: Tab[] = ['resumen', 'facturas', 'ajustes'];

const TAB_LABELS: Record<Tab, string> = {
  resumen:   'Resumen',
  facturas:  'Comprobantes',
  ajustes:   'Ajustes',
};

const DashboardTabs: React.FC<Props> = ({ active, onChange }) => (
  <View style={s.wrap}>
    {TABS.map((tab) => (
      <TouchableOpacity
        key={tab}
        onPress={() => onChange(tab)}
        style={s.tab}
        activeOpacity={0.75}
      >
        <Text style={[s.text, active === tab && s.textActive]}>
          {TAB_LABELS[tab]}
        </Text>
        {active === tab && (
          <LinearGradient
            colors={['#7c3aed', '#2563eb']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={s.line}
          />
        )}
      </TouchableOpacity>
    ))}
  </View>
);

export default DashboardTabs;

const s = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(139,92,246,0.12)',
    marginBottom: 14,
    shadowColor: '#6d28d9', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  tab:       { flex: 1, alignItems: 'center', paddingVertical: 13, position: 'relative' },
  text:      { fontSize: 12.5, fontFamily: 'PlusJakartaSans_600SemiBold', color: 'rgba(109,40,217,0.35)' },
  textActive:{ fontFamily: 'PlusJakartaSans_700Bold', color: '#7c3aed' },
  line:      { position: 'absolute', bottom: 0, left: 12, right: 12, height: 2.5, borderRadius: 2 },
});
