'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getRooms } from "@/lib/actions";
import type { Room } from "@/lib/types";
import { Button } from "@/components/ui/button";
import BookingDialog from "./booking-dialog";
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { Building, User, Calendar } from 'lucide-react';

function RoomCard({ room, onBookingSuccess }: { room: Room, onBookingSuccess: () => void }) {
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const isAvailable = room.status === 'Available';

    return (
        <>
            <Card className="flex flex-col justify-between bg-secondary">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-lg">Room {room.roomNumber}</CardTitle>
                             <Badge variant={isAvailable ? 'default' : 'destructive'} className="capitalize mt-1 w-fit">{room.status}</Badge>
                        </div>
                        <Building className="h-8 w-8 text-muted-foreground" />
                    </div>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-center items-center text-center space-y-2">
                    {isAvailable ? (
                        <>
                            <p className="text-sm text-muted-foreground">Ready for booking</p>
                        </>
                    ) : (
                        <div className="text-sm text-muted-foreground space-y-1 text-left">
                             <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span className="font-medium text-foreground">{room.guestName}</span>
                             </div>
                             <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{`Next: ${room.checkIn?.split('-')[2]} - ${room.checkOut?.split('-')[2]}`}</span>
                            </div>
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
                        Book Now
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
                            <Skeleton key={i} className="h-[200px] rounded-lg" />
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
