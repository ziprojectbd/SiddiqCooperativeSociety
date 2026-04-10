'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import Loading from '@/components/Loading'
import { Info } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AboutPage() {
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
          <h1 className="text-2xl font-bold text-white">{t('aboutSomiti')}</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-white mb-4">{t('aboutSomiti')}</h2>
            <p className="text-gray-400 whitespace-pre-wrap">
              {settings?.aboutSomiti || 'About Somobay Somiti information will be displayed here.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
