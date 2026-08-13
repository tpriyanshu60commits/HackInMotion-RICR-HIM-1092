import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const GEOAPIFY_PLACES_URL = 'https://api.geoapify.com/v2/places';
const lat = 28.6139;
const lng = 77.2090;
const radiusMeters = 5000;

async function test() {
  try {
    const response = await axios.get(GEOAPIFY_PLACES_URL, {
      params: {
        categories: 'service.vehicle.fuel',
        filter: `circle:${lng},${lat},${radiusMeters}`,
        limit: 500,
        apiKey: process.env.GEOAPIFY_API_KEY,
      },
    });
    
    console.log("Features found:", response.data.features.length);
    if (response.data.features.length > 0) {
      response.data.features.forEach(f => {
        const name = (f.properties.name || "").toLowerCase();
        if (name.includes('petrol') || name.includes('gas ') || name.includes('fuel')) {
          console.log("- Name:", f.properties.name, "Categories:", f.properties.categories.join(", "));
        }
      });
    }
  } catch (e) {
    console.error(e.message, e.response?.data);
  }
}

test();
