import { useState, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import * as pdfjsLib from 'pdfjs-dist'
import { PDFPreview } from './PDFPreview'

// Configure PDF.js to use the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

interface ResumeAnalysis {
  keywords: string[]
  skills: string[]
  experience: number
  suggestions: string[]
}

export const ResumeAnalyzer = () => {
  const [file, setFile] = useState<File | null>(null)
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null)
  const [resumeText, setResumeText] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const uploadedFile = e.target.files[0]
      // Validate file type
      if (!uploadedFile.type.startsWith('application/pdf')) {
        toast.error('Please upload a valid PDF file')
        return
      }
      
      setFile(uploadedFile)
    }
  }

  const analyzeResume = async () => {
    if (!file) return

    const formData = new FormData()
    formData.append('resume', file)

    try {
      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Failed to analyze resume')

      const data = await response.json()
      setAnalysis(data)
      toast.success('Resume analyzed successfully')
    } catch (error) {
      toast.error('Failed to analyze resume')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Resume Analyzer</h2>
        <p className="mt-2 text-gray-500">
          Upload your resume to get a detailed analysis and recommendations
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="space-y-4">
          <div>
            <label htmlFor="resume" className="block text-sm font-medium text-gray-700">
              Upload Resume
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="resume"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="resume"
                      name="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PDF, DOC, or DOCX up to 10MB</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={analyzeResume}
              disabled={!file}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium ${
                !file ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
              type="button"
            >
              {!file ? 'Please upload a resume first' : 'Analyze Resume'}
            </button>

            {file && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Resume Preview</h3>
                <div className="bg-white rounded-lg shadow-lg">
                  <div className="p-4">
                    <div className="h-[600px] border rounded-lg">
                      <PDFPreview file={file} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {analysis && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Key Skills</h3>
            <div className="space-y-2">
              {analysis.skills.map((skill, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-primary-600">•</span>
                  <span className="text-gray-700">{skill}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Industry Keywords</h3>
            <div className="space-y-2">
              {analysis.keywords.map((keyword, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-primary-600">•</span>
                  <span className="text-gray-700">{keyword}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-2 bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recommendations</h3>
            <div className="space-y-4">
              {analysis.suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <span className="text-primary-600">{index + 1}.</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700">{suggestion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
