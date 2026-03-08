import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ScrollView, KeyboardAvoidingView, 
  Platform, Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const NewInvoiceScreen = ({ navigation }: any) => {
  const [step, setStep] = useState(0);
  const insets = useSafeAreaInsets();

  const STEPS = ['Tus Datos', 'Cliente', 'Detalles'];

  const CustomField = ({ label, icon, ...props }: any) => (
    <View style={s.fieldWrapper}>
      <Text style={s.label}>{label}</Text>
      <View style={s.inputBox}>
        <Ionicons name={icon} size={18} color="#94a3b8" />
        <TextInput style={s.input} {...props} />
      </View>
    </View>
  );

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <View>
          <Text style={s.headerTitle}>Nueva Factura</Text>
          <Text style={s.headerSubtitle}>Paso {step + 1} de 3</Text>
        </View>
        <View style={s.placeholder} />
      </View>

      {/* Step Indicator */}
      <View style={s.stepIndicator}>
        {STEPS.map((label, i) => (
          <View key={label} style={s.stepItem}>
            <View style={[s.stepCircle, step >= i && s.stepCircleActive]}>
              <Text style={[s.stepNum, step >= i && s.stepNumActive]}>
                {step > i ? '✓' : i + 1}
              </Text>
            </View>
            <Text style={[s.stepLabel, step >= i && s.stepLabelActive]}>{label}</Text>
          </View>
        ))}
      </View>

      {/* Form Content */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={s.keyboardContainer}
      >
        <ScrollView 
          style={s.scrollView}
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={s.formCard}>
            {step === 0 && (
              <View>
                <Text style={s.sectionTitle}>Tus Datos como Artista</Text>
                <CustomField label="Nombre Artístico / Razón Social" icon="person-outline" placeholder="Ej: Juan Pérez" />
                <CustomField label="NIT o Cédula" icon="id-card-outline" placeholder="900.123.456-7" keyboardType="numeric" />
                <CustomField label="Email" icon="mail-outline" placeholder="tu@email.com" keyboardType="email-address" />
                <CustomField label="Teléfono" icon="call-outline" placeholder="+57 300 000 0000" keyboardType="phone-pad" />
                <CustomField label="Banco" icon="business-outline" placeholder="Bancolombia, Nequi..." />
                <CustomField label="Número de cuenta" icon="wallet-outline" placeholder="000-000000-00" />
              </View>
            )}

            {step === 1 && (
              <View>
                <Text style={s.sectionTitle}>Datos del Cliente</Text>
                <CustomField label="Nombre del Cliente" icon="briefcase-outline" placeholder="Empresa o Persona" />
                <CustomField label="NIT o Cédula" icon="id-card-outline" placeholder="900.000.000-0" keyboardType="numeric" />
                <CustomField label="Email" icon="mail-outline" placeholder="cliente@correo.com" keyboardType="email-address" />
                <CustomField label="Teléfono" icon="call-outline" placeholder="+57 300 000 0000" keyboardType="phone-pad" />
                <CustomField label="Dirección" icon="location-outline" placeholder="Cra 123 #45-67" />
              </View>
            )}

            {step === 2 && (
              <View>
                <Text style={s.sectionTitle}>Detalles del Servicio</Text>
                
                {/* Item Card */}
                <View style={s.itemCard}>
                  <Text style={s.itemTitle}>Ítem 1</Text>
                  <TextInput 
                    style={s.descInput} 
                    placeholder="Descripción del servicio (ej: Diseño de logo corporativo)"
                    multiline
                  />
                  <View style={s.row}>
                    <TextInput 
                      style={[s.smallInput, { flex: 1 }]} 
                      placeholder="Cant." 
                      keyboardType="numeric"
                    />
                    <TextInput 
                      style={[s.smallInput, { flex: 2, marginLeft: 10 }]} 
                      placeholder="Precio unitario ($)" 
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                {/* Add Item Button */}
                <TouchableOpacity style={s.addItemBtn}>
                  <Ionicons name="add-circle-outline" size={20} color="#6366f1" />
                  <Text style={s.addItemText}>Agregar otro ítem</Text>
                </TouchableOpacity>

                {/* Total Summary */}
                <View style={s.summaryCard}>
                  <View style={s.summaryRow}>
                    <Text style={s.summaryLabel}>Subtotal</Text>
                    <Text style={s.summaryValue}>$0</Text>
                  </View>
                  <View style={s.summaryRow}>
                    <Text style={s.summaryLabel}>IVA (19%)</Text>
                    <Text style={s.summaryValue}>$0</Text>
                  </View>
                  <View style={s.summaryDivider} />
                  <View style={s.summaryRow}>
                    <Text style={s.summaryTotalLabel}>Total</Text>
                    <Text style={s.summaryTotalValue}>$0</Text>
                  </View>
                </View>

                {/* Notes */}
                <CustomField 
                  label="Notas adicionales (opcional)" 
                  icon="chatbox-ellipses-outline" 
                  placeholder="Condiciones de pago, observaciones..."
                  multiline
                />
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Fixed Footer */}
      <View style={s.footer}>
        <View style={s.buttonRow}>
          {step > 0 && (
            <TouchableOpacity 
              style={s.backButton} 
              onPress={() => setStep(step - 1)}
            >
              <Text style={s.backButtonText}>Atrás</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={[s.nextButton, { flex: step > 0 ? 1 : 0 }]} 
            onPress={() => step < 2 ? setStep(step + 1) : handleCreateInvoice()}
          >
            <LinearGradient colors={['#6366f1', '#4f46e5']} style={s.gradient}>
              <Text style={s.nextButtonText}>
                {step === 2 ? 'Crear Factura' : 'Siguiente'}
              </Text>
              <Ionicons name={step === 2 ? 'checkmark' : 'chevron-forward'} size={18} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const handleCreateInvoice = () => {
    Alert.alert(
      "¡Factura Creada!",
      "La factura ha sido generada exitosamente",
      [
        { text: "OK", onPress: () => navigation.goBack() }
      ]
    );
  };
};

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 2,
  },
  placeholder: {
    width: 40,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  stepItem: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepCircleActive: {
    backgroundColor: '#6366f1',
  },
  stepNum: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748b',
  },
  stepNumActive: {
    color: '#fff',
  },
  stepLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
  },
  stepLabelActive: {
    color: '#6366f1',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 20,
  },
  fieldWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    marginLeft: 10,
    fontSize: 16,
    color: '#1e293b',
  },
  itemCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  descInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    fontSize: 14,
    marginBottom: 12,
    minHeight: 60,
  },
  row: {
    flexDirection: 'row',
  },
  smallInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    fontSize: 14,
  },
  addItemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
  },
  addItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
    marginLeft: 8,
  },
  summaryCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    color: '#94a3b8',
    fontSize: 14,
  },
  summaryValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 8,
  },
  summaryTotalLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  summaryTotalValue: {
    color: '#818cf8',
    fontSize: 20,
    fontWeight: '900',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  backButton: {
    width: 80,
    height: 50,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#64748b',
    fontWeight: '600',
  },
  nextButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradient: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default NewInvoiceScreen;
