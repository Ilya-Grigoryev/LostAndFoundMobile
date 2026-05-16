// 23 Wiener Gemeindebezirke with a few signature streets each.
// Mock data — used by StepByStepMode and AddressMode autocomplete.

export interface Bezirk {
  number: number;
  name: string;
  sampleStreets: readonly string[];
}

export const viennaBezirke: readonly Bezirk[] = [
  { number: 1,  name: 'Innere Stadt',     sampleStreets: ['Kärntner Straße', 'Stephansplatz', 'Graben', 'Kohlmarkt', 'Rotenturmstraße'] },
  { number: 2,  name: 'Leopoldstadt',     sampleStreets: ['Praterstraße', 'Taborstraße', 'Praterstern', 'Hauptallee'] },
  { number: 3,  name: 'Landstraße',       sampleStreets: ['Landstraßer Hauptstraße', 'Rennweg', 'Marxergasse'] },
  { number: 4,  name: 'Wieden',           sampleStreets: ['Wiedner Hauptstraße', 'Karlsplatz', 'Favoritenstraße'] },
  { number: 5,  name: 'Margareten',       sampleStreets: ['Reinprechtsdorfer Straße', 'Margaretenstraße', 'Schönbrunner Straße'] },
  { number: 6,  name: 'Mariahilf',        sampleStreets: ['Mariahilfer Straße', 'Linke Wienzeile', 'Gumpendorfer Straße'] },
  { number: 7,  name: 'Neubau',           sampleStreets: ['Neubaugasse', 'Burggasse', 'Lerchenfelder Straße'] },
  { number: 8,  name: 'Josefstadt',       sampleStreets: ['Josefstädter Straße', 'Lerchenfelder Straße', 'Lange Gasse'] },
  { number: 9,  name: 'Alsergrund',       sampleStreets: ['Währinger Straße', 'Nußdorfer Straße', 'Berggasse'] },
  { number: 10, name: 'Favoriten',        sampleStreets: ['Favoritenstraße', 'Reumannplatz', 'Quellenstraße'] },
  { number: 11, name: 'Simmering',        sampleStreets: ['Simmeringer Hauptstraße', 'Geiselbergstraße', 'Hasenleitengasse'] },
  { number: 12, name: 'Meidling',         sampleStreets: ['Meidlinger Hauptstraße', 'Schönbrunner Straße', 'Längenfeldgasse'] },
  { number: 13, name: 'Hietzing',         sampleStreets: ['Hietzinger Hauptstraße', 'Maxingstraße', 'Auhofstraße'] },
  { number: 14, name: 'Penzing',          sampleStreets: ['Hütteldorfer Straße', 'Linzer Straße', 'Hauptstraße'] },
  { number: 15, name: 'Rudolfsheim-Fünfhaus', sampleStreets: ['Mariahilfer Straße', 'Sechshauser Straße', 'Europaplatz'] },
  { number: 16, name: 'Ottakring',        sampleStreets: ['Ottakringer Straße', 'Thaliastraße', 'Hernalser Hauptstraße'] },
  { number: 17, name: 'Hernals',          sampleStreets: ['Hernalser Hauptstraße', 'Jörgerstraße', 'Dornbacher Straße'] },
  { number: 18, name: 'Währing',          sampleStreets: ['Währinger Straße', 'Gentzgasse', 'Gersthofer Straße'] },
  { number: 19, name: 'Döbling',          sampleStreets: ['Döblinger Hauptstraße', 'Heiligenstädter Straße', 'Grinzinger Allee'] },
  { number: 20, name: 'Brigittenau',      sampleStreets: ['Wallensteinstraße', 'Jägerstraße', 'Klosterneuburger Straße'] },
  { number: 21, name: 'Floridsdorf',      sampleStreets: ['Brünner Straße', 'Floridsdorfer Hauptstraße', 'Prager Straße'] },
  { number: 22, name: 'Donaustadt',       sampleStreets: ['Wagramer Straße', 'Donaustadtstraße', 'Erzherzog-Karl-Straße'] },
  { number: 23, name: 'Liesing',          sampleStreets: ['Breitenfurter Straße', 'Liesinger Platz', 'Ketzergasse'] },
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
