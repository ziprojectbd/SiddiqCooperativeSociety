const { MongoClient } = require('mongodb')
const bcrypt = require('bcryptjs')

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/somobay-somiti'
const client = new MongoClient(uri)

async function seed() {
  try {
    await client.connect()
    const db = client.db('somobay-somiti')

    console.log('Connected to MongoDB')

    // Clear existing data
    await db.collection('members').deleteMany({})
    await db.collection('deposits').deleteMany({})
    await db.collection('loans').deleteMany({})
    await db.collection('loanPayments').deleteMany({})

    console.log('Cleared existing data')

    // Create members
    const adminPassword = await bcrypt.hash('admin123', 10)
    const memberPassword = await bcrypt.hash('member123', 10)

    const members = [
      {
        _id: 'admin001',
        name: 'Admin User',
        phone: '01700000000',
        password: adminPassword,
        role: 'admin',
        createdAt: new Date(),
      },
      {
        _id: 'member001',
        name: 'Rahim Ahmed',
        phone: '01700000001',
        password: memberPassword,
        role: 'member',
        createdAt: new Date(),
      },
      {
        _id: 'member002',
        name: 'Karim Uddin',
        phone: '01700000002',
        password: memberPassword,
        role: 'member',
        createdAt: new Date(),
      },
      {
        _id: 'member003',
        name: 'Jamal Hossain',
        phone: '01700000003',
        password: memberPassword,
        role: 'member',
        createdAt: new Date(),
      },
      {
        _id: 'member004',
        name: 'Kamal Hasan',
        phone: '01700000004',
        password: memberPassword,
        role: 'member',
        createdAt: new Date(),
      },
      {
        _id: 'member005',
        name: 'Nurul Islam',
        phone: '01700000005',
        password: memberPassword,
        role: 'member',
        createdAt: new Date(),
      },
      {
        _id: 'member006',
        name: 'Abdul Karim',
        phone: '01700000006',
        password: memberPassword,
        role: 'member',
        createdAt: new Date(),
      },
    ]

    await db.collection('members').insertMany(members)
    console.log('Created 7 members (1 admin + 6 members)')

    // Create deposits (2,750+ records)
    const deposits = []
    const memberIds = ['member001', 'member002', 'member003', 'member004', 'member005', 'member006']
    const memberNames = ['Rahim Ahmed', 'Karim Uddin', 'Jamal Hossain', 'Kamal Hasan', 'Nurul Islam', 'Abdul Karim']
    
    // Generate deposits for 12 months
    for (let month = 0; month < 12; month++) {
      for (let day = 1; day <= 30; day++) {
        for (let i = 0; i < memberIds.length; i++) {
          const date = new Date()
          date.setMonth(date.getMonth() - month)
          date.setDate(day)
          
          deposits.push({
            memberId: memberIds[i],
            memberName: memberNames[i],
            amount: 500,
            date: date.toISOString(),
            createdAt: date,
          })
        }
      }
    }

    await db.collection('deposits').insertMany(deposits)
    console.log(`Created ${deposits.length} deposit records`)

    // Create loans
    const loans = [
      {
        _id: 'loan001',
        memberId: 'member001',
        memberName: 'Rahim Ahmed',
        amount: 50000,
        interestRate: 10,
        status: 'active',
        dueDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(),
      },
      {
        _id: 'loan002',
        memberId: 'member002',
        memberName: 'Karim Uddin',
        amount: 30000,
        interestRate: 10,
        status: 'active',
        dueDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(),
      },
      {
        _id: 'loan003',
        memberId: 'member003',
        memberName: 'Jamal Hossain',
        amount: 40000,
        interestRate: 10,
        status: 'paid',
        dueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 210 * 24 * 60 * 60 * 1000),
      },
      {
        _id: 'loan004',
        memberId: 'member004',
        memberName: 'Kamal Hasan',
        amount: 25000,
        interestRate: 10,
        status: 'active',
        dueDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(),
      },
    ]

    await db.collection('loans').insertMany(loans)
    console.log('Created 4 loan records')

    // Create loan payments
    const loanPayments = [
      {
        _id: 'payment001',
        loanId: 'loan003',
        memberId: 'member003',
        memberName: 'Jamal Hossain',
        amount: 5000,
        type: 'principal',
        date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      },
      {
        _id: 'payment002',
        loanId: 'loan003',
        memberId: 'member003',
        memberName: 'Jamal Hossain',
        amount: 500,
        type: 'interest',
        date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      },
      {
        _id: 'payment003',
        loanId: 'loan003',
        memberId: 'member003',
        memberName: 'Jamal Hossain',
        amount: 5000,
        type: 'principal',
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
      {
        _id: 'payment004',
        loanId: 'loan003',
        memberId: 'member003',
        memberName: 'Jamal Hossain',
        amount: 500,
        type: 'interest',
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
      {
        _id: 'payment005',
        loanId: 'loan003',
        memberId: 'member003',
        memberName: 'Jamal Hossain',
        amount: 5000,
        type: 'principal',
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      },
      {
        _id: 'payment006',
        loanId: 'loan003',
        memberId: 'member003',
        memberName: 'Jamal Hossain',
        amount: 500,
        type: 'interest',
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      },
    ]

    await db.collection('loanPayments').insertMany(loanPayments)
    console.log('Created 6 loan payment records')

    console.log('\n✅ Database seeded successfully!')
    console.log('\n📊 Summary:')
    console.log(`   Members: ${members.length}`)
    console.log(`   Deposits: ${deposits.length}`)
    console.log(`   Loans: ${loans.length}`)
    console.log(`   Loan Payments: ${loanPayments.length}`)
    console.log('\n🔑 Login Credentials:')
    console.log('   Admin: 01700000000 / admin123')
    console.log('   Member: 01700000001 / member123')

  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    await client.close()
  }
}

seed()
