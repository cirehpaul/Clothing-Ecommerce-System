const fetch = require('node-fetch');

(async () => {
  const res = await fetch('http://localhost:3001/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Test Admin',
      email: 'testadmin200@timeless.com',
      password: 'password123!',
      phone: ''
    })
  });
  const text = await res.text();
  console.log(res.status, text);
})();
