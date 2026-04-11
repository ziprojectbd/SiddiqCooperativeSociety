'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import Loading from '@/components/Loading'
import { useLanguage } from '@/contexts/LanguageContext'

export default function MemberLoanHistoryPage() {
  const { t } = useLanguage()
  const [loans, setLoans] = useState([])
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchLoans()
    fetchMembers()
  }, [])

  const fetchLoans = async () => {
    try {
      const token = localStorage.getItem('token')
      console.log('Fetching loans with token:', token ? 'Token exists' : 'No token')
      const res = await fetch('/api/loans', {
        headers: { Authorization: `Bearer ${token}` },
      })
      console.log('Loans response status:', res.status)
      if (!res.ok) {
        const errorData = await res.json()
        setError(`Failed to fetch loans: ${errorData.error || res.statusText}`)
        return
      }
      const data = await res.json()
      console.log('Loans data:', data)
      setLoans(data)
    } catch (error) {
      console.error('Failed to fetch loans:', error)
      setError(`Failed to fetch loans: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/members', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setMembers(data)
    } catch (error) {
      console.error('Failed to fetch members:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex">
        <Sidebar role="admin" />
        <div className="flex-1 bg-gray-900">
          <Loading />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role="admin" />
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-900">
        <div className="flex items-center gap-4 p-4 md:p-6 bg-gray-800">
          <h1 className="text-2xl font-bold text-white">Member Loan History</h1>
        </div>

        {error && (
          <div className="mx-4 md:mx-8 mt-4 bg-red-900 border-l-4 border-red-500 text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="space-y-8">
            {/* Loans Section */}
            <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="bg-indigo-900 px-4 py-3 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-white">All Loans</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Member</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Interest</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Due Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {loans.map((loan) => {
                      const member = members.find(m => m._id === loan.memberId)
                      return (
                        <tr key={loan._id} className="hover:bg-gray-700 transition-colors">
                          <td className="px-4 py-3 text-xs text-white whitespace-nowrap">{member?.name || 'Unknown'}</td>
                          <td className="px-4 py-3 text-xs text-white font-semibold whitespace-nowrap">
                            ৳{loan.amount.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-300 whitespace-nowrap">{loan.interestRate}%</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-[10px] rounded-full ${
                                loan.status === 'active'
                                  ? 'bg-green-900 text-green-300'
                                  : loan.status === 'paid'
                                  ? 'bg-blue-900 text-blue-300'
                                  : 'bg-yellow-900 text-yellow-300'
                              }`}
                            >
                              {loan.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-300 whitespace-nowrap">
                            {new Date(loan.dueDate).toLocaleDateString()}
                          </td>
                        </tr>
                      )
                    })}
                    {loans.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-4 py-8 text-center text-gray-400 text-sm">
                          No loans found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
