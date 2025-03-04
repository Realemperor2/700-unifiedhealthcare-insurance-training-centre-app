"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { toast } from "react-hot-toast"

export default function PromptToCode() {
  const [prompt, setPrompt] = useState("")
  const [generatedCode, setGeneratedCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("code")
  const [codeType, setCodeType] = useState("react")

  const handleGenerateCode = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt")
      return
    }

    setIsLoading(true)
    setGeneratedCode("")
    try {
      const response = await fetch("/api/generate-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, codeType }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate code")
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        setGeneratedCode((prev) => prev + chunk)
      }

      setActiveTab("code")
    } catch (error) {
      console.error("Error generating code:", error)
      toast.error("Failed to generate code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prompt-to-Code Engine</CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={codeType} onValueChange={setCodeType}>
          <SelectTrigger className="w-[180px] mb-4">
            <SelectValue placeholder="Select code type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="react">React</SelectItem>
            <SelectItem value="vue">Vue</SelectItem>
            <SelectItem value="angular">Angular</SelectItem>
            <SelectItem value="svelte">Svelte</SelectItem>
          </SelectContent>
        </Select>
        <Textarea
          placeholder="Enter your prompt here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="mb-4"
          rows={5}
        />
        <Button onClick={handleGenerateCode} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Code"
          )}
        </Button>
        {generatedCode && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList>
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="code">
              <pre className="mt-4 p-4 bg-gray-100 rounded overflow-x-auto">
                <code>{generatedCode}</code>
              </pre>
            </TabsContent>
            <TabsContent value="preview">
              <div className="mt-4 p-4 border rounded">
                <iframe
                  srcDoc={generatedCode}
                  style={{ width: "100%", height: "300px", border: "none" }}
                  title="Code Preview"
                />
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}

