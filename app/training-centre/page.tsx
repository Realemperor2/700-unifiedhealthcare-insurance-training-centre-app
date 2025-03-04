import Layout from "../../components/Layout"

export default function TrainingCentrePage() {
  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">Unified Training Centre</h2>
      <p className="text-lg mb-4">
        Welcome to our state-of-the-art training facility. Here, we offer a wide range of professional development
        courses and workshops to enhance your skills and advance your career.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">Available Courses</h3>
          <ul className="list-disc list-inside">
            <li>Healthcare Management</li>
            <li>Insurance Policy and Claims</li>
            <li>Medical Technology Advancements</li>
            <li>Patient Care and Communication</li>
            <li>Data Analytics in Healthcare</li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">Training Facilities</h3>
          <ul className="list-disc list-inside">
            <li>Virtual Reality Simulation Labs</li>
            <li>Interactive Lecture Halls</li>
            <li>Hands-on Practice Rooms</li>
            <li>Online Learning Platforms</li>
            <li>Collaborative Workshop Spaces</li>
          </ul>
        </div>
      </div>
    </Layout>
  )
}

