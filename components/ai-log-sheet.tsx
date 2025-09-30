"use client"

import { useState, useRef } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Camera, Mic, ImageIcon, X, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function AILogSheet() {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<"photo" | "voice" | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [transcription, setTranscription] = useState("")
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setMode("photo")
    } catch (error) {
      console.error("[v0] Camera access denied:", error)
      alert("Camera access is required to capture receipts. Please enable camera permissions.")
    }
  }

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas")
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0)
        const imageData = canvas.toDataURL("image/jpeg")
        setCapturedImage(imageData)
        stopCamera()
      }
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      setIsRecording(true)
      setMode("voice")

      // Simulate transcription after 3 seconds
      setTimeout(() => {
        setTranscription("Spent $45.50 on groceries at Whole Foods")
        setIsRecording(false)
        stopCamera()
      }, 3000)
    } catch (error) {
      console.error("[v0] Microphone access denied:", error)
      alert("Microphone access is required for voice logging. Please enable microphone permissions.")
    }
  }

  const processAILog = () => {
    // Simulate AI processing
    alert("AI is processing your transaction. This will be added to your budget automatically!")
    setIsOpen(false)
    resetState()
  }

  const resetState = () => {
    setMode(null)
    setCapturedImage(null)
    setTranscription("")
    setIsRecording(false)
    stopCamera()
  }

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) resetState()
      }}
    >
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="w-full gap-2 bg-gradient-to-r from-[#2563EB]/10 to-[#7B8BB5]/10 border-[#2563EB]/20"
        >
          <span className="text-lg">🤖</span>
          AI Log - Photo or Voice
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[90vh] p-0">
        <SheetHeader className="border-b border-border bg-gradient-to-r from-[#2563EB] to-[#7B8BB5] px-6 py-4">
          <SheetTitle className="text-center text-white">AI Transaction Logger</SheetTitle>
        </SheetHeader>

        <div className="flex h-[calc(100%-60px)] flex-col">
          {!mode && !capturedImage && !transcription && (
            <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
              <div className="text-center">
                <h3 className="mb-2 text-lg font-semibold text-foreground">Choose logging method</h3>
                <p className="text-sm text-muted-foreground">Capture a receipt or describe your transaction</p>
              </div>

              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="h-32 w-32 flex-col gap-3 bg-[#2563EB] hover:bg-[#2563EB]/90"
                  onClick={startCamera}
                >
                  <Camera className="h-8 w-8" />
                  <span>Photo</span>
                </Button>
                <Button
                  size="lg"
                  className="h-32 w-32 flex-col gap-3 bg-[#16A34A] hover:bg-[#16A34A]/90"
                  onClick={startVoiceRecording}
                >
                  <Mic className="h-8 w-8" />
                  <span>Voice</span>
                </Button>
              </div>

              <div className="mt-4 space-y-2 text-center">
                <Badge variant="secondary" className="gap-1">
                  <ImageIcon className="h-3 w-3" />
                  AI extracts amount, merchant, category
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <Mic className="h-3 w-3" />
                  AI understands natural speech
                </Badge>
              </div>
            </div>
          )}

          {mode === "photo" && !capturedImage && (
            <div className="relative flex-1">
              <video ref={videoRef} autoPlay playsInline className="h-full w-full object-cover" />
              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-12 w-12 rounded-full bg-white"
                  onClick={() => {
                    stopCamera()
                    setMode(null)
                  }}
                >
                  <X className="h-6 w-6" />
                </Button>
                <Button size="icon" className="h-16 w-16 rounded-full bg-white" onClick={capturePhoto}>
                  <Camera className="h-8 w-8 text-[#2563EB]" />
                </Button>
              </div>
            </div>
          )}

          {capturedImage && (
            <div className="flex flex-1 flex-col">
              <div className="relative flex-1">
                <img
                  src={capturedImage || "/placeholder.svg"}
                  alt="Captured receipt"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="border-t border-border p-6">
                <div className="mb-4 space-y-2">
                  <p className="text-sm text-muted-foreground">AI detected:</p>
                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-base font-semibold text-foreground">$45.50</p>
                    <p className="text-sm text-muted-foreground">Whole Foods Market</p>
                    <Badge className="mt-2">Food & Drink - Groceries</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setCapturedImage(null)}>
                    Retake
                  </Button>
                  <Button className="flex-1 bg-[#16A34A] hover:bg-[#16A34A]/90" onClick={processAILog}>
                    <Check className="mr-2 h-4 w-4" />
                    Confirm
                  </Button>
                </div>
              </div>
            </div>
          )}

          {mode === "voice" && isRecording && (
            <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
              <div className="relative">
                <div className="h-32 w-32 animate-pulse rounded-full bg-[#16A34A]/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Mic className="h-16 w-16 text-[#16A34A]" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="mb-2 text-lg font-semibold text-foreground">Listening...</h3>
                <p className="text-sm text-muted-foreground">Say something like "I spent $20 on lunch at Chipotle"</p>
              </div>
            </div>
          )}

          {transcription && (
            <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
              <div className="w-full max-w-md space-y-4">
                <div className="text-center">
                  <h3 className="mb-2 text-lg font-semibold text-foreground">I heard:</h3>
                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-base text-foreground">{transcription}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">AI extracted:</p>
                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-base font-semibold text-foreground">$45.50</p>
                    <p className="text-sm text-muted-foreground">Whole Foods</p>
                    <Badge className="mt-2">Food & Drink - Groceries</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 bg-transparent" onClick={resetState}>
                    Try Again
                  </Button>
                  <Button className="flex-1 bg-[#16A34A] hover:bg-[#16A34A]/90" onClick={processAILog}>
                    <Check className="mr-2 h-4 w-4" />
                    Confirm
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
