'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Phone, Lock, LogIn, AlertCircle, Loader2 } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function LoginPage() {
  const { t } = useLanguage()
  const [credentials, setCredentials] = useState({ phone: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Login failed')
        setLoading(false)
        return
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      if (data.user.role === 'admin') {
        router.push('/admin/dashboard')
      } else {
        router.push('/member/dashboard')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        {/* Logo/Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img src="/images/sk-somobay-somiti-logo.jpg" alt="Logo" className="w-24 h-24 object-contain rounded-2xl pointer-events-none" />
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight">
            SK সমবায় সমিতি
            <br />
            <span className="text-2xl">কাউনিয়া, রংপুর</span>
          </h1>
          <p className="text-gray-400 mt-2 text-sm">{t('managementSystem')}</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900 border-l-4 border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle size={18} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Phone Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              {t('phone')}
            </label>
            <div className="relative">
              <Phone
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="tel"
                value={credentials.phone}
                onChange={(e) => setCredentials({ ...credentials, phone: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white placeholder-gray-400"
                placeholder={t('enterPhone')}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              {t('password')}
            </label>
            <div className="relative">
              <Lock
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white placeholder-gray-400"
                placeholder={t('enterPassword')}
                required
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                {t('loggingIn')}
              </>
            ) : (
              <>
                <LogIn size={20} />
                {t('login')}
              </>
            )}
          </button>
        </form>

        {/* Test Credentials */}
        <div className="mt-6 p-4 bg-gray-700/50 rounded-xl border border-gray-600">
          <p className="text-xs text-gray-400 mb-2 text-center font-medium">Test Credentials:</p>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-gray-300">
              <span>Admin:</span>
              <span className="text-indigo-400">01700000000 / admin123</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Member:</span>
              <span className="text-indigo-400">01700000001 / member123</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>© 2026 সিদ্দিক সমবায় সমিতি Management</p>
        </div>
      </div>
    </div>
  )
}
