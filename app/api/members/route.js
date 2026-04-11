import { getDb } from '@/lib/mongodb'
import bcrypt from 'bcryptjs'
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
    const memberId = searchParams.get('id')
    
    if (memberId) {
      const member = await db.collection('members').findOne({ _id: memberId })
      return Response.json(member)
    }
    
    const members = await db.collection('members').find({}).toArray()
    return Response.json(members)
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
    const hashedPassword = await bcrypt.hash(data.password, 10)
    
    const result = await db.collection('members').insertOne({
      ...data,
      password: hashedPassword,
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
    const memberId = searchParams.get('id')
    const data = await req.json()
    
    const updateData = { ...data }
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10)
    }
    
    await db.collection('members').updateOne(
      { _id: memberId },
      { $set: updateData }
    )
    
    return Response.json({ message: 'Member updated successfully' })
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
    const memberId = searchParams.get('id')
    
    await db.collection('members').deleteOne({ _id: memberId })
    return Response.json({ message: 'Member deleted successfully' })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
