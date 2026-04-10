'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { Download, FileText, BarChart3, PieChart } from 'lucide-react'

export default function ReportsPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role="admin" />
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-900">
        <div className="flex items-center gap-4 p-4 md:p-6 bg-gray-800 shadow-sm sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-white">Reports</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-900 rounded-lg">
                <FileText size={24} className="text-blue-300" />
              </div>
              <h3 className="text-lg font-semibold text-white">Deposit Report</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">View all deposit transactions</p>
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
              <Download size={18} />
              Download
            </button>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-900 rounded-lg">
                <BarChart3 size={24} className="text-green-300" />
              </div>
              <h3 className="text-lg font-semibold text-white">Loan Report</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">View loan statistics and status</p>
            <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2">
              <Download size={18} />
              Download
            </button>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-900 rounded-lg">
                <PieChart size={24} className="text-purple-300" />
              </div>
              <h3 className="text-lg font-semibold text-white">Member Report</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">View member activity summary</p>
            <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2">
              <Download size={18} />
              Download
            </button>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-orange-900 rounded-lg">
                <FileText size={24} className="text-orange-300" />
              </div>
              <h3 className="text-lg font-semibold text-white">Financial Summary</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">Overall financial overview</p>
            <button className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 flex items-center justify-center gap-2">
              <Download size={18} />
              Download
            </button>
          </div>
        </div>

          <div className="mt-8 bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Quick Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-700 rounded-lg">
              <p className="text-gray-400 text-sm">Total Deposits This Month</p>
              <p className="text-2xl font-bold text-white mt-2">৳125,000</p>
            </div>
            <div className="p-4 bg-gray-700 rounded-lg">
              <p className="text-gray-400 text-sm">Total Loan Repayments</p>
              <p className="text-2xl font-bold text-white mt-2">৳45,000</p>
            </div>
            <div className="p-4 bg-gray-700 rounded-lg">
              <p className="text-gray-400 text-sm">Active Members</p>
              <p className="text-2xl font-bold text-white mt-2">6</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
