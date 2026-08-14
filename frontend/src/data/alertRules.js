import { Wind, CloudRain, Sun, ThermometerSun, Droplet, Gauge } from 'lucide-react';

export const alertRules = [
  {
    id: 'pm-worse',
    category: 'air',
    type: 'bad',
    icon: Wind,
    condition: (prev, curr) => prev && prev.currentAQI <= 100 && curr.currentAQI > 100,
    messages: {
      en: "Air quality just worsened — wear a mask if heading out.",
      hi: "हवा की गुणवत्ता खराब हो गई है — बाहर जाते समय मास्क पहनें।"
    }
  },
  {
    id: 'pm-better',
    category: 'air',
    type: 'good',
    icon: Wind,
    condition: (prev, curr) => prev && prev.currentAQI > 100 && curr.currentAQI <= 100,
    messages: {
      en: "Air quality improved back to Good.",
      hi: "हवा की गुणवत्ता वापस अच्छी हो गई है।"
    }
  },
  {
    id: 'rain-start',
    category: 'weather',
    type: 'bad',
    icon: CloudRain,
    condition: (prev, curr) => prev && prev.weatherCondition !== 'rain' && prev.weatherCondition !== 'thunderstorm' && (curr.weatherCondition === 'rain' || curr.weatherCondition === 'thunderstorm'),
    messages: {
      en: "It just started raining/storming.",
      hi: "बारिश/तूफान शुरू हो गया है।"
    }
  },
  {
    id: 'rain-stop',
    category: 'weather',
    type: 'good',
    icon: Sun,
    condition: (prev, curr) => prev && (prev.weatherCondition === 'rain' || prev.weatherCondition === 'thunderstorm') && (curr.weatherCondition !== 'rain' && curr.weatherCondition !== 'thunderstorm'),
    messages: {
      en: "Rain has stopped, weather is clearing up.",
      hi: "बारिश रुक गई है, मौसम साफ हो रहा है।"
    }
  },
  {
    id: 'wind-strong',
    category: 'weather',
    type: 'bad',
    icon: Wind,
    condition: (prev, curr) => prev && prev.windSpeed <= 20 && curr.windSpeed > 20,
    messages: {
      en: "Wind speed crossed into strong category (>20 km/h).",
      hi: "तेज हवाएं चल रही हैं।"
    }
  },
  {
    id: 'wind-calm',
    category: 'weather',
    type: 'good',
    icon: Wind,
    condition: (prev, curr) => prev && prev.windSpeed > 20 && curr.windSpeed <= 20,
    messages: {
      en: "Wind has calmed down.",
      hi: "हवा शांत हो गई है।"
    }
  },
  {
    id: 'temp-hot',
    category: 'temperature',
    type: 'bad',
    icon: ThermometerSun,
    condition: (prev, curr) => prev && prev.currentTemp <= 35 && curr.currentTemp > 35,
    messages: {
      en: "Temperature just crossed 35°C — stay hydrated.",
      hi: "तापमान 35°C के पार — हाइड्रेटेड रहें।"
    }
  },
  {
    id: 'temp-cool',
    category: 'temperature',
    type: 'good',
    icon: ThermometerSun,
    condition: (prev, curr) => prev && prev.currentTemp > 35 && curr.currentTemp <= 35,
    messages: {
      en: "Temperature dropped below 35°C.",
      hi: "तापमान 35°C से नीचे आ गया है।"
    }
  },
  {
    id: 'uv-high',
    category: 'weather',
    type: 'bad',
    icon: Sun,
    condition: (prev, curr) => prev && prev.uvIndex < 6 && curr.uvIndex >= 6,
    messages: {
      en: "UV Index is High — avoid direct sun.",
      hi: "यूवी इंडेक्स उच्च है — सीधी धूप से बचें।"
    }
  },
  {
    id: 'uv-moderate',
    category: 'weather',
    type: 'good',
    icon: Sun,
    condition: (prev, curr) => prev && prev.uvIndex >= 6 && curr.uvIndex < 6,
    messages: {
      en: "UV Index is back to Moderate/Low.",
      hi: "यूवी इंडेक्स सामान्य हो गया है।"
    }
  },
  {
    id: 'humidity-high',
    category: 'weather',
    type: 'bad',
    icon: Droplet,
    condition: (prev, curr) => prev && prev.humidity <= 90 && curr.humidity > 90,
    messages: {
      en: "Humidity is very high (>90%), muggy conditions.",
      hi: "उमस बहुत अधिक (>90%) है।"
    }
  },
  {
    id: 'humidity-low',
    category: 'weather',
    type: 'good',
    icon: Droplet,
    condition: (prev, curr) => prev && prev.humidity > 90 && curr.humidity <= 90,
    messages: {
      en: "Humidity has dropped to comfortable levels.",
      hi: "उमस कम हो गई है।"
    }
  },
  {
    id: 'pressure-drop',
    category: 'weather',
    type: 'bad',
    icon: Gauge,
    condition: (prev, curr) => prev && (prev.pressure - curr.pressure) >= 3,
    messages: {
      en: "Sharp pressure drop detected — possible storm incoming.",
      hi: "दबाव में भारी गिरावट — तूफान की संभावना।"
    }
  },
  {
    id: 'pressure-stable',
    category: 'weather',
    type: 'good',
    icon: Gauge,
    condition: (prev, curr) => prev && (curr.pressure - prev.pressure) >= 3,
    messages: {
      en: "Pressure is rising back to stable levels.",
      hi: "दबाव फिर से सामान्य हो रहा है।"
    }
  }
];
