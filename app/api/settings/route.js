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
    const settings = await db.collection('settings').findOne({ _id: 'default' })
    return Response.json(settings || { defaultDepositAmount: 500 })
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
    
    await db.collection('settings').updateOne(
      { _id: 'default' },
      { $set: data },
      { upsert: true }
    )
    
    return Response.json({ success: true, ...data })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
