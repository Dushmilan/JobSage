import { Link } from 'react-router-dom'
import { useState } from 'react'

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

export const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
  return (
    <div className={`bg-white shadow-lg ${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-300`}>
      <div className="h-16 flex items-center justify-between px-4">
        <Link to="/" className="text-xl font-bold text-primary-600">
          {isCollapsed ? 'JS' : 'JobSage'}
        </Link>
        <button 
          onClick={onToggle} 
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="mt-4">
        <ul className="space-y-1">
          <li>
            <Link 
              to="/dashboard" 
              className={`flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 ${
                isCollapsed ? 'justify-center' : 'justify-start'
              }`}
            >
              {isCollapsed ? 'داشبورد' : 'Dashboard'}
            </Link>
          </li>
          <li>
            <Link 
              to="/resume" 
              className={`flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 ${
                isCollapsed ? 'justify-center' : 'justify-start'
              }`}
            >
              {isCollapsed ? 'رزومه' : 'Resume Analyzer'}
            </Link>
          </li>
          <li>
            <Link 
              to="/applications" 
              className={`flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 ${
                isCollapsed ? 'justify-center' : 'justify-start'
              }`}
            >
              {isCollapsed ? null : <span>Applications</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}
