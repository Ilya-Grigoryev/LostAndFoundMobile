export interface Bezirk {
  number: number;
  name: string;
  lat: number;
  lng: number;
  sampleStreets: readonly string[];
}

export const viennaBezirke: readonly Bezirk[] = [
  { number: 1,  name: 'Innere Stadt',         lat: 48.2082, lng: 16.3738, sampleStreets: ['Kärntner Straße', 'Stephansplatz', 'Graben', 'Kohlmarkt', 'Rotenturmstraße'] },
  { number: 2,  name: 'Leopoldstadt',         lat: 48.2188, lng: 16.3942, sampleStreets: ['Praterstraße', 'Taborstraße', 'Praterstern', 'Hauptallee'] },
  { number: 3,  name: 'Landstraße',           lat: 48.1968, lng: 16.3897, sampleStreets: ['Landstraßer Hauptstraße', 'Rennweg', 'Marxergasse'] },
  { number: 4,  name: 'Wieden',               lat: 48.1929, lng: 16.3664, sampleStreets: ['Wiedner Hauptstraße', 'Karlsplatz', 'Favoritenstraße'] },
  { number: 5,  name: 'Margareten',           lat: 48.1850, lng: 16.3570, sampleStreets: ['Reinprechtsdorfer Straße', 'Margaretenstraße', 'Schönbrunner Straße'] },
  { number: 6,  name: 'Mariahilf',            lat: 48.1955, lng: 16.3530, sampleStreets: ['Mariahilfer Straße', 'Linke Wienzeile', 'Gumpendorfer Straße'] },
  { number: 7,  name: 'Neubau',               lat: 48.2020, lng: 16.3490, sampleStreets: ['Neubaugasse', 'Burggasse', 'Lerchenfelder Straße'] },
  { number: 8,  name: 'Josefstadt',           lat: 48.2100, lng: 16.3490, sampleStreets: ['Josefstädter Straße', 'Lerchenfelder Straße', 'Lange Gasse'] },
  { number: 9,  name: 'Alsergrund',           lat: 48.2230, lng: 16.3560, sampleStreets: ['Währinger Straße', 'Nußdorfer Straße', 'Berggasse'] },
  { number: 10, name: 'Favoriten',            lat: 48.1620, lng: 16.3740, sampleStreets: ['Favoritenstraße', 'Reumannplatz', 'Quellenstraße'] },
  { number: 11, name: 'Simmering',            lat: 48.1700, lng: 16.4300, sampleStreets: ['Simmeringer Hauptstraße', 'Geiselbergstraße', 'Hasenleitengasse'] },
  { number: 12, name: 'Meidling',             lat: 48.1740, lng: 16.3310, sampleStreets: ['Meidlinger Hauptstraße', 'Schönbrunner Straße', 'Längenfeldgasse'] },
  { number: 13, name: 'Hietzing',             lat: 48.1800, lng: 16.2970, sampleStreets: ['Hietzinger Hauptstraße', 'Maxingstraße', 'Auhofstraße'] },
  { number: 14, name: 'Penzing',              lat: 48.1980, lng: 16.2950, sampleStreets: ['Hütteldorfer Straße', 'Linzer Straße', 'Hauptstraße'] },
  { number: 15, name: 'Rudolfsheim-Fünfhaus', lat: 48.1960, lng: 16.3290, sampleStreets: ['Mariahilfer Straße', 'Sechshauser Straße', 'Europaplatz'] },
  { number: 16, name: 'Ottakring',            lat: 48.2100, lng: 16.3100, sampleStreets: ['Ottakringer Straße', 'Thaliastraße', 'Hernalser Hauptstraße'] },
  { number: 17, name: 'Hernals',              lat: 48.2220, lng: 16.3050, sampleStreets: ['Hernalser Hauptstraße', 'Jörgerstraße', 'Dornbacher Straße'] },
  { number: 18, name: 'Währing',              lat: 48.2330, lng: 16.3280, sampleStreets: ['Währinger Straße', 'Gentzgasse', 'Gersthofer Straße'] },
  { number: 19, name: 'Döbling',              lat: 48.2530, lng: 16.3450, sampleStreets: ['Döblinger Hauptstraße', 'Heiligenstädter Straße', 'Grinzinger Allee'] },
  { number: 20, name: 'Brigittenau',          lat: 48.2350, lng: 16.3720, sampleStreets: ['Wallensteinstraße', 'Jägerstraße', 'Klosterneuburger Straße'] },
  { number: 21, name: 'Floridsdorf',          lat: 48.2570, lng: 16.3990, sampleStreets: ['Brünner Straße', 'Floridsdorfer Hauptstraße', 'Prager Straße'] },
  { number: 22, name: 'Donaustadt',           lat: 48.2340, lng: 16.4560, sampleStreets: ['Wagramer Straße', 'Donaustadtstraße', 'Erzherzog-Karl-Straße'] },
  { number: 23, name: 'Liesing',              lat: 48.1430, lng: 16.3090, sampleStreets: ['Breitenfurter Straße', 'Liesinger Platz', 'Ketzergasse'] },
] as const;

export interface AddressEntry {
  street: string;
  bezirk: Bezirk;
}

export function searchAddresses(query: string, limit = 5): AddressEntry[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  const matches: AddressEntry[] = [];
  for (const bezirk of viennaBezirke) {
    for (const street of bezirk.sampleStreets) {
      if (street.toLowerCase().includes(q)) {
        matches.push({ street, bezirk });
        if (matches.length === limit) return matches;
      }
    }
  }
  return matches;
}

export function getBezirk(number: number): Bezirk {
  const found = viennaBezirke.find(b => b.number === number);
  if (!found) throw new Error(`Unknown Bezirk number: ${number}`);
  return found;
}
