# EPIRBE Web Radio — UX/UI Audit & Redesign Specification

**Date:** 2026-03-20
**Methodology:** 4-agent parallel audit (Current State, LLM Opportunities, Competitive Benchmarks, Accessibility) → Synthesis → Design Specification

---

## 1. Executive Summary

EPIRBE is a functional self-hosted web radio with strong technical foundations (Icecast/Liquidsoap pipeline, WebSocket real-time features, 1389-track library). However, the UI has significant gaps in accessibility, role separation, and interaction polish that prevent it from being production-ready for general audiences.

### Top 3 Priorities

1. **Fix critical UX bugs** — The duplicate Chat rendering (two WebSocket connections, split state), the raw `alert()` anti-pattern, the play state race condition, and the disconnected `isLive` prop are all bugs that degrade the core experience.

2. **Separate DJ and Listener experiences** — Every visitor can currently skip tracks, delete playlists, and go live on the microphone. The UI should present a clean listener view by default and gate admin/DJ controls behind authentication.

3. **Accessibility remediation** — The app fails 13 WCAG 2.1 AA criteria. The most impactful fixes (ARIA labels, landmarks, focus indicators, contrast) are low-effort and would make the app usable for keyboard and screen reader users.

### Recommended First Sprint (2 weeks)
- Fix the 4 critical bugs (duplicate Chat, alert(), play race condition, isLive prop)
- Add ARIA labels, landmarks, focus indicators (accessibility quick wins)
- Implement persistent bottom player bar with live/playlist mode distinction
- Add metadata fallback chain (never show empty/raw filenames)

---

## 2. Consolidated Audit Report

### 2.1 Current State Strengths

| Strength | Assessment |
|----------|-----------|
| Dark theme execution | Near-black bg with subtle surface differentiation. Atmospheric, appropriate for audio. |
| Animated equalizer | Three offset-timed bars create convincing "live audio" feel. High-impact, low-cost. |
| Sticky header with blur | Modern `backdrop-blur-sm` + semi-transparent bg. Logo glow adds visual interest. |
| WebSocket architecture | Clean `useWebSocket` hook with auto-reconnect. Real-time NowPlaying and Chat feel alive. |
| Empty states | Library and Playlist provide actionable empty-state messages. |
| SourceSwitch state machine | Four-state model (idle/connecting/live/error) is well-structured. |
| Panel consistency | All panels use identical `bg-radio-surface border border-radio-border rounded-xl`. |

### 2.2 Priority Matrix

#### MUST-FIX (Critical — blocks production use)

| ID | Issue | Component | Impact |
|----|-------|-----------|--------|
| C1 | Duplicate Chat rendering — two WebSocket connections, split message/username state, breaks on viewport resize | App.tsx lines 36+54 | Data loss, doubled server load |
| C2 | `alert("Select a playlist first")` — raw browser alert, modal-blocking, no guidance | App.tsx line 17 | Jarring UX dead-end |
| C3 | `setPlaying(true)` before `audio.play()` resolves — UI lies about playback state, autoplay errors silently swallowed | Player.tsx lines 21-24 | Silent failure, confused users |
| C4 | `setSelectedPlaylistId(null); setTimeout(...)` hack for playlist reload — causes flash, breaks batch operations | App.tsx lines 22-23 | Visual glitch, race conditions |
| C5 | No authentication — any visitor can skip tracks, delete playlists, go live, scan filesystem | All components | Security and functional risk |
| C6 | `isLive` prop never connected — header LIVE badge never displays even during broadcast | Layout.tsx / App.tsx | Feature exists but is dead code |
| C7 | All ARIA labels missing on icon-only buttons — app is unusable with screen readers | All components | Accessibility: WCAG 1.1.1, 4.1.2 |
| C8 | No landmark regions, no heading hierarchy — screen readers cannot navigate | Layout.tsx | Accessibility: WCAG 1.3.1, 2.4.1 |
| C9 | No visible focus indicators — keyboard users cannot see focused element on dark bg | Global CSS | Accessibility: WCAG 2.4.7 |

#### SHOULD-FIX (High — significantly improves experience)

| ID | Issue | Impact |
|----|-------|--------|
| H1 | No confirmation on playlist delete — single click permanently destroys data | Data loss risk |
| H2 | Empty `catch {}` blocks everywhere — API failures are silently swallowed | No error feedback |
| H3 | Library loads ALL 1389 tracks on mount — no pagination or virtual scrolling | Performance degradation |
| H4 | Search fires on every keystroke with no debounce — unnecessary API load | Server strain, flickering |
| H5 | Muted text (#6b7280) on surface (#12121a) = 3.93:1 contrast — fails WCAG AA | Accessibility |
| H6 | Accent (#e63946) on surface (#12121a) = 4.47:1 — marginally fails WCAG AA | Accessibility |
| H7 | Touch targets below 44px: pencil icon (12px), ON button (~28x14), X button (~18x14) | Mobile usability |
| H8 | No `aria-live` regions — track changes, new chat messages, status changes are invisible to screen readers | Accessibility |
| H9 | Chat messages lack timestamps despite data being available | Missing information |
| H10 | No live/playlist mode distinction — skip/controls shown even during live broadcast | Confusing UX |

#### NICE-TO-HAVE (Medium/Low — polish and differentiation)

| ID | Issue | Impact |
|----|-------|--------|
| N1 | No drag-and-drop playlist reordering | DJ workflow friction |
| N2 | No keyboard shortcuts (Space=play, N=next, M=mute) | Power user productivity |
| N3 | No `md` breakpoint — tablets get phone layout stretched wide | Wasted screen space |
| N4 | Fixed panel heights (h-80, h-96) waste space when sparse, clip when dense | Layout inflexibility |
| N5 | No audio visualization when album art unavailable | Missing visual feedback |
| N6 | No "Start Listening" onboarding for first-time visitors | Discovery friction |
| N7 | No now-playing notifications in chat | Missed social anchoring |
| N8 | ScriptProcessorNode is deprecated — should migrate to AudioWorklet | Future-proofing |
| N9 | Batch add fires N sequential API calls — no batch endpoint | Performance |
| N10 | ListenerCount.tsx is dead code (unused standalone component) | Code hygiene |

---

## 3. Redesigned User Flows

### 3.1 Core Journey: Onboard → Discover → Listen → Manage

```
FIRST VISIT                    RETURNING LISTENER              DJ/ADMIN
    │                               │                              │
    ▼                               ▼                              │
┌─────────────┐            ┌─────────────┐                        │
│ Splash View │            │ Auto-resume │                        │
│ "Start      │            │ last state  │                        │
│  Listening" │            │ (playing)   │                        │
└──────┬──────┘            └──────┬──────┘                        │
       │ click                    │                               │
       ▼                          ▼                               ▼
┌──────────────────────────────────────────────────────┐  ┌──────────────┐
│                   LISTENER VIEW                       │  │  DJ DASHBOARD │
│ ┌─────────────────────────────────────────────────┐  │  │  (auth-gated) │
│ │ NOW PLAYING (hero)                               │  │  │              │
│ │ [Art/Viz] Title — Artist    🔴 LIVE   👤 12     │  │  │ Mic levels   │
│ └─────────────────────────────────────────────────┘  │  │ Go Live      │
│ ┌─────────────────────────────────────────────────┐  │  │ Queue mgmt   │
│ │ PLAYER BAR (persistent bottom)                   │  │  │ Playlist CRUD│
│ │ ▶ Title — Artist        ⏭  🔊━━━━━━━           │  │  │ Library scan │
│ └─────────────────────────────────────────────────┘  │  │ Chat mod     │
│                                                       │  │ Requests     │
│ ┌──────────────┐  ┌──────────────────────────────┐  │  └──────────────┘
│ │ CHAT         │  │ LIBRARY BROWSE               │  │
│ │ (collapsible)│  │ Search + filter chips        │  │
│ │              │  │ Track list (virtual scroll)   │  │
│ │ 💬 Messages  │  │ [Request] button per track   │  │
│ │ ───────────  │  └──────────────────────────────┘  │
│ │ [Type here]  │                                     │
│ └──────────────┘                                     │
└──────────────────────────────────────────────────────┘
```

### 3.2 Key Screen Specifications

#### Screen 1: Persistent Bottom Player Bar
**Inspired by:** Spotify, Apple Music
**Placement:** Fixed to viewport bottom, 64px height, z-50
**Contents:** Play/Pause (48px circle), track title + artist (truncated), skip button (hidden during live), volume slider, listener count badge
**Behavior:** Always visible once stream starts. Survives any future routing/navigation. During live broadcast, skip button disappears and LIVE badge appears.
**Accessibility:** `role="region" aria-label="Audio player"`, all buttons with `aria-label`, volume with `<label>`

#### Screen 2: Now Playing Hero
**Placement:** Top of main content, full-width card
**Contents (4-tier fallback):**
1. Album art + title + artist + animated equalizer
2. Playlist cover + title + "Playing from [Playlist]"
3. Audio frequency visualization (Web Audio API AnalyserNode) + title
4. EPIRBE branding gradient + "EPIRBE Radio" + equalizer

**Live mode variant:** Replace track info with DJ name, broadcast duration counter, pulsing LIVE badge. Hide skip controls.

#### Screen 3: Chat Panel
**Single instance** (fix C1) — rendered once, positioned via CSS Grid
**Desktop:** Right column, flexible height (min-h-60, max fills available space)
**Mobile:** Collapsible bottom sheet, tap to expand from a mini "💬 12 chatting" bar
**Additions:** Message timestamps (relative: "2m ago"), `role="log" aria-live="polite"`, now-playing system messages on track change, `<ul>/<li>` semantic structure

#### Screen 4: Library Browser (Listener View)
**Changes from current:**
- Virtual scrolling (react-virtual) instead of rendering 1389 DOM rows
- Debounced search (300ms)
- "Request" button per track (replaces "+" — listeners suggest, DJ approves)
- Filter chips if genre tags exist (future: LLM-generated tags)
- `aria-label` on all interactive elements

#### Screen 5: DJ Dashboard (Auth-Gated)
**New view** — toggled via admin login, not shown to listeners
**Layout:** Full-width, replaces listener view
**Panels:**
- **Mic Control:** Audio level meter (green/yellow/red VU), Go Live with 2-step confirmation, broadcast duration timer
- **Playlist Manager:** Drag-and-drop reordering (dnd-kit), create/delete with confirmation, activate
- **Library:** Full CRUD, scan button, bulk select + add to playlist
- **Queue:** Upcoming tracks, listener request queue with approve/dismiss
- **Chat Moderation:** Delete messages, slow mode toggle

#### Screen 6: Command Bar (LLM Integration Surface)
**Triggered by:** Ctrl+K / Cmd+K, or clicking a search/command icon in header
**Appearance:** Modal overlay with text input, similar to VS Code command palette
**Behavior:** Accepts natural language; fast-path regex catches simple commands (skip, play, pause) for sub-100ms response; complex queries route to LLM (1-3s with "thinking" indicator)
**Examples displayed as placeholder:** "Try: skip, play jazz, create a chill playlist, what's playing?"

#### Screen 7: First-Visit Splash
**Shown when:** No audio playing + no localStorage flag for previous visit
**Contents:** EPIRBE logo (large), "Start Listening" button (accent, 56px height, centered), current listener count, current track (if any)
**After click:** Transitions to standard layout, sets localStorage flag

### 3.3 Responsive Breakpoints

| Breakpoint | Layout |
|-----------|--------|
| < 640px (mobile) | Single column. Bottom player bar. Chat as collapsible bottom sheet. NowPlaying hero. Library below. |
| 640-1023px (tablet, `md`) | Two columns: Left = NowPlaying + Player. Right = Chat + Library. |
| 1024px+ (desktop, `lg`) | Three columns: Left = NowPlaying. Center = Library/Playlist. Right = Chat. |

---

## 4. LLM Integration Specification

### 4.1 Architecture

```
┌─────────────────────────────────────────────────┐
│ Frontend                                         │
│                                                  │
│  Command Bar (Ctrl+K)  ──┐                      │
│  Chat (@DJ prefix)    ───┤                      │
│                          ▼                      │
│              POST /api/assistant/message         │
│              {"text": "...", "context": {...}}   │
└──────────────────────────┬──────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────┐
│ Backend: AssistantRouter                          │
│                                                   │
│  ┌─────────────────────┐  ┌────────────────────┐ │
│  │ Fast-path classifier │  │ LLM (tool-use)     │ │
│  │ (regex, <100ms)      │  │ (1-3s)             │ │
│  │                      │  │                     │ │
│  │ "skip" → skip()      │  │ Tools available:    │ │
│  │ "play" → play signal │  │  search_library()   │ │
│  │ "pause" → pause sig  │  │  create_playlist()  │ │
│  │ "volume 50" → vol sig│  │  add_to_playlist()  │ │
│  └──────────┬───────────┘  │  activate_playlist()│ │
│             │              │  get_status()        │ │
│             │              │  skip_track()        │ │
│             │              │  get_playlists()     │ │
│             │              │  scan_library()      │ │
│             │              └────────┬─────────────┘ │
│             ▼                       ▼               │
│  Response: {message, actions[]}                     │
│  actions can include UI directives:                 │
│    ui.library.search, ui.playlist.select,           │
│    ui.player.play, ui.player.volume                 │
└─────────────────────────────────────────────────────┘
```

### 4.2 Conversational Command Taxonomy (30 Intents)

**Playback (6)** — fast-path, no LLM needed:
1. "play" / "start" → begin stream playback
2. "pause" / "stop" → pause stream
3. "skip" / "next" → `POST /api/stream/skip`
4. "volume [N]%" / "louder" / "quieter" → adjust volume
5. "mute" / "unmute" → toggle mute
6. "what's playing?" → read from `/ws/status` state

**Library (7)** — LLM-enhanced:
7. "find songs by [artist]" → `GET /api/library/tracks?search={artist}`
8. "search for [query]" → search with typo correction
9. "play something chill" → LLM classifies library by mood, creates temp playlist
10. "how many tracks do we have?" → `GET /api/library/tracks` → count
11. "scan for new music" → `POST /api/library/scan`
12. "what genre is this?" → LLM infers from artist/title knowledge
13. "find tracks under 3 minutes" → LLM filters by duration from full catalog

**Playlist (10)** — LLM-orchestrated:
14. "create a playlist called [name]" → `POST /api/playlists/`
15. "add this song to [playlist]" → resolve current track + playlist → add
16. "add all [artist] songs to [playlist]" → search + bulk add
17. "make a 30-minute mix of [mood/genre]" → LLM builds from full catalog
18. "activate [playlist name]" → fuzzy name match → activate
19. "what playlists do I have?" → `GET /api/playlists/`
20. "what's in [playlist]?" → `GET /api/playlists/{id}/tracks`
21. "remove track [N] from [playlist]" → resolve position → delete
22. "delete [playlist name]" → confirm → delete
23. "shuffle [playlist]" → randomize order → activate

**Social/Chat (4)** — LLM-native:
24. "say [message] in chat" → post to `/ws/chat`
25. "what are people talking about?" → summarize recent chat history
26. "how many listeners?" → read from status
27. "announce [message]" → post system message to chat

**Broadcasting (3)** — fast-path + confirmation:
28. "go live" → trigger mic permission flow (requires frontend confirmation)
29. "stop broadcasting" → stop mic
30. "am I live?" → read SourceSwitch state

### 4.3 Disambiguation Strategy

When intent is ambiguous, the LLM should **present options, not guess**:
- "play blues" → "Found playlist 'Blues Classics' and 14 tracks matching 'blues'. Activate the playlist, or create a new one from the matching tracks?"
- "add this to my playlist" (multiple playlists exist) → "Which playlist? You have: Party Mix (12 tracks), Chill Vibes (8 tracks)"
- "add this to my playlist" (no playlist selected, only one exists) → just add it, confirm after

For destructive actions (delete, go live), **always confirm**.
For low-cost actions (search, info queries), **just do it**.

### 4.4 Multimodal Feedback

LLM responses include both a text `message` and structured `actions[]`:
```json
{
  "message": "Created playlist 'Friday Night' with 12 tracks by Daft Punk. Want me to activate it?",
  "actions": [
    {"type": "ui.playlist.select", "id": 15},
    {"type": "ui.toast", "text": "Playlist created", "variant": "success"}
  ]
}
```

The command bar shows the text response. UI actions execute in the background, updating the relevant panels. Toasts provide ephemeral confirmation.

---

## 5. Implementation Roadmap

### Phase 1: Critical Bug Fixes + Accessibility Foundation (Sprint 1, 2 weeks)

| Task | Effort | Files |
|------|--------|-------|
| Fix duplicate Chat — single instance, CSS-repositioned | 2h | App.tsx, Chat.tsx |
| Replace `alert()` with inline toast system | 3h | App.tsx, new Toast component |
| Fix play() race condition — await promise, handle autoplay block | 1h | Player.tsx |
| Replace null/setTimeout hack with refresh key or React Query | 2h | App.tsx, Playlist.tsx |
| Connect `isLive` to SourceSwitch state | 1h | App.tsx, Layout.tsx |
| Add ARIA labels to all icon buttons | 2h | All components |
| Add landmark regions (`<header>`, `<main>`, `<nav>`) | 1h | Layout.tsx |
| Add skip-to-content link | 0.5h | Layout.tsx |
| Add visible focus indicators (`focus-visible:ring-2`) | 1h | Global CSS / Tailwind |
| Add `aria-live` regions for dynamic content | 1h | NowPlaying, Chat |
| Fix muted text contrast (#6b7280 → #9ca3af) | 0.5h | tailwind.config.js |
| Add `<label>` elements to form inputs | 1h | Chat, Library, Playlist |
| **Total:** | **~16h** | |

### Phase 2: Core UX Redesign (Sprint 2-3, 4 weeks)

| Task | Effort | Notes |
|------|--------|-------|
| Persistent bottom player bar | 8h | New component, replaces inline Player |
| Live/playlist mode distinction | 4h | Conditional controls based on source state |
| Metadata fallback chain (4-tier) | 4h | NowPlaying redesign |
| Delete confirmation dialogs | 2h | Playlist.tsx |
| Error feedback system (toasts + inline) | 6h | New toast system, update all catch blocks |
| Library virtual scrolling | 4h | react-virtual integration |
| Debounced search | 1h | Library.tsx |
| Increase touch targets to 44px minimum | 2h | Playlist, Chat, Library buttons |
| `md` breakpoint (tablet 2-col layout) | 3h | App.tsx grid |
| Chat timestamps display | 1h | Chat.tsx |
| Make playlist items keyboard accessible | 2h | Playlist.tsx |
| Now-playing system messages in chat | 3h | Backend + Chat.tsx |
| **Total:** | **~40h** | |

### Phase 3: DJ Dashboard + Auth (Sprint 4-5, 4 weeks)

| Task | Effort | Notes |
|------|--------|-------|
| Simple auth system (admin password/token) | 8h | Backend middleware + frontend gate |
| DJ dashboard view | 16h | New route/view with panels |
| Audio level meter (Web Audio AnalyserNode) | 4h | SourceSwitch enhancement |
| Go-live 2-step confirmation | 2h | SourceSwitch.tsx |
| Drag-and-drop playlist reordering | 8h | dnd-kit + position PATCH endpoint |
| Listener request queue | 12h | New WS event type + backend queue + DJ panel |
| Chat moderation (slow mode, delete) | 4h | Backend + DJ panel |
| First-visit splash screen | 3h | New component |
| **Total:** | **~57h** | |

### Phase 4: LLM Integration (Sprint 6-7, 4 weeks)

| Task | Effort | Notes |
|------|--------|-------|
| Backend `/api/assistant/message` endpoint | 8h | FastAPI router with tool-use LLM |
| Fast-path intent classifier (regex) | 4h | Skip/play/pause/volume without LLM |
| Command bar component (Ctrl+K) | 8h | Modal overlay with input + response display |
| Chat @DJ integration | 4h | Bot participant in existing chat |
| LLM tool definitions (search, playlist, status) | 6h | Map to existing API functions |
| Smart playlist generation | 8h | LLM classifies full library metadata |
| Mood/genre batch tagging | 6h | One-time LLM classification job + DB column |
| Context management (rolling 10-interaction window) | 4h | Session state in backend |
| **Total:** | **~48h** | |

### Phase 5: Polish & Differentiation (Sprint 8+, ongoing)

- Audio frequency visualization (album art fallback)
- Keyboard shortcuts with help overlay (? key)
- Sleep timer
- Play history tracking + recently played
- Voice DJ announcements (TTS, if desired)
- PWA support (installable, background audio)
- High-contrast theme option

### Technical Dependencies

| Dependency | Phase | Risk |
|-----------|-------|------|
| react-virtual (or @tanstack/virtual) | 2 | Low — drop-in |
| @dnd-kit/sortable | 3 | Low — well-maintained |
| LLM API (Anthropic/OpenAI) | 4 | Medium — requires API key, cost management |
| Web Audio API (AnalyserNode) | 3-5 | Low — browser-native |
| Simple auth (JWT or session token) | 3 | Low — FastAPI built-in support |

---

## 6. Design System Components Needed

| Component | Priority | Description |
|-----------|----------|-------------|
| `<Button>` | Phase 1 | Shared button with variants: primary (accent), secondary (border), danger (red), ghost. Enforces 44px min touch target. Includes focus-visible ring. |
| `<IconButton>` | Phase 1 | Wraps icon + aria-label. Enforces accessible naming. |
| `<Toast>` | Phase 1 | Ephemeral notification. Variants: success, error, info. Auto-dismiss 3-5s. `role="status"` with `aria-live="polite"`. |
| `<PlayerBar>` | Phase 2 | Persistent bottom bar. Adapts to live/playlist mode. |
| `<NowPlayingHero>` | Phase 2 | 4-tier metadata fallback. Live mode variant. |
| `<VirtualList>` | Phase 2 | Wraps react-virtual for track lists. |
| `<ConfirmDialog>` | Phase 2 | Accessible modal for destructive actions. Focus trap, Escape to close. |
| `<CommandBar>` | Phase 4 | Ctrl+K modal. Text input + response area + action execution. |
| `<AudioMeter>` | Phase 3 | VU meter bar. Green/yellow/red zones. Web Audio API input. |

### Expanded Color Tokens

```js
colors: {
  radio: {
    bg: "#0a0a0f",
    surface: "#12121a",
    border: "#1e1e2e",
    accent: "#e63946",
    text: "#e0e0e0",
    muted: "#9ca3af",       // CHANGED: was #6b7280, now passes 4.5:1 on surface
    success: "#22c55e",
    warning: "#eab308",
    error: "#ef4444",
    info: "#3b82f6",
  }
}
```

---

## Appendix A: Accessibility Compliance Checklist

| WCAG Criterion | Current | Target | Phase |
|----------------|---------|--------|-------|
| 1.1.1 Non-text Content | FAIL | PASS | 1 |
| 1.3.1 Info and Relationships | FAIL | PASS | 1 |
| 1.4.1 Use of Color | FAIL | PASS | 1 |
| 1.4.3 Contrast (Minimum) | FAIL | PASS | 1 |
| 1.4.4 Resize Text | FAIL | PASS | 2 |
| 1.4.11 Non-text Contrast | FAIL | PASS | 2 |
| 2.1.1 Keyboard | FAIL | PASS | 1-2 |
| 2.4.1 Bypass Blocks | FAIL | PASS | 1 |
| 2.4.6 Headings and Labels | FAIL | PASS | 1 |
| 2.4.7 Focus Visible | FAIL | PASS | 1 |
| 2.5.5 Target Size | FAIL | PASS | 2 |
| 3.3.1 Error Identification | FAIL | PASS | 1-2 |
| 3.3.2 Labels or Instructions | FAIL | PASS | 1 |
| 4.1.2 Name, Role, Value | FAIL | PASS | 1-2 |

## Appendix B: Competitive Benchmark Summary

| Pattern | Source | EPIRBE Status | Priority |
|---------|--------|---------------|----------|
| Persistent bottom player bar | Spotify, Apple Music | Missing | Critical |
| Live vs on-demand mode distinction | Apple Music | Missing | Critical |
| Metadata fallback chain | TuneIn | Missing | Critical |
| Drag-and-drop playlist reorder | Spotify | Missing | High |
| Now-playing chat notifications | Twitch-inspired | Missing | High |
| DJ dashboard / role separation | NTS, Discord | Missing | High |
| Audio level meter for broadcast | Discord, OBS | Missing | High |
| Go-live confirmation flow | Discord Stage | Missing | Medium |
| Search with instant results + filter chips | Spotify | Partial | Medium |
| First-visit "Start Listening" splash | TuneIn, NTS | Missing | Medium |
| AI-powered playlist generation | Spotify AI Playlist | Missing | Differentiator |
| AI DJ text commentary in chat | Spotify AI DJ adapted | Missing | Differentiator |

## Appendix C: Open Questions for Stakeholder Review

1. **Auth model:** Simple admin password vs. user accounts with roles? (Affects Phase 3 scope significantly)
2. **LLM provider:** Self-hosted (Ollama) vs. API (Anthropic/OpenAI)? Cost vs. latency tradeoff.
3. **Listener requests:** Should listeners be able to request tracks, or is this a DJ-only station?
4. **Chat persistence:** Should chat history persist across server restarts? (Currently in-memory, 50 messages)
5. **Mobile priority:** Is mobile a primary use case, or is EPIRBE primarily used on desktop?
6. **Multi-station:** Any plans for multiple simultaneous streams/channels? (Affects architecture decisions)
7. **Album art:** Is there a source for album art, or should the system rely on audio visualization as the primary visual?
