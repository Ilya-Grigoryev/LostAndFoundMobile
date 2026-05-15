import AsyncStorage from '@react-native-async-storage/async-storage';
import { Fundbox, fundboxes, mockUserPosition } from '../constants/fundboxes';

const CODES_STORAGE_KEY = '@fundbox_codes';

interface Coords {
  latitude: number;
  longitude: number;
}

// Great-circle distance (Haversine) in meters.
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

// Walking time estimate at ≈ 5 km/h = 83 m/min.
export function walkingMinutes(meters: number): number {
  return Math.max(1, Math.round(meters / 83));
}

// 6-digit pickup code. Cryptographic strength not required — UX prop.
export function generateVerificationCode(): string {
  let out = '';
  for (let i = 0; i < 6; i++) out += Math.floor(Math.random() * 10);
  return out;
}

interface SavedCode {
  fundboxId: string;
  code: string;
  createdAt: number;
}

export async function saveCode(fundboxId: string, code: string): Promise<void> {
  const raw = await AsyncStorage.getItem(CODES_STORAGE_KEY);
  const list: SavedCode[] = raw ? JSON.parse(raw) : [];
  list.push({ fundboxId, code, createdAt: Date.now() });
  await AsyncStorage.setItem(CODES_STORAGE_KEY, JSON.stringify(list));
}

export async function getSavedCodes(): Promise<SavedCode[]> {
  const raw = await AsyncStorage.getItem(CODES_STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}
