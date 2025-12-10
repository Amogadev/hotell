'use client';

import { useState, useEffect } from "react";
import { format, startOfDay } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getRevenueForDate } from "@/lib/actions";
import type { DailyRevenue } from "@/lib/types";
import RevenueChart from "./revenue-chart";

export default function RevenueSection() {
    const [date, setDate] = useState<Date>(startOfDay(new Date()));
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                        <CardTitle>Daily Revenue</CardTitle>
                        <CardDescription>Income and payment details for the selected day.</CardDescription>
                    </div>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full sm:w-[240px] justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(newDate) => setDate(newDate || new Date())}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </CardHeader>
            <CardContent>
                {loading ? <p>Loading...</p> : revenueData ? (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Income</p>
                                <p className="text-2xl font-bold">
                                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(revenueData.totalIncome)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Rooms Booked</p>
                                <p className="text-2xl font-bold">{revenueData.totalBookings}</p>
                            </div>
                        </div>
                        <div>
                             <h4 className="text-sm font-medium mb-2 text-center">Payment Breakdown</h4>
                            {revenueData.paymentBreakdown.length > 0 ? (
                                <RevenueChart data={revenueData.paymentBreakdown} />
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
