fetch('http://localhost:8000/api/v1/auth/send-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ identifier: 'test@example.com' })
})
.then(res => res.json().then(data => ({status: res.status, data})))
.then(console.log)
.catch(err => console.error("Fetch Error:", err.message));
