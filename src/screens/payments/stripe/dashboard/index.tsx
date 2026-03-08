import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import HeroCard from './HeroCard';
import DashboardTabs from './DashboardTabs';
import ResumenTab from './tabs/ResumenTab';
import FacturasTab, { Comprobante } from './tabs/FacturasTab';
import AjustesTab from './tabs/AjustesTab';

type Tab = 'resumen' | 'facturas' | 'ajustes';

interface Props {
  onSelectComprobante?: (c: Comprobante) => void;
  onNewComprobante?: () => void;
}

const StripeDashboard = ({ onSelectComprobante, onNewComprobante }: Props) => {
  const [activeTab, setActiveTab] = useState<Tab>('resumen');

  return (
    <View style={s.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={s.scroll}
        contentContainerStyle={s.content}
      >
        <HeroCard />
        <DashboardTabs active={activeTab} onChange={setActiveTab} />
        {activeTab === 'resumen'  && <ResumenTab />}
        {activeTab === 'facturas' && (
          <FacturasTab
            onSelect={onSelectComprobante ?? (() => {})}
          />
        )}
        {activeTab === 'ajustes'  && <AjustesTab onNewComprobante={onNewComprobante} />}
      </ScrollView>
    </View>
  );
};

export default StripeDashboard;

const s = StyleSheet.create({
  root:    { flex: 1, backgroundColor: '#fff' },
  scroll:  { flex: 1 },
  content: { padding: 16, paddingBottom: 30 },
});
