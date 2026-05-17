## Readme - M3

* Gruppe: 3
* Team-Nr.: 306
* Projektthema: Vienna Lost & Found


### Implementierung

Framework: React Native (Expo, TypeScript)

API-Version: Android API Level 27–36

Gerät(e), auf dem(denen) getestet wurde:

- Pixel 6 (Android 14, API 36) - Emulator

Das fertige .apk liegt unter App/LostAndFound.apk

Externe Libraries und Frameworks:
- @react-navigation/native
- @react-navigation/native-stack
- @react-native-async-storage/async-storage
- @react-native-community/slider
- react-native-screens
- react-native-safe-area-context
- react-native-maps
- @expo/vector-icons
- @expo-google-fonts/archivo-black
- @expo-google-fonts/manrope
- expo-camera
- expo-location
- expo-notifications
- expo-font

Dauer der Entwicklung:
- ca. 2-3 Wochen

Weitere Anmerkungen:

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