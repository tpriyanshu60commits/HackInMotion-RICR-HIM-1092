/**
 * Downsamples an array of route coordinates to a target maximum number of points.
 *
 * @param {Array<Array<number>>} coordinates - Array of [lat, lng] coordinates
 * @param {number} maxPoints - Maximum number of points to return (default 15)
 * @returns {Array<Array<number>>} Downsampled array of coordinates
 */
export const sampleRoutePoints = (coordinates, maxPoints = 15) => {
  if (!coordinates || coordinates.length === 0) return [];
  if (coordinates.length <= maxPoints) return coordinates;

  const sampled = [];
  const step = (coordinates.length - 1) / (maxPoints - 1);

  for (let i = 0; i < maxPoints; i++) {
    const index = Math.min(Math.round(i * step), coordinates.length - 1);
    sampled.push(coordinates[index]);
  }

  // Ensure the last point is always included to cover the full route
  if (sampled[sampled.length - 1] !== coordinates[coordinates.length - 1]) {
    sampled[sampled.length - 1] = coordinates[coordinates.length - 1];
  }

  return sampled;
};
