'use server';

import { db } from './data';
import type { Booking, DailyRevenue, Payment, PaymentMode, Room } from './types';
import { format } from 'date-fns';

export async function getSummaryData() {
  const totalRooms = db.rooms.length;
  const occupiedRooms = db.rooms.filter(room => room.status === 'Occupied').length;
  const availableRooms = db.rooms.filter(room => room.status === 'Available' || room.status === 'Booked').length;
  return { totalRooms, occupiedRooms, availableRooms };
}

export async function getRooms(): Promise<Room[]> {
  // Simulate some occupied rooms for demonstration
  const rooms = db.rooms.map(r => ({...r})); // Create a copy
  const occupiedRoom = rooms.find(r => r.roomNumber === '101');
  if (occupiedRoom && occupiedRoom.status === 'Available') {
    occupiedRoom.status = 'Occupied';
    occupiedRoom.guestName = 'Alice Johnson';
    occupiedRoom.checkIn = format(subDays(new Date('2025-12-10T00:00:00'), 1), 'yyyy-MM-dd');
    occupiedRoom.checkOut = format(new Date('2025-12-10T00:00:00'), 'yyyy-MM-dd');
  }

  const occupiedRoom2 = rooms.find(r => r.roomNumber === '105');
  if (occupiedRoom2 && occupiedRoom2.status === 'Available') {
    occupiedRoom2.status = 'Occupied';
    occupiedRoom2.guestName = 'Charlie Brown';
    occupiedRoom2.checkIn = format(subDays(new Date('2025-12-10T00:00:00'), 1), 'yyyy-MM-dd');
    occupiedRoom2.checkOut = format(addDays(new Date('2025-12-10T00:00:00'), 1), 'yyyy-MM-dd');
  }
  
   const bookedRoom = rooms.find(r => r.roomNumber === '102');
    if (bookedRoom && bookedRoom.status === 'Available') {
        bookedRoom.status = 'Booked';
        bookedRoom.guestName = 'AD';
        bookedRoom.checkIn = '2025-12-18';
        bookedRoom.checkOut = '2025-12-22';
    }


  return rooms;
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

export async function deletePayment(paymentId: string) {
    const paymentIndex = db.payments.findIndex(p => p.id === paymentId);
    if (paymentIndex === -1) {
        throw new Error('Payment not found');
    }

    const payment = db.payments[paymentIndex];
    if (payment) {
        const room = db.rooms.find(r => r.roomNumber === payment.roomNumber);
        if (room) {
            room.status = 'Available';
            room.guestName = null;
            room.checkIn = null;
            room.checkOut = null;
        }
    }

    db.payments.splice(paymentIndex, 1);
    return { success: true };
}
