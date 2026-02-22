// SobreMiModal.tsx — Modal para editar sección "Sobre mí"
// descripción completa · experiencia · educación · website · contacto · redes sociales
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing } from '../../../theme';
import { Artist, ArtistCategorySelection, StudyDetail, WorkExperienceDetail, CertificationDetail, SocialLink } from '../types';
import { ArtistCategorySelector } from '../shared/CategorySelector';

// Importar componentes directamente desde SobreMiModals
import { BioSection } from './SobreMiModals/BioSection';
import { CategorySection } from './SobreMiModals/CategorySection';
import { EducationSection } from './SobreMiModals/EducationSection';
import { ExperienceSection } from './SobreMiModals/ExperienceSection';
import { SocialSection } from './SobreMiModals/SocialSection';
import { InfoProfesionalSection } from './SobreMiModals/InfoProfesionalSection';

// ── Tipos ─────────────────────────────────────────────────────────────────────

export type SobreMiData = {
  description: string;
  // Campos profesionales básicos
  yearsExperience: string;
  style: string;
  availability: string;
  responseTime: string;
  specialty: string;
  niche: string;
  category?: ArtistCategorySelection;
  // Campos adicionales para estudios y experiencia detallada
  studies: StudyDetail[];
  workExperience: WorkExperienceDetail[];
  certifications: CertificationDetail[];
};

type Props = {
  visible: boolean;
  artist: Artist;
  onClose: () => void;
  onSave: (data: SobreMiData) => void;
};

// ── Sub-componente: campo de formulario ───────────────────────────────────────

type FieldProps = {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  multiline?: boolean;
  maxLength?: number;
  hint?: string;
  prefix?: string;
  keyboardType?: 'default' | 'email-address' | 'url';
};

const Field: React.FC<FieldProps> = ({
  label, icon, value, onChangeText, placeholder,
  multiline, maxLength, hint, prefix, keyboardType = 'default',
}) => {
  const multilineStyle = multiline && f.inputMulti;
  const inputStyle = [f.input, multiline && { height: 120, textAlignVertical: 'top' as const }];
  
  return (
    <View style={f.wrap}>
      <View style={f.labelRow}>
        <Ionicons name={icon} size={14} color={Colors.primary} />
        <Text style={f.label}>{label}</Text>
        {maxLength && (
          <Text style={f.counter}>{value.length}/{maxLength}</Text>
        )}
      </View>
      <View style={[f.inputWrap, multilineStyle]}>
        {prefix ? <Text style={f.prefix}>{prefix}</Text> : null}
        <TextInput
          style={inputStyle}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.text3}
          multiline={multiline}
          maxLength={maxLength}
          keyboardType={keyboardType}
          autoCapitalize="none"
        />
      </View>
      {hint ? <Text style={f.hint}>{hint}</Text> : null}
    </View>
  );
};

const f = StyleSheet.create({
  wrap:       { gap: 6, marginBottom: 4 },
  labelRow:   { flexDirection: 'row', alignItems: 'center', gap: 6 },
  label:      { flex: 1, fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: Colors.text },
  counter:    { fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular', color: Colors.text3 },
  inputWrap:  {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    minHeight: 44,
  },
  inputMulti: { alignItems: 'flex-start', paddingVertical: 10 },
  prefix:     { fontSize: 14, color: Colors.text3, fontFamily: 'PlusJakartaSans_400Regular', marginRight: 2 },
  input:      { flex: 1, fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular', color: Colors.text },
  hint:       { fontSize: 11, color: Colors.text3, fontFamily: 'PlusJakartaSans_400Regular', marginTop: 2, paddingLeft: 2 },
});

// ── Componente principal ───────────────────────────────────────────────────────

export const SobreMiModal: React.FC<Props> = ({ visible, artist, onClose, onSave }) => {
  const [description, setDescription] = useState('');
  // Campos profesionales básicos
  const [yearsExperience, setYearsExperience] = useState('');
  const [style, setStyle] = useState('');
  const [availability, setAvailability] = useState('');
  const [responseTime, setResponseTime] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [niche, setNiche] = useState('');
  const [category, setCategory] = useState<ArtistCategorySelection | undefined>();

  // Estados para campos detallados
  const [studies, setStudies] = useState<StudyDetail[]>([]);

  const [workExperience, setWorkExperience] = useState<WorkExperienceDetail[]>([]);

  const [certifications, setCertifications] = useState<CertificationDetail[]>([]);

  // Pre-poblar al abrir
  useEffect(() => {
    if (visible) {
      // Descripción completa (campo nuevo)
      setDescription(artist.bio ?? '');
      
      // Info profesional básica
      const yearsExpInfo = artist.info?.find(i => i.label === 'Experiencia');
      const styleInfo = artist.info?.find(i => i.label === 'Estilo');
      const availabilityInfo = artist.info?.find(i => i.label === 'Disponibilidad');
      const responseTimeInfo = artist.info?.find(i => i.label === 'Tiempo de resp.');
      
      setYearsExperience(yearsExpInfo?.value ?? '');
      setStyle(styleInfo?.value ?? '');
      setAvailability(availabilityInfo?.value ?? '');
      setResponseTime(responseTimeInfo?.value ?? '');
      
      // Cargar specialty y niche
      setSpecialty(artist.specialty ?? '');
      setNiche(artist.niche ?? '');
      setCategory(artist.category);
      
      // Cargar arrays complejos desde el objeto artist
      // Si el artist tiene estas propiedades directamente, usarlas
      // Si no, intentar cargarlas desde info estructurada
      setStudies(artist.studies || []);
      setWorkExperience(artist.workExperience || []);
      setCertifications(artist.certifications || []);
      
      // Si no existen directamente, intentar parsear desde info
      if (!artist.studies || artist.studies.length === 0) {
        const studiesInfo = artist.info?.find(i => i.label === 'Estudios Detallados');
        if (studiesInfo?.value) {
          try {
            const parsedStudies = JSON.parse(studiesInfo.value);
            setStudies(Array.isArray(parsedStudies) ? parsedStudies : []);
          } catch (e) {
            console.log('Error parsing studies info:', e);
          }
        }
      }
      
      if (!artist.workExperience || artist.workExperience.length === 0) {
        const workInfo = artist.info?.find(i => i.label === 'Experiencia Detallada');
        if (workInfo?.value) {
          try {
            const parsedWork = JSON.parse(workInfo.value);
            setWorkExperience(Array.isArray(parsedWork) ? parsedWork : []);
          } catch (e) {
            console.log('Error parsing work experience info:', e);
          }
        }
      }
      
      if (!artist.certifications || artist.certifications.length === 0) {
        const certInfo = artist.info?.find(i => i.label === 'Certificaciones');
        if (certInfo?.value) {
          try {
            const parsedCerts = JSON.parse(certInfo.value);
            setCertifications(Array.isArray(parsedCerts) ? parsedCerts : []);
          } catch (e) {
            console.log('Error parsing certifications info:', e);
          }
        }
      }
    }
  }, [visible, artist]);

  const handleSave = () => {
    onSave({
      description: description.trim(),
      yearsExperience: yearsExperience.trim(),
      style: style.trim(),
      availability: availability.trim(),
      responseTime: responseTime.trim(),
      specialty: specialty.trim(),
      niche: niche.trim(),
      category: category,
      studies: studies,
      workExperience: workExperience,
      certifications: certifications,
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kav}
      >
        <Pressable style={styles.overlay} onPress={onClose} />

        <View style={styles.sheet}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.headerBtn}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Editar Sobre Mí</Text>
            <TouchableOpacity onPress={handleSave} style={styles.headerBtn}>
              <Text style={styles.saveText}>Guardar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* ── Descripción completa ── */}
            <Text style={styles.sectionLabel}>DESCRIPCIÓN COMPLETA</Text>

            <Field
              label="Sobre mí"
              icon="person-outline"
              value={description}
              onChangeText={setDescription}
              placeholder="Cuéntale al mundo tu historia, estilo artístico, lo que te inspira..."
              multiline
              maxLength={1000}
              hint="Describe tu trayectoria, estilo, técnicas, lo que te hace único..."
            />

            {/* ── Información Profesional Básica ── */}
            <Text style={[styles.sectionLabel, { marginTop: 20 }]}>INFORMACIÓN PROFESIONAL</Text>

            <Field
              label="Años de experiencia"
              icon="time-outline"
              value={yearsExperience}
              onChangeText={setYearsExperience}
              placeholder="ej. 5 años, 10+ años..."
              maxLength={50}
              hint="Tiempo total dedicado a tu arte"
            />

            <Field
              label="Estilo artístico"
              icon="color-palette-outline"
              value={style}
              onChangeText={setStyle}
              placeholder="ej. Contemporáneo, Abstracto, Realista..."
              maxLength={100}
              hint="Describe tu estilo principal"
            />

            <Field
              label="Disponibilidad"
              icon="calendar-outline"
              value={availability}
              onChangeText={setAvailability}
              placeholder="ej. Disponible, Ocupado hasta..."
              maxLength={100}
              hint="Tu disponibilidad actual"
            />

            <Field
              label="Tiempo de respuesta"
              icon="chatbubble-ellipses-outline"
              value={responseTime}
              onChangeText={setResponseTime}
              placeholder="ej. 24 horas, 48 horas..."
              maxLength={50}
              hint="Cuánto tardas en responder"
            />

            {/* ── CATEGORÍA ARTÍSTICA ── */}
            <Text style={[styles.sectionLabel, { marginTop: 20 }]}>CATEGORÍA ARTÍSTICA</Text>
            
            <ArtistCategorySelector
              selection={category}
              onChange={setCategory}
            />

            {/* ── ESPECIALIDAD Y NICHO ── */}
            <Text style={[styles.sectionLabel, { marginTop: 20 }]}>ESPECIALIDAD Y NICHO</Text>

            <Field
              label="Especialidad"
              icon="star-outline"
              value={specialty}
              onChangeText={setSpecialty}
              placeholder="ej. Fotografía de retrato, Arte abstracto..."
              maxLength={50}
              hint="Tu área principal de especialización"
            />

            <Field
              label="Nichó de mercado"
              icon="compass-outline"
              value={niche}
              onChangeText={setNiche}
              placeholder="ej. Bodas artísticas, Eventos corporativos..."
              maxLength={50}
              hint="Tipo de clientes o proyectos que buscas"
            />

            
            {/* ── Estudios Detallados ── */}
            <Text style={[styles.sectionLabel, { marginTop: 20 }]}>ESTUDIOS DETALLADOS</Text>
            <Text style={styles.tagHint}>
              Agrega tus estudios específicos con detalles
            </Text>

            {studies.map((study, index) => (
              <View key={index} style={styles.detailCard}>
                <View style={styles.detailHeader}>
                  <Text style={styles.detailTitle}>Estudio {index + 1}</Text>
                  <TouchableOpacity 
                    onPress={() => {
                      const newStudies = studies.filter((_, i) => i !== index);
                      setStudies(newStudies);
                    }}
                  >
                    <Ionicons name="remove-circle" size={20} color={Colors.error} />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.row}>
                  <View style={styles.half}>
                    <Field
                      label="Institución"
                      icon="business-outline"
                      value={study.institution}
                      onChangeText={(text) => {
                        const newStudies = [...studies];
                        newStudies[index].institution = text;
                        setStudies(newStudies);
                      }}
                      placeholder="ej. Universidad Complutense"
                    />
                  </View>
                  <View style={styles.half}>
                    <Field
                      label="Año"
                      icon="calendar-outline"
                      value={study.year}
                      onChangeText={(text) => {
                        const newStudies = [...studies];
                        newStudies[index].year = text;
                        setStudies(newStudies);
                      }}
                      placeholder="ej. 2020"
                    />
                  </View>
                </View>
                
                <Field
                  label="Título/Carrera"
                  icon="school-outline"
                  value={study.degree}
                  onChangeText={(text) => {
                    const newStudies = [...studies];
                    newStudies[index].degree = text;
                    setStudies(newStudies);
                  }}
                  placeholder="ej. Bellas Artes, Diseño Gráfico"
                />
                
                <Field
                  label="Detalles adicionales"
                  icon="document-text-outline"
                  value={study.details}
                  onChangeText={(text) => {
                    const newStudies = [...studies];
                    newStudies[index].details = text;
                    setStudies(newStudies);
                  }}
                  placeholder="ej. Especialización en arte contemporáneo..."
                  multiline
                />
              </View>
            ))}
            
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => {
                setStudies([...studies, { institution: '', degree: '', year: '', details: '' }]);
              }}
            >
              <Ionicons name="add-circle" size={20} color={Colors.primary} />
              <Text style={styles.addButtonText}>Agregar estudio</Text>
            </TouchableOpacity>

            {/* ── Experiencia Laboral Detallada ── */}
            <Text style={[styles.sectionLabel, { marginTop: 20 }]}>EXPERIENCIA LABORAL DETALLADA</Text>
            <Text style={styles.tagHint}>
              Agrega tu experiencia profesional detallada
            </Text>

            {workExperience.map((work, index) => (
              <View key={index} style={styles.detailCard}>
                <View style={styles.detailHeader}>
                  <Text style={styles.detailTitle}>Experiencia {index + 1}</Text>
                  <TouchableOpacity 
                    onPress={() => {
                      const newWork = workExperience.filter((_, i) => i !== index);
                      setWorkExperience(newWork);
                    }}
                  >
                    <Ionicons name="remove-circle" size={20} color={Colors.error} />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.row}>
                  <View style={styles.half}>
                    <Field
                      label="Empresa"
                      icon="business-outline"
                      value={work.company}
                      onChangeText={(text) => {
                        const newWork = [...workExperience];
                        newWork[index].company = text;
                        setWorkExperience(newWork);
                      }}
                      placeholder="ej. Estudio Creativo XYZ"
                    />
                  </View>
                  <View style={styles.half}>
                    <Field
                      label="Período"
                      icon="time-outline"
                      value={work.period}
                      onChangeText={(text) => {
                        const newWork = [...workExperience];
                        newWork[index].period = text;
                        setWorkExperience(newWork);
                      }}
                      placeholder="ej. 2020-2023"
                    />
                  </View>
                </View>
                
                <Field
                  label="Cargo/Puesto"
                  icon="person-outline"
                  value={work.position}
                  onChangeText={(text) => {
                    const newWork = [...workExperience];
                    newWork[index].position = text;
                    setWorkExperience(newWork);
                  }}
                  placeholder="ej. Artista Visual Senior"
                />
                
                <Field
                  label="Descripción del puesto"
                  icon="document-text-outline"
                  value={work.description}
                  onChangeText={(text) => {
                    const newWork = [...workExperience];
                    newWork[index].description = text;
                    setWorkExperience(newWork);
                  }}
                  placeholder="Describe tus responsabilidades y logros..."
                  multiline
                />
              </View>
            ))}
            
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => {
                setWorkExperience([...workExperience, { company: '', position: '', period: '', description: '' }]);
              }}
            >
              <Ionicons name="add-circle" size={20} color={Colors.primary} />
              <Text style={styles.addButtonText}>Agregar experiencia</Text>
            </TouchableOpacity>

            
            <View style={{ height: 32 }} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  kav: { flex: 1, justifyContent: 'flex-end' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    backgroundColor: Colors.bg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '92%',
    overflow: 'hidden',
  },
  handle: {
    width: 36, height: 4,
    backgroundColor: Colors.border2,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerBtn: { minWidth: 70 },
  title: { fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: Colors.text },
  cancelText: { fontSize: 15, fontFamily: 'PlusJakartaSans_400Regular', color: Colors.text2 },
  saveText:   { fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: Colors.primary, textAlign: 'right' },
  content: { padding: 20, gap: 12 },
  sectionLabel: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.text3,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  tagHint: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.text3,
    marginBottom: 8,
    marginTop: -4,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  half: {
    flex: 1,
  },
  detailCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 12,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailTitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  addButtonText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.primary,
  },
});

BioSection, CategorySection, EducationSection, ExperienceSection, InfoProfesionalSection, SocialSection