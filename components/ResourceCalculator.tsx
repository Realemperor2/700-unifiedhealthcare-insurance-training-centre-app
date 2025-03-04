export default function ResourceCalculator({ machines }) {
  const totalMachines = machines.length
  const averageEfficiency = machines.reduce((sum, machine) => sum + machine.efficiency, 0) / totalMachines || 0
  const estimatedCost = totalMachines * 10000 // Assuming each machine costs $10,000
  const estimatedSpace = totalMachines * 20 // Assuming each machine takes 20 sq meters

  return (
    <div className="bg-gray-100 p-4 rounded">
      <h3 className="text-lg font-semibold mb-2">Resource Calculator</h3>
      <ul>
        <li>Total Machines: {totalMachines}</li>
        <li>Average Efficiency: {(averageEfficiency * 100).toFixed(2)}%</li>
        <li>Estimated Cost: ${estimatedCost.toLocaleString()}</li>
        <li>Estimated Space: {estimatedSpace} sq meters</li>
      </ul>
    </div>
  )
}

