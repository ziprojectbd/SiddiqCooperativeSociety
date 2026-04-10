'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import { User, Phone, Calendar, MapPin, CreditCard, Briefcase, DollarSign, Users, Shield } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function MyAccountPage() {
  const { t } = useLanguage()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMemberData()
  }, [])

  const fetchMemberData = async () => {
    try {
      const token = localStorage.getItem('token')
      const userData = JSON.parse(localStorage.getItem('user'))
      
      const res = await fetch(`/api/members/${userData.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      
      if (res.ok) {
        const memberData = await res.json()
        setUser(memberData)
      } else {
        // Fallback to localStorage if API fails
        setUser(userData)
      }
    } catch (error) {
      console.error('Failed to fetch member data:', error)
      // Fallback to localStorage
      const userData = JSON.parse(localStorage.getItem('user'))
      setUser(userData)
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
          <h1 className="text-2xl font-bold text-white">{t('myAccount')}</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">{user?.name}</h2>
                <p className="text-gray-400">{t('member')}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Personal Information</h3>
                
                <div className="flex items-center gap-3">
                  <User className="text-indigo-400" size={20} />
                  <div>
                    <p className="text-gray-400 text-sm">Name</p>
                    <p className="text-white font-medium">{user?.name || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="text-indigo-400" size={20} />
                  <div>
                    <p className="text-gray-400 text-sm">Phone</p>
                    <p className="text-white font-medium">{user?.phone || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="text-indigo-400" size={20} />
                  <div>
                    <p className="text-gray-400 text-sm">Address</p>
                    <p className="text-white font-medium">{user?.address || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Shield className="text-indigo-400" size={20} />
                  <div>
                    <p className="text-gray-400 text-sm">NID</p>
                    <p className="text-white font-medium">{user?.nid || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="text-indigo-400" size={20} />
                  <div>
                    <p className="text-gray-400 text-sm">Date of Birth</p>
                    <p className="text-white font-medium">
                      {user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Professional Information</h3>
                
                <div className="flex items-center gap-3">
                  <Briefcase className="text-indigo-400" size={20} />
                  <div>
                    <p className="text-gray-400 text-sm">Occupation</p>
                    <p className="text-white font-medium">{user?.occupation || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <DollarSign className="text-indigo-400" size={20} />
                  <div>
                    <p className="text-gray-400 text-sm">Monthly Income</p>
                    <p className="text-white font-medium">
                      {user?.monthlyIncome ? `Tk ${user.monthlyIncome}` : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Guardian & Membership */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Guardian & Membership</h3>
                
                <div className="flex items-center gap-3">
                  <Users className="text-indigo-400" size={20} />
                  <div>
                    <p className="text-gray-400 text-sm">Guardian Name</p>
                    <p className="text-white font-medium">{user?.guardianName || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="text-indigo-400" size={20} />
                  <div>
                    <p className="text-gray-400 text-sm">Guardian Phone</p>
                    <p className="text-white font-medium">{user?.guardianPhone || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="text-indigo-400" size={20} />
                  <div>
                    <p className="text-gray-400 text-sm">Join Date</p>
                    <p className="text-white font-medium">
                      {user?.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <CreditCard className="text-indigo-400" size={20} />
                  <div>
                    <p className="text-gray-400 text-sm">Role</p>
                    <p className="text-white font-medium capitalize">{user?.role || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
