'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Loading from '@/components/Loading'
import { Plus, Pencil, Trash2, X, Eye, EyeOff, Eye as ViewEye } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function MembersPage() {
  const { t } = useLanguage()
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingMember, setEditingMember] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [viewMember, setViewMember] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editMember, setEditMember] = useState(null)
  const [editForm, setEditForm] = useState({
    phone: '',
    password: '123456',
  })
  const [showEditPassword, setShowEditPassword] = useState(false)
  const [deposits, setDeposits] = useState([])
  const [loans, setLoans] = useState([])
  const [memberForm, setMemberForm] = useState({
    name: '',
    phone: '',
    role: 'member',
    password: '123456',
    address: '',
    nid: '',
    dateOfBirth: '',
    occupation: '',
    monthlyIncome: '',
    guardianName: '',
    guardianPhone: '',
    joinDate: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    fetchMembers()
    fetchDeposits()
    fetchLoans()
  }, [])

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
    } finally {
      setLoading(false)
    }
  }

  const fetchDeposits = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/deposits', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setDeposits(data)
    } catch (error) {
      console.error('Failed to fetch deposits:', error)
    }
  }

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
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this member?')) return

    try {
      const token = localStorage.getItem('token')
      await fetch(`/api/members/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchMembers()
    } catch (error) {
      console.error('Failed to delete member:', error)
    }
  }

  const handleAddMember = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      await fetch('/api/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(memberForm),
      })
      setShowModal(false)
      setMemberForm({
        name: '',
        phone: '',
        role: 'member',
        password: '123456',
        address: '',
        nid: '',
        dateOfBirth: '',
        occupation: '',
        monthlyIncome: '',
        guardianName: '',
        guardianPhone: '',
        joinDate: new Date().toISOString().split('T')[0],
      })
      fetchMembers()
    } catch (error) {
      console.error('Failed to add member:', error)
    }
  }

  const handleEditClick = (member) => {
    setEditMember(member)
    setEditForm({
      phone: member.phone || '',
      password: '123456',
    })
    setShowEditModal(true)
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      await fetch(`/api/members/${editMember._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      })
      setShowEditModal(false)
      setEditMember(null)
      fetchMembers()
    } catch (error) {
      console.error('Failed to update member:', error)
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
        <div className="flex flex-col gap-4 p-4 md:p-6 bg-gray-800 shadow-sm sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-white">{t('members')}</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-4 py-3 rounded-xl hover:bg-indigo-700 flex items-center gap-2 text-base font-medium w-full shadow-lg transition-all active:scale-95"
          >
            <Plus size={20} />
            {t('addMember')}
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">{t('name')}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">{t('phone')}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">{t('password')}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">{t('role')}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">{t('status')}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">{t('totalDeposit')}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">{t('loanStatus')}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">{t('loanAmount')}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">{t('action')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {members.map((member) => (
                    <tr key={member._id} className="hover:bg-gray-700 transition-colors">
                      <td className="px-4 py-3 text-xs text-white whitespace-nowrap">{member.name}</td>
                      <td className="px-4 py-3 text-xs text-gray-300 whitespace-nowrap">{member.phone}</td>
                      <td className="px-4 py-3 text-xs text-gray-300 whitespace-nowrap">123456</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 py-1 text-[10px] rounded-full bg-blue-900 text-blue-300">
                          {member.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 py-1 text-[10px] rounded-full bg-green-900 text-green-300">
                          {t('active')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-green-400 font-semibold whitespace-nowrap">
                        ৳{deposits.filter(d => d.memberId === member._id).reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {loans.filter(l => l.memberId === member._id).length > 0 ? (
                          <span className="px-2 py-1 text-[10px] rounded-full bg-indigo-900 text-indigo-300">
                            {t('active')}
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-[10px] rounded-full bg-gray-700 text-gray-400">
                            {t('noLoan')}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-indigo-400 font-semibold whitespace-nowrap">
                        ৳{loans.filter(l => l.memberId === member._id).reduce((sum, l) => sum + l.amount, 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setViewMember(member)
                              setShowViewModal(true)
                            }}
                            className="p-1.5 hover:bg-gray-600 rounded-lg transition-colors"
                            title="View"
                          >
                            <ViewEye size={16} className="text-green-400" />
                          </button>
                          <button
                            onClick={() => handleEditClick(member)}
                            className="p-1.5 hover:bg-gray-600 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil size={16} className="text-blue-400" />
                          </button>
                          <button
                            onClick={() => handleDelete(member._id)}
                            className="p-1.5 hover:bg-gray-600 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} className="text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Member Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">{t('addMember')}</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddMember}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={memberForm.name}
                    onChange={(e) =>
                      setMemberForm({ ...memberForm, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                    placeholder="Enter full name"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={memberForm.phone}
                    onChange={(e) =>
                      setMemberForm({ ...memberForm, phone: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    required
                    value={memberForm.address}
                    onChange={(e) =>
                      setMemberForm({ ...memberForm, address: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                    placeholder="Enter address"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    NID (National ID)
                  </label>
                  <input
                    type="text"
                    required
                    pattern="[0-9]{10,13}"
                    value={memberForm.nid}
                    onChange={(e) =>
                      setMemberForm({ ...memberForm, nid: e.target.value.replace(/\D/g, '') })
                    }
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                    placeholder="Enter NID number (10-13 digits)"
                    title="Please enter only numbers (10-13 digits)"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    required
                    value={memberForm.dateOfBirth}
                    onChange={(e) =>
                      setMemberForm({ ...memberForm, dateOfBirth: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Occupation
                  </label>
                  <input
                    type="text"
                    required
                    value={memberForm.occupation}
                    onChange={(e) =>
                      setMemberForm({ ...memberForm, occupation: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                    placeholder="Enter occupation"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Monthly Income (৳)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={memberForm.monthlyIncome}
                    onChange={(e) =>
                      setMemberForm({ ...memberForm, monthlyIncome: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                    placeholder="Enter monthly income"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Guardian/Nominee Name
                  </label>
                  <input
                    type="text"
                    required
                    value={memberForm.guardianName}
                    onChange={(e) =>
                      setMemberForm({ ...memberForm, guardianName: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                    placeholder="Enter guardian/nominee name"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Guardian/Nominee Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={memberForm.guardianPhone}
                    onChange={(e) =>
                      setMemberForm({ ...memberForm, guardianPhone: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                    placeholder="Enter guardian/nominee phone"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Join Date
                  </label>
                  <input
                    type="date"
                    required
                    value={memberForm.joinDate}
                    onChange={(e) =>
                      setMemberForm({ ...memberForm, joinDate: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Role
                  </label>
                  <select
                    required
                    value={memberForm.role}
                    onChange={(e) =>
                      setMemberForm({ ...memberForm, role: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                  >
                    <option value="member">Member</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={memberForm.password}
                      onChange={(e) =>
                        setMemberForm({ ...memberForm, password: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white pr-12"
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-700 text-white"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    {t('addMember')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Member Modal */}
        {showViewModal && viewMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Member Details</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                  <p className="text-white">{viewMember.name || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Phone</label>
                  <p className="text-white">{viewMember.phone || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Address</label>
                  <p className="text-white">{viewMember.address || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">NID</label>
                  <p className="text-white">{viewMember.nid || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Date of Birth</label>
                  <p className="text-white">{viewMember.dateOfBirth ? new Date(viewMember.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Occupation</label>
                  <p className="text-white">{viewMember.occupation || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Monthly Income</label>
                  <p className="text-white">{viewMember.monthlyIncome ? `৳${viewMember.monthlyIncome.toLocaleString()}` : 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Guardian/Nominee Name</label>
                  <p className="text-white">{viewMember.guardianName || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Guardian/Nominee Phone</label>
                  <p className="text-white">{viewMember.guardianPhone || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Join Date</label>
                  <p className="text-white">{viewMember.joinDate ? new Date(viewMember.joinDate).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
                  <p className="text-white capitalize">{viewMember.role || 'N/A'}</p>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Member Modal */}
        {showEditModal && editMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {editingMember ? t('editMember') : t('addMember')}
                </h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleEditSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editMember.name || ''}
                    disabled
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900 text-gray-500 cursor-not-allowed"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={editForm.phone}
                    onChange={(e) =>
                      setEditForm({ ...editForm, phone: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showEditPassword ? 'text' : 'password'}
                      required
                      value={editForm.password}
                      onChange={(e) =>
                        setEditForm({ ...editForm, password: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white pr-12"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowEditPassword(!showEditPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showEditPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-700 text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
