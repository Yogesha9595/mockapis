import { NextResponse } from "next/server"

// ✅ REQUIRED for static export (CRITICAL FIX)
export const dynamic = "force-static"

export async function GET() {
  return NextResponse.json({
    name: "MockAPIs Demo API",
    description: "Free mock APIs for testing and learning API development.",
    version: "1.0",

    endpoints: {
      users: {
        list: "/api/users",
        single: "/api/users/1",
        create: "POST /api/users",
        update: "PUT /api/users/1",
        delete: "DELETE /api/users/1"
      },

      auth: {
        login: "POST /api/login",
        register: "POST /api/register"
      },

      products: {
        list: "/api/products",
        single: "/api/products/1"
      }
    }
  })
}

// ❌ Block all other methods (good practice)
export function POST() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  )
}

export function PUT() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  )
}

export function DELETE() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  )
}

export function PATCH() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  )
}