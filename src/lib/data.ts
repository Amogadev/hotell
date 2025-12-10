import type { Room, Booking, Payment, RoomStatus, PaymentMode } from './types';
import { format, subDays, addDays } from 'date-fns';

const today = new Date('2025-12-10T00:00:00');
const todayStr = format(today, 'yyyy-MM-dd');
const tomorrowStr = format(addDays(today, 1), 'yyyy-MM-dd');
const yesterdayStr = format(subDays(today, 1), 'yyyy-MM-dd');

const paymentModes: PaymentMode[] = ['UPI', 'Cash', 'GPay', 'PhonePe', 'Net Banking'];

export const mockRooms: Room[] = [
  { id: '1', roomNumber: '101', status: 'Available', guestName: null, checkIn: null, checkOut: null },
  { id: '2', roomNumber: '102', status: 'Available', guestName: null, checkIn: null, checkOut: null },
  { id: '3', roomNumber: '103', status: 'Available', guestName: null, checkIn: null, checkOut: null },
  { id: '4', roomNumber: '104', status: 'Available', guestName: null, checkIn: null, checkOut: null },
  { id: '5', roomNumber: '105', status: 'Available', guestName: null, checkIn: null, checkOut: null },
  { id: '6', roomNumber: '201', status: 'Available', guestName: null, checkIn: null, checkOut: null },
  { id: '7', roomNumber: '202', status: 'Available', guestName: null, checkIn: null, checkOut: null },
];

export const mockBookings: Booking[] = [
  { id: 'b1', roomNumber: '101', guestName: 'Alice Johnson', checkInDate: yesterdayStr, checkOutDate: todayStr, numberOfPersons: 2, paymentMode: 'GPay', paymentStatus: 'Completed', date: yesterdayStr },
  { id: 'b2', roomNumber: '101', guestName: 'Alice Johnson', checkInDate: yesterdayStr, checkOutDate: todayStr, numberOfPersons: 2, paymentMode: 'GPay', paymentStatus: 'Completed', date: todayStr },
  { id: 'b3', roomNumber: '103', guestName: 'Bob Williams', checkInDate: todayStr, checkOutDate: tomorrowStr, numberOfPersons: 1, paymentMode: 'UPI', paymentStatus: 'Completed', date: todayStr },
  { id: 'b4', roomNumber: '103', guestName: 'Bob Williams', checkInDate: todayStr, checkOutDate: tomorrowStr, numberOfPersons: 1, paymentMode: 'UPI', paymentStatus: 'Completed', date: tomorrowStr },
  { id: 'b5', roomNumber: '105', guestName: 'Charlie Brown', checkInDate: yesterdayStr, checkOutDate: tomorrowStr, numberOfPersons: 3, paymentMode: 'Cash', paymentStatus: 'Pending', date: yesterdayStr },
  { id: 'b6', roomNumber: '105', guestName: 'Charlie Brown', checkInDate: yesterdayStr, checkOutDate: tomorrowStr, numberOfPersons: 3, paymentMode: 'Cash', paymentStatus: 'Pending', date: todayStr },
  { id: 'b7', roomNumber: '105', guestName: 'Charlie Brown', checkInDate: yesterdayStr, checkOutDate: tomorrowStr, numberOfPersons: 3, paymentMode: 'Cash', paymentStatus: 'Pending', date: tomorrowStr },
];

export const mockPayments: Payment[] = [
    { id: 'p1', roomNumber: '101', amount: 2500, mode: 'GPay', date: yesterdayStr },
    { id: 'p2', roomNumber: '103', amount: 1800, mode: 'UPI', date: todayStr },
    { id: 'p3', roomNumber: '102', amount: 2200, mode: 'Net Banking', date: subDays(today, 2).toISOString().split('T')[0] },
    { id: 'p4', roomNumber: '201', amount: 3000, mode: 'PhonePe', date: subDays(today, 3).toISOString().split('T')[0] },
    { id: 'p5', roomNumber: '202', amount: 1500, mode: 'Cash', date: todayStr },
];

// In a real app, these would be Firestore transactions
export const db = {
  rooms: mockRooms,
  bookings: mockBookings,
  payments: mockPayments,
};
