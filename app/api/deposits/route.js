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
    const { searchParams } = new URL(req.url)
    const memberId = searchParams.get('memberId')
    
    const query = memberId ? { memberId } : {}
    const deposits = await db.collection('deposits').find(query).toArray()
    return Response.json(deposits)
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
    
    const result = await db.collection('deposits').insertOne({
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
    const depositId = searchParams.get('id')
    
    await db.collection('deposits').deleteOne({ _id: depositId })
    return Response.json({ message: 'Deposit deleted successfully' })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
