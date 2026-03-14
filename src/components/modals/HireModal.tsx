// src/components/modals/HireModal.tsx
// Flujo completo de contratación: Detalles → Checkout → Confirmación con códigos

import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, ActivityIndicator, Platform, KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { servicesService, type Service } from '../../services/api/services';
import { contractsService } from '../../services/api/contracts';
import type { Artist } from '../../types/explore';

// ── helpers ───────────────────────────────────────────────────────────────────

const formatCOP = (n: number) =>
  `$${n.toLocaleString('es-CO', { maximumFractionDigits: 0 })}`;

const getServicePrice = (s: Service): number => {
  const raw = (s as any).price ?? (s as any).pricePerHour ?? (s as any).basePrice ?? 0;
  const n = typeof raw === 'string' ? parseFloat(raw) : Number(raw);
  return isNaN(n) ? 0 : n;
};

const generateCode = () => Math.floor(1000 + Math.random() * 9000).toString();

const BUSCART_FEE = 2000; // tarifa fija de la plataforma en COP

type ServiceType = 'presencial' | 'hibrido' | 'digital';
type Step = 'details' | 'checkout' | 'confirmation';

interface VerificationCodes {
  inicio?: string;
  avance?: string;
  entrega: string;
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface HireModalProps {
  visible: boolean;
  artist: Artist;
  preSelectedService?: Service;
  onClose: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function HireModal({ visible, artist, preSelectedService, onClose }: HireModalProps) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  // ── Paso actual ──────────────────────────────────────────────────────────
  const [step, setStep] = useState<Step>('details');

  // ── Paso 1: Detalles ─────────────────────────────────────────────────────
  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(preSelectedService ?? null);
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [message, setMessage] = useState('');

  // ── Paso 2: Checkout ──────────────────────────────────────────────────────
  const [serviceType, setServiceType] = useState<ServiceType>('presencial');
  const [submitting, setSubmitting] = useState(false);
  const [showFeeInfo, setShowFeeInfo] = useState(false);

  // ── Paso 3: Confirmación ──────────────────────────────────────────────────
  const [codes, setCodes] = useState<VerificationCodes>({ entrega: '' });
  const [contractId, setContractId] = useState<string | null>(null);

  // ── Sync preSelectedService ───────────────────────────────────────────────
  useEffect(() => {
    if (preSelectedService) setSelectedService(preSelectedService);
  }, [preSelectedService]);

  // ── Reset al cerrar ───────────────────────────────────────────────────────
  const handleClose = useCallback(() => {
    setStep('details');
    setEventDate('');
    setEventLocation('');
    setMessage('');
    setServiceType('presencial');
    setShowFeeInfo(false);
    onClose();
  }, [onClose]);

  // ── Cargar servicios del artista ──────────────────────────────────────────
  useEffect(() => {
    if (!visible) return;
    const uid = artist.userId || artist.id;
    if (!uid) return;
    setServicesLoading(true);
    servicesService
      .getUserServices(String(uid))
      .then((res) => {
        const list = Array.isArray(res) ? res : [];
        setServices(list);
        if (!selectedService && list.length > 0) setSelectedService(list[0]);
      })
      .catch(() => setServices([]))
      .finally(() => setServicesLoading(false));
  }, [visible, artist.id, artist.userId]);

  // ── Precios ───────────────────────────────────────────────────────────────
  const price = selectedService ? getServicePrice(selectedService) : 0;
  const total = price + (price > 0 ? BUSCART_FEE : 0);

  // ── Paso 1 → 2 ───────────────────────────────────────────────────────────
  const handleReviewPayment = useCallback(() => {
    if (!selectedService) {
      Alert.alert('Selecciona un servicio', 'Elige el servicio que deseas contratar.');
      return;
    }
    setStep('checkout');
  }, [selectedService]);

  // ── Paso 2 → 3: Pagar ────────────────────────────────────────────────────
  const handlePay = useCallback(async () => {
    if (!selectedService) return;
    setSubmitting(true);
    try {
      const contract = await contractsService.createContract({
        artistId: String(artist.userId || artist.id),
        serviceId: selectedService.id,
        serviceType,
        serviceName: selectedService.name,
        description: message.trim() || undefined,
        amount: total || undefined,
        serviceDate: eventDate.trim() || undefined,
        metadata: {
          eventLocation: eventLocation.trim() || undefined,
          artistName: artist.name,
          artistImage: artist.image,
        },
      });

      const cid = contract?.id ?? contract?.data?.id;
      if (!cid) throw new Error('No se recibió ID del acuerdo');
      setContractId(String(cid));

      // Generar códigos según tipo de servicio
      const generated: VerificationCodes =
        serviceType === 'presencial'
          ? { inicio: generateCode(), entrega: generateCode() }
          : serviceType === 'hibrido'
          ? { inicio: generateCode(), avance: generateCode(), entrega: generateCode() }
          : { entrega: generateCode() };
      setCodes(generated);

      // Crear preferencia MP si hay precio
      if (total > 0) {
        try {
          await contractsService.createMPPreference(cid, selectedService.name, total);
        } catch {
          // No bloquear si MP falla
        }
      }

      setStep('confirmation');
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.error || 'No se pudo procesar el pago. Intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  }, [selectedService, artist, message, total, eventDate, eventLocation, serviceType]);

  // ── Navegar a contrataciones ──────────────────────────────────────────────
  const handleGoToContracts = useCallback(() => {
    handleClose();
    navigation.navigate('Contracts');
  }, [handleClose, navigation]);

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[s.root, { paddingTop: insets.top || 16 }]}>

          {/* ── PASO 1: DETALLES ──────────────────────────────────────────── */}
          {step === 'details' && (
            <>
              <View style={s.header}>
                <TouchableOpacity onPress={handleClose} style={s.closeBtn} hitSlop={8}>
                  <Ionicons name="close" size={22} color="#374151" />
                </TouchableOpacity>
                <Text style={s.headerTitle}>Detalles del pedido</Text>
                <View style={{ width: 38 }} />
              </View>

              <ScrollView
                style={s.scroll}
                contentContainerStyle={s.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {/* Artista */}
                <View style={s.artistCard}>
                  {artist.image ? (
                    <Image source={{ uri: artist.image }} style={s.artistAvatar} contentFit="cover" />
                  ) : (
                    <View style={[s.artistAvatar, s.avatarFallback]}>
                      <Ionicons name="person" size={28} color="#9ca3af" />
                    </View>
                  )}
                  <View style={s.artistInfo}>
                    <Text style={s.artistName}>{artist.name}</Text>
                    <Text style={s.artistSub}>{artist.location || 'Colombia'}</Text>
                    {artist.rating ? (
                      <View style={s.ratingRow}>
                        <Ionicons name="star" size={12} color="#fbbf24" />
                        <Text style={s.ratingText}>{artist.rating}</Text>
                      </View>
                    ) : null}
                  </View>
                  {artist.verified && <Ionicons name="checkmark-circle" size={20} color="#7c3aed" />}
                </View>

                {/* Servicio */}
                <Text style={s.label}>Servicio</Text>
                {servicesLoading ? (
                  <ActivityIndicator color="#7c3aed" style={{ marginVertical: 16 }} />
                ) : services.length === 0 ? (
                  <View style={s.emptyServices}>
                    <Ionicons name="briefcase-outline" size={32} color="#d1d5db" />
                    <Text style={s.emptyServicesText}>
                      Este artista aún no tiene servicios publicados.{'\n'}Puedes contactarlo directamente.
                    </Text>
                  </View>
                ) : (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.servicesRow}>
                    {services.map((svc) => {
                      const sel = selectedService?.id === svc.id && selectedService?.name === svc.name;
                      const p = getServicePrice(svc);
                      return (
                        <TouchableOpacity
                          key={`${svc.id}-${svc.name}`}
                          onPress={() => setSelectedService(svc)}
                          style={[s.serviceChip, sel && s.serviceChipSel]}
                          activeOpacity={0.8}
                        >
                          <Text style={[s.chipName, sel && s.chipNameSel]} numberOfLines={2}>{svc.name}</Text>
                          {p > 0 && <Text style={[s.chipPrice, sel && s.chipPriceSel]}>{formatCOP(p)}</Text>}
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                )}

                {selectedService?.description && (
                  <View style={s.serviceDesc}>
                    <Text style={s.serviceDescText}>{selectedService.description}</Text>
                  </View>
                )}

                {/* Precio base */}
                {price > 0 && (
                  <View style={s.basePriceRow}>
                    <Text style={s.basePriceLabel}>Precio base del artista</Text>
                    <Text style={s.basePriceValue}>{formatCOP(price)}</Text>
                  </View>
                )}

                {/* Fecha */}
                <Text style={s.label}>Fecha del evento</Text>
                <View style={s.inputWrap}>
                  <Ionicons name="calendar-outline" size={18} color="#9ca3af" style={{ marginRight: 10 }} />
                  <TextInput
                    style={s.input}
                    placeholder="Ej: 15 de abril 2026 a las 7pm"
                    placeholderTextColor="#9ca3af"
                    value={eventDate}
                    onChangeText={setEventDate}
                  />
                </View>

                {/* Lugar */}
                <Text style={s.label}>Lugar del evento</Text>
                <View style={s.inputWrap}>
                  <Ionicons name="location-outline" size={18} color="#9ca3af" style={{ marginRight: 10 }} />
                  <TextInput
                    style={s.input}
                    placeholder="Ej: Medellín, Laureles"
                    placeholderTextColor="#9ca3af"
                    value={eventLocation}
                    onChangeText={setEventLocation}
                  />
                </View>

                {/* Descripción */}
                <Text style={s.label}>Descripción del servicio</Text>
                <View style={[s.inputWrap, { alignItems: 'flex-start', paddingTop: 12, paddingBottom: 12 }]}>
                  <TextInput
                    style={[s.input, { minHeight: 80, textAlignVertical: 'top' }]}
                    placeholder="Cuéntale al artista los detalles de tu evento..."
                    placeholderTextColor="#9ca3af"
                    value={message}
                    onChangeText={setMessage}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>

                <View style={{ height: 110 }} />
              </ScrollView>

              <View style={[s.cta, { paddingBottom: insets.bottom + 16 }]}>
                <TouchableOpacity
                  onPress={handleReviewPayment}
                  activeOpacity={0.85}
                  style={s.ctaBtn}
                >
                  <LinearGradient colors={['#9333ea', '#2563eb']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.ctaGrad}>
                    <Ionicons name="receipt-outline" size={18} color="#fff" />
                    <Text style={s.ctaLabel}>Revisar pago</Text>
                    <Ionicons name="arrow-forward" size={18} color="rgba(255,255,255,0.75)" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* ── PASO 2: CHECKOUT ──────────────────────────────────────────── */}
          {step === 'checkout' && (
            <>
              <View style={s.header}>
                <TouchableOpacity onPress={() => setStep('details')} style={s.closeBtn} hitSlop={8}>
                  <Ionicons name="arrow-back" size={22} color="#374151" />
                </TouchableOpacity>
                <Text style={s.headerTitle}>Resumen del pago</Text>
                <View style={{ width: 38 }} />
              </View>

              <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Artista compacto */}
                <View style={s.artistMini}>
                  {artist.image ? (
                    <Image source={{ uri: artist.image }} style={s.miniAvatar} contentFit="cover" />
                  ) : (
                    <View style={[s.miniAvatar, s.avatarFallback]}>
                      <Ionicons name="person" size={16} color="#9ca3af" />
                    </View>
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={s.miniName}>{artist.name}</Text>
                    <Text style={s.miniService}>{selectedService?.name}</Text>
                  </View>
                  {artist.verified && <Ionicons name="checkmark-circle" size={16} color="#7c3aed" />}
                </View>

                {/* Desglose de costos */}
                <View style={s.breakdown}>
                  <Text style={s.breakdownTitle}>Desglose del pago</Text>

                  <View style={s.breakdownRow}>
                    <Text style={s.breakdownLabel}>Subtotal (Artista)</Text>
                    <Text style={s.breakdownValue}>{formatCOP(price)}</Text>
                  </View>

                  <View style={s.breakdownRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Text style={s.breakdownLabel}>Tarifa de servicio BuscArt</Text>
                      <TouchableOpacity onPress={() => setShowFeeInfo(v => !v)} hitSlop={8}>
                        <Ionicons name="information-circle-outline" size={16} color="#9ca3af" />
                      </TouchableOpacity>
                    </View>
                    <Text style={s.breakdownValue}>{formatCOP(BUSCART_FEE)}</Text>
                  </View>

                  {showFeeInfo && (
                    <View style={s.feeInfo}>
                      <Ionicons name="shield-checkmark-outline" size={14} color="#7c3aed" />
                      <Text style={s.feeInfoText}>
                        Este cobro nos permite mantener la plataforma segura y procesar tu pago de forma profesional.
                      </Text>
                    </View>
                  )}

                  <View style={s.divider} />

                  <View style={s.breakdownRow}>
                    <Text style={s.totalLabel}>Total a pagar</Text>
                    <Text style={s.totalValue}>{formatCOP(total)}</Text>
                  </View>
                </View>

                {/* Tipo de servicio */}
                <Text style={s.label}>¿Cómo se prestará el servicio?</Text>
                <View style={s.serviceTypeRow}>
                  {([
                    { id: 'presencial', icon: 'walk-outline', label: 'Presencial', desc: '2 códigos: llegada y entrega' },
                    { id: 'hibrido',   icon: 'git-merge-outline', label: 'Híbrido',    desc: '3 códigos: inicio, avance y entrega' },
                    { id: 'digital',   icon: 'cloud-outline',     label: 'Digital',    desc: '1 código: al entregar el archivo' },
                  ] as const).map(opt => (
                    <TouchableOpacity
                      key={opt.id}
                      onPress={() => setServiceType(opt.id)}
                      style={[s.typeChip, serviceType === opt.id && s.typeChipSel]}
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name={opt.icon}
                        size={18}
                        color={serviceType === opt.id ? '#7c3aed' : '#9ca3af'}
                      />
                      <Text style={[s.typeLabel, serviceType === opt.id && s.typeLabelSel]}>{opt.label}</Text>
                      <Text style={s.typeDesc}>{opt.desc}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Info de pago seguro */}
                <View style={s.secureBox}>
                  <Ionicons name="lock-closed-outline" size={16} color="#059669" />
                  <Text style={s.secureText}>
                    Tu pago queda protegido por BuscArt. El artista lo recibirá solo cuando confirmes la entrega con tu código.
                  </Text>
                </View>

                <View style={{ height: 140 }} />
              </ScrollView>

              <View style={[s.cta, { paddingBottom: insets.bottom + 8 }]}>
                <TouchableOpacity
                  onPress={handlePay}
                  disabled={submitting}
                  activeOpacity={0.85}
                  style={s.ctaBtn}
                >
                  <LinearGradient colors={['#9333ea', '#2563eb']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.ctaGrad}>
                    {submitting ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <>
                        <Ionicons name="card-outline" size={18} color="#fff" />
                        <Text style={s.ctaLabel}>Pagar {formatCOP(total)}</Text>
                        <Ionicons name="arrow-forward" size={18} color="rgba(255,255,255,0.75)" />
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
                <Text style={s.termsText}>
                  Al pagar, aceptas los{' '}
                  <Text style={s.termsLink}>Términos de Servicio</Text> y el{' '}
                  <Text style={s.termsLink}>Acuerdo de Contratación de BuscArt</Text>.
                </Text>
              </View>
            </>
          )}

          {/* ── PASO 3: CONFIRMACIÓN (Glassmorphism) ─────────────────────── */}
          {step === 'confirmation' && (
            <ScrollView
              style={s.scroll}
              contentContainerStyle={[s.scrollContent, { paddingBottom: insets.bottom + 32 }]}
              showsVerticalScrollIndicator={false}
            >
              {/* Card de éxito glassmorphism */}
              <View style={s.glassCard}>
                <LinearGradient
                  colors={['rgba(124,58,237,0.12)', 'rgba(37,99,235,0.08)']}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                <View style={s.successIcon}>
                  <LinearGradient colors={['#9333ea', '#2563eb']} style={s.successIconGrad}>
                    <Ionicons name="shield-checkmark" size={32} color="#fff" />
                  </LinearGradient>
                </View>
                <Text style={s.successTitle}>¡Pago Exitoso!</Text>
                <Text style={s.successSub}>
                  Tu solicitud ha sido enviada a{' '}
                  <Text style={{ fontFamily: 'PlusJakartaSans_700Bold' }}>{artist.name}</Text>.{'\n'}
                  El dinero está resguardado de forma segura por BuscArt.
                </Text>

                {/* ¿Qué sigue? */}
                <View style={s.nextSteps}>
                  <Text style={s.nextStepsTitle}>¿Qué sigue?</Text>
                  <View style={s.nextStep}>
                    <View style={[s.stepDot, { backgroundColor: '#7c3aed' }]} />
                    <Text style={s.stepText}>El artista confirmará su disponibilidad en breve.</Text>
                  </View>
                  <View style={s.nextStep}>
                    <View style={[s.stepDot, { backgroundColor: '#2563eb' }]} />
                    <Text style={s.stepText}>
                      {serviceType === 'presencial'
                        ? 'Cuando llegue, entrégale tu Código de Inicio. Al terminar, el Código de Finalización.'
                        : serviceType === 'hibrido'
                        ? 'Usa los 3 códigos: al inicio, al recibir el avance, y al finalizar.'
                        : 'Cuando recibas el archivo entregable, usa tu Código de Entrega para liberar el pago.'}
                    </Text>
                  </View>
                  <View style={s.nextStep}>
                    <View style={[s.stepDot, { backgroundColor: '#059669' }]} />
                    <Text style={s.stepText}>Al entregar el último código, el pago se libera automáticamente al artista.</Text>
                  </View>
                </View>
              </View>

              {/* Códigos de verificación */}
              <Text style={s.codesTitle}>Tus códigos de seguridad</Text>
              <Text style={s.codesSub}>
                {serviceType === 'presencial'
                  ? 'Guárdalos. Entrégalos al artista según el momento indicado.'
                  : serviceType === 'hibrido'
                  ? 'Tienes 3 códigos para este servicio híbrido.'
                  : 'Entrégalo al artista solo cuando estés satisfecho con el entregable.'}
              </Text>

              {codes.inicio && (
                <CodeCard
                  label={serviceType === 'hibrido' ? 'Código de Inicio' : 'Código de Inicio'}
                  description="Entrégalo cuando el artista llegue al lugar"
                  code={codes.inicio}
                  color="#7c3aed"
                  icon="walk-outline"
                />
              )}
              {codes.avance && (
                <CodeCard
                  label="Código de Avance"
                  description="Entrégalo al recibir los bocetos o material inicial"
                  code={codes.avance}
                  color="#2563eb"
                  icon="git-merge-outline"
                />
              )}
              <CodeCard
                label={codes.inicio ? 'Código de Finalización' : 'Código de Entrega'}
                description={codes.inicio
                  ? 'Entrégalo solo cuando estés satisfecho con el resultado final'
                  : 'Entrégalo al recibir el archivo o entregable final'}
                code={codes.entrega}
                color="#059669"
                icon="checkmark-circle-outline"
              />

              {/* CTAs */}
              <TouchableOpacity onPress={handleGoToContracts} style={s.ctaBtn2} activeOpacity={0.85}>
                <LinearGradient colors={['#9333ea', '#2563eb']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.ctaGrad}>
                  <Ionicons name="briefcase-outline" size={18} color="#fff" />
                  <Text style={s.ctaLabel}>Ir a mis contrataciones</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleClose} style={s.secondaryBtn} activeOpacity={0.7}>
                <Text style={s.secondaryBtnText}>Cerrar</Text>
              </TouchableOpacity>
            </ScrollView>
          )}

        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ── CodeCard ──────────────────────────────────────────────────────────────────

function CodeCard({
  label, description, code, color, icon,
}: {
  label: string;
  description: string;
  code: string;
  color: string;
  icon: string;
}) {
  return (
    <View style={[cc.card, { borderColor: color + '30' }]}>
      <View style={[cc.iconWrap, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon as any} size={20} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={cc.label}>{label}</Text>
        <Text style={cc.desc}>{description}</Text>
      </View>
      <View style={[cc.codeBox, { backgroundColor: color + '10', borderColor: color + '40' }]}>
        <Text style={[cc.code, { color }]}>{code}</Text>
      </View>
    </View>
  );
}

const cc = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    gap: 12,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#111827',
    marginBottom: 2,
  },
  desc: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#9ca3af',
    lineHeight: 14,
  },
  codeBox: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  code: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_700Bold',
    letterSpacing: 4,
  },
});

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  closeBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17, fontFamily: 'PlusJakartaSans_700Bold', color: '#111827',
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20 },

  // Artista
  artistCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 16, padding: 16, marginBottom: 24, gap: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  artistMini: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 12, padding: 12, marginBottom: 20, gap: 10,
    borderWidth: 1, borderColor: '#f0f0f0',
  },
  artistAvatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#e5e7eb' },
  miniAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#e5e7eb' },
  avatarFallback: { alignItems: 'center', justifyContent: 'center' },
  artistInfo: { flex: 1, gap: 2 },
  artistName: { fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: '#111827' },
  artistSub: { fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular', color: '#6b7280' },
  miniName: { fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: '#111827' },
  miniService: { fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', color: '#6b7280' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingText: { fontSize: 12, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#374151' },

  // Inputs
  label: {
    fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold',
    color: '#374151', marginBottom: 10, letterSpacing: 0.2,
  },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb',
    paddingHorizontal: 14, marginBottom: 20, minHeight: 48,
  },
  input: {
    flex: 1, fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular',
    color: '#111827', paddingVertical: 0,
  },

  // Servicios
  emptyServices: { alignItems: 'center', paddingVertical: 24, gap: 8, marginBottom: 20 },
  emptyServicesText: {
    fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular',
    color: '#9ca3af', textAlign: 'center', lineHeight: 18,
  },
  servicesRow: { flexDirection: 'row', gap: 10, paddingBottom: 4, marginBottom: 12 },
  serviceChip: {
    minWidth: 110, maxWidth: 160, backgroundColor: '#fff', borderRadius: 14,
    padding: 14, borderWidth: 1.5, borderColor: '#e5e7eb', gap: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  serviceChipSel: { borderColor: '#7c3aed', backgroundColor: '#f5f3ff' },
  chipName: { fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#374151', lineHeight: 17 },
  chipNameSel: { color: '#6d28d9' },
  chipPrice: { fontSize: 12, fontFamily: 'PlusJakartaSans_700Bold', color: '#6b7280' },
  chipPriceSel: { color: '#7c3aed' },
  serviceDesc: {
    backgroundColor: '#f9fafb', borderRadius: 10, padding: 12, marginBottom: 20,
    borderWidth: 1, borderColor: '#f0f0f0',
  },
  serviceDescText: { fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular', color: '#6b7280', lineHeight: 18 },
  basePriceRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#f5f3ff', borderRadius: 10, padding: 12, marginBottom: 20,
  },
  basePriceLabel: { fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular', color: '#6b7280' },
  basePriceValue: { fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: '#7c3aed' },

  // Checkout breakdown
  breakdown: {
    backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 24,
    gap: 12, borderWidth: 1, borderColor: '#f0f0f0',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  breakdownTitle: { fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: '#111827' },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  breakdownLabel: { fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular', color: '#6b7280' },
  breakdownValue: { fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#374151' },
  divider: { height: 1, backgroundColor: '#f3f4f6' },
  totalLabel: { fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: '#111827' },
  totalValue: { fontSize: 18, fontFamily: 'PlusJakartaSans_700Bold', color: '#7c3aed' },
  feeInfo: {
    flexDirection: 'row', gap: 8, alignItems: 'flex-start',
    backgroundColor: '#f5f3ff', borderRadius: 10, padding: 10,
  },
  feeInfoText: {
    flex: 1, fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6b7280', lineHeight: 16,
  },

  // Tipo de servicio
  serviceTypeRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  typeChip: {
    flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 12,
    alignItems: 'center', gap: 4, borderWidth: 1.5, borderColor: '#e5e7eb',
  },
  typeChipSel: { borderColor: '#7c3aed', backgroundColor: '#f5f3ff' },
  typeLabel: { fontSize: 12, fontFamily: 'PlusJakartaSans_700Bold', color: '#6b7280' },
  typeLabelSel: { color: '#7c3aed' },
  typeDesc: {
    fontSize: 10, fontFamily: 'PlusJakartaSans_400Regular',
    color: '#9ca3af', textAlign: 'center', lineHeight: 13,
  },

  // Caja de pago seguro
  secureBox: {
    flexDirection: 'row', gap: 8, alignItems: 'flex-start',
    backgroundColor: '#f0fdf4', borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: '#bbf7d0', marginBottom: 20,
  },
  secureText: {
    flex: 1, fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular',
    color: '#065f46', lineHeight: 16,
  },

  // Términos
  termsText: {
    fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular',
    color: '#9ca3af', textAlign: 'center', marginTop: 10, lineHeight: 15,
  },
  termsLink: { color: '#7c3aed', fontFamily: 'PlusJakartaSans_600SemiBold' },

  // CTA
  cta: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: 20, paddingTop: 12,
    backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f0f0f0',
  },
  ctaBtn: {
    borderRadius: 16, overflow: 'hidden',
    shadowColor: '#7c3aed', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  ctaBtn2: {
    borderRadius: 16, overflow: 'hidden', marginBottom: 12,
    shadowColor: '#7c3aed', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  ctaGrad: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, paddingVertical: 16,
  },
  ctaLabel: { fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff', letterSpacing: 0.1 },
  secondaryBtn: {
    alignItems: 'center', paddingVertical: 14,
    borderRadius: 16, borderWidth: 1, borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  secondaryBtnText: { fontSize: 14, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#6b7280' },

  // Confirmación glassmorphism
  glassCard: {
    borderRadius: 24, padding: 24, marginBottom: 24, overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.15)',
    shadowColor: '#7c3aed', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12, shadowRadius: 24, elevation: 8,
    alignItems: 'center', gap: 12,
  },
  successIcon: {
    width: 72, height: 72, borderRadius: 36, overflow: 'hidden',
    shadowColor: '#7c3aed', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 8,
  },
  successIconGrad: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  successTitle: {
    fontSize: 24, fontFamily: 'PlusJakartaSans_700Bold', color: '#111827',
  },
  successSub: {
    fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6b7280', textAlign: 'center', lineHeight: 20,
  },
  nextSteps: {
    width: '100%', backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 14, padding: 14, gap: 10,
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.1)',
  },
  nextStepsTitle: {
    fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: '#374151', marginBottom: 4,
  },
  nextStep: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  stepDot: { width: 8, height: 8, borderRadius: 4, marginTop: 5 },
  stepText: {
    flex: 1, fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6b7280', lineHeight: 16,
  },
  codesTitle: {
    fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: '#111827', marginBottom: 4,
  },
  codesSub: {
    fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular',
    color: '#9ca3af', lineHeight: 16, marginBottom: 16,
  },
});
