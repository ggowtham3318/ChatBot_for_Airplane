"use server"

import type { FlightSearchResult, Ticket } from "@/types/flight"

// Mock flight data for demonstration
const mockFlights: Record<string, FlightSearchResult[]> = {
  "delhi-mumbai": [
    {
      id: "AI101",
      flightNumber: "AI101",
      airline: "Air India",
      departureTime: "08:00",
      arrivalTime: "10:15",
      duration: "2h 15m",
      price: 5200,
      stops: 0,
    },
    {
      id: "6E234",
      flightNumber: "6E234",
      airline: "IndiGo",
      departureTime: "10:30",
      arrivalTime: "12:40",
      duration: "2h 10m",
      price: 4800,
      stops: 0,
    },
    {
      id: "SG512",
      flightNumber: "SG512",
      airline: "SpiceJet",
      departureTime: "14:15",
      arrivalTime: "16:30",
      duration: "2h 15m",
      price: 4500,
      stops: 0,
    },
  ],
  "mumbai-delhi": [
    {
      id: "AI102",
      flightNumber: "AI102",
      airline: "Air India",
      departureTime: "09:30",
      arrivalTime: "11:45",
      duration: "2h 15m",
      price: 5100,
      stops: 0,
    },
    {
      id: "6E235",
      flightNumber: "6E235",
      airline: "IndiGo",
      departureTime: "12:00",
      arrivalTime: "14:10",
      duration: "2h 10m",
      price: 4700,
      stops: 0,
    },
  ],
  "delhi-bangalore": [
    {
      id: "AI201",
      flightNumber: "AI201",
      airline: "Air India",
      departureTime: "07:30",
      arrivalTime: "10:15",
      duration: "2h 45m",
      price: 6200,
      stops: 0,
    },
    {
      id: "UK811",
      flightNumber: "UK811",
      airline: "Vistara",
      departureTime: "11:00",
      arrivalTime: "13:50",
      duration: "2h 50m",
      price: 6800,
      stops: 0,
    },
  ],
  "bangalore-delhi": [
    {
      id: "AI202",
      flightNumber: "AI202",
      airline: "Air India",
      departureTime: "15:30",
      arrivalTime: "18:15",
      duration: "2h 45m",
      price: 6100,
      stops: 0,
    },
    {
      id: "UK812",
      flightNumber: "UK812",
      airline: "Vistara",
      departureTime: "19:00",
      arrivalTime: "21:50",
      duration: "2h 50m",
      price: 6700,
      stops: 0,
    },
  ],
  "mumbai-bangalore": [
    {
      id: "6E345",
      flightNumber: "6E345",
      airline: "IndiGo",
      departureTime: "08:45",
      arrivalTime: "10:30",
      duration: "1h 45m",
      price: 3800,
      stops: 0,
    },
    {
      id: "SG678",
      flightNumber: "SG678",
      airline: "SpiceJet",
      departureTime: "13:20",
      arrivalTime: "15:05",
      duration: "1h 45m",
      price: 3500,
      stops: 0,
    },
  ],
  "bangalore-mumbai": [
    {
      id: "6E346",
      flightNumber: "6E346",
      airline: "IndiGo",
      departureTime: "11:30",
      arrivalTime: "13:15",
      duration: "1h 45m",
      price: 3900,
      stops: 0,
    },
    {
      id: "SG679",
      flightNumber: "SG679",
      airline: "SpiceJet",
      departureTime: "16:00",
      arrivalTime: "17:45",
      duration: "1h 45m",
      price: 3600,
      stops: 0,
    },
  ],
}

// Function to normalize city names
function normalizeCity(city: string): string {
  return city.trim().toLowerCase()
}

// Function to get route key
function getRouteKey(from: string, to: string): string {
  return `${normalizeCity(from)}-${normalizeCity(to)}`
}

// Function to search for flights
export async function searchFlights(from: string, to: string, date: string): Promise<FlightSearchResult[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const routeKey = getRouteKey(from, to)

  // If we have mock data for this route, return it
  if (mockFlights[routeKey]) {
    return mockFlights[routeKey]
  }

  // For any other routes, generate some random flights
  if (normalizeCity(from) !== normalizeCity(to)) {
    const airlines = ["Air India", "IndiGo", "SpiceJet", "Vistara", "GoAir"]
    const randomFlights: FlightSearchResult[] = []

    // Generate 1-3 random flights
    const numFlights = Math.floor(Math.random() * 3) + 1

    for (let i = 0; i < numFlights; i++) {
      const airline = airlines[Math.floor(Math.random() * airlines.length)]
      const airlineCode =
        airline === "Air India"
          ? "AI"
          : airline === "IndiGo"
            ? "6E"
            : airline === "SpiceJet"
              ? "SG"
              : airline === "Vistara"
                ? "UK"
                : "G8"

      const flightNumber = `${airlineCode}${Math.floor(Math.random() * 900) + 100}`

      // Random departure hour between 6 and 20
      const departureHour = Math.floor(Math.random() * 15) + 6
      const departureMinute = Math.random() > 0.5 ? "00" : "30"
      const departureTime = `${departureHour.toString().padStart(2, "0")}:${departureMinute}`

      // Random duration between 1h 30m and 3h 30m
      const durationMinutes = Math.floor(Math.random() * 120) + 90
      const durationHours = Math.floor(durationMinutes / 60)
      const remainingMinutes = durationMinutes % 60
      const duration = `${durationHours}h ${remainingMinutes}m`

      // Calculate arrival time
      const arrivalHour =
        (departureHour + durationHours + (Number.parseInt(departureMinute) + remainingMinutes >= 60 ? 1 : 0)) % 24
      const arrivalMinute = (Number.parseInt(departureMinute) + remainingMinutes) % 60
      const arrivalTime = `${arrivalHour.toString().padStart(2, "0")}:${arrivalMinute.toString().padStart(2, "0")}`

      // Random price between 3000 and 8000
      const price = Math.floor(Math.random() * 5000) + 3000

      randomFlights.push({
        id: flightNumber,
        flightNumber,
        airline,
        departureTime,
        arrivalTime,
        duration,
        price,
        stops: 0,
      })
    }

    return randomFlights
  }

  // If from and to are the same, return empty array
  return []
}

// Function to book a flight
export async function bookFlight(bookingDetails: {
  passengerName: string
  age: number
  from: string
  to: string
  date: string
  flightNumber: string
  travelClass: string
  price: number
}): Promise<{ success: boolean; ticket?: Ticket }> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Generate a random booking reference
  const bookingReference = Math.random().toString(36).substring(2, 10).toUpperCase()

  // Generate a random seat
  const row = Math.floor(Math.random() * 30) + 1
  const seatLetter = String.fromCharCode(65 + Math.floor(Math.random() * 6)) // A to F
  const seat = `${row}${seatLetter}`

  // Generate gate and terminal
  const gate = `${String.fromCharCode(65 + Math.floor(Math.random() * 8))}${Math.floor(Math.random() * 20) + 1}`
  const terminal = Math.floor(Math.random() * 3) + 1

  // Create ticket
  const ticket: Ticket = {
    bookingReference,
    passengerName: bookingDetails.passengerName,
    age: bookingDetails.age,
    from: bookingDetails.from,
    to: bookingDetails.to,
    date: bookingDetails.date,
    flightNumber: bookingDetails.flightNumber,
    seat,
    gate,
    terminal,
    boardingTime: "30 minutes before departure",
    travelClass: bookingDetails.travelClass,
    price: bookingDetails.price,
    bookingDate: new Date().toISOString().split("T")[0],
  }

  return {
    success: true,
    ticket,
  }
}
