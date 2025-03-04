"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import { toast } from "react-hot-toast"

export default function AIModelCreator() {
  const [modelConfig, setModelConfig] = useState({
    name: "",
    description: "",
    trainingData: "",
    modelType: "classification",
  })
  const [isTraining, setIsTraining] = useState(false)
  const [trainedModel, setTrainedModel] = useState(null)
  const [activeTab, setActiveTab] = useState("config")
  const [prediction, setPrediction] = useState("")
  const [explanation, setExplanation] = useState("")
  const [isExplaining, setIsExplaining] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setModelConfig((prev) => ({ ...prev, [name]: value }))
  }

  const handleTrainModel = async () => {
    if (!modelConfig.name || !modelConfig.trainingData) {
      toast.error("Please provide a model name and training data")
      return
    }

    setIsTraining(true)
    try {
      const response = await fetch("/api/train-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(modelConfig),
      })

      if (!response.ok) {
        throw new Error("Failed to train model")
      }

      const data = await response.json()
      setTrainedModel(data.model)
      setActiveTab("evaluation")
      toast.success("Model trained successfully!")
    } catch (error) {
      console.error("Error training model:", error)
      toast.error("Failed to train model. Please try again.")
    } finally {
      setIsTraining(false)
    }
  }

  const handlePredict = async () => {
    // Implement prediction logic here
    // For this example, we'll just set a mock prediction
    setPrediction("Mock prediction result")
  }

  const generateExplanation = async () => {
    if (!prediction) {
      toast.error("Please make a prediction first")
      return
    }

    setIsExplaining(true)
    setExplanation("")
    try {
      const response = await fetch("/api/explain-prediction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prediction, modelConfig }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate explanation")
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        setExplanation((prev) => prev + chunk)
      }
    } catch (error) {
      console.error("Error generating explanation:", error)
      toast.error("Failed to generate explanation. Please try again.")
    } finally {
      setIsExplaining(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>No-Code AI Model Creator</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="evaluation" disabled={!trainedModel}>
              Evaluation
            </TabsTrigger>
          </TabsList>
          <TabsContent value="config">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Model Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={modelConfig.name}
                  onChange={handleInputChange}
                  placeholder="Enter model name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={modelConfig.description}
                  onChange={handleInputChange}
                  placeholder="Describe your model"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="modelType">Model Type</Label>
                <select
                  id="modelType"
                  name="modelType"
                  value={modelConfig.modelType}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="classification">Classification</option>
                  <option value="regression">Regression</option>
                  <option value="clustering">Clustering</option>
                </select>
              </div>
              <div>
                <Label htmlFor="trainingData">Training Data (CSV format)</Label>
                <Textarea
                  id="trainingData"
                  name="trainingData"
                  value={modelConfig.trainingData}
                  onChange={handleInputChange}
                  placeholder="Enter your training data in CSV format"
                  rows={10}
                />
              </div>
              <Button onClick={handleTrainModel} disabled={isTraining}>
                {isTraining ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Training...
                  </>
                ) : (
                  "Train Model"
                )}
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="evaluation">
            {trainedModel && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Model Evaluation</h3>
                <p>Accuracy: {trainedModel.accuracy.toFixed(2)}</p>
                <p>F1 Score: {trainedModel.f1Score.toFixed(2)}</p>
                <h4 className="text-md font-semibold mt-4">Test the Model</h4>
                <Textarea placeholder="Enter test data in CSV format" rows={5} />
                <Button onClick={handlePredict}>Run Prediction</Button>
                {prediction && (
                  <>
                    <p>Prediction: {prediction}</p>
                    <Button onClick={generateExplanation} disabled={isExplaining}>
                      {isExplaining ? "Explaining..." : "Explain Prediction"}
                    </Button>
                    {explanation && <Textarea value={explanation} readOnly rows={5} />}
                  </>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

