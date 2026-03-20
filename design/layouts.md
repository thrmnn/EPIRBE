# EPIRBE Radio -- Layout Blueprint

**Date:** 2026-03-20
**Status:** Specification (pre-implementation)
**Scope:** All responsive layouts, wireframes, navigation, and spatial rules

---

## 1. Grid System

### 1.1 Breakpoints

| Token | Min-width | Columns | Gutter | Behavior              |
|-------|-----------|---------|--------|-----------------------|
| sm    | 0-639px   | 1       | 16px   | Single-column stack   |
| md    | 640-767px | 1-2     | 20px   | Optional 2-col        |
| lg    | 768-1023px| 2       | 24px   | Two-column            |
| xl    | 1024-1279px| 2-3    | 24px   | Three-column listener |
| 2xl   | 1280px+   | 3       | 24px   | Full three-column     |

Note: Tailwind defaults use `sm:640 md:768 lg:1024 xl:1280`. The current codebase
only uses `lg:1024` for grid breakpoints. This spec adds `md:768` and refines `xl`
behavior. Implementation should update `tailwind.config.js` if custom breakpoints
are needed, but the default Tailwind breakpoints map cleanly:

- `sm` = Tailwind `sm` (640px)
- `md` = Tailwind `md` (768px)
- `lg` = Tailwind `lg` (1024px)
- `xl` = Tailwind `xl` (1280px)

### 1.2 Max Content Width

```
max-w-7xl = 1280px (current, from Layout.tsx)
```

Content is centered with `mx-auto`. This remains the cap for all views.

### 1.3 Spacing Scale

| Context               | Value  | Tailwind class |
|-----------------------|--------|----------------|
| Page horizontal pad   | 16px   | px-4           |
| Page horizontal pad (md+) | 24px | md:px-6     |
| Section gap (vertical)| 24px   | gap-6          |
| Card internal padding | 16px   | p-4            |
| Card internal padding (lg+) | 20px | lg:p-5   |
| Inline element gap    | 8-12px | gap-2, gap-3   |
| Bottom safe area (PlayerBar) | 64px sm, 72px lg | pb-16, lg:pb-[72px] |

### 1.4 Column Ratios

Listener view desktop (3-col):
```
|  NowPlaying (2fr)  |  Library (1.5fr)  |  Chat (1fr)  |
```
Implemented as `grid-cols-[2fr_1.5fr_1fr]` at `xl` breakpoint,
or approximated as `grid-cols-3` with `col-span-*` adjustments.

Admin dashboard (2-col):
```
|  Left: Mic + Playlists (1fr)  |  Right: Library + Chat (1fr)  |
```
Equal split at `lg+`. Single stack below.

---

## 2. Breakpoint Behavior Matrix

### 2.1 Listener View

| Element         | sm (<640)         | md (640-767)      | lg (768-1023)      | xl (1024-1279)     | 2xl (1280+)        |
|-----------------|-------------------|-------------------|--------------------|--------------------|---------------------|
| NowPlayingHero  | Full width, 200px min-h | Full width, 240px min-h | Left col, 2/3 | Left col, 2/3 | Left col, 2/3 |
| Chat            | Hidden; bottom-sheet toggle | Below hero, full width | Right col, 1/3 | Right col, dedicated | Right col, dedicated |
| Library         | Below hero, full width | Below hero, full width | Below hero in left col | Center col, dedicated | Center col, dedicated |
| PlayerBar       | Full width, h-16  | Full width, h-16  | Full width, h-16   | Full width, h-[72px] | Full width, h-[72px] |
| Header          | Sticky, h-14      | Sticky, h-14      | Sticky, h-14       | Sticky, h-14       | Sticky, h-14        |
| LIVE badge      | In header only    | In header + hero   | In header + hero   | In header + hero + player | All locations |
| Listener count  | In hero only      | In hero + player   | In hero + player   | In hero + player   | In hero + player    |
| Volume slider   | Hidden (use HW)   | Visible, w-16     | Visible, w-20      | Visible, w-24      | Visible, w-24       |
| Skip button     | Visible, 36px     | Visible, 36px     | Visible, 36px      | Visible, 36px      | Visible, 36px       |

### 2.2 Admin Dashboard

| Element          | sm (<640)              | md (640-767)          | lg (768+)              |
|------------------|------------------------|-----------------------|------------------------|
| Mic/Source panel  | Full width, top        | Full width, top       | Left col, top          |
| Playlist manager  | Full width, stacked    | Full width, stacked   | Left col, below mic    |
| Library           | Tab (hidden by default)| Full width, stacked   | Right col, top         |
| Chat              | Tab (hidden by default)| Full width, stacked   | Right col, below lib   |
| Panel navigation  | Bottom tab bar (4 tabs)| Stacked scroll        | All visible, 2-col     |

### 2.3 Navigation Pattern Changes

| Breakpoint | Navigation Model                                    |
|------------|-----------------------------------------------------|
| sm         | No hamburger. DJ button in header. Chat = floating action button (FAB) at bottom-right, above PlayerBar. Library is inline below hero. Admin panels use tab bar. |
| md         | Same as sm but more horizontal space. Chat may be inline if space permits. |
| lg+        | All panels visible simultaneously. No tabs needed. DJ button in header toggles between listener/admin views. |

---

## 3. Wireframes

### Screen 1: Listener View -- Desktop (1280px+)

```
+--[ VIEWPORT: 1280px+ ]--------------------------------------------------+
|                                                                           |
|  +--[ HEADER  sticky  z-50  h-14 ]------------------------------------+  |
|  |                                                                     |  |
|  |  [*] EPIRBE Radio    (o LIVE)                           [DJ] btn   |  |
|  |   ^                    ^                                   ^        |  |
|  |   logo+glow       badge (red,                        headphone     |  |
|  |                    pulsing dot,                       icon+label    |  |
|  |                    only when live)                                  |  |
|  +---------------------------------------------------------------------+  |
|                                                                           |
|  +--[ MAIN  max-w-7xl  mx-auto  px-6 ]--------------------------------+  |
|  |                                                                     |  |
|  |  +--[ GRID: grid-cols-[2fr_1.5fr_1fr] gap-6 ]-------------------+  |  |
|  |  |                          |                    |               |  |  |
|  |  | NOW PLAYING HERO         | LIBRARY             | CHAT         |  |  |
|  |  | min-h-[240px]            | flex-col             | flex-col     |  |  |
|  |  | rounded-xl               | rounded-xl           | rounded-xl   |  |  |
|  |  | border                   | border               | border       |  |  |
|  |  |                          |                      |              |  |  |
|  |  |   +--gradient-bg------+  | +--header---------+  | +--header--+ |  |  |
|  |  |   |                   |  | | LIBRARY  [____]  |  | | CHAT usr | |  |  |
|  |  |   |    ||| ||| |||    |  | |          search  |  | +----------+ |  |  |
|  |  |   |    (equalizer)    |  | +-----------------+  | |            | |  |  |
|  |  |   |                   |  | |                  |  | | user1  hi | |  |  |
|  |  |   |  Track Title      |  | | Title   Artist  |  | | user2 lol | |  |  |
|  |  |   |  Artist Name      |  | | Title   Artist  |  | | user3 ..  | |  |  |
|  |  |   |                   |  | | Title   Artist  |  | | user1 ok  | |  |  |
|  |  |   |  (o LIVE)         |  | | Title   Artist  |  | | ...       | |  |  |
|  |  |   |                   |  | | Title   Artist  |  | |            | |  |  |
|  |  |   |  P 12 listeners   |  | | Title   Artist  |  | |            | |  |  |
|  |  |   +-------------------+  | | (virtual scroll) |  | +----------+ |  |  |
|  |  |                          | |                  |  | | [______]  | |  |  |
|  |  |                          | +------------------+  | | Send      | |  |  |
|  |  |                          |                       | +----------+ |  |  |
|  |  +------+-------------------+-----------------------+--------------+  |  |
|  |                                                                     |  |
|  +---------------------------------------------------------------------+  |
|                                                                           |
|  +--[ PLAYER BAR  fixed  bottom-0  z-50  h-[72px] ]-------------------+  |
|  |                                                                     |  |
|  |  ( > )   ||| Track Title -- Artist    (o LIVE)    |>|  Vol===  P12 |  |
|  |   44px   eq   truncated text          badge       skip  w-24  count|  |
|  |  play/                                                              |  |
|  |  pause                                                              |  |
|  +---------------------------------------------------------------------+  |
|                                                                           |
+--------------------------------------------------------------------------+
```

**Key dimensions:**
- Header: `h-14` (56px), `sticky top-0`
- Main content: `pb-20` (80px) to clear PlayerBar + breathing room
- NowPlayingHero: `min-h-[240px]`, grows with content
- Chat: `h-[calc(100vh-14rem)]` or `min-h-[320px]`, max governed by viewport
- Library: same height strategy as Chat, internal scroll
- PlayerBar: `h-[72px]` at xl+, `fixed bottom-0`

**Grid detail at 1280px+:**
```
|<--- 2fr (approx 480px) --->|<--- 1.5fr (approx 370px) --->|<--- 1fr (approx 260px) --->|
|         + 24px gap          |          + 24px gap           |                             |
```
Total: 480 + 24 + 370 + 24 + 260 = 1158px inside 1280px max-width with 48px padding (2x24).


### Screen 2: Listener View -- Mobile (<640px)

```
+--[ VIEWPORT: 375px ]-----+
|                           |
| +--[ HEADER h-14 ]-----+ |
| |                       | |
| | [*] EPIRBE Radio [DJ] | |
| |  logo         btn     | |
| +-----------------------+ |
|                           |
| +--[ MAIN  px-4 ]------+ |
| |                       | |
| | +--[ NOW PLAYING ]--+ | |
| | | min-h-[200px]      | | |
| | |                    | | |
| | |   ||| ||| |||      | | |
| | |                    | | |
| | |  Track Title       | | |
| | |  Artist Name       | | |
| | |                    | | |
| | |  P 12 listeners    | | |
| | +--------------------+ | |
| |                       | |
| | +--[ LIBRARY ]------+ | |
| | | LIBRARY  [______]  | | |
| | |           search   | | |
| | +--------------------+ | |
| | | Title      3:42    | | |
| | | Title      4:01    | | |
| | | Title      2:58    | | |
| | | Title      5:12    | | |
| | | Title      3:33    | | |
| | | (scroll for more)  | | |
| | +--------------------+ | |
| |                       | |
| |          (gap: 80px   | |
| |       for PlayerBar)  | |
| +-----------------------+ |
|                           |
| +--[ PLAYER BAR h-16 ]-+ |
| |                       | |
| | ( > ) Title -- Art |>|| |
| | play  truncated   skip| |
| +-----------------------+ |
|                           |
|               +----------+|
|               | [chat] o ||
|               +----------+|
|                Chat FAB   |
|              (z-40, above |
|              player bar   |
|              bottom-20    |
|              right-4)     |
+---------------------------+
```

**Chat as bottom sheet (when FAB tapped):**
```
+--[ VIEWPORT: 375px ]-----+
|                           |
| +--[ HEADER ]---(dimmed)-+|
| | [*] EPIRBE Radio [DJ]  ||
| +------------------------+|
|                           |
|  (dimmed overlay z-30)    |
|                           |
| +--[ CHAT SHEET  z-40 ]-+ |
| | +--drag handle-------+ | |
| | |  ---                | | |
| | +--------------------+ | |
| | CHAT            user1  | |
| | +--------------------+ | |
| | | user1: hello!       | | |
| | | user2: great track  | | |
| | | user3: +1           | | |
| | | ...                 | | |
| | +--------------------+ | |
| | [__________________]   | |
| | type here...    Send   | |
| +------------------------+ |
|                           |
| +--[ PLAYER BAR h-16 ]-+ |
| | ( > ) Title -- Art |>|| |
| +-----------------------+ |
+---------------------------+
```

**Mobile PlayerBar detail:**
- Height: 64px (`h-16`)
- Play/pause button: 44px diameter (touch-friendly)
- Track info: single line, truncated
- Skip button: 36px, visible
- Volume slider: HIDDEN (users rely on hardware volume)
- Listener count: HIDDEN (shown in hero instead)
- LIVE badge: shown inline if live, replaces skip button


### Screen 3: Listener View -- Tablet (768-1023px)

```
+--[ VIEWPORT: 768-1023px ]--------------------------------------------+
|                                                                       |
| +--[ HEADER  sticky  h-14 ]----------------------------------------+ |
| |  [*] EPIRBE Radio   (o LIVE)                          [DJ] btn   | |
| +-------------------------------------------------------------------+ |
|                                                                       |
| +--[ MAIN  max-w-7xl  px-6 ]---------------------------------------+ |
| |                                                                   | |
| |  +--[ GRID: grid-cols-2 gap-6 ]-------------------------------+  | |
| |  |                               |                            |  | |
| |  |  NOW PLAYING HERO             |  CHAT                      |  | |
| |  |  min-h-[240px]                |  h-[320px]                 |  | |
| |  |  col-span-1                   |  col-span-1                |  | |
| |  |                               |                            |  | |
| |  |    ||| ||| |||                 |  +--header--------------+  |  | |
| |  |    (equalizer)                |  | CHAT           user1 |  |  | |
| |  |                               |  +----------------------+  |  | |
| |  |   Track Title                 |  | user1: hello!        |  |  | |
| |  |   Artist Name                 |  | user2: great track   |  |  | |
| |  |                               |  | user3: +1            |  |  | |
| |  |   P 12 listeners              |  | ...                  |  |  | |
| |  |                               |  +----------------------+  |  | |
| |  |                               |  | [___________] Send   |  |  | |
| |  |                               |  +----------------------+  |  | |
| |  +------+------------------------+----------------------------+  | |
| |  |                                                            |  | |
| |  |  LIBRARY  (full width, col-span-2)                        |  | |
| |  |  +--header----------------------------------------------+ |  | |
| |  |  | LIBRARY                              [____________]  | |  | |
| |  |  |                                       search         | |  | |
| |  |  +------------------------------------------------------+ |  | |
| |  |  | Title           Artist           Duration             | |  | |
| |  |  | Track One       DJ Shadow        3:42                 | |  | |
| |  |  | Track Two       Bonobo           4:01                 | |  | |
| |  |  | Track Three     Thievery Corp    5:12                 | |  | |
| |  |  | (scrollable, max-h-[300px])                           | |  | |
| |  |  +------------------------------------------------------+ |  | |
| |  +------------------------------------------------------------+  | |
| |                                                                   | |
| +-------------------------------------------------------------------+ |
|                                                                       |
| +--[ PLAYER BAR  fixed  h-16 ]-------------------------------------+ |
| | ( > )  ||| Track Title -- Artist  (o LIVE)  |>|  Vol===    P 12  | |
| +-------------------------------------------------------------------+ |
+-----------------------------------------------------------------------+
```

**Tablet layout rules:**
- Row 1: NowPlayingHero (1 col) + Chat (1 col), side by side
- Row 2: Library spans full width (`col-span-2`)
- Chat gets a fixed height of 320px (enough for conversation without dominating)
- Library gets `max-h-[300px]` with internal scroll
- PlayerBar shows volume slider (narrower, w-16) and listener count


### Screen 4: Admin Dashboard -- Desktop (1024px+)

```
+--[ VIEWPORT: 1024px+ ]--------------------------------------------------+
|                                                                           |
|  +--[ ADMIN HEADER  border-b  accent gradient ]------------------------+  |
|  |                                                                     |  |
|  |  (o) DJ Dashboard                         [Listener View] [Logout] |  |
|  |   ^                                         ^               ^      |  |
|  |   pulsing dot                            returns to       ends     |  |
|  |   (red when live)                        listener mode    session  |  |
|  +---------------------------------------------------------------------+  |
|                                                                           |
|  +--[ MAIN  max-w-7xl  px-6  py-6 ]-----------------------------------+  |
|  |                                                                     |  |
|  |  +--[ GRID: grid-cols-2 gap-6 ]----------------------------------+ |  |
|  |  |                                |                               | |  |
|  |  |  LEFT COLUMN                   |  RIGHT COLUMN                 | |  |
|  |  |                                |                               | |  |
|  |  |  +--[ MIC CONTROL ]---------+ |  +--[ LIBRARY ]-------------+ | |  |
|  |  |  | SOURCE          status   | |  | LIBRARY        [______]  | | |  |
|  |  |  | +--------------------+   | |  |                search    | | |  |
|  |  |  | | ======== VU meter  |   | |  | +---[Scan]              | | |  |
|  |  |  | | green|yellow|red   |   | |  | +---------------------+ | | |  |
|  |  |  | +--------------------+   | |  | | Title  Artist  Dur  | | | |  |
|  |  |  |                          | |  | | [ ] track1  art  3m | | | |  |
|  |  |  |  LIVE MIC (or Playlist)  | |  | | [ ] track2  art  4m | | | |  |
|  |  |  |                          | |  | | [ ] track3  art  5m | | | |  |
|  |  |  |         [Go Live]        | |  | | [ ] track4  art  3m | | | |  |
|  |  |  |  (or [Stop Mic] if live) | |  | | (virtual scroll)    | | | |  |
|  |  |  +--------------------------+ |  | | max-h-[400px]       | | | |  |
|  |  |                                |  | +---------------------+ | | |  |
|  |  |  +--[ PLAYLIST MANAGER ]----+ |  | [Add N Selected]        | | |  |
|  |  |  | PLAYLISTS                | |  +-------------------------+ | |  |
|  |  |  | +--------------------+   | |                               | |  |
|  |  |  | | [New playlist___]  |   | |  +--[ CHAT ]---------------+ | |  |
|  |  |  | | [Create]           |   | |  | CHAT             admin  | | |  |
|  |  |  | +--------------------+   | |  | +---------------------+ | | |  |
|  |  |  |                          | |  | | user1: request plz  | | | |  |
|  |  |  | +--playlist-list------+  | |  | | user2: great set!   | | | |  |
|  |  |  | | > Party Mix  12trk  | | |  | | [sys]: Now playing  | | | |  |
|  |  |  | |   [Activate] [Del] | | |  | | user3: +1           | | | |  |
|  |  |  | |   Chill      8trk  | | |  | | ...                 | | | |  |
|  |  |  | |   [Activate] [Del] | | |  | +---------------------+ | | |  |
|  |  |  | +--------------------+  | |  | [___________] Send     | | |  |
|  |  |  |                          | |  +-------------------------+ | |  |
|  |  |  | +--selected-tracks----+  | |                               | |  |
|  |  |  | | Tracks in Party Mix |  | |                               | |  |
|  |  |  | | 1. Song A     [-]   |  | |                               | |  |
|  |  |  | | 2. Song B     [-]   |  | |                               | |  |
|  |  |  | | 3. Song C     [-]   |  | |                               | |  |
|  |  |  | | (max-h-[240px])     |  | |                               | |  |
|  |  |  | +--------------------+  | |                               | |  |
|  |  |  +--------------------------+ |                               | |  |
|  |  |                                |                               | |  |
|  |  +--------------------------------+-------------------------------+ |  |
|  |                                                                     |  |
|  +---------------------------------------------------------------------+  |
|                                                                           |
|  +--[ PLAYER BAR  h-[72px]  persists from listener view ]-------------+  |
|  |  ( > )  ||| Title -- Artist              |>|   Vol===       P 12  |  |
|  +---------------------------------------------------------------------+  |
+--------------------------------------------------------------------------+
```

**Admin layout rationale:**
- Left column is the "action" column: mic controls at top (most urgent), playlists below
- Right column is the "content" column: library for browsing/adding, chat for monitoring
- The DJ's eye path: Mic status (top-left) -> Playlist (bottom-left) -> Library (top-right) -> Chat (bottom-right)
- PlayerBar persists so the DJ can hear what is broadcasting


### Screen 5: Admin Dashboard -- Mobile (<640px)

```
+--[ VIEWPORT: 375px ]-----+
|                           |
| +--[ ADMIN HEADER ]----+ |
| | (o) DJ Dashboard      | |
| | [Listener] [Logout]   | |
| +-----------------------+ |
|                           |
| +--[ TAB BAR  sticky ]-+ |
| | [Mic] [Lists] [Lib] [Chat] |
| |  ^sel                 | |
| +-----------------------+ |
|                           |
| +--[ ACTIVE PANEL ]----+ |
| |                       | |
| | (shows whichever tab  | |
| |  is selected)         | |
| |                       | |
| | Example: Mic tab      | |
| | +-------------------+ | |
| | | SOURCE            | | |
| | | ======== VU meter | | |
| | | LIVE MIC          | | |
| | |    [Stop Mic]     | | |
| | +-------------------+ | |
| |                       | |
| | (scrollable area for  | |
| |  whichever panel is   | |
| |  active)              | |
| |                       | |
| +-----------------------+ |
|                           |
| +--[ PLAYER BAR h-16 ]-+ |
| | ( > ) Title      |>| | |
| +-----------------------+ |
+---------------------------+
```

**Mobile tab details:**

```
TAB BAR (h-12, sticky top-[56px] below admin header, z-40)
+------+--------+------+------+
| Mic  | Lists  | Lib  | Chat |
|  o   |  =     |  #   |  ..  |
+------+--------+------+------+
  icon   icon    icon   icon
  +      +       +      + badge
  label  label   label  label  (unread count)
```

**Panel priority order (reflects tab order):**
1. **Mic/Source** -- Most time-critical (are you live? levels OK?)
2. **Playlists** -- Queue management, second most used
3. **Library** -- Browse and add tracks
4. **Chat** -- Monitor conversation, moderate

Each tab panel fills the viewport between the tab bar and the PlayerBar.
Internal scrolling within each panel. Swipe gestures between tabs are optional
but recommended for future implementation.


### Screen 6: First-Visit Splash

```
+--[ VIEWPORT: any size ]----------------------------------------------+
|                                                                       |
|  +--[ SPLASH  fixed  inset-0  z-[60]  bg-radio-bg ]--------------+  |
|  |                                                                |  |
|  |                                                                |  |
|  |                                                                |  |
|  |                                                                |  |
|  |                     .  *  .                                    |  |
|  |                  *  _____  *                                   |  |
|  |                    /     \                                     |  |
|  |                   | (( )) |    <-- headphone icon              |  |
|  |                    \_____/         96x96px                     |  |
|  |                  *         *       with accent glow            |  |
|  |                     .  *  .        (blur-2xl, accent/20)       |  |
|  |                                                                |  |
|  |                                                                |  |
|  |                   EPIRBE Radio                                 |  |
|  |                   text-4xl bold                                |  |
|  |                                                                |  |
|  |                  Web Radio Station                             |  |
|  |                   text-radio-muted                             |  |
|  |                                                                |  |
|  |                                                                |  |
|  |               +---------------------+                         |  |
|  |               |  Start Listening    |                         |  |
|  |               |  min-h-[56px]       |                         |  |
|  |               |  px-8  rounded-full |                         |  |
|  |               |  bg-radio-accent    |                         |  |
|  |               +---------------------+                         |  |
|  |                                                                |  |
|  |                                                                |  |
|  |                  12 listening now                              |  |
|  |                  text-sm muted                                 |  |
|  |                                                                |  |
|  |               Now: Track Title -- Artist                      |  |
|  |                  text-sm text/70                               |  |
|  |                  max-w-xs truncate                             |  |
|  |                                                                |  |
|  |                                                                |  |
|  +----------------------------------------------------------------+  |
|                                                                       |
+-----------------------------------------------------------------------+
```

**Splash behavior:**
- Shown when: `localStorage.getItem("epirbe_visited") === null`
- z-index: 60 (above everything including header and PlayerBar)
- Position: `fixed inset-0`, flex center
- Background: solid `bg-radio-bg` (not transparent -- fully covers app)
- Transition on dismiss: fade out over 300ms, then unmount
- The underlying app (Layout + ListenerView) renders behind it but is not interactive
- Ambient data (listener count, current track) updates in real-time via `useNowPlaying`
- On "Start Listening" click: sets localStorage flag, component fades and unmounts


### Screen 7: Login Overlay

The login is NOT a modal/dialog. It is an inline expansion in the header, keeping
the user in context. This matches the current implementation.

```
HEADER (before login attempt):
+----------------------------------------------------------------------+
| [*] EPIRBE Radio                                            [DJ]    |
+----------------------------------------------------------------------+
                                                                ^
                                                          click DJ btn

HEADER (login input expanded):
+----------------------------------------------------------------------+
| [*] EPIRBE Radio                  [Password___] [Login]      [DJ]   |
|                                    ^             ^             ^     |
|                                    w-32          accent bg    toggle  |
|                                    autofocus     submit       close  |
+----------------------------------------------------------------------+

HEADER (login error state):
+----------------------------------------------------------------------+
| [*] EPIRBE Radio                  [Password___] [Login]      [DJ]   |
|                                    ^red border                       |
|                                    border-red-500                    |
+----------------------------------------------------------------------+

HEADER (authenticated, on listener view):
+----------------------------------------------------------------------+
| [*] EPIRBE Radio                                       [Dashboard]  |
|                                                          ^           |
|                                                     shows "Dashboard"|
|                                                     instead of "DJ"  |
+----------------------------------------------------------------------+

HEADER (authenticated, on admin view):
+----------------------------------------------------------------------+
| [*] EPIRBE Radio                                        [Listener]  |
|                                                          ^           |
|                                                     shows "Listener" |
|                                                     to toggle back   |
+----------------------------------------------------------------------+
```

**Mobile login (< 640px):**
When the header is narrow, the login input should wrap below:
```
+--[ HEADER  sm ]---------------+
| [*] EPIRBE Radio        [DJ] |
| +--[ login row  pt-2 ]-----+ |
| | [Password________] [Go]  | |
| +---------------------------+ |
+-------------------------------+
```
On small screens:
- Password input expands to `w-full` within a second row
- "Login" button shortens to "Go"
- The header temporarily grows taller to accommodate (no fixed `h-14` when login is open on mobile; use `min-h-[56px]` instead)

**Error feedback:**
- Red border on input (`border-red-500`)
- Optional: subtle shake animation (200ms, CSS `@keyframes shake`)
- No text error message (the red border is sufficient for a single-field password)
- Screen reader: `aria-invalid="true"` and `aria-describedby` pointing to a visually-hidden error span

---

## 4. Navigation Model

### 4.1 Listener -> Admin Discovery

```
LISTENER VIEW
    |
    v
[DJ] button in header (always visible, top-right)
    |
    +-- Not authenticated: expands inline password input
    |       |
    |       +-- Correct password: transitions to Admin Dashboard
    |       +-- Wrong password: red border, stays on listener view
    |
    +-- Already authenticated: toggles between Listener / Admin views
```

The DJ button is intentionally subtle (muted colors, small) so casual listeners
do not accidentally enter the admin flow. Authenticated admins see it highlighted.

### 4.2 Admin -> Listener Navigation

Two paths:
1. **[Listener View]** button in admin header -- switches view, stays authenticated
2. **[Logout]** button in admin header -- switches view AND clears auth token

### 4.3 Navigation Pattern by Device

| Device  | Primary nav               | Secondary nav              |
|---------|---------------------------|---------------------------|
| Mobile  | Header (logo + DJ btn)    | Admin tab bar (4 tabs)    |
|         | Chat FAB                  | Bottom sheet for chat     |
| Tablet  | Header (logo + DJ btn)    | All panels visible inline |
| Desktop | Header (logo + DJ btn)    | All panels visible inline |

There is NO hamburger menu, NO sidebar, NO bottom tab bar for the listener view.
The listener experience is intentionally simple: hero + library + chat + player.
Only the admin dashboard uses a tab bar, and only on mobile.

### 4.4 View Transitions

| Transition                  | Animation                          | Duration |
|-----------------------------|------------------------------------|----------|
| Splash -> Listener          | Fade out splash (opacity 1 -> 0)   | 300ms    |
| Listener -> Admin           | Crossfade (listener out, admin in)  | 200ms    |
| Admin -> Listener           | Crossfade                           | 200ms    |
| Chat FAB -> Bottom Sheet    | Slide up from bottom                | 250ms    |
| Chat Bottom Sheet -> FAB    | Slide down                          | 200ms    |
| Login input expand          | Width transition (0 -> w-32)        | 150ms    |

---

## 5. Persistent Elements

### 5.1 PlayerBar

```
POSITIONING:
  fixed bottom-0 left-0 right-0
  z-50

HEIGHTS:
  sm/md:  h-16  (64px)
  lg+:    h-[72px] (72px)

BACKGROUND:
  bg-radio-surface/95 backdrop-blur-md
  border-t border-radio-border

SCROLL INTERACTION:
  - Always visible, never hides on scroll
  - Content areas must include bottom padding to prevent
    the last items from being hidden behind the PlayerBar:
      pb-20 (80px) on sm
      pb-24 (96px) on lg+ (to account for 72px bar + breathing room)

CONTENT LAYOUT:
  sm:   [Play 44px] [Title--Artist truncated] [Skip 36px]
  md:   [Play 44px] [EQ] [Title--Artist] [LIVE?] [Skip] [Vol w-16] [Listeners]
  lg+:  [Play 44px] [EQ] [Title--Artist] [LIVE?] [Skip] [Vol w-24] [Listeners]
```

### 5.2 Header

```
POSITIONING:
  sticky top-0
  z-50 (same as PlayerBar -- they do not overlap)

HEIGHT:
  min-h-[56px] (h-14)
  May grow when login input wraps on mobile

BACKGROUND:
  bg-radio-surface/50 backdrop-blur-sm
  border-b border-radio-border

SCROLL BEHAVIOR:
  - Stays pinned at top (sticky, not fixed)
  - Does NOT shrink or hide on scroll
  - Does NOT change opacity on scroll
  - The blur effect means content scrolling beneath is subtly visible

CONTENT:
  Left:   Logo icon (32px, accent glow) + "EPIRBE Radio" h1 + LIVE badge
  Right:  Login form (conditional) + DJ button
  Flex:   items-center, gap-3, ml-auto on right group
```

### 5.3 Chat (Cross-Breakpoint Behavior)

```
DESKTOP (lg+):
  - Dedicated column in the grid (rightmost)
  - Fixed within the grid cell, scrolls internally
  - Height: fills available vertical space (min-h-[320px])
  - Width: governed by grid column (approx 260-320px)
  - Always visible, no toggle needed

TABLET (md to lg):
  - Sits next to NowPlayingHero in row 1 of the grid
  - Fixed height: h-[320px]
  - Always visible

MOBILE (< md):
  - NOT rendered inline in the page flow
  - Accessed via floating action button (FAB):
      position: fixed
      bottom: 80px (above PlayerBar)
      right: 16px
      z-index: 40
      Size: 48x48px circle
      Icon: chat bubble + unread badge
  - On tap: slides up a bottom sheet (z-40)
  - Bottom sheet:
      max-height: 60vh
      min-height: 280px
      rounded-t-2xl
      Drag handle at top (grabber bar)
      Dismiss: tap outside (dimmed overlay), drag down, or tap FAB again
  - When open: dimmed overlay behind sheet (bg-black/40, z-30)
```

---

## 6. Z-Index System

```
Layer                          z-index    Notes
--------------------------------------------------------------
Base content (main)            0          Default stacking context
Library sticky thead           10         Sticky table header within scroll
Admin tab bar (mobile)         20         Sticky below admin header
Chat bottom sheet overlay      30         Dimmed backdrop (mobile)
Chat bottom sheet panel        40         The sheet itself (mobile)
Chat FAB                       40         Floating button (mobile)
Sticky header                  50         Must be above all content
PlayerBar                      50         Fixed bottom, same layer as header
                                          (they never overlap vertically)
Toast notifications            55         Above player and header
Login input dropdown (future)  55         If login ever becomes a dropdown
Confirm dialogs / modals       60         Blocks all interaction below
First-visit splash             60         Full-screen overlay, blocks everything
Focus trap backdrop            60         Same layer as modals
Command bar (future, Ctrl+K)   70         Above everything except...
Dev/debug overlay (if any)     100        Development only
```

**Rules:**
- The header and PlayerBar share z-50 because they occupy non-overlapping
  vertical space (top vs. bottom). No conflict.
- Toasts at z-55 float above the player/header chrome so they are always readable.
- Modals and the splash both use z-60. They should never co-exist (splash is
  dismissed before any modal can appear).
- The future command bar (Ctrl+K) gets z-70 so it can overlay even modals
  if triggered while a confirmation dialog is open.

---

## 7. Content Dimensions

### 7.1 PlayerBar

| Property       | sm (<640)  | md (640-767) | lg (768-1023) | xl (1024+)  |
|----------------|-----------|-------------|--------------|------------|
| Height         | 64px      | 64px        | 64px         | 72px       |
| Play button    | 44x44px   | 44x44px     | 44x44px      | 44x44px    |
| Skip button    | 36x36px   | 36x36px     | 36x36px      | 36x36px    |
| Volume slider  | hidden    | w-16 (64px) | w-20 (80px)  | w-24 (96px)|
| Horizontal pad | 16px      | 16px        | 16px         | 16px       |
| Internal gap   | 12px      | 16px        | 16px         | 16px       |

### 7.2 Header

| Property        | sm (<640)   | md+          |
|-----------------|------------|-------------|
| Height          | 56px min   | 56px        |
| Logo icon       | 32x32px    | 32x32px     |
| Title font      | text-xl    | text-xl     |
| LIVE badge      | hidden*    | visible     |
| Horizontal pad  | 16px       | 16px        |
| Internal gap    | 12px       | 12px        |

*On mobile, the LIVE badge only shows in the header when live. When not live,
 the header stays minimal to conserve horizontal space.

### 7.3 Chat Panel

| Property         | Desktop (xl+)      | Tablet (lg)         | Mobile (sheet)      |
|------------------|--------------------|--------------------|---------------------|
| Width            | Grid col (~260-320px) | Grid col (~50%)  | 100vw               |
| Height           | calc(100vh - 14rem) min 320px | 320px fixed | 60vh max, 280px min |
| Message area     | flex-1 overflow-y  | flex-1 overflow-y  | flex-1 overflow-y   |
| Input height     | 40px               | 40px               | 44px (touch)        |
| Header height    | 40px               | 40px               | 48px (with grabber) |
| Border radius    | rounded-xl         | rounded-xl         | rounded-t-2xl       |

### 7.4 NowPlayingHero

| Property         | sm (<640)    | md (640-767) | lg (768+)    | xl (1024+)   |
|------------------|-------------|-------------|-------------|-------------|
| Min height       | 200px       | 220px       | 240px       | 240px       |
| Max height       | 320px       | 360px       | none (grows) | none        |
| Internal padding | 24px (p-6)  | 32px (p-8)  | 32px (p-8)  | 32px (p-8)  |
| Title font       | text-xl     | text-2xl    | text-2xl    | text-2xl    |
| Artist font      | text-base   | text-lg     | text-lg     | text-lg     |
| Equalizer bars   | h-5 (20px)  | h-6 (24px)  | h-6 (24px)  | h-6 (24px)  |
| Border radius    | rounded-xl  | rounded-xl  | rounded-xl  | rounded-xl  |

### 7.5 Library Panel

| Property          | Listener view       | Admin view           |
|-------------------|---------------------|----------------------|
| Height (desktop)  | Same as chat (grid) | max-h-[400px]        |
| Height (mobile)   | h-96 (384px)        | Full tab panel height|
| Row height        | 36px                | 36px                 |
| Search input      | w-40                | flex-1               |
| Scrolling         | Internal overflow-y | Internal overflow-y  |
| Table header      | Sticky top-0        | Sticky top-0         |

### 7.6 Admin Panel Minimums

| Panel             | Min width   | Min height  | Notes                    |
|-------------------|-------------|-------------|--------------------------|
| Mic/Source        | 280px       | 120px       | Must fit VU meter + button |
| Playlist Manager  | 280px       | 200px       | List + create form       |
| Playlist Tracks   | 280px       | 100px       | Appears inside playlist panel |
| Library (admin)   | 320px       | 300px       | Table needs width for 3+ cols |
| Chat (admin)      | 260px       | 280px       | Same as listener chat    |

These minimums govern when the 2-column layout collapses to single-column.
At `lg` (768px), each column gets ~360px (768 - 48px padding - 24px gap = 696 / 2 = 348px),
which satisfies all minimums. Below 768px, stack to single column.

---

## 8. Responsive Grid Templates (Implementation Reference)

### 8.1 Listener View Grid

```
/* Mobile: single column */
.listener-grid {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas:
    "hero"
    "library";
  gap: 24px;
}
/* Chat is not in the grid on mobile -- it is a FAB + bottom sheet */

/* Tablet (md: 768px) */
@media (min-width: 768px) {
  .listener-grid {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      "hero    chat"
      "library library";
  }
}

/* Desktop (xl: 1280px) */
@media (min-width: 1280px) {
  .listener-grid {
    grid-template-columns: 2fr 1.5fr 1fr;
    grid-template-areas:
      "hero library chat";
  }
}
```

In Tailwind, this translates to:
```
grid grid-cols-1
md:grid-cols-2
xl:grid-cols-[2fr_1.5fr_1fr]
gap-6
```

### 8.2 Admin Dashboard Grid

```
/* Mobile: tab-based, single panel visible */
/* No CSS grid needed -- tabs handle panel switching */

/* Desktop (lg: 1024px) */
.admin-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
```

In Tailwind:
```
grid grid-cols-1 lg:grid-cols-2 gap-6
```

---

## 9. Touch Target Compliance

All interactive elements must meet 44x44px minimum touch target per WCAG 2.5.5.

| Element                | Current size | Required     | Fix                        |
|------------------------|-------------|-------------|----------------------------|
| Play/Pause (PlayerBar) | 44px        | 44px        | OK                         |
| Skip (PlayerBar)       | 36px        | 44px        | Increase to min-w-[44px] min-h-[44px] |
| DJ button (header)     | ~36px tall  | 44px        | Add min-h-[44px]           |
| Chat send button       | ~32px       | 44px        | Add min-h-[44px] py-2      |
| Username edit pencil   | ~24px       | 44px        | Expand tap area with padding |
| Playlist activate      | 44px        | 44px        | OK (already fixed)         |
| Playlist delete        | 44px        | 44px        | OK (already fixed)         |
| Library track row      | ~30px       | 44px        | Increase row padding to py-2.5 |
| Chat FAB (mobile)      | 48px        | 44px        | OK                         |

---

## 10. Scroll Behavior Summary

| Region                    | Scroll type         | Notes                        |
|---------------------------|---------------------|------------------------------|
| Page body                 | Natural scroll      | Header sticks, PlayerBar fixed |
| Chat messages             | Internal overflow-y | Auto-scrolls to bottom on new msg |
| Library track list        | Internal overflow-y | Virtual scroll (react-virtual) |
| Playlist track list       | Internal overflow-y | max-h-[240px] then scrolls   |
| Admin library table       | Internal overflow-y | max-h-[400px] then scrolls   |
| Mobile chat bottom sheet  | Internal overflow-y | Sheet itself does not scroll page |
| NowPlayingHero            | No scroll           | Content fits or grows         |

**Scroll locking:**
- When the mobile chat bottom sheet is open, the page body scroll is locked
  (`overflow: hidden` on `<body>`) to prevent scroll-through.
- When a ConfirmDialog modal is open, same body scroll lock applies.
- The First-Visit Splash does not need scroll lock because it is `fixed inset-0`
  and covers the entire viewport.
