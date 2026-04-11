import { getDb } from '@/lib/mongodb'
import jwt from 'jsonwebtoken'

function verifyToken(req) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return null
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    return null
  }
}

export async function GET(req) {
  const user = verifyToken(req)
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const db = await getDb()
    
    const members = await db.collection('members').countDocuments()
    const totalNumberDeposits = await db.collection('deposits').countDocuments()
    const totalDepositAmount = await db.collection('deposits').aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]).toArray()
    
    // Today's collections
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const todaysCollections = await db.collection('deposits').aggregate([
      { $match: { createdAt: { $gte: today, $lt: tomorrow } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]).toArray()
    
    const totalNumberLoans = await db.collection('loans').countDocuments()
    const activeLoanAccounts = await db.collection('loans').countDocuments({ status: 'active' })
    const totalActiveLoanAmount = await db.collection('loans').aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]).toArray()
    
    // Available balance = Total deposits - Total active loans
    const availableBalance = (totalDepositAmount[0]?.total || 0) - (totalActiveLoanAmount[0]?.total || 0)
    
    const externalBorrowers = await db.collection('externalBorrowers').countDocuments()
    const externalLoansTotalCount = await db.collection('externalLoans').countDocuments()
    const activeExternalLoans = await db.collection('externalLoans').countDocuments({ status: 'active' })
    const externalLoanAmount = await db.collection('externalLoans').aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]).toArray()
    
    // Member loans stats
    const memberLoansTotalCount = totalNumberLoans
    const activeMemberLoans = activeLoanAccounts
    const memberLoanAmount = totalActiveLoanAmount
    
    const response = {
      totalMembers: members,
      totalNumberDeposits: totalNumberDeposits,
      totalDepositAmount: totalDepositAmount[0]?.total || 0,
      todaysCollections: todaysCollections[0]?.total || 0,
      totalNumberLoans: totalNumberLoans,
      activeLoanAccounts: activeLoanAccounts,
      totalActiveLoanAmount: totalActiveLoanAmount[0]?.total || 0,
      availableBalance: availableBalance,
      externalBorrowers: externalBorrowers,
      externalLoansTotalCount: externalLoansTotalCount,
      activeExternalLoans: activeExternalLoans,
      externalLoanAmount: externalLoanAmount[0]?.total || 0,
      memberLoansTotalCount: memberLoansTotalCount,
      activeMemberLoans: activeMemberLoans,
      memberLoanAmount: memberLoanAmount[0]?.total || 0,
    }
    
    return Response.json(response)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
