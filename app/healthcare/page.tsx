import dynamic from "next/dynamic"
import Layout from "../../components/Layout"

const VirtualScan = dynamic(() => import("../../components/healthcare/VirtualScan"), { ssr: false })
const BodyAvatar = dynamic(() => import("../../components/healthcare/BodyAvatar"), { ssr: false })

export default function HealthcarePage() {
  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">UnifiedHealthcare</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <VirtualScan />
        <BodyAvatar />
      </div>
    </Layout>
  )
}

