import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSummaryData } from "@/lib/actions";
import { Bed, BedDouble, Users, CalendarCheck } from "lucide-react";

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


export default async function SummarySection() {
    const summary = await getSummaryData();

    return (
         <Card>
            <CardHeader>
                <CardTitle>Room Detail</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
        </Card>
    );
}
