"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Briefcase, Plus, Search, Info, Edit, Trash2, UserPlus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

// Sample job data
const initialJobs = [
  {
    id: 1,
    position: "Senior React Developer",
    experience: "3-5 years",
    description:
      "We are looking for a Senior React Developer with experience in building high-performance web applications. The ideal candidate should have strong knowledge of React, Redux, and modern JavaScript.",
    skills: ["React", "Redux", "TypeScript"],
    status: true,
  },
  {
    id: 2,
    position: "UX Designer",
    experience: "2-4 years",
    description:
      "We are seeking a talented UX Designer to create amazing user experiences. The ideal candidate should have a portfolio of professional design projects.",
    skills: ["Figma", "User Research", "Prototyping"],
    status: true,
  },
  {
    id: 3,
    position: "Product Manager",
    experience: "5-7 years",
    description:
      "We are looking for an experienced Product Manager to lead the development of our products from conception to launch.",
    skills: ["Agile", "Product Strategy", "User Stories"],
    status: false,
  },
]

export default function JobsPage() {
  const [jobs, setJobs] = useState(initialJobs)
  const [searchTerm, setSearchTerm] = useState("")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [jobToDelete, setJobToDelete] = useState<number | null>(null)
  const [showAddJobDialog, setShowAddJobDialog] = useState(false)
  const [newJob, setNewJob] = useState({
    position: "",
    experienceFrom: "",
    experienceTo: "",
    description: "",
  })
  const [showAddSkillDialog, setShowAddSkillDialog] = useState(false)
  const [currentJobId, setCurrentJobId] = useState<number | null>(null)
  const [newSkill, setNewSkill] = useState({
    name: "",
    level: "Beginner",
    duration: "30",
  })
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [invitation, setInvitation] = useState({
    name: "",
    email: "",
    phone: "",
    resume: null as File | null,
    jobId: null as number | null,
  })

  const filteredJobs = jobs.filter((job) => job.position.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleStatusChange = (id: number, checked: boolean) => {
    setJobs(jobs.map((job) => (job.id === id ? { ...job, status: checked } : job)))

    toast({
      title: checked ? "Job Activated" : "Job Deactivated",
      description: `Job posting has been ${checked ? "activated" : "deactivated"}.`,
    })
  }

  const handleDeleteJob = (id: number) => {
    setJobToDelete(id)
    setShowDeleteDialog(true)
  }

  const confirmDelete = () => {
    if (jobToDelete) {
      setJobs(jobs.filter((job) => job.id !== jobToDelete))
      setShowDeleteDialog(false)
      setJobToDelete(null)

      toast({
        title: "Job Deleted",
        description: "Job posting has been deleted successfully.",
      })
    }
  }

  const handleAddJob = () => {
    const newId = Math.max(...jobs.map((job) => job.id), 0) + 1
    const experience = newJob.experienceTo
      ? `${newJob.experienceFrom}-${newJob.experienceTo} years`
      : `${newJob.experienceFrom} years`

    setJobs([
      ...jobs,
      {
        id: newId,
        position: newJob.position,
        experience,
        description: newJob.description,
        skills: [],
        status: true,
      },
    ])

    setShowAddJobDialog(false)
    setNewJob({
      position: "",
      experienceFrom: "",
      experienceTo: "",
      description: "",
    })

    toast({
      title: "Job Created",
      description: "Job posting has been created successfully.",
    })

    // Open skills dialog after job creation
    setCurrentJobId(newId)
    setShowAddSkillDialog(true)
  }

  const handleAddSkill = () => {
    if (currentJobId) {
      setJobs(jobs.map((job) => (job.id === currentJobId ? { ...job, skills: [...job.skills, newSkill.name] } : job)))

      setShowAddSkillDialog(false)
      setNewSkill({
        name: "",
        level: "Beginner",
        duration: "30",
      })

      toast({
        title: "Skill Added",
        description: "Skill has been added to the job successfully.",
      })

      // Open invite dialog after adding skills
      setInvitation({
        ...invitation,
        jobId: currentJobId,
      })
      setShowInviteDialog(true)
    }
  }

  const handleInviteCandidate = () => {
    setShowInviteDialog(false)
    setInvitation({
      name: "",
      email: "",
      phone: "",
      resume: null,
      jobId: null,
    })

    toast({
      title: "Invitation Sent",
      description: "Candidate invitation has been sent successfully.",
    })
  }

  const openInviteDialog = (jobId: number) => {
    setInvitation({
      ...invitation,
      jobId,
    })
    setShowInviteDialog(true)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Jobs</h1>
          <p className="text-muted-foreground">Manage your job postings</p>
        </div>
        <Button className="bg-brand hover:bg-brand-light" onClick={() => setShowAddJobDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Job
        </Button>
      </div>

      <div className="mb-6 flex items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <Briefcase className="mx-auto h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No jobs found</h3>
          <p className="mt-2 text-muted-foreground">Create a new job posting to get started.</p>
          <Button className="mt-4 bg-brand hover:bg-brand-light" onClick={() => setShowAddJobDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Job
          </Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <div className="p-4">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="pb-3 text-left font-medium">Job Position</th>
                  <th className="pb-3 text-left font-medium">Experience</th>
                  <th className="pb-3 text-left font-medium">Description</th>
                  <th className="pb-3 text-left font-medium">Skills</th>
                  <th className="pb-3 text-left font-medium">Status</th>
                  <th className="pb-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="border-b last:border-0">
                    <td className="py-3">{job.position}</td>
                    <td className="py-3">{job.experience}</td>
                    <td className="py-3 max-w-xs">
                      <div className="flex items-center">
                        <span className="truncate">{job.description.substring(0, 50)}...</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Info className="h-4 w-4 text-muted-foreground" />
                              <span className="sr-only">View description</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-[300px]">
                            <div className="p-2">
                              <p className="text-sm">{job.description}</p>
                            </div>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-1">
                        {job.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center rounded-full bg-brand/10 px-2 py-1 text-xs font-medium text-brand"
                          >
                            {skill}
                          </span>
                        ))}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => {
                            setCurrentJobId(job.id)
                            setShowAddSkillDialog(true)
                          }}
                        >
                          <Plus className="h-4 w-4" />
                          <span className="sr-only">Add skill</span>
                        </Button>
                      </div>
                    </td>
                    <td className="py-3">
                      <Switch checked={job.status} onCheckedChange={(checked) => handleStatusChange(job.id, checked)} />
                    </td>
                    <td className="py-3">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => openInviteDialog(job.id)}
                          disabled={!job.status}
                        >
                          <UserPlus className="h-4 w-4" />
                          <span className="sr-only">Invite candidate</span>
                        </Button>
                        <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDeleteJob(job.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Job</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this job posting? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 sm:justify-end">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Job Dialog */}
      <Dialog open={showAddJobDialog} onOpenChange={setShowAddJobDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Job</DialogTitle>
            <DialogDescription>Fill in the details to create a new job posting.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="job-name">Job Name</Label>
              <Input
                id="job-name"
                placeholder="e.g., Senior React Developer"
                value={newJob.position}
                onChange={(e) => setNewJob({ ...newJob, position: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="experience-from">Experience From</Label>
                <Input
                  id="experience-from"
                  type="number"
                  placeholder="e.g., 3"
                  value={newJob.experienceFrom}
                  onChange={(e) => setNewJob({ ...newJob, experienceFrom: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="experience-to">Experience To (Optional)</Label>
                <Input
                  id="experience-to"
                  type="number"
                  placeholder="e.g., 5"
                  value={newJob.experienceTo}
                  onChange={(e) => setNewJob({ ...newJob, experienceTo: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="job-description">Job Description</Label>
              <Textarea
                id="job-description"
                placeholder="Enter job description..."
                className="min-h-[100px]"
                value={newJob.description}
                onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter className="flex space-x-2 sm:justify-end">
            <Button variant="outline" onClick={() => setShowAddJobDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-brand hover:bg-brand-light"
              onClick={handleAddJob}
              disabled={!newJob.position || !newJob.experienceFrom || !newJob.description}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Skill Dialog */}
      <Dialog open={showAddSkillDialog} onOpenChange={setShowAddSkillDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Skills</DialogTitle>
            <DialogDescription>Add required skills for this job position.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="skill-name">Skill</Label>
              <Input
                id="skill-name"
                placeholder="e.g., React"
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="skill-level">Level</Label>
              <Select value={newSkill.level} onValueChange={(value) => setNewSkill({ ...newSkill, level: value })}>
                <SelectTrigger id="skill-level">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="skill-duration">Duration (minutes)</Label>
              <Input
                id="skill-duration"
                type="number"
                placeholder="e.g., 30"
                value={newSkill.duration}
                onChange={(e) => setNewSkill({ ...newSkill, duration: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter className="flex space-x-2 sm:justify-end">
            <Button variant="outline" onClick={() => setShowAddSkillDialog(false)}>
              Skip
            </Button>
            <Button className="bg-brand hover:bg-brand-light" onClick={handleAddSkill} disabled={!newSkill.name}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite Candidate Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite Candidate</DialogTitle>
            <DialogDescription>Send an interview invitation to a candidate.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="candidate-name">Candidate Name</Label>
              <Input
                id="candidate-name"
                placeholder="e.g., John Doe"
                value={invitation.name}
                onChange={(e) => setInvitation({ ...invitation, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="candidate-email">Candidate Email</Label>
              <Input
                id="candidate-email"
                type="email"
                placeholder="e.g., john@example.com"
                value={invitation.email}
                onChange={(e) => setInvitation({ ...invitation, email: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="candidate-phone">Phone Number</Label>
              <Input
                id="candidate-phone"
                placeholder="e.g., +1 123 456 7890"
                value={invitation.phone}
                onChange={(e) => setInvitation({ ...invitation, phone: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="candidate-resume">Resume</Label>
              <Input
                id="candidate-resume"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null
                  setInvitation({ ...invitation, resume: file })
                }}
              />
            </div>
          </div>
          <DialogFooter className="flex space-x-2 sm:justify-end">
            <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-brand hover:bg-brand-light"
              onClick={handleInviteCandidate}
              disabled={!invitation.name || !invitation.email}
            >
              Send Invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  )
}
