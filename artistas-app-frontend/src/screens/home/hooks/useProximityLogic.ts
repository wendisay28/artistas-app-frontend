// src/screens/home/hooks/useProximityLogic.ts
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
}

interface ProximityOptions {
  maxDistanceKm?: number;
  userCity?: string;
}

export const useProximityLogic = (options: ProximityOptions = {}) => {
  const { maxDistanceKm = 10, userCity = 'Medellín' } = options;
  const [userLocation, setUserLocation] = useState<LocationData | null>(null);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'undetermined'>('undetermined');
  const [isLoading, setIsLoading] = useState(false);

  // Request location permission and get user location
  const requestLocationPermission = async () => {
    setIsLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status);
      
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        
        const { latitude, longitude } = location.coords;
        
        // Reverse geocoding to get city name
        const [address] = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });
        
        const city = address.city || userCity;
        
        setUserLocation({
          latitude,
          longitude,
          city,
        });
      }
    } catch (error) {
      console.error('Error getting location:', error);
      setLocationPermission('denied');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Filter items by proximity
  const filterByProximity = <T extends { latitude?: number; longitude?: number; city?: string }>(
    items: T[]
  ): T[] => {
    if (!userLocation) {
      // If no location, filter by city
      return items.filter(item => 
        item.city?.toLowerCase() === userCity.toLowerCase()
      );
    }

    return items.filter(item => {
      if (!item.latitude || !item.longitude) {
        // If item has no coordinates, filter by city
        return item.city?.toLowerCase() === userLocation.city.toLowerCase();
      }

      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        item.latitude,
        item.longitude
      );

      return distance <= maxDistanceKm;
    });
  };

  // Sort items by distance
  const sortByDistance = <T extends { latitude?: number; longitude?: number; city?: string }>(
    items: T[]
  ): T[] => {
    if (!userLocation) {
      return items.sort((a, b) => 
        (a.city === userCity ? -1 : 1) - (b.city === userCity ? -1 : 1)
      );
    }

    return items
      .map(item => ({
        ...item,
        distance: item.latitude && item.longitude
          ? calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              item.latitude,
              item.longitude
            )
          : item.city === userLocation.city ? 0 : Infinity,
      }))
      .sort((a, b) => (a as any).distance - (b as any).distance);
  };

  // Get proximity status for an item
  const getProximityStatus = (item: {
    latitude?: number;
    longitude?: number;
    city?: string;
  }) => {
    if (!userLocation) {
      return {
        isNearby: item.city?.toLowerCase() === userCity.toLowerCase(),
        distance: null,
        status: item.city?.toLowerCase() === userCity.toLowerCase() ? 'same-city' : 'different-city',
      };
    }

    if (!item.latitude || !item.longitude) {
      return {
        isNearby: item.city?.toLowerCase() === userLocation.city.toLowerCase(),
        distance: null,
        status: item.city?.toLowerCase() === userLocation.city.toLowerCase() ? 'same-city' : 'different-city',
      };
    }

    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      item.latitude,
      item.longitude
    );

    return {
      isNearby: distance <= maxDistanceKm,
      distance: Math.round(distance * 10) / 10, // Round to 1 decimal place
      status: distance <= maxDistanceKm ? 'nearby' : 'far',
    };
  };

  // Get formatted distance text
  const getDistanceText = (item: {
    latitude?: number;
    longitude?: number;
    city?: string;
  }): string => {
    const status = getProximityStatus(item);
    
    if (status.distance === null) {
      return status.status === 'same-city' ? userCity : item.city || 'Desconocido';
    }

    if (status.distance < 1) {
      return `A ${Math.round(status.distance * 1000)} m`;
    }

    return `A ${status.distance} km`;
  };

  // Initialize location on mount
  useEffect(() => {
    requestLocationPermission();
  }, []);

  return {
    userLocation,
    locationPermission,
    isLoading,
    requestLocationPermission,
    filterByProximity,
    sortByDistance,
    getProximityStatus,
    getDistanceText,
  };
};
