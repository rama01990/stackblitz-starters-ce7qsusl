"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Mic, MicOff, Video, VideoOff, Phone, Smile, Frown, Meh, Send, Volume2, VolumeX } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Message } from "@/app/actions/interview-actions"

// Emotion detection types
type Emotion = "neutral" | "happy" | "sad" | "surprised" | "angry" | "confused"

export default function InterviewPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const [isStarted, setIsStarted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(false)
  const [isSpeakerOn, setIsSpeakerOn] = useState(true)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [conversation, setConversation] = useState<Message[]>([])
  const [currentTranscript, setCurrentTranscript] = useState("")
  const [isCompleted, setIsCompleted] = useState(false)
  const [webcamError, setWebcamError] = useState(false)
  const [jobTitle, setJobTitle] = useState("UX Designer")
  const [isSimulationMode, setIsSimulationMode] = useState(false)
  const [recognitionSupported, setRecognitionSupported] = useState(false)
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>("neutral")
  const [interviewProgress, setInterviewProgress] = useState(0)
  const [isThinking, setIsThinking] = useState(false)
  const [feedbackRating, setFeedbackRating] = useState<number | null>(null)
  const [feedbackComment, setFeedbackComment] = useState("")
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [totalQuestions] = useState(5) // Typically 5 questions in an interview

  const videoRef = useRef<HTMLVideoElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const recognitionRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0")
    const secs = (seconds % 60).toString().padStart(2, "0")
    return `${mins}:${secs}`
  }

  // Format timestamp for messages
  const formatTimestamp = () => {
    const now = new Date()
    const hours = now.getHours().toString().padStart(2, "0")
    const minutes = now.getMinutes().toString().padStart(2, "0")
    return `${hours}:${minutes}`
  }

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        toast({
          title: "Fullscreen Error",
          description: `Error attempting to enable fullscreen: ${err.message}`,
          variant: "destructive",
        })
      })
    } else {
      document.exitFullscreen()
    }
  }

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  // Check for speech recognition support
  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window !== "undefined") {
      // Check for various implementations of SpeechRecognition
      const SpeechRecognition =
        window.SpeechRecognition ||
        (window as any).webkitSpeechRecognition ||
        (window as any).mozSpeechRecognition ||
        (window as any).msSpeechRecognition

      if (SpeechRecognition) {
        setRecognitionSupported(true)
      } else {
        console.log("Speech recognition not supported in this browser")
        setIsSimulationMode(true)
      }
    }
  }, [])

  // Initialize the interview
  useEffect(() => {
    if (isStarted) {
      // Start the timer
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1)
      }, 1000)

      // Fetch initial interview data
      fetchInterviewData()

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current)
        }
        stopRecognition()
      }
    }
  }, [isStarted])

  // Update progress when conversation changes
  useEffect(() => {
    if (conversation.length > 0) {
      // Calculate progress based on number of exchanges
      const aiMessages = conversation.filter((msg) => msg.role === "ai").length
      setCurrentQuestionIndex(Math.min(aiMessages, totalQuestions))
      setInterviewProgress(Math.min((aiMessages / totalQuestions) * 100, 100))
    }
  }, [conversation, totalQuestions])

  // Initialize audio for text-to-speech
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio()
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // Speak text using browser's speech synthesis
  const speakText = (text: string) => {
    if (!isSpeakerOn) return

    if (window.speechSynthesis) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)

      // Get voices and set a nice one if available
      const voices = window.speechSynthesis.getVoices()
      const preferredVoice = voices.find(
        (voice) => voice.name.includes("Google") || voice.name.includes("Female") || voice.name.includes("Samantha"),
      )

      if (preferredVoice) {
        utterance.voice = preferredVoice
      }

      utterance.rate = 1.0
      utterance.pitch = 1.0

      window.speechSynthesis.speak(utterance)
    }
  }

  // Fetch interview data from the API
  const fetchInterviewData = async () => {
    try {
      // First get the interview session
      const response = await fetch(`/api/interview/${params.id}`)
      const data = await response.json()

      if (data.success && data.session) {
        setJobTitle(data.session.jobTitle)

        // Add this code to show a notification when in simulation mode due to missing API key
        if (data.isSimulationMode && data.simulationReason === "missing_api_key") {
          toast({
            title: "Simulation Mode Active",
            description: "Running in simulation mode because OpenAI API key is not configured.",
            variant: "default",
          })
        }

        // Start the interview
        const startResponse = await fetch(`/api/interview/${params.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "start" }),
        })

        const startData = await startResponse.json()

        if (startData.success) {
          setConversation(startData.session.conversation)

          // Speak the greeting if speaker is on
          if (startData.session.conversation[0]) {
            setTimeout(() => {
              speakText(startData.session.conversation[0].content)
            }, 1000)
          }

          // Try to access webcam
          if (typeof navigator !== "undefined" && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices
              .getUserMedia({ video: true })
              .then((stream) => {
                if (videoRef.current) {
                  videoRef.current.srcObject = stream
                  setIsVideoOn(true)

                  // Set up emotion detection interval
                  const emotionDetectionInterval = setInterval(() => {
                    detectEmotion()
                  }, 3000)

                  return () => clearInterval(emotionDetectionInterval)
                }
              })
              .catch((err) => {
                console.log("Webcam access error:", err.message || "Unknown error")
                setWebcamError(true)
              })
          } else {
            console.log("Media devices API not available")
            setWebcamError(true)
          }

          // Initialize speech recognition if supported
          if (recognitionSupported && !isSimulationMode) {
            initializeSpeechRecognition()
          } else {
            setIsSimulationMode(true)
          }
        }
      }

      setIsLoading(false)
      setIsRecording(true)
    } catch (error) {
      console.error("Error fetching interview data:", error)
      toast({
        title: "Error",
        description: "Failed to load interview data. Switching to simulation mode.",
        variant: "destructive",
      })
      setIsLoading(false)
      setIsSimulationMode(true)

      // Add a default greeting in simulation mode
      setConversation([
        {
          role: "ai",
          content: `Hello! Welcome to your interview for the ${jobTitle} position. I'll be asking you some questions to learn more about your experience and skills.`,
          timestamp: formatTimestamp(),
        },
      ])
    }
  }

  // Simulate emotion detection (in a real app, this would use computer vision)
  const detectEmotion = () => {
    if (!isVideoOn || webcamError) return

    // In a real app, this would analyze the video feed
    // For demo purposes, we'll randomly change emotions occasionally
    if (Math.random() > 0.7) {
      const emotions: Emotion[] = ["neutral", "happy", "sad", "surprised", "confused"]
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)]
      setCurrentEmotion(randomEmotion)
    }
  }

  // Get emotion icon based on current emotion
  const getEmotionIcon = () => {
    switch (currentEmotion) {
      case "happy":
        return <Smile className="text-green-500" />
      case "sad":
        return <Frown className="text-blue-500" />
      case "angry":
        return <Frown className="text-red-500" />
      case "confused":
        return <Meh className="text-yellow-500" />
      case "surprised":
        return <Meh className="text-purple-500" />
      default:
        return <Meh className="text-gray-500" />
    }
  }

  // Initialize speech recognition
  const initializeSpeechRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      (window as any).webkitSpeechRecognition ||
      (window as any).mozSpeechRecognition ||
      (window as any).msSpeechRecognition

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = "en-US"

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join("")

        setCurrentTranscript(transcript)
      }

      recognitionRef.current.onend = () => {
        // Restart recognition if we're still recording
        if (isRecording && !isCompleted) {
          recognitionRef.current.start()
        }
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error)
        if (event.error === "not-allowed") {
          toast({
            title: "Microphone Access Denied",
            description: "Please allow microphone access to use speech recognition. Switching to simulation mode.",
            variant: "destructive",
          })
          setIsSimulationMode(true)
          stopRecognition()
        }
      }

      // Start recognition
      recognitionRef.current.start()
    }
  }

  // Stop speech recognition
  const stopRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }

  // Submit the current transcript to the API
  const submitResponse = async () => {
    if (!currentTranscript && !isSimulationMode) return

    // In real mode, use the actual transcript
    // In simulation mode, generate a simulated response
    const responseText = isSimulationMode ? getSimulatedResponse(conversation.length) : currentTranscript

    // Add user response to conversation locally first for immediate feedback
    const updatedConversation = [
      ...conversation,
      {
        role: "user",
        content: responseText,
        timestamp: formatTimestamp(),
      },
    ]

    setConversation(updatedConversation)
    setCurrentTranscript("")
    setIsRecording(false)
    setIsThinking(true)

    try {
      // Submit response to API
      const response = await fetch(`/api/interview/${params.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "response",
          response: responseText,
        }),
      })

      const data = await response.json()
      setIsThinking(false)

      if (data.success) {
        // Add AI response to conversation
        const aiResponse = {
          role: "ai" as const,
          content: data.nextQuestion,
          timestamp: formatTimestamp(),
        }

        setConversation([...updatedConversation, aiResponse])

        // Speak the AI response
        speakText(data.nextQuestion)

        // Check if interview should end
        if (data.nextQuestion.toLowerCase().includes("concludes our interview") || updatedConversation.length >= 9) {
          await completeInterview()
        } else {
          // Resume recording for next response
          setIsRecording(true)
        }
      }
    } catch (error) {
      console.error("Error submitting response:", error)
      setIsThinking(false)

      // In case of error, continue in simulation mode
      if (!isSimulationMode) {
        toast({
          title: "Connection Error",
          description: "Switching to simulation mode due to connection issues.",
          variant: "destructive",
        })
        setIsSimulationMode(true)
      }

      // Add simulated AI response
      const nextQuestion = getSimulatedQuestion(updatedConversation.length)
      const aiResponse = {
        role: "ai" as const,
        content: nextQuestion,
        timestamp: formatTimestamp(),
      }

      setConversation([...updatedConversation, aiResponse])

      // Speak the AI response
      speakText(nextQuestion)

      // Check if interview should end in simulation mode
      if (updatedConversation.length >= 9) {
        setIsCompleted(true)
        setShowFeedbackForm(true)
      } else {
        setIsRecording(true)
      }
    }
  }

  // Complete the interview
  const completeInterview = async () => {
    try {
      await fetch(`/api/interview/${params.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "complete" }),
      })

      setIsCompleted(true)
      setShowFeedbackForm(true)
    } catch (error) {
      console.error("Error completing interview:", error)
      setIsCompleted(true)
      setShowFeedbackForm(true)
    }
  }

  // Submit feedback
  const submitFeedback = async () => {
    try {
      await fetch(`/api/interview/${params.id}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: feedbackRating,
          comment: feedbackComment,
        }),
      })

      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback!",
      })

      setShowFeedbackForm(false)
    } catch (error) {
      console.error("Error submitting feedback:", error)
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Get a simulated response for preview mode
  const getSimulatedResponse = (messageCount: number) => {
    const responses = [
      "Hi, I'm doing well, thank you. Excited to be here.",
      "Sure, I have about 4 years of experience as a UX Designer, most recently at a health-tech company called Etheric. I've worked on designing intuitive interfaces for doctors and patients. I believe my experience aligns well with TechNova's focus on user-centric design and data-driven solutions.",
      "I approach problem-solving by first understanding the user needs through research and data analysis. Then I create wireframes and prototypes to test solutions before finalizing designs. I believe in iterative design and continuous feedback.",
      "Yes, I've worked on several projects with tight deadlines. One example was redesigning a patient portal with only 3 weeks before launch. I prioritized critical features, collaborated closely with developers, and we delivered on time with great user feedback.",
      "I'm proficient with Figma, Sketch, Adobe XD, and prototyping tools. I also have experience with user research methods and basic front-end development skills in HTML, CSS, and JavaScript.",
    ]

    const responseIndex = Math.floor(messageCount / 2)
    return responseIndex < responses.length
      ? responses[responseIndex]
      : "Yes, that's correct. I'm always looking to improve and learn new skills."
  }

  // Get a simulated question for preview mode
  const getSimulatedQuestion = (messageCount: number) => {
    const questions = [
      "To start, could you briefly walk me through your background and how it aligns with this role?",
      "Thank you for sharing. Could you describe your approach to problem-solving in your design work?",
      "Have you ever worked on a project with tight deadlines? How did you handle it?",
      "What design tools and technologies are you proficient with?",
      "Thank you for your responses. That concludes our interview questions. We'll be in touch with next steps soon.",
    ]

    const questionIndex = Math.floor(messageCount / 2)
    return questionIndex < questions.length
      ? questions[questionIndex]
      : "Thank you for your responses. That concludes our interview questions. We'll be in touch with next steps soon."
  }

  // Simulate typing for preview mode
  useEffect(() => {
    if (isSimulationMode && isRecording && conversation.length > 0 && !currentTranscript) {
      const lastMessage = conversation[conversation.length - 1]

      // If the last message was from the AI, simulate user typing
      if (lastMessage.role === "ai") {
        const simulateTyping = setTimeout(() => {
          simulateUserSpeaking()
        }, 2000)

        return () => clearTimeout(simulateTyping)
      }
    }
  }, [isSimulationMode, isRecording, conversation, currentTranscript])

  // Simulate user speaking by gradually revealing text
  const simulateUserSpeaking = () => {
    const fullResponse = getSimulatedResponse(conversation.length)
    let charIndex = 0

    const typingInterval = setInterval(() => {
      if (charIndex <= fullResponse.length) {
        setCurrentTranscript(fullResponse.substring(0, charIndex))
        charIndex++
      } else {
        clearInterval(typingInterval)
        // When done "typing", submit the response
        setTimeout(() => {
          submitResponse()
        }, 500)
      }
    }, 50)
  }

  // Listen for silence to auto-submit in real mode
  useEffect(() => {
    if (!isSimulationMode && isRecording && currentTranscript) {
      let silenceTimer: NodeJS.Timeout | null = null

      // Reset the timer whenever the transcript changes
      silenceTimer = setTimeout(() => {
        // If we have a substantial response, submit it after silence
        if (currentTranscript.length > 20) {
          submitResponse()
        }
      }, 3000) // 3 seconds of silence

      return () => {
        if (silenceTimer) clearTimeout(silenceTimer)
      }
    }
  }, [currentTranscript, isRecording, isSimulationMode])

  const toggleMute = () => {
    setIsMuted(!isMuted)

    if (!isMuted) {
      stopRecognition()
      setIsRecording(false)
    } else if (!isSimulationMode) {
      initializeSpeechRecognition()
      setIsRecording(true)
    } else {
      setIsRecording(true)
    }
  }

  const toggleVideo = () => {
    if (webcamError && !isVideoOn) {
      return
    }
    setIsVideoOn(!isVideoOn)
  }

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn)

    // Stop any ongoing speech
    if (isSpeakerOn && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
  }

  const startInterview = () => {
    setIsStarted(true)
  }

  const endInterview = () => {
    completeInterview()
  }

  const handleManualSubmit = () => {
    if (currentTranscript) {
      submitResponse()
    }
  }

  // Render feedback form
  const renderFeedbackForm = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-6 p-4 bg-white rounded-lg shadow-md"
      >
        <h3 className="text-lg font-semibold mb-4">How was your interview experience?</h3>

        <div className="flex justify-center space-x-4 mb-6">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              onClick={() => setFeedbackRating(rating)}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-medium transition-all ${
                feedbackRating === rating ? "bg-brand text-white scale-110" : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {rating}
            </button>
          ))}
        </div>

        <div className="mb-4">
          <label htmlFor="feedback" className="block text-sm font-medium mb-1">
            Additional comments (optional)
          </label>
          <textarea
            id="feedback"
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Share your thoughts about the interview experience..."
            value={feedbackComment}
            onChange={(e) => setFeedbackComment(e.target.value)}
          />
        </div>

        <div className="flex justify-end">
          <Button className="bg-brand hover:bg-brand-light" onClick={submitFeedback} disabled={!feedbackRating}>
            Submit Feedback
          </Button>
        </div>
      </motion.div>
    )
  }

  if (isCompleted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-md overflow-hidden">
            <CardContent className="pt-6 text-center">
              <motion.div
                className="mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <div className="mx-auto h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold mb-2">Interview Completed</h2>
                <p className="text-gray-600 mb-6">
                  Thank you for completing your interview! Your responses have been recorded.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  The recruiter will review your interview and get back to you soon.
                </p>
              </motion.div>

              {showFeedbackForm && renderFeedbackForm()}

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.5 }}>
                <Button
                  className="w-full bg-brand hover:bg-brand-light mt-4"
                  onClick={() => (window.location.href = "/")}
                >
                  Return to Homepage
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="flex min-h-screen flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <AnimatePresence mode="wait">
        {!isStarted ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-1 items-center justify-center p-4"
          >
            <Card className="w-full max-w-md overflow-hidden">
              <CardContent className="pt-6">
                <motion.div
                  className="flex items-center justify-center mb-6"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="bg-brand rounded-md p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold ml-2">SMART Hire</h2>
                </motion.div>

                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                  <h3 className="text-xl font-semibold text-center mb-4">Welcome to Your Virtual Interview</h3>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-md p-4 mb-6">
                    <h4 className="font-medium text-blue-800 mb-2">Position: {jobTitle}</h4>
                    <p className="text-sm text-blue-700">
                      This interview will assess your skills and experience through a series of questions. Your
                      responses will be recorded and analyzed by our AI system.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="space-y-4 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, staggerChildren: 0.1 }}
                >
                  <motion.div
                    className="flex items-start"
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <div className="bg-gray-100 rounded-full p-2 mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                        />
                      </svg>
                    </div>
                    <div>
                      <h5 className="font-medium">Audio and video</h5>
                      <p className="text-sm text-gray-600">
                        The interview will work with or without camera access. Your responses will be processed in
                        real-time.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-start"
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <div className="bg-gray-100 rounded-full p-2 mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h5 className="font-medium">Interview duration</h5>
                      <p className="text-sm text-gray-600">
                        The interview will take approximately 15-20 minutes to complete.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-start"
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <div className="bg-gray-100 rounded-full p-2 mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h5 className="font-medium">Privacy</h5>
                      <p className="text-sm text-gray-600">Your responses will only be shared with the hiring team.</p>
                    </div>
                  </motion.div>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                  <Button
                    className="w-full bg-brand hover:bg-brand-light transition-all duration-300 transform hover:scale-105"
                    onClick={startInterview}
                  >
                    Start Interview
                  </Button>

                  <p className="text-xs text-center text-gray-500 mt-4">
                    By starting the interview, you consent to the recording of your responses.
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="interview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-1 flex-col md:flex-row"
          >
            {/* Left panel - Video */}
            <div className="w-full md:w-1/2 bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col">
              <div className="relative flex-1 flex items-center justify-center">
                {isLoading ? (
                  <motion.div
                    className="flex flex-col items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-white mt-4">Preparing your interview...</p>
                  </motion.div>
                ) : (
                  <>
                    {isVideoOn && !webcamError ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full">
                        <video ref={videoRef} autoPlay muted={isMuted} className="w-full h-full object-cover" />
                      </motion.div>
                    ) : (
                      <motion.div
                        className="flex flex-col items-center justify-center"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center mb-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-16 w-16 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        {webcamError ? (
                          <p className="text-white text-center max-w-xs">
                            Camera access is not available. The interview will continue with audio only.
                          </p>
                        ) : (
                          <p className="text-white text-center">Camera is turned off</p>
                        )}
                      </motion.div>
                    )}

                    {/* Interview bot avatar overlay */}
                    <motion.div
                      className="absolute top-4 right-4 bg-brand/10 backdrop-blur-sm p-2 rounded-lg flex items-center"
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">Interview Bot</p>
                        <p className="text-white/70 text-xs">AI Interviewer</p>
                      </div>
                    </motion.div>

                    {/* Timer overlay */}
                    <motion.div
                      className="absolute top-4 left-4 bg-gray-800/50 backdrop-blur-sm px-3 py-1 rounded-full"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <p className="text-white font-mono">{formatTime(elapsedTime)}</p>
                    </motion.div>

                    {/* Emotion indicator */}
                    {isVideoOn && !webcamError && (
                      <motion.div
                        className="absolute bottom-4 left-4 bg-gray-800/50 backdrop-blur-sm px-3 py-1 rounded-full flex items-center"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        <span className="mr-2">Mood:</span>
                        {getEmotionIcon()}
                      </motion.div>
                    )}

                    {/* Progress indicator */}
                    <motion.div
                      className="absolute bottom-4 right-4 bg-gray-800/50 backdrop-blur-sm p-3 rounded-lg w-48"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="flex justify-between text-xs text-white mb-1">
                        <span>Progress</span>
                        <span>
                          {currentQuestionIndex}/{totalQuestions}
                        </span>
                      </div>
                      <Progress value={interviewProgress} className="h-2 bg-gray-700" />
                    </motion.div>

                    {/* Fullscreen button */}
                    <motion.button
                      className="absolute top-4 right-36 bg-gray-800/50 backdrop-blur-sm p-2 rounded-full text-white hover:bg-gray-700/50 transition-colors"
                      onClick={toggleFullscreen}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {isFullscreen ? (
                          <>
                            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                          </>
                        ) : (
                          <>
                            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                          </>
                        )}
                      </svg>
                    </motion.button>
                  </>
                )}
              </div>

              {/* Video controls */}
              <motion.div
                className="bg-gray-800 p-4 flex items-center justify-center space-x-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className={`rounded-full ${isMuted ? "bg-red-500 text-white hover:bg-red-600" : "bg-gray-700 text-white hover:bg-gray-600"}`}
                        onClick={toggleMute}
                      >
                        {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isMuted ? "Unmute microphone" : "Mute microphone"}</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className={`rounded-full ${
                          isVideoOn
                            ? "bg-gray-700 text-white hover:bg-gray-600"
                            : "bg-red-500 text-white hover:bg-red-600"
                        }`}
                        onClick={toggleVideo}
                        disabled={webcamError}
                      >
                        {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isVideoOn ? "Turn off camera" : "Turn on camera"}</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className={`rounded-full ${
                          isSpeakerOn
                            ? "bg-gray-700 text-white hover:bg-gray-600"
                            : "bg-red-500 text-white hover:bg-red-600"
                        }`}
                        onClick={toggleSpeaker}
                      >
                        {isSpeakerOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isSpeakerOn ? "Mute speaker" : "Unmute speaker"}</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full bg-red-500 text-white hover:bg-red-600"
                        onClick={endInterview}
                      >
                        <Phone className="h-5 w-5 rotate-135" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>End interview</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </motion.div>
            </div>

            {/* Right panel - Transcript */}
            <div className="w-full md:w-1/2 bg-white flex flex-col h-screen md:h-auto">
              <motion.div
                className="p-4 border-b"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-lg font-semibold">Live Transcript</h2>
              </motion.div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence initial={false}>
                  {conversation.map((message, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start mb-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {message.role === "ai" ? (
                        <Avatar className="mr-2 h-8 w-8 bg-brand text-white">
                          <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                      ) : (
                        <Avatar className="mr-2 h-8 w-8">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                      )}

                      <div className="flex-1">
                        <div className="flex items-center">
                          <p className="font-medium text-sm">{message.role === "ai" ? "Interview Bot" : "You"}</p>
                          <Badge variant="outline" className="ml-2 text-xs">
                            {message.timestamp}
                          </Badge>
                        </div>
                        <p className="text-gray-700 mt-1">{message.content}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* AI thinking indicator */}
                {isThinking && (
                  <motion.div className="flex items-start mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Avatar className="mr-2 h-8 w-8 bg-brand text-white">
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <p className="font-medium text-sm">Interview Bot</p>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {formatTimestamp()}
                        </Badge>
                      </div>
                      <div className="flex items-center mt-2">
                        <div className="flex space-x-1">
                          <div
                            className="w-2 h-2 bg-brand rounded-full animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-brand rounded-full animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-brand rounded-full animate-bounce"
                            style={{ animationDelay: "600ms" }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-500 ml-2">Analyzing your response...</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Current user transcript being typed */}
                {currentTranscript && (
                  <motion.div className="flex items-start mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Avatar className="mr-2 h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center">
                        <p className="font-medium text-sm">You</p>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {formatTimestamp()}
                        </Badge>
                      </div>
                      <p className="text-gray-700 mt-1">
                        {currentTranscript}
                        <span className="inline-block w-1 h-4 bg-brand ml-1 animate-pulse"></span>
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Status indicator and manual submit button */}
              <motion.div
                className="p-4 border-t bg-gray-50 flex items-center justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center text-sm text-gray-600">
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${isRecording ? "bg-red-500 animate-pulse" : "bg-gray-400"}`}
                  ></div>
                  <p>{isRecording ? "Listening... Speak naturally to respond" : "Microphone is off"}</p>
                </div>

                {currentTranscript && (
                  <Button
                    size="sm"
                    className="bg-brand hover:bg-brand-light flex items-center"
                    onClick={handleManualSubmit}
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Submit Response
                  </Button>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Toaster />
    </div>
  )
}
