import { getDb } from '@/lib/mongodb'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(req) {
  let db
  try {
    db = await getDb()
  } catch (error) {
    console.error('Database connection failed:', error)
    return Response.json({ message: 'Database connection failed: ' + error.message }, { status: 500 })
  }

  try {
    const body = await req.json()
    console.log('Login request body:', body)
    const { phone, password } = body
    
    // Validate required fields
    if (!phone || !password) {
      return Response.json({ message: 'Phone and password are required' }, { status: 400 })
    }
    
    const member = await db.collection('members').findOne({ phone })
    
    if (!member) {
      return Response.json({ message: 'User not found' }, { status: 401 })
    }
    
    const passwordMatch = await bcrypt.compare(password, member.password)
    
    if (!passwordMatch) {
      return Response.json({ message: 'Invalid password' }, { status: 401 })
    }

    const token = jwt.sign(
      { userId: member._id, role: member.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    return Response.json({
      token,
      user: { _id: member._id, name: member.name, phone: member.phone, role: member.role }
    })
  } catch (error) {
    return Response.json({ message: 'Login error: ' + error.message }, { status: 500 })
  }
}
