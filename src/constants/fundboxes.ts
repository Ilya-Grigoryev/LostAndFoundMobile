export interface Fundbox {
  id: string;
  name: string;
  district: string;
  address: string;
  hours: string;
  latitude: number;
  longitude: number;
}

export const fundboxes: readonly Fundbox[] = [
  {
    id: 'fb-karlsplatz',
    name: 'Karlsplatz · Resselpark',
    district: '4. Bezirk',
    address: 'Karlsplatz 1, 1040 Wien',
    hours: 'Mo–So 06:00–22:00',
    latitude: 48.20104,
    longitude: 16.36966,
  },
  {
    id: 'fb-stephansplatz',
    name: 'Stephansplatz · U-Bahn',
    district: '1. Bezirk',
    address: 'Stephansplatz 3, 1010 Wien',
    hours: 'Mo–So 05:30–00:30',
    latitude: 48.20849,
    longitude: 16.37207,
  },
  {
    id: 'fb-westbahnhof',
    name: 'Wien Westbahnhof',
    district: '15. Bezirk',
    address: 'Europaplatz 2, 1150 Wien',
    hours: 'Mo–So 05:00–01:00',
    latitude: 48.19657,
    longitude: 16.33805,
  },
  {
    id: 'fb-praterstern',
    name: 'Praterstern · Pavillon',
    district: '2. Bezirk',
    address: 'Praterstern 3, 1020 Wien',
    hours: 'Mo–So 06:00–23:00',
    latitude: 48.21858,
    longitude: 16.39148,
  },
  {
    id: 'fb-naschmarkt',
    name: 'Naschmarkt · Linke Wienzeile',
    district: '6. Bezirk',
    address: 'Linke Wienzeile 26, 1060 Wien',
    hours: 'Mo–Sa 07:00–20:00',
    latitude: 48.19852,
    longitude: 16.36275,
  },
] as const;

export const mockUserPosition = {
  latitude: 48.20611,
  longitude: 16.36926,
};
