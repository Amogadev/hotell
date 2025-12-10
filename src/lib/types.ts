export type RoomStatus = 'Available' | 'Occupied' | 'Booked';

export interface Room {
  id: string;
  roomNumber: string;
  status: RoomStatus;
  guestName: string | null;
  checkIn: string | null;
  checkOut: string | null;
  bookingId?: string | null;
  amountDue?: number | null;
}

export type PaymentMode = 'UPI' | 'Cash' | 'GPay' | 'PhonePe' | 'Net Banking';
export type PaymentStatus = 'Pending' | 'Completed' | 'Partially Paid';

export interface Booking {
  id: string;
  roomNumber: string;
  guestName: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfPersons: number;
  paymentMode: PaymentMode;
  paymentStatus: PaymentStatus;
  date: string; // The date the booking is for
  totalAmount: number;
  amountPaid: number;
  amountDue: number;
}

export interface Payment {
  id: string;
  bookingId: string;
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
