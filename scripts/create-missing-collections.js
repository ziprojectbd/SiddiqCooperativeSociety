const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb+srv://juwelsonlineworks:f2FLCaEuFY6VaLDO@siddiq-cooperative-soci.pw1kc5i.mongodb.net/?retryWrites=true&w=majority&appName=siddiq-cooperative-society';

async function createMissingCollections() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('somobay-somiti');

    // Create loans collection (if not exists)
    try {
      await db.createCollection('loans');
      console.log('✓ Created "loans" collection');
    } catch (error) {
      if (error.code === 48) {
        console.log('✓ "loans" collection already exists');
      } else {
        throw error;
      }
    }

    // Create loanPayments collection (if not exists)
    try {
      await db.createCollection('loanPayments');
      console.log('✓ Created "loanPayments" collection');
    } catch (error) {
      if (error.code === 48) {
        console.log('✓ "loanPayments" collection already exists');
      } else {
        throw error;
      }
    }

    // Create externalLoanPayments collection (if not exists)
    try {
      await db.createCollection('externalLoanPayments');
      console.log('✓ Created "externalLoanPayments" collection');
    } catch (error) {
      if (error.code === 48) {
        console.log('✓ "externalLoanPayments" collection already exists');
      } else {
        throw error;
      }
    }

    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('\nAll collections in database:');
    collections.forEach(col => console.log(`  - ${col.name}`));

    console.log('\n✅ All required collections are ready!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

createMissingCollections();
