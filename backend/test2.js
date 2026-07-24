(async () => {
  try {
    const res = await fetch('https://backend-ivory-five-74.vercel.app/api/health');
    const text = await res.text();
    console.log('Health:', res.status, text);
    
    const res2 = await fetch('https://backend-ivory-five-74.vercel.app/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Test Admin',
        email: 'testadminprod1@timeless.com',
        password: 'password123!',
        phone: ''
      })
    });
    const text2 = await res2.text();
    console.log('Register:', res2.status, text2);
  } catch(e) {
    console.error(e);
  }
})();
