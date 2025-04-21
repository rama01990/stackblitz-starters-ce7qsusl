import { type NextRequest, NextResponse } from "next/server"
import {
  getOrCreateInterviewSession,
  startInterview,
  processResponse,
  completeInterview,
  analyzeInterviewResults,
} from "@/app/actions/interview-actions"
import { AI_CONFIG } from "@/app/env"

// Get interview session
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const interviewId = params.id
    const session = await getOrCreateInterviewSession(interviewId)

    // Add a flag to indicate if we're in simulation mode due to missing API key
    const isSimulationMode = !AI_CONFIG.hasOpenAIKey || AI_CONFIG.simulation.forceSimulation

    return NextResponse.json({
      success: true,
      session,
      isSimulationMode,
      simulationReason: !AI_CONFIG.hasOpenAIKey
        ? "missing_api_key"
        : AI_CONFIG.simulation.forceSimulation
          ? "forced"
          : null,
    })
  } catch (error) {
    console.error("Error getting interview:", error)
    return NextResponse.json({ success: false, error: "Failed to get interview" }, { status: 500 })
  }
}

// Start, process response, or complete interview
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const interviewId = params.id
    const { action, response } = await request.json()

    switch (action) {
      case "start":
        const startedSession = await startInterview(interviewId)
        return NextResponse.json({
          success: true,
          session: startedSession,
          initialQuestion: startedSession.conversation[0]?.content,
          isSimulationMode: !AI_CONFIG.hasOpenAIKey || AI_CONFIG.simulation.forceSimulation,
        })

      case "response":
        if (!response) {
          return NextResponse.json({ success: false, error: "Response is required" }, { status: 400 })
        }

        const { nextQuestion, updatedSession } = await processResponse(interviewId, response)
        return NextResponse.json({
          success: true,
          nextQuestion,
          session: updatedSession,
        })

      case "complete":
        const completedSession = await completeInterview(interviewId)
        return NextResponse.json({
          success: true,
          session: completedSession,
        })

      case "analyze":
        const analysis = await analyzeInterviewResults(interviewId)
        return NextResponse.json({
          success: true,
          analysis,
        })

      default:
        return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error processing interview action:", error)
    return NextResponse.json({ success: false, error: "Failed to process interview action" }, { status: 500 })
  }
}
