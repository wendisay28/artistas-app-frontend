import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import BaseModal from './BaseModal';
import { stripeService } from '../../../../../services/api/stripe.service';

interface Props { visible: boolean; onClose: () => void; }

interface UploadedDocument {
  type: string;
  uri: string;
  name: string;
  mimeType: string;
  fileId?: string;
}

const DocumentsModal: React.FC<Props> = ({ visible, onClose }) => {
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDocument[]>([]);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});

  const uploadToStripe = async (doc: UploadedDocument) => {
    setUploading(prev => ({ ...prev, [doc.type]: true }));
    try {
      const { fileId } = await stripeService.uploadDocument(doc.uri, doc.name, doc.mimeType, doc.type);
      setUploadedDocs(prev =>
        prev.map(d => d.type === doc.type ? { ...d, fileId } : d)
      );
    } catch {
      Alert.alert('Error de carga', 'No se pudo subir el documento a Stripe. Intenta de nuevo.');
      // Remove doc so user can retry
      setUploadedDocs(prev => prev.filter(d => d.type !== doc.type));
    } finally {
      setUploading(prev => ({ ...prev, [doc.type]: false }));
    }
  };

  const pickPhoto = async (docType: string, useCamera: boolean) => {
    try {
      const { status } = useCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permiso requerido', useCamera
          ? 'Activa el acceso a la cámara en Ajustes.'
          : 'Activa el acceso a la galería en Ajustes.');
        return;
      }

      const result = useCamera
        ? await ImagePicker.launchCameraAsync({ quality: 0.85, allowsEditing: true, aspect: [4, 3] })
        : await ImagePicker.launchImageLibraryAsync({ quality: 0.85, allowsEditing: true, mediaTypes: ['images'] });

      if (!result.canceled && result.assets?.[0]) {
        const asset = result.assets[0];
        const doc: UploadedDocument = {
          type: docType,
          uri: asset.uri,
          name: `${docType}_${Date.now()}.jpg`,
          mimeType: 'image/jpeg',
        };
        setUploadedDocs(prev => [...prev.filter(d => d.type !== docType), doc]);
        await uploadToStripe(doc);
      }
    } catch {
      Alert.alert('Error', 'No se pudo cargar la foto.');
    }
  };

  const pickPDF = async (docType: string) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled && result.assets?.[0]) {
        const asset = result.assets[0];
        if (asset.size && asset.size > 5 * 1024 * 1024) {
          Alert.alert('Archivo muy grande', 'El archivo no debe superar los 5MB.');
          return;
        }
        const mimeType = asset.mimeType ?? 'application/pdf';
        const doc: UploadedDocument = {
          type: docType,
          uri: asset.uri,
          name: asset.name ?? `${docType}.pdf`,
          mimeType,
        };
        setUploadedDocs(prev => [...prev.filter(d => d.type !== docType), doc]);
        await uploadToStripe(doc);
      }
    } catch {
      Alert.alert('Error', 'No se pudo seleccionar el archivo.');
    }
  };

  const handlePhotoAction = (docType: string) => {
    Alert.alert('Subir foto', '¿Cómo quieres cargarla?', [
      { text: 'Cámara',   onPress: () => pickPhoto(docType, true)  },
      { text: 'Galería',  onPress: () => pickPhoto(docType, false) },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  const handleDocAction = (docType: string) => {
    Alert.alert('Subir documento', '¿Cómo quieres cargarlo?', [
      { text: 'PDF / Archivo', onPress: () => pickPDF(docType)          },
      { text: 'Foto',          onPress: () => pickPhoto(docType, false) },
      { text: 'Cámara',        onPress: () => pickPhoto(docType, true)  },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  const isUploaded   = (type: string) => uploadedDocs.some(d => d.type === type && d.fileId);
  const isUploading  = (type: string) => !!uploading[type];
  const getDoc       = (type: string) => uploadedDocs.find(d => d.type === type);

  return (
    <BaseModal
      visible={visible}
      onClose={onClose}
      title="Verificación de Identidad"
      subtitle="Requerido para procesar tus pagos de forma segura"
    >
      <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>

        {/* SECCIÓN 1: IDENTIDAD (FOTOS) */}
        <Text style={s.sectionTitle}>Documento de Identidad</Text>
        <Text style={s.hint}>Toma una foto clara donde se lean todos los datos.</Text>

        <View style={s.idCardContainer}>
          <View style={s.idHeader}>
            <Ionicons name="card-outline" size={20} color="#7c3aed" />
            <Text style={s.idHeaderText}>Cédula de Ciudadanía / Extranjería</Text>
          </View>

          <View style={s.photoRow}>
            {(['cedula_front', 'cedula_back'] as const).map((side) => {
              const uploaded = isUploaded(side);
              const loading  = isUploading(side);
              const doc      = getDoc(side);
              return (
                <TouchableOpacity
                  key={side}
                  style={[s.photoBox, uploaded && s.uploadedBox]}
                  onPress={() => handlePhotoAction(side)}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size={24} color="#7c3aed" />
                  ) : uploaded && doc ? (
                    <>
                      <Image source={{ uri: doc.uri }} style={s.previewImage} />
                      <View style={s.uploadedBadge}><Text style={s.uploadedBadgeText}>SUBIDO</Text></View>
                    </>
                  ) : (
                    <>
                      <View style={s.iconCircle}>
                        <Ionicons name="camera-outline" size={20} color="#7c3aed" />
                      </View>
                      <Text style={s.photoText}>{side === 'cedula_front' ? 'Lado Frontal' : 'Lado Posterior'}</Text>
                      <View style={s.miniBadge}><Text style={s.miniBadgeText}>SUBIR</Text></View>
                    </>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* SECCIÓN 2: DOCUMENTOS LEGALES (PDF/ARCHIVOS) */}
        <Text style={[s.sectionTitle, { marginTop: 20 }]}>Información Tributaria y Bancaria</Text>

        {([
          { type: 'rut',       label: 'RUT Persona Natural',  sub: 'Foto o imagen del RUT',          icon: 'document-text-outline', color: '#2563eb', bg: '#eff6ff' },
          { type: 'bank_cert', label: 'Certificado Bancario', sub: 'Vigencia no mayor a 30 días',    icon: 'business-outline',      color: '#16a34a', bg: '#f0fdf4' },
        ] as const).map(({ type, label, sub, icon, color, bg }) => {
          const uploaded  = isUploaded(type);
          const loading   = isUploading(type);
          return (
            <TouchableOpacity
              key={type}
              style={[s.fileRow, uploaded && s.uploadedFileRow]}
              onPress={() => handleDocAction(type)}
              disabled={loading}
            >
              <View style={[s.fileIconBg, { backgroundColor: uploaded ? '#dcfce7' : bg }]}>
                {loading
                  ? <ActivityIndicator size={22} color={color} />
                  : <Ionicons name={uploaded ? 'checkmark-circle' : (icon as any)} size={22} color={uploaded ? '#16a34a' : color} />
                }
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.rowLabel}>{label}</Text>
                <Text style={s.rowSub}>{uploaded ? '✓ Documento enviado a Stripe' : loading ? 'Subiendo...' : sub}</Text>
              </View>
              <Ionicons name={uploaded ? 'checkmark-circle' : 'add-circle-outline'} size={24} color={uploaded ? '#16a34a' : color} />
            </TouchableOpacity>
          );
        })}

        {/* FOOTER DE SEGURIDAD */}
        <View style={s.securityNotice}>
          <Ionicons name="shield-checkmark" size={16} color="#059669" />
          <Text style={s.securityText}>
            Tus documentos son procesados directamente por Stripe. BuscArt no almacena copias de tus identificaciones.
          </Text>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </BaseModal>
  );
};

export default DocumentsModal;

const s = StyleSheet.create({
  body: { paddingHorizontal: 20, paddingTop: 10 },
  sectionTitle: { fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b', marginBottom: 4 },
  hint:         { fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(30,27,75,0.5)', marginBottom: 16 },

  idCardContainer: {
    backgroundColor: '#fff', borderRadius: 24, padding: 16,
    borderWidth: 1.5, borderColor: '#f1f5f9',
    shadowColor: '#7c3aed', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05, shadowRadius: 15, elevation: 3,
  },
  idHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginBottom: 16, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: '#f1f5f9',
  },
  idHeaderText: { fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#4c1d95' },
  photoRow: { flexDirection: 'row', gap: 12 },
  photoBox: {
    flex: 1, height: 120,
    backgroundColor: '#faf5ff', borderRadius: 18,
    borderWidth: 1, borderColor: '#e9d5ff', borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  iconCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#7c3aed', shadowOpacity: 0.1, shadowRadius: 4,
  },
  photoText:    { fontSize: 11, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#6d28d9' },
  miniBadge:    { backgroundColor: '#7c3aed', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, position: 'absolute', top: -8 },
  miniBadgeText:{ fontSize: 9, color: '#fff', fontWeight: '800' },
  uploadedBox:  { borderColor: '#16a34a', backgroundColor: '#f0fdf4', borderStyle: 'solid' },
  previewImage: { width: '100%', height: '100%', borderRadius: 12 },
  uploadedBadge:{ backgroundColor: '#16a34a', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, position: 'absolute', top: -8 },
  uploadedBadgeText: { fontSize: 9, color: '#fff', fontWeight: '800' },
  uploadedFileRow: { borderColor: '#16a34a', backgroundColor: '#f0fdf4' },

  fileRow: {
    flexDirection: 'row', alignItems: 'center', padding: 16,
    backgroundColor: '#fff', borderRadius: 20,
    borderWidth: 1, borderColor: '#f1f5f9', marginTop: 10, gap: 12,
  },
  fileIconBg: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  rowLabel:   { fontSize: 13.5, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b' },
  rowSub:     { fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(30,27,75,0.4)', marginTop: 2 },

  securityNotice: {
    flexDirection: 'row', gap: 10,
    backgroundColor: '#f0fdf4', padding: 16, borderRadius: 18,
    marginTop: 24, borderWidth: 1, borderColor: '#dcfce7',
  },
  securityText: { fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular', color: '#166534', flex: 1, lineHeight: 16 },
});
