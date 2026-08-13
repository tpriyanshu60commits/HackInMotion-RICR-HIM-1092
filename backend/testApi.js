async function testSubmit() {
  const form = new FormData();
  form.append('category', 'garbage');
  form.append('title', 'Test Garbage');
  form.append('description', 'This is a test');
  form.append('address', '123 Test St');
  form.append('lat', '0');
  form.append('lng', '0');
  form.append('createdBy', 'anonymous');
  
  // No photo to avoid FormData file stream issues in native Node fetch

  try {
    const res = await fetch('http://localhost:5000/api/reports', {
      method: 'POST',
      body: form
    });
    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', data);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

testSubmit();
