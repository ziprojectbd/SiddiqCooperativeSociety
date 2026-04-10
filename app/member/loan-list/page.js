'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import { FileText, Calendar, DollarSign, CheckCircle, Clock } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function LoanListPage() {
  const { t } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [loans, setLoans] = useState([])

  useEffect(() => {
    fetchLoans()
  }, [])

  const fetchLoans = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/loans', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setLoans(data)
    } catch (error) {
      console.error('Failed to fetch loans:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar role="member" />
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-900">
          <div className="flex items-center gap-4 p-4 md:p-6 bg-gray-800">
            <div className="text-white">Loading...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role="member" />
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-900">
        <div className="flex items-center gap-4 p-4 md:p-6 bg-gray-800">
          <h1 className="text-2xl font-bold text-white">{t('loans')}</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">{t('member')}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">{t('amount')}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">{t('interestRate')}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">{t('status')}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">{t('dueDate')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {loans.map((loan) => (
                  <tr key={loan._id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 text-gray-300">{loan.memberName}</td>
                    <td className="px-6 py-4 text-white font-semibold">
                      ৳{loan.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-400">{loan.interestRate}%</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          loan.status === 'active'
                            ? 'bg-green-900 text-green-400'
                            : loan.status === 'paid'
                            ? 'bg-blue-900 text-blue-400'
                            : 'bg-yellow-900 text-yellow-400'
                        }`}
                      >
                        {t(loan.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(loan.dueDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
