// src/screens/portal/PortalAutorScreen.tsx
import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StatusBar, Switch, Alert, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { usePortalAutor } from './usePortalAutor';
import { PolicyModal } from './PortalPolicyModal';
import StripeSetupScreen from '../payments/StripeSetupScreen';
import { s } from './PortalStyles';

interface PortalAutorScreenProps {
  onClose: () => void;
}

export const PortalAutorScreen: React.FC<PortalAutorScreenProps> = ({ onClose }) => {
  const p = usePortalAutor(onClose);
  const [showStripeScreen, setShowStripeScreen] = React.useState(false);

  const handleStripePress = () => {
    setShowStripeScreen(true);
  };

  const handleStripeClose = () => {
    setShowStripeScreen(false);
    // Recargar el estado de Stripe al regresar
    p.loadStripeStatus?.();
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={onClose} style={s.closeBtn} activeOpacity={0.7}>
          <Ionicons name="close" size={22} color="#4c1d95" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Portal del Autor</Text>
        <View style={s.availRow}>
          <Text style={[s.availLabel, p.isAvailable && s.availOn]}>
            {p.isAvailable ? 'Disponible' : 'Ocupado'}
          </Text>
          <Switch
            value={p.isAvailable}
            onValueChange={p.setIsAvailable}
            trackColor={{ false: '#d1d5db', true: '#a78bfa' }}
            thumbColor={p.isAvailable ? '#7c3aed' : '#9ca3af'}
          />
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>

          {/* Hero */}
          <LinearGradient
            colors={p.profileActivated ? ['#10b981', '#059669'] : p.getColors()}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={s.hero}
          >
            <View style={{ flex: 1 }}>
              <Text style={s.heroSup}>{p.profileActivated ? '¡Perfil activo!' : 'Tu perfil está al'}</Text>
              <Text style={s.heroPct}>{p.completionPct}%</Text>
              <Text style={s.heroMsg}>{p.profileActivated ? 'Ya eres visible para clientes' : p.getMessage()}</Text>
            </View>
            <View style={s.heroCircle}>
              {p.profileActivated
                ? <Ionicons name="checkmark" size={32} color="#fff" />
                : <>
                    <Text style={s.heroCirclePct}>{p.doneSteps.length}/{p.completionSteps.length}</Text>
                    <Text style={s.heroCircleLbl}>pasos</Text>
                  </>
              }
            </View>
          </LinearGradient>

          {/* Progress bar */}
          <View style={s.progressWrap}>
            <View style={s.progressRow}>
              <Text style={s.progressLbl}>Progreso total</Text>
              <Text style={s.progressPts}>{p.completedPoints}/{p.totalPoints} pts</Text>
            </View>
            <View style={s.progressBg}>
              <LinearGradient colors={p.getColors()} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={[s.progressBar, { width: `${p.completionPct}%` as any }]} />
            </View>
          </View>

          {/* Inline bio editor */}
          {p.editingBio && (
            <View style={s.bioEditor}>
              <Text style={s.bioEditorTitle}>Tu descripción</Text>
              <TextInput
                style={s.bioInput}
                value={p.bioText}
                onChangeText={p.setBioText}
                multiline autoFocus
                placeholder="Cuéntales quién eres, qué arte haces, cuál es tu estilo..."
                placeholderTextColor="rgba(109,40,217,0.3)"
              />
              <View style={s.bioActions}>
                <TouchableOpacity onPress={() => p.setEditingBio(false)} style={s.bioCancel}>
                  <Text style={s.bioCancelTxt}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={p.handleSaveBio} disabled={p.bioSaving} style={s.bioSave}>
                  <LinearGradient colors={['#7c3aed', '#2563eb']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.bioSaveGrad}>
                    <Text style={s.bioSaveTxt}>{p.bioSaving ? 'Guardando...' : 'Guardar'}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Pending steps */}
          {p.pendingSteps.length > 0 && (
            <View style={s.section}>
              <Text style={s.sectionLbl}>Pendiente ({p.pendingSteps.length})</Text>
              {p.pendingSteps
                .filter(step => step.id !== 'delivery' && step.id !== 'legal' && step.id !== 'payment')
                .map((step) => (
                  <TouchableOpacity key={step.id} onPress={step.onAction} activeOpacity={0.82} style={s.stepCard}>
                    <View style={s.stepIcon}>
                      <Ionicons name={step.icon as any} size={20} color="#9333ea" />
                    </View>
                    <View style={s.stepBody}>
                      <Text style={s.stepLbl}>{step.label}</Text>
                      <Text style={s.stepDesc}>{step.description}</Text>
                    </View>
                    <View style={s.stepAction}>
                      <LinearGradient colors={['#7c3aed', '#2563eb']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.stepActionBtn}>
                        <Ionicons name={step.actionIcon as any} size={12} color="#fff" />
                        <Text style={s.stepActionTxt}>{step.actionLabel}</Text>
                      </LinearGradient>
                    </View>
                  </TouchableOpacity>
                ))}
            </View>
          )}

          {/* Done steps */}
          {p.doneSteps.length > 0 && (
            <View style={s.section}>
              <Text style={s.sectionLbl}>Completado ({p.doneSteps.length})</Text>
              {p.doneSteps.map((step) => (
                <View key={step.id} style={[s.stepCard, s.stepDone]}>
                  <View style={[s.stepIcon, s.stepIconDone]}>
                    <Ionicons name="checkmark" size={18} color="#10b981" />
                  </View>
                  <View style={s.stepBody}>
                    <Text style={[s.stepLbl, s.stepLblDone]}>{step.label}</Text>
                    <Text style={s.stepDesc}>{step.description}</Text>
                  </View>
                  <View style={s.pts}>
                    <Text style={[s.ptsTxt, s.ptsTxtDone]}>{step.points} pts</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Etiquetas */}
          <View style={s.section}>
            <View style={s.sectionHeader}>
              <Ionicons name="pricetags-outline" size={18} color="#7c3aed" />
              <Text style={s.sectionTitle}>Tus etiquetas</Text>
              <View style={s.tagCounter}>
                <Text style={s.tagCounterTxt}>{p.selectedTags.length}/3</Text>
              </View>
            </View>
            <Text style={s.sectionSub}>Máximo 3 etiquetas para que los clientes te encuentren</Text>

            <View style={s.tagsSelectedRow}>
              {p.selectedTags.length === 0 ? (
                <Text style={s.tagsEmptyHint}>Toca una sugerencia para agregar</Text>
              ) : p.selectedTags.map(tag => (
                <TouchableOpacity key={tag} onPress={() => p.toggleTag(tag)} style={s.tagSelected} activeOpacity={0.75}>
                  <Text style={s.tagSelectedTxt}>{tag}</Text>
                  <Ionicons name="close-circle" size={14} color="rgba(255,255,255,0.85)" />
                </TouchableOpacity>
              ))}
            </View>

            {p.selectedTags.length < 3 && (
              <View style={s.tagsSuggestBox}>
                <Text style={s.tagsSuggestLbl}>Sugeridas para tu categoría:</Text>
                <View style={s.tagsSuggestRow}>
                  {p.getTagSuggestions()
                    .filter(t => !p.selectedTags.includes(t))
                    .slice(0, 7)
                    .map(tag => (
                      <TouchableOpacity key={tag} onPress={() => p.toggleTag(tag)} style={s.tagSuggest} activeOpacity={0.75}>
                        <Text style={s.tagSuggestTxt}>+ {tag}</Text>
                      </TouchableOpacity>
                    ))}
                </View>
              </View>
            )}

            {p.selectedTags.length < 3 && (
              <View style={s.tagInputRow}>
                <TextInput
                  style={s.tagInput}
                  value={p.customTagInput}
                  onChangeText={p.setCustomTagInput}
                  placeholder="Escribe una etiqueta..."
                  placeholderTextColor="rgba(109,40,217,0.35)"
                  onSubmitEditing={p.handleAddCustomTag}
                  returnKeyType="done"
                  maxLength={25}
                />
                <TouchableOpacity
                  onPress={p.handleAddCustomTag}
                  disabled={!p.customTagInput.trim()}
                  style={[s.tagInputBtn, !p.customTagInput.trim() && s.tagInputBtnDisabled]}
                  activeOpacity={0.75}
                >
                  <Ionicons name="add" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            )}

            {p.selectedTags.length > 0 && (
              <TouchableOpacity onPress={p.handleSaveTags} disabled={p.tagsSaving} style={s.tagSaveBtn} activeOpacity={0.8}>
                <LinearGradient colors={['#7c3aed', '#2563eb']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.tagSaveBtnInner}>
                  <Text style={s.tagSaveTxt}>{p.tagsSaving ? 'Guardando...' : 'Guardar etiquetas'}</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>

          {/* Modo de entrega */}
          <View style={s.section}>
            <View style={s.sectionHeader}>
              <Ionicons name="cube-outline" size={18} color="#7c3aed" />
              <Text style={s.sectionTitle}>¿Cómo entregas tu arte?</Text>
            </View>
            <Text style={s.sectionSub}>Selecciona el modo en que trabajas con tus clientes</Text>
            <View style={s.deliveryGrid}>
              {p.DELIVERY_OPTIONS.map((opt) => {
                const active = p.deliveryMode === opt.id;
                return (
                  <TouchableOpacity key={opt.id} onPress={() => p.setDeliveryMode(opt.id)} activeOpacity={0.82} style={s.delivCard}>
                    {active ? (
                      <LinearGradient colors={['#7c3aed', '#2563eb']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.delivInner}>
                        <Ionicons name={opt.icon as any} size={24} color="#fff" />
                        <Text style={[s.delivLbl, s.delivLblActive]}>{opt.label}</Text>
                        <Text style={s.delivSubActive} numberOfLines={2}>{opt.sub}</Text>
                      </LinearGradient>
                    ) : (
                      <View style={s.delivInactive}>
                        <Ionicons name={opt.icon as any} size={24} color="rgba(124,58,237,0.5)" />
                        <Text style={s.delivLbl}>{opt.label}</Text>
                        <Text style={s.delivSub} numberOfLines={2}>{opt.sub}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Legal */}
          <View style={s.legalCard}>
            <View style={s.legalTop}>
              <LinearGradient colors={['#1e1b4b', '#4c1d95']} style={s.legalIcon}>
                <Ionicons name="shield-checkmark" size={20} color="#fff" />
              </LinearGradient>
              <View style={{ flex: 1 }}>
                <Text style={s.legalTitle}>Validación y Legal</Text>
                <Text style={s.legalSub}>Lee y acepta los 4 documentos para activar tu perfil</Text>
              </View>
            </View>

            {([
              { key: 'terms'       as const, value: p.acceptedTerms,       set: p.setAcceptedTerms,       label: 'Términos y condiciones' },
              { key: 'privacy'     as const, value: p.acceptedPrivacy,     set: p.setAcceptedPrivacy,     label: 'Política de privacidad' },
              { key: 'exclusivity' as const, value: p.acceptedExclusivity, set: p.setAcceptedExclusivity, label: 'Cláusula de No Exclusividad' },
              { key: 'age'         as const, value: p.acceptedAge,         set: p.setAcceptedAge,         label: 'Soy mayor de 18 años' },
            ]).map((item) => (
              <View key={item.key} style={s.checkRow}>
                <TouchableOpacity onPress={() => item.set(!item.value)} style={[s.checkbox, item.value && s.checkboxOn]}>
                  {item.value && <Ionicons name="checkmark" size={14} color="#fff" />}
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                  <Text style={[s.checkLbl, item.value && s.checkLblOn]}>{item.label}</Text>
                </View>
                <TouchableOpacity onPress={() => p.setOpenPolicy(item.key)} style={s.readBtn} activeOpacity={0.75}>
                  <Text style={s.readBtnTxt}>Leer</Text>
                  <Ionicons name="chevron-forward" size={12} color="#7c3aed" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Stripe card */}
          <View style={s.stripeCard}>
            <View style={s.stripeHeader}>
              <LinearGradient colors={p.stripeStatusColors()} style={s.stripeIcon}>
                <Ionicons name={p.stripeStatusIcon() as any} size={20} color="#fff" />
              </LinearGradient>
              <View style={{ flex: 1 }}>
                <Text style={s.stripeTitle}>{p.stripeStatusTitle()}</Text>
                <Text style={s.stripeSub}>{p.stripeStatusMessage()}</Text>
              </View>
              <TouchableOpacity onPress={handleStripePress} style={s.stripeManageBtn}>
                <Ionicons name="settings" size={18} color="#7c3aed" />
              </TouchableOpacity>
            </View>

            {p.stripeStatus === 'connected' && (
              <View style={s.stripeConnected}>
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                <Text style={s.stripeConnectedTxt}>Cuenta conectada • Listo para recibir pagos</Text>
                <View style={s.stripeBadges}>
                  <View style={s.stripeBadge}><Text style={s.stripeBadgeTxt}>Verificada</Text></View>
                  <View style={s.stripeBadge}><Text style={s.stripeBadgeTxt}>Activa</Text></View>
                </View>
              </View>
            )}
            {p.stripeStatus === 'pending' && (
              <View style={s.stripePending}>
                <Ionicons name="time" size={16} color="#f59e0b" />
                <Text style={s.stripePendingTxt}>Verificación en proceso • Revisa tu correo</Text>
                <View style={s.stripeBadges}>
                  <View style={[s.stripeBadge, s.stripeBadgeWarning]}><Text style={s.stripeBadgeTxt}>Pendiente</Text></View>
                </View>
              </View>
            )}
            {p.stripeStatus === 'restricted' && (
              <View style={s.stripeRestricted}>
                <Ionicons name="warning" size={16} color="#ef4444" />
                <Text style={s.stripeRestrictedTxt}>Cuenta restringida • Necesitas completar requisitos</Text>
                <View style={s.stripeBadges}>
                  <View style={[s.stripeBadge, s.stripeBadgeError]}><Text style={s.stripeBadgeTxt}>Restringida</Text></View>
                </View>
              </View>
            )}
            {p.stripeStatus === 'disconnected' && (
              <TouchableOpacity onPress={handleStripePress} activeOpacity={0.85} style={s.stripeConnectBtn}>
                <LinearGradient colors={['#635bff', '#4f46e5']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.stripeConnectBtnInner}>
                  <Ionicons name="card-outline" size={16} color="#fff" />
                  <Text style={s.stripeConnectTxt}>Conectar cuenta Stripe</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
            {p.stripeStatus === 'error' && (
              <TouchableOpacity onPress={handleStripePress} activeOpacity={0.85} style={s.stripeConnectBtn}>
                <LinearGradient colors={['#ef4444', '#dc2626']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.stripeConnectBtnInner}>
                  <Ionicons name="refresh" size={16} color="#fff" />
                  <Text style={s.stripeConnectTxt}>Reintentar conexión</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>

          {/* Activar perfil */}
          <TouchableOpacity
            onPress={() => {
              if (!p.canActivate) {
                Alert.alert('Perfil incompleto', `Completa el 100% de tu perfil para activarlo.\nActualmente llevas ${p.completionPct}%.`);
                return;
              }
              p.setProfileActivated(true);
              Alert.alert('¡Perfil activado!', 'Ya eres visible para clientes en Medellín. ¡Bienvenido!', [
                { text: 'Entendido', onPress: onClose },
              ]);
            }}
            disabled={p.profileActivated}
            activeOpacity={p.canActivate ? 0.88 : 1}
            style={s.activateWrap}
          >
            <LinearGradient
              colors={
                p.profileActivated ? ['#10b981', '#059669']
                : p.canActivate    ? ['#7c3aed', '#2563eb']
                :                    ['rgba(124,58,237,0.3)', 'rgba(37,99,235,0.3)']
              }
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={s.activateBtn}
            >
              <Ionicons name={p.profileActivated ? 'checkmark-circle' : 'rocket'} size={20} color="#fff" />
              <Text style={s.activateTxt}>
                {p.profileActivated ? 'Perfil activo' : 'Activar perfil de artista'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {!p.canActivate && !p.profileActivated && (
            <Text style={s.activateHint}>
              Necesitas el 100% para activar — te faltan {100 - p.completionPct} puntos
            </Text>
          )}

          <View style={s.tip}>
            <Ionicons name="bulb-outline" size={20} color="#f59e0b" />
            <Text style={s.tipTxt}>
              Un perfil completo recibe hasta <Text style={s.tipBold}>3× más solicitudes</Text> de clientes en tu zona.
            </Text>
          </View>
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Stripe Setup Screen Modal */}
      {showStripeScreen && (
        <StripeSetupScreen onClose={handleStripeClose} />
      )}

      {/* Policy Modal */}
      <PolicyModal
        policy={p.openPolicy}
        onClose={() => p.setOpenPolicy(null)}
        agencyAnswer={p.worksWithAgency}
        onAgencyAnswer={p.setWorksWithAgency}
        alreadyAccepted={
          p.openPolicy === 'terms'       ? p.acceptedTerms       :
          p.openPolicy === 'privacy'     ? p.acceptedPrivacy     :
          p.openPolicy === 'exclusivity' ? p.acceptedExclusivity :
          p.openPolicy === 'age'         ? p.acceptedAge         : false
        }
        onAccept={p.handleAcceptPolicy}
      />
    </SafeAreaView>
  );
};
