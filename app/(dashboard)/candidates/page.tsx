"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Download, Send, Copy, RefreshCw, FileText } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

// Sample candidate data
const initialCandidates = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 123 456 7890",
    jobPosition: "Senior React Developer",
    status: "Invited",
    invitedDate: "2025-04-05",
    interviewDate: null,
    resume: "john-doe-resume.pdf",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 234 567 8901",
    jobPosition: "UX Designer",
    status: "In Progress",
    invitedDate: "2025-04-03",
    interviewDate: "2025-04-08",
    resume: "jane-smith-resume.pdf",
  },
  {
    id: 3,
    name: "Michael Johnson",
    email: "michael.johnson@example.com",
    phone: "+1 345 678 9012",
    jobPosition: "Product Manager",
    status: "Selected",
    invitedDate: "2025-03-28",
    interviewDate: "2025-04-02",
    resume: "michael-johnson-resume.pdf",
  },
  {
    id: 4,
    name: "Emily Williams",
    email: "emily.williams@example.com",
    phone: "+1 456 789 0123",
    jobPosition: "Senior React Developer",
    status: "Rejected",
    invitedDate: "2025-03-25",
    interviewDate: "2025-03-30",
    resume: "emily-williams-resume.pdf",
  },
]

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState(initialCandidates)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [jobFilter, setJobFilter] = useState<string[]>([])
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [actionType, setActionType] = useState<"resend" | "regenerate" | null>(null)
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null)

  // Get unique job positions for filter
  const uniqueJobs = Array.from(new Set(candidates.map((c) => c.jobPosition)))

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.phone.includes(searchTerm) ||
      candidate.jobPosition.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(candidate.status)
    const matchesJob = jobFilter.length === 0 || jobFilter.includes(candidate.jobPosition)

    return matchesSearch && matchesStatus && matchesJob
  })

  const handleResendInvitation = (id: number) => {
    const candidate = candidates.find((c) => c.id === id)
    if (candidate && (candidate.status === "Invited" || candidate.status === "In Progress")) {
      setSelectedCandidate(id)
      setActionType("resend")
      setShowConfirmDialog(true)
    } else {
      toast({
        title: "Cannot Resend Invitation",
        description: "Invitation cannot be resent. Candidate has already completed the process.",
        variant: "destructive",
      })
    }
  }

  const handleCopyLink = (id: number) => {
    const candidate = candidates.find((c) => c.id === id)
    if (candidate && candidate.status === "Invited") {
      // In a real app, you would get the actual interview link
      navigator.clipboard.writeText(`https://agentic-hr.com/interview/${id}`)
      toast({
        title: "Link Copied",
        description: "Interview link copied to clipboard.",
      })
    } else {
      toast({
        title: "Cannot Copy Link",
        description: "Interview link is not available for this candidate.",
        variant: "destructive",
      })
    }
  }

  const handleRegenerateLink = (id: number) => {
    const candidate = candidates.find((c) => c.id === id)
    if (candidate && (candidate.status === "Invited" || candidate.status === "In Progress")) {
      setSelectedCandidate(id)
      setActionType("regenerate")
      setShowConfirmDialog(true)
    } else {
      toast({
        title: "Cannot Regenerate Link",
        description: "Interview link cannot be regenerated for a completed interview.",
        variant: "destructive",
      })
    }
  }

  const confirmAction = () => {
    if (!selectedCandidate || !actionType) return

    if (actionType === "resend") {
      toast({
        title: "Invitation Resent",
        description: "Invitation has been resent to the candidate.",
      })
    } else if (actionType === "regenerate") {
      toast({
        title: "Link Regenerated",
        description: "Interview link regenerated successfully and sent to candidate.",
      })
    }

    setShowConfirmDialog(false)
    setSelectedCandidate(null)
    setActionType(null)
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Invited":
        return "bg-blue-100 text-blue-800"
      case "In Progress":
        return "bg-yellow-100 text-yellow-800"
      case "Selected":
        return "bg-green-100 text-green-800"
      case "Rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Candidates</h1>
        <p className="text-muted-foreground">Manage your candidates and interviews</p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search candidates..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select onValueChange={(value) => setStatusFilter(value ? [value] : [])}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Invited">Invited</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Selected">Selected</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => setJobFilter(value ? [value] : [])}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by job" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Jobs</SelectItem>
              {uniqueJobs.map((job) => (
                <SelectItem key={job} value={job}>
                  {job}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <div className="p-4">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="pb-3 text-left font-medium">Candidate Details</th>
                <th className="pb-3 text-left font-medium">Job Position</th>
                <th className="pb-3 text-left font-medium">Status</th>
                <th className="pb-3 text-left font-medium">Invited Date</th>
                <th className="pb-3 text-left font-medium">Interview Date</th>
                <th className="pb-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.map((candidate) => (
                <tr key={candidate.id} className="border-b last:border-0">
                  <td className="py-3">
                    <div className="flex flex-col">
                      <span className="font-medium">{candidate.name}</span>
                      <div className="flex items-center text-sm text-muted-foreground">
                        {candidate.email}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 ml-1"
                          onClick={() => {
                            navigator.clipboard.writeText(candidate.email)
                            toast({
                              title: "Email Copied",
                              description: "Email address copied to clipboard.",
                            })
                          }}
                        >
                          <Copy className="h-3 w-3" />
                          <span className="sr-only">Copy email</span>
                        </Button>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">{candidate.jobPosition}</td>
                  <td className="py-3">
                    <Badge className={getStatusBadgeColor(candidate.status)}>{candidate.status}</Badge>
                  </td>
                  <td className="py-3">{candidate.invitedDate}</td>
                  <td className="py-3">{candidate.interviewDate || "-"}</td>
                  <td className="py-3">
                    <div className="flex space-x-2">
                      <TooltipProvider>
                        {candidate.status === "Selected" || candidate.status === "Rejected" ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="outline" size="icon">
                                <FileText className="h-4 w-4" />
                                <span className="sr-only">View Report</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View Report</p>
                            </TooltipContent>
                          </Tooltip>
                        ) : null}

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="icon">
                              <Download className="h-4 w-4" />
                              <span className="sr-only">Download Resume</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Download Resume</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="icon" onClick={() => handleResendInvitation(candidate.id)}>
                              <Send className="h-4 w-4" />
                              <span className="sr-only">Resend Invitation</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Resend Invitation</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="icon" onClick={() => handleCopyLink(candidate.id)}>
                              <Copy className="h-4 w-4" />
                              <span className="sr-only">Copy Interview Link</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Copy Interview Link</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="icon" onClick={() => handleRegenerateLink(candidate.id)}>
                              <RefreshCw className="h-4 w-4" />
                              <span className="sr-only">Regenerate Interview Link</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Regenerate Interview Link</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{actionType === "resend" ? "Resend Invitation" : "Regenerate Interview Link"}</DialogTitle>
            <DialogDescription>
              {actionType === "resend"
                ? "Are you sure you want to resend the invitation email?"
                : "Are you sure you want to regenerate the interview link? The old link will no longer be valid."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 sm:justify-end">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-brand hover:bg-brand-light" onClick={confirmAction}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  )
}
