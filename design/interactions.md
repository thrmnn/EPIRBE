# EPIRBE Radio -- Interaction Design Specification

**Version:** 1.0
**Date:** 2026-03-20
**Status:** Implementation-ready
**Depends on:** UX Audit (UX_AUDIT.md), Phase 1 accessibility fixes (completed)

---

## Table of Contents

1. [User Flow Maps](#1-user-flow-maps)
2. [Animation Specifications](#2-animation-specifications)
3. [Keyboard Shortcut System](#3-keyboard-shortcut-system)
4. [Micro-interaction Catalog](#4-micro-interaction-catalog)

---

## 1. User Flow Maps

Each flow is documented in the format:

```
User Action -> Visual Response -> System Action -> Completion Feedback
```

All flows include failure branches. Timing values are targets; implementation may use `requestAnimationFrame` for actual frame alignment.

---

### Flow 1: First Visit -> Start Listening

**Entry condition:** `localStorage.getItem("epirbe_visited") === null`

```
1. Page loads
   -> Splash overlay fades in (opacity 0->1, 300ms)
   -> WebSocket connects to /ws/status
   -> Splash displays: logo, "Start Listening" button, listener count, current track (if any)

2. User clicks "Start Listening"
   -> Button shows pressed state (scale 0.97, 100ms)
   -> localStorage.setItem("epirbe_visited", "1")
   -> Splash overlay fades out (opacity 1->0, 400ms, ease-out)
   -> Main layout fades in beneath (opacity 0->1, 400ms, ease-out, staggered 100ms after splash starts fading)
   -> Focus moves to the Play button in PlayerBar

3. Failure: WebSocket fails before click
   -> Splash still appears but listener count shows "0"
   -> Current track shows nothing; fallback text "EPIRBE Radio" remains
   -> "Start Listening" button remains functional (audio may fail later)
```

**Accessibility notes:**
- Splash is a `role="dialog"` with `aria-modal="true"` and `aria-label="Welcome to EPIRBE Radio"`
- Focus is trapped within the splash while visible
- "Start Listening" button is the only focusable element; it receives focus on load
- Screen reader announces: "Welcome to EPIRBE Radio. Start Listening button. [N] listeners."

---

### Flow 2: Play/Pause Toggle

**Trigger:** Click play button, press Space (global), or programmatic call

```
PLAY (from paused state):
1. User clicks Play button or presses Space
   -> Play icon begins morph to Pause icon (see Animation A1, 200ms)
   -> Play button scale pulse (1.0 -> 1.1 -> 1.0, 250ms)
   -> System sets audio.src = "/stream", calls audio.play()
   -> [Awaiting promise]

2a. audio.play() resolves
   -> Playing state = true
   -> Equalizer bars appear in PlayerBar track info area (fade in, 200ms)
   -> PlayerBar border gains subtle accent glow (see Animation A11)
   -> Screen reader announces: "Playing"
   -> aria-label on button updates to "Pause"

2b. audio.play() rejects (autoplay blocked)
   -> Playing state = false
   -> Icon morphs back to Play (200ms)
   -> Yellow warning text appears below track info: "Tap play again -- your browser blocked autoplay"
   -> Screen reader announces: "Playback blocked. Press play again to start."
   -> aria-label remains "Play"

PAUSE (from playing state):
1. User clicks Pause button or presses Space
   -> Pause icon morphs to Play icon (200ms)
   -> audio.pause(); audio.src = ""
   -> Playing state = false
   -> Equalizer bars fade out (200ms)
   -> PlayerBar glow fades (300ms)
   -> Screen reader announces: "Paused"
   -> aria-label updates to "Play"
```

**Edge case:** If Space is pressed while a text input is focused, the Space key types a space character instead. See Section 3 for focus-guard logic.

---

### Flow 3: Skip Track

**Trigger:** Click skip button or press N (global)
**Precondition:** Not in live broadcast mode (skip button hidden during live)

```
1. User clicks Skip button or presses N
   -> Skip button flash animation (background: radio-border -> radio-accent/30 -> radio-border, 300ms)
   -> POST /api/stream/skip fires
   -> Current track info in PlayerBar fades out (opacity 1->0.3, 150ms)

2a. Skip succeeds + WebSocket delivers new metadata
   -> New track info fades in (opacity 0.3->1, 200ms)
   -> NowPlayingHero updates: title crossfade (old out 150ms, new in 200ms)
   -> Equalizer bars continue uninterrupted
   -> Toast: "[New Track Title] now playing" (info variant, if track title available)
   -> Screen reader announces: "Skipped. Now playing: [title] by [artist]"

2b. Skip fails (API error)
   -> Track info opacity restores to 1 (200ms)
   -> Toast: "Failed to skip track" (error variant)
   -> Screen reader announces: "Error. Failed to skip track."
   -> Skip button is not disabled; user can retry

3. If in live mode
   -> Skip button is not rendered (hidden via conditional)
   -> N key shortcut is a no-op
```

---

### Flow 4: Adjust Volume

**Trigger:** Drag volume slider, press Up/Down arrows (global), press M to mute

```
SLIDER DRAG:
1. User hovers volume slider thumb
   -> Thumb grows (see Animation A10, width 12px->16px, 150ms)

2. User drags slider
   -> audio.volume updates in real time (no debounce)
   -> Slider track fill updates instantly (CSS accent-color or custom track fill)
   -> No network call (volume is client-side only)
   -> No toast (too frequent)
   -> aria-valuenow updates on the range input

3. User releases slider
   -> Thumb shrinks back (16px->12px, 150ms)

KEYBOARD VOLUME (Up/Down arrows):
1. User presses Up or Down arrow (when not in text input)
   -> Volume adjusts by 5% (0.05) per keypress
   -> Clamped to [0, 1]
   -> Slider position updates to match
   -> Screen reader announces: "Volume [N] percent" (via aria-valuetext on the range input)

MUTE TOGGLE (M key):
1. User presses M
   -> If not muted: audio.volume = 0, store previous volume, volume icon changes to muted variant
   -> If muted: audio.volume = previousVolume, volume icon restores
   -> Screen reader announces: "Muted" or "Unmuted. Volume [N] percent."
```

---

### Flow 5: Search Library

**Trigger:** Type in library search input, or press / to focus search

```
1. User presses / (global shortcut)
   -> Library search input receives focus
   -> Input border transitions to accent color (border-radio-border -> border-radio-accent, 200ms)
   -> Screen reader announces: "Search tracks, text field"

2. User types characters
   -> Each keystroke resets a 300ms debounce timer
   -> After 300ms of inactivity:
     -> Loading indicator appears (spinner or shimmer skeleton in track list area)
     -> GET /api/library/tracks?search={query} fires

3a. Results returned (non-empty)
   -> Skeleton/spinner replaced by track rows
   -> Track rows stagger in (see Animation A8 variant, 30ms delay per row, max 10 rows animated)
   -> Result count shown: "[N] tracks found" as visually hidden live region
   -> Screen reader announces: "[N] results for [query]"

3b. Results returned (empty)
   -> Empty state appears: "No tracks match '[query]'"
   -> Screen reader announces: "No results for [query]"

3c. API error
   -> Track list shows error state: "Search failed. Try again."
   -> Toast: "Search failed" (error variant)

4. User clears search (Backspace to empty, or Escape)
   -> Debounce fires with empty query
   -> Full library loads
   -> Screen reader announces: "Search cleared. Showing all tracks."
```

---

### Flow 6: Add Track to Playlist

**Trigger:** Click + button on a track row in the Library (admin view)
**Precondition:** A playlist must be selected

```
1a. Playlist IS selected -- user clicks + button on a track row
   -> + button briefly rotates and scales (rotate 0->90deg, scale 1->1.2->1, 250ms)
   -> POST /api/playlists/{id}/tracks fires with { track_id }
   -> Track row flashes with highlight (see Animation A5)

2a. Add succeeds
   -> Playlist track count in sidebar increments (number change with brief scale pulse, 200ms)
   -> Toast: "[Track Title] added to [Playlist Name]" (success variant)
   -> Screen reader announces: "[Track Title] added to [Playlist Name]"
   -> If the playlist tracks panel is visible, new track appears at bottom with slide-in

2b. Add fails (duplicate or API error)
   -> Toast: "Failed to add track" or "Track already in playlist" (error variant)
   -> Screen reader announces the error message

1b. No playlist selected -- + button is disabled
   -> Button shows disabled styling (opacity 0.5, cursor not-allowed)
   -> title attribute: "Select a playlist first"
   -> Click does nothing
   -> Screen reader announces: "Add to playlist, button, disabled"
```

---

### Flow 7: Create Playlist

**Trigger:** Type name in playlist creation input + press Enter or click Create

```
1. User types playlist name
   -> Input accepts text, standard text field behavior
   -> Create button enables when input is non-empty (opacity 0.5->1, 150ms)

2. User presses Enter or clicks Create
   -> Create button shows loading state (text changes to spinner or "Creating...")
   -> POST /api/playlists/ fires with { name }

3a. Creation succeeds
   -> Input clears
   -> New playlist appears in playlist list with slide-in animation (translateY 10px->0, opacity 0->1, 200ms)
   -> New playlist briefly flashes with accent border (border-radio-accent glow, 600ms fade)
   -> Toast: "Playlist '[name]' created" (success variant)
   -> Screen reader announces: "Playlist [name] created"
   -> Focus remains in the playlist name input for rapid creation of multiple playlists

3b. Creation fails
   -> Input retains text (user can fix and retry)
   -> Create button returns to normal state
   -> Toast: "Failed to create playlist" (error variant)
   -> Screen reader announces the error
```

---

### Flow 8: Activate Playlist

**Trigger:** Click "Activate" button on a playlist item (admin view)

```
1. User clicks Activate button
   -> Button text changes to spinner/loading indicator
   -> POST /api/playlists/{id}/activate fires

2a. Activation succeeds
   -> Previously active playlist loses its active styling (accent text -> normal, 200ms)
   -> Newly activated playlist gains active styling:
     - Checkmark icon replaces "Activate" text
     - Border pulses with accent color (see Animation A8-activate, 600ms)
   -> Liquidsoap switches source to this playlist
   -> NowPlaying updates via WebSocket when first track of new playlist starts
   -> PlayerBar track info crossfades to new track
   -> Toast: "[Playlist Name] activated. Now playing." (success variant)
   -> Screen reader announces: "[Playlist Name] activated. Now playing."

2b. Activation fails
   -> Button returns to "Activate" text
   -> Toast: "Failed to activate playlist" (error variant)
   -> Screen reader announces the error
```

---

### Flow 9: Delete Playlist

**Trigger:** Click delete (trash) button on a playlist item (admin view)

```
1. User clicks Delete button
   -> ConfirmDialog opens (see Animation A4):
     - Backdrop fades in (opacity 0->0.6, 200ms)
     - Dialog scales in (scale 0.95->1, opacity 0->1, 200ms, ease-out)
     - Title: "Delete Playlist"
     - Message: "Are you sure you want to delete '[Playlist Name]'? This cannot be undone."
     - Buttons: [Cancel] [Delete] (danger variant)
   -> Focus moves to Cancel button (safe default)

2a. User confirms deletion
   -> Dialog closes (reverse of open animation, 150ms)
   -> DELETE /api/playlists/{id} fires
   -> Playlist row collapses (height auto->0, opacity 1->0, 200ms)
   -> If this was the selected playlist, track list clears
   -> Focus returns to previous element (the next playlist item, or the create input if none remain)
   -> Toast: "Playlist '[name]' deleted" (success variant)
   -> Screen reader announces: "Playlist [name] deleted"

2b. User cancels
   -> Dialog closes (150ms)
   -> Focus returns to the delete button that triggered the dialog
   -> No API call, no state change

2c. User presses Escape
   -> Same as cancel (2b)

2d. Deletion fails
   -> Toast: "Failed to delete playlist" (error variant)
   -> Playlist row remains visible (no animation)
```

---

### Flow 10: Go Live

**Trigger:** Click "Go Live" button in SourceSwitch (admin view only)

```
1. User clicks "Go Live"
   -> ConfirmDialog opens:
     - Title: "Go Live"
     - Message: "You will broadcast your microphone to all listeners. Continue?"
     - Buttons: [Cancel] [Go Live] (primary variant)
   -> Focus on Cancel button

2. User confirms
   -> Dialog closes
   -> Button text changes to "Connecting..."
   -> Button color changes to yellow/warning
   -> connState = "connecting"
   -> Browser permission dialog for microphone appears

3a. Mic permission granted
   -> WebSocket opens to /ws/mic
   -> AudioContext initializes at 44100 Hz
   -> ScriptProcessorNode begins streaming audio data
   -> connState = "live"
   -> Button changes to "Stop Mic" (red/danger styling)
   -> LIVE badge appears in:
     - Layout header (red dot + "LIVE" text, slide-in from left, 200ms)
     - PlayerBar (alongside track info)
     - NowPlayingHero (pulsing badge, see Animation A6)
   -> AudioMeter activates (green/yellow/red level bar)
   -> Skip button hides in PlayerBar
   -> Screen reader announces: "Broadcasting live. Microphone active."
   -> Toast: "You are now live" (success variant)

3b. Mic permission denied
   -> connState = "error"
   -> Button changes to "Retry" (yellow styling)
   -> Error text: "Microphone access denied"
   -> Screen reader announces: "Error. Microphone access denied."
   -> Toast: "Microphone permission denied" (error variant)

3c. WebSocket connection fails
   -> connState = "error"
   -> Error text: "Connection error"
   -> Screen reader announces: "Error. Connection failed."

4. User clicks "Stop Mic" (while live)
   -> Cleanup: disconnect processor, stop media tracks, close WebSocket, close AudioContext
   -> connState = "idle"
   -> LIVE badges disappear (fade out 200ms)
   -> Skip button reappears in PlayerBar
   -> AudioMeter deactivates (level drops to 0, 200ms transition)
   -> Button returns to "Go Live" (secondary styling)
   -> Screen reader announces: "Broadcast ended."
   -> Toast: "Broadcast ended" (info variant)
```

---

### Flow 11: Send Chat Message

**Trigger:** Type message in chat input + press Enter

```
1. User types message in chat input
   -> Standard text field behavior
   -> Send button is visually distinct when input is non-empty (accent color)

2. User presses Enter or clicks Send
   -> Input clears immediately (optimistic)
   -> WebSocket sends { username, message } to /ws/chat
   -> Message appears at bottom of chat list (see Animation A9)
   -> Chat auto-scrolls to bottom (smooth scroll, 200ms)
   -> Screen reader: the chat log has aria-live="polite", so new messages are announced
   -> Announcement: "[username]: [message]"

3. If WebSocket is disconnected
   -> Input is disabled, placeholder shows "Connecting..."
   -> Send button is disabled
   -> Screen reader: input has aria-disabled="true"

4. If input is empty and user presses Enter
   -> No action, no error
```

---

### Flow 12: Login as DJ

**Trigger:** Click DJ button in header (when not authenticated)

```
1. User clicks "DJ" button in header
   -> Password input slides in from right (translateX 20px->0, opacity 0->1, 200ms)
   -> Login button appears alongside
   -> Password input receives focus

2. User types password and presses Enter (or clicks Login)
   -> POST /api/auth/login fires with { password }
   -> Login button shows brief loading state

3a. Authentication succeeds
   -> Token stored in localStorage
   -> isAdmin = true
   -> Password input and Login button slide out (reverse of entry, 150ms)
   -> DJ button text changes to "Dashboard"
   -> View switches to AdminDashboard (see Flow 13)
   -> Toast: "Welcome, DJ" (success variant)
   -> Screen reader announces: "Logged in as DJ. Dashboard view."

3b. Authentication fails
   -> Password input border turns red (border-red-500, 200ms)
   -> Input shakes briefly (translateX: 0 -> -4px -> 4px -> -4px -> 0, 300ms, see Animation A-shake)
   -> loginError = true
   -> Password input retains text; focus remains for retry
   -> Screen reader announces: "Login failed. Incorrect password."

4. User clicks DJ button again (to dismiss without logging in)
   -> Password input slides out (150ms)
   -> No state change
```

---

### Flow 13: Switch Admin <-> Listener

**Trigger:** Click "Listener" button in admin header, or "Dashboard" button in listener header

```
LISTENER -> ADMIN:
1. User clicks "Dashboard" button (isAdmin must be true)
   -> showAdmin = true
   -> Current listener content fades out (opacity 1->0, 150ms)
   -> Admin dashboard fades in (opacity 0->1, 200ms, delayed 100ms)
   -> Admin header slides down from top (translateY -10px->0, 200ms)
   -> Focus moves to first interactive element in admin dashboard (SourceSwitch "Go Live" button)
   -> Screen reader announces: "DJ Dashboard. Mic control, playlist management, library, and chat panels."

ADMIN -> LISTENER:
1. User clicks "Listener View" or "Listener" button
   -> showAdmin = false
   -> Admin content fades out (opacity 1->0, 150ms)
   -> Listener content fades in (opacity 0->1, 200ms, delayed 100ms)
   -> Focus moves to NowPlayingHero region
   -> Screen reader announces: "Listener view. Now playing: [title] by [artist]."

LOGOUT:
1. User clicks "Logout" in admin view
   -> Token removed from localStorage
   -> isAdmin = false, showAdmin = false
   -> Transition same as Admin -> Listener
   -> DJ button in header reverts to "DJ" text
   -> Screen reader announces: "Logged out. Listener view."
```

---

## 2. Animation Specifications

### Design Principles

- All durations under 400ms for UI response; decorative/ambient animations can be longer
- Easing: `ease-out` for entrances, `ease-in` for exits, `ease-in-out` for loops
- Every animation has a `prefers-reduced-motion` alternative
- No animation should be required to understand state; color, text, and icon changes carry meaning independently

### Token Reference

```
--duration-instant: 0ms
--duration-fast:    100ms
--duration-normal:  200ms
--duration-slow:    300ms
--duration-slower:  400ms

--ease-out:    cubic-bezier(0.0, 0.0, 0.2, 1)
--ease-in:     cubic-bezier(0.4, 0.0, 1, 1)
--ease-in-out: cubic-bezier(0.4, 0.0, 0.2, 1)
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)
```

---

### A1: Play Button Icon Morph (Play <-> Pause)

| Property | Value |
|----------|-------|
| **Trigger** | Click play/pause button, Space key |
| **Element** | Play/Pause SVG icon within the PlayerBar button |
| **Animated properties** | `opacity` of each icon SVG |
| **Duration** | 200ms |
| **Easing** | ease-out |
| **Start state (play->pause)** | Play icon opacity 1; Pause icon opacity 0 |
| **End state (play->pause)** | Play icon opacity 0; Pause icon opacity 1 |
| **Technique** | Both SVGs rendered; toggle opacity and `pointer-events`. Or use CSS clip-path morph on a single path for smoother effect. |
| **Reduced motion** | Instant swap (0ms), no crossfade |

**Scale pulse on the button container:**

| Property | Value |
|----------|-------|
| **Animated property** | `transform: scale()` |
| **Keyframes** | 0%: scale(1) -> 50%: scale(1.1) -> 100%: scale(1) |
| **Duration** | 250ms |
| **Easing** | ease-spring |
| **Reduced motion** | No scale change |

---

### A2: Equalizer Bars (Existing -- Refined)

| Property | Value |
|----------|-------|
| **Trigger** | `playing === true` |
| **Element** | 3 (PlayerBar) or 5 (NowPlayingHero) `<span>` bars |
| **Animated property** | `height` |
| **Keyframes (eq-1)** | 0%,100%: 4px -> 50%: 16px |
| **Keyframes (eq-2)** | 0%,100%: 12px -> 50%: 4px |
| **Keyframes (eq-3)** | 0%,100%: 8px -> 50%: 16px |
| **Duration** | eq-1: 800ms, eq-2: 600ms, eq-3: 900ms |
| **Easing** | ease-in-out |
| **Iteration** | infinite |
| **Stagger** | NowPlayingHero bars 4 and 5 use animationDelay: 0.2s and 0.1s |
| **Reduced motion** | Static bars at mid-height (10px). No animation. Use a CSS class `.eq-bar--static` with fixed height. |
| **Entry** | Bars fade in (opacity 0->1, 200ms) when playing starts |
| **Exit** | Bars fade out (opacity 1->0, 200ms) when paused |

**CSS implementation reference:**
```css
@media (prefers-reduced-motion: reduce) {
  .animate-eq-1,
  .animate-eq-2,
  .animate-eq-3 {
    animation: none !important;
    height: 10px !important;
  }
}
```

---

### A3: Toast Slide-In / Auto-Dismiss

| Property | Value |
|----------|-------|
| **Trigger** | `toast()` function called |
| **Element** | Toast component in fixed bottom-right container |
| **Entry animation** | `translateY(1rem)` -> `translateY(0)`, `opacity 0` -> `opacity 1` |
| **Entry duration** | 300ms |
| **Entry easing** | ease-out |
| **Auto-dismiss delay** | 4000ms after entry completes |
| **Exit animation** | `opacity 1` -> `opacity 0`, `translateX(0)` -> `translateX(1rem)` |
| **Exit duration** | 200ms |
| **Exit easing** | ease-in |
| **Stacking** | Max 3 toasts visible. Newest at bottom. Older toasts shift up with 150ms transition. |
| **Manual dismiss** | Click X button triggers exit immediately |
| **Reduced motion** | No translate. Instant appear (opacity snap), fade out over 200ms only. |

**Tailwind keyframe (already exists as `slideUp`):**
```js
slideUp: {
  "0%": { transform: "translateY(1rem)", opacity: "0" },
  "100%": { transform: "translateY(0)", opacity: "1" },
}
```

**Add exit keyframe:**
```js
slideOut: {
  "0%": { transform: "translateX(0)", opacity: "1" },
  "100%": { transform: "translateX(1rem)", opacity: "0" },
}
```

---

### A4: Dialog Backdrop + Content Scale-In

| Property | Value |
|----------|-------|
| **Trigger** | `open` prop set to `true` on ConfirmDialog |
| **Backdrop** | `opacity 0` -> `opacity 0.6`, `backdrop-filter: blur(0)` -> `blur(4px)` |
| **Backdrop duration** | 200ms, ease-out |
| **Content panel** | `scale(0.95) opacity(0)` -> `scale(1) opacity(1)` |
| **Content duration** | 200ms, ease-out, delayed 50ms after backdrop starts |
| **Exit (reverse)** | Content: scale(1)->scale(0.97), opacity 1->0, 150ms ease-in. Backdrop: opacity 0.6->0, 150ms ease-in, delayed 50ms. |
| **Reduced motion** | No scale. Backdrop: instant opacity. Content: instant opacity (or 100ms fade only). |

**Implementation note:** The existing `ConfirmDialog` uses `<dialog>` with `showModal()`. The `::backdrop` pseudo-element can be animated with CSS:
```css
dialog::backdrop {
  background: rgba(0, 0, 0, 0);
  backdrop-filter: blur(0);
  transition: background 200ms ease-out, backdrop-filter 200ms ease-out;
}
dialog[open]::backdrop {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
}
```

---

### A5: Track Row Highlight Flash (Add to Playlist)

| Property | Value |
|----------|-------|
| **Trigger** | Track successfully added to a playlist |
| **Element** | The `<tr>` or `<div>` row of the track that was added |
| **Animated property** | `background-color` |
| **Keyframes** | 0%: transparent -> 30%: radio-accent/20 (#e63946 at 20% opacity) -> 100%: transparent |
| **Duration** | 600ms |
| **Easing** | ease-out |
| **Reduced motion** | No background flash. Instead, a 2px left border in accent color appears for 1 second, then fades. |

**CSS:**
```css
@keyframes row-flash {
  0%   { background-color: transparent; }
  30%  { background-color: rgba(230, 57, 70, 0.2); }
  100% { background-color: transparent; }
}
```

---

### A6: LIVE Badge Pulse

| Property | Value |
|----------|-------|
| **Trigger** | `connState === "live"` |
| **Element** | LIVE badge (header, PlayerBar, NowPlayingHero) |
| **Animated property** | `box-shadow` (glow), inner dot `opacity` |
| **Keyframes (glow)** | 0%,100%: `box-shadow: 0 0 0 0 rgba(239,68,68,0.4)` -> 50%: `box-shadow: 0 0 8px 2px rgba(239,68,68,0.2)` |
| **Keyframes (dot)** | Standard `animate-pulse` (opacity 1->0.5->1) |
| **Duration** | Glow: 2000ms, ease-in-out, infinite. Dot: 1500ms (Tailwind default pulse). |
| **Reduced motion** | Static red dot, no pulsing. Static glow at 50% intensity. Apply `animation: none`. |

**CSS:**
```css
@keyframes live-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
  50%      { box-shadow: 0 0 8px 2px rgba(239, 68, 68, 0.2); }
}

@media (prefers-reduced-motion: reduce) {
  .live-badge {
    animation: none !important;
    box-shadow: 0 0 4px 1px rgba(239, 68, 68, 0.15);
  }
  .live-badge .live-dot {
    animation: none !important;
    opacity: 1;
  }
}
```

---

### A7: View Transition (Listener <-> Admin)

| Property | Value |
|----------|-------|
| **Trigger** | `showAdmin` state toggles |
| **Technique** | Crossfade. Outgoing view fades to opacity 0 while incoming fades from opacity 0. |
| **Outgoing** | `opacity 1` -> `opacity 0`, duration 150ms, ease-in |
| **Incoming** | `opacity 0` -> `opacity 1`, duration 200ms, ease-out, delayed 100ms after outgoing starts |
| **Total perceived duration** | ~300ms |
| **Alternative (future)** | If using View Transitions API: `document.startViewTransition()` with `view-transition-name` on main content area for browser-native crossfade. |
| **Reduced motion** | Instant swap. No fade. Content simply replaces. |

**Implementation approach:**
```tsx
// Wrapper component
<div
  className={`transition-opacity duration-200 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
>
  {showAdmin ? <AdminDashboard /> : <ListenerView />}
</div>
```

---

### A8: Skeleton Shimmer (Loading States)

| Property | Value |
|----------|-------|
| **Trigger** | Data is loading (API call in progress) |
| **Element** | Placeholder rectangles matching expected content shape |
| **Animated property** | `background-position` of a linear gradient |
| **Gradient** | `linear-gradient(90deg, radio-border 25%, radio-border/60 50%, radio-border 75%)` |
| **Background size** | 200% 100% |
| **Keyframes** | `background-position: 200% 0` -> `background-position: -200% 0` |
| **Duration** | 1500ms, ease-in-out, infinite |
| **Reduced motion** | Static gray rectangle (radio-border color). No shimmer. |

**Skeleton shapes by context:**
- Track list: 6 rows of rectangles (title-width: 60%, artist-width: 30%, duration-width: 10%)
- NowPlayingHero: Large centered rectangle (title) + smaller (artist)
- Chat: 4 message-shaped rectangles of varying widths

**CSS:**
```css
@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    #1e1e2e 25%,
    rgba(30, 30, 46, 0.6) 50%,
    #1e1e2e 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: 4px;
}

@media (prefers-reduced-motion: reduce) {
  .skeleton {
    animation: none;
    background: #1e1e2e;
  }
}
```

---

### A9: Chat Message Slide-In

| Property | Value |
|----------|-------|
| **Trigger** | New message added to chat `<ul>` |
| **Element** | The new `<li>` element |
| **Animated properties** | `translateY`, `opacity` |
| **Start** | `translateY(8px)`, `opacity: 0` |
| **End** | `translateY(0)`, `opacity: 1` |
| **Duration** | 200ms |
| **Easing** | ease-out |
| **Reduced motion** | Instant appear, no translate |

**CSS:**
```css
@keyframes messageIn {
  from { transform: translateY(8px); opacity: 0; }
  to   { transform: translateY(0);   opacity: 1; }
}

.chat-message-enter {
  animation: messageIn 200ms ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .chat-message-enter {
    animation: none;
  }
}
```

---

### A10: Volume Slider Thumb Grow on Hover

| Property | Value |
|----------|-------|
| **Trigger** | Mouse hover or focus on volume `<input type="range">` |
| **Element** | The slider thumb (`::-webkit-slider-thumb`, `::-moz-range-thumb`) |
| **Animated property** | `width`, `height` (or `transform: scale()`) |
| **Start** | 12px x 12px |
| **End** | 16px x 16px |
| **Duration** | 150ms |
| **Easing** | ease-out |
| **Reduced motion** | No size change. Thumb stays at 14px (compromise size). |

**CSS:**
```css
input[type="range"]::-webkit-slider-thumb {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #e63946;
  transition: width 150ms ease-out, height 150ms ease-out;
  cursor: pointer;
}

input[type="range"]:hover::-webkit-slider-thumb,
input[type="range"]:focus-visible::-webkit-slider-thumb {
  width: 16px;
  height: 16px;
}

@media (prefers-reduced-motion: reduce) {
  input[type="range"]::-webkit-slider-thumb {
    width: 14px;
    height: 14px;
    transition: none;
  }
  input[type="range"]:hover::-webkit-slider-thumb,
  input[type="range"]:focus-visible::-webkit-slider-thumb {
    width: 14px;
    height: 14px;
  }
}
```

---

### A11: PlayerBar Glow When Playing

| Property | Value |
|----------|-------|
| **Trigger** | `playing === true` |
| **Element** | PlayerBar container `<div>` |
| **Animated property** | `box-shadow` (top edge glow) |
| **Start (not playing)** | `box-shadow: none` (only `border-t` visible) |
| **End (playing)** | `box-shadow: 0 -1px 12px 0 rgba(230, 57, 70, 0.15)` |
| **Transition** | 300ms ease-out on enter, 300ms ease-in on exit |
| **Reduced motion** | No glow animation. Instead, a static 2px top border in accent color to indicate playing state. |

**Implementation:**
```tsx
<div
  className={`fixed bottom-0 ... ${
    playing ? 'shadow-[0_-1px_12px_0_rgba(230,57,70,0.15)]' : ''
  } transition-shadow duration-300`}
>
```

---

### A-shake: Input Error Shake

| Property | Value |
|----------|-------|
| **Trigger** | Login password rejected |
| **Element** | Password `<input>` |
| **Animated property** | `translateX` |
| **Keyframes** | 0%: 0 -> 20%: -4px -> 40%: 4px -> 60%: -4px -> 80%: 2px -> 100%: 0 |
| **Duration** | 300ms |
| **Easing** | ease-in-out |
| **Reduced motion** | No shake. Border color change to red is sufficient indicator. |

**CSS:**
```css
@keyframes shake {
  0%        { transform: translateX(0); }
  20%, 60%  { transform: translateX(-4px); }
  40%       { transform: translateX(4px); }
  80%       { transform: translateX(2px); }
  100%      { transform: translateX(0); }
}
```

---

### A-splash: Splash Screen Entry/Exit

| Property | Value |
|----------|-------|
| **Entry (page load)** | Logo: `scale(0.8) opacity(0)` -> `scale(1) opacity(1)`, 400ms, ease-out. Title: same, delayed 100ms. Button: same, delayed 200ms. |
| **Exit (Start Listening)** | Entire splash: `opacity 1` -> `opacity 0`, 400ms, ease-out. Simultaneous: main content behind becomes visible. |
| **Reduced motion** | No scale. Instant opacity for all elements. Exit: instant. |

---

## 3. Keyboard Shortcut System

### 3.1 Global Shortcuts

| Shortcut | Action | Context | Notes |
|----------|--------|---------|-------|
| `Space` | Play / Pause toggle | Global | Suppressed when focus is in a text input, textarea, or contenteditable |
| `N` | Skip to next track | Global | Suppressed in text inputs. No-op during live broadcast. |
| `M` | Mute / Unmute toggle | Global | Suppressed in text inputs. |
| `ArrowUp` | Volume up (+5%) | Global | Suppressed in text inputs. Suppressed when focus is on a range input (native behavior). |
| `ArrowDown` | Volume down (-5%) | Global | Same as ArrowUp. |
| `/` | Focus search input | Global | Suppressed in text inputs. Prevents the "/" character from being typed in the search input itself. |
| `Escape` | Close dialog / modal / exit admin | Context-dependent | Closes topmost overlay. If in admin view with no overlay, returns to listener view. If on splash, no action. |
| `?` | Show keyboard shortcuts overlay | Global | Suppressed in text inputs. Toggles the overlay on/off. |
| `Ctrl+K` / `Cmd+K` | Open command bar (future) | Global | Always active, even in text inputs. Standard convention. |

### 3.2 Focus-Guard Implementation

The shortcut handler must check whether the active element is a text input before processing single-character shortcuts. Multi-key shortcuts (Ctrl+K) bypass this guard.

```typescript
// Pseudocode for the keyboard shortcut hook

function useKeyboardShortcuts(handlers: ShortcutMap) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Multi-key shortcuts always fire
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        handlers.openCommandBar();
        return;
      }

      // Single-key shortcuts: check if we're in a text input
      const tag = (document.activeElement as HTMLElement)?.tagName;
      const isInput = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
      const isContentEditable = (document.activeElement as HTMLElement)?.isContentEditable;

      // For INPUT, further check: only suppress for text-like inputs
      const inputType = (document.activeElement as HTMLInputElement)?.type;
      const isTextInput = isInput && (
        !inputType || // default is text
        ['text', 'search', 'password', 'email', 'url', 'tel', 'number'].includes(inputType)
      );

      if (isTextInput || isContentEditable) {
        // Only Escape is allowed from within text inputs
        if (e.key === 'Escape') {
          // Blur the input, or close overlay
          (document.activeElement as HTMLElement)?.blur();
          return;
        }
        return; // Block all other single-key shortcuts
      }

      // Range inputs: allow Space but block arrows (native range behavior)
      const isRange = isInput && inputType === 'range';

      switch (e.key) {
        case ' ':
          e.preventDefault();
          handlers.togglePlay();
          break;
        case 'n':
        case 'N':
          handlers.skipTrack();
          break;
        case 'm':
        case 'M':
          handlers.toggleMute();
          break;
        case 'ArrowUp':
          if (!isRange) {
            e.preventDefault();
            handlers.volumeUp();
          }
          break;
        case 'ArrowDown':
          if (!isRange) {
            e.preventDefault();
            handlers.volumeDown();
          }
          break;
        case '/':
          e.preventDefault();
          handlers.focusSearch();
          break;
        case '?':
          handlers.toggleShortcutsOverlay();
          break;
        case 'Escape':
          handlers.escape();
          break;
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}
```

### 3.3 Keyboard Shortcuts Overlay

**Triggered by:** `?` key (global)
**Appearance:** Modal overlay (same animation as ConfirmDialog, A4), centered, max-width 480px
**Content:** Two-column table of all shortcuts with their descriptions
**Dismiss:** Press `?` again, press `Escape`, or click backdrop

**Accessibility:**
- `role="dialog"` with `aria-label="Keyboard shortcuts"`
- Focus trap while open
- Focus returns to previously focused element on close

**Content structure:**
```
KEYBOARD SHORTCUTS
---
Playback
  Space       Play / Pause
  N           Skip track
  M           Mute / Unmute
  Up/Down     Volume

Navigation
  /           Focus search
  Escape      Close / Back
  ?           This help
  Ctrl+K      Command bar
```

### 3.4 Visual Feedback for Shortcuts

When a keyboard shortcut fires, the corresponding UI element should show a brief visual indicator as if it were clicked:

- **Space (Play/Pause):** Play button shows the scale pulse (A1)
- **N (Skip):** Skip button shows the flash animation
- **M (Mute):** Volume icon briefly scales
- **Up/Down (Volume):** Volume slider thumb jumps to new position with a 100ms transition
- **/ (Search):** Search input border animates to accent color

This visual feedback connects the keyboard action to the UI element, helping users learn the spatial layout.

---

## 4. Micro-interaction Catalog

### 4.1 Button Press Feedback

All interactive buttons (not icon buttons) respond to `mousedown` / `touchstart` with a subtle scale:

| State | Transform | Duration |
|-------|-----------|----------|
| Default | `scale(1)` | -- |
| Pressed (`:active`) | `scale(0.97)` | 50ms, ease-in |
| Released | `scale(1)` | 100ms, ease-out |
| Reduced motion | No scale change | -- |

**CSS:**
```css
button:active:not(:disabled) {
  transform: scale(0.97);
}
```

### 4.2 Hover State Transitions

All hover state changes use `transition-all` with 150ms duration (already applied via Tailwind `transition-all` class). Specific transitions:

| Element | Hover change | Duration |
|---------|-------------|----------|
| Track rows | `background: transparent` -> `radio-border/50` | 150ms |
| Playlist items | `border-color: radio-border` -> `radio-muted` | 150ms |
| Icon buttons | `background: transparent` -> `radio-border` | 150ms |
| Text links | `color: radio-muted` -> `radio-accent` | 150ms |
| Play button | `filter: brightness(1)` -> `brightness(1.1)` | 150ms |

### 4.3 Focus Indicator Refinement

The current global `focus-visible` style is:
```css
*:focus-visible {
  outline: 2px solid #ffffff;
  outline-offset: 2px;
}
```

Enhanced specification per component:

| Component | Focus indicator |
|-----------|----------------|
| Buttons (primary/accent bg) | White 2px outline, 2px offset |
| Buttons (secondary/ghost) | White 2px outline, 2px offset |
| Text inputs | Border color changes to `radio-accent` + white 2px outline, 2px offset |
| Range inputs | White 2px outline on thumb (browser-dependent) |
| Playlist items (role="option") | White 2px outline + subtle background change |
| Dialog buttons | White 2px outline, 2px offset, offset uses `radio-surface` as ring-offset-color |

### 4.4 Disabled State

All disabled interactive elements:
- `opacity: 0.5`
- `cursor: not-allowed`
- `pointer-events: none` (via Tailwind `disabled:pointer-events-none`)
- No hover/focus transitions
- `aria-disabled="true"` for non-button elements styled as interactive

### 4.5 Connection Status Indicator

The green/red dot in NowPlaying showing WebSocket connection status:

| State | Appearance | Transition |
|-------|------------|------------|
| Connected | Green dot (`bg-green-500`), static | 300ms color transition |
| Disconnected | Red dot (`bg-red-500`), static | 300ms color transition |
| Reconnecting (future) | Yellow dot (`bg-yellow-400`), pulsing | 300ms color + pulse animation |
| Reduced motion | Same colors, no pulse | -- |

### 4.6 List Item Add/Remove Transitions

**Add (new item appears in a list):**
- `max-height: 0; opacity: 0` -> `max-height: auto; opacity: 1`
- Duration: 200ms, ease-out
- Or use `translateY(10px) opacity(0)` -> `translateY(0) opacity(1)`

**Remove (item removed from a list):**
- `opacity: 1; max-height: [current]` -> `opacity: 0; max-height: 0`
- Duration: 200ms, ease-in
- After animation completes, element is removed from DOM

**Reduced motion:** Instant appear/disappear.

### 4.7 Number Increment Animation (Track Count)

When a playlist's track count changes (e.g., track added):

| Property | Value |
|----------|-------|
| **Animated property** | `transform: scale()` on the count text |
| **Keyframes** | 0%: scale(1) -> 50%: scale(1.2) -> 100%: scale(1) |
| **Duration** | 200ms |
| **Easing** | ease-spring |
| **Reduced motion** | No scale. Number simply updates. |

### 4.8 Scroll Behavior

- Chat auto-scroll: `scrollIntoView({ behavior: 'smooth' })` (existing)
- Library scroll: Standard browser scrolling, no custom behavior
- Reduced motion: `scroll-behavior: auto` (instant scroll)

```css
@media (prefers-reduced-motion: reduce) {
  * {
    scroll-behavior: auto !important;
  }
}
```

---

## Appendix: Animation Implementation Checklist

Every animation defined above requires these steps:

1. Add `@keyframes` to `tailwind.config.js` under `theme.extend.keyframes`
2. Add animation shorthand to `theme.extend.animation`
3. Add `prefers-reduced-motion` media query override in `index.css`
4. Add ARIA attributes if animation conveys state (e.g., `aria-live` for content changes)
5. Test with `prefers-reduced-motion: reduce` enabled in OS or browser dev tools
6. Test that information conveyed by animation is also conveyed by text, color, or icon change

### Tailwind Config Additions

```js
// Add to tailwind.config.js theme.extend.keyframes:
{
  // Existing:
  "eq-1": { ... },
  "eq-2": { ... },
  "eq-3": { ... },
  slideUp: { ... },

  // New:
  slideOut: {
    "0%": { transform: "translateX(0)", opacity: "1" },
    "100%": { transform: "translateX(1rem)", opacity: "0" },
  },
  fadeIn: {
    "0%": { opacity: "0" },
    "100%": { opacity: "1" },
  },
  fadeOut: {
    "0%": { opacity: "1" },
    "100%": { opacity: "0" },
  },
  scaleIn: {
    "0%": { transform: "scale(0.95)", opacity: "0" },
    "100%": { transform: "scale(1)", opacity: "1" },
  },
  rowFlash: {
    "0%": { backgroundColor: "transparent" },
    "30%": { backgroundColor: "rgba(230, 57, 70, 0.2)" },
    "100%": { backgroundColor: "transparent" },
  },
  liveGlow: {
    "0%, 100%": { boxShadow: "0 0 0 0 rgba(239, 68, 68, 0.4)" },
    "50%": { boxShadow: "0 0 8px 2px rgba(239, 68, 68, 0.2)" },
  },
  shake: {
    "0%, 100%": { transform: "translateX(0)" },
    "20%, 60%": { transform: "translateX(-4px)" },
    "40%": { transform: "translateX(4px)" },
    "80%": { transform: "translateX(2px)" },
  },
  shimmer: {
    "0%": { backgroundPosition: "200% 0" },
    "100%": { backgroundPosition: "-200% 0" },
  },
  messageIn: {
    "0%": { transform: "translateY(8px)", opacity: "0" },
    "100%": { transform: "translateY(0)", opacity: "1" },
  },
  scalePulse: {
    "0%, 100%": { transform: "scale(1)" },
    "50%": { transform: "scale(1.1)" },
  },
}

// Add to theme.extend.animation:
{
  "eq-1": "eq-1 0.8s ease-in-out infinite",
  "eq-2": "eq-2 0.6s ease-in-out infinite",
  "eq-3": "eq-3 0.9s ease-in-out infinite",
  "slide-up": "slideUp 300ms ease-out",
  "slide-out": "slideOut 200ms ease-in forwards",
  "fade-in": "fadeIn 200ms ease-out",
  "fade-out": "fadeOut 150ms ease-in forwards",
  "scale-in": "scaleIn 200ms ease-out",
  "row-flash": "rowFlash 600ms ease-out",
  "live-glow": "liveGlow 2s ease-in-out infinite",
  "shake": "shake 300ms ease-in-out",
  "shimmer": "shimmer 1.5s ease-in-out infinite",
  "message-in": "messageIn 200ms ease-out",
  "scale-pulse": "scalePulse 250ms ease-out",
}
```

### Global Reduced Motion Override (index.css)

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

  /* Exceptions: keep very subtle opacity transitions (100ms max) */
  .allow-reduced-opacity-transition {
    transition-duration: 100ms !important;
    transition-property: opacity !important;
  }

  /* Equalizer bars: static height */
  .animate-eq-1,
  .animate-eq-2,
  .animate-eq-3 {
    height: 10px !important;
  }
}
```
