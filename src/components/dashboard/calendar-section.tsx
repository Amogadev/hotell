'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { getBookingsForDate } from '@/lib/actions';
import type { Booking } from '@/lib/types';
import { format } from 'date-fns';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';

export default function CalendarSection() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchBookings = async () => {
            if (date) {
                setLoading(true);
                const dateString = format(date, 'yyyy-MM-dd');
                const fetchedBookings = await getBookingsForDate(dateString);
                setBookings(fetchedBookings);
                setLoading(false);
            }
        };
        fetchBookings();
    }, [date]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Bookings Calendar</CardTitle>
                <CardDescription>Select a date to see room bookings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                />
                <div className="space-y-2">
                    <h3 className="text-md font-medium">
                        Bookings for {date ? format(date, 'PPP') : '...'}
                    </h3>
                    <ScrollArea className="h-48">
                        <div className="pr-4">
                            {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
                            {!loading && bookings.length === 0 && (
                                <p className="text-sm text-muted-foreground">No bookings for this date.</p>
                            )}
                            {!loading && bookings.length > 0 && (
                                <ul className="space-y-2">
                                    {bookings.map(booking => (
                                        <li key={booking.id} className="text-sm p-2 rounded-md border flex justify-between items-center">
                                            <div>
                                                <span className="font-semibold">Room {booking.roomNumber}</span>
                                                <span className="text-muted-foreground"> - {booking.guestName}</span>
                                            </div>
                                            <Badge variant={booking.paymentStatus === 'Completed' ? 'default' : 'secondary'}>{booking.paymentStatus}</Badge>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </CardContent>
        </Card>
    );
}
