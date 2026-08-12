// Standard US EPA AQI breakpoints
export const calculateBaseRisk = (aqi) => {
  if (aqi <= 50) return { level: 'GOOD', label: 'Good', severity: 1 };
  if (aqi <= 100) return { level: 'MODERATE', label: 'Moderate', severity: 2 };
  if (aqi <= 150) return { level: 'UNHEALTHY_SENSITIVE', label: 'Unhealthy for Sensitive Groups', severity: 3 };
  if (aqi <= 200) return { level: 'UNHEALTHY', label: 'Unhealthy', severity: 4 };
  if (aqi <= 300) return { level: 'VERY_UNHEALTHY', label: 'Very Unhealthy', severity: 5 };
  return { level: 'HAZARDOUS', label: 'Hazardous', severity: 6 };
};

export const getPersonalizedRisk = (baseRisk, healthProfile) => {
  let personalizedSeverity = baseRisk.severity;
  let reasons = [];

  if (!healthProfile) {
    return {
      riskLevel: baseRisk.level,
      label: baseRisk.label,
      severity: baseRisk.severity,
      explanation: 'Based on general population standards.',
      recommendations: getRecommendations(baseRisk.severity),
      personalRisk: 'STANDARD',
    };
  }

  const {
    respiratoryCondition,
    asthma,
    heartCondition,
    children,
    elderlyHouseholdMember,
    outdoorWorker,
  } = healthProfile;

  const isSensitive = respiratoryCondition || asthma || heartCondition || children || elderlyHouseholdMember;

  if (isSensitive && baseRisk.severity >= 2) {
    personalizedSeverity = Math.min(6, baseRisk.severity + 1);
    
    if (asthma || respiratoryCondition) reasons.push('Respiratory conditions increase susceptibility to poor air quality.');
    if (heartCondition) reasons.push('Cardiovascular conditions require extra caution in polluted air.');
    if (children) reasons.push('Children are more vulnerable to air pollution.');
    if (elderlyHouseholdMember) reasons.push('Elderly individuals are at higher risk.');
  }

  if (outdoorWorker && baseRisk.severity >= 3) {
    personalizedSeverity = Math.min(6, baseRisk.severity + 1);
    reasons.push('Outdoor work significantly increases exposure time.');
  }

  const riskLevelStr = personalizedSeverity > baseRisk.severity ? 'HIGHER' : 'STANDARD';

  return {
    riskLevel: baseRisk.level,
    label: baseRisk.label,
    severity: personalizedSeverity,
    personalRisk: riskLevelStr,
    explanation: reasons.length > 0 ? reasons.join(' ') : 'Your profile does not indicate heightened sensitivity.',
    recommendations: getRecommendations(personalizedSeverity),
  };
};

const getRecommendations = (severity) => {
  switch (severity) {
    case 1:
      return ['Air quality is satisfactory.', 'Enjoy outdoor activities.'];
    case 2:
      return ['Unusually sensitive people should consider reducing prolonged or heavy exertion.', 'Keep windows open for ventilation.'];
    case 3:
      return ['Sensitive groups should reduce prolonged outdoor exertion.', 'Keep windows closed if you are sensitive.', 'Consider using an air purifier indoors.'];
    case 4:
      return ['Everyone should reduce prolonged outdoor exertion.', 'Wear an N95 mask if you must go outside.', 'Keep windows closed and run air purifiers.'];
    case 5:
      return ['Avoid all prolonged outdoor exertion.', 'Wear an N95 mask outside.', 'Stay indoors with air purifiers running.'];
    case 6:
      return ['Health alert: everyone may experience more serious health effects.', 'Remain indoors.', 'Keep all windows closed and maximize air purification.'];
    default:
      return [];
  }
};
