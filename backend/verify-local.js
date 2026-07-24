const TEST_EMAIL = `testadmin_${Date.now()}@timeless.com`;

async function runTests() {
  console.log('🧪 Starting Local Backend Tests...\n');

  try {
    // 1. Test Health Check
    console.log('1️⃣  Testing Health Check Endpoint (GET /api/health)...');
    const healthRes = await fetch('http://localhost:3001/api/health');
    const healthText = await healthRes.text();
    
    if (healthRes.ok) {
      console.log('✅ Health Check Passed! Backend is running.');
    } else {
      console.error(`❌ Health Check Failed. Status: ${healthRes.status}. Response: ${healthText}`);
      console.log('\nMake sure you have started the backend by running `npm run dev` in the backend folder.');
      return;
    }

    console.log('\n----------------------------------------\n');

    // 2. Test Registration
    console.log('2️⃣  Testing Account Registration (POST /api/auth/register)...');
    console.log(`   Attempting to create account for: ${TEST_EMAIL}`);
    
    const registerRes = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Local Test Admin',
        email: TEST_EMAIL,
        password: 'password123!',
        phone: ''
      })
    });
    
    const registerText = await registerRes.text();
    
    if (registerRes.ok) {
      console.log('✅ Registration Passed! User successfully saved to the database.');
      console.log(`   Response: ${registerText}`);
    } else {
      console.error(`❌ Registration Failed. Status: ${registerRes.status}.`);
      console.error(`   Error details: ${registerText}`);
      console.log('\nIf this failed, check if your local DATABASE_URL is correct and the database is accessible.');
    }
    
    console.log('\n🎉 Local tests completed.');

  } catch (err) {
    console.error('\n💥 Could not connect to the local server.');
    console.error(err.message);
    console.log('\nPlease ensure your backend is running on port 3001 (run `npm run dev` in the backend folder).');
  }
}

runTests();
