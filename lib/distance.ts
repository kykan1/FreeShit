export type GeoPoint = {
  lat: number;
  lng: number;
};

const EARTH_RADIUS_MILES = 3958.7613;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function getDistanceMiles(origin: GeoPoint, destination: GeoPoint): number {
  const dLat = toRadians(destination.lat - origin.lat);
  const dLng = toRadians(destination.lng - origin.lng);
  const originLat = toRadians(origin.lat);
  const destinationLat = toRadians(destination.lat);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(originLat) * Math.cos(destinationLat) * Math.sin(dLng / 2) ** 2;

  return 2 * EARTH_RADIUS_MILES * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatMiles(distanceMiles: number): string {
  if (distanceMiles < 0.1) {
    return "<0.1 mi";
  }

  return `${distanceMiles.toFixed(1)} mi`;
}
