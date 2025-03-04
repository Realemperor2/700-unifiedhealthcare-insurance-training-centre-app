import dynamic from "next/dynamic"
import Layout from "../../components/Layout"

const ProductionLineDesigner = dynamic(() => import("../../components/ProductionLineDesigner"), { ssr: false })

export default function ProductionLinePage() {
  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">Production Line Designer</h2>
      <ProductionLineDesigner />
    </Layout>
  )
}

