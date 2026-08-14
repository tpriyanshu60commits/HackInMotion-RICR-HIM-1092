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
    diagnosedConditions = [],
    customIssue = ''
  } = healthProfile;

  // Check array conditions too, since we migrated to using diagnosedConditions array
  const hasRespiratory = respiratoryCondition || asthma || diagnosedConditions.includes("Asthma") || diagnosedConditions.includes("Respiratory condition (e.g. COPD)");
  const hasHeart = heartCondition || diagnosedConditions.includes("Heart condition") || diagnosedConditions.includes("Hypertension");
  const hasChildren = children || diagnosedConditions.includes("Children in household");
  const hasElderly = elderlyHouseholdMember || diagnosedConditions.includes("Elderly in household");

  const isSensitive = hasRespiratory || hasHeart || hasChildren || hasElderly || customIssue.trim().length > 0;

  if (isSensitive && baseRisk.severity >= 2) {
    personalizedSeverity = Math.min(6, baseRisk.severity + 1);
    
    if (hasRespiratory) reasons.push('Respiratory conditions increase susceptibility to poor air quality.');
    if (hasHeart) reasons.push('Cardiovascular conditions require extra caution in polluted air.');
    if (hasChildren) reasons.push('Children are more vulnerable to air pollution.');
    if (hasElderly) reasons.push('Elderly individuals are at higher risk.');
    if (customIssue.trim().length > 0) reasons.push(`We noted your custom condition: "${customIssue}". Please take extra precautions.`);
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
