import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Ticket } from "@/types/flight"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type BookingSuccessProps = {
  ticket: Ticket
}

export function BookingSuccess({ ticket }: BookingSuccessProps) {
  return (
    <Card>
      <CardHeader className="bg-green-50 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-green-600"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <CardTitle className="text-green-700">Booking Successful</CardTitle>
        </div>
        <CardDescription>Your flight has been successfully booked. Here's what you need to know.</CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">Booking Details</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-500">Booking Reference:</div>
              <div className="font-medium">{ticket.bookingReference}</div>
              <div className="text-gray-500">Booking Date:</div>
              <div className="font-medium">{ticket.bookingDate}</div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Important Information</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-600 mt-0.5"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" x2="12" y1="8" y2="12"></line>
                  <line x1="12" x2="12.01" y1="16" y2="16"></line>
                </svg>
                <span>Please arrive at the airport at least 2 hours before your flight departure time.</span>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-600 mt-0.5"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" x2="12" y1="8" y2="12"></line>
                  <line x1="12" x2="12.01" y1="16" y2="16"></line>
                </svg>
                <span>Carry a valid photo ID for security checks.</span>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-600 mt-0.5"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" x2="12" y1="8" y2="12"></line>
                  <line x1="12" x2="12.01" y1="16" y2="16"></line>
                </svg>
                <span>Check-in counters close 45 minutes before departure.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Need Help?</h3>
            <p className="text-sm">
              If you have any questions or need to make changes to your booking, please contact our customer support at{" "}
              <span className="text-blue-600">support@skychat.com</span> or call{" "}
              <span className="text-blue-600">+91-1234567890</span>.
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4">
          <Link href="/chatbot">
            <Button variant="outline">Back to Chat</Button>
          </Link>
          <Link href="/">
            <Button>Book Another Flight</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
