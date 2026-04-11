import { MongoClient } from 'mongodb'
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

export async function GET(req) {
  const user = verifyToken(req)
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const db = await getDb()
    const { searchParams } = new URL(req.url)
    const loanId = searchParams.get('loanId')
    
    const query = loanId ? { loanId } : {}
    const payments = await db.collection('externalLoanPayments').find(query).toArray()
    return Response.json(payments)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req) {
  const user = verifyToken(req)
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const db = await getDb()
    const data = await req.json()
    
    const result = await db.collection('externalLoanPayments').insertOne({
      ...data,
      createdAt: new Date(),
    })
    
    return Response.json({ _id: result.insertedId, ...data })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req) {
  const user = verifyToken(req)
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const db = await getDb()
    const { searchParams } = new URL(req.url)
    const paymentId = searchParams.get('id')
    
    await db.collection('externalLoanPayments').deleteOne({ _id: paymentId })
    return Response.json({ message: 'Payment deleted successfully' })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
