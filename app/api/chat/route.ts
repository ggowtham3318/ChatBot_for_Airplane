import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// This is a simplified NLP processing function
// In a real application, you would use a more sophisticated NLP library
function processNLPQuery(query: string) {
  const lowerQuery = query.toLowerCase()

  // Check for flight booking intent
  if (lowerQuery.includes("book") && (lowerQuery.includes("flight") || lowerQuery.includes("ticket"))) {
    return {
      intent: "book_flight",
      entities: {},
    }
  }

  // Check for flight status intent
  if (lowerQuery.includes("status") && lowerQuery.includes("flight")) {
    return {
      intent: "flight_status",
      entities: {},
    }
  }

  // Check for cancellation intent
  if (
    lowerQuery.includes("cancel") &&
    (lowerQuery.includes("flight") || lowerQuery.includes("ticket") || lowerQuery.includes("booking"))
  ) {
    return {
      intent: "cancel_booking",
      entities: {},
    }
  }

  // Default to general inquiry
  return {
    intent: "general_inquiry",
    entities: {},
  }
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()

    // Process the message with NLP
    const nlpResult = processNLPQuery(message)

    // Generate a response based on the NLP result
    let response

    switch (nlpResult.intent) {
      case "book_flight":
        response =
          "I can help you book a flight. Could you please tell me your departure city, destination, and preferred travel date?"
        break
      case "flight_status":
        response =
          "To check your flight status, I'll need your flight number or booking reference. Could you please provide that?"
        break
      case "cancel_booking":
        response =
          "I can help you cancel your booking. Please provide your booking reference number so I can locate your reservation."
        break
      default:
        // Use AI to generate a response for general inquiries
        const result = await generateText({
          model: openai("gpt-3.5-turbo"),
          prompt: message,
          system:
            "You are a helpful flight booking assistant. Provide concise and helpful responses about flight bookings, travel information, and airline policies. If asked about booking a flight, suggest using the chat interface to start the booking process.",
        })

        response = result.text
    }

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Error processing chat:", error)
    return NextResponse.json({ error: "Failed to process your request" }, { status: 500 })
  }
}
