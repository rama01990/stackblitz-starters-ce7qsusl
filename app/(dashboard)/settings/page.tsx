"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    companyName: "Acme Inc.",
    email: "hr@acmeinc.com",
    interviewDuration: 30,
    defaultExpiryDays: 5,
    notifications: {
      email: true,
      browser: false,
    },
  })

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been saved successfully.",
    })
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">General Settings</h3>
          <p className="text-sm text-muted-foreground">Configure your general account settings.</p>
          <Separator className="my-4" />
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                value={settings.companyName}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium">Interview Settings</h3>
          <p className="text-sm text-muted-foreground">Configure your interview settings.</p>
          <Separator className="my-4" />
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="interview-duration">Default Interview Duration (minutes)</Label>
              <Input
                id="interview-duration"
                type="number"
                value={settings.interviewDuration}
                onChange={(e) => setSettings({ ...settings, interviewDuration: Number.parseInt(e.target.value) })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="expiry-days">Default Link Expiry (days)</Label>
              <Input
                id="expiry-days"
                type="number"
                value={settings.defaultExpiryDays}
                onChange={(e) => setSettings({ ...settings, defaultExpiryDays: Number.parseInt(e.target.value) })}
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium">Notification Settings</h3>
          <p className="text-sm text-muted-foreground">Configure your notification preferences.</p>
          <Separator className="my-4" />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive email notifications for candidate activities.</p>
              </div>
              <Switch
                id="email-notifications"
                checked={settings.notifications.email}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      email: checked,
                    },
                  })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="browser-notifications">Browser Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive browser notifications for candidate activities.</p>
              </div>
              <Switch
                id="browser-notifications"
                checked={settings.notifications.browser}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      browser: checked,
                    },
                  })
                }
              />
            </div>
          </div>
        </div>

        <Button className="bg-brand hover:bg-brand-light" onClick={handleSave}>
          Save Changes
        </Button>
      </div>

      <Toaster />
    </div>
  )
}
