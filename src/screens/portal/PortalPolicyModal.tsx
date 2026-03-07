// src/screens/artist/PortalPolicyModal.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// ─── Contenido de políticas ────────────────────────────────────────────────────

export const POLICIES = {
  terms: {
    title: 'Términos y condiciones',
    icon: 'document-text',
    content: `BuscArt es una plataforma de conexión entre artistas y clientes. Al usar la plataforma como artista, aceptas las siguientes condiciones:

1. REGISTRO Y PERFIL
Debes proporcionar información veraz y actualizada sobre tu trabajo artístico. Eres responsable de mantener tu perfil al día.

2. SERVICIOS Y CONTRATACIONES
Las contrataciones se realizan directamente entre artista y cliente. BuscArt facilita el encuentro pero no interviene en los acuerdos económicos.

3. PAGOS Y COMISIONES
BuscArt puede aplicar una comisión del servicio sobre las contrataciones gestionadas a través de la plataforma, según lo indicado en tu plan.

4. CONTENIDO
Eres el único responsable del contenido que publicas (fotos, descripciones, precios). No se permite contenido falso, ofensivo o que infrinja derechos de terceros.

5. CANCELACIONES
Cada artista establece su propia política de cancelación. Se recomienda definirla claramente en tu perfil.

6. SUSPENSIÓN
BuscArt se reserva el derecho de suspender cuentas que infrinjan estos términos o que reciban quejas reiteradas de clientes.

7. MODIFICACIONES
Estos términos pueden actualizarse. Te notificaremos por correo electrónico ante cambios importantes.

Fecha de última actualización: Febrero 2026`,
  },
  privacy: {
    title: 'Política de privacidad',
    icon: 'shield',
    content: `En BuscArt tratamos tus datos con respeto y responsabilidad. Esta política explica cómo recopilamos y usamos tu información.

1. DATOS QUE RECOPILAMOS
• Información de perfil: nombre, foto, categoría artística, ubicación, bio.
• Datos de contacto: correo electrónico, redes sociales que compartes voluntariamente.
• Datos de uso: actividad en la plataforma, eventos creados, servicios publicados.

2. USO DE TUS DATOS
• Mostrar tu perfil a clientes potenciales en tu área.
• Enviarte notificaciones de contrataciones e interacciones.
• Mejorar la experiencia de la plataforma.
• Cumplir con obligaciones legales.

3. COMPARTIR INFORMACIÓN
No vendemos tus datos a terceros. Tu información de perfil es visible para otros usuarios de la plataforma según tu configuración de privacidad.

4. UBICACIÓN
Usamos tu ciudad para conectarte con clientes cercanos. No rastreamos tu ubicación en tiempo real sin tu consentimiento explícito.

5. SEGURIDAD
Implementamos medidas técnicas para proteger tu información. Sin embargo, ningún sistema es 100% seguro.

6. TUS DERECHOS
Puedes solicitar acceso, rectificación o eliminación de tus datos contactando a privacidad@buscard.co

7. COOKIES Y ANALYTICS
Usamos herramientas de análisis para entender el uso de la plataforma y mejorarla.

Fecha de última actualización: Febrero 2026`,
  },
  age: {
    title: 'Verificación de mayoría de edad',
    icon: 'person-circle',
    content: `Para usar BuscArt como artista registrado debes ser mayor de 18 años.

¿POR QUÉ LO REQUERIMOS?

1. CAPACIDAD LEGAL
Los contratos y acuerdos de servicio en Colombia requieren que las partes sean mayores de edad para tener plena capacidad jurídica.

2. PROTECCIÓN DE MENORES
Para garantizar un entorno seguro, los perfiles de artistas activos deben corresponder a personas adultas.

3. PAGOS Y FACTURACIÓN
Los procesos de pago, comisiones y facturación requieren que el titular sea mayor de edad.

¿QUÉ PASA SI SOY MENOR?

Si eres menor de 18 años puedes explorar la plataforma como cliente, pero no podrás activar un perfil de artista hasta cumplir la mayoría de edad.

VERIFICACIÓN
Al aceptar esta declaración, confirmas bajo tu responsabilidad que tienes 18 años o más. BuscArt puede solicitar verificación documental en caso de dudas.

Fecha de última actualización: Febrero 2026`,
  },
  exclusivity: {
    title: 'Cláusula de No Exclusividad',
    icon: 'people',
    content: `En BuscArt creemos en la libertad artística. Queremos que seas claro con esta cláusula antes de activar tu perfil.

NUESTRA POSTURA

BuscArt NO exige exclusividad. Puedes estar registrado en otras plataformas, trabajar con otras agencias o gestionar tus contratos de forma independiente al mismo tiempo que usas BuscArt. Esto es un derecho tuyo y lo respetamos.

¿POR QUÉ LO DECLARAMOS?

Queremos transparencia total. Algunos artistas tienen acuerdos previos con agencias que sí exigen exclusividad. Si ese es tu caso, es tu responsabilidad revisar que registrarte en BuscArt no incumpla ese acuerdo — nosotros no tenemos forma de saberlo ni de intervenir en esos contratos.

TU RESPONSABILIDAD

• Si trabajas de forma independiente: puedes usar BuscArt sin restricciones.
• Si tienes contrato con una agencia: verifica con ellos si puedes registrarte en plataformas externas.
• BuscArt no se hace responsable de conflictos derivados de acuerdos de exclusividad previos entre el artista y terceros.

EN RESUMEN

✓ BuscArt no te pide exclusividad.
✓ Puedes usar otras plataformas simultáneamente.
✓ Eres libre de gestionar tu carrera como prefieras.

Fecha de última actualización: Febrero 2026`,
  },
};

// ─── Policy Modal ─────────────────────────────────────────────────────────────

interface PolicyModalProps {
  policy: keyof typeof POLICIES | null;
  onClose: () => void;
  onAccept: () => void;
  alreadyAccepted: boolean;
  agencyAnswer?: 'si' | 'no' | null;
  onAgencyAnswer?: (answer: 'si' | 'no') => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({
  policy, onClose, onAccept, alreadyAccepted, agencyAnswer, onAgencyAnswer,
}) => {
  if (!policy) return null;
  const data = POLICIES[policy];
  const isExclusivity = policy === 'exclusivity';
  const canAcceptExclusivity = !isExclusivity || (agencyAnswer !== null && agencyAnswer !== undefined);

  return (
    <Modal visible animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={pm.safe}>
        <View style={pm.header}>
          <TouchableOpacity onPress={onClose} style={pm.closeBtn} activeOpacity={0.7}>
            <Ionicons name="close" size={20} color="#4c1d95" />
          </TouchableOpacity>
          <View style={pm.headerCenter}>
            <Ionicons name={data.icon as any} size={18} color="#7c3aed" />
            <Text style={pm.title}>{data.title}</Text>
          </View>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView contentContainerStyle={pm.content} showsVerticalScrollIndicator={false}>
          <Text style={pm.body}>{data.content}</Text>

          {isExclusivity && (
            <View style={pm.agencyBox}>
              <Text style={pm.agencyQuestion}>¿Trabajas con exclusividad para una agencia?</Text>
              <Text style={pm.agencyNote}>Esta información es solo para conocerte mejor. No afecta tu activación.</Text>
              <View style={pm.agencyBtns}>
                <TouchableOpacity
                  onPress={() => onAgencyAnswer?.('si')}
                  activeOpacity={0.8}
                  style={[pm.agencyBtn, agencyAnswer === 'si' && pm.agencyBtnSelected]}
                >
                  <Ionicons
                    name={agencyAnswer === 'si' ? 'checkmark-circle' : 'ellipse-outline'}
                    size={18}
                    color={agencyAnswer === 'si' ? '#7c3aed' : '#9ca3af'}
                  />
                  <Text style={[pm.agencyBtnTxt, agencyAnswer === 'si' && pm.agencyBtnTxtSelected]}>Sí</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onAgencyAnswer?.('no')}
                  activeOpacity={0.8}
                  style={[pm.agencyBtn, agencyAnswer === 'no' && pm.agencyBtnSelected]}
                >
                  <Ionicons
                    name={agencyAnswer === 'no' ? 'checkmark-circle' : 'ellipse-outline'}
                    size={18}
                    color={agencyAnswer === 'no' ? '#7c3aed' : '#9ca3af'}
                  />
                  <Text style={[pm.agencyBtnTxt, agencyAnswer === 'no' && pm.agencyBtnTxtSelected]}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={pm.footer}>
          {alreadyAccepted ? (
            <View style={pm.acceptedBadge}>
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              <Text style={pm.acceptedText}>Ya aceptaste esta política</Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={canAcceptExclusivity ? () => { onAccept(); onClose(); } : undefined}
              activeOpacity={canAcceptExclusivity ? 0.88 : 1}
              style={pm.acceptBtn}
            >
              <LinearGradient
                colors={canAcceptExclusivity ? ['#7c3aed', '#2563eb'] : ['rgba(124,58,237,0.3)', 'rgba(37,99,235,0.3)']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={pm.acceptBtnInner}
              >
                <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
                <Text style={pm.acceptBtnText}>
                  {isExclusivity && !canAcceptExclusivity ? 'Selecciona una opción para continuar' : 'Leer y aceptar'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const pm = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f3e8ff', gap: 8 },
  closeBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#faf5ff', alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  title: { fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: '#4c1d95' },
  content: { padding: 20, paddingBottom: 40 },
  body: { fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular', color: '#374151', lineHeight: 24 },
  footer: { paddingHorizontal: 20, paddingVertical: 16, borderTopWidth: 1, borderTopColor: '#f3e8ff' },
  acceptBtn: { borderRadius: 14, overflow: 'hidden' },
  acceptBtnInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  acceptBtnText: { fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff' },
  acceptedBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, backgroundColor: '#f0fdf4', borderRadius: 14, borderWidth: 1, borderColor: '#bbf7d0' },
  acceptedText: { fontSize: 14, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#166534' },
  agencyBox: { marginTop: 24, padding: 16, backgroundColor: '#faf5ff', borderRadius: 14, borderWidth: 1, borderColor: '#ede9fe' },
  agencyQuestion: { fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: '#4c1d95', marginBottom: 4 },
  agencyNote: { fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', color: '#6b7280', marginBottom: 16 },
  agencyBtns: { flexDirection: 'row', gap: 12 },
  agencyBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderRadius: 10, borderWidth: 1.5, borderColor: '#d1d5db', backgroundColor: '#fff' },
  agencyBtnSelected: { borderColor: '#7c3aed', backgroundColor: '#f5f3ff' },
  agencyBtnTxt: { fontSize: 15, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#9ca3af' },
  agencyBtnTxtSelected: { color: '#7c3aed' },
});
