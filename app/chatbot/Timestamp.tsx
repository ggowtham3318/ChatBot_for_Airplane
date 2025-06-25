"use client"

import React, { useEffect, useState } from "react"

type TimestampProps = {
  timestamp: Date
  role: "user" | "bot"
}

export default function Timestamp({ timestamp, role }: TimestampProps) {
  const [timeString, setTimeString] = useState("")

  useEffect(() => {
    setTimeString(
      timestamp.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    )
  }, [timestamp])

  return <div className={`text-xs mt-1 ${role === "user" ? "text-blue-100" : "text-gray-500"}`}>{timeString}</div>
}
