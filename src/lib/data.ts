import type { Room, Booking, Payment, RoomStatus, PaymentMode } from './types';
import { format, subDays, addDays } from 'date-fns';

const today = new Date('2025-12-10T00:00:00');
const todayStr = format(today, 'yyyy-MM-dd');
const tomorrowStr = format(addDays(today, 1), 'yyyy-MM-dd');
const yesterdayStr = format(subDays(today, 1), 'yyyy-MM-dd');

const paymentModes: PaymentMode[] = ['UPI', 'Cash', 'GPay', 'PhonePe', 'Net Banking'];

export const mockRooms: Room[] = [
  { id: '1', roomNumber: '101', status: 'Available', guestName: null, checkIn: null, checkOut: null, bookingId: null, amountDue: null },
  { id: '2', roomNumber: '102', status: 'Available', guestName: null, checkIn: null, checkOut: null, bookingId: null, amountDue: null },
  { id: '3', roomNumber: '103', status: 'Available', guestName: null, checkIn: null, checkOut: null, bookingId: null, amountDue: null },
  { id: '4', roomNumber: '104', status: 'Available', guestName: null, checkIn: null, checkOut: null, bookingId: null, amountDue: null },
  { id: '5', roomNumber: '105', status: 'Available', guestName: null, checkIn: null, checkOut: null, bookingId: null, amountDue: null },
  { id: '6', roomNumber: '201', status: 'Available', guestName: null, checkIn: null, checkOut: null, bookingId: null, amountDue: null },
  { id: '7', roomNumber: '202', status: 'Available', guestName: null, checkIn: null, checkOut: null, bookingId: null, amountDue: null },
];

export const mockBookings: Booking[] = [];

export const mockPayments: Payment[] = [
    {
        id: 'p1',
        bookingId: 'b1',
        roomNumber: '101',
        amount: 500,
        mode: 'UPI',
        date: todayStr,
    },
    {
        id: 'p2',
        bookingId: 'b2',
        roomNumber: '102',
        amount: 800,
        mode: 'Cash',
        date: todayStr,
    },
     {
        id: 'p3',
        bookingId: 'b3',
        roomNumber: '101',
        amount: 1000,
        mode: 'GPay',
        date: yesterdayStr,
    },
];

// In a real app, these would be Firestore transactions
export const db = {
  rooms: mockRooms,
  bookings: mockBookings,
  payments: mockPayments,
};
