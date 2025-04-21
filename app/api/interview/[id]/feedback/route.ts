import { type NextRequest, NextResponse } from "next/server"

// In a real app, this would save to a database
const feedbackStore = new Map<string, { rating: number; comment: string }>()

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const interviewId = params.id
    const { rating, comment } = await request.json()

    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ success: false, error: "Invalid rating" }, { status: 400 })
    }

    // Store feedback
    feedbackStore.set(interviewId, { rating, comment: comment || "" })

    // In a real app, you would save this to a database
    console.log(`Feedback for interview ${interviewId}:`, { rating, comment })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving feedback:", error)
    return NextResponse.json({ success: false, error: "Failed to save feedback" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const interviewId = params.id
    const feedback = feedbackStore.get(interviewId)

    if (!feedback) {
      return NextResponse.json({ success: false, error: "Feedback not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, feedback })
  } catch (error) {
    console.error("Error getting feedback:", error)
    return NextResponse.json({ success: false, error: "Failed to get feedback" }, { status: 500 })
  }
}
