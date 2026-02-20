// src/screens/home/index.tsx — Pantalla temporal de bienvenida
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { auth } from '../../services/firebase/config';
import TopBar from '../../components/shared/TopBar';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const firstName = auth.currentUser?.displayName?.split(' ')[0] ?? 'Artista';
  const [idea, setIdea] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (idea.trim().length === 0) return;
    setSubmitted(true);
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TopBar title="BuscArt" topInset={insets.top} />
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: 20, paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Saludo */}
        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>Hola, {firstName}</Text>
          <Text style={styles.wave}>👋</Text>
        </View>

        {/* Mensaje principal */}
        <View style={styles.heroCard}>
          <View style={styles.iconCircle}>
            <Ionicons name="sparkles" size={32} color={colors.primary} />
          </View>
          <Text style={styles.heroTitle}>
            Estamos trabajando en algo{'\n'}especial para ti
          </Text>
          <Text style={styles.heroSubtitle}>
            Muy pronto vas a poder descubrir artistas, eventos y espacios
            creativos cerca de ti. Mientras tanto, explora lo que ya tenemos
            disponible.
          </Text>
        </View>

        {/* Caja de ideas */}
        <View style={styles.ideaCard}>
          <Text style={styles.ideaTitle}>
            <Ionicons name="bulb-outline" size={16} color={colors.text} />
            {'  '}Puedes darnos ideas
          </Text>
          <Text style={styles.ideaSubtitle}>
            Tu opinión nos ayuda a construir la mejor experiencia para la
            comunidad creativa.
          </Text>

          {!submitted ? (
            <>
              <TextInput
                style={styles.ideaInput}
                placeholder="Cuéntanos qué te gustaría ver aquí..."
                placeholderTextColor={colors.textLight}
                multiline
                value={idea}
                onChangeText={setIdea}
                textAlignVertical="top"
              />
              <Pressable
                onPress={handleSubmit}
                disabled={idea.trim().length === 0}
                style={({ pressed }) => [
                  styles.submitBtn,
                  idea.trim().length === 0 && styles.submitBtnDisabled,
                  pressed && idea.trim().length > 0 && { opacity: 0.9, transform: [{ scale: 0.97 }] },
                ]}
              >
                <Ionicons name="send" size={16} color="#fff" />
                <Text style={styles.submitBtnText}>Enviar idea</Text>
              </Pressable>
            </>
          ) : (
            <View style={styles.thankYou}>
              <Ionicons name="checkmark-circle" size={28} color={colors.success} />
              <Text style={styles.thankYouText}>
                Gracias por tu idea, la tendremos en cuenta.
              </Text>
              <Pressable
                onPress={() => { setSubmitted(false); setIdea(''); }}
                style={styles.anotherBtn}
              >
                <Text style={styles.anotherBtnText}>Enviar otra idea</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Hint para explorar */}
        <Pressable style={styles.exploreHint}>
          <Ionicons name="compass-outline" size={18} color={colors.primary} />
          <Text style={styles.exploreHintText}>
            Mientras tanto, ve a Explorar para descubrir artistas
          </Text>
          <Ionicons name="arrow-forward" size={16} color={colors.primary} />
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  container: {
    paddingHorizontal: 20,
    gap: 20,
  },

  // greeting
  greetingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  greeting: {
    fontSize: 26,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.text,
  },
  wave: { fontSize: 26 },

  // hero
  heroCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary + '12',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 28,
  },
  heroSubtitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },

  // idea card
  ideaCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  ideaTitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.text,
  },
  ideaSubtitle: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
    lineHeight: 20,
  },
  ideaInput: {
    backgroundColor: colors.background,
    borderRadius: 14,
    padding: 14,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.text,
    minHeight: 100,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 4,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 14,
    height: 48,
    marginTop: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  submitBtnDisabled: {
    backgroundColor: colors.textLight,
    shadowOpacity: 0,
    elevation: 0,
  },
  submitBtnText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
  },

  // thank you state
  thankYou: {
    alignItems: 'center',
    gap: 10,
    paddingVertical: 16,
  },
  thankYouText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  anotherBtn: {
    marginTop: 4,
  },
  anotherBtnText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.primary,
  },

  // explore hint
  exploreHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.primary + '0a',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.primary + '20',
  },
  exploreHintText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.text,
  },
});
