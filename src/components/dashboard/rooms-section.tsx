'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getRooms } from "@/lib/actions";
import type { Room } from "@/lib/types";
import { Button } from "@/components/ui/button";
import BookingDialog from "./booking-dialog";
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { Building, User, Calendar, CalendarCheck, IndianRupee } from 'lucide-react';
import { format } from 'date-fns';

function RoomCard({ room, onBookingSuccess }: { room: Room, onBookingSuccess: () => void }) {
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const isAvailable = room.status === 'Available';
    const isOccupied = room.status === 'Occupied';
    const isBooked = room.status === 'Booked';

    const getStatusBadge = () => {
        switch (room.status) {
            case 'Available':
                return <Badge variant="default" className="capitalize w-fit"><Building className="mr-1 h-3 w-3" />Available</Badge>;
            case 'Occupied':
                 return <Badge variant="destructive" className="capitalize w-fit">Occupied</Badge>;
            case 'Booked':
                return (
                    <div className="flex flex-col gap-2">
                        <Badge variant="outline" className="capitalize w-fit bg-orange-600/20 text-orange-400 border-orange-500/50 hover:bg-orange-600/30">
                            <CalendarCheck className="mr-1 h-3 w-3" />
                            Booked
                        </Badge>
                    </div>
                );
            default:
                return <Badge className="capitalize">{room.status}</Badge>;
        }
    }

    return (
        <>
            <Card className="flex flex-col justify-between bg-secondary">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">Room {room.roomNumber}</CardTitle>
                        <div className="flex flex-col items-end">
                            {getStatusBadge()}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-center items-center text-center space-y-2">
                    {isAvailable ? (
                        <>
                            <Building className="h-10 w-10 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Ready for booking</p>
                        </>
                    ) : (
                        <div className="text-sm text-muted-foreground space-y-2 text-left w-full">
                             <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span className="font-medium text-foreground">{room.guestName}</span>
                             </div>
                             <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{`${format(new Date(room.checkIn!), 'MMM dd')} - ${format(new Date(room.checkOut!), 'MMM dd')}`}</span>
                            </div>
                            {isBooked && room.amountDue && (
                                <div className="flex items-center gap-2 text-amber-500">
                                    <IndianRupee className="h-4 w-4" />
                                    <span>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(room.amountDue)} due</span>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
                <div className="p-4 pt-0">
                    <Button 
                        className="w-full" 
                        disabled={!isAvailable}
                        onClick={() => setIsBookingOpen(true)}
                        variant="default"
                    >
                        {isAvailable ? 'Book Now' : (isBooked ? 'Update Booking' : 'Manage')}
                    </Button>
                </div>
            </Card>
            {isAvailable && (
                <BookingDialog 
                    isOpen={isBookingOpen}
                    setIsOpen={setIsBookingOpen}
                    roomNumber={room.roomNumber}
                    onBookingSuccess={onBookingSuccess}
                />
            )}
        </>
    );
}


export default function RoomsSection() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRooms = async () => {
        setLoading(true);
        const fetchedRooms = await getRooms();
        setRooms(fetchedRooms);
        setLoading(false);
    }
    
    useEffect(() => {
        fetchRooms();
    }, []);

    const handleBookingSuccess = () => {
        fetchRooms();
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Room Status</CardTitle>
                <CardDescription>View and manage room bookings for the selected date.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <Skeleton key={i} className="h-[230px] rounded-lg" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {rooms.map(room => (
                            <RoomCard key={room.id} room={room} onBookingSuccess={handleBookingSuccess} />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
