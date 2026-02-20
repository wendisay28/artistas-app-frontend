// Formulario de artista con regla del 80%. Campos: foto 20%, nombre 15%, categoría 20%,
// descripción 15%, ciudad 10%, 1 foto de trabajo 20%. Al llegar a 80% se habilita "Publicar perfil".
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../../../constants/colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuthStore } from '../../../store/authStore';
import { ArtistCategorySelector, type ArtistCategorySelection } from '../../../components/profile/shared/CategorySelector';
import { updateUserProfile, updateArtistProfile } from '../../../services/api/profile';
import type { AuthStackParams } from '../../../navigation/AuthStack';

const WEIGHTS = {
  photo: 20,
  name: 15,
  category: 20,
  description: 15,
  city: 10,
  workPhoto: 20,
} as const;
const TOTAL = 100;
const MIN_VISIBLE_PERCENT = 80;

type Props = NativeStackScreenProps<AuthStackParams, 'ArtistForm'>;

function useArtistForm(initialCity: string) {
  const [photoURI, setPhotoURI] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [category, setCategory] = useState<ArtistCategorySelection | undefined>();
  const [description, setDescription] = useState('');
  const [city, setCity] = useState(initialCity);
  const [workPhotoURI, setWorkPhotoURI] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const percent = Math.min(
    TOTAL,
    (photoURI ? WEIGHTS.photo : 0) +
      (displayName.trim().length >= 2 ? WEIGHTS.name : 0) +
      (category?.categoryId && category?.disciplineId && category?.roleId ? WEIGHTS.category : 0) +
      (description.trim().length >= 20 ? WEIGHTS.description : 0) +
      (city.trim().length >= 2 ? WEIGHTS.city : 0) +
      (workPhotoURI ? WEIGHTS.workPhoto : 0)
  );

  const canPublish = percent >= MIN_VISIBLE_PERCENT;

  const pickPhoto = useCallback(async (forWork: boolean) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso', 'Necesitamos acceso a tu galería.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: forWork ? [4, 3] : [1, 1],
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      if (forWork) setWorkPhotoURI(result.assets[0].uri);
      else setPhotoURI(result.assets[0].uri);
    }
  }, []);

  return {
    photoURI,
    displayName,
    setDisplayName,
    category,
    setCategory,
    description,
    setDescription,
    city,
    setCity,
    workPhotoURI,
    percent,
    canPublish,
    isSubmitting,
    setIsSubmitting,
    pickPhoto,
  };
}

export const ArtistFormScreen: React.FC<Props> = ({ navigation }) => {
  const { user, isAuthenticated, setUser, setProfileComplete, tempUser } = useAuthStore();
  const initialCity = tempUser?.location?.city ?? user?.city ?? '';
  const {
    photoURI,
    displayName,
    setDisplayName,
    category,
    setCategory,
    description,
    setDescription,
    city,
    setCity,
    workPhotoURI,
    percent,
    canPublish,
    isSubmitting,
    setIsSubmitting,
    pickPhoto,
  } = useArtistForm(initialCity);

  const handlePublish = useCallback(async () => {
    if (!canPublish || !isAuthenticated) return;
    setIsSubmitting(true);
    try {
      const name = displayName.trim() || user?.displayName || '';
      const [firstName, ...rest] = name.split(/\s+/);
      const lastName = rest.join(' ') || undefined;
      await updateUserProfile({
        firstName: firstName || undefined,
        lastName,
        city: city.trim() || undefined,
        profileImageUrl: photoURI || undefined,
      });
      await updateArtistProfile({
        artistName: name || undefined,
        stageName: name || undefined,
        description: description.trim() || undefined,
        categoryId: category?.categoryId,
        disciplineId: category?.disciplineId,
        roleId: category?.roleId,
      });
      setUser({
        ...user!,
        displayName: name || user!.displayName,
        city: city.trim() || user!.city,
        photoURL: photoURI || user!.photoURL,
        isProfileComplete: true,
      });
      setProfileComplete(true);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'No se pudo publicar tu perfil. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  }, [canPublish, isAuthenticated, displayName, description, city, photoURI, category, user, setUser, setProfileComplete]);

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <Ionicons name="color-palette" size={48} color={colors.primary} />
          </View>
          <Text style={styles.title}>Perfil de artista</Text>
          <Text style={styles.subtitle}>
            Inicia sesión para completar tu perfil y mostrarte a clientes cerca de ti.
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.buttonText}>Iniciar sesión</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.progressWrap}>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${percent}%` }]} />
        </View>
        <Text style={styles.progressLabel}>{percent}%</Text>
      </View>

      {percent < MIN_VISIBLE_PERCENT && (
        <View style={styles.banner}>
          <Ionicons name="eye-off-outline" size={18} color={colors.primary} />
          <Text style={styles.bannerText}>
            Tu perfil no es visible aún — falta {MIN_VISIBLE_PERCENT - percent}%
          </Text>
        </View>
      )}

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 16 : 0}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionLabel}>Foto de perfil (20%)</Text>
          <TouchableOpacity style={styles.avatarWrap} onPress={() => pickPhoto(false)} activeOpacity={0.8}>
            {photoURI ? (
              <Image source={{ uri: photoURI }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <Ionicons name="person-add" size={32} color={colors.textSecondary} />
              </View>
            )}
          </TouchableOpacity>

          <Text style={styles.sectionLabel}>Nombre artístico (15%)</Text>
          <TextInput
            style={styles.input}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Tu nombre artístico o el que quieras mostrar"
            placeholderTextColor={colors.textSecondary}
            maxLength={50}
            autoCapitalize="words"
          />

          <Text style={styles.sectionLabel}>Categoría (20%)</Text>
          <View style={styles.categoryWrap}>
            <ArtistCategorySelector selection={category} onChange={setCategory} />
          </View>

          <Text style={styles.sectionLabel}>Descripción (15%) — al menos 20 caracteres</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Cuéntanos sobre tu trabajo y tu estilo..."
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={4}
            maxLength={500}
          />

          <Text style={styles.sectionLabel}>Ciudad (10%)</Text>
          <TextInput
            style={styles.input}
            value={city}
            onChangeText={setCity}
            placeholder="Ej: Medellín"
            placeholderTextColor={colors.textSecondary}
            maxLength={80}
          />

          <Text style={styles.sectionLabel}>1 foto de trabajo (20%)</Text>
          <TouchableOpacity style={styles.workPhotoWrap} onPress={() => pickPhoto(true)} activeOpacity={0.8}>
            {workPhotoURI ? (
              <Image source={{ uri: workPhotoURI }} style={styles.workPhoto} />
            ) : (
              <View style={styles.workPhotoFallback}>
                <Ionicons name="images-outline" size={40} color={colors.textSecondary} />
                <Text style={styles.workPhotoHint}>Añade al menos una obra</Text>
              </View>
            )}
          </TouchableOpacity>

          <Text style={styles.incentive}>
            Los artistas con perfil completo reciben 3x más contactos.
          </Text>

          <TouchableOpacity
            style={[styles.publishBtn, (!canPublish || isSubmitting) && styles.publishBtnDisabled]}
            onPress={handlePublish}
            disabled={!canPublish || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.publishBtnText}>Publicar perfil</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  progressWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 12,
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.borderLight,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressLabel: { fontSize: 14, fontWeight: '600', color: colors.text },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentLight || '#EDE9FE',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginHorizontal: 24,
    borderRadius: 10,
    gap: 8,
    marginBottom: 8,
  },
  bannerText: { fontSize: 13, color: colors.primary, fontWeight: '500' },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: 20,
    marginBottom: 8,
  },
  avatarWrap: { alignSelf: 'center', marginBottom: 8 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  avatarFallback: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surfaceAlt || '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
  },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  categoryWrap: { marginBottom: 8 },
  workPhotoWrap: { marginTop: 4 },
  workPhoto: { width: '100%', aspectRatio: 4 / 3, borderRadius: 12 },
  workPhotoFallback: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 12,
    backgroundColor: colors.surfaceAlt || '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  workPhotoHint: { fontSize: 13, color: colors.textSecondary, marginTop: 8 },
  incentive: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  publishBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  publishBtnDisabled: { backgroundColor: colors.textLight || '#9CA3AF', opacity: 0.8 },
  publishBtnText: { fontSize: 16, fontWeight: '700', color: '#FFF' },
  container: { flex: 1, paddingHorizontal: 24, justifyContent: 'center', alignItems: 'center' },
  iconContainer: { marginBottom: 24 },
  title: { fontSize: 22, fontWeight: '700', color: colors.text, textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 15, color: colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  button: { backgroundColor: colors.primary, paddingHorizontal: 32, paddingVertical: 16, borderRadius: 12 },
  buttonText: { fontSize: 16, fontWeight: '600', color: '#FFF' },
});
