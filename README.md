<p align="center">
  <img src="./assets/bd08853304c2f53e2c40dcb5ec88609d8fa7d553f215133265eb037d2a7dd3ba.png" width="220" alt="Vienna Lost & Found logo" />
</p>

<h1 align="center">Vienna Lost & Found</h1>

<p align="center">
  Mobile HCI prototype for reporting, matching and recovering lost items in Vienna.
</p>

<p align="center">
  <strong>App logo</strong>: Kreisförmiges Markenzeichen mit Wiener Farben und klaren Symbolen für Fund- und Verlustmeldungen.
</p>

<p align="center">
  <img alt="Expo SDK 54" src="https://img.shields.io/badge/Expo%20SDK-54-000000?style=for-the-badge&logo=expo&logoColor=white" />
  <img alt="React Native 0.81" src="https://img.shields.io/badge/React%20Native-0.81-61DAFB?style=for-the-badge&logo=react&logoColor=101010" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="Android API 27-36" src="https://img.shields.io/badge/Android%20API-27--36-3DDC84?style=for-the-badge&logo=android&logoColor=101010" />
</p>

---

## Projekt

**Gruppe:** 3  
**Team-Nr.:** 306  
**Gruppenmitglieder:** Popov Denis, Grigorev Ilia, Muzalevskii Ivan, Akopov Arseniy  
**Projektthema:** Vienna Lost & Found  
**Framework:** Expo Managed, React Native, TypeScript  
**Zielgerät:** Pixel 6, Android API Level 27-36  
**Getestet auf:** Pixel 6 Emulator, Android 14 / API 36  

Vienna Lost & Found ist ein mobiler High-Fidelity-Prototyp für Menschen, die in Wien etwas verloren oder gefunden haben. Die App fokussiert auf kurze Wege, klare Entscheidungen und eine ruhige visuelle Sprache, damit sie auch in stressigen Situationen verständlich bleibt.

---

## Design Direction

<p>
  <strong>Clean Austrian Modernism</strong> verbindet reduzierte Wiener Gestaltung mit klaren mobilen Interaktionen.
  Die App nutzt starke Flächen, geometrische Akzente, große Touch-Zonen und eine kleine, konsequente Farbpalette.
</p>

| Token | Farbe | Verwendung |
| --- | --- | --- |
| `loserPrimary` | <span style="display:inline-block;width:14px;height:14px;background:#C8654B;border:1px solid #14130F;"></span> `#C8654B` | Lost-Flow, Stress, warme Orientierung |
| `finderPrimary` | <span style="display:inline-block;width:14px;height:14px;background:#D4A02C;border:1px solid #14130F;"></span> `#D4A02C` | Found-Flow, schnelle positive Aktion |
| `background` | <span style="display:inline-block;width:14px;height:14px;background:#F5F1E8;border:1px solid #14130F;"></span> `#F5F1E8` | ruhiger App-Hintergrund |
| `accent` | <span style="display:inline-block;width:14px;height:14px;background:#16263D;border:1px solid #14130F;"></span> `#16263D` | sekundäre Kontrollelemente |
| `sage` | <span style="display:inline-block;width:14px;height:14px;background:#A5BC8E;border:1px solid #14130F;"></span> `#A5BC8E` | Bestätigung, weiche Zwischenzustände |

**Typografie**

- `Archivo Black` für große, plakative Titel
- `Manrope` für Labels, Body Copy, Buttons und Formulartexte
- 16dp Screen Margins als Grundraster
- Große Primary Actions statt kleinteiliger Menüs

**UI-Prinzipien**

- Ein Screen, eine klare Entscheidung
- Finder sollen in unter 30 Sekunden fertig sein
- Loser können ungenaue Orte beschreiben: Pin + Radius, Route, Bezirk/Schritte oder genaue Adresse
- Alle UI-Bausteine verwenden zentrale Theme-Tokens
- Async-Aktionen haben sichtbare Zustände: loading, error oder success

---

## Kernfunktionen

| Flow | Kurzbeschreibung |
| --- | --- |
| **Onboarding** | Sprache wählen, Gastprofil mit Name und E-Mail speichern, danach App direkt starten |
| **Home** | Zwei große Einstiege: etwas verloren oder etwas gefunden |
| **Lost Item Flow** | Kategorie, Beschreibung, flexible Ortsangabe, Push-Opt-in und Bestätigung |
| **Quick Finder Flow** | Foto aufnehmen, GPS markieren, liegen lassen oder zur Fundbox bringen |
| **Smart Fundbox Flow** | Nächste Fundbox auf Karte, Route, Drop-off, Abholcode für Claim |
| **Matching Simulation** | DummyJSON + lokale Vergleichslogik, Push nach Drop-off, Match-Details per Tap |
| **Activity History** | Verlauf mit gefundenen, verlorenen, aktiven, abgeschlossenen und möglichen Matches |
| **Localization** | Deutsch und Englisch über einfache React Context Lösung |

---

## Architektur

Die App trennt UI, Navigation, lokale Daten und Matching-Logik bewusst einfach. Das Projekt bleibt dadurch gut lesbar und passt zu einem studentischen HCI-Prototyp.

```text
src/
├── components/
│   ├── ui/              shared UI foundation
│   ├── fundbox/         map markers, route stats, code boxes
│   ├── location/        lost-item location input components
│   └── activity/        history cards and detail modal
├── constants/
│   ├── strings.ts       EN/DE copy and localization keys
│   ├── fundboxes.ts     Vienna mock Fundbox locations
│   ├── categories.ts    lost-item categories
│   └── viennaBezirke.ts local address/autocomplete mock data
├── contexts/
│   ├── LocalizationContext.tsx
│   ├── FinderReportContext.tsx
│   └── LoserReportContext.tsx
├── navigation/
│   ├── RootNavigator.tsx
│   ├── MainNavigator.tsx
│   ├── FinderNavigator.tsx
│   ├── LoserNavigator.tsx
│   ├── FundboxNavigator.tsx
│   └── OnboardingNavigator.tsx
├── screens/
│   ├── onboarding/
│   ├── home/
│   ├── finder/
│   ├── loser/
│   ├── fundbox/
│   └── activity/
├── services/
│   ├── fundboxService.ts
│   ├── finderReportService.ts
│   ├── loserReportService.ts
│   └── matchingService.ts
├── theme/
│   ├── colors.ts
│   ├── spacing.ts
│   ├── typography.ts
│   └── radii.ts
└── types/
    ├── finder.ts
    └── loser.ts
```

### Datenfluss

```text
First launch
  -> Onboarding
  -> AsyncStorage: @app_language, @guest_name, @guest_email, @onboarding_complete

Found item
  -> Camera/GPS
  -> Fundbox route
  -> Drop-off confirmation
  -> Matching simulation
  -> Local notification
  -> Claim or map route

Lost item
  -> Category
  -> Location input
  -> Confirmation
  -> AsyncStorage: @lost_reports
  -> Activity history
```

---

## Matching Prototype

Das Matching ist absichtlich leichtgewichtig. Es soll den HCI-Flow demonstrieren, nicht ein produktives Scoring-System ersetzen.

- Mock-Daten kommen über `dummyjson.com/products`
- Kategorien werden grob auf App-Kategorien gemappt
- `simulateMatch(foundReport, lostReports)` prüft zuerst Kategoriegleichheit
- Ein kleiner Textvergleich verbessert das Ergebnis, bleibt aber bewusst simpel
- Nach erfolgreichem Drop-off wird nach ca. 3 Sekunden eine lokale Notification geplant
- Beim Tap auf die Notification öffnet die App entweder:
  - eine Fundbox-Claim-Seite
  - oder eine Kartenroute zum Fundort in der Stadt

Wenn Notifications nicht erlaubt sind, läuft der Flow ohne Crash weiter.

---

## Screens und User Journey

### 1. Onboarding

Sprache wählen, Gastprofil ausfüllen, danach wird der Onboarding-Status gespeichert. Bei späteren App-Starts wird direkt Home geöffnet.

### 2. Lost Item

Der Lost-Flow unterstützt mehrere Erinnerungsarten:

- Ich kenne ungefähr den Ort: Pin + Radius
- Ich erinnere mich an den Weg: Route zeichnen
- Ich kenne Bezirk und Stationen: Schritt-für-Schritt
- Ich kenne die Adresse: genaue Adresse

### 3. Found Item

Der Finder-Flow ist bewusst kurz: Foto, GPS, Entscheidung. Danach kann der Gegenstand markiert oder zur Fundbox gebracht werden.

### 4. Fundbox

Die App zeigt Fundbox-Standorte auf einer Karte, berechnet Distanz und Gehzeit und führt zum Drop-off oder Claim.

### 5. History

Die Verlauf-Seite zeigt beide Seiten des Systems:

- gefundene Gegenstände
- verlorene Gegenstände
- aktive Suchen
- mögliche Matches
- gefundene und abgeschlossene Einträge

---

## Technologie

| Bereich | Libraries |
| --- | --- |
| App Framework | `expo`, `react-native`, `typescript` |
| Navigation | `@react-navigation/native`, `@react-navigation/native-stack` |
| Local Storage | `@react-native-async-storage/async-storage` |
| Maps | `react-native-maps` |
| Camera | `expo-camera` |
| Location | `expo-location` |
| Notifications | `expo-notifications` |
| Fonts | `@expo-google-fonts/archivo-black`, `@expo-google-fonts/manrope` |
| Icons | `@expo/vector-icons` |
| UI Input | `@react-native-community/slider` |

---

## Installation

Voraussetzungen:

- Node.js 18 oder neuer
- Android Studio mit eingerichtetem Emulator
- Pixel 6 Emulator oder kompatibles Android-Gerät
- Für Karten: gültiger Google Maps API Key in `app.json`

```bash
npm install
```

---

## App starten

Android Emulator:

```bash
npm run android
```

Expo Dev Server:

```bash
npm start
```

Danach im Expo-Menü:

```text
a  Android öffnen
r  App reloaden
j  Debugger öffnen
```

TypeScript prüfen:

```bash
npx tsc --noEmit
```

---

## Test-Szenarien

### Onboarding

1. App-Daten löschen oder AsyncStorage zurücksetzen.
2. App starten.
3. Sprache wählen.
4. Name und E-Mail eingeben.
5. Als Gast fortfahren.
6. App neu starten: Home sollte direkt erscheinen.

### Sprache

1. Auf Home oben rechts die Sprach-Schaltfläche drücken.
2. Texte wechseln zwischen Deutsch und Englisch.
3. Matching-Notifications verwenden die aktive Sprache.

### Lost Flow

1. Home: Lost-Block öffnen.
2. Kategorie auswählen.
3. Einen Ortsmodus testen.
4. Push-Opt-in setzen oder auslassen.
5. Report abschließen.

### Finder + Fundbox + Matching

1. Home: Found-Block öffnen.
2. Foto/GPS setzen.
3. Fundbox auswählen.
4. Drop-off bestätigen.
5. Nach ca. 3 Sekunden erscheint eine lokale Match-Notification.
6. Notification antippen.
7. App öffnet Claim oder Kartenroute, je nach Match-Daten.

### Activity History

1. Home: `Verlauf` / `History` öffnen.
2. Zwischen Found und Lost wechseln.
3. Ein Possible-Match-Item öffnen.
4. Je nach Eintrag öffnet die App Fundbox-Claim oder Kartenroute.

---

## Build und Abgabe

Für die Abgabe soll kein `node_modules/` im ZIP liegen. Die APK gehört in einen eigenen `App/` Ordner.

```text
M3_Gruppe3_ViennaLostAndFound.zip
├── App/
│   └── LostAndFound.apk
├── README.md
├── package.json
├── app.json
├── App.tsx
├── src/
├── assets/
└── ...
```

APK-Build je nach Kurs-Setup:

```bash
npx expo prebuild
npx expo run:android
```

Oder mit EAS, falls im Team eingerichtet:

```bash
eas build -p android --profile preview
```

---

## Team und Verantwortlichkeiten

| Person | Bereich |
| --- | --- |
| Popov Denis | Onboarding, Localization, Matching Simulation |
| Grigorev Ilia | Foundation, Design System, App Shell, Fundbox |
| Muzalevskii Ivan | Lost Item Flow, Location Input |
| Akopov Arseniy | Quick Finder Flow |

---

## Projektstatus

| Bereich | Status |
| --- | --- |
| Design System | fertig |
| Navigation | fertig |
| Onboarding | fertig |
| Home | fertig |
| Finder Flow | integriert |
| Lost Flow | integriert |
| Fundbox Flow | integriert |
| Matching Simulation | integriert |
| Localization EN/DE | integriert |
| TypeScript Check | `npx tsc --noEmit` |

---

## Kurzfazit

Vienna Lost & Found ist ein kompakter HCI-Prototyp mit klarer visueller Richtung, getrennten Nutzerflows und realistischen mobilen Interaktionen. Die App zeigt, wie ein Lost-and-Found-System in Wien schneller, freundlicher und verständlicher funktionieren könnte: melden, abgeben, matchen, zurückbekommen.
