import { useState } from 'react'
import { mockJobs } from './mockData'

interface Job {
  id: string
  title: string
  company: string
  status: string
  date: string
}

export const JobDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const jobs = mockJobs

  const filteredJobs = jobs.filter((job: Job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || job.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Jobs</h3>
          <p className="mt-1 text-3xl font-semibold text-gray-900">{jobs?.length || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Active Applications</h3>
          <p className="mt-1 text-3xl font-semibold text-gray-900">{jobs?.filter((j: Job) => j.status !== 'rejected').length || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Success Rate</h3>
          <p className="mt-1 text-3xl font-semibold text-gray-900">
            {jobs.length > 0
              ? Math.round((jobs.filter((j: Job) => j.status === 'accepted').length / jobs.length) * 100)
              : 0}%
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search jobs..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Status</option>
          <option value="applied">Applied</option>
          <option value="interview">Interview</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.map((job: Job) => (
          <div key={job.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                <p className="text-sm text-gray-500">{job.company}</p>
                <p className="mt-2 text-sm text-gray-500">{job.date}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                job.status === 'applied' ? 'bg-blue-100 text-blue-800' :
                job.status === 'interview' ? 'bg-yellow-100 text-yellow-800' :
                job.status === 'accepted' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {job.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
