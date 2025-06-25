"use client"
import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { searchFlights, bookFlight } from "@/app/actions/flight-actions"
import type { FlightSearchResult } from "@/types/flight"
import { BookingDetails } from "@/components/booking-details"
import { TicketCard } from "@/components/ticket-card"
import { BookingSuccess } from "@/components/booking-success"
import Timestamp from "@/app/chatbot/Timestamp"

type Message = {
  id: string
  role: "user" | "bot"
  content: string
  timestamp: Date
}

type BookingState = {
  name: string
  departure: string
  destination: string
  age: string
  travelClass: "economy" | "business" | null
  date: string
  selectedFlight: FlightSearchResult | null
  step: "initial" | "collecting_info" | "searching_flights" | "selecting_flight" | "confirming" | "booked"
}

export default function ChatbotPage() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "bot",
      content: "Hi there! I'm your flight booking assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ])

  const [booking, setBooking] = useState<BookingState>({
    name: "",
    departure: "",
    destination: "",
    age: "",
    travelClass: null,
    date: "",
    selectedFlight: null,
    step: "initial",
  })

  const [searchResults, setSearchResults] = useState<FlightSearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [ticketData, setTicketData] = useState<any>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    await processUserMessage(input)

    setIsLoading(false)
  }

  const processUserMessage = async (message: string) => {
    const lowerMessage = message.toLowerCase()

    if (
      booking.step === "initial" &&
      (lowerMessage.includes("book") || lowerMessage.includes("flight") || lowerMessage.includes("ticket"))
    ) {
      setBooking((prev) => ({ ...prev, step: "collecting_info" }))

      setTimeout(() => {
        addBotMessage("Great! I can help you book a flight. Could you please tell me your name?")
      }, 500)
      return
    }

    if (booking.step === "collecting_info") {
      if (!booking.name) {
        setBooking((prev) => ({ ...prev, name: message }))

        setTimeout(() => {
          addBotMessage(
            `Nice to meet you, ${message}! Where would you like to fly from? (Please provide the city or airport code)`,
          )
        }, 500)
        return
      }

      if (!booking.departure) {
        setBooking((prev) => ({ ...prev, departure: message }))

        setTimeout(() => {
          addBotMessage(`Flying from ${message}. And what's your destination?`)
        }, 500)
        return
      }

      if (!booking.destination) {
        setBooking((prev) => ({ ...prev, destination: message }))

        setTimeout(() => {
          addBotMessage(`Great! When would you like to travel? (Please provide a date in DD/MM/YYYY format)`)
        }, 500)
        return
      }

      if (!booking.date) {
        setBooking((prev) => ({ ...prev, date: message }))

        setTimeout(() => {
          addBotMessage(`Got it! Could you please tell me your age?`)
        }, 500)
        return
      }

      if (!booking.age) {
        setBooking((prev) => ({ ...prev, age: message }))

        setTimeout(() => {
          addBotMessage(`Thank you! Finally, which class would you prefer? Economy or Business?`)
        }, 500)
        return
      }

      if (booking.age && !booking.travelClass) {
        const userInput = lowerMessage.trim()

        if (userInput.includes("economy") || userInput === "economy") {
          setBooking((prev) => ({
            ...prev,
            travelClass: "economy",
            step: "searching_flights",
          }))

          setTimeout(() => {
            addBotMessage(
              `Perfect! Let me search for economy class flights from ${booking.departure} to ${booking.destination} on ${booking.date}...`,
            )
            searchForFlights(booking.departure, booking.destination, booking.date)
          }, 500)
          return
        } else if (userInput.includes("business") || userInput === "business") {
          setBooking((prev) => ({
            ...prev,
            travelClass: "business",
            step: "searching_flights",
          }))

          setTimeout(() => {
            addBotMessage(
              `Perfect! Let me search for business class flights from ${booking.departure} to ${booking.destination} on ${booking.date}...`,
            )
            searchForFlights(booking.departure, booking.destination, booking.date)
          }, 500)
          return
        } else {
          setTimeout(() => {
            addBotMessage(
              `I'm sorry, I didn't catch that. Please type either "Economy" or "Business" to select your preferred class.`,
            )
          }, 500)
          return
        }
      }
    }

      if (booking.step === "selecting_flight" && searchResults.length > 0) {
      const flightIndex = Number.parseInt(message) - 1
      let selectedFlight = null

      if (!isNaN(flightIndex) && flightIndex >= 0 && flightIndex < searchResults.length) {
        selectedFlight = searchResults[flightIndex]
      } else {
        selectedFlight = searchResults.find((flight) => flight.flightNumber.toLowerCase() === message.toLowerCase())
      }

      if (selectedFlight) {
        setBooking((prev) => ({
          ...prev,
          selectedFlight,
          step: "confirming",
          travelClass: prev.travelClass ?? "economy",
        }))

          setTimeout(() => {
            addBotMessage(`You've selected flight ${selectedFlight.flightNumber} from ${booking.departure} to ${booking.destination}.
          
Would you like to confirm this booking?
- Passenger: ${booking.name}
- Age: ${booking.age}
- Class: ${booking.travelClass ?? "unspecified"}
- Date: ${booking.date}
- Price: ₹${selectedFlight.price}

Please type "confirm" to proceed with booking or "cancel" to start over.`)
          }, 500)
      } else {
        setTimeout(() => {
          addBotMessage(
            `I couldn't find that flight. Please select a flight by typing its number (1-${searchResults.length}) or the flight number.`,
          )
        }, 500)
      }
      return
    }


    if (booking.step === "confirming" && booking.selectedFlight) {
      if (lowerMessage.includes("confirm") || lowerMessage.includes("yes") || lowerMessage === "y") {
        setBooking((prev) => ({ ...prev, step: "booked" }))
          const bookingResult = await bookFlight({
            passengerName: booking.name,
            age: Number.parseInt(booking.age),
            from: booking.departure,
            to: booking.destination,
            date: booking.date,
            flightNumber: booking.selectedFlight.flightNumber,
            travelClass: booking.travelClass ?? "economy",
            price: booking.selectedFlight.price,
          })

        if (bookingResult.success) {
          if (bookingResult.ticket) {
            setTicketData(bookingResult.ticket)
          }

          setTimeout(() => {
            addBotMessage(`Congratulations! Your flight has been booked successfully. Your booking reference is ${bookingResult.ticket?.bookingReference}.
            
Your e-ticket has been generated and is ready for download. You can view it in the "My Ticket" tab.

Thank you for booking with us! Is there anything else I can help you with?`)
          }, 500)
        } else {
          setTimeout(() => {
            addBotMessage(`I'm sorry, there was an error booking your flight. Please try again later.`)
            setBooking((prev) => ({ ...prev, step: "initial" }))
          }, 500)
        }
      } else if (lowerMessage.includes("cancel") || lowerMessage.includes("no") || lowerMessage === "n") {
        setBooking({
          name: "",
          departure: "",
          destination: "",
          age: "",
          travelClass: "economy",
          date: "",
          selectedFlight: null,
          step: "initial",
        })

        setTimeout(() => {
          addBotMessage(`Booking cancelled. How else can I help you today?`)
        }, 500)
      } else {
        setTimeout(() => {
          addBotMessage(`Please type "confirm" to proceed with booking or "cancel" to start over.`)
        }, 500)
      }
      return
    }

    setTimeout(() => {
      if (booking.step === "initial") {
        addBotMessage("I can help you book a flight. Just let me know when you're ready to book.")
      } else {
        addBotMessage("I didn't understand that. Could you please try again?")
      }
    }, 500)
  }

  const searchForFlights = async (from: string, to: string, date: string) => {
    try {
      const results = await searchFlights(from, to, date)
      setSearchResults(results)

      if (results.length > 0) {
        setBooking((prev) => ({ ...prev, step: "selecting_flight" }))

        let flightListMessage = `I found ${results.length} flights from ${from} to ${to} on ${date}:\n\n`

        results.forEach((flight, index) => {
          flightListMessage += `${index + 1}. Flight ${flight.flightNumber} - ${flight.departureTime} to ${flight.arrivalTime} - ₹${flight.price} (${flight.airline})\n`
        })

        flightListMessage +=
          "\nPlease select a flight by typing its number (1-" + results.length + ") or the flight number."

        addBotMessage(flightListMessage)
      } else {
        addBotMessage(
          `I'm sorry, I couldn't find any flights from ${from} to ${to} on ${date}. Would you like to try different dates or destinations?`,
        )
        setBooking((prev) => ({ ...prev, step: "initial" }))
      }
    } catch (error) {
      console.error("Error searching flights:", error)
      addBotMessage("I'm sorry, there was an error searching for flights. Please try again later.")
      setBooking((prev) => ({ ...prev, step: "initial" }))
    }
  }

  const addBotMessage = (content: string) => {
    const botMessage: Message = {
      id: Date.now().toString(),
      role: "bot",
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, botMessage])
  }

  const resetBooking = () => {
    setBooking({
      name: "",
      departure: "",
      destination: "",
      age: "",
      travelClass: "economy",
      date: "",
      selectedFlight: null,
      step: "initial",
    })
    setTicketData(null)
    setSearchResults([])

    addBotMessage("Let's start over. How can I help you today?")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-blue-50">
      <div className="container mx-auto p-4">
        <header className="flex justify-between items-center mb-6">
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
              className="text-blue-600"
            >
              <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"></path>
            </svg>
            <h1 className="text-2xl font-bold text-blue-600">SkyChat</h1>
          </div>
          <Button variant="outline" onClick={resetBooking}>
            New Booking
          </Button>
        </header>

        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="booking">
              Booking Details
              {booking.step !== "initial" && (
                <Badge variant="secondary" className="ml-2">
                  {booking.step === "booked" ? "Complete" : "In Progress"}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="ticket" disabled={!ticketData}>
              My Ticket
              {ticketData && (
                <Badge variant="secondary" className="ml-2">
                  1
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-4">
            <Card className="h-[calc(100vh-240px)] flex flex-col">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                        <Avatar className={message.role === "user" ? "bg-blue-600" : "bg-gray-200"}>
                          <AvatarFallback>{message.role === "user" ? "U" : "B"}</AvatarFallback>
                        </Avatar>
                        <div
                          className={`rounded-lg p-4 ${
                            message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
                          }`}
                        >
                          <div className="whitespace-pre-line">{message.content}</div>
                          <Timestamp timestamp={message.timestamp} role={message.role} />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    ref={inputRef}
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                  />
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
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
                      >
                        <path d="m22 2-7 20-4-9-9-4Z" />
                        <path d="M22 2 11 13" />
                      </svg>
                    )}
                  </Button>
                </form>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="booking">
          <BookingDetails booking={{ ...booking, travelClass: booking.travelClass ?? "economy" }} searchResults={searchResults} />
          </TabsContent>

          <TabsContent value="ticket">
            {ticketData ? (
              <div className="space-y-6">
                <TicketCard ticket={ticketData} />
                <BookingSuccess ticket={ticketData} />
              </div>
            ) : (
              <Card className="p-8 text-center">
                <p className="text-gray-500">No tickets available. Book a flight to see your ticket here.</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
