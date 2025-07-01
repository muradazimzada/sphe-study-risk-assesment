import { type NextRequest, NextResponse } from "next/server"
import { MongoClient } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://root:rootpassword@localhost:27017"
const DB_NAME = "bshape"
const COLLECTION_NAME = "risk_assessment"

export async function POST(request: NextRequest) {
  try {
    console.log("Received assessment submission request")
    const data = await request.json()

    const client = new MongoClient(MONGODB_URI)
    await client.connect()

    const db = client.db(DB_NAME)
    const collection = db.collection(COLLECTION_NAME)

    const result = await collection.insertOne({
      ...data,
      submittedAt: new Date(),
      ipAddress: request.headers.get("x-forwarded-for") || "unknown",
    })

    await client.close()

    return NextResponse.json({
      success: true,
      id: result.insertedId,
    })
  } catch (error) {
    console.error("Error submitting assessment:", error)
    return NextResponse.json({ success: false, error: "Failed to submit assessment" }, { status: 500 })
  }
}
