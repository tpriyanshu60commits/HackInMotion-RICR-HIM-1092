import axios from 'axios';

async function testReverse() {
  console.log('Testing BigDataCloud reverse geocode for Mumbai (19.07283, 72.88261)...');
  try {
    const res = await axios.get('https://api.bigdatacloud.net/data/reverse-geocode-client', {
      params: { latitude: 19.07283, longitude: 72.88261, localityLanguage: 'en' }
    });
    console.log('BigDataCloud result:', {
      city: res.data.city || res.data.locality || res.data.principalSubdivision,
      country: res.data.countryName
    });
  } catch (e) {
    console.error('BigDataCloud error:', e.message);
  }

  console.log('Testing BigDataCloud reverse geocode for Bhopal (23.25469, 77.40289)...');
  try {
    const res = await axios.get('https://api.bigdatacloud.net/data/reverse-geocode-client', {
      params: { latitude: 23.25469, longitude: 77.40289, localityLanguage: 'en' }
    });
    console.log('BigDataCloud result for Bhopal:', {
      city: res.data.city || res.data.locality || res.data.principalSubdivision,
      country: res.data.countryName
    });
  } catch (e) {
    console.error('BigDataCloud error for Bhopal:', e.message);
  }
}

testReverse();
