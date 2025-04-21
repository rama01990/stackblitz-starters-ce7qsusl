"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  Download,
  Mail,
  Star,
  StarHalf,
  MessageSquare,
  FileText,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Briefcase,
  Phone,
  MailIcon,
} from "lucide-react"
import Link from "next/link"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

export default function CandidateReportPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview")

  // In a real app, you would fetch the candidate data based on the ID
  const candidate = {
    id: params.id,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 123 456 7890",
    jobPosition: "Senior React Developer",
    status: "Selected",
    invitedDate: "2025-04-05",
    interviewDate: "2025-04-08",
    resume: "john-doe-resume.pdf",
    avatar: "/placeholder.svg?height=80&width=80",
    skills: [
      { name: "React", score: 85 },
      { name: "TypeScript", score: 78 },
      { name: "Redux", score: 90 },
      { name: "CSS/SCSS", score: 65 },
      { name: "Node.js", score: 72 },
    ],
    behavioralAssessment: {
      communication: 82,
      problemSolving: 88,
      teamwork: 75,
      adaptability: 80,
      leadership: 70,
    },
    overallScore: 82,
    recommendation: "Selected",
    strengths: ["Strong React and Redux knowledge", "Excellent problem-solving skills", "Good communication abilities"],
    areasOfImprovement: ["CSS styling could be improved", "Limited experience with testing frameworks"],
    interviewTranscript: [
      {
        question: "Tell me about your experience with React and how you've used it in your previous projects.",
        answer:
          "I have been working with React for over 3 years now. In my previous role, I built a dashboard application using React, Redux, and TypeScript that helped our marketing team track campaign performance in real-time. I've also worked on several e-commerce projects where I implemented complex state management solutions and optimized performance for large product catalogs.",
        evaluation: "Strong technical knowledge and practical experience with React.",
        score: 90,
      },
      {
        question: "How do you handle state management in large React applications?",
        answer:
          "For large applications, I prefer using Redux for global state management, combined with the Context API for more localized state. I follow a structured approach where I organize my Redux store by feature, using slices to keep related state together. I also make use of selectors for efficient data access and memoization to prevent unnecessary re-renders. For simpler components, I rely on local state with useState or useReducer hooks.",
        evaluation: "Demonstrates deep understanding of state management patterns and best practices.",
        score: 85,
      },
      {
        question: "Can you describe a challenging technical problem you've solved recently?",
        answer:
          "We had a performance issue with a complex data visualization dashboard that was rendering thousands of data points. The page was taking several seconds to load and interactions were laggy. I implemented a virtualization solution using react-window to only render the visible elements, added memoization for expensive calculations, and optimized our Redux selectors. This reduced the initial load time by 70% and made interactions smooth even on lower-end devices.",
        evaluation: "Excellent problem-solving approach with measurable results.",
        score: 88,
      },
    ],
    feedbackComments: [
      {
        interviewer: "Alex Johnson",
        role: "Senior Engineering Manager",
        comment:
          "John demonstrated strong technical skills and problem-solving abilities. His experience with React and Redux is impressive, and he communicated his ideas clearly.",
        recommendation: "Hire",
      },
      {
        interviewer: "Sarah Williams",
        role: "Tech Lead",
        comment:
          "Good technical knowledge but I have some concerns about his experience with testing frameworks. Would recommend additional technical assessment.",
        recommendation: "Consider",
      },
    ],
  }

  // Format radar chart data
  const radarData = Object.entries(candidate.behavioralAssessment).map(([key, value]) => ({
    subject: key.charAt(0).toUpperCase() + key.slice(1),
    A: value,
    fullMark: 100,
  }))

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Selected":
        return "bg-green-100 text-green-800"
      case "In Process":
        return "bg-yellow-100 text-yellow-800"
      case "Rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600"
    if (score >= 70) return "text-amber-600"
    return "text-red-600"
  }

  // Render star rating
  const renderStarRating = (score: number) => {
    const maxStars = 5
    const fullStars = Math.floor(score / 20)
    const hasHalfStar = score % 20 >= 10

    return (
      <div className="flex">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && <StarHalf className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
        {Array.from({ length: maxStars - fullStars - (hasHalfStar ? 1 : 0) }).map((_, i) => (
          <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
        ))}
      </div>
    )
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild className="shrink-0">
            <Link href="/candidates">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Candidate Interview Report</h1>
            <p className="text-muted-foreground">
              {candidate.jobPosition} • Interviewed on {candidate.interviewDate}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Mail className="mr-2 h-4 w-4" />
            Email Report
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button className="bg-brand hover:bg-brand-light">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Approve Candidate
          </Button>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-1"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={candidate.avatar} alt={candidate.name} />
                  <AvatarFallback className="text-2xl">{candidate.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{candidate.name}</h2>
                <p className="text-muted-foreground">{candidate.jobPosition}</p>
                <Badge className={`mt-2 ${getStatusColor(candidate.status)}`}>{candidate.status}</Badge>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MailIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{candidate.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{candidate.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Interviewed: {candidate.interviewDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Position: {candidate.jobPosition}</span>
                </div>
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="font-medium mb-3">Overall Assessment</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Score</span>
                  <span className={`font-bold ${getScoreColor(candidate.overallScore)}`}>
                    {candidate.overallScore}%
                  </span>
                </div>
                <Progress value={candidate.overallScore} className="h-2 mb-4" />
                {renderStarRating(candidate.overallScore)}
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="font-medium mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    View Resume
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Follow-up
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-3"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="skills">Skills Assessment</TabsTrigger>
              <TabsTrigger value="behavioral">Behavioral</TabsTrigger>
              <TabsTrigger value="transcript">Transcript</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Summary</CardTitle>
                  <CardDescription>Overall assessment and recommendation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                      <div className="flex items-start gap-3">
                        <div className="rounded-full bg-green-100 p-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-green-800">Recommendation: {candidate.recommendation}</h3>
                          <p className="text-sm text-green-700 mt-1">
                            This candidate demonstrated strong technical skills and good communication abilities.
                            Recommended to proceed with the next interview stage.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-medium mb-2 flex items-center">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                          Strengths
                        </h3>
                        <ul className="space-y-2">
                          {candidate.strengths.map((strength, index) => (
                            <li key={index} className="text-sm flex items-start gap-2">
                              <div className="rounded-full bg-green-100 p-1 mt-0.5">
                                <CheckCircle2 className="h-3 w-3 text-green-600" />
                              </div>
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-medium mb-2 flex items-center">
                          <AlertCircle className="h-4 w-4 text-amber-600 mr-2" />
                          Areas for Improvement
                        </h3>
                        <ul className="space-y-2">
                          {candidate.areasOfImprovement.map((area, index) => (
                            <li key={index} className="text-sm flex items-start gap-2">
                              <div className="rounded-full bg-amber-100 p-1 mt-0.5">
                                <AlertCircle className="h-3 w-3 text-amber-600" />
                              </div>
                              {area}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-3">Interviewer Feedback</h3>
                      <div className="space-y-4">
                        {candidate.feedbackComments.map((feedback, index) => (
                          <div key={index} className="p-4 rounded-lg bg-gray-50 border">
                            <div className="flex items-start gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{feedback.interviewer.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium">{feedback.interviewer}</h4>
                                  <Badge
                                    variant="outline"
                                    className={
                                      feedback.recommendation === "Hire"
                                        ? "text-green-600 bg-green-50"
                                        : "text-amber-600 bg-amber-50"
                                    }
                                  >
                                    {feedback.recommendation}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">{feedback.role}</p>
                                <p className="text-sm mt-2">{feedback.comment}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Technical Skills Assessment</CardTitle>
                  <CardDescription>Evaluation of technical competencies</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={candidate.skills}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis type="number" domain={[0, 100]} />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="score"
                          name="Skill Proficiency"
                          fill="#8932e8"
                          radius={[0, 4, 4, 0]}
                          label={{ position: "right", fill: "#666", fontSize: 12 }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-4">
                    {candidate.skills.map((skill) => (
                      <div key={skill.name} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{skill.name}</span>
                          <span className={`text-sm ${getScoreColor(skill.score)}`}>{skill.score}%</span>
                        </div>
                        <Progress value={skill.score} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="behavioral" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Behavioral Assessment</CardTitle>
                  <CardDescription>Evaluation of soft skills and behaviors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar name="Behavioral Score" dataKey="A" stroke="#8932e8" fill="#8932e8" fillOpacity={0.6} />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-4">
                    {Object.entries(candidate.behavioralAssessment).map(([key, value]) => (
                      <div key={key} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium capitalize">{key}</span>
                          <span className={`text-sm ${getScoreColor(value)}`}>{value}%</span>
                        </div>
                        <Progress value={value} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transcript" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Interview Transcript</CardTitle>
                  <CardDescription>Questions and answers from the interview with evaluations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {candidate.interviewTranscript.map((item, index) => (
                      <div key={index} className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="font-medium text-brand mb-2">Q: {item.question}</h3>
                          <p className="text-sm">{item.answer}</p>
                        </div>

                        <div className="flex items-start gap-4 px-4">
                          <div className="bg-blue-50 p-3 rounded-lg flex-1">
                            <h4 className="text-sm font-medium text-blue-700 mb-1">Evaluation</h4>
                            <p className="text-sm text-blue-600">{item.evaluation}</p>
                          </div>

                          <div className="bg-gray-50 p-3 rounded-lg text-center w-20">
                            <h4 className="text-xs font-medium text-gray-500 mb-1">Score</h4>
                            <p className={`font-bold ${getScoreColor(item.score)}`}>{item.score}%</p>
                          </div>
                        </div>

                        {index < candidate.interviewTranscript.length - 1 && <Separator />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
