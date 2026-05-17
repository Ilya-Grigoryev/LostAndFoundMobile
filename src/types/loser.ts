export type CategoryId =
  | 'phone'
  | 'keys'
  | 'wallet'
  | 'umbrella'
  | 'headphones'
  | 'glasses'
  | 'other';

export interface LatLng {
  latitude: number;
  longitude: number;
}

export type LocationValue =
  | { kind: 'pin'; coords: LatLng; radius: number }
  | { kind: 'route'; coords: LatLng[] }
  | { kind: 'steps'; bezirk: number; street?: string; landmark?: string }
  | { kind: 'address'; address: string; coords?: LatLng };

export interface LoserReport {
  category: CategoryId | null;
  description?: string;
  location: LocationValue | null;
  pushOptIn: boolean;
}
