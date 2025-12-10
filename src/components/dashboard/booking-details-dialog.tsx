'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Room } from '@/lib/types';
import { format } from 'date-fns';
import { User, Calendar, IndianRupee, Hash } from 'lucide-react';
import { createRepayment } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useDashboard } from './dashboard-provider';

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
    const { toast } = useToast();
    const { setRefresh } = useDashboard();

    const handleRepayment = async () => {
        if (!room.bookingId || room.amountDue == null) return;

        try {
            await createRepayment(room.bookingId, room.amountDue);
            toast({
                title: 'Payment Successful',
                description: `The balance for Room ${room.roomNumber} has been settled.`,
            });
            setRefresh(true);
            setIsOpen(false);
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Payment Failed',
                description: 'Could not process the repayment. Please try again.',
            });
        }
    }

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
                     {room.amountDue != null && room.amountDue > 0 ? (
                         <DetailRow 
                            icon={<IndianRupee className="h-5 w-5" />} 
                            label="Amount Due" 
                            value={new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(room.amountDue)}
                        />
                    ) : (
                         <DetailRow 
                            icon={<IndianRupee className="h-5 w-5" />} 
                            label="Amount Due" 
                            value="Paid in full"
                        />
                    )}
                </div>
                <DialogFooter>
                    {room.amountDue != null && room.amountDue > 0 && (
                        <Button onClick={handleRepayment}>Settle Payment</Button>
                    )}
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
