"use client"

import { Suspense, useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Html, Box } from "@react-three/drei"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

function Model({ setSelectedPart }) {
  const [gltf, setGltf] = useState(null)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    const loader = new GLTFLoader()
    loader.load(
      "/human_body.glb",
      (gltf) => {
        setGltf(gltf)
      },
      undefined,
      (error) => {
        console.error("Error loading model:", error)
        setLoadError(true)
      },
    )
  }, [])

  const handleClick = (event) => {
    event.stopPropagation()
    setSelectedPart(event.object.name)
  }

  if (loadError) {
    return <FallbackModel setSelectedPart={setSelectedPart} />
  }

  if (!gltf) {
    return null
  }

  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      child.material.color.setHex(0xcccccc)
      child.material.emissive.setHex(0x000000)
    }
  })

  return <primitive object={gltf.scene} scale={0.5} onClick={handleClick} />
}

function FallbackModel({ setSelectedPart }) {
  const handleClick = (event) => {
    event.stopPropagation()
    setSelectedPart("Fallback Model")
  }

  return (
    <Box args={[1, 2, 0.5]} onClick={handleClick}>
      <meshStandardMaterial color="#cccccc" />
    </Box>
  )
}

export default function BodyAvatar() {
  const [selectedPart, setSelectedPart] = useState(null)

  return (
    <Card>
      <CardHeader>
        <CardTitle>3D Body Avatar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[400px] relative">
          <Canvas camera={{ position: [0, 0, 2] }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Suspense fallback={<Html>Loading 3D model...</Html>}>
              <Model setSelectedPart={setSelectedPart} />
            </Suspense>
            <OrbitControls />
          </Canvas>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: selectedPart ? 1 : 0, y: selectedPart ? 0 : 20 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
          >
            <p className="font-semibold mb-2">Selected: {selectedPart || "None"}</p>
            <Button onClick={() => setSelectedPart(null)} size="sm">
              Clear Selection
            </Button>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  )
}

