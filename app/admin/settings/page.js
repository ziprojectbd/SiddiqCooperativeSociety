'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import { Save, Plus, Trash2 } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function SettingsPage() {
  const { t } = useLanguage()
  const [settings, setSettings] = useState({
    defaultDepositAmount: 500,
    depositCollectionTime: '10:00 AM',
    collectorName: '',
    organizationName: '',
    logo: '',
    address: '',
    phone: '',
    email: '',
    businessHours: '9:00 AM - 5:00 PM',
    currency: '৳',
    committeeMembers: [],
    aboutSomiti: '',
  })
  const [newMember, setNewMember] = useState('')
  const [newPosition, setNewPosition] = useState('')
  const [newContact, setNewContact] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

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
      if (data && data.defaultDepositAmount) {
        setSettings(data)
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      })

      if (res.ok) {
        setMessage('Settings saved successfully!')
      } else {
        setMessage('Failed to save settings')
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
      setMessage('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const addCommitteeMember = () => {
    if (newMember.trim() && newPosition.trim()) {
      setSettings({
        ...settings,
        committeeMembers: [...(settings.committeeMembers || []), { name: newMember.trim(), position: newPosition.trim(), contact: newContact.trim() }]
      })
      setNewMember('')
      setNewPosition('')
      setNewContact('')
    }
  }

  const removeCommitteeMember = (index) => {
    setSettings({
      ...settings,
      committeeMembers: settings.committeeMembers.filter((_, i) => i !== index)
    })
  }

  if (loading) {
    return (
      <div className="flex">
        <Sidebar role="admin" />
        <div className="flex-1 p-4 md:p-8">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role="admin" />
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-900">
        <div className="flex items-center gap-4 p-4 md:p-6 bg-gray-800">
          <h1 className="text-2xl font-bold text-white">{t('settings')}</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Organization Settings */}
            <div className="bg-gray-800 rounded-xl shadow-md p-6 max-w-2xl">
              <h2 className="text-xl font-semibold text-white mb-6">{t('organizationSettings')}</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    {t('organizationName')}
                  </label>
                  <input
                    type="text"
                    value={settings.organizationName}
                    onChange={(e) =>
                      setSettings({ ...settings, organizationName: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                    placeholder="Enter organization name"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    {t('logo')}
                  </label>
                  <input
                    type="text"
                    value={settings.logo}
                    onChange={(e) =>
                      setSettings({ ...settings, logo: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                    placeholder="Enter logo URL"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    {t('address')}
                  </label>
                  <input
                    type="text"
                    value={settings.address}
                    onChange={(e) =>
                      setSettings({ ...settings, address: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                    placeholder="Enter address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">
                      {t('phone')}
                    </label>
                    <input
                      type="tel"
                      value={settings.phone}
                      onChange={(e) =>
                        setSettings({ ...settings, phone: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">
                      {t('email')}
                    </label>
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) =>
                        setSettings({ ...settings, email: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                      placeholder="Enter email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    Business Hours
                  </label>
                  <input
                    type="text"
                    value={settings.businessHours}
                    onChange={(e) =>
                      setSettings({ ...settings, businessHours: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                    placeholder="e.g., 9:00 AM - 5:00 PM"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    Currency Symbol
                  </label>
                  <input
                    type="text"
                    value={settings.currency}
                    onChange={(e) =>
                      setSettings({ ...settings, currency: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                    placeholder="e.g., ৳, $, €"
                  />
                </div>
              </div>
            </div>

            {/* Deposit Settings */}
            <div className="bg-gray-800 rounded-xl shadow-md p-6 max-w-2xl">
              <h2 className="text-xl font-semibold text-white mb-6">{t('depositSettings')}</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    {t('defaultDepositAmount')}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={settings.defaultDepositAmount}
                    onChange={(e) =>
                      setSettings({ ...settings, defaultDepositAmount: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                    placeholder="Enter default deposit amount"
                  />
                  <p className="text-gray-500 text-xs mt-2">
                    This amount will be used as the default when adding new deposits
                  </p>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    {t('depositCollectionTime')}
                  </label>
                  <input
                    type="time"
                    value={settings.depositCollectionTime}
                    onChange={(e) =>
                      setSettings({ ...settings, depositCollectionTime: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                  />
                  <p className="text-gray-500 text-xs mt-2">
                    Time when daily deposits are collected
                  </p>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    {t('collectorName')}
                  </label>
                  <input
                    type="text"
                    value={settings.collectorName}
                    onChange={(e) =>
                      setSettings({ ...settings, collectorName: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                    placeholder="Enter collector name"
                  />
                  <p className="text-gray-500 text-xs mt-2">
                    Name of the person who collects daily deposits
                  </p>
                </div>
              </div>
            </div>

            {/* Committee & Somiti Settings */}
            <div className="bg-gray-800 rounded-xl shadow-md p-6 max-w-2xl">
              <h2 className="text-xl font-semibold text-white mb-6">{t('committeeSettings')}</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    {t('committeeMembers')}
                  </label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
                    <input
                      type="text"
                      value={newMember}
                      onChange={(e) => setNewMember(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addCommitteeMember()}
                      className="px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                      placeholder="Enter committee member name"
                    />
                    <input
                      type="text"
                      value={newPosition}
                      onChange={(e) => setNewPosition(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addCommitteeMember()}
                      className="px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                      placeholder="Enter position (e.g., President, Secretary)"
                    />
                    <input
                      type="text"
                      value={newContact}
                      onChange={(e) => setNewContact(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addCommitteeMember()}
                      className="px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                      placeholder="Enter contact number"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addCommitteeMember}
                    className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                  >
                    Add Member
                  </button>

                  <div className="space-y-2 mt-4">
                    {(settings.committeeMembers || []).map((member, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-700 px-4 py-2 rounded-lg">
                        <div className="flex-1">
                          <span className="text-white font-medium">{member.name}</span>
                          <span className="text-gray-400 text-sm ml-2">- {member.position}</span>
                          {member.contact && <span className="text-gray-400 text-sm ml-2">- {member.contact}</span>}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeCommitteeMember(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <p className="text-gray-500 text-xs mt-2">
                    Add committee members with their positions
                  </p>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    {t('aboutSomiti')}
                  </label>
                  <textarea
                    value={settings.aboutSomiti}
                    onChange={(e) =>
                      setSettings({ ...settings, aboutSomiti: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                    placeholder="Enter information about the somiti"
                    rows="4"
                  />
                  <p className="text-gray-500 text-xs mt-2">
                    Description and information about the somiti organization
                  </p>
                </div>
              </div>
            </div>

            {message && (
              <div className={`p-3 rounded-lg ${message.includes('success') ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 flex items-center gap-2 font-medium shadow-lg transition-all active:scale-95"
            >
              <Save size={20} />
              {t('saveSettings')}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
