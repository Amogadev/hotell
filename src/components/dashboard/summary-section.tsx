import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSummaryData } from "@/lib/actions";
import { Bed, BedDouble, Users, CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    colorClass: string;
}

function SummaryCard({ title, value, icon, colorClass }: SummaryCardProps) {
    return (
        <Card className={cn("text-white", colorClass)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold">{value}</div>
            </CardContent>
        </Card>
    );
}

export default async function SummarySection() {
    const summary = await getSummaryData();

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <SummaryCard 
                title="Total Rooms" 
                value={summary.totalRooms} 
                icon={<BedDouble className="h-6 w-6" />}
                colorClass="bg-card"
            />
            <SummaryCard 
                title="Rooms Available" 
                value={summary.availableRooms} 
                icon={<Bed className="h-6 w-6" />}
                colorClass="bg-green-700/50"
            />
            <SummaryCard 
                title="Rooms Occupied" 
                value={summary.occupiedRooms} 
                icon={<Users className="h-6 w-6" />}
                colorClass="bg-red-700/50"
            />
             <SummaryCard 
                title="Rooms Booked" 
                value={summary.occupiedRooms} 
                icon={<CalendarCheck className="h-6 w-6" />}
                colorClass="bg-orange-700/50"
            />
        </div>
    );
}
