// src/screens/payments/StripeSetupScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Pressable, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StripeOnboardingProvider, useStripeOnboarding } from './stripe/StripeOnboardingContext';
import StripeSetupFlow from './stripe';
import EditAccountModal  from './stripe/dashboard/modals/EditAccountModal';
import BankModal         from './stripe/dashboard/modals/BankModal';
import DocumentsModal    from './stripe/dashboard/modals/DocumentsModal';
import CompanyDocsModal  from './stripe/dashboard/modals/CompanyDocsModal';
import PendingModal      from './stripe/dashboard/modals/PendingModal';
import SupportModal      from './stripe/dashboard/modals/SupportModal';
import { Comprobante } from './stripe/dashboard/tabs/FacturasTab';
import ComprobanteDetail from './stripe/dashboard/tabs/ComprobanteDetail';

type MenuAction = 'edit-account' | 'bank' | 'documents' | 'company-docs' | 'pending' | 'support';

interface StripeSetupScreenProps { onClose?: () => void; }

const MENU_ITEMS: { icon: string; label: string; sub: string; action: MenuAction }[] = [
  { icon: 'person-outline',        label: 'Editar datos de cuenta',  sub: 'Nombre, email y teléfono',     action: 'edit-account' },
  { icon: 'card-outline',          label: 'Información bancaria',    sub: 'Cuenta donde recibirás pagos', action: 'bank'         },
  { icon: 'document-text-outline', label: 'Documentos de identidad', sub: 'DNI, pasaporte o cédula',      action: 'documents'    },
  { icon: 'business-outline',      label: 'Documentos de empresa',   sub: 'RUT, NIT o escritura social',  action: 'company-docs' },
  { icon: 'alert-circle-outline',  label: 'Requisitos pendientes',   sub: 'Revisa lo que Stripe necesita',action: 'pending'      },
  { icon: 'headset-outline',       label: 'Soporte Stripe',          sub: 'Ayuda con tu cuenta de pagos', action: 'support'      },
];

// ── Menú flotante (sin Modal — View overlay con zIndex) ───────────────────────
const AccountMenu: React.FC<{
  visible: boolean;
  onClose: () => void;
  onAction: (action: MenuAction) => void;
}> = ({ visible, onClose, onAction }) => {
  if (!visible) return null;
  return (
    <View style={m.overlay} pointerEvents="box-none">
      <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
      <View style={m.sheet}>
        <View style={m.handle} />
        <View style={m.sheetHeader}>
          <View>
            <Text style={m.sheetTitle}>Gestión de cuenta</Text>
            <Text style={m.sheetSub}>Stripe puede pedirte estos datos</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={m.closeBtn}>
            <Ionicons name="close" size={18} color="#7c3aed" />
          </TouchableOpacity>
        </View>
        <ScrollView>
          {MENU_ITEMS.map((item, i) => (
            <TouchableOpacity
              key={i}
              activeOpacity={0.7}
              style={[m.item, i < MENU_ITEMS.length - 1 && m.itemBorder]}
              onPress={() => { onClose(); onAction(item.action); }}
            >
              <View style={m.itemIcon}>
                <Ionicons name={item.icon as any} size={18} color="#7c3aed" />
              </View>
              <View style={m.itemText}>
                <Text style={m.itemLabel}>{item.label}</Text>
                <Text style={m.itemSub}>{item.sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={14} color="rgba(124,58,237,0.3)" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

// ── Contenido principal ───────────────────────────────────────────────────────
const StripeSetupContent = ({ onClose }: StripeSetupScreenProps) => {
  const navigation = useNavigation();
  const { state, goPrevStep } = useStripeOnboarding();
  const [menuVisible,    setMenuVisible]    = useState(false);
  const [activeModal,    setActiveModal]    = useState<MenuAction | null>(null);
  const [selectedComp,   setSelectedComp]   = useState<Comprobante | null>(null);
  const isDashboard = state.currentStep === 'complete';

  const handleBack = () => {
    if (isDashboard || state.currentStep === 'welcome') {
      if (onClose) onClose(); else navigation.goBack();
    } else {
      goPrevStep();
    }
  };

  const closeModal = () => setActiveModal(null);
  const handleNewComprobante = () => (navigation as any).navigate('NewInvoiceScreen');

  return (
    <SafeAreaView style={s.root} edges={['top', 'left', 'right']}>
      {/* Top bar */}
      <View style={s.header}>
        <TouchableOpacity onPress={handleBack} style={s.backBtn}>
          <Ionicons name={isDashboard ? 'close-outline' : 'chevron-back'} size={22} color="#4c1d95" />
        </TouchableOpacity>

        <View style={s.logoRow}>
          <Text style={s.logoBusca}>Busc</Text>
          <LinearGradient
            colors={['#7c3aed', '#2563eb']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={s.logoArtBg}
          >
            <Text style={s.logoArt}>Art</Text>
          </LinearGradient>
        </View>

        {isDashboard ? (
          <TouchableOpacity onPress={() => setMenuVisible(true)} style={s.backBtn} activeOpacity={0.7}>
            <Ionicons name="menu-outline" size={22} color="#4c1d95" />
          </TouchableOpacity>
        ) : (
          <View style={s.backBtn} />
        )}
      </View>

      {/* Contenido del flujo */}
      <StripeSetupFlow onClose={onClose} onSelectComprobante={setSelectedComp} onNewComprobante={handleNewComprobante} />

      {/* ── Overlays — siempre AL FINAL para quedar encima de todo ── */}
      <AccountMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onAction={(action) => setActiveModal(action)}
      />
      <EditAccountModal visible={activeModal === 'edit-account'} onClose={closeModal} />
      <BankModal        visible={activeModal === 'bank'}         onClose={closeModal} />
      <DocumentsModal   visible={activeModal === 'documents'}    onClose={closeModal} />
      <CompanyDocsModal visible={activeModal === 'company-docs'} onClose={closeModal} />
      <PendingModal     visible={activeModal === 'pending'}      onClose={closeModal} />
      <SupportModal     visible={activeModal === 'support'}      onClose={closeModal} />
      <ComprobanteDetail item={selectedComp} onClose={() => setSelectedComp(null)} />
    </SafeAreaView>
  );
};

const StripeSetupScreen = ({ onClose }: StripeSetupScreenProps) => (
  <StripeOnboardingProvider>
    <StripeSetupContent onClose={onClose} />
  </StripeOnboardingProvider>
);

export default StripeSetupScreen;

// ── Estilos ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: 'rgba(139,92,246,0.1)',
    zIndex: 10,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: '#faf5ff',
    alignItems: 'center', justifyContent: 'center',
  },
  logoRow:   { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  logoBusca: { fontSize: 20, fontFamily: 'PlusJakartaSans_800ExtraBold', color: '#1e1b4b', letterSpacing: -0.4 },
  logoArtBg: { borderRadius: 7, paddingHorizontal: 5, paddingVertical: 1 },
  logoArt:   { fontSize: 20, fontFamily: 'PlusJakartaSans_800ExtraBold', color: '#fff', letterSpacing: -0.4 },
});

const m = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    backgroundColor: 'rgba(30,27,75,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingBottom: 32,
    maxHeight: '85%',
    shadowColor: '#6d28d9', shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.12, shadowRadius: 24, elevation: 20,
  },
  handle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: 'rgba(124,58,237,0.15)',
    alignSelf: 'center', marginTop: 12, marginBottom: 4,
  },
  sheetHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: 'rgba(124,58,237,0.07)',
  },
  sheetTitle: { fontSize: 16, fontFamily: 'PlusJakartaSans_800ExtraBold', color: '#1e1b4b' },
  sheetSub:   { fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(109,40,217,0.45)', marginTop: 2 },
  closeBtn: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: 'rgba(124,58,237,0.07)',
    alignItems: 'center', justifyContent: 'center',
  },
  item:       { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingVertical: 14 },
  itemBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(124,58,237,0.06)' },
  itemIcon: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: 'rgba(124,58,237,0.07)',
    alignItems: 'center', justifyContent: 'center',
  },
  itemText:  { flex: 1 },
  itemLabel: { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b' },
  itemSub:   { fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(109,40,217,0.45)', marginTop: 1 },
});
