import { weatherConditionMap } from './weatherConditionMap';

export const resolveBackground = (weatherCode, isDay) => {
  const baseCategory = weatherConditionMap(weatherCode);
  return `${baseCategory}-${isDay ? 'day' : 'night'}`;
};
