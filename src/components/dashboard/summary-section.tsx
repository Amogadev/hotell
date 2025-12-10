'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSummaryData, getRooms } from "@/lib/actions";
import type { Room } from '@/lib/types';
import { Bed, BedDouble, Users, CalendarCheck, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';
import { format } from 'date-fns';
import { useDashboard } from './dashboard-provider';

interface DetailItemProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    colorClass?: string;
    description: string;
    details?: React.ReactNode;
}

function DetailItem({ title, value, icon, colorClass, description, details }: DetailItemProps) {
    return (
        <AccordionItem value={title} className="border-0">
            <AccordionTrigger className="p-4 rounded-lg bg-secondary hover:no-underline data-[state=open]:rounded-b-none">
                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-md ${colorClass}`}>
                        {icon}
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground text-left">{title}</p>
                        <p className="text-2xl font-bold">{value}</p>
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent className="bg-secondary/50 p-4 rounded-b-lg text-muted-foreground">
                <p>{description}</p>
                {details && <div className="mt-4 space-y-2">{details}</div>}
            </AccordionContent>
        </AccordionItem>
    );
}

const RoomInfoDetail = ({ room }: { room: Room }) => (
    <div className="text-xs p-2 rounded-md bg-background/50">
        <p className="font-semibold text-foreground">Room {room.roomNumber}: {room.guestName}</p>
        <p>Check-in: {format(new Date(room.checkIn!), 'MMM dd, yyyy')}</p>
        <p>Check-out: {format(new Date(room.checkOut!), 'MMM dd, yyyy')}</p>
    </div>
)


export default function SummarySection() {
    const { refresh, setRefresh } = useDashboard();
    const [summary, setSummary] = useState<{ totalRooms: number; availableRooms: number; occupiedRooms: number; bookedRooms: number; } | null>(null);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(true);
    
    const fetchData = useCallback(async () => {
        setLoading(true);
        const [summaryData, roomsData] = await Promise.all([
            getSummaryData(),
            getRooms()
        ]);
        const bookedRoomsCount = roomsData.filter(room => room.status === 'Booked').length;
        setSummary({
            ...summaryData,
            bookedRooms: bookedRoomsCount,
        });
        setRooms(roomsData);
        setLoading(false);
    }, []);
    
    useEffect(() => {
        fetchData();
        if (refresh) {
            fetchData();
            setRefresh(false);
        }
    }, [refresh, setRefresh, fetchData]);

    const occupiedRoomsList = rooms.filter(r => r.status === 'Occupied');
    const bookedRoomsList = rooms.filter(r => r.status === 'Booked');

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <Card>
                <CollapsibleTrigger className="w-full">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Room Detail</CardTitle>
                        <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
                    </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <CardContent>
                        {loading || !summary ? (
                             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <Skeleton className="h-[88px]" />
                                <Skeleton className="h-[88px]" />
                                <Skeleton className="h-[88px]" />
                                <Skeleton className="h-[88px]" />
                             </div>
                        ) : (
                            <Accordion type="single" collapsible className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <DetailItem 
                                    title="Total Rooms" 
                                    value={summary.totalRooms} 
                                    icon={<BedDouble className="h-6 w-6" />}
                                    description="Total number of rooms in the hotel, including all types and statuses."
                                />
                                <DetailItem 
                                    title="Rooms Available" 
                                    value={summary.availableRooms} 
                                    icon={<Bed className="h-6 w-6 text-green-400" />}
                                    colorClass="bg-green-400/10"
                                    description="Rooms that are currently unoccupied and available for booking."
                                />
                                <DetailItem 
                                    title="Rooms Occupied" 
                                    value={summary.occupiedRooms} 
                                    icon={<Users className="h-6 w-6 text-red-400" />}
                                    colorClass="bg-red-400/10"
                                    description="Rooms that are currently occupied by guests."
                                    details={
                                        occupiedRoomsList.length > 0 ? (
                                            occupiedRoomsList.map(room => <RoomInfoDetail key={room.id} room={room} />)
                                        ) : <p className="text-xs">No rooms are currently occupied.</p>
                                    }
                                />
                                <DetailItem 
                                    title="Rooms Booked" 
                                    value={summary.bookedRooms} 
                                    icon={<CalendarCheck className="h-6 w-6 text-orange-400" />}
                                    colorClass="bg-orange-400/10"
                                    description="Rooms that are reserved for a future date but are currently empty."
                                     details={
                                        bookedRoomsList.length > 0 ? (
                                            bookedRoomsList.map(room => <RoomInfoDetail key={room.id} room={room} />)
                                        ) : <p className="text-xs">No rooms have future bookings.</p>
                                    }
                                />
                            </Accordion>
                        )}
                    </CardContent>
                </CollapsibleContent>
            </Card>
        </Collapsible>
    );
}
