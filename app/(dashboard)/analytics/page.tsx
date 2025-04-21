"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts"
import { ArrowUpRight, ArrowDownRight, TrendingUp, Users, CheckCircle, Clock } from "lucide-react"

// Mock data for charts
const skillsData = [
  { name: "React", score: 85 },
  { name: "TypeScript", score: 78 },
  { name: "UI/UX", score: 92 },
  { name: "Node.js", score: 65 },
  { name: "Communication", score: 88 },
]

const interviewsOverTime = [
  { month: "Jan", count: 12, selected: 5, rejected: 7 },
  { month: "Feb", count: 19, selected: 8, rejected: 11 },
  { month: "Mar", count: 25, selected: 12, rejected: 13 },
  { month: "Apr", count: 32, selected: 15, rejected: 17 },
  { month: "May", count: 28, selected: 14, rejected: 14 },
  { month: "Jun", count: 35, selected: 18, rejected: 17 },
]

const candidateStatusData = [
  { name: "Selected", value: 35, color: "#10b981" },
  { name: "Rejected", value: 45, color: "#ef4444" },
  { name: "In Process", value: 20, color: "#f59e0b" },
]

const jobPositionData = [
  { name: "UX Designer", count: 28, fillRate: 75 },
  { name: "React Developer", count: 35, fillRate: 60 },
  { name: "Product Manager", count: 18, fillRate: 85 },
  { name: "Data Scientist", count: 12, fillRate: 40 },
  { name: "DevOps Engineer", count: 8, fillRate: 30 },
]

const candidateSourceData = [
  { name: "LinkedIn", value: 45, color: "#0077b5" },
  { name: "Referrals", value: 25, color: "#10b981" },
  { name: "Job Boards", value: 15, color: "#8932e8" },
  { name: "Company Website", value: 10, color: "#f59e0b" },
  { name: "Other", value: 5, color: "#6b7280" },
]

const timeToHireData = [
  { stage: "Application", days: 1 },
  { stage: "Screening", days: 3 },
  { stage: "First Interview", days: 5 },
  { stage: "Technical Assessment", days: 7 },
  { stage: "Final Interview", days: 4 },
  { stage: "Offer", days: 2 },
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

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30days")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Insights from your interviews and candidates</p>
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
        </div>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate={isLoading ? "hidden" : "show"}
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
                  <p className="text-sm font-medium text-muted-foreground">Avg. Time to Hire</p>
                  <div className="flex items-baseline space-x-2">
                    <h2 className="text-3xl font-bold">22</h2>
                    <span className="text-sm text-muted-foreground">days</span>
                  </div>
                </div>
                <div className="rounded-full bg-amber-500/10 p-3 text-amber-500">
                  <Clock className="h-6 w-6" />
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
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="positions">Positions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-7">
            <motion.div variants={item} initial="hidden" animate="show" className="md:col-span-4 space-y-4">
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle>Interview Trends</CardTitle>
                  <CardDescription>Monthly interview outcomes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={interviewsOverTime} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8932e8" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8932e8" stopOpacity={0.1} />
                          </linearGradient>
                          <linearGradient id="colorSelected" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                          </linearGradient>
                          <linearGradient id="colorRejected" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="count"
                          name="Total Interviews"
                          stroke="#8932e8"
                          fillOpacity={1}
                          fill="url(#colorCount)"
                          strokeWidth={2}
                        />
                        <Area
                          type="monotone"
                          dataKey="selected"
                          name="Selected"
                          stroke="#10b981"
                          fillOpacity={1}
                          fill="url(#colorSelected)"
                          strokeWidth={2}
                        />
                        <Area
                          type="monotone"
                          dataKey="rejected"
                          name="Rejected"
                          stroke="#ef4444"
                          fillOpacity={1}
                          fill="url(#colorRejected)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Time to Hire</CardTitle>
                  <CardDescription>Average days spent in each hiring stage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={timeToHireData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.2} />
                        <XAxis type="number" />
                        <YAxis dataKey="stage" type="category" width={120} />
                        <Tooltip />
                        <Bar
                          dataKey="days"
                          name="Average Days"
                          fill="#8932e8"
                          radius={[0, 4, 4, 0]}
                          label={{ position: "right", fill: "#666", fontSize: 12 }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
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
                        <Tooltip />
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
                  <CardTitle>Candidate Sources</CardTitle>
                  <CardDescription>Where candidates are coming from</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[220px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={candidateSourceData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {candidateSourceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="candidates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Candidate Performance</CardTitle>
              <CardDescription>Average scores across different assessment areas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium">Technical Skills</span>
                    <span className="text-sm font-medium">82%</span>
                  </div>
                  <Progress value={82} className="h-2" />
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium">Communication</span>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium">Problem Solving</span>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium">Cultural Fit</span>
                    <span className="text-sm font-medium">90%</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium">Experience</span>
                    <span className="text-sm font-medium">75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Skills Assessment</CardTitle>
              <CardDescription>Average scores by skill across all candidates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={skillsData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="score" fill="#8932e8" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="positions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Job Positions</CardTitle>
              <CardDescription>Number of interviews and fill rates by position</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={jobPositionData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 100]} unit="%" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="count" name="Interviews" fill="#8932e8" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="fillRate" name="Fill Rate %" fill="#10b981" radius={[4, 4, 0, 0]} />
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
