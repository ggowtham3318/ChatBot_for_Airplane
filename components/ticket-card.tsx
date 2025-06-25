"use client"
import { Card, CardContent } from "@/components/ui/card"
import type { Ticket } from "@/types/flight"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

import { useRef } from "react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

type TicketCardProps = {
  ticket: Ticket
}

export function TicketCard({ ticket }: TicketCardProps) {
  const ticketRef = useRef<HTMLDivElement>(null)

  const handleDownload = async () => {
    if (!ticketRef.current) return

    const canvas = await html2canvas(ticketRef.current, { scale: 2 })
    const imgData = canvas.toDataURL("image/png")

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: [canvas.width, canvas.height],
    })

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height)
    pdf.save(`ticket_${ticket.bookingReference}.pdf`)
  }

  return (
    <Card className="overflow-hidden" ref={ticketRef}>
      <div className="bg-blue-600 p-4 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Boarding Pass</h3>
            <p className="text-sm opacity-90">E-Ticket</p>
          </div>
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"></path>
            </svg>
            <span className="font-bold">{ticket.flightNumber}</span>
          </div>
        </div>
      </div>

      <CardContent className="p-0">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Passenger</p>
              <p className="text-lg font-semibold">{ticket.passengerName}</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-sm text-gray-500">Booking Reference</p>
              <p className="text-lg font-semibold">{ticket.bookingReference}</p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">From</p>
              <p className="text-lg font-semibold">{ticket.from}</p>
            </div>
            <div className="flex-1 px-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-dashed border-gray-300"></div>
                </div>
                <div className="relative flex justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="bg-white text-blue-600"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </div>
              </div>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-sm text-gray-500">To</p>
              <p className="text-lg font-semibold">{ticket.to}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-semibold">{ticket.date}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Class</p>
              <p className="font-semibold capitalize">{ticket.travelClass}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Seat</p>
              <p className="font-semibold">{ticket.seat}</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Gate</p>
              <p className="font-semibold">{ticket.gate}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Terminal</p>
              <p className="font-semibold">{ticket.terminal}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Boarding</p>
              <p className="font-semibold">{ticket.boardingTime}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 border-t">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Price</p>
              <p className="text-xl font-bold">₹{ticket.price}</p>
            </div>
            <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700">
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
                className="mr-2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" x2="12" y1="15" y2="3"></line>
              </svg>
              Download Ticket
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
