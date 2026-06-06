import { Fundbox, fundboxes, mockUserPosition } from '../constants/fundboxes';

interface Coords {
  latitude: number;
  longitude: number;
}

function haversineMeters(a: Coords, b: Coords): number {
  const R = 6_371_000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function getFundboxById(id: string): Fundbox | undefined {
  return fundboxes.find(f => f.id === id);
}

export function distanceMeters(from: Coords, box: Fundbox): number {
  return haversineMeters(from, box);
}

export function findNearest(from: Coords = mockUserPosition): Fundbox {
  let nearest = fundboxes[0];
  let minDist = haversineMeters(from, nearest);
  for (const f of fundboxes.slice(1)) {
    const d = haversineMeters(from, f);
    if (d < minDist) {
      minDist = d;
      nearest = f;
    }
  }
  return nearest;
}

export function walkingMinutes(meters: number): number {
  return Math.max(1, Math.round(meters / 83));
}

// Pickup code released by the system to the verified owner (never to the finder). See ISSUE-13.
export function generatePickupCode(): string {
  let out = '';
  for (let i = 0; i < 6; i++) out += Math.floor(Math.random() * 10);
  return out;
}

// Reference the finder receives when dropping an item off — confirms the deposit, not a pickup code.
export function generateDepositId(): string {
  const number = Math.floor(10000 + Math.random() * 90000);
  return `FND-${number}`;
}
