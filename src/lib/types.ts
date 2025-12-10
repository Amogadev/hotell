export type RoomStatus = 'Available' | 'Occupied' | 'Booked';

export interface Room {
  id: string;
  roomNumber: string;
  status: RoomStatus;
  guestName: string | null;
  checkIn: string | null;
  checkOut: string | null;
}

export type PaymentMode = 'UPI' | 'Cash' | 'GPay' | 'PhonePe' | 'Net Banking';

export interface Booking {
  id: string;
  roomNumber: string;
  guestName: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfPersons: number;
  paymentMode: PaymentMode;
  paymentStatus: 'Pending' | 'Completed';
  date: string; // The date the booking is for
}

export interface Payment {
  id: string;
  roomNumber: string;
  amount: number;
  mode: PaymentMode;
  date: string; // ISO date string
}

export interface DailyRevenue {
  totalBookings: number;
  totalIncome: number;
  payments: Payment[];
}
