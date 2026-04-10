'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import Loading from '@/components/Loading'
import { UsersRound, Phone, Briefcase } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function CommitteePage() {
  const { t } = useLanguage()
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/settings', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setSettings(data)
    } catch (error) {
      console.error('Failed to fetch settings:', error)
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
          <h1 className="text-2xl font-bold text-white">{t('committee')}</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-white mb-4">{t('committeeMembers')}</h2>
            
            {settings?.committeeMembers && settings.committeeMembers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {settings.committeeMembers.map((member, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-white font-medium">{member.name}</span>
                    </div>
                    <p className="text-gray-400 text-sm">{member.position}</p>
                    {member.contact && <p className="text-gray-400 text-sm mt-1">{member.contact}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No committee members added yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
