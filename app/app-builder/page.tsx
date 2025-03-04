import Layout from "../../components/Layout"
import PromptToCode from "../../components/appbuilder/PromptToCode"

export default function AppBuilderPage() {
  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">Natural Language App Builder</h2>
      <PromptToCode />
    </Layout>
  )
}

