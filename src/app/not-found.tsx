"use client"
 
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center text-center space-y-6 max-w-md">
        {/* Animated 404 Text */}
        <h1 className="text-[8rem] font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-brand1 via-brand2 to-primary select-none animate-in fade-in zoom-in duration-500">
          404
        </h1>
        
        <div className="space-y-2 animate-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-backwards">
          <h2 className="text-2xl font-semibold tracking-tight">
            Page not found
          </h2>
          <p className="text-muted-foreground text-sm">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or doesn&apos;t exist.
          </p>
        </div>

        <div className="flex items-center gap-2 pt-4 animate-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-backwards">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="size-4" />
            Go Back
          </Button>
          <Button asChild className="bg-gradient-to-r from-brand1 to-brand2 hover:opacity-90 transition-opacity">
            <Link href="/">
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
