'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getRooms } from "@/lib/actions";
import type { Room } from "@/lib/types";
import { Button } from "@/components/ui/button";
import BookingDialog from "./booking-dialog";
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { Bed, Users, CalendarDays, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

function RoomCard({ room, onBookingSuccess }: { room: Room, onBookingSuccess: () => void }) {
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const isAvailable = room.status === 'Available';

    return (
        <>
            <Card className={cn(
                "flex flex-col transition-all duration-200 ease-in-out hover:shadow-lg hover:-translate-y-1",
                isAvailable ? "bg-green-50" : "bg-amber-50",
                "dark:bg-card"
            )}>
                <CardHeader>
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            {isAvailable ? (
                                <Bed className="h-6 w-6 text-green-600" />
                            ) : (
                                <Users className="h-6 w-6 text-amber-600" />
                            )}
                            <CardTitle className="text-xl">Room {room.roomNumber}</CardTitle>
                        </div>
                        <Badge variant={isAvailable ? 'secondary' : 'destructive'} className="capitalize">
                            {room.status}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow space-y-3">
                    {isAvailable ? (
                        <div className="flex items-center justify-center text-center h-full">
                            <p className="text-sm text-muted-foreground">Ready for the next guest.</p>
                        </div>
                    ) : (
                        <div className="text-sm text-muted-foreground space-y-2">
                             <div className="font-medium text-foreground text-base truncate">{room.guestName}</div>
                             <div className="flex items-center gap-2">
                                <CalendarDays className="h-4 w-4" />
                                <span>{room.checkIn}</span>
                             </div>
                             <div className="flex items-center gap-2">
                                <LogOut className="h-4 w-4" />
                                <span>{room.checkOut}</span>
                            </div>
                        </div>
                    )}
                </CardContent>
                <div className="p-6 pt-0">
                    <Button 
                        className="w-full" 
                        disabled={!isAvailable}
                        onClick={() => setIsBookingOpen(true)}
                        variant={isAvailable ? 'default' : 'outline'}
                    >
                        {isAvailable ? 'Book Now' : 'View Booking'}
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
                <CardDescription>Manage and view status for all hotel rooms.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {Array.from({ length: 7 }).map((_, i) => (
                            <Skeleton key={i} className="h-[240px] rounded-lg" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {rooms.map(room => (
                            <RoomCard key={room.id} room={room} onBookingSuccess={handleBookingSuccess} />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
