import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI

async function getDb() {
  const client = new MongoClient(uri)
  await client.connect()
  return client.db('somobay-somiti')
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Check if email is in allowed list
      const allowedAdminEmails = process.env.ADMIN_EMAILS?.split(',') || []
      if (allowedAdminEmails.includes(user.email)) {
        return true
      }
      
      // Also check if this email belongs to an admin in the database
      try {
        const db = await getDb()
        const member = await db.collection('members').findOne({ 
          email: user.email,
          role: 'admin'
        })
        if (member) {
          return true
        }
      } catch (error) {
        console.error('Database check failed:', error)
      }
      
      return false
    },
    async redirect({ url, baseUrl }) {
      // Always redirect to admin dashboard after successful sign-in
      return '/admin/dashboard'
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.userId = user.id
        token.email = user.email
        token.role = 'admin'
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.userId
      session.user.email = token.email
      session.user.role = token.role
      return session
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
})

export { handler as GET, handler as POST }
