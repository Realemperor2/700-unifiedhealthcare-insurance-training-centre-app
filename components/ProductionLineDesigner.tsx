"use client"

import { useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Sky } from "@react-three/drei"
import Machine from "./Machine"
import ControlPanel from "./ControlPanel"
import ResourceCalculator from "./ResourceCalculator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "react-hot-toast"

export default function ProductionLineDesigner() {
  const [machines, setMachines] = useState([])
  const [simulationRunning, setSimulationRunning] = useState(false)
  const [designName, setDesignName] = useState("")
  const [optimizationSuggestion, setOptimizationSuggestion] = useState("")
  const [isGeneratingSuggestion, setIsGeneratingSuggestion] = useState(false)

  const addMachine = (type) => {
    const newMachine = {
      id: Date.now(),
      type,
      position: [machines.length * 3, 0, 0],
      efficiency: Math.random() * 0.5 + 0.5,
    }
    setMachines([...machines, newMachine])
  }

  const removeMachine = (id) => {
    setMachines(machines.filter((machine) => machine.id !== id))
  }

  const toggleSimulation = () => {
    setSimulationRunning(!simulationRunning)
  }

  const saveDesign = () => {
    if (!designName) {
      toast.error("Please enter a name for your design")
      return
    }
    localStorage.setItem(designName, JSON.stringify(machines))
    toast.success("Design saved successfully")
  }

  const loadDesign = () => {
    if (!designName) {
      toast.error("Please enter the name of the design to load")
      return
    }
    const savedMachines = localStorage.getItem(designName)
    if (savedMachines) {
      setMachines(JSON.parse(savedMachines))
      toast.success("Design loaded successfully")
    } else {
      toast.error("No saved design found with that name")
    }
  }

  const generateOptimizationSuggestion = async () => {
    setIsGeneratingSuggestion(true)
    setOptimizationSuggestion("")
    try {
      const response = await fetch("/api/optimize-production", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ machines }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate optimization suggestion")
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        setOptimizationSuggestion((prev) => prev + chunk)
      }
    } catch (error) {
      console.error("Error generating optimization suggestion:", error)
      toast.error("Failed to generate optimization suggestion")
    } finally {
      setIsGeneratingSuggestion(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full h-[600px] border border-gray-300 rounded">
        <Canvas camera={{ position: [0, 5, 10] }}>
          <Sky />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          {machines.map((machine) => (
            <Machine key={machine.id} {...machine} isSimulating={simulationRunning} />
          ))}
          <OrbitControls />
        </Canvas>
      </div>
      <div className="flex gap-4">
        <div className="w-1/3">
          <ControlPanel
            addMachine={addMachine}
            removeMachine={removeMachine}
            toggleSimulation={toggleSimulation}
            simulationRunning={simulationRunning}
          />
        </div>
        <div className="w-1/3">
          <ResourceCalculator machines={machines} />
        </div>
        <div className="w-1/3">
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="text-lg font-semibold mb-2">Save/Load Design</h3>
            <div className="space-y-2">
              <Label htmlFor="designName">Design Name</Label>
              <Input
                id="designName"
                value={designName}
                onChange={(e) => setDesignName(e.target.value)}
                placeholder="Enter design name"
              />
              <div className="flex gap-2">
                <Button onClick={saveDesign}>Save</Button>
                <Button onClick={loadDesign}>Load</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full">
        <Button onClick={generateOptimizationSuggestion} disabled={isGeneratingSuggestion}>
          {isGeneratingSuggestion ? "Generating..." : "Generate Optimization Suggestion"}
        </Button>
        {optimizationSuggestion && <Textarea value={optimizationSuggestion} readOnly className="mt-4" rows={5} />}
      </div>
    </div>
  )
}

