
'use server';

import { db } from './data';
import type { Booking, DailyRevenue, Payment, PaymentMode, Room, PaymentStatus } from './types';
import { format, differenceInDays, isToday } from 'date-fns';

export async function getSummaryData() {
  const totalRooms = db.rooms.length;
  const occupiedRooms = db.rooms.filter(room => room.status === 'Occupied').length;
  const availableRooms = db.rooms.filter(room => room.status === 'Available').length;
  const bookedRooms = db.rooms.filter(room => room.status === 'Booked').length;
  return { totalRooms, occupiedRooms, availableRooms, bookedRooms };
}

export async function getRooms(): Promise<Room[]> {
  const rooms = db.rooms.map(r => ({...r})); // Create a copy
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

interface CreateBookingData {
    roomNumber: string;
    guestName: string;
    checkInDate: string;
    checkOutDate: string;
    numberOfPersons: number;
    paymentMode: PaymentMode;
    advancePayment: number;
}

export async function createBooking(bookingData: CreateBookingData) {
    console.log('Creating booking:', bookingData);
    
    const nights = differenceInDays(new Date(bookingData.checkOutDate), new Date(bookingData.checkInDate));
    const totalAmount = 800 * Math.max(1, nights);
    const amountPaid = bookingData.advancePayment;
    const amountDue = totalAmount - amountPaid;
    const paymentStatus: PaymentStatus = amountDue <= 0 ? 'Completed' : 'Partially Paid';

    const bookingId = `b${db.bookings.length + 1}`;

    const newBooking: Booking = {
        id: bookingId,
        roomNumber: bookingData.roomNumber,
        guestName: bookingData.guestName,
        checkInDate: bookingData.checkInDate,
        checkOutDate: bookingData.checkOutDate,
        numberOfPersons: bookingData.numberOfPersons,
        paymentMode: bookingData.paymentMode,
        paymentStatus,
        date: bookingData.checkInDate,
        totalAmount,
        amountPaid,
        amountDue,
    };
    db.bookings.push(newBooking);

    const room = db.rooms.find(r => r.roomNumber === bookingData.roomNumber);
    if (room) {
        const checkInDate = new Date(bookingData.checkInDate);
        // The time zone offset needs to be considered for an accurate `isToday` check
        const utcDate = new Date(checkInDate.getUTCFullYear(), checkInDate.getUTCMonth(), checkInDate.getUTCDate());
        room.status = isToday(utcDate) ? 'Occupied' : 'Booked';
        room.guestName = bookingData.guestName;
        room.checkIn = bookingData.checkInDate;
        room.checkOut = bookingData.checkOutDate;
        room.bookingId = bookingId;
        room.amountDue = amountDue > 0 ? amountDue : null;
    }

    const newPayment: Payment = {
        id: `p${db.payments.length + 1}`,
        bookingId: bookingId,
        roomNumber: bookingData.roomNumber,
        amount: bookingData.advancePayment,
        mode: bookingData.paymentMode,
        date: format(new Date(), 'yyyy-MM-dd'),
    };
    if (newPayment.amount > 0) {
      db.payments.push(newPayment);
    }

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
            room.bookingId = null;
            room.amountDue = null;
        }

        const bookingIndex = db.bookings.findIndex(b => b.id === payment.bookingId);
        if (bookingIndex > -1) {
            db.bookings.splice(bookingIndex, 1);
        }
    }

    db.payments.splice(paymentIndex, 1);
    return { success: true };
}

export async function createRepayment(bookingId: string, amount: number) {
    const booking = db.bookings.find(b => b.id === bookingId);
    if (!booking) {
        throw new Error('Booking not found');
    }

    const newPayment: Payment = {
        id: `p${db.payments.length + 1}`,
        bookingId: bookingId,
        roomNumber: booking.roomNumber,
        amount: amount,
        mode: 'Cash', // Defaulting to cash for settlement
        date: format(new Date(), 'yyyy-MM-dd'),
    };
    db.payments.push(newPayment);

    booking.amountPaid += amount;
    booking.amountDue = 0;
    booking.paymentStatus = 'Completed';

    const room = db.rooms.find(r => r.bookingId === bookingId);
    if (room) {
        room.amountDue = null;
    }

    return { success: true, payment: newPayment };
}
