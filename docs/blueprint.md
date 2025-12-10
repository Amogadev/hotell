# **App Name**: HotelVerse

## Core Features:

- Login Authentication: Secure login page with email/password authentication using Firebase Authentication.
- Summary Header: Display real-time stats for total rooms, available rooms, and occupied rooms fetched from Firestore.
- Calendar-Based Room Updates: Interactive calendar to view room status for any selected date, pulling data from Firestore bookings collection.
- Room Cards & Booking: Interactive room cards (rooms 1-7) with real-time status updates, booking forms, and auto-update Firestore with customer & payment information.
- Payment Details Dashboard: Daily revenue dashboard with filters to show total bookings, income, and payment breakdowns (UPI, Cash, GPay, etc.) from Firestore.
- Backend Automation: Automated room status updates and daily income calculations using Cloud Functions.
- Smart Status Prompt: Generative AI tool which reviews the user input (Customer Name, Check-in date, Check-out date, Number of persons, Payment mode) in the booking form and flags any fields which are incomplete or suspicious

## Style Guidelines:

- Primary color: Soft lavender (#E6E6FA) for a calm, inviting feel.
- Background color: Very light grey (#F5F5F5) provides a clean backdrop.
- Accent color: Dusty rose (#D8BFD8) to highlight interactive elements.
- Body and headline font: 'PT Sans' for a modern yet approachable look.
- Clean, minimalist icons for easy navigation and visual clarity.
- Responsive dashboard layout ensuring seamless use on various devices.
- Subtle animations for booking confirmations and payment success alerts.