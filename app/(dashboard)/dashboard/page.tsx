"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts"
import {
  Briefcase,
  Users,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data for charts
const interviewTrends = [
  { date: "Mon", completed: 4, scheduled: 2 },
  { date: "Tue", completed: 6, scheduled: 3 },
  { date: "Wed", completed: 5, scheduled: 4 },
  { date: "Thu", completed: 8, scheduled: 2 },
  { date: "Fri", completed: 7, scheduled: 5 },
  { date: "Sat", completed: 3, scheduled: 1 },
  { date: "Sun", completed: 2, scheduled: 0 },
]

const candidateStatusData = [
  { name: "Selected", value: 35, color: "#10b981" },
  { name: "Rejected", value: 45, color: "#ef4444" },
  { name: "In Process", value: 20, color: "#f59e0b" },
]

const skillsDistribution = [
  { name: "React", value: 28 },
  { name: "UI/UX", value: 22 },
  { name: "TypeScript", value: 18 },
  { name: "Node.js", value: 15 },
  { name: "Python", value: 10 },
  { name: "Other", value: 7 },
]

const recentCandidates = [
  {
    id: 1,
    name: "John Doe",
    position: "Senior React Developer",
    status: "Selected",
    score: 92,
    date: "Today",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Jane Smith",
    position: "UX Designer",
    status: "In Process",
    score: 78,
    date: "Yesterday",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Michael Brown",
    position: "Product Manager",
    status: "Rejected",
    score: 65,
    date: "2 days ago",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "Emily Wilson",
    position: "Senior React Developer",
    status: "Selected",
    score: 88,
    date: "3 days ago",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const upcomingInterviews = [
  {
    id: 1,
    candidate: "Alex Johnson",
    position: "UX Designer",
    time: "Today, 2:00 PM",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    candidate: "Sarah Williams",
    position: "React Developer",
    time: "Today, 4:30 PM",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    candidate: "Robert Chen",
    position: "Product Manager",
    time: "Tomorrow, 10:00 AM",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

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

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState("7days")

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

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to your recruitment analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-brand hover:bg-brand-light">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Interview
          </Button>
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <motion.div variants={item}>
          <Card className="overflow-hidden border-l-4 border-l-brand">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Interviews</p>
                  <div className="flex items-baseline space-x-2">
                    <h2 className="text-3xl font-bold">152</h2>
                    <span className="inline-flex items-center text-sm font-medium text-green-600">
                      <ArrowUpRight className="mr-1 h-4 w-4" />
                      12%
                    </span>
                  </div>
                </div>
                <div className="rounded-full bg-brand/10 p-3 text-brand">
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="overflow-hidden border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Selection Rate</p>
                  <div className="flex items-baseline space-x-2">
                    <h2 className="text-3xl font-bold">35%</h2>
                    <span className="inline-flex items-center text-sm font-medium text-red-600">
                      <ArrowDownRight className="mr-1 h-4 w-4" />
                      3%
                    </span>
                  </div>
                </div>
                <div className="rounded-full bg-green-500/10 p-3 text-green-500">
                  <CheckCircle className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="overflow-hidden border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg. Interview Score</p>
                  <div className="flex items-baseline space-x-2">
                    <h2 className="text-3xl font-bold">78.5</h2>
                    <span className="inline-flex items-center text-sm font-medium text-green-600">
                      <ArrowUpRight className="mr-1 h-4 w-4" />
                      2.5%
                    </span>
                  </div>
                </div>
                <div className="rounded-full bg-blue-500/10 p-3 text-blue-500">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="overflow-hidden border-l-4 border-l-amber-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Jobs</p>
                  <div className="flex items-baseline space-x-2">
                    <h2 className="text-3xl font-bold">12</h2>
                    <span className="inline-flex items-center text-sm font-medium text-green-600">
                      <ArrowUpRight className="mr-1 h-4 w-4" />2
                    </span>
                  </div>
                </div>
                <div className="rounded-full bg-amber-500/10 p-3 text-amber-500">
                  <Briefcase className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-7">
            <motion.div variants={item} initial="hidden" animate="show" className="md:col-span-4 space-y-4">
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle>Interview Activity</CardTitle>
                  <CardDescription>Weekly interview completion trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={interviewTrends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8932e8" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8932e8" stopOpacity={0.1} />
                          </linearGradient>
                          <linearGradient id="colorScheduled" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <RechartsTooltip />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="completed"
                          name="Completed"
                          stroke="#8932e8"
                          fillOpacity={1}
                          fill="url(#colorCompleted)"
                          strokeWidth={2}
                        />
                        <Area
                          type="monotone"
                          dataKey="scheduled"
                          name="Scheduled"
                          stroke="#0ea5e9"
                          fillOpacity={1}
                          fill="url(#colorScheduled)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Recent Candidates</CardTitle>
                      <CardDescription>Latest candidate interview results</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/candidates">
                        View all
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentCandidates.map((candidate) => (
                      <div key={candidate.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={candidate.avatar} alt={candidate.name} />
                            <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{candidate.name}</p>
                            <p className="text-sm text-muted-foreground">{candidate.position}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <Badge className={getStatusColor(candidate.status)}>{candidate.status}</Badge>
                            <p className="text-sm text-muted-foreground mt-1">{candidate.date}</p>
                          </div>
                          <div className="w-12 text-right">
                            <span
                              className={`font-medium ${
                                candidate.score >= 80
                                  ? "text-green-600"
                                  : candidate.score >= 70
                                    ? "text-amber-600"
                                    : "text-red-600"
                              }`}
                            >
                              {candidate.score}%
                            </span>
                          </div>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/candidates/${candidate.id}/report`}>
                              <ChevronRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item} initial="hidden" animate="show" className="md:col-span-3 space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Candidate Status</CardTitle>
                  <CardDescription>Distribution of interview outcomes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[220px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={candidateStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          label
                        >
                          {candidateStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-4 text-center">
                    {candidateStatusData.map((status) => (
                      <div key={status.name} className="space-y-1">
                        <div className="flex items-center justify-center gap-1">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: status.color }}></div>
                          <span className="text-sm font-medium">{status.name}</span>
                        </div>
                        <p className="text-2xl font-bold">{status.value}%</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Skills Distribution</CardTitle>
                  <CardDescription>Top skills among candidates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {skillsDistribution.map((skill) => (
                      <div key={skill.name} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{skill.name}</span>
                          <span className="text-sm text-muted-foreground">{skill.value}%</span>
                        </div>
                        <Progress value={skill.value} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Upcoming Interviews</CardTitle>
                  <CardDescription>Scheduled for today and tomorrow</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingInterviews.map((interview) => (
                      <div key={interview.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={interview.avatar} alt={interview.candidate} />
                            <AvatarFallback>{interview.candidate.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{interview.candidate}</p>
                            <p className="text-sm text-muted-foreground">{interview.position}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="mr-1 h-4 w-4" />
                            {interview.time}
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/interview/${interview.id}`}>Join</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="candidates">
          <Card>
            <CardHeader>
              <CardTitle>Candidate Analytics</CardTitle>
              <CardDescription>Detailed candidate performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { skill: "Technical", score: 82 },
                      { skill: "Communication", score: 78 },
                      { skill: "Problem Solving", score: 85 },
                      { skill: "Cultural Fit", score: 90 },
                      { skill: "Experience", score: 75 },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                    <XAxis dataKey="skill" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <RechartsTooltip />
                    <Bar dataKey="score" fill="#8932e8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs">
          <Card>
            <CardHeader>
              <CardTitle>Job Position Analytics</CardTitle>
              <CardDescription>Applications and fill rates by position</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { position: "UX Designer", applications: 48, filled: 2 },
                      { position: "React Developer", applications: 64, filled: 3 },
                      { position: "Product Manager", applications: 32, filled: 1 },
                      { position: "Data Scientist", applications: 28, filled: 0 },
                      { position: "DevOps Engineer", applications: 36, filled: 1 },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                    <XAxis dataKey="position" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="applications" name="Applications" fill="#8932e8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="filled" name="Positions Filled" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
