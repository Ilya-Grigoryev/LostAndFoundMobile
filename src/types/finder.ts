export interface FinderLocation {
  latitude: number;
  longitude: number;
}

export interface FinderReport {
  id: string;
  photoUri: string;
  location: FinderLocation;
  timestamp: number;
}
