import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStripeOnboarding } from '../../StripeOnboardingContext';
import BaseModal from './BaseModal';

interface Props { visible: boolean; onClose: () => void; }

const STRIPE_LABELS: Record<string, string> = {
  'individual.first_name':                'Nombre legal',
  'individual.last_name':                 'Apellido legal',
  'individual.dob.day':                   'Fecha de nacimiento',
  'individual.dob.month':                 'Fecha de nacimiento',
  'individual.dob.year':                  'Fecha de nacimiento',
  'individual.id_number':                 'Número de identificación',
  'individual.ssn_last_4':                'Últimos 4 dígitos SSN',
  'individual.address.line1':             'Dirección',
  'individual.address.city':              'Ciudad',
  'individual.address.state':             'Departamento',
  'individual.address.postal_code':       'Código postal',
  'individual.verification.document':     'Documento de identidad',
  'individual.email':                     'Correo electrónico',
  'individual.phone':                     'Teléfono',
  'external_account':                     'Cuenta bancaria vinculada',
  'bank_account':                         'Cuenta bancaria',
  'tos_acceptance.date':                  'Aceptación de términos',
  'company.name':                         'Nombre de la empresa',
  'company.tax_id':                       'NIT de la empresa',
  'company.verification.document':        'Documento de la empresa',
};

const friendlyLabel = (req: string) => STRIPE_LABELS[req] ?? req.replace(/_/g, ' ');

const PendingModal: React.FC<Props> = ({ visible, onClose }) => {
  const { state } = useStripeOnboarding();
  const { chargesEnabled, payoutsEnabled, requirements = [] } = state.connectionStatus;
  const isFullyActive = chargesEnabled && payoutsEnabled;

  // Deduplicate labels (e.g. dob.day / dob.month / dob.year → one entry)
  const seen = new Set<string>();
  const pending = requirements.filter(r => {
    const label = friendlyLabel(r);
    if (seen.has(label)) return false;
    seen.add(label);
    return true;
  });

  return (
    <BaseModal
      visible={visible}
      onClose={onClose}
      title="Estado de tu cuenta"
      subtitle="Verificación requerida por Stripe"
    >
      <View style={s.body}>
        {/* CHIP DE ESTADO PRINCIPAL */}
        <View style={[s.statusBanner, isFullyActive ? s.bannerOk : s.bannerWarn]}>
          <View style={[s.iconCircle, isFullyActive ? s.circleOk : s.circleWarn]}>
            <Ionicons
              name={isFullyActive ? 'shield-checkmark' : 'timer-outline'}
              size={18}
              color={isFullyActive ? '#16a34a' : '#d97706'}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[s.bannerTitle, isFullyActive ? s.textOk : s.textWarn]}>
              {isFullyActive ? '¡Todo listo!' : 'Acción requerida'}
            </Text>
            <Text style={[s.bannerSub, isFullyActive ? s.textOk : s.textWarn]}>
              {isFullyActive
                ? 'Tu cuenta está verificada para recibir pagos.'
                : `Faltan ${pending.length} paso${pending.length !== 1 ? 's' : ''} para activar tus cobros.`}
            </Text>
          </View>
        </View>

        {/* CHECKS DE CAPACIDADES */}
        <View style={s.listWrapper}>
          {[
            { done: chargesEnabled,  label: 'Cobros habilitados' },
            { done: payoutsEnabled,  label: 'Retiros habilitados' },
          ].map((item, i) => (
            <View key={i} style={s.stepRow}>
              <View style={s.indicatorColumn}>
                <View style={[s.dot, item.done ? s.dotDone : s.dotPending]}>
                  {item.done && <Ionicons name="checkmark" size={12} color="#fff" />}
                </View>
                {i === 0 && <View style={[s.line, item.done && s.lineDone]} />}
              </View>
              <View style={[s.contentCard, !item.done && s.contentCardPending]}>
                <Text style={[s.rowText, item.done ? s.rowTextDone : s.rowTextPending]}>
                  {item.label}
                </Text>
                {!item.done && (
                  <View style={s.pendingBadge}>
                    <Text style={s.pendingBadgeText}>Pendiente</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* REQUISITOS PENDIENTES DE STRIPE */}
        {pending.length > 0 && (
          <>
            <Text style={s.reqTitle}>Información requerida por Stripe</Text>
            {pending.map((req, i) => (
              <View key={i} style={s.reqRow}>
                <Ionicons name="alert-circle-outline" size={15} color="#d97706" />
                <Text style={s.reqText}>{friendlyLabel(req)}</Text>
              </View>
            ))}
          </>
        )}

        {/* NOTA ACLARATORIA */}
        {!isFullyActive && (
          <View style={s.infoBox}>
            <Ionicons name="information-circle-outline" size={16} color="#64748b" />
            <Text style={s.infoText}>
              Completa estos pasos para que Stripe active tus depósitos automáticamente. Usa el portal de Stripe desde la pestaña Ajustes.
            </Text>
          </View>
        )}
      </View>
    </BaseModal>
  );
};

export default PendingModal;

const s = StyleSheet.create({
  body: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },

  statusBanner: {
    flexDirection: 'row', alignItems: 'center',
    padding: 16, borderRadius: 20, gap: 15, marginBottom: 24,
  },
  bannerOk:   { backgroundColor: '#f0fdf4', borderWidth: 1, borderColor: '#dcfce7' },
  bannerWarn: { backgroundColor: '#fffbeb', borderWidth: 1, borderColor: '#fef3c7' },
  iconCircle: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff',
  },
  circleOk:   { shadowColor: '#16a34a', shadowOpacity: 0.1, elevation: 2 },
  circleWarn: { shadowColor: '#d97706', shadowOpacity: 0.1, elevation: 2 },
  bannerTitle: { fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold' },
  bannerSub:   { fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', opacity: 0.8 },
  textOk:   { color: '#166534' },
  textWarn: { color: '#92400e' },

  listWrapper: { paddingLeft: 4, marginBottom: 16 },
  stepRow: { flexDirection: 'row', gap: 15 },
  indicatorColumn: { alignItems: 'center', width: 24 },
  dot: {
    width: 24, height: 24, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    zIndex: 2, borderWidth: 2,
  },
  dotDone:    { backgroundColor: '#16a34a', borderColor: '#16a34a' },
  dotPending: { backgroundColor: '#fff',    borderColor: '#fcd34d' },
  line: { width: 2, flex: 1, backgroundColor: '#f1f5f9', marginVertical: 4 },
  lineDone: { backgroundColor: '#16a34a' },

  contentCard: {
    flex: 1, paddingVertical: 12, paddingHorizontal: 16,
    borderRadius: 16, marginBottom: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  contentCardPending: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#f1f5f9',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03, shadowRadius: 5, elevation: 1,
  },
  rowText:        { fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', flex: 1 },
  rowTextDone:    { color: '#94a3b8' },
  rowTextPending: { color: '#1e1b4b' },
  pendingBadge: {
    backgroundColor: '#fffbeb', paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 6, borderWidth: 1, borderColor: '#fef3c7',
  },
  pendingBadgeText: { fontSize: 10, color: '#d97706', fontWeight: '800' },

  reqTitle: { fontSize: 12, fontFamily: 'PlusJakartaSans_700Bold', color: '#d97706', marginBottom: 8 },
  reqRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6, paddingHorizontal: 4 },
  reqText: { fontSize: 12.5, fontFamily: 'PlusJakartaSans_400Regular', color: '#1e1b4b', flex: 1 },

  infoBox: {
    flexDirection: 'row', gap: 10, marginTop: 14,
    backgroundColor: '#f8fafc', padding: 12, borderRadius: 12,
  },
  infoText: { fontSize: 11, color: '#64748b', flex: 1, lineHeight: 16 },
});
