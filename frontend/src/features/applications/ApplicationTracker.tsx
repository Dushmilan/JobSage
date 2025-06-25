import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { mockApplications } from './mockData'

interface Application {
  id: string
  jobTitle: string
  company: string
  status: string
  date: string
  notes: string
}

interface Column {
  id: string
  title: string
  applications: Application[]
}

export const ApplicationTracker = () => {
  const [columns, setColumns] = useState<Column[]>([])
  const [newApplication, setNewApplication] = useState({
    jobTitle: '',
    company: '',
    status: 'applied',
    notes: ''
  })

  const applications = mockApplications

  useEffect(() => {
    const groupedApplications = applications.reduce((acc: { [key: string]: Application[] }, app: Application) => {
      if (!acc[app.status]) acc[app.status] = []
      acc[app.status].push(app)
      return acc
    }, {})

    setColumns([
      { id: 'applied', title: 'Applied', applications: groupedApplications.applied || [] },
      { id: 'interview', title: 'Interview', applications: groupedApplications.interview || [] },
      { id: 'accepted', title: 'Accepted', applications: groupedApplications.accepted || [] },
      { id: 'rejected', title: 'Rejected', applications: groupedApplications.rejected || [] },
    ])
  }, [applications])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newApp = {
      id: Date.now().toString(),
      jobTitle: newApplication.jobTitle,
      company: newApplication.company,
      status: newApplication.status,
      date: new Date().toISOString(),
      notes: newApplication.notes
    }

    setColumns(prev => {
      const newColumns = [...prev]
      const columnIndex = newColumns.findIndex(col => col.id === newApplication.status)
      if (columnIndex !== -1) {
        newColumns[columnIndex].applications = [...newColumns[columnIndex].applications, newApp]
      }
      return newColumns
    })

    setNewApplication({
      jobTitle: '',
      company: '',
      status: 'applied',
      notes: ''
    })
  }









  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Application Tracker</h2>
        <p className="mt-2 text-gray-500">Track your job applications in real-time</p>
      </div>

      {/* Add New Application Form */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Application</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
              Job Title
            </label>
            <input
              type="text"
              id="jobTitle"
              value={newApplication.jobTitle}
              onChange={(e) => setNewApplication({ ...newApplication, jobTitle: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="e.g. Senior Software Engineer"
              required
            />
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700">
              Company
            </label>
            <input
              type="text"
              id="company"
              value={newApplication.company}
              onChange={(e) => setNewApplication({ ...newApplication, company: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="e.g. Tech Innovations"
              required
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={newApplication.status}
              onChange={(e) => setNewApplication({ ...newApplication, status: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              id="notes"
              value={newApplication.notes}
              onChange={(e) => setNewApplication({ ...newApplication, notes: e.target.value })}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="e.g. Applied through LinkedIn - Referred by John Doe"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Add Application
          </button>
        </form>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {columns.map((column) => (
          <div key={column.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">{column.title}</h3>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {column.applications.length}
              </span>
            </div>
            <div className="space-y-3">
              {column.applications.map((app) => (
                <div key={app.id} className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{app.jobTitle}</h4>
                      <p className="text-sm text-gray-500">{app.company}</p>
                      <p className="mt-1 text-sm text-gray-500">
                        {new Date(app.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                        onClick={() => {
                          // TODO: Implement edit functionality
                        }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        className="text-sm text-red-500 hover:text-red-700 transition-colors"
                        onClick={() => {
                          // TODO: Implement delete functionality
                        }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  {app.notes && (
                    <div className="mt-2 text-sm text-gray-600">
                      <p>{app.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
