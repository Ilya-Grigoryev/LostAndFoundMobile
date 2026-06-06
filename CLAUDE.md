# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Vienna Lost & Found** — a mobile-first app for reporting and recovering lost items in Vienna. HCI university course project (Gruppe 3), currently at **M3: High-fidelity prototype**.

Team: Denis Popov, Ilia Grigorev, Arseniy Akopov, Ivan Muzalevskii.

The app connects two primary user groups:
- **Losers** (people who lost something) — stressed, need fast reporting with imprecise location support
- **Finders** (people who found something) — in a hurry, need ultra-minimal flow (ideally <30s)

Secondary: **Tourists/expats** — multilingual, no Austrian phone number, guest mode.

## M3 Requirements

- Compilable app targeting **Pixel 6, API level 27–36**
- **React Native**: exclude `node_modules`, include `.apk` in a folder named `App`
- **Android native**: submit entire project folder
- Must include `README.md` with software architecture, design decisions, API level, and run instructions
- Submission format: `M3_Gruppe_Team_Thema.zip`
- Non-compilable prototype: up to 75% grade deduction; messy code: up to 10% deduction

## Core Features (from M1/M2)

1. **Report lost item** — category picker, flexible map location (pin+radius / step-by-step by district / route drawing / exact address), push notification opt-in
2. **Report found item** — one-click photo, auto GPS, nearest Fundbox shown on map
3. **Quick finder flow** — camera + GPS only, no form fields, "leave & mark" vs "bring to Fundbox", entire flow under 30 seconds
4. **Smart Fundbox system** — show nearest box, route to it, confirm drop-off in app, verification code for pickup
5. **Multilingual UI** — language picker on first launch, English required; guest registration (name + email only)
6. **Matching & notifications** — push alerts when a found item matches an active lost report

## Design Principles (from M1 analysis)

- **Minimalist, trust-building UI**: only show what's relevant for the current step; stressed users miss small text and complex navigation
- **Design tokens**: define `primaryColor`, `secondaryColor`, `backgroundColor`, spacing (`spacingSmall = 8dp`, `spacingMedium = 16dp`) as constants — never hardcode colors or sizes inline
- **Consistent grid**: 16dp screen margins everywhere
- **Three states for every async operation**: loading (spinner/skeleton), error (friendly message + retry), success
- **Imprecise location is a first-class feature**: users often remember a route, not an address — all four location input modes must work
- **Legitimize "leave it and mark it"**: finders who can't physically bring the item should be encouraged to at least log GPS + photo

## Architecture Decisions (from M2 prototypes)

The four low-fi prototypes map to distinct flows that should remain separable in code:

| Prototype | Flow | Key screen(s) |
|---|---|---|
| P1 | Full claim cycle with Smart Fundbox | Fund melden → Fundbox finden → Anspruch erheben → Verifizierung |
| P2 | Ultra-fast finder (no form) | Home big button → Camera+GPS → "Liegen lassen" vs "Fundbox" → Confirmation |
| P3 | Flexible location input | Mode picker → Pin+Radius / Schritt-für-Schritt / Route zeichnen / Adresse |
| P4 | Tourist onboarding | Language picker → Guest registration → Visual hints |

Separate UI code from data/API logic (Separation of Concerns). API calls, matching logic, and location services belong outside view components.

## Code Standards

- Class, variable, and method names in **English**
- Comment complex logic, API calls, and non-obvious design decisions; omit obvious comments
- Sinnvolle (meaningful) names: e.g., `ReportFoundItemScreen`, `fetchNearestFundbox`, `LocationPickerMode`
