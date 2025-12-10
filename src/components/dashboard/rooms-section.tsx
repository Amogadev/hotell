'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getRooms } from "@/lib/actions";
import type { Room } from "@/lib/types";
import { Button } from "@/components/ui/button";
import BookingDialog from "./booking-dialog";
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';

function RoomCard({ room, onBookingSuccess }: { room: Room, onBookingSuccess: () => void }) {
    const [isBookingOpen, setIsBookingOpen] = useState(false);

    return (
        <>
            <Card className="flex flex-col">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Room {room.roomNumber}</CardTitle>
                        <Badge variant={room.status === 'Available' ? 'secondary' : 'destructive'} className="capitalize">
                            {room.status}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow">
                    {room.status === 'Occupied' ? (
                        <div className="text-sm text-muted-foreground">
                            <p><span className="font-medium text-foreground">Guest:</span> {room.guestName}</p>
                            <p><span className="font-medium text-foreground">Check-in:</span> {room.checkIn}</p>
                            <p><span className="font-medium text-foreground">Check-out:</span> {room.checkOut}</p>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">This room is available for booking.</p>
                    )}
                </CardContent>
                <div className="p-6 pt-0">
                    <Button 
                        className="w-full" 
                        disabled={room.status === 'Occupied'}
                        onClick={() => setIsBookingOpen(true)}
                    >
                        {room.status === 'Available' ? 'Book Now' : 'View Booking'}
                    </Button>
                </div>
            </Card>
            {room.status === 'Available' && (
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
                <CardDescription>Manage and view status for all hotel rooms.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {Array.from({ length: 7 }).map((_, i) => (
                            <Skeleton key={i} className="h-[220px] rounded-lg" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {rooms.map(room => (
                            <RoomCard key={room.id} room={room} onBookingSuccess={handleBookingSuccess} />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
