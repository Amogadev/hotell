'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { CalendarIcon, AlertTriangle, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { smartStatusPrompt, SmartStatusPromptOutput } from '@/ai/flows/smart-status-prompt';
import type { PaymentMode } from '@/lib/types';
import { createBooking } from '@/lib/actions';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

const bookingSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  checkInDate: z.date({ required_error: 'Check-in date is required.' }),
  checkOutDate: z.date({ required_error: 'Check-out date is required.' }),
  numberOfPersons: z.coerce.number().min(1, 'At least one person is required'),
  paymentMode: z.enum(['UPI', 'Cash', 'GPay', 'PhonePe', 'Net Banking']),
  advancePayment: z.coerce.number().min(0, 'Advance payment cannot be negative'),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface BookingDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    roomNumber: string;
    onBookingSuccess: () => void;
}

export default function BookingDialog({ isOpen, setIsOpen, roomNumber, onBookingSuccess }: BookingDialogProps) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAiReviewing, setIsAiReviewing] = useState(false);
    const [aiFlags, setAiFlags] = useState<SmartStatusPromptOutput['flags']>([]);

    const form = useForm<BookingFormValues>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            customerName: '',
            numberOfPersons: 1,
            advancePayment: 0,
        }
    });

    const handleAiReview = async () => {
        setIsAiReviewing(true);
        setAiFlags([]);
        const values = form.getValues();
        
        const inputForAi = {
            customerName: values.customerName || 'Not provided',
            checkInDate: values.checkInDate ? format(values.checkInDate, 'yyyy-MM-dd') : 'Not provided',
            checkOutDate: values.checkOutDate ? format(values.checkOutDate, 'yyyy-MM-dd') : 'Not provided',
            numberOfPersons: values.numberOfPersons || 0,
            paymentMode: values.paymentMode || 'Not provided'
        }

        try {
            const result = await smartStatusPrompt(inputForAi);
            setAiFlags(result.flags);
            if (result.flags.length > 0) {
                 toast({
                    title: "AI Review Complete",
                    description: "The AI found some potential issues with your input.",
                });
            } else {
                 toast({
                    title: "AI Review Complete",
                    description: "Everything looks good!",
                });
            }
        } catch (error) {
            console.error("AI review failed:", error);
            toast({
                variant: 'destructive',
                title: "AI Review Failed",
                description: "Could not complete the AI review.",
            });
        } finally {
            setIsAiReviewing(false);
        }
    }

    const onSubmit = async (data: BookingFormValues) => {
        setIsSubmitting(true);
        try {
            await createBooking({
                roomNumber,
                guestName: data.customerName,
                checkInDate: format(data.checkInDate, 'yyyy-MM-dd'),
                checkOutDate: format(data.checkOutDate, 'yyyy-MM-dd'),
                numberOfPersons: data.numberOfPersons,
                paymentMode: data.paymentMode as PaymentMode,
                advancePayment: data.advancePayment
            });
            toast({
                title: 'Booking Successful!',
                description: `Room ${roomNumber} has been booked for ${data.customerName}.`,
            });
            onBookingSuccess();
            setIsOpen(false);
            form.reset();
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Booking Failed',
                description: 'There was an error creating the booking. Please try again.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const getFlagForField = (fieldName: keyof BookingFormValues) => {
        return aiFlags.find(flag => flag.field.toLowerCase().replace(/\s+/g, '') === fieldName.toLowerCase().replace(/\s+/g, ''));
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Book Room {roomNumber}</DialogTitle>
                    <DialogDescription>Enter guest details to book this room.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <TooltipProvider>
                            <FormField
                                control={form.control}
                                name="customerName"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center justify-between">
                                            <FormLabel>Customer Name</FormLabel>
                                            {getFlagForField('customerName') && (
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                         <AlertTriangle className="h-4 w-4 text-amber-500" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{getFlagForField('customerName')?.reason}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            )}
                                        </div>
                                        <FormControl>
                                            <Input placeholder="John Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="checkInDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <div className="flex items-center justify-between">
                                            <FormLabel>Check-in Date</FormLabel>
                                             {getFlagForField('checkInDate') && (
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                         <AlertTriangle className="h-4 w-4 text-amber-500" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{getFlagForField('checkInDate')?.reason}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            )}
                                        </div>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                                                    >
                                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="checkOutDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                       <div className="flex items-center justify-between">
                                            <FormLabel>Check-out Date</FormLabel>
                                            {getFlagForField('checkOutDate') && (
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                         <AlertTriangle className="h-4 w-4 text-amber-500" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{getFlagForField('checkOutDate')?.reason}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            )}
                                        </div>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                                                    >
                                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="numberOfPersons"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center justify-between">
                                            <FormLabel>Number of Persons</FormLabel>
                                            {getFlagForField('numberOfPersons') && (
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                         <AlertTriangle className="h-4 w-4 text-amber-500" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{getFlagForField('numberOfPersons')?.reason}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            )}
                                        </div>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="paymentMode"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center justify-between">
                                            <FormLabel>Payment Mode</FormLabel>
                                            {getFlagForField('paymentMode') && (
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                         <AlertTriangle className="h-4 w-4 text-amber-500" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{getFlagForField('paymentMode')?.reason}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            )}
                                        </div>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a payment mode" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="UPI">UPI</SelectItem>
                                                <SelectItem value="Cash">Cash</SelectItem>
                                                <SelectItem value="GPay">GPay</SelectItem>
                                                <SelectItem value="PhonePe">PhonePe</SelectItem>
                                                <SelectItem value="Net Banking">Net Banking</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="advancePayment"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center justify-between">
                                            <FormLabel>Advance Payment</FormLabel>
                                        </div>
                                        <FormControl>
                                            <Input type="number" placeholder="Enter advance amount" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </TooltipProvider>

                        <DialogFooter className="sm:justify-between gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={handleAiReview} disabled={isAiReviewing}>
                                <Sparkles className="mr-2 h-4 w-4" />
                                {isAiReviewing ? 'Reviewing...' : 'AI Review'}
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Booking...' : 'Confirm Booking'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
