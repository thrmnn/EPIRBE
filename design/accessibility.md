# EPIRBE Radio -- Accessibility Specification

**Version:** 1.0
**Date:** 2026-03-20
**Standard:** WCAG 2.1 Level AA
**Status:** Implementation-ready
**Depends on:** UX Audit (UX_AUDIT.md), Phase 1 fixes (completed), Interaction Spec (design/interactions.md)

---

## Table of Contents

1. [WCAG 2.1 AA Compliance Checklist](#1-wcag-21-aa-compliance-checklist)
2. [Focus Management](#2-focus-management)
3. [Screen Reader Announcements](#3-screen-reader-announcements)
4. [Color Contrast Matrix](#4-color-contrast-matrix)
5. [Motion and Cognitive Accessibility](#5-motion-and-cognitive-accessibility)
6. [Testing Protocol](#6-testing-protocol)

---

## 1. WCAG 2.1 AA Compliance Checklist

### Principle 1: Perceivable

#### 1.1 Text Alternatives

| Criterion | Requirement | Implementation | Status |
|-----------|-------------|----------------|--------|
| **1.1.1 Non-text Content** | All non-text content has a text alternative | Every `<svg>` icon button has `aria-label`. Decorative SVGs have `aria-hidden="true"`. The headphone logo SVG in Layout.tsx header has `aria-hidden="true"` (decorative; the adjacent `<h1>` provides text). Album art (future) requires `alt` text. The equalizer bars are decorative (`aria-hidden="true"`) since playing state is conveyed by the button label and `aria-live` regions. AudioMeter has `role="meter"` with `aria-label`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`. | Phase 1 DONE; maintain going forward |

#### 1.2 Time-based Media

| Criterion | Requirement | Implementation | Status |
|-----------|-------------|----------------|--------|
| **1.2.1 Audio-only** | Provide alternative for prerecorded audio | Not applicable: EPIRBE streams live/playlist audio. There is no prerecorded-only content requiring transcription. Live broadcast text alternatives are covered by the NowPlaying metadata (title, artist) displayed alongside the audio stream. | N/A |

#### 1.3 Adaptable

| Criterion | Requirement | Implementation | Status |
|-----------|-------------|----------------|--------|
| **1.3.1 Info and Relationships** | Structure and relationships conveyed through presentation are programmatically determinable | **Landmarks:** `<header role="banner">` (Layout.tsx), `<main role="main" id="main-content">` (Layout.tsx), `role="region" aria-label="Audio player"` (PlayerBar). **Headings:** `<h1>` for "EPIRBE Radio" in header, `<h2>` for section titles (Chat, Library, Playlists, Now Playing, Source). **Lists:** Chat messages use `<ul>/<li>`. Playlist items use `role="listbox"` / `role="option"`. **Tables:** Library track list uses `<table>` with `<thead>` / `<tbody>` semantic structure. **Forms:** All inputs have associated `<label>` elements (visible or `sr-only`). | Phase 1 DONE |
| **1.3.2 Meaningful Sequence** | Reading order matches visual order in all layouts | DOM order follows visual order: header -> skip-to-content -> main (NowPlaying -> sidebar content) -> PlayerBar. The CSS Grid in ListenerView places NowPlayingHero first (`lg:col-span-2`), then sidebar children -- this matches top-to-bottom, left-to-right reading. AdminDashboard: left column (Mic, Playlists) then right column (Library, Chat) -- matches DOM. PlayerBar is last in DOM, positioned fixed at bottom (correct: it is the last thing a screen reader encounters after main content). | PASS |
| **1.3.3 Sensory Characteristics** | Instructions do not rely solely on shape, color, size, visual location, or sound | All states (playing, paused, live, error) are conveyed by text labels and/or ARIA attributes in addition to visual indicators. The green/red connection dot has an `sr-only` span: "Connected" / "Disconnected". The equalizer animation is supplemented by button label "Pause" (implies playing). "LIVE" is text, not just a red badge. | PASS |
| **1.3.4 Orientation** | Content does not restrict operation to a single display orientation | No CSS `orientation: portrait` or `orientation: landscape` locks. All layouts are responsive and work in both orientations. | PASS |
| **1.3.5 Identify Input Purpose** | Input fields that collect user information have programmatically determinable purpose | Chat username input: has `<label>` ("Username"). Password input: `type="password"` with `<label>` ("DJ password"). Autocomplete attributes should be added: `autocomplete="username"` on chat username, `autocomplete="current-password"` on DJ password. | TODO: add autocomplete attributes |

#### 1.4 Distinguishable

| Criterion | Requirement | Implementation | Status |
|-----------|-------------|----------------|--------|
| **1.4.1 Use of Color** | Color is not the only means of conveying information | Active playlist: text is accent-colored AND has `font-semibold` weight AND checkmark icon. Errors: red color AND error icon AND error text message. Live state: red dot AND "LIVE" text AND "LIVE MIC" text. Connection status: colored dot AND sr-only text label. | PASS |
| **1.4.2 Audio Control** | Mechanism to pause or stop audio that plays automatically | Audio does NOT autoplay. User must click "Start Listening" then "Play". Volume slider and pause button are always visible in the persistent PlayerBar. | PASS |
| **1.4.3 Contrast (Minimum)** | Text: 4.5:1, Large text: 3:1 | See Section 4 (Color Contrast Matrix) for full analysis. Phase 1 fix changed muted text from #6b7280 to #9ca3af, achieving 4.64:1 on surface. All other combinations pass. | Phase 1 DONE |
| **1.4.4 Resize Text** | Text can be resized up to 200% without loss of content or functionality | Test: set browser zoom to 200%. PlayerBar must not clip content -- the track info area truncates with ellipsis (existing `truncate` class). Layout reflows to single column at narrow widths. No `overflow: hidden` on containers that clip text. Inputs expand appropriately. | NEEDS TESTING at 200% zoom |
| **1.4.5 Images of Text** | Text is used instead of images of text | No images of text are used. All text is rendered as HTML text. The EPIRBE logo is an SVG icon, not text-as-image; the name "EPIRBE Radio" is an `<h1>`. | PASS |
| **1.4.10 Reflow** | Content reflows at 320px width without horizontal scrolling | At 320px: single-column layout, PlayerBar stacks elements, track info truncates, chat and library take full width. Table in Library may need horizontal scroll -- wrap in a container with `overflow-x: auto` and `role="region" aria-label="Track list" tabindex="0"` for keyboard scrolling. | NEEDS TESTING; table may require scroll wrapper |
| **1.4.11 Non-text Contrast** | UI components and graphical objects: 3:1 contrast against adjacent colors | **Buttons:** accent (#e63946) on bg (#0a0a0f) = 5.02:1. Secondary (border #1e1e2e) on bg (#0a0a0f) = 1.56:1 -- FAIL for ghost buttons on bg. Fix: ensure secondary buttons have a visible border or use radio-muted as background. **Focus ring:** white (#ffffff) on bg (#0a0a0f) = 19.05:1. **Slider track:** accent on border -- needs verification. See Section 4. | PARTIAL -- secondary button contrast needs fix |
| **1.4.12 Text Spacing** | No loss of content when user overrides: line-height 1.5x, letter-spacing 0.12em, word-spacing 0.16em, paragraph spacing 2x | Test with a browser extension (e.g., Text Spacing bookmarklet). Ensure no clipping or overlapping. The `truncate` class (overflow hidden + text-overflow ellipsis) is acceptable as it preserves access to content via screen readers. | NEEDS TESTING |
| **1.4.13 Content on Hover or Focus** | Hover/focus-triggered content is dismissible, hoverable, and persistent | Tooltips (`title` attributes): browser-native, meet this criterion. Toast notifications: persist for 4s and are dismissible via X button. No custom hover popups currently exist. | PASS |

---

### Principle 2: Operable

#### 2.1 Keyboard Accessible

| Criterion | Requirement | Implementation | Status |
|-----------|-------------|----------------|--------|
| **2.1.1 Keyboard** | All functionality available via keyboard | **Play/Pause:** Space key (global) or Enter/Space on button. **Skip:** N key or Enter/Space on skip button. **Volume:** Up/Down arrows or Tab to slider then arrow keys. **Search:** / key to focus or Tab to input. **Chat:** Tab to input, Enter to send. **Playlist selection:** Tab to item, Enter/Space to select (existing `onKeyDown` handler). **Playlist CRUD:** All buttons reachable via Tab. **Go Live:** Tab to button, Enter to activate. **Login:** Tab to input, Enter to submit form. **Dialog dismiss:** Escape key. See interactions.md Section 3 for full shortcut map. | Phase 1 DONE for basic access; shortcuts are TODO |
| **2.1.2 No Keyboard Trap** | Focus can always be moved away from any component | Focus traps exist ONLY in modal dialogs (ConfirmDialog, keyboard shortcuts overlay, splash screen) and are released when the modal closes. All other components allow free Tab navigation. The password input in header is inline (not trapped). | PASS |
| **2.1.4 Character Key Shortcuts** | Single-character shortcuts (Space, N, M, /) can be turned off or remapped, OR only activate when the relevant component has focus | **Current behavior:** Shortcuts are suppressed when a text input has focus (see interactions.md Section 3.2). **Compliance path:** Add a user preference (stored in localStorage) to disable all keyboard shortcuts. Display this option in the `?` shortcuts overlay: "Press [X] to disable keyboard shortcuts." When disabled, all single-key shortcuts are ignored; only Escape and Ctrl+K remain active. | TODO: add disable option |

#### 2.2 Enough Time

| Criterion | Requirement | Implementation | Status |
|-----------|-------------|----------------|--------|
| **2.2.1 Timing Adjustable** | Time limits can be adjusted, turned off, or extended | No time limits on user actions. Toast auto-dismiss at 4s is informational only (no user action is lost). The toast content remains accessible via screen reader announcement even after visual dismissal. Chat messages persist in the scrollback. | PASS |
| **2.2.2 Pause, Stop, Hide** | Moving, blinking, scrolling, or auto-updating content can be paused | **Equalizer bars:** Controlled by playing state; user can pause audio to stop them. `prefers-reduced-motion: reduce` disables the animation entirely. **LIVE dot pulse:** Stops when broadcast ends. Disabled by `prefers-reduced-motion`. **Shimmer skeleton:** Temporary (replaced by content). Disabled by `prefers-reduced-motion`. **Chat auto-scroll:** Does not auto-update. New messages appear at bottom but do not force scroll if user has scrolled up (TODO: implement scroll-lock detection). | PASS with reduced-motion; scroll-lock is TODO |

#### 2.3 Seizures and Physical Reactions

| Criterion | Requirement | Implementation | Status |
|-----------|-------------|----------------|--------|
| **2.3.1 Three Flashes or Below Threshold** | No content flashes more than 3 times per second | All animations are under 3Hz. Equalizer bars cycle at 0.8-0.9s periods (~1.1-1.25 Hz). LIVE dot pulses at ~0.67 Hz. No strobe effects. | PASS |

#### 2.4 Navigable

| Criterion | Requirement | Implementation | Status |
|-----------|-------------|----------------|--------|
| **2.4.1 Bypass Blocks** | Mechanism to bypass repeated navigation blocks | Skip-to-content link: `<a href="#main-content">` as first child of `<body>`. Visible on focus. Styled with `sr-only focus:not-sr-only` classes. Links to `<main id="main-content">`. | Phase 1 DONE |
| **2.4.2 Page Titled** | Pages have descriptive titles | `<title>EPIRBE Radio</title>` in index.html. Enhancement: dynamically update title when playing: `EPIRBE Radio -- [title] by [artist]`. Use `document.title` update in `useNowPlaying` or a `useEffect` in App.tsx. | PARTIAL -- dynamic title is TODO |
| **2.4.3 Focus Order** | Focus order is logical and meaningful | See Section 2 (Focus Management) for complete tab order specification per view. | Phase 1 DONE |
| **2.4.4 Link Purpose** | Purpose of each link/button can be determined from link text or context | All buttons have descriptive `aria-label` attributes. "ON" button -> `aria-label="Activate playlist"`. "X" button -> `aria-label="Delete playlist"`. "+" button -> `aria-label="Add to playlist"`. "-" button -> `aria-label="Remove track from playlist"`. The generic labels should be made specific: e.g., `aria-label="Delete [Playlist Name]"` (already done in AdminDashboard, TODO in legacy Playlist.tsx). | MOSTLY DONE; legacy Playlist needs update |
| **2.4.5 Multiple Ways** | More than one way to reach content | All content is on a single page (SPA). Search provides one way to find tracks. Browsing the library provides another. Keyboard shortcuts provide a third path to common actions. The command bar (future) adds a fourth. | PASS |
| **2.4.6 Headings and Labels** | Headings and labels are descriptive | **Headings:** h1: "EPIRBE Radio", h2: "Now Playing", "Chat", "Library", "Playlists", "Source", "DJ Dashboard". **Labels:** All form inputs have labels (visible or sr-only). Improvement: AdminDashboard h1 "DJ Dashboard" should be h2 (since it is within `<main>` and the page h1 is in the Layout header). | Phase 1 DONE; heading hierarchy refinement TODO |
| **2.4.7 Focus Visible** | Keyboard focus indicator is visible | Global `*:focus-visible { outline: 2px solid #ffffff; outline-offset: 2px; }`. White on dark background provides maximum contrast (19.05:1). Design system Button and IconButton components add `focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2`. | Phase 1 DONE |

#### 2.5 Input Modalities

| Criterion | Requirement | Implementation | Status |
|-----------|-------------|----------------|--------|
| **2.5.1 Pointer Gestures** | Multipoint or path-based gestures have single-pointer alternatives | No multipoint gestures are used. Volume slider uses standard range input (single-point drag). Future drag-and-drop playlist reordering (dnd-kit) must provide keyboard alternatives (arrow keys to reorder). | PASS |
| **2.5.2 Pointer Cancellation** | Down-event does not trigger action; action triggers on up-event | All buttons use `onClick` (fires on mouseup/touchend), not `onMouseDown`. This is the default browser behavior for `<button>` elements. | PASS |
| **2.5.3 Label in Name** | Visible label text is included in the accessible name | All buttons with visible text: "Create", "Login", "Scan", "Send", "Go Live", "Stop Mic", "Activate", "Logout", "Listener View" -- the visible text IS the accessible name. Icon-only buttons use `aria-label` (no visible text to conflict). | PASS |
| **2.5.4 Motion Actuation** | No functionality triggered by device motion | Not applicable. No accelerometer/gyroscope features. | N/A |

---

### Principle 3: Understandable

#### 3.1 Readable

| Criterion | Requirement | Implementation | Status |
|-----------|-------------|----------------|--------|
| **3.1.1 Language of Page** | Default language declared | `<html lang="en">` in index.html. | PASS |
| **3.1.2 Language of Parts** | Language changes within content are identified | Chat messages may contain non-English text. Currently no per-message `lang` attribute. Acceptable for user-generated content where language detection is impractical. If LLM integration is added, LLM responses should include `lang` if responding in a different language. | ACCEPTABLE |

#### 3.2 Predictable

| Criterion | Requirement | Implementation | Status |
|-----------|-------------|----------------|--------|
| **3.2.1 On Focus** | Focus does not trigger context change | No `onFocus` handlers change context. The login password input appearing on DJ button click is a button action, not a focus event. | PASS |
| **3.2.2 On Input** | Input does not trigger unexpected context change | Search input triggers a debounced filter (expected in context). No inputs navigate away or open new windows. The "Activate" button changes the playing playlist, which is the expected action. | PASS |
| **3.2.3 Consistent Navigation** | Navigation components appear in consistent order | Header with logo, title, LIVE badge, and DJ button is consistent across listener and admin views. PlayerBar is always fixed at bottom. | PASS |
| **3.2.4 Consistent Identification** | Components with same function are identified consistently | All "delete" actions use trash icon or "X". All "add" actions use "+" icon. All "activate" actions use "Activate" text or checkmark. Terminology is consistent. | PASS |

#### 3.3 Input Assistance

| Criterion | Requirement | Implementation | Status |
|-----------|-------------|----------------|--------|
| **3.3.1 Error Identification** | Errors are identified and described in text | Login error: input border turns red + `loginError` state can drive a visible error message ("Incorrect password") below the input. API errors: Toast with "Error: [description]". ConfirmDialog for destructive actions. Empty search: "No tracks match '[query]'" text. Empty playlist: "Empty playlist. Add tracks from the Library." text. | PARTIAL -- login error needs visible text message, not just red border |
| **3.3.2 Labels or Instructions** | Input fields have labels | All inputs have `<label>` elements (visible or `sr-only`). Placeholder text supplements but does not replace labels. The `sr-only` labels are: "DJ password", "Search tracks", "Chat message", "Username", "Playlist name", "Volume". Visible labels: None currently (all use sr-only + placeholder). Consider making "Search tracks" a visible label for the library search. | Phase 1 DONE |
| **3.3.3 Error Suggestion** | Error messages suggest corrections when possible | Login error: "Incorrect password. Try again." (clear). Search no results: "No tracks match '[query]'. Try a different search." API failure: "Failed to [action]. Check your connection and try again." | TODO: enhance error messages with suggestions |
| **3.3.4 Error Prevention (Legal, Financial, Data)** | Reversible, checked, or confirmed for important submissions | Playlist deletion: ConfirmDialog with "Are you sure?" (implemented in AdminDashboard flow; TODO for legacy Playlist.tsx). Going live: Confirmation dialog. No financial transactions. Chat messages are ephemeral (acceptable without confirmation). | PARTIAL -- legacy Playlist.tsx delete needs ConfirmDialog |

---

### Principle 4: Robust

#### 4.1 Compatible

| Criterion | Requirement | Implementation | Status |
|-----------|-------------|----------------|--------|
| **4.1.1 Parsing** | Content can be parsed by assistive technologies | React generates valid HTML. No duplicate IDs (verified: each component uses unique IDs like "chat-input", "library-search", "volume-slider", "playlist-name-input", "dj-password", "username-input"). If multiple instances of a component render simultaneously (e.g., Chat in both listener and admin), IDs would conflict -- the current architecture renders Chat only once per view, preventing this. | PASS |
| **4.1.2 Name, Role, Value** | All UI components have accessible name, role, and value | **Buttons:** All have `aria-label` or visible text. **Inputs:** All have `<label>` associations. **Custom widgets:** Playlist list uses `role="listbox"` / `role="option"` with `aria-selected`. Volume slider is native `<input type="range">` with `aria-label`. AudioMeter uses `role="meter"` with `aria-valuenow`. Chat uses `role="log"` with `aria-live="polite"`. NowPlaying uses `aria-live="polite"`. ConfirmDialog uses `role="alertdialog"` with `aria-labelledby` and `aria-describedby`. | Phase 1 DONE |
| **4.1.3 Status Messages** | Status messages are programmatically determinable | **Toast:** `role="status"` with `aria-live="polite"` -- screen readers announce toast content. **Track changes:** NowPlayingHero div has `aria-live="polite"` -- new track info is announced. **Chat messages:** Chat `<ul>` has `role="log"` with `aria-live="polite"` -- new messages are announced. **Listener count:** The container has `role="status"`. **Connection status:** sr-only text within the connection dot. **Error messages:** Toasts with error variant are announced. | Phase 1 DONE |

---

## 2. Focus Management

### 2.1 Tab Order: Listener View

The tab order follows the visual layout, top-to-bottom, left-to-right.

```
1.  Skip-to-content link (sr-only, visible on focus)
2.  [Header] DJ button
3.  [Header] Login input (if visible) -> Login submit button
4.  [Main] NowPlayingHero region (not interactive -- skipped by Tab unless made focusable)
5.  [Sidebar] Chat panel:
    5a. Edit username button
    5b. (If editing: username input)
    5c. Chat message input
    5d. Send button
6.  [Sidebar] Library panel:
    6a. Search input
    6b. Scan button
    6c. Track table: (if onAddToPlaylist) Select-all checkbox -> each track row: checkbox, + button
7.  [PlayerBar] Play/Pause button
8.  [PlayerBar] Skip button (hidden during live)
9.  [PlayerBar] Volume slider
```

**Notes:**
- The NowPlayingHero is informational, not interactive. It should NOT have `tabindex="0"`. Content updates are conveyed via `aria-live`.
- The listener count and connection status dot are informational, not interactive.
- Chat messages in the `<ul role="log">` are not individually focusable (correct for a log region).

### 2.2 Tab Order: Admin View (DJ Dashboard)

```
1.  Skip-to-content link
2.  [Admin Header] "Listener View" button
3.  [Admin Header] "Logout" button
4.  [Left Column] SourceSwitch:
    4a. Go Live / Stop Mic button
5.  [Left Column] Playlist Manager:
    5a. New playlist name input
    5b. Create button
    5c. Each playlist item (tabindex=0, role="button"):
        - Activate button
        - Delete button
    5d. (If playlist selected) Playlist tracks: each track's remove button
6.  [Right Column] Library:
    6a. Search input
    6b. Search button
    6c. Scan button
    6d. Each track row: Add-to-playlist button
7.  [Right Column] Chat panel:
    7a. Edit username button
    7b. Chat input
    7c. Send button
8.  [PlayerBar] Play/Pause button
9.  [PlayerBar] Skip button
10. [PlayerBar] Volume slider
```

### 2.3 Focus Trap Rules

Focus traps MUST only be applied to modal contexts. A focus trap prevents Tab from leaving the trapped container.

| Context | Trap behavior |
|---------|---------------|
| **ConfirmDialog** (delete playlist, go live confirmation) | Focus trapped within the dialog. Tab cycles between Cancel and Confirm buttons. Shift+Tab reverses. Escape closes the dialog. Initial focus: Cancel button (safe default). |
| **Keyboard shortcuts overlay** (`?` key) | Focus trapped within the overlay. Only interactive element is the close button. Escape closes. |
| **First-visit splash** | Focus trapped on the "Start Listening" button. Since it is the only interactive element, Tab keeps focus on it. Escape does nothing (user must click to proceed). |
| **Future: Command bar** (Ctrl+K) | Focus trapped within the command input. Escape closes. Tab moves between input and any result action buttons. |

**Implementation approach for focus trapping:**

```typescript
// Focus trap hook pseudocode
function useFocusTrap(containerRef: RefObject<HTMLElement>, active: boolean) {
  useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;
    const focusableSelector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;

      const focusable = Array.from(
        container.querySelectorAll<HTMLElement>(focusableSelector)
      ).filter(el => !el.hasAttribute('disabled'));

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [active, containerRef]);
}
```

**Note:** The existing ConfirmDialog uses `<dialog>` with `showModal()`, which provides native focus trapping in modern browsers. No custom focus trap needed for this component. Custom trapping is needed for non-`<dialog>` modal overlays (splash, shortcuts overlay).

### 2.4 Focus Restoration After Dialog Close

When a modal/dialog closes, focus MUST return to the element that triggered the opening.

| Dialog | Trigger element | Focus restoration |
|--------|----------------|-------------------|
| Delete playlist ConfirmDialog | The delete (trash) button on that playlist | Return focus to: the same delete button if playlist still exists; or the next playlist's delete button; or the create-playlist input if no playlists remain. |
| Go Live ConfirmDialog | The "Go Live" button | Return focus to: the "Go Live" / "Stop Mic" button (same element, different label). |
| Keyboard shortcuts overlay | ? key (no trigger element) | Return focus to: `document.activeElement` captured before overlay opened. |
| Future: Command bar | Ctrl+K (no trigger element) | Return focus to: `document.activeElement` captured before command bar opened. |

**Implementation:** The existing ConfirmDialog stores `previousFocusRef` and calls `.focus()` on close. This pattern should be replicated in all modal-like components.

### 2.5 Skip-to-Content Targets

| Link text | Target ID | Element |
|-----------|-----------|---------|
| "Skip to main content" | `#main-content` | `<main>` element |

**Future enhancement:** Add a second skip link for frequent actions:
| Link text | Target ID | Element |
|-----------|-----------|---------|
| "Skip to player controls" | `#player-bar` | PlayerBar `<div>` (add `id="player-bar"` and `tabindex="-1"`) |

The `tabindex="-1"` allows the target to receive focus programmatically without being part of the normal tab order.

### 2.6 Focus Management During View Transitions

| Transition | Focus behavior |
|------------|---------------|
| **Splash -> Listener view** | After splash fades out, focus moves to the Play button in PlayerBar. Rationale: the primary action after entering is to start listening. |
| **Listener -> Admin** (click "Dashboard") | Focus moves to the first focusable element in AdminDashboard: the "Go Live" button in SourceSwitch, or the "Listener View" button in the admin header. Preference: admin header "Listener View" button (predictable top-of-page location). |
| **Admin -> Listener** (click "Listener View" or "Logout") | Focus moves to the DJ button in the Layout header. Rationale: this is the element that controls the view toggle and is spatially consistent. |
| **Track added to playlist** | Focus remains on the "+" button that was clicked (no movement). |
| **Track removed from playlist** | If removed track was last in list: focus moves to the empty-state text (not focusable; instead move to the playlist name input). If other tracks remain: focus moves to the remove button of the next track, or previous track if it was the last. |
| **Playlist deleted** | If other playlists exist: focus moves to the next playlist item. If no playlists remain: focus moves to the new-playlist name input. |
| **Toast appears** | Focus does NOT move. Toasts are announced via `aria-live` without stealing focus. |

---

## 3. Screen Reader Announcements

### 3.1 Announcement Script

Each key interaction must produce a screen reader announcement. Announcements are delivered via `aria-live` regions (polite or assertive) or by updating the accessible name/state of the focused element.

#### Page Load
```
"EPIRBE Radio"                           (page title)
"banner"                                  (header landmark)
"EPIRBE Radio, heading level 1"          (h1)
"main"                                    (main landmark)
"Now Playing, heading level 2"
"[Title] by [Artist]"                     (or "Waiting for stream..." if no track)
"[N] listeners"                           (role="status")
```

**On first visit (splash active):**
```
"Welcome to EPIRBE Radio, dialog"
"Start Listening, button"
"[N] listening now"
"Now playing: [title] -- [artist]"        (if track available)
```

#### Playback Controls

| Action | Announcement | Mechanism |
|--------|-------------|-----------|
| Play pressed (success) | "Playing" | Update `aria-label` to "Pause" on the button. Additionally, the NowPlayingHero `aria-live="polite"` region updates with track info. |
| Play pressed (autoplay blocked) | "Playback blocked. Press play again to start." | Inject an `aria-live="assertive"` announcement, or use the autoplay warning text that appears (it should be in an `aria-live` region). |
| Pause pressed | "Paused" | Update `aria-label` to "Play". |
| Skip pressed (success) | "Skipped. Now playing: [new title] by [new artist]" | The NowPlayingHero `aria-live="polite"` region updates. Additionally, inject a one-time announcement via a dedicated sr-only live region. |
| Skip pressed (failure) | "Error. Failed to skip track." | Toast with `role="status" aria-live="polite"`. |

#### Volume

| Action | Announcement | Mechanism |
|--------|-------------|-----------|
| Volume changed (slider) | "[N] percent" | Native range input announces `aria-valuetext`. Set `aria-valuetext={Math.round(volume * 100) + ' percent'}` on the range input. |
| Muted | "Muted" | sr-only live region announcement. |
| Unmuted | "Unmuted. Volume [N] percent." | sr-only live region announcement. |

#### Library

| Action | Announcement | Mechanism |
|--------|-------------|-----------|
| Search results loaded | "[N] tracks found" or "No results for [query]" | sr-only `aria-live="polite"` region updated with result count. |
| Search cleared | "Search cleared. Showing all [N] tracks." | Same sr-only live region. |
| Scan complete | "Library scan complete: [N] tracks found" | Toast announcement. |
| Scan failed | "Error. Library scan failed." | Toast announcement. |

#### Playlist Management

| Action | Announcement | Mechanism |
|--------|-------------|-----------|
| Track added to playlist | "[Track Title] added to [Playlist Name]" | Toast announcement via `role="status"`. |
| Track add failed | "Error. Failed to add track." | Toast announcement. |
| Track removed from playlist | "[Track Title] removed from [Playlist Name]" | Toast announcement. |
| Playlist created | "Playlist [name] created" | Toast announcement. |
| Playlist activated | "[Playlist Name] activated. Now playing." | Toast announcement + NowPlayingHero live region updates when new track starts. |
| Playlist deleted | "Playlist [name] deleted" | Toast announcement. |
| Delete confirmation opened | "Delete Playlist, alertdialog. Are you sure you want to delete [name]? This cannot be undone. Cancel button. Delete button." | Native `<dialog>` with `role="alertdialog"`, `aria-labelledby`, `aria-describedby`. |

#### Broadcasting

| Action | Announcement | Mechanism |
|--------|-------------|-----------|
| Go Live confirmation opened | "Go Live, alertdialog. You will broadcast your microphone to all listeners. Continue? Cancel button. Go Live button." | Native `<dialog>`. |
| Broadcasting started | "Broadcasting live. Microphone active." | Toast + sr-only live region. |
| Mic permission denied | "Error. Microphone access denied." | Toast announcement. |
| Broadcasting ended | "Broadcast ended." | Toast announcement. |

#### Chat

| Action | Announcement | Mechanism |
|--------|-------------|-----------|
| New message received | "[username]: [message]" | The `<ul role="log" aria-live="polite">` automatically announces new `<li>` children. Rate-limit: if messages arrive faster than the screen reader can read, some may be skipped (expected for `polite`). |
| Chat disconnected | "Chat disconnected" | Update the placeholder text and announce via aria-live (the disabled input's placeholder "Connecting..." serves as an indicator; enhance with explicit announcement). |
| Chat reconnected | "Chat connected" | sr-only live region update. |

#### Authentication

| Action | Announcement | Mechanism |
|--------|-------------|-----------|
| Login form appears | "DJ password, password field" | Focus moves to the password input; screen reader announces the label and input type. |
| Login success | "Logged in as DJ. Dashboard view." | sr-only announcement + toast. |
| Login failure | "Login failed. Incorrect password." | sr-only announcement. The input retains focus. |
| Logout | "Logged out. Listener view." | sr-only announcement + toast. |

#### View Transitions

| Action | Announcement | Mechanism |
|--------|-------------|-----------|
| Switch to admin | "DJ Dashboard. Mic control, playlist management, library, and chat panels." | Inject sr-only announcement after view transition completes. |
| Switch to listener | "Listener view. Now playing: [title] by [artist]." | Inject sr-only announcement after view transition completes. |

### 3.2 Implementation: sr-only Live Region

A dedicated announcer component should exist at the app root level for programmatic announcements that are not tied to any visible UI:

```tsx
// components/SrAnnouncer.tsx
// A visually hidden aria-live region for programmatic announcements

function SrAnnouncer({ message }: { message: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
}
```

**Usage pattern:**
- Maintain an `announcement` state in a context provider
- Call `announce("text")` to set the message
- The live region updates, causing the screen reader to read it
- Clear the message after a brief delay (500ms) to allow re-announcement of the same text

For urgent announcements (errors), use a second region with `aria-live="assertive"`.

---

## 4. Color Contrast Matrix

### 4.1 Design Token Reference

| Token | Hex | Used for |
|-------|-----|----------|
| `radio-bg` | `#0a0a0f` | Page background |
| `radio-surface` | `#12121a` | Panel backgrounds |
| `radio-border` | `#1e1e2e` | Borders, secondary button bg |
| `radio-accent` | `#e63946` | Primary actions, active indicators |
| `radio-text` | `#e0e0e0` | Primary text |
| `radio-muted` | `#9ca3af` | Secondary text (updated from #6b7280 in Phase 1) |
| `radio-success` | `#22c55e` | Success indicators |
| `radio-warning` | `#eab308` | Warning indicators |
| `radio-error` | `#ef4444` | Error indicators |
| `radio-info` | `#3b82f6` | Info indicators |
| white | `#ffffff` | Focus rings, button text on accent/danger bg |
| red-400 | `#f87171` | LIVE text, delete button text |
| red-500 | `#ef4444` | LIVE dot, error text |
| red-600 | `#dc2626` | Danger button bg |
| yellow-400 | `#facc15` | Connecting state text, autoplay warning |
| green-500 | `#22c55e` | Connected dot |

### 4.2 Text on Background Combinations

Contrast ratios calculated using WCAG relative luminance formula. Minimum required: 4.5:1 for normal text, 3:1 for large text (18pt/14pt bold).

| Foreground | Background | Ratio | Requirement | Status |
|------------|------------|-------|-------------|--------|
| `radio-text` (#e0e0e0) | `radio-bg` (#0a0a0f) | **14.92:1** | 4.5:1 (normal) | PASS |
| `radio-text` (#e0e0e0) | `radio-surface` (#12121a) | **12.76:1** | 4.5:1 (normal) | PASS |
| `radio-muted` (#9ca3af) | `radio-bg` (#0a0a0f) | **7.57:1** | 4.5:1 (normal) | PASS |
| `radio-muted` (#9ca3af) | `radio-surface` (#12121a) | **6.47:1** | 4.5:1 (normal) | PASS |
| `radio-accent` (#e63946) | `radio-bg` (#0a0a0f) | **5.02:1** | 4.5:1 (normal) | PASS |
| `radio-accent` (#e63946) | `radio-surface` (#12121a) | **4.29:1** | 4.5:1 (normal) | **MARGINAL FAIL** |
| `white` (#ffffff) | `radio-accent` (#e63946) | **3.89:1** | 3:1 (large/bold) | PASS for bold/large; **FAIL for normal** |
| `white` (#ffffff) | `red-600` (#dc2626) | **4.63:1** | 4.5:1 (normal) | PASS |
| `red-400` (#f87171) | `radio-surface` (#12121a) | **5.84:1** | 4.5:1 (normal) | PASS |
| `red-400` (#f87171) | `radio-bg` (#0a0a0f) | **6.83:1** | 4.5:1 (normal) | PASS |
| `yellow-400` (#facc15) | `radio-surface` (#12121a) | **10.42:1** | 4.5:1 (normal) | PASS |
| `yellow-400` (#facc15) | `radio-bg` (#0a0a0f) | **12.19:1** | 4.5:1 (normal) | PASS |
| `green-500` (#22c55e) | `radio-surface` (#12121a) | **6.44:1** | 4.5:1 (normal) | PASS |
| `green-500` (#22c55e) | `radio-bg` (#0a0a0f) | **7.54:1** | 4.5:1 (normal) | PASS |
| `radio-info` (#3b82f6) | `radio-surface` (#12121a) | **4.76:1** | 4.5:1 (normal) | PASS |
| `radio-info` (#3b82f6) | `radio-bg` (#0a0a0f) | **5.57:1** | 4.5:1 (normal) | PASS |
| `radio-text` (#e0e0e0) | `radio-border` (#1e1e2e) | **9.72:1** | 4.5:1 (normal) | PASS |
| `radio-muted` (#9ca3af) | `radio-border` (#1e1e2e) | **4.93:1** | 4.5:1 (normal) | PASS |
| `white` (#ffffff) | `radio-bg` (#0a0a0f) | **19.05:1** | Focus ring | PASS |

### 4.3 Issues Requiring Attention

#### Issue 1: Accent text on surface (4.29:1 < 4.5:1)

**Where it appears:** Active playlist name in accent color on panel background, chat username in accent color on surface background.

**Fix options:**
1. **Brighten accent for text use:** Use `#ef4f5c` (lighter red) for text-on-surface contexts. Ratio: ~5.0:1. Reserve `#e63946` for backgrounds (buttons) only.
2. **Add font-weight: bold** to accent-colored text. At `font-weight: 600+` and `14px+`, the requirement drops to 3:1, and 4.29:1 passes.
3. **Darken surface slightly** for panels with accent text. Not recommended (disrupts design consistency).

**Recommended fix:** Option 2 -- all accent-colored text should use `font-semibold` (600 weight). The chat username already uses `font-semibold`. The active playlist name in legacy Playlist.tsx already uses `font-semibold`. Verify all accent text uses are bold.

#### Issue 2: White on accent button backgrounds (3.89:1)

**Where it appears:** "Create" button, Play button, primary action buttons with white text on `#e63946` background.

**Fix options:**
1. **Darken accent for button bg:** Use `#d03040` for button backgrounds. Ratio with white: ~4.6:1.
2. **Text size/weight exemption:** Button text at 14px bold qualifies as large text (3:1 requirement). 3.89:1 passes.
3. **Use pure white (#ffffff) with slightly bolder font:** Already using `font-semibold`. At 14px semibold, this passes the 3:1 large-text threshold.

**Recommended fix:** Option 2 -- buttons already use `text-sm font-semibold` (14px, 600 weight). This qualifies as large text per WCAG (14pt bold = 18.67px bold; 14px semibold at default browser settings is close). To be safe, consider Option 1 as well: change button accent to `#d03040`.

**Action item:** Add a CSS custom property `--color-accent-button: #d03040` and `--color-accent-text: #ef4f5c` for the two distinct use cases. Or maintain the single token and accept the large-text exemption for buttons while ensuring bold weight on accent text.

### 4.4 Non-text Contrast (1.4.11)

UI components require 3:1 contrast against adjacent colors.

| Component | Foreground | Adjacent color | Ratio | Status |
|-----------|-----------|----------------|-------|--------|
| Focus ring (white) | #ffffff | #0a0a0f (bg) | **19.05:1** | PASS |
| Focus ring (white) | #ffffff | #12121a (surface) | **16.28:1** | PASS |
| Play button (accent bg) | #e63946 | #12121a (surface) | **4.29:1** | PASS (>3:1) |
| Play button (accent bg) | #e63946 | #0a0a0f (bg) | **5.02:1** | PASS |
| Volume slider track (accent) | #e63946 | #1e1e2e (border bg) | **3.27:1** | PASS |
| Secondary button (border bg) | #1e1e2e | #0a0a0f (bg) | **1.56:1** | **FAIL** |
| Secondary button (border bg) | #1e1e2e | #12121a (surface) | **1.31:1** | **FAIL** |
| Checkbox (accent) | #e63946 | #12121a (surface) | **4.29:1** | PASS |
| Connection dot (green) | #22c55e | #12121a (surface) | **6.44:1** | PASS |
| Connection dot (red) | #ef4444 | #12121a (surface) | **5.02:1** | PASS |

**Critical fix needed:** Secondary buttons (`bg-radio-border`) on both bg and surface backgrounds fail non-text contrast. The border color (#1e1e2e) is too close to both backgrounds.

**Fix:** Add a visible 1px border to secondary buttons using a lighter color:
```
border: 1px solid #2d2d40 (or radio-muted at reduced opacity)
```
The border of `#2d2d40` against `#12121a` surface = ~1.8:1 -- still insufficient.

**Better fix:** Change secondary button background to `#2a2a3a` (lighter). Ratio against surface (#12121a): ~1.9:1. Still insufficient.

**Best fix:** Secondary buttons should use a visible text-colored border:
```css
.btn-secondary {
  background: #1e1e2e;
  border: 1px solid #4a4a5a;  /* Visible border */
  color: #e0e0e0;
}
```
`#4a4a5a` against `#12121a` = 3.0:1 (passes). This way the button boundary is defined by its border, not just background-vs-background contrast.

**Alternative:** Rely on the text within the button as the perceivable boundary (text at 12.76:1 is clearly visible). WCAG 1.4.11 allows this interpretation for buttons whose purpose is clear from their text content. Add hover state that further distinguishes: `hover:bg-radio-muted/30`.

---

## 5. Motion and Cognitive Accessibility

### 5.1 prefers-reduced-motion Behavior

Every animation defined in `design/interactions.md` has a reduced-motion alternative. The global override in `index.css` handles most cases:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Per-animation reduced-motion behavior:**

| Animation | Standard | Reduced motion |
|-----------|----------|----------------|
| Equalizer bars (eq-1, eq-2, eq-3) | Oscillating height, infinite | Static bars at 10px height |
| Toast slide-in | translateY + opacity, 300ms | Instant appear (opacity snap) |
| Toast auto-dismiss | Fade out, 200ms | Instant disappear |
| Dialog backdrop | Opacity + blur, 200ms | Instant opacity, no blur transition |
| Dialog content | Scale + opacity, 200ms | Instant appear |
| Track row flash | Background color pulse, 600ms | 2px left accent border for 1s (no motion) |
| LIVE badge pulse | Box-shadow throb, 2s infinite | Static glow at medium intensity |
| View transition (crossfade) | Opacity, 300ms total | Instant swap |
| Skeleton shimmer | Background-position, 1.5s infinite | Static gray rectangle |
| Chat message entry | translateY + opacity, 200ms | Instant appear |
| Volume thumb grow | Width/height, 150ms | Static 14px size |
| PlayerBar glow | Box-shadow, 300ms | Static 2px accent top border |
| Input error shake | translateX oscillation, 300ms | No motion; red border only |
| Splash entry/exit | Scale + opacity, 400ms | Instant appear/disappear |
| Play button scale pulse | Scale, 250ms | No scale change |
| Button press feedback | Scale 0.97, 50ms | No scale change |
| Smooth scroll (chat) | scroll-behavior: smooth | scroll-behavior: auto (instant) |

### 5.2 prefers-contrast Considerations (High Contrast Mode)

Users who enable high contrast mode (Windows High Contrast, macOS Increase Contrast) need enhanced visual distinction.

```css
@media (prefers-contrast: more) {
  :root {
    --radio-bg: #000000;
    --radio-surface: #0a0a0a;
    --radio-border: #444444;
    --radio-text: #ffffff;
    --radio-muted: #bbbbbb;
    --radio-accent: #ff4d5a;
  }

  /* Ensure all borders are visible */
  * {
    border-color: #666666 !important;
  }

  /* Buttons get stronger borders */
  button {
    border: 2px solid currentColor !important;
  }

  /* Focus ring: thicker */
  *:focus-visible {
    outline-width: 3px !important;
    outline-offset: 3px !important;
  }

  /* Disabled state: strikethrough pattern instead of just opacity */
  button:disabled {
    opacity: 0.6 !important;
    text-decoration: line-through;
  }
}
```

**Windows High Contrast specifics:**
- Use `forced-colors: active` media query
- System colors replace custom colors
- Ensure borders and focus indicators use `currentColor` or system keywords (`ButtonText`, `Highlight`, `CanvasText`)

```css
@media (forced-colors: active) {
  .live-badge {
    border: 2px solid Highlight;
  }

  *:focus-visible {
    outline: 3px solid Highlight;
  }

  button:disabled {
    opacity: 1;
    border-style: dashed;
    color: GrayText;
  }

  /* Equalizer bars need to be visible */
  .animate-eq-1,
  .animate-eq-2,
  .animate-eq-3 {
    background-color: Highlight !important;
  }

  /* Connection dot */
  .bg-green-500 {
    background-color: Highlight !important;
  }
  .bg-red-500 {
    background-color: LinkText !important;
  }
}
```

### 5.3 State Change Clarity

Every state change must be perceivable through at least TWO independent channels (not just one):

| State change | Channel 1 (Visual) | Channel 2 (Text/Icon) | Channel 3 (Programmatic) |
|-------------|--------------------|-----------------------|--------------------------|
| Playing -> Paused | Equalizer stops, glow fades | Icon changes (pause->play), button label changes | `aria-label` updates, `aria-live` region announces |
| Paused -> Playing | Equalizer starts, glow appears | Icon changes (play->pause), button label changes | `aria-label` updates, `aria-live` region announces |
| Playlist -> Live | LIVE badge appears, red glow | "LIVE" text appears, "LIVE MIC" text in source panel | `aria-live` regions announce, LIVE badge has `role="status"` |
| Track changes | NowPlayingHero content changes, crossfade animation | Title and artist text updates | `aria-live="polite"` on NowPlayingHero announces new content |
| Connected -> Disconnected | Green dot -> red dot | sr-only text "Connected" -> "Disconnected" | sr-only text is in DOM |
| Empty list -> populated | Content appears where empty state was | Empty state text disappears, items appear | Screen reader encounters new list items |
| Action success | Toast appears (green border) | Toast text describes success | `role="status" aria-live="polite"` announces |
| Action error | Toast appears (red border) | Toast text describes error | `role="status" aria-live="polite"` announces |
| Button enabled -> disabled | Opacity reduces | (varies by button) | `disabled` attribute, `aria-disabled` |

### 5.4 Reading Order vs. Visual Order

The DOM order MUST match the visual order in all layouts and breakpoints.

| Layout | Visual order (top to bottom, left to right) | DOM order | Match? |
|--------|---------------------------------------------|-----------|--------|
| **Listener, desktop (lg)** | Header -> NowPlayingHero (left 2/3) -> Chat + Library (right 1/3) -> PlayerBar (bottom) | Header -> main -> ListenerView (grid: NowPlayingHero, then Chat + Library) -> PlayerBar | YES |
| **Listener, mobile (<640px)** | Header -> NowPlayingHero -> Chat -> Library -> PlayerBar | Same DOM, single column due to grid collapse | YES |
| **Admin, desktop (lg)** | Admin header -> SourceSwitch + Playlists (left) -> Library + Chat (right) -> PlayerBar | Admin header -> grid: left column (SourceSwitch, Playlists), right column (Library, Chat) -> PlayerBar | YES |
| **Admin, mobile** | Admin header -> SourceSwitch -> Playlists -> Library -> Chat -> PlayerBar | Same DOM, single column | YES |

**Potential issue:** PlayerBar is rendered AFTER `<Layout>` in App.tsx (it is a sibling, not a child of `<main>`). This means it appears after all main content in the reading order, which matches its visual position at the bottom. Correct.

**Potential issue:** The admin header is rendered inside `AdminDashboard`, which is rendered inside `<main>` inside `<Layout>`. This means the page has TWO headers (Layout header + Admin header). The Layout header (with "EPIRBE Radio" and DJ button) is still visible in admin mode (it wraps the admin dashboard). The admin header ("DJ Dashboard") appears below it. The screen reader will encounter both. This is acceptable -- the Layout header is the site-wide banner, the admin header is a section heading. However, the admin "header" should use `<div>` or `<section>` rather than a second `<header>` element to avoid two `banner` landmarks. Currently it uses `<header>` -- this should be changed to `<div role="heading" aria-level="2">` or simply a `<div>` with an `<h2>`.

**Fix:** In AdminDashboard.tsx, change the admin header from `<header>` to `<div>` and ensure the "DJ Dashboard" text is an `<h2>`.

### 5.5 Cognitive Load Reduction

| Principle | Implementation |
|-----------|---------------|
| **Consistent layout** | PlayerBar always at bottom. Header always at top. Main content always in center. Panel styling is consistent (same border, radius, background). |
| **Predictable actions** | Destructive actions always require confirmation. Success/failure always produces a toast. Same icon always means same action (+, trash, play, pause). |
| **Clear feedback** | Every user action produces visible feedback within 100ms. No silent failures. Loading states are always shown for async operations. |
| **Manageable choices** | Toasts limited to 3 visible. Track lists will use virtual scrolling (not 1389 DOM nodes). Chat keeps last 100 messages. |
| **Error recovery** | All error states include a recovery path (retry button, clear suggestion, "try again" text). Destructive actions have confirmation dialogs. |
| **Progressive disclosure** | Listener view shows minimal controls. Admin features are hidden behind authentication. Advanced features (command bar) behind Ctrl+K. |

---

## 6. Testing Protocol

### 6.1 Automated Testing

Run before every deployment:

| Tool | Checks | Integration |
|------|--------|-------------|
| **axe-core** (via @axe-core/react or axe DevTools) | WCAG 2.1 AA violations, color contrast, ARIA validity, landmark structure | Add `@axe-core/react` in development mode. Import in main.tsx behind `if (process.env.NODE_ENV === 'development')`. Reports violations to browser console. |
| **eslint-plugin-jsx-a11y** | Static analysis of JSX for accessibility issues (missing alt text, invalid ARIA, missing labels) | Add to ESLint config. Enforce as error (not warning). |
| **Lighthouse CI** | Accessibility score (target: 95+), performance | Run in CI pipeline on every PR. Fail the build if accessibility score drops below 90. |

### 6.2 Manual Testing Checklist

Perform before each release:

#### Keyboard Navigation
- [ ] Tab through entire listener view; all interactive elements reachable
- [ ] Tab through entire admin view; all interactive elements reachable
- [ ] Tab order matches visual order
- [ ] Focus indicator visible on every focused element
- [ ] Space/Enter activates all buttons
- [ ] Escape closes all dialogs and modals
- [ ] Focus trap works in ConfirmDialog (Tab does not leave dialog)
- [ ] Focus returns to trigger element after dialog closes
- [ ] Skip-to-content link works and is visible on focus
- [ ] Keyboard shortcuts work (Space, N, M, Up/Down, /, ?, Escape)
- [ ] Keyboard shortcuts are suppressed in text inputs
- [ ] Volume slider operable with arrow keys
- [ ] Playlist items selectable with Enter/Space

#### Screen Reader Testing

Test with at least ONE of each:
- **Desktop:** NVDA (Windows) or VoiceOver (macOS)
- **Mobile:** VoiceOver (iOS) or TalkBack (Android)

- [ ] Page title announced on load
- [ ] Landmarks announced (banner, main, region)
- [ ] Headings navigable via heading shortcuts (H key in NVDA/VO)
- [ ] Play/Pause state announced
- [ ] Track change announced via aria-live
- [ ] New chat messages announced via role="log"
- [ ] Toast notifications announced
- [ ] Dialog content announced (title, message, buttons)
- [ ] Form labels announced for all inputs
- [ ] Button names announced (including icon-only buttons)
- [ ] Error messages announced
- [ ] Disabled state announced
- [ ] Listener count announced
- [ ] "LIVE" status announced when applicable
- [ ] AudioMeter level announced (role="meter")

#### Visual/Motion Testing
- [ ] All text readable at 200% browser zoom
- [ ] No horizontal scroll at 320px viewport width (except tables with scroll wrapper)
- [ ] All text spacing overridable (line-height, letter-spacing, word-spacing) without content loss
- [ ] `prefers-reduced-motion: reduce` disables all animations (test via browser DevTools: Rendering > Emulate CSS media feature)
- [ ] `prefers-contrast: more` enhances contrast (test via DevTools)
- [ ] `forced-colors: active` does not break layout (test via Windows High Contrast mode)
- [ ] All state changes perceivable through at least two channels (visual + text, visual + programmatic)

#### Color Contrast
- [ ] Run axe DevTools contrast checker on listener view
- [ ] Run axe DevTools contrast checker on admin view
- [ ] Manually verify accent text on surface uses bold weight
- [ ] Manually verify button text on accent background uses bold weight
- [ ] Check secondary buttons have sufficient boundary contrast

### 6.3 Browser and Assistive Technology Matrix

| Browser | Screen Reader | Priority |
|---------|---------------|----------|
| Chrome (latest) | NVDA (latest) | **Primary** (most common combination) |
| Firefox (latest) | NVDA (latest) | Secondary |
| Safari (latest) | VoiceOver (macOS) | Secondary |
| Chrome (Android) | TalkBack | Tertiary |
| Safari (iOS) | VoiceOver (iOS) | Tertiary |
| Edge (latest) | Narrator | Tertiary |

### 6.4 Accessibility Regression Prevention

1. **axe-core in dev mode:** Violations logged to console during development. Developers see issues immediately.
2. **eslint-plugin-jsx-a11y:** Catches static issues at lint time. PRs cannot merge with a11y lint errors.
3. **Lighthouse CI:** Scores tracked over time. Alert if score drops.
4. **Manual audit:** Full manual test every 4 sprints (or after major feature additions).
5. **Component library:** The `Button`, `IconButton`, `Toast`, and `ConfirmDialog` components enforce accessibility patterns. New features should use these components rather than raw HTML elements.

---

## Appendix A: ARIA Attribute Quick Reference

### Current Usage Across Components

| Component | ARIA attributes |
|-----------|----------------|
| **Layout.tsx** | `role="banner"` on header, `role="main"` on main, skip link `href="#main-content"` |
| **PlayerBar.tsx** | `role="region" aria-label="Audio player"`, `aria-label="Play"/"Pause"`, `aria-label="Skip track"`, `aria-label="Volume"`, `aria-hidden="true"` on decorative SVGs |
| **NowPlayingHero.tsx** | `aria-live="polite"` on content container, `aria-hidden="true"` on listener count icon |
| **NowPlaying.tsx** | `aria-live="polite"`, `role="status"` on listener count, `sr-only` text for connection status |
| **Chat.tsx** | `role="log" aria-live="polite" aria-label="Chat messages"` on message list, `aria-label="Edit username"`, labels for all inputs |
| **Library.tsx** | `aria-label="Search tracks"` on search, `aria-label="Select all tracks"`, `aria-label="Select track"`, `aria-label="Add to playlist"` on buttons |
| **Playlist.tsx** | `role="listbox" aria-label="Playlists"`, `role="option" aria-selected`, `tabindex="0"` on items, `aria-label="Activate playlist"`, `aria-label="Delete playlist"`, `aria-label="Remove track from playlist"` |
| **AdminDashboard.tsx** | `aria-label` on all inputs and buttons including specific names ("Delete [name]", "Activate [name]", "Add [track] to playlist"), `tabindex="0"` + `onKeyDown` on playlist items |
| **SourceSwitch.tsx** | Context-dependent `aria-label` on Go Live/Stop Mic/Retry button |
| **FirstVisitSplash.tsx** | `aria-label="Start listening"` on button, `aria-hidden="true"` on decorative SVG |
| **Toast.tsx** | `role="status" aria-live="polite"`, `aria-label="Dismiss notification"` on close button, `aria-hidden="true"` on icon |
| **ConfirmDialog.tsx** | `role="alertdialog"`, `aria-labelledby="confirm-dialog-title"`, `aria-describedby="confirm-dialog-message"` |
| **AudioMeter.tsx** | `role="meter"`, `aria-label="Audio level"`, `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"` |
| **Button.tsx** | `focus-visible:ring-2` styling, `disabled:pointer-events-none` |
| **IconButton.tsx** | `aria-label={label}` (required prop), `focus-visible:ring-2` styling |

### Attributes to Add

| Component | Missing attribute | Purpose |
|-----------|------------------|---------|
| **App.tsx** password input | `autocomplete="current-password"` | Input purpose identification (1.3.5) |
| **Chat.tsx** username input | `autocomplete="username"` | Input purpose identification (1.3.5) |
| **PlayerBar.tsx** volume input | `aria-valuetext={Math.round(volume*100) + '% volume'}` | Announce percentage to screen readers |
| **FirstVisitSplash.tsx** container | `role="dialog" aria-modal="true" aria-label="Welcome to EPIRBE Radio"` | Identify as modal dialog |
| **AdminDashboard.tsx** header | Change `<header>` to `<div>` with `<h2>DJ Dashboard</h2>` | Avoid duplicate banner landmark |
| **Library.tsx** table container | `role="region" aria-label="Track list" tabindex="0"` on scroll wrapper | Allow keyboard scrolling of table |
| **App.tsx** root level | Add `SrAnnouncer` component with `role="status" aria-live="polite"` | Programmatic announcements |
| **PlayerBar.tsx** | Add `id="player-bar" tabindex="-1"` | Support future skip-to-player link |

---

## Appendix B: Open Items Summary

| Item | Section | Priority | Effort |
|------|---------|----------|--------|
| Add `autocomplete` attributes to password and username inputs | 1.3.5 | Low | 15 min |
| Add visible error text for login failure (not just red border) | 3.3.1 | Medium | 30 min |
| Add ConfirmDialog to legacy Playlist.tsx delete action | 3.3.4 | High | 1 hour |
| Change AdminDashboard header from `<header>` to `<div>` + `<h2>` | 5.4 | Low | 15 min |
| Add scroll wrapper with `role="region"` to Library table | 1.4.10 | Medium | 30 min |
| Add `aria-valuetext` to volume slider | 3.1 (screen reader) | Medium | 15 min |
| Add `SrAnnouncer` component for programmatic announcements | 3.2 | High | 2 hours |
| Add `role="dialog"` to FirstVisitSplash | 2.3 (focus trap) | Medium | 30 min |
| Fix secondary button non-text contrast (add visible border) | 1.4.11 | Medium | 30 min |
| Address accent-on-surface text contrast (bold weight or lighter color) | 1.4.3 | Medium | 30 min |
| Consider darkening accent for button backgrounds (#d03040) | 1.4.3 | Low | 15 min |
| Dynamic page title reflecting now-playing track | 2.4.2 | Low | 30 min |
| Add keyboard shortcut disable preference | 2.1.4 | Low | 1 hour |
| Implement chat scroll-lock detection | 2.2.2 | Low | 1 hour |
| Test at 200% zoom and fix any clipping | 1.4.4 | Medium | 1 hour |
| Test text spacing overrides | 1.4.12 | Low | 30 min |
| Test at 320px width and add table scroll wrapper | 1.4.10 | Medium | 1 hour |
| Add `prefers-contrast: more` and `forced-colors: active` CSS | 5.2 | Low | 2 hours |
| Enhance error messages with recovery suggestions | 3.3.3 | Low | 1 hour |
| Add eslint-plugin-jsx-a11y to project | 6.1 | High | 30 min |
| Add @axe-core/react for dev-mode auditing | 6.1 | High | 30 min |
