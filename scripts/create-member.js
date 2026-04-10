require('dotenv').config()
const { MongoClient } = require('mongodb')
const bcrypt = require('bcryptjs')

const uri = process.env.MONGODB_URI
const client = new MongoClient(uri)

async function createMember() {
  try {
    await client.connect()
    const db = client.db('somobay-somiti')

    console.log('Connected to MongoDB')

    // Member data
    const memberPassword = await bcrypt.hash('member123', 10)
    
    const member = {
      _id: 'member001',
      name: 'Rahim Ahmed',
      phone: '01700000001',
      password: memberPassword,
      role: 'member',
      createdAt: new Date(),
    }

    // Check if member already exists
    const existingMember = await db.collection('members').findOne({ phone: '01700000001' })
    if (existingMember) {
      console.log('Member already exists')
      return
    }

    await db.collection('members').insertOne(member)
    console.log('✅ Member created successfully!')
    console.log('Phone: 01700000001')
    console.log('Password: member123')

  } catch (error) {
    console.error('Error creating member:', error)
  } finally {
    await client.close()
  }
}

createMember()
