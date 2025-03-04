import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function InsuranceSubscription() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Healthcare Insurance Subscription</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Our comprehensive healthcare insurance plan covers a wide range of medical services.</p>
        <ul className="list-disc list-inside space-y-2">
          <li>24/7 access to medical professionals</li>
          <li>Coverage for hospital stays and surgeries</li>
          <li>Prescription drug coverage</li>
          <li>Preventive care services</li>
          <li>Mental health and wellness support</li>
          <li>Maternity and newborn care</li>
          <li>Emergency medical evacuation</li>
          <li>Telemedicine consultations</li>
        </ul>
        <p className="mt-4 font-bold">Cost: ₦10,000 per month</p>
        <p className="mt-2">Annual subscription: ₦110,000 (Save ₦10,000)</p>
        <p className="mt-4 text-sm">
          * Terms and conditions apply. Please refer to the policy document for detailed coverage information.
        </p>
      </CardContent>
    </Card>
  )
}

