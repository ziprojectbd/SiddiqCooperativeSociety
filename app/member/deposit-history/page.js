'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import Loading from '@/components/Loading'
import { BarChart3, Calendar, DollarSign } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function DepositHistoryPage() {
  const { t } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [deposits, setDeposits] = useState([])

  useEffect(() => {
    fetchDeposits()
  }, [])

  const fetchDeposits = async () => {
    try {
      const token = localStorage.getItem('token')
      const user = JSON.parse(localStorage.getItem('user'))
      const res = await fetch(`/api/deposits?memberId=${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setDeposits(data)
    } catch (error) {
      console.error('Failed to fetch deposits:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar role="member" />
        <div className="flex-1 bg-gray-900">
          <Loading />
        </div>
      </div>
    )
  }

  const totalDeposits = deposits.reduce((sum, d) => sum + d.amount, 0)

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role="member" />
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-900">
        <div className="flex items-center gap-4 p-4 md:p-6 bg-gray-800">
          <h1 className="text-2xl font-bold text-white">{t('depositHistory')}</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="bg-gray-800 rounded-xl shadow-md p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-900 rounded-lg">
                <BarChart3 size={24} className="text-green-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">{t('totalDeposits')}</p>
                <p className="text-3xl font-bold text-white">৳{totalDeposits.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">{t('date')}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">{t('amount')}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">{t('status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {deposits.map((deposit) => (
                  <tr key={deposit._id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 text-gray-300">
                      {new Date(deposit.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-white font-semibold">
                      ৳{deposit.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-green-900 text-green-400">
                        {t('paid')}
                      </span>
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
