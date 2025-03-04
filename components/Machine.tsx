"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Box, Text } from "@react-three/drei"

const machineColors = {
  conveyor: "gray",
  processor: "blue",
  packager: "green",
  "quality-control": "red",
  storage: "yellow",
}

const machineShapes = {
  conveyor: [3, 0.5, 1],
  processor: [1, 1, 1],
  packager: [1, 1, 2],
  "quality-control": [1, 1.5, 1],
  storage: [2, 2, 2],
}

export default function Machine({ id, type, position, efficiency, isSimulating }) {
  const meshRef = useRef()

  useFrame((state, delta) => {
    if (isSimulating) {
      meshRef.current.rotation.y += delta * efficiency
    }
  })

  return (
    <group position={position}>
      <Box args={machineShapes[type]} ref={meshRef}>
        <meshStandardMaterial color={machineColors[type] || "white"} />
      </Box>
      <Text
        position={[0, machineShapes[type][1] / 2 + 0.5, 0]}
        fontSize={0.5}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {`${type} (${Math.round(efficiency * 100)}%)`}
      </Text>
    </group>
  )
}

