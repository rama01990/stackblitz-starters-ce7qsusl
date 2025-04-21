"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Calendar, Clock, User, Star, Download, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { motion } from "framer-motion"

// Types
type Interview = {
  id: string
  candidateName: string
  jobTitle: string
  date: string
  duration: string
  status: "completed" | "in-progress" | "scheduled"
  rating?: number
  feedback?: string
  overallScore?: number
}

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch interviews
    const fetchInterviews = async () => {
      setIsLoading(true)

      // In a real app, this would be an API call
      // For demo purposes, we'll use mock data
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockInterviews: Interview[] = [
        {
          id: "int-1",
          candidateName: "John Doe",
          jobTitle: "UX Designer",
          date: "2025-04-10",
          duration: "18:24",
          status: "completed",
          rating: 4,
          overallScore: 85,
        },
        {
          id: "int-2",
          candidateName: "Jane Smith",
          jobTitle: "Senior React Developer",
          date: "2025-04-09",
          duration: "22:15",
          status: "completed",
          rating: 5,
          overallScore: 92,
        },
        {
          id: "int-3",
          candidateName: "Michael Johnson",
          jobTitle: "Product Manager",
          date: "2025-04-08",
          duration: "15:40",
          status: "completed",
          rating: 3,
          overallScore: 78,
        },
        {
          id: "int-4",
          candidateName: "Emily Williams",
          jobTitle: "UX Designer",
          date: "2025-04-12",
          duration: "00:00",
          status: "scheduled",
        },
        {
          id: "int-5",
          candidateName: "Robert Brown",
          jobTitle: "Senior React Developer",
          date: "2025-04-10",
          duration: "05:18",
          status: "in-progress",
        },
      ]

      setInterviews(mockInterviews)
      setIsLoading(false)
    }

    fetchInterviews()
  }, [])

  // Filter interviews based on search term
  const filteredInterviews = interviews.filter(
    (interview) =>
      interview.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Render star rating
  const renderRating = (rating?: number) => {
    if (!rating) return null

    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold">Interviews</h1>
        <p className="text-muted-foreground">View and manage candidate interviews</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mb-6 flex items-center"
      >
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search interviews..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button className="ml-4 bg-brand hover:bg-brand-light">
          <Calendar className="mr-2 h-4 w-4" />
          Schedule Interview
        </Button>
      </motion.div>

      {isLoading ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="w-full">
              <CardContent className="p-6">
                <div className="flex animate-pulse space-x-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-5/6 rounded bg-gray-200"></div>
                      <div className="h-4 w-1/2 rounded bg-gray-200"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      ) : filteredInterviews.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="rounded-lg border border-dashed p-8 text-center"
        >
          <Calendar className="mx-auto h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No interviews found</h3>
          <p className="mt-2 text-muted-foreground">No interviews match your search criteria.</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {filteredInterviews.map((interview, index) => (
            <motion.div
              key={interview.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{interview.candidateName}</h3>
                          <p className="text-sm text-muted-foreground">{interview.jobTitle}</p>
                        </div>
                        <Badge className={getStatusBadgeColor(interview.status)}>
                          {interview.status === "in-progress"
                            ? "In Progress"
                            : interview.status === "scheduled"
                              ? "Scheduled"
                              : "Completed"}
                        </Badge>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{interview.date}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {interview.status === "scheduled" ? "Upcoming" : `${interview.duration} mins`}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <User className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Recruiter: Alex Johnson</span>
                        </div>
                        <div>{interview.status === "completed" && renderRating(interview.rating)}</div>
                      </div>

                      {interview.status === "completed" && interview.overallScore && (
                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">Overall Score</span>
                            <span className="text-sm font-medium">{interview.overallScore}%</span>
                          </div>
                          <Progress value={interview.overallScore} className="h-2" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-row md:flex-col justify-around items-center bg-gray-50 p-6 md:w-48">
                      {interview.status === "completed" && (
                        <>
                          <Button variant="outline" size="sm" className="w-full mb-2" asChild>
                            <Link href={`/candidates/${interview.id}/report`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Report
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" className="w-full">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </>
                      )}

                      {interview.status === "in-progress" && (
                        <Button className="w-full bg-brand hover:bg-brand-light" asChild>
                          <Link href={`/interview/${interview.id}`}>Continue</Link>
                        </Button>
                      )}

                      {interview.status === "scheduled" && (
                        <Button className="w-full bg-brand hover:bg-brand-light" asChild>
                          <Link href={`/interview/${interview.id}`}>Start Interview</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
