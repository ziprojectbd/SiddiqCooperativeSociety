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
    const memberId = searchParams.get('memberId')
    
    const query = memberId ? { memberId } : {}
    const loans = await db.collection('loans').find(query).toArray()
    return Response.json(loans)
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
    
    const result = await db.collection('loans').insertOne({
      ...data,
      status: 'active',
      createdAt: new Date(),
    })
    
    return Response.json({ _id: result.insertedId, ...data })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(req) {
  const user = verifyToken(req)
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const db = await getDb()
    const { searchParams } = new URL(req.url)
    const loanId = searchParams.get('id')
    const data = await req.json()
    
    await db.collection('loans').updateOne(
      { _id: loanId },
      { $set: data }
    )
    
    return Response.json({ message: 'Loan updated successfully' })
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
    const loanId = searchParams.get('id')
    
    await db.collection('loans').deleteOne({ _id: loanId })
    return Response.json({ message: 'Loan deleted successfully' })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
