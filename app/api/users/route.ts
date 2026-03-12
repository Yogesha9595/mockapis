import { NextResponse } from "next/server"

type User = {
  id: number
  name: string
  email: string
}

// mock database
const users: User[] = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" }
]

/*
GET /api/users
Supports delay simulation:
GET /api/users?delay=3
*/
export async function GET(req: Request) {

  const { searchParams } = new URL(req.url)

  const delayParam = searchParams.get("delay")

  let delay = Number(delayParam)

  if (isNaN(delay)) delay = 0

  // limit delay to max 60 seconds
  if (delay > 60) delay = 60

  if (delay > 0) {
    await new Promise((resolve) =>
      setTimeout(resolve, delay * 1000)
    )
  }

  return NextResponse.json({
    page: 1,
    per_page: 6,
    total: users.length,
    delay,
    data: users
  })
}

/*
POST /api/users
Create user
*/
export async function POST(req: Request) {

  let body: Partial<User> = {}

  try {
    body = await req.json()
  } catch {
    body = {}
  }

  const newUser = {
    id: Math.floor(Math.random() * 10000),
    name: body.name ?? "Mock User",
    email: body.email ?? "mock@example.com",
    createdAt: new Date().toISOString()
  }

  return NextResponse.json(newUser, { status: 201 })
}