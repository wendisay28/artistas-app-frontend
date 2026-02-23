/** categoryId alineado con IDs string de constants/artistCategories. */
export type Artist = {
  id: number;
  userId: string;
  artistName: string;
  categoryId?: string;
  subcategories?: string[];
  tags?: string[];
  artistType?: string;
  presentationType?: string[];
  serviceTypes?: string[];
  pricePerHour?: number;
  experience?: string;
  description?: string;
  portfolio?: any;
  isAvailable?: boolean;
  canTravel?: boolean;
  avatarUrl?: string;
  city?: string;
  rating?: number;
  reviews?: number;
};
