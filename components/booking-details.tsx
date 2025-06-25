import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { FlightSearchResult } from "@/types/flight"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

type BookingDetailsProps = {
  booking: {
    name: string
    departure: string
    destination: string
    age: string
    travelClass: "economy" | "business"
    date: string
    selectedFlight: FlightSearchResult | null
    step: string
  }
  searchResults: FlightSearchResult[]
}

export function BookingDetails({ booking, searchResults }: BookingDetailsProps) {
  const getStepBadge = (step: string) => {
    switch (step) {
      case "initial":
        return <Badge variant="outline">Not Started</Badge>
      case "collecting_info":
        return <Badge variant="secondary">Collecting Info</Badge>
      case "searching_flights":
        return <Badge variant="secondary">Searching</Badge>
      case "selecting_flight":
        return <Badge variant="secondary">Selecting Flight</Badge>
      case "confirming":
        return <Badge variant="secondary">Confirming</Badge>
      case "booked":
        return (
          <Badge variant="success" className="bg-green-500 text-white">
            Booked
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  if (booking.step === "initial") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
          <CardDescription>No active booking in progress</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Start a conversation with the chatbot to book a flight.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Booking Details</CardTitle>
          {getStepBadge(booking.step)}
        </div>
        <CardDescription>
          {booking.step === "booked" ? "Your flight has been successfully booked" : "Your booking is in progress"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500">Passenger Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Name</p>
              <p className="text-lg">{booking.name || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Age</p>
              <p className="text-lg">{booking.age || "Not provided"}</p>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500">Flight Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">From</p>
              <p className="text-lg">{booking.departure || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm font-medium">To</p>
              <p className="text-lg">{booking.destination || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Date</p>
              <p className="text-lg">{booking.date || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Class</p>
              <p className="text-lg capitalize">{booking.travelClass || "Not provided"}</p>
            </div>
          </div>
        </div>

        {(booking.step === "selecting_flight" || booking.step === "confirming" || booking.step === "booked") &&
          searchResults.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">Available Flights</h3>
                <div className="space-y-4">
                  {searchResults.map((flight) => (
                    <div
                      key={flight.id}
                      className={`p-4 rounded-lg border ${booking.selectedFlight?.id === flight.id ? "border-blue-500 bg-blue-50" : ""}`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">{flight.airline}</div>
                        <div className="text-sm text-gray-500">Flight {flight.flightNumber}</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-lg font-semibold">{flight.departureTime}</div>
                        <div className="flex-1 mx-4">
                          <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                              <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                              <span className="bg-white px-2 text-gray-500">{flight.duration}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-lg font-semibold">{flight.arrivalTime}</div>
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          {flight.stops === 0 ? "Direct" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
                        </div>
                        <div className="font-semibold">₹{flight.price}</div>
                      </div>
                      {booking.selectedFlight?.id === flight.id && <Badge className="mt-2 bg-blue-500">Selected</Badge>}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
      </CardContent>
    </Card>
  )
}
