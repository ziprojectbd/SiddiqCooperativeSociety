import { MongoClient, ObjectId } from 'mongodb'
import jwt from 'jsonwebtoken'

const uri = process.env.MONGODB_URI
const client = new MongoClient(uri)

async function getDb() {
  await client.connect()
  return client.db('somobay-somiti')
}

function verifyToken(req) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return null
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    return null
  }
}

export async function POST(req) {
  const user = verifyToken(req)
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const db = await getDb()
    const data = await req.json()
    const { memberId, memberData, financialSummary, paymentDetails, closedAt } = data
    
    // Store closed account data in AccountClosed collection
    const result = await db.collection('AccountClosed').insertOne({
      memberId,
      memberData,
      financialSummary,
      paymentDetails,
      closedAt: new Date(closedAt),
      createdAt: new Date(),
    })
    
    // Delete member from members collection
    await db.collection('members').deleteOne({ _id: memberId })
    
    // Delete all deposits for this member
    await db.collection('deposits').deleteMany({ memberId: memberId })
    
    // Delete all loans for this member
    await db.collection('loans').deleteMany({ memberId: memberId })
    
    // Delete all loan payments for this member
    await db.collection('loanPayments').deleteMany({ memberId: memberId })
    
    return Response.json({ success: true, _id: result.insertedId, message: 'Account closed and all data deleted successfully' })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
