## Readme

* Gruppe: 3
* Thema: Vienna Lost & Found
* Team: Denis Popov, Ilia Grigorev, Arseniy Akopov, Ivan Muzalevskii


### Implementierung

Framework: React Native (Expo, TypeScript)

API-Version: Android API Level 27–36

Gerät(e), auf dem(denen) getestet wurde:

- Pixel 6 (Android 14, API 36) - Emulator

Das fertige .apk liegt unter App/LostAndFound.apk

Externe Libraries und Frameworks:

- expo, expo-status-bar - Basis-Runtime und Status-Bar-Steuerung
- react, react-native - UI-Framework
- react-native-web, react-dom - Web-Preview-Unterstützung über Expo
- expo-font - Schriftarten-Laden zur Laufzeit
- @expo-google-fonts/archivo-black, @expo-google-fonts/manrope - Typografie (Bauhaus-Designsprache)

Dauer der Entwicklung:

- laufend (M3 High-fidelity Prototype, in Entwicklung)


### Starten der App

Voraussetzungen: Node.js ≥ 18, Android Studio mit einem konfigurierten Emulator (Pixel 6, API 27–36) oder ein physisches Android-Gerät.

```bash
# Abhängigkeiten installieren
npm install

# App im Android-Emulator starten
npm run android

# Alternativ: Expo Dev-Server starten (dann im Emulator / Expo Go scannen)
npm start
```

Nach `npm run android` öffnet Expo automatisch den laufenden Android-Emulator und installiert die App.
Für ein physisches Gerät: USB-Debugging aktivieren, Gerät verbinden, dann `npm run android`.


### Softwarearchitektur

```
src/
  components/ui/   – wiederverwendbare UI-Komponenten (Button, Card, Chip, TextInput, …)
  screens/dev/     – Entwicklungs-Showcase aller Komponenten
  theme/           – Designtokens: colors.ts, typography.ts, spacing.ts, radii.ts
  hooks/           – Custom React Hooks
  services/        – API-Aufrufe und externe Dienste
  types/           – gemeinsame TypeScript-Typen
```

Separation of Concerns: API-Aufrufe, Matching-Logik und Standortdienste liegen außerhalb der View-Komponenten (`src/services/`).


### Designentscheidungen

- **Bauhaus Wien Designsprache**: geometrische Grundformen (Kreis, Halbkreis, Quadrat, Balken) als strukturelles Vokabular — implementiert in `src/components/ui/Geo.tsx`.
- **Zwei Nutzergruppen, zwei Farbpaletten**: Terrakotta (`loserPrimary #C8654B`) für Loser-Flows, Senfgelb (`finderPrimary #D4A02C`) für Finder-Flows — stets aus `src/theme/colors.ts`, nie inline.
- **Typografie-Stack**: Archivo Black (Display/Headlines) + Manrope (Body/UI) — geladen via `useFonts` in `App.tsx`.
- **Designtokens**: alle Farben, Abstände (`spacingSmall = 8`, `spacingMedium = 16`), Radien und Typografie-Stile als Konstanten — keine hardcodierten Werte in Komponenten.
- **Drei States für alle async Operationen**: Loading (Spinner/Skeleton), Error (Meldung + Retry), Success — jeweils als eigene Komponenten (`LoadingSpinner`, `ErrorState`, `EmptyState`).
- **16dp Screen-Margin** konsistent auf allen Screens.


### Features (geplant / in Entwicklung)

- Fund melden (P1): Kategorie-Picker, flexibler Standort-Input (Pin+Radius / Schritt-für-Schritt / Route zeichnen / Adresse), Push-Benachrichtigungs-Opt-in
- Schnell-Finder-Flow (P2): Kamera + GPS, kein Formular, „Liegen lassen & markieren" vs. „Zur Fundbox bringen", Ziel < 30 Sekunden
- Flexibler Standort-Input (P3): vier Modi — Pin+Radius, Schritt-für-Schritt nach Bezirk, Route zeichnen, genaue Adresse
- Touristen-Onboarding (P4): Sprachauswahl, Gastregistrierung (Name + E-Mail), visuelle Hinweise
- Smart-Fundbox-System: nächste Box anzeigen, Route, Abgabe bestätigen, Verifizierungscode für Abholung
- Matching & Push-Benachrichtigungen: Alert bei gefundenem Match für aktive Verlustmeldungen
