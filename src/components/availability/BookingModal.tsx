import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { availabilityApi, CreateBookingRequest } from '../../services/api/availability';
import { useAuthStore } from '../../store/authStore';
import { Colors, Radius, Spacing } from '../../theme';

interface BookingModalProps {
  visible: boolean;
  onClose: () => void;
  artistId: number;
  artistName: string;
  selectedDate: string;
  selectedTime: string;
  onSuccess: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  visible,
  onClose,
  artistId,
  artistName,
  selectedDate,
  selectedTime,
  onSuccess,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [clientNotes, setClientNotes] = useState('');
  const [locationType, setLocationType] = useState<'online' | 'client_place' | 'artist_place' | 'venue'>('online');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);

  const { user } = useAuthStore();

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Por favor ingresa un título para la reserva');
      return;
    }

    if (!selectedDate || !selectedTime) {
      Alert.alert('Error', 'Fecha y hora son requeridas');
      return;
    }

    // Calcular hora de finalización (1 hora después por defecto)
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const endHours = hours + 1;
    const endTime = `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    setLoading(true);

    try {
      const bookingData: CreateBookingRequest = {
        artistId,
        date: selectedDate,
        startTime: selectedTime,
        endTime,
        title: title.trim(),
        description: description.trim() || undefined,
        clientNotes: clientNotes.trim() || undefined,
        locationType,
        location: location.trim() || undefined,
        price: price.trim() || undefined,
      };

      const token = await user?.getIdToken();
      if (!token) {
        throw new Error('No autenticado');
      }

      await availabilityApi.createBooking(bookingData, token);
      
      Alert.alert(
        '¡Reserva creada!',
        'Tu reserva ha sido enviada y está pendiente de confirmación por el artista.',
        [
          {
            text: 'OK',
            onPress: () => {
              onSuccess();
              handleClose();
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'No se pudo crear la reserva'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form
    setTitle('');
    setDescription('');
    setClientNotes('');
    setLocationType('online');
    setLocation('');
    setPrice('');
    onClose();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('es-ES', options);
  };

  const locationOptions = [
    { key: 'online', label: 'En línea', icon: 'globe-outline' },
    { key: 'client_place', label: 'En mi domicilio', icon: 'home-outline' },
    { key: 'artist_place', label: 'En domicilio del artista', icon: 'business-outline' },
    { key: 'venue', label: 'En otro lugar', icon: 'location-outline' },
  ] as const;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Nueva Reserva</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Artist Info */}
          <View style={styles.artistInfo}>
            <View style={styles.artistAvatar}>
              <Ionicons name="person-outline" size={24} color={Colors.primary} />
            </View>
            <View>
              <Text style={styles.artistName}>{artistName}</Text>
              <Text style={styles.dateTime}>
                {formatDate(selectedDate)} a las {selectedTime}
              </Text>
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Title */}
            <View style={styles.field}>
              <Text style={styles.label}>Título del evento *</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Ej: Sesión de fotos, Presentación, etc."
                placeholderTextColor={Colors.textMuted}
              />
            </View>

            {/* Description */}
            <View style={styles.field}>
              <Text style={styles.label}>Descripción</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Describe los detalles del evento..."
                placeholderTextColor={Colors.textMuted}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Location Type */}
            <View style={styles.field}>
              <Text style={styles.label}>Tipo de ubicación</Text>
              <View style={styles.locationOptions}>
                {locationOptions.map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.locationOption,
                      locationType === option.key && styles.selectedLocation,
                    ]}
                    onPress={() => setLocationType(option.key)}
                  >
                    <Ionicons 
                      name={option.icon} 
                      size={20} 
                      color={locationType === option.key ? Colors.white : Colors.text} 
                    />
                    <Text style={[
                      styles.locationOptionText,
                      locationType === option.key && styles.selectedLocationText,
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Location (if not online) */}
            {locationType !== 'online' && (
              <View style={styles.field}>
                <Text style={styles.label}>Dirección</Text>
                <TextInput
                  style={styles.input}
                  value={location}
                  onChangeText={setLocation}
                  placeholder="Ingresa la dirección completa"
                  placeholderTextColor={Colors.textMuted}
                />
              </View>
            )}

            {/* Price */}
            <View style={styles.field}>
              <Text style={styles.label}>Presupuesto (opcional)</Text>
              <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                placeholder="0.00"
                placeholderTextColor={Colors.textMuted}
                keyboardType="numeric"
              />
            </View>

            {/* Client Notes */}
            <View style={styles.field}>
              <Text style={styles.label}>Notas para el artista</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={clientNotes}
                onChangeText={setClientNotes}
                placeholder="Información adicional que el artista debería conocer..."
                placeholderTextColor={Colors.textMuted}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleClose}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <Text style={styles.submitButtonText}>Enviar Reserva</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  artistInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  artistAvatar: {
    width: 48,
    height: 48,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface2,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  artistName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  dateTime: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 2,
  },
  form: {
    gap: Spacing.lg,
  },
  field: {
    gap: Spacing.xs,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 14,
    color: Colors.text,
  },
  textArea: {
    minHeight: 80,
    paddingTop: Spacing.sm,
  },
  locationOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  locationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  selectedLocation: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  locationOptionText: {
    fontSize: 12,
    color: Colors.text,
  },
  selectedLocationText: {
    color: Colors.white,
  },
  footer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  button: {
    flex: 1,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  submitButton: {
    backgroundColor: Colors.primary,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
});
