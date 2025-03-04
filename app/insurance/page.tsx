import Layout from "../../components/Layout"
import InsuranceSubscription from "../../components/insurance/InsuranceSubscription"
import PaymentSystem from "../../components/insurance/PaymentSystem"
import SignUpForm from "../../components/insurance/SignUpForm"
import Auth from "../../components/Auth"

export default function InsurancePage() {
  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">Unified Insurance</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Auth />
        <InsuranceSubscription />
        <SignUpForm />
        <PaymentSystem />
      </div>
    </Layout>
  )
}

