# Leitfaden & Best Practices: HCI App-Entwicklung (Art Institute of Chicago)

Dieses Dokument fasst die technischen Anforderungen der Aufgabe sowie die wichtigsten theoretischen Konzepte aus den Vorlesungen (Usability Heuristiken nach Nielsen, Design Principles, Context/Task Analysis) zusammen. Es dient als Blaupause für eine erfolgreiche Umsetzung und maximale Punkteausbeute.

---

## 1. Architektur, Code-Qualität & Setup (25% der Note)
*Grundvoraussetzung: Die App muss kompilierbar sein und auf einem Pixel 6 (API-Level 27-30/36) flüssig laufen.*

### Code-Standards & Lesbarkeit
- **Clean Code:** Verwende sprechende und englische Klassen-, Variablen- und Methodennamen (z.B. `ArtworkDetailView`, `fetchArtworksFromApi`).
- **Kommentierung:** Kommentiere komplexe Logiken, API-Aufrufe und wichtige Design-Entscheidungen im Code ausführlich.
- **Design Tokens nutzen:** Hardcode keine Farben oder Schriftgrößen direkt in den UI-Elementen! Definiere Variablen (Tokens) für `PrimaryColor`, `SecondaryColor`, `BackgroundColor` sowie für Typografie und Abstände (z.B. `spacingSmall = 8dp`).
- **Struktur:** Trenne Logik (API-Calls, Datenverarbeitung) sauber vom UI-Code (Separation of Concerns).

### Abgabe-Spezifikationen
- Eindeutiger App-Name (z.B. `at.ac.univie.hci.MyA2App`).
- **Dateiname:** `<Matrikelnummer>_<Nachname>_A2.zip` (gesamtes Projekt im Root-Folder).
- **React Native:** `node_modules` vor Abgabe löschen, `.apk`-Datei in einem Ordner namens `App` beilegen.
- **Android:** Gesamten Projektordner abgeben.
- **README.md (Verpflichtend!):** Muss die Softwarearchitektur, Design-Entscheidungen, das genutzte API-Level und Hinweise zur Ausführung enthalten.

---

## 2. Angewandte Design-Prinzipien & Usability (15% der Note)
*Basierend auf den Vorlesungen "Usability Heuristics" und "Design Principles".*

### A. Sichtbarkeit & Feedback (Visibility of System Status)
- **Loading States:** Zeige Lade-Indikatoren (Spinner, Skeleton-Screens) an, während Daten von der API geladen werden.
- **Feedback:** Gib dem Nutzer sofortige visuelle Rückmeldung auf Aktionen (z.B. Button ändert beim Antippen leicht die Farbe; Toast-Message bei erfolgreichem Filter).

### B. Fehlervermeidung & Recovery (Error Prevention & Recovery)
- **Fehlerbehandlung (API):** Wenn die API nicht erreichbar ist, darf die App nicht abstürzen. Zeige eine nutzerfreundliche Fehlermeldung an (z.B. "Verbindung zum Museumsserver fehlgeschlagen. Bitte versuchen Sie es erneut.") und biete einen "Retry"-Button.
- **Fallback-Bilder:** Wenn die API kein Bild liefert, zeige ein ansprechendes Platzhalter-Bild (Placeholder) an.

### C. Konsistenz & Standards (Consistency)
- **Layout:** Verwende ein striktes Grid-System (Raster) auf allen Seiten. Margins (Außenabstände) und Paddings (Innenabstände) müssen überall identisch sein (z.B. immer 16dp am Bildschirmrand).
- **Icons & Sprache:** Nutze etablierte Metaphern (Lupe für Suche, Pfeil nach links für "Zurück", Hamburger-Icon für Menüs). *Match between system and real world.*

### D. Ästhetik & Minimalismus (Aesthetic and Minimalist Design)
- **Farben:** Beschränke dich auf eine Primärfarbe, eine Sekundärfarbe und eine neutrale Hintergrundfarbe. Lass den Kunstwerken den visuellen Vorrang.
- **Typografie:** Halte dich an Typografie-Skalen (wie in der Vorlesung erwähnt: *designcode.io/typographic-scales*). Nutze klare visuelle Hierarchien: H1 für Seitentitel, H2 für Kunstwerktitel, Body-Text für Beschreibungen.
- **Accessibility:** Achte auf ausreichenden Farbkontrast (z.B. graue Schrift auf weißem Grund muss lesbar sein) und füge Alt-Texte für Screenreader hinzu.

---

## 3. Best Practices für die 3 App-Komponenten

### Komponente 1: Startseite / Landing Page (15% der Note)
- **Klarer Titel:** Der Name der App oder "Art Institute of Chicago" muss deutlich und attraktiv am oberen Bildschirmrand platziert sein.
- **Navigation:** Implementiere eine konsistente Navigation (z.B. Bottom Navigation Bar oder Top Bar). Die aktive Seite muss **visuell hervorgehoben** sein (z.B. farbiges Icon oder Unterstrich).
- **Suchleiste:** Muss sofort ins Auge springen (Freitextsuche).
- **Filter-System:** - Mindestens 3 Filter (z.B. Künstler, Medium, Abteilung).
  - **Verpflichtend:** Ein Filter nach Zeitspanne / Erstellungsjahr.
  - Optische Hervorhebung: Wenn ein Filter aktiv ist, muss der Nutzer dies deutlich sehen (z.B. Filter-Button erhält eine Hintergrundfarbe, Chips-Design).

### Komponente 2: Suchresultate / API Integration (30% der Note)
- **Dynamische Liste:** Anzeige der Suchergebnisse in einer Scroll-Liste (z.B. FlatList oder RecyclerView).
- **Card-Design:** Jedes Kunstwerk sollte als "Karte" dargestellt werden, die zumindest das (skalierte) Bild und den Titel enthält.
- **States Management:** Implementiere und designe drei klar unterscheidbare Zustände:
  1. *Loading State* (Spinner, während gesucht wird).
  2. *Error State* (z.B. "Keine Kunstwerke zu diesem Filter gefunden").
  3. *Success State* (Die Liste der Bilder).

### Komponente 3: Detailseite (15% der Note)
- **Erreichbarkeit:** Von der Suchliste durch Klick auf ein Kunstwerk erreichbar (sichere eine "Zurück"-Navigation -> *User Control and Freedom*).
- **Strukturierter Inhalt:** Zeige Bild, Titel, Jahr, Künstler, Medium, Dimensionen und Beschreibung strukturiert an. Nutze ein klares Grid-System (z.B. links Label, rechts Wert; oder Label in Grau über dem Wert).
- **Zoom-Funktion:** Das Bild muss interaktiv zoombar sein (Pinch-to-Zoom).

---

## 4. Checkliste für die finale Abgabe

- [ ] App lässt sich ohne Fehler im Emulator (Pixel 6, API 27-36) kompilieren.
- [ ] Suchfunktion über die Art Institute of Chicago API funktioniert.
- [ ] Mindestens 3 Filter eingebaut, einer davon ist das "Jahr/Zeitspanne".
- [ ] Aktive Filter sind optisch (farblich/durch Rahmen) hervorgehoben.
- [ ] Navigation ist einheitlich, die aktuell aktive Ansicht ist markiert.
- [ ] Grid-System ist erkennbar (Abstände sind einheitlich).
- [ ] Farben (Primär, Sekundär, Hintergrund) sind definiert und konsistent eingesetzt (Design Tokens).
- [ ] Typografie folgt einer festen Skala, gute Lesbarkeit/Kontraste.
- [ ] Ladezustände (Spinner) und Fehlermeldungen (Netzwerkfehler, keine Suchtreffer) sind implementiert.
- [ ] Detailseite zeigt alle geforderten Infos und das Bild ist zoombar.
- [ ] Code ist aufgeräumt, formatiert und auf Englisch oder Deutsch sinnvoll kommentiert.
- [ ] `.zip` Datei korrekt benannt (`<Matrikelnummer>_<Nachname>_A2.zip`).
- [ ] `README.md` mit Softwarearchitektur und API-Level Infos liegt bei.