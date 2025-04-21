import { LoginForm } from "@/components/auth/login-form"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="mb-8 flex items-center">
        <Image
          src="/placeholder.svg?height=40&width=40"
          alt="Agentic HR Logo"
          width={40}
          height={40}
          className="mr-2"
        />
        <h1 className="text-2xl font-bold text-brand">Agentic HR</h1>
      </div>
      <LoginForm />
    </div>
  )
}
