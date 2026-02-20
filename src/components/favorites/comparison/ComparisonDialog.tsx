import React, { useState, useEffect, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
// Asumiendo que ComparisonItem ya está convertido a React Native
import { ComparisonItem } from "./ComparisonItem";

const { width, height } = Dimensions.get('window');

interface ComparisonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  comparisonData: any[];
  comparisonTab?: 'artists' | 'events' | 'sites' | 'gallery';
}

export function ComparisonDialog({
  open,
  onOpenChange,
  comparisonTab = 'artists',
  comparisonData = []
}: ComparisonDialogProps) {
  const [currentPage, setCurrentPage] = useState(0);
  
  // En móvil 1 o 2 es mejor. Si quieres 3 como en web, el diseño se verá pequeño.
  const itemsPerPage = 1; 
  const totalPages = Math.ceil(comparisonData.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(0);
  }, [comparisonData]);

  const handleScroll = (event: any) => {
    const scrollOffset = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(scrollOffset / width);
    setCurrentPage(currentIndex);
  };

  return (
    <Modal
      visible={open}
      animationType="slide"
      transparent={true}
      onRequestClose={() => onOpenChange(false)}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.container}>
          
          {/* Encabezado con Gradiente */}
          <LinearGradient
            colors={['#9333ea', '#2563eb']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.header}
          >
            <View style={styles.headerContent}>
              <View>
                <Text style={styles.headerTitle}>Comparar Favoritos</Text>
                <Text style={styles.headerSubtitle}>
                  ({comparisonData.length} {comparisonData.length === 1 ? 'elemento' : 'elementos'})
                </Text>
              </View>
              <TouchableOpacity 
                onPress={() => onOpenChange(false)}
                style={styles.closeIconButton}
              >
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Contenido / Lista */}
          <View style={styles.content}>
            {comparisonData.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="copy-outline" size={48} color="#9ca3af" />
                <Text style={styles.emptyTitle}>No hay elementos</Text>
                <Text style={styles.emptySubtitle}>Selecciona elementos para comparar</Text>
              </View>
            ) : (
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                contentContainerStyle={styles.scrollContent}
              >
                {comparisonData.map((item) => (
                  <View key={item.id} style={styles.itemWrapper}>
                    <ComparisonItem
                      item={item}
                      type={comparisonTab}
                    />
                  </View>
                ))}
              </ScrollView>
            )}
          </View>

          {/* Pie de página con Navegación y Botón */}
          <View style={styles.footer}>
            {totalPages > 1 && (
              <View style={styles.paginationDots}>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <View 
                    key={i} 
                    style={[
                      styles.dot, 
                      currentPage === i ? styles.activeDot : styles.inactiveDot
                    ]} 
                  />
                ))}
              </View>
            )}

            <TouchableOpacity 
              onPress={() => onOpenChange(false)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#9333ea', '#2563eb']}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Cerrar comparación</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: 'white',
    height: '95%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#f3e8ff',
    fontSize: 12,
  },
  closeIconButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    padding: 4,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
  },
  itemWrapper: {
    width: width, // Cada item ocupa el ancho de la pantalla
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 5,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    backgroundColor: '#f9fafb',
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    backgroundColor: '#9333ea',
    width: 20,
  },
  inactiveDot: {
    backgroundColor: '#d1d5db',
  },
  closeButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#9333ea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});