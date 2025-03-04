"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-hot-toast"

export default function VirtualScan() {
  const [scanning, setScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState("")
  const [detailedAnalysis, setDetailedAnalysis] = useState("")
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (scanning) {
      interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(interval)
            setScanning(false)
            setResult("Scan complete. No abnormalities detected.")
            return 100
          }
          return prevProgress + 1
        })
      }, 50)
    }
    return () => clearInterval(interval)
  }, [scanning])

  const startScan = () => {
    setScanning(true)
    setProgress(0)
    setResult("")
  }

  const generateDetailedAnalysis = async () => {
    setIsGeneratingAnalysis(true)
    setDetailedAnalysis("")
    try {
      const response = await fetch("/api/analyze-scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ scanResult: result }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate detailed analysis")
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        setDetailedAnalysis((prev) => prev + chunk)
      }
    } catch (error) {
      console.error("Error generating detailed analysis:", error)
      toast.error("Failed to generate detailed analysis")
    } finally {
      setIsGeneratingAnalysis(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Virtual Scan Simulation</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Experience our cutting-edge virtual scan technology.</p>
        <Button onClick={startScan} disabled={scanning}>
          {scanning ? "Scanning..." : "Start Virtual Scan"}
        </Button>
        <AnimatePresence>
          {scanning && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-4"
            >
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground mt-2">Scanning in progress: {progress}%</p>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-4"
            >
              <p className="font-medium mb-2">{result}</p>
              <Button onClick={generateDetailedAnalysis} disabled={isGeneratingAnalysis}>
                {isGeneratingAnalysis ? "Generating..." : "Generate Detailed Analysis"}
              </Button>
              {detailedAnalysis && <Textarea value={detailedAnalysis} readOnly className="mt-4" rows={5} />}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

