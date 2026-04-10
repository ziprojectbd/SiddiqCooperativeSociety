'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import Loading from '@/components/Loading'
import { FileText, Calendar, DollarSign, CheckCircle, Clock } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function MyLoanPage() {
  const { t } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [loans, setLoans] = useState([])
  const [payments, setPayments] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')
      const user = JSON.parse(localStorage.getItem('user'))
      
      const [loansRes, paymentsRes] = await Promise.all([
        fetch(`/api/loans?memberId=${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`/api/loan-payments?memberId=${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])
      
      const loansData = await loansRes.json()
      const paymentsData = await paymentsRes.json()
      
      setLoans(loansData)
      setPayments(paymentsData)
    } catch (error) {
      console.error('Failed to fetch data:', error)
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
          <h1 className="text-2xl font-bold text-white">{t('loans')}</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {loans.length === 0 ? (
            <div className="bg-gray-800 rounded-xl shadow-md p-8 text-center">
              <FileText size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">{t('noActiveLoans')}</p>
            </div>
          ) : (
            <>
              {loans.map((loan) => (
                <div key={loan._id} className="bg-gray-800 rounded-xl shadow-md p-6 mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-white">{t('loanDetails')}</h2>
                      <p className="text-gray-400 text-sm mt-1">
                        {t('loanId')}: {loan._id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 text-sm rounded-full ${
                        loan.status === 'active'
                          ? 'bg-green-900 text-green-400'
                          : loan.status === 'paid'
                          ? 'bg-blue-900 text-blue-400'
                          : 'bg-yellow-900 text-yellow-400'
                      }`}
                    >
                      {t(loan.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">{t('principalAmount')}</p>
                      <p className="text-2xl font-bold text-white">
                        ৳{loan.amount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">{t('interestRate')}</p>
                      <p className="text-2xl font-bold text-white">{loan.interestRate}%</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">{t('dueDate')}</p>
                      <p className="text-2xl font-bold text-white">
                        {new Date(loan.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">{t('totalPayable')}</p>
                      <p className="text-2xl font-bold text-white">
                        ৳{Math.round(loan.amount * (1 + loan.interestRate / 100)).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              <div className="bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <DollarSign size={24} />
                  {t('paymentHistory')}
                </h3>

                {payments.length === 0 ? (
                  <p className="text-gray-400">{t('noPaymentsMade')}</p>
                ) : (
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
                      {payments.map((payment) => (
                        <tr key={payment._id} className="hover:bg-gray-700">
                          <td className="px-6 py-4 text-gray-300">
                            {new Date(payment.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-white font-semibold">
                            ৳{payment.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-900 text-blue-400">
                              {payment.type}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
