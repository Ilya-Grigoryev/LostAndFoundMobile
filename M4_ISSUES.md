# M4 — Issue Backlog (Usability Findings → Tickets)

Vienna Lost & Found · Gruppe 3 · Milestone M4

This backlog consolidates the findings from the M4 usability study into actionable
tickets. Each ticket links the observed problem to the affected code and a proposed
fix, so the team can implement the improvements and reference them in the final
report (Evaluation → Design implications).

Source: `docs/Usability_Test_Protocol_Template.docx` (participants **P1–P8**;
P4 and P6 task sections were not completed but added no new findings).

## How to read this file

- **Evidence (P#)** — which participants reported the issue. More participants =
  stronger triangulation = higher confidence the problem is real.
- **Severity** — impact on the user when it occurs (Low / Medium / High).
- **Priority** — order we tackle it in M4 (High = do now, Low = nice-to-have).
- **Status** — `Open` until implemented, then `Done` (note the commit).

## Summary

| ID | Title | Evidence | Severity | Priority | Status |
|----|-------|----------|----------|----------|--------|
| [ISSUE-01](#issue-01--fundbox-decision-is-not-explained) | Fundbox decision ("leave & mark" vs "bring to Fundbox") not explained | P1, P3, P5, P7, P8 | Medium | **High** | Open |
| [ISSUE-02](#issue-02--match-screen-shows-too-few-details-before-confirming-ownership) | Match screen shows too few details before confirming ownership | P5, P7, P8 | High | **High** | Open |
| [ISSUE-03](#issue-03--cannot-edit-a-report-after-submitting) | Cannot edit a report after submitting | P3, P8 | Medium | **High** | Open |
| [ISSUE-04](#issue-04--pickup-code-process-is-unclear) | Pickup-code process is unclear (where/when it appears) | P5, P8, P7 | Medium | Medium | Open |
| [ISSUE-05](#issue-05--cannot-delete-a-report-or-mark-it-as-resolved) | Cannot delete a report or mark it resolved | P2 | Medium | Medium | Open |
| [ISSUE-06](#issue-06--inconsistent-color-coding-on-match-cards) | Inconsistent color coding on match cards (yellow) | P5 | Medium | Medium | Open |
| [ISSUE-07](#issue-07--keyboard-covers-the-action-button-on-some-input-screens) | Keyboard covers the action button on some input screens | P2, P8 | Medium | Medium | Open |
| [ISSUE-08](#issue-08--lost-item-description-is-not-required) | Lost-item description is not required (weak matching) | P2, P8 | Medium | Medium | Open |
| [ISSUE-09](#issue-09--hardcoded-german-labels-do-not-translate) | Hardcoded German labels do not translate ("Ziel", "Treffer") | P7 | Low | Low | Open |
| [ISSUE-10](#issue-10--no-free-text-location-note) | No free-text location note ("near the U4 entrance") | P2, P7 | Low | Low | Open |
| [ISSUE-11](#issue-11--action-button-visually-clipped-on-report-lost-item) | Action button visually clipped on Report Lost Item screen | P1 | Low | Low | Open |
| [ISSUE-12](#issue-12--route-zeichnen-mode-unclear-whether-optional) | "Route zeichnen" mode — unclear whether optional | P5 | Low | Low | Open |
| [ISSUE-13](#issue-13--fundbox-custody--code-model-is-incorrect) | Fundbox custody / code model is incorrect (finder gets owner's pickup code) | P5, P8, Arseniy | High | **High** | Open |

---

## High priority

### ISSUE-01 — Fundbox decision is not explained
- **Evidence:** P1, P3, P5, P7, P8 (5/6 participants)
- **Severity:** Medium · **Priority:** High · **Status:** Open

**Problem.** On the finder action-choice screen users must choose between leaving
the item where it is ("leave & mark") and bringing it to a Fundbox. There are two
distinct gaps:
1. **Consequences of each choice are unclear** (local users, P3/Ivan): the labels are
   understandable, but it is not clear *what happens after* picking each option.
2. **The Fundbox concept itself is unknown** to non-locals (tourist, P7): they don't
   know what a Fundbox is in the first place.

**Affected code.**
- [src/screens/finder/FinderChoiceScreen.tsx](src/screens/finder/FinderChoiceScreen.tsx)
- [src/screens/fundbox/FundboxRouteScreen.tsx](src/screens/fundbox/FundboxRouteScreen.tsx)

**Proposed fix.** On the two-button screen, add a short explanatory line under each
option describing the resulting path:
- *Leave item at location* → "We mark the exact spot and notify the owner so they can
  pick it up there."
- *Bring to Fundbox* → "Follow the route to the nearest Fundbox, drop the item off,
  and get a pickup code — the owner is notified automatically."

Additionally add a short "What is a Fundbox?" hint for first-time / non-local users.
New strings go in [src/constants/strings.ts](src/constants/strings.ts) (en + de).

---

### ISSUE-02 — Match screen shows too few details before confirming ownership
- **Evidence:** P5, P7, P8
- **Severity:** High · **Priority:** High · **Status:** Open

**Problem.** Before pressing "This is my item" the possible-match screen shows only
the category and place. Users expected a real photo and a description to judge
whether the item is actually theirs; the photo area is currently a placeholder.

**Affected code.**
- [src/screens/fundbox/PossibleMatchScreen.tsx](src/screens/fundbox/PossibleMatchScreen.tsx)

**Proposed fix.** Render the found item's photo, description, category, location and
report time on the match screen so the user can make an informed decision before
confirming ownership.

---

### ISSUE-03 — Cannot edit a report after submitting
- **Evidence:** P3, P8
- **Severity:** Medium · **Priority:** High · **Status:** Open

**Problem.** After submitting a lost-item report users wanted to update it but the
activity history only opens a read-only detail view — there is no "Edit" action.
Example (Ivan): the user remembers a new detail about the lost headphones and wants to
change the description or the location.

**Affected code.**
- [src/screens/activity/ActivityHistoryScreen.tsx](src/screens/activity/ActivityHistoryScreen.tsx)
- [src/components/activity/ActivityItemCard.tsx](src/components/activity/ActivityItemCard.tsx)
- [src/components/activity/ActivityDetailModal.tsx](src/components/activity/ActivityDetailModal.tsx)

**Proposed fix.** Add a small **edit (pencil) icon in the corner of the report card**
in the activity history (and/or an "Edit report" action in the detail modal) that
reopens the report form pre-filled with the existing values, so the user can update
the description or location.

---

### ISSUE-13 — Fundbox custody / code model is incorrect
- **Evidence:** P5, P8 (code confusion) + Arseniy (design review)
- **Severity:** High · **Priority:** High · **Status:** Open

**Problem.** The current implementation gives the **finder** the owner's pickup code
and tells them to "share this code with the owner" — see
[DropOffSuccessScreen.tsx:79-86](src/screens/fundbox/DropOffSuccessScreen.tsx#L79-L86)
(`fundbox.success.codeLabel` = "Pickup code", `fundbox.success.codeHint` = "Share this
code with the owner…") and the owner side
[strings.ts:59](src/constants/strings.ts#L59) ("Enter the pickup code from the
finder"). This is the wrong custody model: it leaks the claim code through the finder
and is why participants found the code step confusing (ISSUE-04).

**Target model (correct flow).**

```text
Finder deposits item  → gets a DROP-OFF confirmation only (e.g. "Deposit ID: FND-20491",
                         "The owner will be notified automatically") — NOT a pickup code
        ↓
System stores the item in the Fundbox and locks the compartment
        ↓
Lost user receives a possible match
        ↓
Lost user proves ownership (verification)
        ↓
System RELEASES the pickup code to the owner (e.g. "Pickup code: 032-661,
                         valid until 08.06.2026 18:00, Fundbox: Stephansplatz")
        ↓
Owner opens the assigned compartment with the code (compartment number hidden in advance)
```

Key rules: the finder never sees the pickup code; the pickup code is generated for the
owner only after verification; the owner does not see the compartment number ahead of
time (prevents targeting a specific compartment).

**Affected code.**
- [src/screens/fundbox/DropOffSuccessScreen.tsx](src/screens/fundbox/DropOffSuccessScreen.tsx) — replace "Pickup code / share with owner" with a drop-off confirmation (Deposit ID, "owner will be notified").
- [src/screens/fundbox/DropOffConfirmScreen.tsx](src/screens/fundbox/DropOffConfirmScreen.tsx)
- [src/screens/fundbox/ClaimScreen.tsx](src/screens/fundbox/ClaimScreen.tsx) — the pickup code is released by the system after verification, not "entered from the finder".
- [src/screens/fundbox/PossibleMatchScreen.tsx](src/screens/fundbox/PossibleMatchScreen.tsx)
- [src/constants/strings.ts](src/constants/strings.ts) — rework `fundbox.success.*` and `fundbox.claim.*` strings (en + de).

**Prototype scope.** The physical part (compartment sensors: "box closed = true",
"compartment occupied = true") is **simulated with the existing confirm buttons** — no
real hardware. The "Fundbox is one connected service (App → Backend/Matching →
Fundbox network → compartments)" framing belongs in the **report's architecture
section**, not in code.

**Related:** supersedes the clarity-only [ISSUE-04](#issue-04--pickup-code-process-is-unclear);
depends on [ISSUE-02](#issue-02--match-screen-shows-too-few-details-before-confirming-ownership)
(verification before code release).

---

## Medium priority

### ISSUE-04 — Pickup-code process is unclear
- **Evidence:** P5, P8 (P7 related)
- **Severity:** Medium · **Priority:** Medium · **Status:** Open

> **Note:** this is the UI-clarity half of the problem; the underlying custody model
> is reworked in [ISSUE-13](#issue-13--fundbox-custody--code-model-is-incorrect). Once
> ISSUE-13 is done, this ticket reduces to wording/affordance polish.

**Problem.** After confirming a match it is not clear where or when the pickup code
is generated or how it is used to claim the item.

**Affected code.**
- [src/screens/fundbox/ClaimScreen.tsx](src/screens/fundbox/ClaimScreen.tsx)
- [src/screens/fundbox/ClaimSuccessScreen.tsx](src/screens/fundbox/ClaimSuccessScreen.tsx)
- [src/screens/fundbox/PossibleMatchScreen.tsx](src/screens/fundbox/PossibleMatchScreen.tsx)

**Proposed fix.** Add explanatory copy describing when the code appears and what to
do with it; surface the code prominently on the claim/success step.

---

### ISSUE-05 — Cannot delete a report or mark it as resolved
- **Evidence:** P2
- **Severity:** Medium · **Priority:** Medium · **Status:** Open

**Problem.** Users cannot delete a report or mark it as resolved once they have
recovered the item, so the activity history fills with stale entries.

**Affected code.**
- [src/screens/activity/ActivityHistoryScreen.tsx](src/screens/activity/ActivityHistoryScreen.tsx)
- [src/components/activity/ActivityDetailModal.tsx](src/components/activity/ActivityDetailModal.tsx)

**Proposed fix.** Add "Delete" and "Mark as resolved" actions in the detail modal.
Can share the action UI with ISSUE-03.

---

### ISSUE-06 — Inconsistent color coding on match cards
- **Evidence:** P5
- **Severity:** Medium · **Priority:** Medium · **Status:** Open

**Problem.** A possible match for a *lost* item is shown in yellow, but yellow is the
finder / Fundbox color elsewhere, so users associate the card with the wrong flow.

**Affected code.**
- [src/components/activity/ActivityItemCard.tsx](src/components/activity/ActivityItemCard.tsx)
- [src/theme/colors.ts](src/theme/colors.ts)

**Proposed fix.** Use the lost-item color family (or a dedicated, clearly-labelled
"match" color) for match cards, consistent with the rest of the loser flow.

---

### ISSUE-07 — Keyboard covers the action button on some input screens
- **Evidence:** P2, P8
- **Severity:** Medium · **Priority:** Medium · **Status:** Open

**Problem.** On some screens the on-screen keyboard covers the primary button, so the
user must dismiss the keyboard before continuing.

**Affected code.** Audit screens with text input that do **not** wrap content in
`KeyboardAvoidingView`. Already handled in
[ClaimScreen.tsx](src/screens/fundbox/ClaimScreen.tsx),
[FinderLocationScreen.tsx](src/screens/finder/FinderLocationScreen.tsx),
[CategoryScreen.tsx](src/screens/loser/CategoryScreen.tsx); check the remaining
input screens (e.g. onboarding guest form).

**Proposed fix.** Wrap input screens in `KeyboardAvoidingView` (or keep the CTA above
the keyboard) consistently across the app.

---

### ISSUE-08 — Lost-item description is not required
- **Evidence:** P2, P8
- **Severity:** Medium · **Priority:** Medium · **Status:** Open

**Problem.** A lost-item report can be submitted without a description for any
category except "Other", which weakens matching because similar items are hard to
distinguish. See `canContinue` in
[CategoryScreen.tsx](src/screens/loser/CategoryScreen.tsx#L37-L38).

**Proposed fix.** Require a short description (or at least strongly prompt for one)
for all categories, not just "Other".

---

## Low priority

### ISSUE-09 — Hardcoded German labels do not translate
- **Evidence:** P7 (new finding)
- **Severity:** Low · **Priority:** Low · **Status:** Open

**Problem.** A few labels are hardcoded in German and stay German even when English is
selected, while the rest of the UI is correctly localized.

**Affected code.**
- `Treffer` → [src/screens/fundbox/ClaimSuccessScreen.tsx:60](src/screens/fundbox/ClaimSuccessScreen.tsx#L60)
- `Ziel` → [src/components/fundbox/RouteStat.tsx:33](src/components/fundbox/RouteStat.tsx#L33)

**Proposed fix.** Route both labels through `t()`/the localization context and add the
missing keys in [strings.ts](src/constants/strings.ts) (`Treffer` can reuse
`fundbox.claim.eyebrow`). **Quick win — one-line-ish fix.**

---

### ISSUE-10 — No free-text location note
- **Evidence:** P2, P7
- **Severity:** Low · **Priority:** Low · **Status:** Open

**Problem.** When marking a location there is no field for extra context such as
"left at the Billa checkout" or "near the U4 entrance".

**Affected code.**
- [src/screens/finder/FinderLocationScreen.tsx](src/screens/finder/FinderLocationScreen.tsx)
- [src/screens/loser/LocationMapScreen.tsx](src/screens/loser/LocationMapScreen.tsx)

**Proposed fix.** Add an optional single-line note field on the location step.

---

### ISSUE-11 — Action button visually clipped on Report Lost Item
- **Evidence:** P1
- **Severity:** Low · **Priority:** Low · **Status:** Open

**Problem.** The bottom action button on the Report Lost Item screen appears clipped
on the left / extends beyond the safe area, looking unfinished.

**Affected code.**
- [src/screens/loser/CategoryScreen.tsx](src/screens/loser/CategoryScreen.tsx)
- [src/components/ui/Button.tsx](src/components/ui/Button.tsx)

**Proposed fix.** Respect safe-area insets and screen margins (16dp grid) on the
bottom button container.

---

### ISSUE-12 — "Route zeichnen" mode unclear whether optional
- **Evidence:** P5
- **Severity:** Low · **Priority:** Low · **Status:** Open

**Problem.** In the location step it is not immediately clear that the different input
modes (pin+radius / step-by-step / route / address) are alternatives, and whether
drawing a route is required or optional.

**Affected code.**
- [src/components/location/SubTabSwitcher.tsx](src/components/location/SubTabSwitcher.tsx)
- [src/screens/loser/LocationModeScreen.tsx](src/screens/loser/LocationModeScreen.tsx)

**Proposed fix.** Add a short hint clarifying that the modes are alternatives and all
optional ways to describe the same location.

---

## Notes for the final report

- **Triangulation:** ISSUE-01 (Fundbox explanation) and ISSUE-02 (match details) were
  reported across multiple participants and user groups — these are the strongest,
  highest-impact findings to implement and highlight in the Evaluation section.
- **Quick wins:** ISSUE-09 is a trivial localization fix and a clean example of a
  finding discovered → fixed within M4.
- **Possible deferral (argue as out of scope):** ISSUE-12 and a full keyboard audit
  (ISSUE-07) across every screen can be argued as beyond the prototype scope if time
  is limited — document the reasoning in the report rather than leaving them silently
  unaddressed.
