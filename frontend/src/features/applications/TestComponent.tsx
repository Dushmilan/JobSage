import { mockApplications } from './mockData'

export const TestComponent = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Test Component</h1>
      <div className="bg-gray-100 p-4 rounded-lg">
        <p>Mock Applications Data:</p>
        <pre className="text-sm">{JSON.stringify(mockApplications, null, 2)}</pre>
      </div>
    </div>
  )
}
