import { NextResponse, type NextRequest } from "next/server"

// ✅ REQUIRED for static export
export const dynamic = "force-static"

type Context = {
  params: Promise<{ id: string }>
}

type User = {
  id: number
  name: string
  email: string
}

const users: User[] = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" }
]

// ⏱ Delay helper
async function handleDelay(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  let delay = Number(searchParams.get("delay"))
  if (isNaN(delay)) delay = 0
  if (delay > 5) delay = 5

  if (delay > 0) {
    await new Promise((r) => setTimeout(r, delay * 1000))
  }
}

/* ---------------- GET ---------------- */

export async function GET(req: NextRequest, context: Context) {
  await handleDelay(req)

  const { id } = await context.params
  const userId = Number(id)

  if (isNaN(userId)) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
  }

  const user = users.find((u) => u.id === userId)

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  return NextResponse.json({ data: user })
}

/* ---------------- PUT ---------------- */

export async function PUT(req: NextRequest, context: Context) {
  await handleDelay(req)

  const { id } = await context.params

  let body: Partial<User> = {}
  try {
    body = await req.json()
  } catch {}

  return NextResponse.json({
    id: Number(id),
    name: body.name ?? "Updated User",
    email: body.email ?? "updated@example.com",
    updatedAt: new Date().toISOString(),
  })
}

/* ---------------- PATCH ---------------- */

export async function PATCH(req: NextRequest, context: Context) {
  await handleDelay(req)

  const { id } = await context.params

  let body: Partial<User> = {}
  try {
    body = await req.json()
  } catch {}

  return NextResponse.json({
    id: Number(id),
    ...body,
    patchedAt: new Date().toISOString(),
  })
}

/* ---------------- DELETE ---------------- */

export async function DELETE(req: NextRequest, context: Context) {
  await handleDelay(req)

  const { id } = await context.params

  return NextResponse.json({
    message: `User ${id} deleted`,
    deletedAt: new Date().toISOString(),
  })
}

/* ---------------- BLOCK OTHER METHODS ---------------- */

export function POST() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  )
}