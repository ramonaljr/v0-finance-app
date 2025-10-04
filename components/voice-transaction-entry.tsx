"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Mic, MicOff, Loader2, Check, X } from "lucide-react"

interface VoiceTransactionEntryProps {
  isOpen: boolean
  onClose: () => void
  onSave: (transaction: any) => void
}

interface ParsedTransaction {
  payee?: string
  amount?: number
  category?: string
  date?: string
  notes?: string
}

export function VoiceTransactionEntry({ isOpen, onClose, onSave }: VoiceTransactionEntryProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [parsedData, setParsedData] = useState<ParsedTransaction | null>(null)
  const [editedData, setEditedData] = useState({
    payee: "",
    amount: "",
    category_id: "",
    occurred_at: new Date().toISOString().split('T')[0],
    notes: "",
  })
  const [recordingTime, setRecordingTime] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop()
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        await processAudio(audioBlob)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Could not access microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true)
    try {
      // In a real implementation, this would call a Speech-to-Text API (e.g., OpenAI Whisper)
      // For now, we'll simulate the STT processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Simulated transcription and NLP parsing
      const mockTranscript = "Groceries one hundred twenty seven dollars at Whole Foods"
      setTranscript(mockTranscript)

      const mockParsed: ParsedTransaction = {
        payee: "Whole Foods",
        amount: 127.00,
        category: "groceries",
        date: new Date().toISOString().split('T')[0],
        notes: mockTranscript
      }

      setParsedData(mockParsed)
      setEditedData({
        payee: mockParsed.payee || "",
        amount: mockParsed.amount?.toString() || "",
        category_id: mockParsed.category || "",
        occurred_at: mockParsed.date || new Date().toISOString().split('T')[0],
        notes: mockParsed.notes || "",
      })
    } catch (error) {
      console.error('Audio processing failed:', error)
      alert('Failed to process audio. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSave = () => {
    if (!editedData.payee || !editedData.amount) {
      alert('Please fill in required fields')
      return
    }

    const transaction = {
      amount_minor: Math.round(parseFloat(editedData.amount) * 100),
      currency_code: 'USD',
      direction: 'out' as const,
      payee: editedData.payee,
      occurred_at: new Date(editedData.occurred_at).toISOString(),
      category_id: editedData.category_id || undefined,
      notes: editedData.notes || undefined,
    }

    onSave(transaction)
    handleClose()
  }

  const handleClose = () => {
    if (isRecording) stopRecording()
    setTranscript("")
    setParsedData(null)
    setEditedData({
      payee: "",
      amount: "",
      category_id: "",
      occurred_at: new Date().toISOString().split('T')[0],
      notes: "",
    })
    setRecordingTime(0)
    onClose()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Voice Entry</DialogTitle>
          <DialogDescription>
            Speak your transaction details and we'll convert it to text
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!transcript ? (
            <>
              {/* Recording Interface */}
              <Card className={`p-8 ${isRecording ? 'bg-red-50 border-red-200' : 'bg-gray-50'} transition-colors`}>
                <div className="flex flex-col items-center gap-4">
                  <Button
                    size="lg"
                    className={`h-24 w-24 rounded-full ${
                      isRecording
                        ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                        : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'
                    }`}
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isProcessing}
                  >
                    {isRecording ? (
                      <MicOff className="h-10 w-10" />
                    ) : (
                      <Mic className="h-10 w-10" />
                    )}
                  </Button>

                  <div className="text-center">
                    {isRecording ? (
                      <>
                        <p className="text-lg font-bold text-red-600">Recording...</p>
                        <p className="text-2xl font-mono font-bold text-gray-900 mt-2">
                          {formatTime(recordingTime)}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          Tap to stop recording
                        </p>
                      </>
                    ) : isProcessing ? (
                      <>
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-2" />
                        <p className="text-lg font-bold text-gray-900">Processing...</p>
                        <p className="text-sm text-gray-600">Converting speech to text</p>
                      </>
                    ) : (
                      <>
                        <p className="text-lg font-bold text-gray-900">Ready to record</p>
                        <p className="text-sm text-gray-600 mt-2">
                          Tap microphone to start
                        </p>
                        <div className="mt-4 text-xs text-gray-500 bg-white rounded-lg p-3 border">
                          <p className="font-medium mb-1">Example:</p>
                          <p>"Groceries $127 at Whole Foods"</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            </>
          ) : (
            <>
              {/* Transcript & Parsed Data */}
              <Card className="p-4 bg-blue-50 border-blue-200">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 mb-1">Transcript:</p>
                    <p className="text-sm text-gray-700 italic">"{transcript}"</p>
                  </div>
                </div>
              </Card>

              {parsedData && (
                <Card className="p-4 bg-green-50 border-green-200">
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 mb-2">Extracted details:</p>
                      <div className="space-y-1 text-sm">
                        {parsedData.payee && (
                          <p><span className="font-medium">Payee:</span> {parsedData.payee}</p>
                        )}
                        {parsedData.amount && (
                          <p><span className="font-medium">Amount:</span> ${parsedData.amount.toFixed(2)}</p>
                        )}
                        {parsedData.category && (
                          <p><span className="font-medium">Category:</span> {parsedData.category}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Edit Form */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="payee">Payee *</Label>
                  <Input
                    id="payee"
                    value={editedData.payee}
                    onChange={(e) => setEditedData({ ...editedData, payee: e.target.value })}
                    placeholder="Enter payee"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="amount">Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={editedData.amount}
                    onChange={(e) => setEditedData({ ...editedData, amount: e.target.value })}
                    placeholder="0.00"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={editedData.category_id}
                    onValueChange={(value) => setEditedData({ ...editedData, category_id: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="groceries">Groceries</SelectItem>
                      <SelectItem value="dining">Dining</SelectItem>
                      <SelectItem value="transport">Transportation</SelectItem>
                      <SelectItem value="shopping">Shopping</SelectItem>
                      <SelectItem value="utilities">Utilities</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={editedData.occurred_at}
                    onChange={(e) => setEditedData({ ...editedData, occurred_at: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    value={editedData.notes}
                    onChange={(e) => setEditedData({ ...editedData, notes: e.target.value })}
                    placeholder="Add notes (optional)"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                  onClick={handleSave}
                  disabled={!editedData.payee || !editedData.amount}
                >
                  Save Transaction
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
