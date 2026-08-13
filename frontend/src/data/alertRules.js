import { CloudRain, Wind, ThermometerSnowflake, ThermometerSun, CloudLightning, Home, Sun } from 'lucide-react';

export const alertRules = [
  {
    id: 'rain-incoming',
    category: 'weather',
    icon: CloudRain,
    severity: 'amber',
    condition: (data) => data.weatherCondition === 'rain',
    messages: {
      en: "Rain expected in the next few hours — carry an umbrella",
      hi: "अगले कुछ घंटों में बारिश की संभावना है — छाता साथ रखें"
    }
  },
  {
    id: 'high-pollution',
    category: 'air',
    icon: Wind,
    severity: 'red',
    condition: (data) => data.currentAQI >= 150,
    messages: {
      en: "Air quality is poor right now — wear a mask outdoors",
      hi: "हवा की गुणवत्ता खराब है — बाहर जाते समय मास्क पहनें"
    }
  },
  {
    id: 'temp-dropping',
    category: 'temperature',
    icon: ThermometerSnowflake,
    severity: 'blue',
    condition: (data) => data.currentTemp < 15,
    messages: {
      en: "Temperature's dropping tonight — layer up",
      hi: "तापमान गिर रहा है — गर्म कपड़े पहनें"
    }
  },
  {
    id: 'temp-rising',
    category: 'temperature',
    icon: ThermometerSun,
    severity: 'orange',
    condition: (data) => data.currentTemp > 35,
    messages: {
      en: "Heat's picking up this afternoon — stay hydrated",
      hi: "गर्मी बढ़ रही है — पर्याप्त पानी पिएं"
    }
  },
  {
    id: 'storm-warning',
    category: 'weather',
    icon: CloudLightning,
    severity: 'red',
    condition: (data) => data.weatherCondition === 'thunderstorm',
    messages: {
      en: "Storm expected later today — plan to be indoors",
      hi: "तूफान की चेतावनी — कृपया घर के अंदर रहें"
    }
  },
  {
    id: 'stay-indoors',
    category: 'health',
    icon: Home,
    severity: 'red',
    condition: (data) => data.currentAQI >= 300,
    messages: {
      en: "Air quality is hazardous — best to stay indoors today",
      hi: "हवा की गुणवत्ता खतरनाक है — आज घर के अंदर रहना सबसे अच्छा है"
    }
  },
  {
    id: 'clear-skies',
    category: 'positive',
    icon: Sun,
    severity: 'green',
    condition: (data) => data.currentAQI <= 50 && data.weatherCondition === 'clear',
    messages: {
      en: "Great air quality right now — good time for outdoor plans",
      hi: "हवा बहुत साफ है — बाहर जाने का अच्छा समय है"
    }
  }
];
