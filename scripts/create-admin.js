require('dotenv').config()
const { MongoClient } = require('mongodb')
const bcrypt = require('bcryptjs')

const uri = process.env.MONGODB_URI
const client = new MongoClient(uri)

async function createAdmin() {
  try {
    await client.connect()
    const db = client.db('somobay-somiti')

    console.log('Connected to MongoDB')

    // Check if admin already exists
    const existingAdmin = await db.collection('members').findOne({ phone: '01700000000' })
    if (existingAdmin) {
      console.log('Admin already exists')
      return
    }

    // Create admin
    const adminPassword = await bcrypt.hash('admin123', 10)
    
    const admin = {
      _id: 'admin001',
      name: 'Admin User',
      phone: '01700000000',
      password: adminPassword,
      role: 'admin',
      createdAt: new Date(),
    }

    await db.collection('members').insertOne(admin)
    console.log('✅ Admin created successfully!')
    console.log('Phone: 01700000000')
    console.log('Password: admin123')

  } catch (error) {
    console.error('Error creating admin:', error)
  } finally {
    await client.close()
  }
}

createAdmin()
