'use client';

import { useState, useEffect } from "react";
import { DollarSign, Wallet, Trash2, IndianRupee } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getRevenueForDate, deletePayment } from "@/lib/actions";
import type { DailyRevenue, Payment } from "@/lib/types";
import { useDashboard } from "./dashboard-provider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";

function PaymentItem({ payment, onDelete }: { payment: Payment, onDelete: (paymentId: string) => void }) {
    return (
        <AccordionItem value={payment.id} className="border-b-0">
            <AccordionTrigger className="p-4 hover:no-underline bg-secondary/50 rounded-lg data-[state=open]:rounded-b-none">
                 <div className="flex items-center gap-4 w-full">
                    <Wallet className="h-6 w-6 text-muted-foreground" />
                    <span className="font-medium flex-1 text-left">{payment.mode}</span>
                    <span className="text-lg font-bold">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(payment.amount)}
                    </span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="bg-secondary/50 p-4 rounded-b-lg text-muted-foreground">
               <div className="flex justify-between items-center">
                    <div>
                        <p className="font-semibold text-foreground">Room {payment.roomNumber}</p>
                        <p>Paid on {format(new Date(payment.date), 'MMM dd')}</p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Trash2 className="h-5 w-5 text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the payment and associated booking record.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(payment.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
               </div>
            </AccordionContent>
        </AccordionItem>
    )
}


export default function RevenueSection() {
    const { date, refresh, setRefresh } = useDashboard();
    const { toast } = useToast();
    const [revenueData, setRevenueData] = useState<DailyRevenue | null>(null);
    const [loading, setLoading] = useState(true);
    
    const fetchRevenue = async () => {
        setLoading(true);
        const data = await getRevenueForDate(date);
        setRevenueData(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchRevenue();
        if (refresh) {
            setRefresh(false);
        }
    }, [date, refresh]);

    const handleDeletePayment = async (paymentId: string) => {
        try {
            await deletePayment(paymentId);
            toast({
                title: "Payment Deleted",
                description: "The payment record has been successfully removed.",
            });
            fetchRevenue(); // Refresh the data
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Deletion Failed",
                description: "Could not delete the payment. Please try again.",
            });
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Daily Revenue</CardTitle>
                <CardDescription>Income and payment details for the selected day.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? <p>Loading...</p> : revenueData ? (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                                <div className="p-4 bg-secondary rounded-lg flex flex-col items-center">
                                    <IndianRupee className="h-6 w-6 text-muted-foreground mb-2" />
                                    <p className="text-sm text-muted-foreground">Total Income</p>
                                    <p className="text-2xl font-bold">
                                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(revenueData.totalIncome)}
                                    </p>
                                </div>
                            </div>
                            <div>
                               <div className="p-4 bg-secondary rounded-lg flex flex-col items-center">
                                    <Wallet className="h-6 w-6 text-muted-foreground mb-2" />
                                    <p className="text-sm text-muted-foreground">Transactions</p>
                                    <p className="text-2xl font-bold">{revenueData.totalBookings}</p>
                                </div>
                            </div>
                        </div>
                        <div>
                             <h4 className="text-sm font-medium mb-4 text-center text-muted-foreground">Payment Breakdown</h4>
                            {revenueData.payments.length > 0 ? (
                                <Accordion type="single" collapsible className="w-full space-y-2">
                                    {revenueData.payments.map(item => (
                                        <PaymentItem key={item.id} payment={item} onDelete={handleDeletePayment} />
                                    ))}
                                </Accordion>
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-8">No payments recorded for this day.</p>
                            )}
                        </div>
                    </div>
                ) : <p>No data available.</p>}
            </CardContent>
        </Card>
    );
}
