"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Briefcase, Users, Settings, LogOut, Menu, BarChart2, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    setShowLogoutDialog(false)
    // In a real app, you would call your logout API here
    router.push("/login")
  }

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Jobs",
      href: "/jobs",
      icon: Briefcase,
    },
    {
      name: "Candidates",
      href: "/candidates",
      icon: Users,
    },
    {
      name: "Interviews",
      href: "/interviews",
      icon: Video,
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: BarChart2,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ]

  const NavItems = () => (
    <>
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center">
          <div className="w-8 h-8 rounded-md bg-brand flex items-center justify-center text-white font-bold mr-2">
            AH
          </div>
          <span className="font-semibold text-lg">Agentic HR</span>
        </Link>
      </div>
      <div className="space-y-1 p-2">
        {navItems.map((item, index) => (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                pathname === item.href ? "bg-brand text-white shadow-md" : "hover:bg-gray-100 hover:translate-x-1",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          </motion.div>
        ))}
      </div>
      <div className="mt-auto p-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
          onClick={() => setShowLogoutDialog(true)}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-full flex-col">
            <NavItems />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className={cn("hidden h-screen w-64 flex-col border-r md:flex", className)}>
        <NavItems />
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sign Out</DialogTitle>
            <DialogDescription>Are you sure you want to sign out?</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 sm:justify-end">
            <Button variant="outline" onClick={() => setShowLogoutDialog(false)}>
              Cancel
            </Button>
            <Button variant="default" className="bg-brand hover:bg-brand-light" onClick={handleLogout}>
              Sign Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
