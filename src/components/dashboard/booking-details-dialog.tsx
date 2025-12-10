'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Room } from '@/lib/types';
import { format } from 'date-fns';
import { User, Calendar, IndianRupee, Hash } from 'lucide-react';

interface BookingDetailsDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    room: Room;
}

const DetailRow = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | null | undefined }) => (
    <div className="flex items-start gap-4">
        <div className="text-muted-foreground">{icon}</div>
        <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="font-semibold text-foreground">{value || 'N/A'}</span>
        </div>
    </div>
)

export default function BookingDetailsDialog({ isOpen, setIsOpen, room }: BookingDetailsDialogProps) {

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Booking Details for Room {room.roomNumber}</DialogTitle>
                    <DialogDescription>
                        Current status: <span className={`font-semibold ${room.status === 'Occupied' ? 'text-red-500' : 'text-orange-500'}`}>{room.status}</span>
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <DetailRow icon={<User className="h-5 w-5" />} label="Guest Name" value={room.guestName} />
                    <DetailRow icon={<Calendar className="h-5 w-5" />} label="Check-in Date" value={room.checkIn ? format(new Date(room.checkIn), 'PPP') : null} />
                    <DetailRow icon={<Calendar className="h-5 w-5" />} label="Check-out Date" value={room.checkOut ? format(new Date(room.checkOut), 'PPP') : null} />
                    <DetailRow icon={<Hash className="h-5 w-5" />} label="Booking ID" value={room.bookingId} />
                    {room.amountDue != null && (
                         <DetailRow 
                            icon={<IndianRupee className="h-5 w-5" />} 
                            label="Amount Due" 
                            value={new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(room.amountDue)}
                        />
                    )}
                </div>
                <DialogFooter>
                    <Button onClick={() => setIsOpen(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
