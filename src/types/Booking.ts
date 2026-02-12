export type BookingStatus = "pending" | "accepted" | "rejected" | "cancelled" | "completed";

export type Booking = {
  id: number;
  userId: string;
  artistId: number;
  eventId?: number;
  venueId?: number;
  message: string;
  budget?: number;
  status: BookingStatus;
  createdAt?: Date;
  updatedAt?: Date;
};

export type HiringRequest = {
  id: number;
  userId: string;
  artistId: number;
  eventId?: number;
  venueId?: number;
  message: string;
  budget?: number;
  status: BookingStatus;
  createdAt?: Date;
  updatedAt?: Date;
};

export type HiringResponse = {
  id: number;
  requestId: number;
  artistId: string;
  message: string;
  proposal?: any;
  accepted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
