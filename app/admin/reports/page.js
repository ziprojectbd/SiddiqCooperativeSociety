'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import { Download, FileText, BarChart3, PieChart } from 'lucide-react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function ReportsPage() {
  const [deposits, setDeposits] = useState([])
  const [loans, setLoans] = useState([])
  const [members, setMembers] = useState([])
  const [payments, setPayments] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')
      
      // Fetch all data in parallel
      const [depositsRes, loansRes, membersRes, paymentsRes, statsRes] = await Promise.all([
        fetch('/api/deposits', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/loans', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/members', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/loan-payments', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/stats/dashboard', { headers: { Authorization: `Bearer ${token}` } }),
      ])

      const [depositsData, loansData, membersData, paymentsData, statsData] = await Promise.all([
        depositsRes.json(),
        loansRes.json(),
        membersRes.json(),
        paymentsRes.json(),
        statsRes.json(),
      ])

      setDeposits(depositsData || [])
      setLoans(loansData || [])
      setMembers(membersData || [])
      setPayments(paymentsData || [])
      setStats(statsData || {})
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateDepositPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text('Deposit Report', 14, 22)
    doc.setFontSize(11)
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30)

    const tableData = deposits.map(d => [
      new Date(d.date).toLocaleDateString(),
      d.memberName || 'Unknown',
      `৳${d.amount.toLocaleString()}`,
      d.collectorName || 'N/A'
    ])

    autoTable(doc, {
      head: [['Date', 'Member', 'Amount', 'Collector']],
      body: tableData,
      startY: 40,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] },
    })

    doc.save('deposit-report.pdf')
  }

  const generateLoanPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text('Loan Report', 14, 22)
    doc.setFontSize(11)
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30)

    const tableData = loans.map(l => {
      const member = members.find(m => m._id === l.memberId)
      return [
        member?.name || 'Unknown',
        `৳${l.amount.toLocaleString()}`,
        `${l.interestRate}%`,
        l.status,
        new Date(l.dueDate).toLocaleDateString()
      ]
    })

    autoTable(doc, {
      head: [['Member', 'Amount', 'Interest', 'Status', 'Due Date']],
      body: tableData,
      startY: 40,
      theme: 'grid',
      headStyles: { fillColor: [34, 197, 94] },
    })

    doc.save('loan-report.pdf')
  }

  const generateMemberPDF = () => {
    alert('Member report generation started')
    try {
      console.log('Generating member PDF with members:', members)
      console.log('Number of members:', members.length)
      
      const doc = new jsPDF()
      doc.setFontSize(18)
      doc.text('Member Report', 14, 22)
      doc.setFontSize(11)
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30)

      const tableData = members.map(m => [
        m.name || 'N/A',
        m.phone || 'N/A',
        m.role || 'N/A',
        m.joinDate ? new Date(m.joinDate).toLocaleDateString() : 'N/A'
      ])

      console.log('Table data:', tableData)

      if (tableData.length === 0) {
        doc.text('No members found', 14, 50)
        alert('No members found in database')
      } else {
        autoTable(doc, {
          head: [['Name', 'Phone', 'Role', 'Join Date']],
          body: tableData,
          startY: 40,
          theme: 'grid',
          headStyles: { fillColor: [168, 85, 247] },
        })
      }

      doc.save('member-report.pdf')
      console.log('Member PDF saved successfully')
      alert('Member report downloaded successfully')
    } catch (error) {
      console.error('Error generating member PDF:', error)
      alert('Failed to generate member report: ' + error.message)
    }
  }

  const generateFinancialPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text('Financial Summary Report', 14, 22)
    doc.setFontSize(11)
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30)

    // Summary statistics
    doc.setFontSize(14)
    doc.text('Summary', 14, 45)
    doc.setFontSize(11)
    doc.text(`Total Members: ${stats.totalMembers || 0}`, 14, 55)
    doc.text(`Total Deposits: ৳${(stats.totalDepositAmount || 0).toLocaleString()}`, 14, 63)
    doc.text(`Total Loans: ৳${(stats.totalLoanAmount || 0).toLocaleString()}`, 14, 71)
    doc.text(`Available Balance: ৳${(stats.availableBalance || 0).toLocaleString()}`, 14, 79)

    // Deposits table
    doc.setFontSize(14)
    doc.text('Recent Deposits', 14, 95)
    const depositData = deposits.slice(0, 10).map(d => [
      new Date(d.date).toLocaleDateString(),
      d.memberName || 'Unknown',
      `৳${d.amount.toLocaleString()}`
    ])

    autoTable(doc, {
      head: [['Date', 'Member', 'Amount']],
      body: depositData,
      startY: 100,
      theme: 'grid',
      headStyles: { fillColor: [249, 115, 22] },
    })

    doc.save('financial-summary.pdf')
  }

  if (loading) {
    return (
      <div className="flex">
        <Sidebar role="admin" />
        <div className="flex-1 bg-gray-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    )
  }

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
            <button onClick={generateDepositPDF} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
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
            <button onClick={generateLoanPDF} className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2">
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
            <button onClick={generateMemberPDF} className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2">
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
            <button onClick={generateFinancialPDF} className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 flex items-center justify-center gap-2">
              <Download size={18} />
              Download
            </button>
          </div>
        </div>

          <div className="mt-8 bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Quick Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-700 rounded-lg">
              <p className="text-gray-400 text-sm">Total Deposits</p>
              <p className="text-2xl font-bold text-white mt-2">৳{(stats.totalDepositAmount || 0).toLocaleString()}</p>
            </div>
            <div className="p-4 bg-gray-700 rounded-lg">
              <p className="text-gray-400 text-sm">Total Loans</p>
              <p className="text-2xl font-bold text-white mt-2">৳{(stats.totalLoanAmount || 0).toLocaleString()}</p>
            </div>
            <div className="p-4 bg-gray-700 rounded-lg">
              <p className="text-gray-400 text-sm">Active Members</p>
              <p className="text-2xl font-bold text-white mt-2">{stats.totalMembers || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
