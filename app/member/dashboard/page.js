'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import StatCard from '@/components/StatCard'
import Loading from '@/components/Loading'
import { DollarSign, FileText, TrendingUp, Calendar } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function MemberDashboard() {
  const { t } = useLanguage()
  const [stats, setStats] = useState({
    totalDeposits: 0,
    activeLoans: 0,
    pendingPayments: 0,
  })
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'))
    setUser(userData)
    fetchStats(userData?._id)
  }, [])

  const fetchStats = async (userId) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/stats/member/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/'
        return
      }
      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
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

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role="member" />
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-900">
        <div className="flex items-center gap-4 p-4 md:p-6 bg-gray-800">
          <h1 className="text-2xl font-bold text-white">{t('dashboard')}</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white">
              {t('welcome')}, {user?.name || t('member')}
            </h2>
            <p className="text-gray-400 mt-2">{t('accountOverview')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <StatCard
              title={t('totalDeposits')}
              value={`৳${stats.totalDeposits.toLocaleString()}`}
              change={8}
            />
            <StatCard
              title={t('activeLoans')}
              value={stats.activeLoans}
              change={3}
            />
            <StatCard
              title={t('pendingPayments')}
              value={`৳${stats.pendingPayments.toLocaleString()}`}
              change={5}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-white mb-4">{t('recentDeposits')}</h2>
              <p className="text-gray-400">{t('recentDepositHistory')}</p>
            </div>

            <div className="bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-white mb-4">{t('loanStatus')}</h2>
              <p className="text-gray-400">{t('currentLoanInfo')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
