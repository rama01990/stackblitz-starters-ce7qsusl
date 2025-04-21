"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Types for our interview data
export type InterviewSession = {
  id: string
  jobId: string
  candidateId: string
  status: "pending" | "in-progress" | "completed"
  startTime?: Date
  endTime?: Date
  conversation: Message[]
  skills: string[]
  jobTitle: string
  candidateName: string
}

export type Message = {
  role: "ai" | "user"
  content: string
  timestamp: string
  analyzed?: boolean
  skillsDetected?: string[]
  confidenceScore?: number
}

// In-memory store for demo purposes
// In a real app, this would be a database
const interviewSessions = new Map<string, InterviewSession>()

// Sample job data
const jobs = [
  {
    id: "job-1",
    title: "UX Designer",
    skills: ["UI/UX", "Figma", "User Research", "Prototyping"],
    description: "We are looking for a talented UX Designer to create amazing user experiences.",
  },
  {
    id: "job-2",
    title: "Senior React Developer",
    skills: ["React", "TypeScript", "Redux", "CSS"],
    description:
      "We are looking for a Senior React Developer with experience in building high-performance web applications.",
  },
]

// Initialize or get an interview session
export async function getOrCreateInterviewSession(interviewId: string): Promise<InterviewSession> {
  if (interviewSessions.has(interviewId)) {
    return interviewSessions.get(interviewId)!
  }

  // For demo purposes, create a new session with sample data
  // In a real app, you would fetch this from a database
  const jobIndex = Math.floor(Math.random() * jobs.length)
  const job = jobs[jobIndex]

  const newSession: InterviewSession = {
    id: interviewId,
    jobId: job.id,
    candidateId: `candidate-${Date.now()}`,
    status: "pending",
    conversation: [],
    skills: job.skills,
    jobTitle: job.title,
    candidateName: "Candidate",
  }

  interviewSessions.set(interviewId, newSession)
  return newSession
}

// Start an interview
export async function startInterview(interviewId: string): Promise<InterviewSession> {
  const session = await getOrCreateInterviewSession(interviewId)

  if (session.status === "pending") {
    session.status = "in-progress"
    session.startTime = new Date()

    // Add initial greeting
    const greeting = await generateInterviewGreeting(session.jobTitle)
    session.conversation.push({
      role: "ai",
      content: greeting,
      timestamp: new Date().toISOString(),
    })

    interviewSessions.set(interviewId, session)
  }

  return session
}

// Generate an interview greeting using AI or fallback to predefined greeting
async function generateInterviewGreeting(jobTitle: string): Promise<string> {
  try {
    // Check if we have an OpenAI API key in the environment
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      // If no API key, use a fallback greeting
      console.log("No OpenAI API key found, using fallback greeting")
      return getDefaultGreeting(jobTitle)
    }

    const { text } = await generateText({
      model: openai("gpt-3.5-turbo"),
      prompt: `You are an AI interviewer. Generate a friendly greeting for a candidate interviewing for a ${jobTitle} position. Keep it brief and professional.`,
      maxTokens: 100,
    })
    return text.trim()
  } catch (error) {
    console.error("Error generating greeting:", error)
    // Return a default greeting if AI generation fails
    return getDefaultGreeting(jobTitle)
  }
}

// Default greeting function to use when AI is not available
function getDefaultGreeting(jobTitle: string): string {
  const greetings = [
    `Hello! Welcome to your interview for the ${jobTitle} position. I'll be asking you some questions to learn more about your experience and skills.`,
    `Hi there! I'm your AI interviewer for the ${jobTitle} role. I'm looking forward to learning about your background and qualifications.`,
    `Welcome to your ${jobTitle} interview! I'll be guiding you through a series of questions to assess your fit for this role.`,
    `Thank you for joining us today for your ${jobTitle} interview. I'm excited to learn more about your skills and experience.`,
  ]

  // Return a random greeting from the list
  return greetings[Math.floor(Math.random() * greetings.length)]
}

// Process a candidate response and get the next question
export async function processResponse(
  interviewId: string,
  response: string,
): Promise<{ nextQuestion: string; updatedSession: InterviewSession }> {
  const session = await getOrCreateInterviewSession(interviewId)

  if (session.status !== "in-progress") {
    throw new Error("Interview is not in progress")
  }

  // Add user response to conversation
  session.conversation.push({
    role: "user",
    content: response,
    timestamp: new Date().toISOString(),
  })

  // Generate next question based on conversation history and job skills
  const nextQuestion = await generateNextQuestion(session)

  // Add AI question to conversation
  session.conversation.push({
    role: "ai",
    content: nextQuestion,
    timestamp: new Date().toISOString(),
  })

  // Update session
  interviewSessions.set(interviewId, session)

  return { nextQuestion, updatedSession: session }
}

// Generate the next interview question using AI or fallback to predefined questions
async function generateNextQuestion(session: InterviewSession): Promise<string> {
  // Check if we should end the interview
  if (session.conversation.length >= 10) {
    return "Thank you for your responses. That concludes our interview. We'll be in touch with next steps soon."
  }

  try {
    // Check if we have an OpenAI API key in the environment
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      // If no API key, use a fallback question
      console.log("No OpenAI API key found, using fallback question")
      return getDefaultQuestion(session)
    }

    // Create a context from the conversation history
    const conversationContext = session.conversation
      .map((msg) => `${msg.role === "ai" ? "Interviewer" : "Candidate"}: ${msg.content}`)
      .join("\n")

    const { text } = await generateText({
      model: openai("gpt-3.5-turbo"),
      prompt: `You are conducting an interview for a ${session.jobTitle} position. 
      The required skills are: ${session.skills.join(", ")}.
      
      Here's the conversation so far:
      ${conversationContext}
      
      Generate the next interview question. Focus on assessing the candidate's skills and experience relevant to the position.
      Ask about specific examples from their work history. Keep the question concise and professional.`,
      maxTokens: 150,
    })

    return text.trim()
  } catch (error) {
    console.error("Error generating next question:", error)
    return getDefaultQuestion(session)
  }
}

// Default questions function to use when AI is not available
function getDefaultQuestion(session: InterviewSession): string {
  // Get the question index based on conversation length
  const questionIndex = Math.floor(session.conversation.length / 2) % 5

  // Generic questions that work for most job positions
  const genericQuestions = [
    `Can you tell me about your experience with ${session.skills[0] || "this field"}?`,
    "What's your approach to problem-solving in your work?",
    "Tell me about a challenging project you worked on recently.",
    "How do you handle tight deadlines?",
    "What are your strengths and weaknesses related to this role?",
  ]

  // UX Designer specific questions
  const uxDesignerQuestions = [
    "Can you walk me through your design process from research to final deliverables?",
    "How do you incorporate user feedback into your designs?",
    "Tell me about a time when you had to redesign a feature based on user testing.",
    "How do you balance user needs with business requirements?",
    "What design tools are you most proficient with?",
  ]

  // Developer specific questions
  const developerQuestions = [
    "Can you describe a complex technical problem you solved recently?",
    "How do you approach code quality and testing?",
    "Tell me about your experience with state management in React applications.",
    "How do you stay updated with the latest frontend technologies?",
    "Describe your experience working with APIs and data fetching.",
  ]

  // Select the appropriate question set based on job title
  if (session.jobTitle.toLowerCase().includes("ux") || session.jobTitle.toLowerCase().includes("design")) {
    return uxDesignerQuestions[questionIndex]
  } else if (
    session.jobTitle.toLowerCase().includes("developer") ||
    session.jobTitle.toLowerCase().includes("engineer")
  ) {
    return developerQuestions[questionIndex]
  } else {
    return genericQuestions[questionIndex]
  }
}

// Complete an interview
export async function completeInterview(interviewId: string): Promise<InterviewSession> {
  const session = await getOrCreateInterviewSession(interviewId)

  if (session.status === "in-progress") {
    session.status = "completed"
    session.endTime = new Date()
    interviewSessions.set(interviewId, session)
  }

  return session
}

// Analyze interview results
export async function analyzeInterviewResults(interviewId: string): Promise<any> {
  const session = await getOrCreateInterviewSession(interviewId)

  if (session.status !== "completed") {
    throw new Error("Interview is not completed")
  }

  // In a real app, you would use AI to analyze the responses
  // For demo purposes, we'll return a simple analysis

  return {
    candidateName: session.candidateName,
    jobTitle: session.jobTitle,
    overallScore: 85,
    skillScores: session.skills.map((skill) => ({
      name: skill,
      score: Math.floor(70 + Math.random() * 30),
    })),
    behavioralAssessment: {
      communication: Math.floor(70 + Math.random() * 30),
      problemSolving: Math.floor(70 + Math.random() * 30),
      teamwork: Math.floor(70 + Math.random() * 30),
      adaptability: Math.floor(70 + Math.random() * 30),
    },
    recommendation: Math.random() > 0.3 ? "Selected" : "Rejected",
  }
}
