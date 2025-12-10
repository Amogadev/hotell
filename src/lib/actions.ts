'use server';

import { db } from './data';
import type { Booking, DailyRevenue, Payment, PaymentMode, Room } from './types';
import { format } from 'date-fns';

export async function getSummaryData() {
  const totalRooms = db.rooms.length;
  const occupiedRooms = db.rooms.filter(room => room.status === 'Occupied').length;
  const availableRooms = db.rooms.filter(room => room.status === 'Available').length;
  return { totalRooms, occupiedRooms, availableRooms };
}

export async function getRooms(): Promise<Room[]> {
  return db.rooms;
}

export async function getBookingsForDate(date: string): Promise<Booking[]> {
  const formattedDate = format(new Date(date), 'yyyy-MM-dd');
  return db.bookings.filter(booking => booking.date === formattedDate);
}

export async function getRevenueForDate(date: Date): Promise<DailyRevenue> {
  const formattedDate = format(date, 'yyyy-MM-dd');
  const paymentsToday = db.payments.filter(p => p.date === formattedDate);
  
  const totalIncome = paymentsToday.reduce((sum, p) => sum + p.amount, 0);
  const totalBookings = paymentsToday.length;

  return { totalIncome, totalBookings, payments: paymentsToday };
}

export async function createBooking(bookingData: Omit<Booking, 'id' | 'paymentStatus' | 'date'>) {
    console.log('Creating booking:', bookingData);
    
    // Simulate DB write
    const newBooking: Booking = {
        ...bookingData,
        id: `b${db.bookings.length + 1}`,
        paymentStatus: 'Completed', // Assume payment is done on booking
        date: bookingData.checkInDate, // This is simplified
    };
    db.bookings.push(newBooking);

    // Simulate updating room status
    const room = db.rooms.find(r => r.roomNumber === bookingData.roomNumber);
    if (room) {
        room.status = 'Occupied';
        room.guestName = bookingData.guestName;
        room.checkIn = bookingData.checkInDate;
        room.checkOut = bookingData.checkOutDate;
    }

    // Simulate payment record
    const newPayment = {
        id: `p${db.payments.length + 1}`,
        roomNumber: bookingData.roomNumber,
        amount: 2000 + Math.floor(Math.random() * 1500), // Simulate a price
        mode: bookingData.paymentMode,
        date: format(new Date(), 'yyyy-MM-dd'),
    };
    db.payments.push(newPayment);

    return { success: true, booking: newBooking };
}
