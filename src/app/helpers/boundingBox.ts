export const getBoundingBox = (
  lat: number,
  lon: number,
  distanceInKm: number,
) => {
  const latDelta = distanceInKm / 111;
  const lonDelta = distanceInKm / (111 * Math.cos(lat * (Math.PI / 180)));

  return {
    minLat: lat - latDelta,
    maxLat: lat + latDelta,
    minLon: lon - lonDelta,
    maxLon: lon + lonDelta,
  };
};
