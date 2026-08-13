export const healthAlertRules = [
  {
    id: 'asthma-pm25',
    appliesIf: (profile) => profile.diagnosedConditions.includes('Asthma') || profile.diagnosedConditions.includes('Respiratory condition (e.g. COPD)'),
    triggersIf: (envData) => envData.aqi >= 101, // Unhealthy for Sensitive Groups
    severity: 'red',
    buildMessage: (profile, envData) => {
      const name = profile.userName || 'Friend';
      const med = profile.prescribedMedication.length > 0 ? profile.prescribedMedication[0] : 'inhaler';
      return `${name}, PM2.5 is elevated today (${envData.aqi} AQI) — keep your ${med} within reach and consider a mask outdoors.`;
    }
  },
  {
    id: 'asthma-wearable-low-spo2',
    appliesIf: (profile) => profile.wearableConnected && (profile.diagnosedConditions.includes('Asthma') || profile.diagnosedConditions.includes('Respiratory condition (e.g. COPD)')),
    triggersIf: (envData) => envData.aqi >= 101 && envData.wearable?.spo2 < 95,
    severity: 'purple',
    buildMessage: (profile, envData) => {
      const name = profile.userName || 'Friend';
      return `URGENT: ${name}, your SpO2 reading looks a little low (${envData.wearable.spo2}%) with today's air quality. Take it easy and stay indoors if possible.`;
    }
  },
  {
    id: 'hypertension-hazardous',
    appliesIf: (profile) => profile.diagnosedConditions.includes('Hypertension') || profile.diagnosedConditions.includes('Heart condition'),
    triggersIf: (envData) => envData.aqi >= 151, // Unhealthy
    severity: 'red',
    buildMessage: (profile) => {
      const name = profile.userName || 'Friend';
      return `${name}, poor air quality can add strain on blood pressure. Avoid strenuous outdoor activity today.`;
    }
  },
  {
    id: 'elderly-child-moderate',
    appliesIf: (profile) => profile.diagnosedConditions.includes('Elderly in household') || profile.diagnosedConditions.includes('Children in household'),
    triggersIf: (envData) => envData.aqi >= 51 && envData.aqi <= 100, // Moderate
    severity: 'amber',
    buildMessage: (profile) => {
      const name = profile.userName || 'Friend';
      return `${name}, air quality is a bit elevated. A light mask outdoors is a good idea today for sensitive groups.`;
    }
  },
  {
    id: 'good-air',
    appliesIf: (profile) => profile.diagnosedConditions.length === 0,
    triggersIf: (envData) => envData.aqi <= 50, // Good
    severity: 'green',
    buildMessage: (profile) => {
      const name = profile.userName || 'Friend';
      return `${name}, air's clean today — nothing to worry about. Great day to be outside!`;
    }
  },
  {
    id: 'high-hr-wearable',
    appliesIf: (profile) => profile.wearableConnected,
    triggersIf: (envData) => envData.wearable?.heartRate > 100 && envData.aqi >= 101,
    severity: 'orange',
    buildMessage: (profile, envData) => {
      const name = profile.userName || 'Friend';
      return `${name}, your heart rate is slightly elevated (${envData.wearable.heartRate} bpm) in poor air quality. Try to rest.`;
    }
  }
];
