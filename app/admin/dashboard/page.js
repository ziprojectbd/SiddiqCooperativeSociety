'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import StatCard from '@/components/StatCard'
import DepositModal from '@/components/DepositModal'
import Loading from '@/components/Loading'
import { Plus } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AdminDashboard() {
  const { t } = useLanguage()
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalNumberDeposits: 0,
    totalDepositAmount: 0,
    todaysCollections: 0,
    totalNumberLoans: 0,
    activeLoanAccounts: 0,
    totalActiveLoanAmount: 0,
    availableBalance: 0,
    externalBorrowers: 0,
    externalLoansTotalCount: 0,
    activeExternalLoans: 0,
    externalLoanAmount: 0,
    memberLoansTotalCount: 0,
    activeMemberLoans: 0,
    memberLoanAmount: 0,
  })
  const [loading, setLoading] = useState(true)
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [members, setMembers] = useState([])
  const [settings, setSettings] = useState({ defaultDepositAmount: 500 })
  const [depositForm, setDepositForm] = useState({
    memberId: '',
    memberName: '',
    amount: settings.defaultDepositAmount,
    date: new Date().toISOString().split('T')[0],
  })
  const [recentDeposits, setRecentDeposits] = useState([])
  const [recentLoans, setRecentLoans] = useState([])

  useEffect(() => {
    fetchStats()
    fetchMembers()
    fetchSettings()
    fetchRecentDeposits()
    fetchRecentLoans()
  }, [])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/stats/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.status === 401) {
        handleUnauthorized()
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

  const handleUnauthorized = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/members', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.status === 401) return handleUnauthorized()
      const data = await res.json()
      setMembers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch members:', error)
    }
  }

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/settings', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.status === 401) return handleUnauthorized()
      const data = await res.json()
      setSettings(data)
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    }
  }

  const fetchRecentDeposits = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/deposits', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.status === 401) return handleUnauthorized()
      const data = await res.json()
      setRecentDeposits(Array.isArray(data) ? data.slice(0, 5) : [])
    } catch (error) {
      console.error('Failed to fetch recent deposits:', error)
      setRecentDeposits([])
    }
  }

  const fetchRecentLoans = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/loans', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.status === 401) return handleUnauthorized()
      const data = await res.json()
      setRecentLoans(Array.isArray(data) ? data.slice(0, 5) : [])
    } catch (error) {
      console.error('Failed to fetch recent loans:', error)
      setRecentLoans([])
    }
  }

  const handleDepositSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      await fetch('/api/deposits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...depositForm,
          amount: settings.defaultDepositAmount,
          collectorName: settings.collectorName || '',
        }),
      })
      setShowDepositModal(false)
      setDepositForm({
        memberId: '',
        memberName: '',
        amount: settings.defaultDepositAmount,
        date: new Date().toISOString().split('T')[0],
      })
      fetchStats()
      fetchRecentDeposits()
    } catch (error) {
      console.error('Failed to add deposit:', error)
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
          <h1 className="text-2xl font-bold text-white">{t('dashboard')}</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {/* Main Stats Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">{t('dashboardSummary')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard
                title={t('totalMembers')}
                value={stats.totalMembers || 0}
              />
              <StatCard
                title={t('totalNumberDeposits')}
                value={stats.totalNumberDeposits || 0}
              />
              <StatCard
                title={t('totalDepositAmount')}
                value={`৳${(stats.totalDepositAmount || 0).toLocaleString()}`}
              />
              <StatCard
                title={t('todaysCollections')}
                value={`৳${(stats.todaysCollections || 0).toLocaleString()}`}
              />
              <StatCard
                title={t('totalNumberLoans')}
                value={stats.totalNumberLoans || 0}
              />
              <StatCard
                title={t('activeLoanAccounts')}
                value={stats.activeLoanAccounts || 0}
              />
              <StatCard
                title={t('totalActiveLoanAmount')}
                value={`৳${(stats.totalActiveLoanAmount || 0).toLocaleString()}`}
              />
              <StatCard
                title={t('availableBalance')}
                value={`৳${(stats.availableBalance || 0).toLocaleString()}`}
              />
            </div>
          </div>

          {/* External Borrowing Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">{t('externalBorrowingSection')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard
                title={t('externalBorrowers')}
                value={stats.externalBorrowers || 0}
              />
              <StatCard
                title={t('externalLoansTotalCount')}
                value={stats.externalLoansTotalCount || 0}
              />
              <StatCard
                title={t('activeExternalLoans')}
                value={stats.activeExternalLoans || 0}
              />
              <StatCard
                title={t('externalLoanAmount')}
                value={`৳${(stats.externalLoanAmount || 0).toLocaleString()}`}
              />
            </div>
          </div>

          {/* Member Loans Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">{t('memberLoansSection')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard
                title={t('memberLoansTotalCount')}
                value={stats.memberLoansTotalCount || 0}
              />
              <StatCard
                title={t('activeMemberLoans')}
                value={stats.activeMemberLoans || 0}
              />
              <StatCard
                title={t('memberLoanAmount')}
                value={`৳${(stats.memberLoanAmount || 0).toLocaleString()}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Deposits */}
            <div className="bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-white mb-4">{t('recentDeposits')}</h2>
              <div className="space-y-3">
                {recentDeposits.length === 0 ? (
                  <p className="text-gray-400 text-sm">{t('noRecentDeposits')}</p>
                ) : (
                  recentDeposits.map((deposit) => (
                    <div key={deposit._id} className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                      <div>
                        <p className="text-white text-sm font-medium">{deposit.memberName}</p>
                        <p className="text-gray-400 text-xs">{new Date(deposit.date).toLocaleDateString()}</p>
                      </div>
                      <p className="text-green-400 text-sm font-semibold">৳{deposit.amount.toLocaleString()}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Loans */}
            <div className="bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-white mb-4">{t('recentLoans')}</h2>
              <div className="space-y-3">
                {recentLoans.length === 0 ? (
                  <p className="text-gray-400 text-sm">{t('noRecentLoans')}</p>
                ) : (
                  recentLoans.map((loan) => (
                    <div key={loan._id} className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                      <div>
                        <p className="text-white text-sm font-medium">{loan.memberName}</p>
                        <p className="text-gray-400 text-xs">{loan.interestRate}% interest</p>
                      </div>
                      <p className="text-indigo-400 text-sm font-semibold">৳{loan.amount.toLocaleString()}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Deposit Modal */}
        <DepositModal
          isOpen={showDepositModal}
          onClose={() => setShowDepositModal(false)}
          members={members}
          depositForm={depositForm}
          setDepositForm={setDepositForm}
          onSubmit={handleDepositSubmit}
          defaultAmount={settings.defaultDepositAmount}
        />
      </div>
    </div>
  )
}
