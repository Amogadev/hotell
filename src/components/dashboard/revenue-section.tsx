'use client';

import { useState, useEffect, useContext } from "react";
import { DollarSign, WalletCards } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getRevenueForDate } from "@/lib/actions";
import type { DailyRevenue } from "@/lib/types";
import { DashboardContext } from "./dashboard-provider";

export default function RevenueSection() {
    const { date } = useContext(DashboardContext);
    const [revenueData, setRevenueData] = useState<DailyRevenue | null>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchRevenue = async () => {
            setLoading(true);
            const data = await getRevenueForDate(date);
            setRevenueData(data);
            setLoading(false);
        };
        fetchRevenue();
    }, [date]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Daily Revenue</CardTitle>
                <CardDescription>Revenue and payment breakdown for the selected date.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? <p>Loading...</p> : revenueData ? (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                                <div className="p-4 bg-secondary rounded-lg flex flex-col items-center">
                                    <DollarSign className="h-6 w-6 text-muted-foreground mb-2" />
                                    <p className="text-sm text-muted-foreground">Total Income</p>
                                    <p className="text-2xl font-bold">
                                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(revenueData.totalIncome)}
                                    </p>
                                </div>
                            </div>
                            <div>
                               <div className="p-4 bg-secondary rounded-lg flex flex-col items-center">
                                    <WalletCards className="h-6 w-6 text-muted-foreground mb-2" />
                                    <p className="text-sm text-muted-foreground">Rooms Booked</p>
                                    <p className="text-2xl font-bold">{revenueData.totalBookings}</p>
                                </div>
                            </div>
                        </div>
                        <div>
                             <h4 className="text-sm font-medium mb-2 text-center">Payment Breakdown</h4>
                            {revenueData.paymentBreakdown.length > 0 ? (
                                <ul className="space-y-2">
                                    {revenueData.paymentBreakdown.map(item => (
                                        <li key={item.mode} className="flex justify-between items-center text-sm bg-secondary p-2 rounded-md">
                                            <span>{item.mode}</span>
                                            <span className="font-semibold">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(item.amount)}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-muted-foreground text-center">No payments recorded for this day.</p>
                            )}
                        </div>
                    </div>
                ) : <p>No data available.</p>}
            </CardContent>
        </Card>
    );
}
