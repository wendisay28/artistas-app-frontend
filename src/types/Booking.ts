export type BookingStatus = "pending" | "accepted" | "rejected" | "cancelled" | "completed";

export type Booking = {
  id: string;
  artistId: string;
  userId: string;
  date: string;
  status: BookingStatus;
  notes?: string;
};
