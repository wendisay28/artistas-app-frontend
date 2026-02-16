import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ComparisonItemProps {
  item: any;
  type: 'artists' | 'events' | 'sites' | 'gallery';
}

export const ComparisonItem: React.FC<ComparisonItemProps> = ({
  item,
  type,
}) => {
  const renderArtistContent = () => (
    <>
      <Image source={{ uri: item.image || 'https://via.placeholder.com/150' }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemProfession}>{item.profession}</Text>
        
        <View style={styles.itemRow}>
          <Ionicons name="star" size={16} color="#f39c12" />
          <Text style={styles.itemText}>{item.rating?.toFixed(1) || 'N/A'}</Text>
        </View>
        
        <Text style={styles.itemPrice}>${item.price || 'N/A'}</Text>
        
        {item.description && (
          <Text style={styles.itemDescription} numberOfLines={3}>
            {item.description}
          </Text>
        )}
      </View>
    </>
  );

  const renderEventContent = () => (
    <>
      <Image source={{ uri: item.image || 'https://via.placeholder.com/150' }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.title}</Text>
        
        <View style={styles.itemRow}>
          <Ionicons name="calendar-outline" size={16} color="#e74c3c" />
          <Text style={styles.itemText}>{item.date}</Text>
        </View>
        
        <View style={styles.itemRow}>
          <Ionicons name="location-outline" size={16} color="#3498db" />
          <Text style={styles.itemText}>{item.location}</Text>
        </View>
        
        <View style={styles.itemRow}>
          <Ionicons name="people-outline" size={16} color="#9b59b6" />
          <Text style={styles.itemText}>{item.attendees || 0} asistentes</Text>
        </View>
        
        <Text style={styles.itemPrice}>
          {item.price ? `$${item.price}` : 'Gratis'}
        </Text>
        
        {item.description && (
          <Text style={styles.itemDescription} numberOfLines={3}>
            {item.description}
          </Text>
        )}
      </View>
    </>
  );

  const renderSiteContent = () => (
    <>
      <Image source={{ uri: item.image || 'https://via.placeholder.com/150' }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        
        <View style={styles.itemRow}>
          <Ionicons name="pricetag-outline" size={16} color="#9b59b6" />
          <Text style={styles.itemText}>{item.category}</Text>
        </View>
        
        <View style={styles.itemRow}>
          <Ionicons name="location-outline" size={16} color="#e74c3c" />
          <Text style={styles.itemText}>{item.address}</Text>
        </View>
        
        <View style={styles.itemRow}>
          <Ionicons name="people-outline" size={16} color="#3498db" />
          <Text style={styles.itemText}>{item.city}</Text>
        </View>
        
        <View style={styles.itemRow}>
          <Ionicons name="star" size={16} color="#f39c12" />
          <Text style={styles.itemText}>{item.rating?.toFixed(1) || 'N/A'}</Text>
        </View>
      </View>
    </>
  );

  const renderGalleryContent = () => (
    <>
      <Image source={{ uri: item.image || 'https://via.placeholder.com/150' }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        
        <View style={styles.itemRow}>
          <Ionicons name="storefront-outline" size={16} color="#3498db" />
          <Text style={styles.itemText}>{item.seller}</Text>
        </View>
        
        <View style={styles.itemRow}>
          <Ionicons name="star" size={16} color="#f39c12" />
          <Text style={styles.itemText}>{item.rating?.toFixed(1) || 'N/A'}</Text>
        </View>
        
        <Text style={styles.itemPrice}>${item.price}</Text>
        
        {item.description && (
          <Text style={styles.itemDescription} numberOfLines={3}>
            {item.description}
          </Text>
        )}
      </View>
    </>
  );

  const renderContent = () => {
    switch (type) {
      case 'artists':
        return renderArtistContent();
      case 'events':
        return renderEventContent();
      case 'sites':
        return renderSiteContent();
      case 'gallery':
        return renderGalleryContent();
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    minHeight: 300,
  },
  itemImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#f8f9fa',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  itemProfession: {
    fontSize: 14,
    color: '#9b59b6',
    marginBottom: 12,
    fontWeight: '500',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  itemText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  itemPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginTop: 8,
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
});
