import { NextResponse } from "next/server"

type Context = {
  params: Promise<{ id: string }>
}

type User = {
  id: number
  name: string
  email: string
}

// mock users database
const users: User[] = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" }
]

/*
Delay helper
Supports:
 /api/users/1?delay=3
*/
async function handleDelay(req: Request) {

  const { searchParams } = new URL(req.url)

  let delay = Number(searchParams.get("delay"))

  if (isNaN(delay)) delay = 0

  if (delay > 60) delay = 60

  if (delay > 0) {
    await new Promise(resolve =>
      setTimeout(resolve, delay * 1000)
    )
  }

}

/*
GET USER
/api/users/1
*/
export async function GET(req: Request, context: Context) {

  await handleDelay(req)

  const { id } = await context.params
  const userId = Number(id)

  const user = users.find(u => u.id === userId)

  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    )
  }

  return NextResponse.json({
    data: user
  })
}

/*
PUT USER (full update)
*/
export async function PUT(req: Request, context: Context) {

  await handleDelay(req)

  const { id } = await context.params

  let body: Partial<User> = {}

  try {
    body = await req.json()
  } catch {
    body = {}
  }

  return NextResponse.json({
    id: Number(id),
    name: body.name ?? "Updated User",
    email: body.email ?? "updated@example.com",
    updatedAt: new Date().toISOString()
  })
}

/*
PATCH USER (partial update)
*/
export async function PATCH(req: Request, context: Context) {

  await handleDelay(req)

  const { id } = await context.params

  let body: Partial<User> = {}

  try {
    body = await req.json()
  } catch {
    body = {}
  }

  return NextResponse.json({
    id: Number(id),
    ...body,
    patchedAt: new Date().toISOString()
  })
}

/*
DELETE USER
*/
export async function DELETE(req: Request, context: Context) {

  await handleDelay(req)

  const { id } = await context.params

  return NextResponse.json({
    message: `User ${id} deleted`,
    deletedAt: new Date().toISOString()
  })
}