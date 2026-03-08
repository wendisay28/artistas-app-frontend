import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import BaseModal from './BaseModal';
import { stripeService } from '../../../../../services/api/stripe.service';

interface Props { visible: boolean; onClose: () => void; }

const DOC_OPTIONS = [
  { icon: 'business-outline',        label: 'RUT',                docType: 'rut',              sub: 'Registro Único Tributario (Colombia)' },
  { icon: 'document-text-outline',   label: 'NIT',                docType: 'nit',              sub: 'Número de Identificación Tributaria' },
  { icon: 'newspaper-outline',       label: 'Escritura social',   docType: 'escritura_social', sub: 'Documento de constitución de empresa' },
  { icon: 'receipt-outline',         label: 'Cámara de comercio', docType: 'camara_comercio',  sub: 'Registro mercantil vigente' },
] as const;

const CompanyDocsModal: React.FC<Props> = ({ visible, onClose }) => {
  const [uploaded,  setUploaded]  = useState<Record<string, string>>({});   // docType → fileId
  const [uploading, setUploading] = useState<Record<string, boolean>>({});

  const uploadToStripe = async (uri: string, name: string, mimeType: string, docType: string) => {
    setUploading(prev => ({ ...prev, [docType]: true }));
    try {
      const { fileId } = await stripeService.uploadDocument(uri, name, mimeType, docType);
      setUploaded(prev => ({ ...prev, [docType]: fileId }));
      Alert.alert('Subido', 'Documento enviado a Stripe correctamente.');
    } catch {
      Alert.alert('Error', 'No se pudo subir el documento. Intenta de nuevo.');
    } finally {
      setUploading(prev => ({ ...prev, [docType]: false }));
    }
  };

  const handleUpload = (docType: string, label: string) => {
    Alert.alert(`Subir ${label}`, '¿Cómo quieres cargar el documento?', [
      {
        text: 'PDF / Archivo',
        onPress: async () => {
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
              await uploadToStripe(asset.uri, asset.name ?? `${docType}.pdf`, asset.mimeType ?? 'application/pdf', docType);
            }
          } catch {
            Alert.alert('Error', 'No se pudo seleccionar el archivo.');
          }
        },
      },
      {
        text: 'Foto / Cámara',
        onPress: async () => {
          try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') { Alert.alert('Permiso requerido', 'Activa el acceso a la cámara.'); return; }
            const result = await ImagePicker.launchCameraAsync({ quality: 0.85, allowsEditing: true });
            if (!result.canceled && result.assets?.[0]) {
              const asset = result.assets[0];
              await uploadToStripe(asset.uri, `${docType}_${Date.now()}.jpg`, 'image/jpeg', docType);
            }
          } catch {
            Alert.alert('Error', 'No se pudo tomar la foto.');
          }
        },
      },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  return (
    <BaseModal visible={visible} onClose={onClose} title="Documentos de empresa" subtitle="RUT, NIT o escritura social">
      <View style={s.body}>
        <Text style={s.hint}>Solo si estás registrado como empresa o autónomo:</Text>
        {DOC_OPTIONS.map((doc) => {
          const isDone    = !!uploaded[doc.docType];
          const isLoading = !!uploading[doc.docType];
          return (
            <TouchableOpacity
              key={doc.docType}
              onPress={() => handleUpload(doc.docType, doc.label)}
              activeOpacity={0.75}
              style={[s.row, isDone && s.rowDone]}
              disabled={isLoading}
            >
              <View style={[s.iconWrap, { backgroundColor: isDone ? '#dcfce7' : 'rgba(37,99,235,0.08)' }]}>
                {isLoading
                  ? <ActivityIndicator size={20} color="#2563eb" />
                  : <Ionicons name={isDone ? 'checkmark-circle' : (doc.icon as any)} size={20} color={isDone ? '#16a34a' : '#2563eb'} />
                }
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.rowLabel}>{doc.label}</Text>
                <Text style={s.rowSub}>{isDone ? '✓ Enviado a Stripe' : isLoading ? 'Subiendo...' : doc.sub}</Text>
              </View>
              <View style={[s.uploadBadge, isDone && s.uploadBadgeDone]}>
                <Ionicons name={isDone ? 'checkmark' : 'cloud-upload-outline'} size={14} color={isDone ? '#16a34a' : '#2563eb'} />
                <Text style={[s.uploadText, isDone && s.uploadTextDone]}>{isDone ? 'Listo' : 'Subir'}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </BaseModal>
  );
};

export default CompanyDocsModal;

const s = StyleSheet.create({
  body:       { paddingHorizontal: 20, paddingTop: 14, gap: 10 },
  hint:       { fontSize: 12.5, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(109,40,217,0.5)', marginBottom: 4 },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 14, backgroundColor: '#f5f8ff',
    borderRadius: 14, borderWidth: 1, borderColor: 'rgba(37,99,235,0.12)',
  },
  rowDone: { backgroundColor: '#f0fdf4', borderColor: 'rgba(22,163,74,0.2)' },
  iconWrap:   { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  rowLabel:   { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b' },
  rowSub:     { fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(37,99,235,0.5)', marginTop: 1 },
  uploadBadge:    { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(37,99,235,0.08)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5 },
  uploadBadgeDone:{ backgroundColor: 'rgba(22,163,74,0.1)' },
  uploadText:     { fontSize: 11, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#2563eb' },
  uploadTextDone: { color: '#16a34a' },
});
