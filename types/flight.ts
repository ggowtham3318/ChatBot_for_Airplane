export type FlightSearchResult = {
  id: string
  flightNumber: string
  airline: string
  departureTime: string
  arrivalTime: string
  duration: string
  price: number
  stops: number
}

export type Ticket = {
  bookingReference: string
  passengerName: string
  age: number
  from: string
  to: string
  date: string
  flightNumber: string
  seat: string
  gate: string
  terminal: number
  boardingTime: string
  travelClass: string
  price: number
  bookingDate: string
}
