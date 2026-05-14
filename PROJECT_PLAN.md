# Master Plan — M3 Vienna Lost & Found

Мастер-план реализации прототипа. Каждая фаза = самостоятельный блок.

**Правило работы:** не начинать фазу N+1, пока не закрыт acceptance criteria фазы N. Исключение — Phase 9, можно начать параллельно с Phase 8.

---

## Входные данные

- [x] Gruppe: **3**
- [x] Team: Denis Popov, Ilia Grigorev, Arseniy Akopov, Ivan Muzalevskii
- [x] Target: **Pixel 6, API level 27–36**
- [x] Framework: **Expo SDK 54 (Managed), React Native 0.81, TypeScript**
- [x] Mock backend: **dummyjson.com** (lost/found reports через Products API, matching — локально)
- [x] Submission format: `M3_Gruppe_Team_Thema.zip`
- [x] Эстетическое направление: **Clean Austrian Modernism** (см. ниже)

### Clean Austrian Modernism — направление для Phase 1

Вена — город практичной красоты. Wiener Werkstätte, Secession, Loos. UI должен внушать доверие растерянному человеку и не отвлекать спешащего. Никакой декоративности ради декоративности.

**Визуальный язык:**

- **Палитра двойного назначения:**
  - Loser-флоу (стресс, тревога): тёплый тёмно-синий `#1B4F7B` — ассоциируется с порядком и надёжностью
  - Finder-флоу (спешка, нет времени): насыщенный бирюзовый `#2A9D8F` — ощущение завершения, "всё окей"
  - Фон: `#F8F9FA`, поверхности: `#FFFFFF`, текст: `#1D2B3A`, ошибки: `#E63946`
- **Типографика:** системный шрифт платформы (Roboto на Android) — не подгружать доп. шрифты
- **Формы:** скругления 12dp на карточках, 8dp на инпутах, 24dp на основных CTA-кнопках
- **Grid:** 16dp screen margins везде, 8dp между элементами внутри блока

**Чего избегать:** мелкий текст, сложные анимации, больше 2-х действий на экране.

---

## Команда & параллельная разработка

Четыре прототипа M2 → четыре разработчика. Каждый владеет своим флоу: экраны + компоненты + навигатор.

| Разработчик | Ветка | Флоу | Phases |
| --- | --- | --- | --- |
| **Ilia** | `feature/foundation` | Foundation + Fundbox (P1) | 0 ✅, 1, 2, 4, 7, 10 |
| **Denis** | `feature/onboarding` | Onboarding + Matching (P4 + P8) | 3, 8 |
| **Arseniy** | `feature/finder-flow` | Quick Finder (P2) | 5 |
| **Ivan** | `feature/loser-flow` | Loser + Location (P3) | 6 |

**Ilia делает foundation первым** — это блокер для всех. После merge `feature/foundation` → `master` все три ветки стартуют одновременно.

### Git: структура веток

```text
master                       ← всегда компилируемый, только через PR
  │
  ├── feature/foundation      ← Ilia (Phase 1 + 2 + 4) — блокер
  │       ↓ merge → master
  │
  ├── feature/onboarding      ← Denis   (Phase 3 + 8)
  ├── feature/finder-flow     ← Arseniy (Phase 5)
  ├── feature/loser-flow      ← Ivan    (Phase 6)
  └── feature/fundbox-flow    ← Ilia    (Phase 7)
```

**Правила:**

1. `master` — только через Pull Request, минимум 1 аппрув
2. Перед PR: `npx tsc --noEmit` без ошибок
3. Rebase ветки на `master` перед PR (не merge commit)
4. Коммит-конвенция: `feat(finder): add camera screen`, `fix(loser): map zoom`

### Папки: кто чем владеет

```text
src/
├── components/
│   ├── ui/               ← Ilia only (Button, Card, Input, Chip…)
│   ├── camera/           ← Arseniy
│   ├── location/         ← Ivan
│   └── fundbox/          ← Ilia
├── screens/
│   ├── onboarding/       ← Denis
│   ├── finder/           ← Arseniy
│   ├── loser/            ← Ivan
│   └── fundbox/          ← Ilia
├── services/
│   ├── api.ts            ← Ilia (dummyjson wrapper, shared)
│   ├── matchingService.ts ← Denis
│   └── locationService.ts ← Ivan
├── constants/
│   └── theme.ts          ← Ilia only
└── navigation/
    ├── RootNavigator.tsx      ← Ilia
    ├── OnboardingNavigator.tsx ← Denis
    ├── FinderNavigator.tsx     ← Arseniy
    ├── LoserNavigator.tsx      ← Ivan
    └── FundboxNavigator.tsx    ← Ilia
```

### Точки интеграции (потенциальные конфликты)

| Файл | Решение |
| --- | --- |
| `RootNavigator.tsx` | Ilia создаёт stub-импорты заранее; каждый реализует только свой navigator-файл |
| `package.json` | Договариваться в чате перед `npm install`; конфликт в `package-lock.json` решается `npm install` после merge |
| `src/constants/strings.ts` | Ключи по namespace: `finder.*`, `loser.*`, `onboarding.*`, `fundbox.*` |

### Минимальный контракт foundation → остальные

После merge `feature/foundation` каждый получает:

- `src/components/ui/` — Button, Card, Input, Chip, ErrorState, LoadingSpinner готовы к использованию
- `src/constants/theme.ts` — все цвета и отступы (только через токены, не менять без PR)
- `src/services/api.ts` — обёртка над dummyjson.com
- `RootNavigator.tsx` — со stub-экранами `<View>` на месте каждого флоу; каждый заменяет свой stub своим navigator

---

## Phase 0 — Foundation ✅ (выполнено)

**Что сделано:**

- Expo SDK 54, TypeScript, `blank-typescript` template
- Структура папок: `src/{screens,components,services,constants,hooks,types}`
- `src/constants/theme.ts` — базовые дизайн-токены
- `.gitignore` настроен, `app.json` с правильным именем

---

## Phase 1 — Design System ✅ (выполнено)

**Что сделано:**

- `src/theme/` — токены разбиты по файлам: `colors.ts`, `typography.ts`, `spacing.ts`, `radii.ts`; экспортируются через `index.ts`
- Палитра: `loserPrimary` (#C8654B), `finderPrimary` (#D4A02C), фон `#F5F1E8`, все состояния (pressed, light, error, success, disabled)
- Типографика: Archivo Black (hero/h1) + Manrope 400–800 (body → label → button); загружается через `expo-google-fonts`
- `Button` — варианты `primary` / `secondary` / `ghost`, spring-анимация нажатия, arrow-slot, `loading` и `disabled` состояния
- `Card` — Bauhaus: острые углы, `bordered` вариант
- `TextInput` — `label`, `error`, `leftIcon`, анимированная граница при фокусе
- `Chip` — для категорий
- `LoadingSpinner`, `ErrorState` (сообщение + retry), `EmptyState`
- `ScreenHeader` — back-кнопка, title, правый action, цветная точка
- `Geo` — геометрические примитивы (Circle, Square, Semicircle, Bar, DotRow) для визуального языка
- `src/screens/dev/ComponentsShowcase.tsx` — тестовый экран (удалить перед Phase 10)
- Ни один цвет/отступ не прописан inline — только через токены

---

## Phase 2 — Navigation & App Shell ✅ (выполнено)

**Что сделано:**

- Установлены пакеты: `@react-navigation/native`, `@react-navigation/native-stack`, `react-native-screens`, `react-native-safe-area-context`, `@react-native-async-storage/async-storage`
- `src/navigation/types.ts` — типы `RootStackParamList`, `OnboardingStackParamList`, `MainStackParamList`
- `RootNavigator` — читает флаг `@onboarding_complete` из AsyncStorage, роутит на `OnboardingNavigator` или `MainNavigator`; показывает `LoadingSpinner` во время проверки
- `OnboardingNavigator` — stack с `LanguagePickerScreen` → `GuestRegistrationScreen` (stub, Denis заменит в Phase 3)
- `MainNavigator` — stack с `HomeScreen` + три слота для флоу
- `FinderNavigator`, `LoserNavigator`, `FundboxNavigator` — stubs (Arseniy / Ivan / Ilia заменят в своих ветках)
- `GuestRegistrationScreen` устанавливает флаг и сбрасывает стек на `Main`
- `App.tsx` обёрнут в `SafeAreaProvider` → `NavigationContainer` → `RootNavigator`
- `npx tsc --noEmit` — 0 ошибок

---

## Phase 4 — Home Screen ✅ (выполнено)

**Цель:** главный экран с двумя первичными действиями.

**Deliverables:**

- `HomeScreen`:
  - Два больших CTA-блока на весь экран:
    - **"Ich habe etwas verloren"** — цвет `loserPrimary`
    - **"Ich habe etwas gefunden"** — цвет `finderPrimary`
  - Каждый блок: иконка + заголовок + hint (одна строка)
  - Хедер: название приложения + кнопка смены языка

**Acceptance criteria:**

- Оба CTA ведут в нужный флоу
- На Pixel 6 оба блока видны без скролла

**Зависимости:** Phase 2

---

## Phase 3 — Onboarding Flow (P4) — Denis

**Цель:** первый запуск — выбор языка и минимальная регистрация.

**Deliverables:**

- `LanguagePickerScreen`: English / Deutsch, большие tap-таргеты, сохранить в AsyncStorage
- `GuestRegistrationScreen`: только `name` + `email`, кнопка "Weiter als Gast", валидация email
- `LocalizationContext` — React Context + `src/constants/strings.ts` (EN + DE), ключи по namespace `onboarding.*`
- После завершения: сохранить `@onboarding_complete`, перейти на HomeScreen

**Acceptance criteria:**

- Выбор языка сразу меняет текст на следующем экране
- После перезапуска приложение стартует с HomeScreen (onboarding пропущен)

**Зависимости:** Phase 2 (foundation merged)

---

## Phase 5 — Quick Finder Flow (P2) — Arseniy

**Цель:** finder снимает фото и уходит за ≤30 секунд. Никаких форм.

**Deliverables:**

- `CameraGpsScreen`: полноэкранный превью (`expo-camera`), GPS фоново (`expo-location`), одна кнопка съёмки
- `FinderChoiceScreen`: два блока на весь экран — "Liegen lassen & markieren" / "Zur Fundbox bringen"; мини-карта с маркером позиции (`react-native-maps`)
- `FinderConfirmationScreen`: превью фото + координаты + timestamp; кнопка "Fertig" → Home
- Mock: сохранять репорт локально (AsyncStorage)

**Acceptance criteria:**

- Весь флоу проходим за ≤30 секунд
- При отказе разрешений на камеру/геолокацию — дружелюбный ErrorState, не краш
- Фото реально делается и видно в превью

**Зависимости:** Phase 2 (foundation merged)

**Пакеты:** `expo-camera`, `expo-location`, `react-native-maps`

---

## Phase 6 — Report Lost Item Flow (P3) — Ivan

**Цель:** loser указывает место потери в любом удобном формате — ключевая UX-инновация.

**Deliverables:**

- `CategoryPickerScreen`: сетка иконок — Rucksack, Schlüssel, Geldbörse, Handy, Dokumente, Fahrrad, Sonstiges
- `LocationPickerScreen` — 4 режима, переключаемые вкладками:
  1. **Pin + Radius** — карта, маркер + слайдер радиуса (50m–500m)
  2. **Schritt-für-Schritt** — Bezirk (1.–23.) из списка → улица → ориентир
  3. **Route zeichnen** — polyline пальцем на карте
  4. **Genaue Adresse** — текстовый поиск (mock autocomplete)
  - Каждый режим — отдельный компонент в `src/components/location/`
- Push notification opt-in после выбора локации (`expo-notifications`, только если Ja)
- `LoserConfirmationScreen`: резюме категории + локации + мини-карта; кнопка "Melden"

**Acceptance criteria:**

- Все 4 режима переключаются, данные сохраняются при возврате
- Pin+Radius: маркер перетаскивается, радиус меняется слайдером
- Отказ от уведомлений не блокирует флоу

**Зависимости:** Phase 2 (foundation merged); `react-native-maps` уже будет из Phase 5

---

## Phase 7 — Smart Fundbox Flow (P1) — Ilia

**Цель:** finder приносит вещь к Fundbox — полный цикл до верификации.

**Deliverables:**

- `FundboxMapScreen`: карта с 5 mock-Fundbox точками (hardcoded Vienna координаты); ближайшая выделена; callout с адресом
- `FundboxRouteScreen`: mock polyline маршрута + расчётное время пешком; кнопка "Ich bin angekommen"
- `DropOffConfirmScreen`: чекбоксы "Item gelegt" + "Box geschlossen"; кнопка "Bestätigen"
- `VerificationCodeScreen`: random 6-значный код; кнопка "Fertig" → Home
- `ClaimScreen` (для loser): фото найденного + данные Fundbox + поле ввода кода; любые 6 цифр → "Match bestätigt!"

**Acceptance criteria:**

- Ближайшая Fundbox выделена при открытии FundboxMapScreen
- Код отличается при каждом drop-off
- P1-флоу проходим от начала до "Match bestätigt"

**Зависимости:** Phase 5 (react-native-maps уже подключён)

---

## Phase 8 — Matching Simulation — Denis

**Цель:** показать matching — пусть и симулированно.

**Deliverables:**

- `src/services/matchingService.ts`: `simulateMatch(foundReport, lostReports[])` — match если категория совпадает
- `src/services/api.ts` (дополнить): использовать dummyjson.com `/products` как хранилище lost reports (category = категория вещи)
- Локальное push-уведомление через 3 секунды после drop-off (`expo-notifications`): "Mögliche Übereinstimmung! Dein [категория] könnte gefunden worden sein."

**Acceptance criteria:**

- После drop-off через ~3 секунды приходит уведомление
- При отказе от уведомлений приложение не падает

**Зависимости:** Phase 7

**Пакеты:** `expo-notifications`

---

## Phase 9 — Polish & Multilingual

**Цель:** всё проверить и подчистить перед сдачей.

**Deliverables:**

- 16dp margins audit — все экраны
- Все кнопки ≥ 48dp высотой
- Все async-действия: loading / error (с retry) / success
- Полный перевод UI строк (EN + DE) через `LocalizationContext`
- `npx tsc --noEmit` — 0 ошибок, 0 Metro warnings
- Ревизия через `/simplify`

**Acceptance criteria:**

- Компилируется и запускается на Pixel 6 (API 36) без крашей
- Нет hardcoded строк в UI

**Зависимости:** Phase 8

---

## Phase 10 — Documentation & Submission — Ilia

**Цель:** сдать в правильном формате.

**Deliverables:**

- `README.md`: описание, архитектура (4 флоу + структура), design decisions, API level 36, run instructions (`npm install && npx expo start --android`)
- APK: `eas build -p android --profile preview` → скачать → положить в `App/`
- Архив без `node_modules/`:

```text
M3_Gruppe3_LostAndFound.zip
├── App/
│   └── vienna-lost-and-found.apk
├── README.md
├── App.tsx
├── src/
└── …
```

**Acceptance criteria:**

- Zip по шаблону `M3_Gruppe_Team_Thema.zip`
- APK устанавливается и запускается на Pixel 6
- `node_modules/` отсутствует в архиве

**Зависимости:** Phase 9

---

## Cross-cutting checklist (проверять на каждой фазе)

- [ ] Имена компонентов/хуков/функций — на английском
- [ ] Цвета и отступы — только через токены
- [ ] Separation of Concerns: UI ≠ сервис ≠ данные
- [ ] Каждый экран: loading / error / success

---

## Code Minimalism Rule

**Меньше кода → лучше оценка.** Проект оценивается за дизайн и читаемость, не за объём.

- Не вводить абстракции "на будущее"
- Не дублировать валидацию TypeScript вручную
- Не плодить компоненты-обёртки без причины
- Нет TODO в финальном коде
- После каждой фазы: `/simplify`

---

## Dependency DAG

```text
Phase 0 ✅
  └─> Phase 1 (Design System — Ilia)
        └─> Phase 2 (Navigation — Ilia)
              └─> Phase 4 (Home — Ilia)
                    ├─> Phase 3 (Onboarding — Denis)    ┐
                    ├─> Phase 5 (Finder — Arseniy)       │ параллельно
                    ├─> Phase 6 (Loser — Ivan)           │
                    └─> Phase 7 (Fundbox — Ilia)        ┘
                          └─> Phase 8 (Matching — Denis)
                                └─> Phase 9 (Polish — все)
                                      └─> Phase 10 (Submission — Ilia)
```

---

## Библиотеки (планируемые)

| Библиотека | Зачем | Phase |
| --- | --- | --- |
| `@react-navigation/native` + `native-stack` | Навигация | 2 |
| `react-native-screens` | Нативные экраны | 2 |
| `react-native-safe-area-context` | Safe area insets | 2 |
| `@react-native-async-storage/async-storage` | Onboarding flag, local mock store | 2 |
| `react-native-maps` | Карта в Finder / Loser / Fundbox | 5 |
| `expo-camera` | Фото для Finder | 5 |
| `expo-location` | GPS | 5 |
| `expo-notifications` | Push для matching | 8 |

---

Следующий шаг: **Phase 1** — расширить design system и создать базовые UI компоненты.
