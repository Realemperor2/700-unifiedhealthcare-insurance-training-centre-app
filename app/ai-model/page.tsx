import Layout from "../../components/Layout"
import AIModelCreator from "../../components/aimodel/AIModelCreator"

export default function AIModelPage() {
  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">AI Model Creator</h2>
      <AIModelCreator />
    </Layout>
  )
}

