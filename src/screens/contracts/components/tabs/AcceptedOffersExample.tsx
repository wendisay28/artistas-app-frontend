// components/hiring/tabs/AcceptedOffersExample.tsx
//
// Ejemplo de cómo se ve la sección "Aceptadas" con ofertas aplicadas/aceptadas

import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import AppliedOfferCard from './AppliedOfferCard';
import { Offer } from '../../../../types/hiring';

// Ejemplo de ofertas aceptadas
const MOCK_ACCEPTED_OFFERS: (Offer & { 
  applicationStatus: 'pending' | 'accepted' | 'rejected' | 'in_progress' | 'completed';
  appliedDate: string;
})[] = [
  {
    id: 'acc1',
    title: 'Fotógrafo urgente para boda hoy',
    description: 'Se canceló nuestro fotógrafo, necesitamos reemplazo inmediato para ceremonia a las 5pm. Paquete completo: ceremonia + recepción, 4 horas.',
    offer_type: 'hiring',
    budget_min: 500,
    budget_max: 800,
    location: 'Madrid',
    date: '2026-03-08',
    category: 'Fotógrafo',
    is_urgent: true,
    poster_id: 'u5',
    poster_name: 'Hotel Palace',
    created_date: '2026-03-08',
    applicationStatus: 'accepted',
    appliedDate: '2026-03-08T14:30:00Z',
  },
  {
    id: 'acc2',
    title: 'DJ para evento corporativo emergente',
    description: 'Necesitamos DJ para evento inesperado esta noche. 4 horas, equipo propio, música variada para 50 personas.',
    offer_type: 'gig',
    budget_min: 350,
    budget_max: 600,
    location: 'Barcelona',
    date: '2026-03-08',
    category: 'DJ',
    is_urgent: true,
    poster_id: 'u6',
    poster_name: 'Eventos Pro S.L.',
    created_date: '2026-03-08',
    applicationStatus: 'in_progress',
    appliedDate: '2026-03-08T13:15:00Z',
  },
  {
    id: 'acc3',
    title: 'Músico para gala benéfica',
    description: 'Gala de recaudación de fondos, necesitamos músico para piano durante 2 horas. Repertorio jazz y clásico.',
    offer_type: 'gig',
    budget_min: 400,
    budget_max: 600,
    location: 'Valencia',
    date: '2026-03-08',
    category: 'Músico',
    is_urgent: true,
    poster_id: 'u7',
    poster_name: 'Fundación Esperanza',
    created_date: '2026-03-08',
    applicationStatus: 'pending',
    appliedDate: '2026-03-08T12:45:00Z',
  },
  {
    id: 'acc4',
    title: 'Catering para evento corporativo',
    description: 'Servicio de catering para 100 personas, menú vegetariano. Evento finalizado exitosamente.',
    offer_type: 'hiring',
    budget_min: 800,
    budget_max: 1200,
    location: 'Madrid',
    date: '2026-03-07',
    category: 'Chef',
    is_urgent: true,
    poster_id: 'u8',
    poster_name: 'TechCorp',
    created_date: '2026-03-07',
    applicationStatus: 'completed',
    appliedDate: '2026-03-07T10:00:00Z',
  },
];

export default function AcceptedOffersExample() {
  const handleViewDetails = (offerId: string) => {
    console.log('Ver detalles de oferta:', offerId);
  };

  const handleMessage = (offerId: string) => {
    console.log('Enviar mensaje al cliente:', offerId);
  };

  const handleCancel = (offerId: string) => {
    console.log('Cancelar aplicación:', offerId);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {MOCK_ACCEPTED_OFFERS.map((offer) => (
          <AppliedOfferCard
            key={offer.id}
            offer={offer}
            applicationStatus={offer.applicationStatus}
            appliedDate={offer.appliedDate}
            onViewDetails={() => handleViewDetails(offer.id)}
            onMessage={() => handleMessage(offer.id)}
            onCancel={() => handleCancel(offer.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
    paddingVertical: 8,
  },
});
