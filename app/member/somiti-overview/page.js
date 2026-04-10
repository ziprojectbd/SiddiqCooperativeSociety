'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import Loading from '@/components/Loading'
import { Users, DollarSign, FileText, TrendingUp, UsersRound } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function SomitiOverviewPage() {
  const { t } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({
    summary: {},
    members: [],
    deposits: [],
    externalBorrowers: [],
    externalLoans: [],
    memberLoans: []
  })

  useEffect(() => {
    fetchOverviewData()
  }, [])

  const fetchOverviewData = async () => {
    try {
      const token = localStorage.getItem('token')
      
      // Fetch all data in parallel
      const [
        membersRes,
        depositsRes,
        externalBorrowersRes,
        externalLoansRes,
        memberLoansRes
      ] = await Promise.all([
        fetch('/api/members', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/deposits', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/external-borrowers', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/external-loans', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/loans', { headers: { Authorization: `Bearer ${token}` } })
      ])

      const [
        membersData,
        depositsData,
        externalBorrowersData,
        externalLoansData,
        memberLoansData
      ] = await Promise.all([
        membersRes.json(),
        depositsRes.json(),
        externalBorrowersRes.json(),
        externalLoansRes.json(),
        memberLoansRes.json()
      ])

      // Calculate summary data from fetched data
      const summary = {
        totalMembers: membersData.length || 0,
        totalDeposits: depositsData.reduce((sum, d) => sum + (d.amount || 0), 0),
        totalLoans: externalLoansData.reduce((sum, l) => sum + (l.amount || 0), 0) + memberLoansData.reduce((sum, l) => sum + (l.amount || 0), 0),
        activeLoans: memberLoansData.filter(l => l.status === 'active').length + externalLoansData.filter(l => l.status === 'active').length
      }

      setData({
        summary,
        members: membersData,
        deposits: depositsData,
        externalBorrowers: externalBorrowersData,
        externalLoans: externalLoansData,
        memberLoans: memberLoansData
      })
    } catch (error) {
      console.error('Failed to fetch overview data:', error)
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
          <h1 className="text-2xl font-bold text-white">{t('somitiOverview')}</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          {/* Dashboard Summary */}
          <div className="bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="text-indigo-400" size={24} />
              <h2 className="text-xl font-semibold text-white">{t('dashboardSummary')}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm">{t('totalMembers')}</p>
                <p className="text-2xl font-bold text-white">{data.summary.totalMembers || 0}</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm">{t('totalDeposits')}</p>
                <p className="text-2xl font-bold text-white">Tk {data.summary.totalDeposits || 0}</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm">{t('totalLoans')}</p>
                <p className="text-2xl font-bold text-white">Tk {data.summary.totalLoans || 0}</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm">{t('activeLoans')}</p>
                <p className="text-2xl font-bold text-white">{data.summary.activeLoans || 0}</p>
              </div>
            </div>
          </div>

          {/* Members List */}
          <div className="bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="text-indigo-400" size={24} />
              <h2 className="text-xl font-semibold text-white">{t('members')}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">{t('name')}</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">{t('phone')}</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">{t('status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {data.members.slice(0, 5).map((member) => (
                    <tr key={member._id} className="hover:bg-gray-700">
                      <td className="px-4 py-2 text-white">{member.name}</td>
                      <td className="px-4 py-2 text-gray-300">{member.phone}</td>
                      <td className="px-4 py-2">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-900 text-green-400">
                          {t('active')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Deposits */}
          <div className="bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="text-indigo-400" size={24} />
              <h2 className="text-xl font-semibold text-white">{t('recentDeposits')}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">{t('member')}</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">{t('amount')}</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">{t('date')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {data.deposits.slice(0, 5).map((deposit) => (
                    <tr key={deposit._id} className="hover:bg-gray-700">
                      <td className="px-4 py-2 text-white">{deposit.memberName}</td>
                      <td className="px-4 py-2 text-white">Tk {deposit.amount}</td>
                      <td className="px-4 py-2 text-gray-300">
                        {new Date(deposit.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* External Borrowers */}
          <div className="bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <UsersRound className="text-indigo-400" size={24} />
              <h2 className="text-xl font-semibold text-white">{t('externalBorrowers')}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">{t('name')}</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">{t('phone')}</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">{t('totalLoan')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {data.externalBorrowers.slice(0, 5).map((borrower) => (
                    <tr key={borrower._id} className="hover:bg-gray-700">
                      <td className="px-4 py-2 text-white">{borrower.name}</td>
                      <td className="px-4 py-2 text-gray-300">{borrower.phone}</td>
                      <td className="px-4 py-2 text-white">Tk {borrower.totalLoan || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* External Loans */}
          <div className="bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="text-indigo-400" size={24} />
              <h2 className="text-xl font-semibold text-white">{t('externalLoans')}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">{t('borrower')}</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">{t('amount')}</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">{t('status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {data.externalLoans.slice(0, 5).map((loan) => (
                    <tr key={loan._id} className="hover:bg-gray-700">
                      <td className="px-4 py-2 text-white">{loan.borrowerName}</td>
                      <td className="px-4 py-2 text-white">Tk {loan.amount}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          loan.status === 'active' ? 'bg-green-900 text-green-400' : 'bg-gray-900 text-gray-400'
                        }`}>
                          {t(loan.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Member Loans */}
          <div className="bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="text-indigo-400" size={24} />
              <h2 className="text-xl font-semibold text-white">{t('memberLoans')}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">{t('member')}</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">{t('amount')}</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">{t('status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {data.memberLoans.slice(0, 5).map((loan) => (
                    <tr key={loan._id} className="hover:bg-gray-700">
                      <td className="px-4 py-2 text-white">{loan.memberName}</td>
                      <td className="px-4 py-2 text-white">Tk {loan.amount}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          loan.status === 'active' ? 'bg-green-900 text-green-400' : 'bg-gray-900 text-gray-400'
                        }`}>
                          {t(loan.status)}
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
