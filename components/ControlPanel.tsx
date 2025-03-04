import { Button } from "@/components/ui/button"

export default function ControlPanel({ addMachine, removeMachine, toggleSimulation, simulationRunning }) {
  return (
    <div className="bg-gray-100 p-4 rounded mb-4">
      <h3 className="text-lg font-semibold mb-2">Control Panel</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        <Button onClick={() => addMachine("conveyor")}>Add Conveyor</Button>
        <Button onClick={() => addMachine("processor")}>Add Processor</Button>
        <Button onClick={() => addMachine("packager")}>Add Packager</Button>
        <Button onClick={() => addMachine("quality-control")}>Add Quality Control</Button>
        <Button onClick={() => addMachine("storage")}>Add Storage</Button>
      </div>
      <Button onClick={toggleSimulation} variant={simulationRunning ? "destructive" : "default"}>
        {simulationRunning ? "Stop Simulation" : "Start Simulation"}
      </Button>
    </div>
  )
}

