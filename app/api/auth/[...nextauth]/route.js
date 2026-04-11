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
      // Only allow specific admin emails
      const allowedAdminEmails = process.env.ADMIN_EMAILS?.split(',') || []
      if (allowedAdminEmails.includes(user.email)) {
        return true
      }
      return false
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
