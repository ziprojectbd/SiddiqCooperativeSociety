import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'
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

export async function GET(req, { params }) {
  const path = params.path?.join('/') || ''
  const user = verifyToken(req)
  const db = await getDb()

  try {
    // Stats endpoints
    if (path === 'stats/dashboard') {
      const members = await db.collection('members').countDocuments()
      const deposits = await db.collection('deposits').aggregate([
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]).toArray()
      const totalLoans = await db.collection('loans').countDocuments()
      const activeLoans = await db.collection('loans').countDocuments({ status: 'active' })
      const externalBorrowers = await db.collection('externalBorrowers').countDocuments()
      const externalLoans = await db.collection('externalLoans').countDocuments()
      const activeExternalLoans = await db.collection('externalLoans').countDocuments({ status: 'active' })
      const externalLoanAmount = await db.collection('externalLoans').aggregate([
        { $match: { status: 'active' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]).toArray()
      
      return Response.json({
        totalMembers: members,
        totalDeposits: deposits[0]?.total || 0,
        totalLoans: totalLoans,
        activeLoans: activeLoans,
        totalSavings: deposits[0]?.total || 0,
        externalBorrowers: externalBorrowers,
        externalLoans: externalLoans,
        activeExternalLoans: activeExternalLoans,
        externalLoanAmount: externalLoanAmount[0]?.total || 0,
      })
    }

    if (path.startsWith('stats/member/')) {
      const memberId = path.split('/')[2]
      const deposits = await db.collection('deposits').aggregate([
        { $match: { memberId } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]).toArray()
      const loans = await db.collection('loans').countDocuments({ memberId, status: 'active' })
      
      return Response.json({
        totalDeposits: deposits[0]?.total || 0,
        activeLoans: loans,
        pendingPayments: 0,
        monthlySavings: 500,
      })
    }

    // Members endpoints
    if (path === 'members') {
      const members = await db.collection('members').find({}).toArray()
      return Response.json(members)
    }

    if (path.startsWith('members/')) {
      const memberId = path.split('/')[1]
      const member = await db.collection('members').findOne({ _id: memberId })
      return Response.json(member)
    }

    // Deposits endpoints
    if (path === 'deposits') {
      const url = new URL(req.url)
      const memberId = url.searchParams.get('memberId')
      const query = memberId ? { memberId } : {}
      const deposits = await db.collection('deposits').find(query).toArray()
      return Response.json(deposits)
    }

    // Loans endpoints
    if (path === 'loans') {
      const url = new URL(req.url)
      const memberId = url.searchParams.get('memberId')
      const query = memberId ? { memberId } : {}
      const loans = await db.collection('loans').find(query).toArray()
      return Response.json(loans)
    }

    // Loan payments endpoints
    if (path === 'loan-payments') {
      const url = new URL(req.url)
      const memberId = url.searchParams.get('memberId')
      const query = memberId ? { memberId } : {}
      const payments = await db.collection('loanPayments').find(query).toArray()
      return Response.json(payments)
    }

    // Settings endpoints
    if (path === 'settings') {
      const settings = await db.collection('settings').findOne({ _id: 'default' })
      return Response.json(settings || { defaultDepositAmount: 500 })
    }

    // External borrowers endpoints
    if (path === 'external-borrowers') {
      const borrowers = await db.collection('externalBorrowers').find({}).toArray()
      return Response.json(borrowers)
    }

    // External loans endpoints
    if (path === 'external-loans') {
      const loans = await db.collection('externalLoans').find({}).toArray()
      return Response.json(loans)
    }

    // External loan payments endpoints
    if (path === 'external-loan-payments') {
      const payments = await db.collection('externalLoanPayments').find({}).toArray()
      return Response.json(payments)
    }

    return Response.json({ error: 'Endpoint not found' }, { status: 404 })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req, { params }) {
  const path = params.path?.join('/') || ''
  const db = await getDb()

  try {
    // Login endpoint
    if (path === 'auth/login') {
      const { phone, password } = await req.json()
      const member = await db.collection('members').findOne({ phone })
      
      if (!member || !(await bcrypt.compare(password, member.password))) {
        return Response.json({ message: 'Invalid credentials' }, { status: 401 })
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
    }

    // Create member
    if (path === 'members') {
      const data = await req.json()
      const hashedPassword = await bcrypt.hash(data.password, 10)
      const result = await db.collection('members').insertOne({
        ...data,
        password: hashedPassword,
        createdAt: new Date(),
      })
      return Response.json({ _id: result.insertedId, ...data })
    }

    // Create deposit
    if (path === 'deposits') {
      const data = await req.json()
      const result = await db.collection('deposits').insertOne({
        ...data,
        createdAt: new Date(),
      })
      return Response.json({ _id: result.insertedId, ...data })
    }

    // Create loan
    if (path === 'loans') {
      const data = await req.json()
      const result = await db.collection('loans').insertOne({
        ...data,
        status: 'active',
        createdAt: new Date(),
      })
      return Response.json({ _id: result.insertedId, ...data })
    }

    // Create loan payment
    if (path === 'loan-payments') {
      const data = await req.json()
      const result = await db.collection('loanPayments').insertOne({
        ...data,
        createdAt: new Date(),
      })
      return Response.json({ _id: result.insertedId, ...data })
    }

    // Save settings
    if (path === 'settings') {
      const data = await req.json()
      await db.collection('settings').updateOne(
        { _id: 'default' },
        { $set: data },
        { upsert: true }
      )
      return Response.json({ success: true, ...data })
    }

    // Create external borrower
    if (path === 'external-borrowers') {
      const data = await req.json()
      const result = await db.collection('externalBorrowers').insertOne({
        ...data,
        createdAt: new Date(),
      })
      return Response.json({ _id: result.insertedId, ...data })
    }

    // Create external loan
    if (path === 'external-loans') {
      const data = await req.json()
      const result = await db.collection('externalLoans').insertOne({
        ...data,
        status: 'active',
        createdAt: new Date(),
      })
      return Response.json({ _id: result.insertedId, ...data })
    }

    // Create external loan payment
    if (path === 'external-loan-payments') {
      const data = await req.json()
      const result = await db.collection('externalLoanPayments').insertOne({
        ...data,
        createdAt: new Date(),
      })
      return Response.json({ _id: result.insertedId, ...data })
    }

    return Response.json({ error: 'Endpoint not found' }, { status: 404 })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(req, { params }) {
  const path = params.path?.join('/') || ''
  const user = verifyToken(req)
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const db = await getDb()

    if (path.startsWith('members/')) {
      const memberId = path.split('/')[1]
      const data = await req.json()
      
      const updateData = { ...data }
      if (data.password) {
        updateData.password = await bcrypt.hash(data.password, 10)
      }
      
      await db.collection('members').updateOne(
        { _id: memberId },
        { $set: updateData }
      )
      return Response.json({ message: 'Member updated' })
    }

    if (path.startsWith('loans/')) {
      const loanId = path.split('/')[1]
      const data = await req.json()
      await db.collection('loans').updateOne(
        { _id: loanId },
        { $set: data }
      )
      return Response.json({ message: 'Loan updated' })
    }

    if (path.startsWith('external-borrowers/')) {
      const borrowerId = path.split('/')[1]
      const data = await req.json()
      await db.collection('externalBorrowers').updateOne(
        { _id: borrowerId },
        { $set: data }
      )
      return Response.json({ message: 'Borrower updated' })
    }

    if (path.startsWith('external-loans/')) {
      const loanId = path.split('/')[1]
      const data = await req.json()
      await db.collection('externalLoans').updateOne(
        { _id: loanId },
        { $set: data }
      )
      return Response.json({ message: 'External loan updated' })
    }

    return Response.json({ error: 'Endpoint not found' }, { status: 404 })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  const path = params.path?.join('/') || ''
  const user = verifyToken(req)
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const db = await getDb()

    if (path.startsWith('members/')) {
      const memberId = path.split('/')[1]
      await db.collection('members').deleteOne({ _id: memberId })
      return Response.json({ message: 'Member deleted' })
    }

    if (path.startsWith('external-borrowers/')) {
      const borrowerId = path.split('/')[1]
      await db.collection('externalBorrowers').deleteOne({ _id: borrowerId })
      return Response.json({ message: 'Borrower deleted' })
    }

    if (path.startsWith('external-loans/')) {
      const loanId = path.split('/')[1]
      await db.collection('externalLoans').deleteOne({ _id: loanId })
      return Response.json({ message: 'External loan deleted' })
    }

    return Response.json({ error: 'Endpoint not found' }, { status: 404 })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
