'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSummaryData } from "@/lib/actions";
import { Bed, BedDouble, Users, CalendarCheck, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

interface DetailItemProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    colorClass?: string;
}

function DetailItem({ title, value, icon, colorClass }: DetailItemProps) {
    return (
        <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
            <div className="flex items-center gap-4">
                <div className={`p-2 rounded-md ${colorClass}`}>
                    {icon}
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">{title}</p>
                    <p className="text-2xl font-bold">{value}</p>
                </div>
            </div>
        </div>
    );
}


export default function SummarySection() {
    const [summary, setSummary] = useState<{ totalRooms: number; availableRooms: number; occupiedRooms: number; } | null>(null);
    const [isOpen, setIsOpen] = useState(true);
    
    useState(() => {
        getSummaryData().then(setSummary);
    });

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
                        {summary ? (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <DetailItem 
                                    title="Total Rooms" 
                                    value={summary.totalRooms} 
                                    icon={<BedDouble className="h-6 w-6" />}
                                />
                                <DetailItem 
                                    title="Rooms Available" 
                                    value={summary.availableRooms} 
                                    icon={<Bed className="h-6 w-6 text-green-400" />}
                                    colorClass="bg-green-400/10"
                                />
                                <DetailItem 
                                    title="Rooms Occupied" 
                                    value={summary.occupiedRooms} 
                                    icon={<Users className="h-6 w-6 text-red-400" />}
                                    colorClass="bg-red-400/10"

                                />
                                <DetailItem 
                                    title="Rooms Booked" 
                                    value={summary.occupiedRooms} 
                                    icon={<CalendarCheck className="h-6 w-6 text-orange-400" />}
                                    colorClass="bg-orange-400/10"
                                />
                            </div>
                        ) : (
                             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <Skeleton className="h-[80px]" />
                                <Skeleton className="h-[80px]" />
                                <Skeleton className="h-[80px]" />
                                <Skeleton className="h-[80px]" />
                             </div>
                        )}
                    </CardContent>
                </CollapsibleContent>
            </Card>
        </Collapsible>
    );
}
