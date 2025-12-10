import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSummaryData } from "@/lib/actions";
import { Bed, BedDouble, Users } from "lucide-react";

export default async function SummarySection() {
    const summary = await getSummaryData();

    return (
        <div>
            <h2 className="text-2xl font-bold tracking-tight mb-4">Dashboard Overview</h2>
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
                        <BedDouble className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summary.totalRooms}</div>
                        <p className="text-xs text-muted-foreground">Total rooms in the hotel</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Occupied Rooms</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summary.occupiedRooms}</div>
                        <p className="text-xs text-muted-foreground">Rooms currently with guests</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Available Rooms</CardTitle>
                        <Bed className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summary.availableRooms}</div>
                        <p className="text-xs text-muted-foreground">Rooms ready for booking</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
