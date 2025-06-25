"use server"

// This is a mock implementation for demonstration purposes
// In a real application, you would use a database and proper authentication

type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  password: string // In a real app, this would be hashed
}

// In-memory storage for users (temporary storage)
const users: User[] = []

export async function signup(firstName: string, lastName: string, email: string, password: string) {
  // Check if user already exists
  const existingUser = users.find((user) => user.email === email)
  if (existingUser) {
    return { success: false, message: "User with this email already exists" }
  }

  // Create new user
  const newUser: User = {
    id: Date.now().toString(),
    firstName,
    lastName,
    email,
    password, // In a real app, you would hash this password
  }

  // Add user to "database"
  users.push(newUser)

  return { success: true }
}

export async function login(email: string, password: string) {
  // Find user
  const user = users.find((user) => user.email === email)

  // Check if user exists and password matches
  if (!user || user.password !== password) {
    return { success: false, message: "Invalid email or password" }
  }

  // In a real app, you would set a session or JWT token here
  return {
    success: true,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  }
}

// For demo purposes, add a test user
users.push({
  id: "demo-user",
  firstName: "Demo",
  lastName: "User",
  email: "demo@example.com",
  password: "Password1!",
})
