# RADIO EPIRBE -- Master Design Blueprint

**Version:** 1.0
**Date:** 2026-03-20
**Sources:** visual-system.md, components.md, layouts.md, interactions.md, accessibility.md, UX_AUDIT.md

---

## 1. Executive Summary

RADIO EPIRBE is a dark-themed web radio application inspired by professional broadcast studios -- matte-black surfaces, warm amber VU meter lights, the red glow of ON AIR signs, and cool cyan backlight accents. The visual language is dark but alive: every surface has depth, every interactive element responds.

### Key Design Decisions

| Decision | Value |
|----------|-------|
| Primary color | **Broadcast Amber** `#e8924b` (replaces old red `#e63946`) |
| Secondary color | **Studio Cyan** `#5ba4c9` |
| Live indicator | **ON AIR Red** `#ff3b3b` (reserved exclusively for live status) |
| Display font | **Space Grotesk** (headings, hero text) |
| Body font | **Inter** (all UI text) |
| Mono font | **JetBrains Mono** (code, meters) |
| Layout model | CSS Grid: 1-col mobile, 2-col tablet, 3-col `[2fr 1.5fr 1fr]` desktop |
| Max content width | `1280px` (`max-w-7xl`) |
| Base spacing unit | `4px` |
| Primary buttons | **Dark text** `#101018` on amber bg (5.8:1 contrast) |

### What Changes from Current Design

- Primary action color shifts from cold red `#e63946` to warm amber `#e8924b`
- Error red `#f06060` is now separate from primary -- no more overloaded red
- Five-level surface depth system replaces flat two-level surfaces
- Three-tier border system, dedicated glow shadows, gradient tokens
- Space Grotesk for display headings (was Inter everywhere)
- Tablet breakpoint (`md:768px`) added -- was only mobile/desktop
- LIVE badge uses dedicated `#ff3b3b` -- never conflicts with primary or error

---

## 2. Design Tokens

### 2.1 CSS Custom Properties

```css
:root {
  /* --- Surface Hierarchy --- */
  --radio-surface-base: #08080d;
  --radio-surface-1: #101018;
  --radio-surface-2: #1a1a25;
  --radio-surface-3: #242433;
  --radio-surface-highlight: #2a2a3d;

  /* --- Borders --- */
  --radio-border-subtle: #1e1e2e;
  --radio-border-default: #2d2d42;
  --radio-border-strong: #3d3d57;
  --radio-border-focus: #e8924b;

  /* --- Primary (Broadcast Amber) --- */
  --radio-primary: #e8924b;
  --radio-primary-hover: #f0a565;
  --radio-primary-active: #d07a35;
  --radio-primary-muted: #e8924b26;
  --radio-primary-subtle: #1f1610;

  /* --- Secondary (Studio Cyan) --- */
  --radio-secondary: #5ba4c9;
  --radio-secondary-hover: #74b8dc;
  --radio-secondary-active: #4890b5;
  --radio-secondary-muted: #5ba4c926;
  --radio-secondary-subtle: #0f161b;

  /* --- Semantic: Success --- */
  --radio-success: #34d399;
  --radio-success-muted: #34d39918;
  --radio-success-subtle: #0f1f19;

  /* --- Semantic: Warning --- */
  --radio-warning: #f0b429;
  --radio-warning-muted: #f0b42918;
  --radio-warning-subtle: #1f1a0f;

  /* --- Semantic: Error --- */
  --radio-error: #f06060;
  --radio-error-muted: #f0606018;
  --radio-error-subtle: #1f1010;

  /* --- Semantic: Info --- */
  --radio-info: #5ba4c9;
  --radio-info-muted: #5ba4c918;
  --radio-info-subtle: #0f161b;

  /* --- Text Hierarchy --- */
  --radio-text-primary: #ededf0;
  --radio-text-secondary: #a8a8b8;
  --radio-text-tertiary: #6e6e82;
  --radio-text-disabled: #45455a;

  /* --- Interactive Overlays --- */
  --radio-hover-overlay: #ffffff0a;
  --radio-active-overlay: #ffffff12;
  --radio-focus-ring: #e8924b;
  --radio-focus-ring-offset: #08080d;

  /* --- Live / On-Air --- */
  --radio-live: #ff3b3b;
  --radio-live-glow: #ff3b3b60;
  --radio-live-bg: #ff3b3b15;

  /* --- Gradients --- */
  --radio-gradient-surface: linear-gradient(180deg, #101018 0%, #08080d 100%);
  --radio-gradient-warm: linear-gradient(135deg, #e8924b 0%, #d07a35 100%);
  --radio-gradient-cool: linear-gradient(135deg, #5ba4c9 0%, #4890b5 100%);
  --radio-gradient-live: linear-gradient(135deg, #ff3b3b 0%, #cc2f2f 100%);
  --radio-gradient-glass: linear-gradient(180deg, #ffffff08 0%, #ffffff00 100%);
  --radio-gradient-fade-down: linear-gradient(180deg, transparent 0%, #08080d 100%);

  /* --- Typography --- */
  --radio-font-display: 'Space Grotesk', system-ui, sans-serif;
  --radio-font-body: 'Inter', system-ui, -apple-system, sans-serif;
  --radio-font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* --- Shadows --- */
  --radio-shadow-sm: 0 1px 2px 0 rgba(0,0,0,0.4), 0 1px 3px 0 rgba(0,0,0,0.3);
  --radio-shadow-md: 0 4px 6px -1px rgba(0,0,0,0.5), 0 2px 4px -2px rgba(0,0,0,0.4);
  --radio-shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.6), 0 4px 6px -4px rgba(0,0,0,0.5);
  --radio-shadow-xl: 0 20px 25px -5px rgba(0,0,0,0.7), 0 8px 10px -6px rgba(0,0,0,0.6);
  --radio-shadow-inner: inset 0 2px 4px 0 rgba(0,0,0,0.4);
  --radio-shadow-glow-sm: 0 0 8px 0 rgba(232,146,75,0.25);
  --radio-shadow-glow-md: 0 0 16px 2px rgba(232,146,75,0.3);
  --radio-shadow-glow-lg: 0 0 24px 4px rgba(232,146,75,0.35);
  --radio-shadow-glow-live: 0 0 20px 4px rgba(255,59,59,0.4);
  --radio-shadow-glow-cool: 0 0 16px 2px rgba(91,164,201,0.25);

  /* --- Border Radius --- */
  --radio-radius-sm: 6px;
  --radio-radius-md: 10px;
  --radio-radius-lg: 16px;
  --radio-radius-xl: 24px;
  --radio-radius-full: 9999px;
  --radio-radius-round: 50%;

  /* --- Transitions --- */
  --radio-duration-instant: 50ms;
  --radio-duration-fast: 100ms;
  --radio-duration-base: 200ms;
  --radio-duration-slow: 300ms;
  --radio-duration-slower: 500ms;

  --radio-easing-default: cubic-bezier(0.25, 0.1, 0.25, 1.0);
  --radio-easing-in: cubic-bezier(0.4, 0, 1, 1);
  --radio-easing-out: cubic-bezier(0, 0, 0.2, 1);
  --radio-easing-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --radio-easing-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
  --radio-easing-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --radio-duration-fast: 0ms;
    --radio-duration-base: 0ms;
    --radio-duration-slow: 0ms;
    --radio-duration-slower: 0ms;
  }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### 2.2 Tailwind Config (`tailwind.config.js` -- `theme.extend`)

```js
// Paste into tailwind.config.js under theme.extend
{
  colors: {
    radio: {
      // Surface hierarchy
      'surface-base': '#08080d',
      'surface-1': '#101018',
      'surface-2': '#1a1a25',
      'surface-3': '#242433',
      'surface-highlight': '#2a2a3d',

      // Borders
      'border-subtle': '#1e1e2e',
      'border-default': '#2d2d42',
      'border-strong': '#3d3d57',
      'border-focus': '#e8924b',

      // Primary (Broadcast Amber)
      primary: '#e8924b',
      'primary-hover': '#f0a565',
      'primary-active': '#d07a35',
      'primary-muted': '#e8924b26',
      'primary-subtle': '#1f1610',

      // Secondary (Studio Cyan)
      secondary: '#5ba4c9',
      'secondary-hover': '#74b8dc',
      'secondary-active': '#4890b5',
      'secondary-muted': '#5ba4c926',
      'secondary-subtle': '#0f161b',

      // Semantic
      success: '#34d399',
      'success-muted': '#34d39918',
      'success-subtle': '#0f1f19',
      warning: '#f0b429',
      'warning-muted': '#f0b42918',
      'warning-subtle': '#1f1a0f',
      error: '#f06060',
      'error-muted': '#f0606018',
      'error-subtle': '#1f1010',
      info: '#5ba4c9',
      'info-muted': '#5ba4c918',
      'info-subtle': '#0f161b',

      // Text hierarchy
      'text-primary': '#ededf0',
      'text-secondary': '#a8a8b8',
      'text-tertiary': '#6e6e82',
      'text-disabled': '#45455a',

      // Interactive
      'hover-overlay': '#ffffff0a',
      'active-overlay': '#ffffff12',
      'focus-ring': '#e8924b',
      'focus-ring-offset': '#08080d',

      // Live / On-Air
      live: '#ff3b3b',
      'live-glow': '#ff3b3b60',
      'live-bg': '#ff3b3b15',
    },
  },

  fontFamily: {
    display: ["'Space Grotesk'", 'system-ui', 'sans-serif'],
    body: ["'Inter'", 'system-ui', '-apple-system', 'sans-serif'],
    mono: ["'JetBrains Mono'", "'Fira Code'", 'monospace'],
  },

  fontSize: {
    xs:   ['0.75rem',  { lineHeight: '1.5',  letterSpacing: '0.02em' }],
    sm:   ['0.875rem', { lineHeight: '1.5',  letterSpacing: '0.01em' }],
    base: ['1rem',     { lineHeight: '1.6',  letterSpacing: '0em' }],
    lg:   ['1.125rem', { lineHeight: '1.5',  letterSpacing: '-0.005em' }],
    xl:   ['1.25rem',  { lineHeight: '1.4',  letterSpacing: '-0.01em' }],
    '2xl': ['1.5rem',  { lineHeight: '1.35', letterSpacing: '-0.015em' }],
    '3xl': ['1.875rem',{ lineHeight: '1.3',  letterSpacing: '-0.02em' }],
    '4xl': ['2.5rem',  { lineHeight: '1.2',  letterSpacing: '-0.025em' }],
  },

  borderRadius: {
    sm:   '6px',
    md:   '10px',
    lg:   '16px',
    xl:   '24px',
    full: '9999px',
    round: '50%',
  },

  boxShadow: {
    sm:        '0 1px 2px 0 rgba(0,0,0,0.4), 0 1px 3px 0 rgba(0,0,0,0.3)',
    md:        '0 4px 6px -1px rgba(0,0,0,0.5), 0 2px 4px -2px rgba(0,0,0,0.4)',
    lg:        '0 10px 15px -3px rgba(0,0,0,0.6), 0 4px 6px -4px rgba(0,0,0,0.5)',
    xl:        '0 20px 25px -5px rgba(0,0,0,0.7), 0 8px 10px -6px rgba(0,0,0,0.6)',
    inner:     'inset 0 2px 4px 0 rgba(0,0,0,0.4)',
    'glow-sm': '0 0 8px 0 rgba(232,146,75,0.25)',
    'glow-md': '0 0 16px 2px rgba(232,146,75,0.3)',
    'glow-lg': '0 0 24px 4px rgba(232,146,75,0.35)',
    'glow-live': '0 0 20px 4px rgba(255,59,59,0.4)',
    'glow-cool': '0 0 16px 2px rgba(91,164,201,0.25)',
  },

  keyframes: {
    'eq-1': {
      '0%, 100%': { height: '4px' },
      '50%': { height: '16px' },
    },
    'eq-2': {
      '0%, 100%': { height: '12px' },
      '50%': { height: '4px' },
    },
    'eq-3': {
      '0%, 100%': { height: '8px' },
      '50%': { height: '16px' },
    },
    slideUp: {
      '0%': { transform: 'translateY(1rem)', opacity: '0' },
      '100%': { transform: 'translateY(0)', opacity: '1' },
    },
    slideOut: {
      '0%': { transform: 'translateX(0)', opacity: '1' },
      '100%': { transform: 'translateX(1rem)', opacity: '0' },
    },
    fadeIn: {
      '0%': { opacity: '0' },
      '100%': { opacity: '1' },
    },
    fadeOut: {
      '0%': { opacity: '1' },
      '100%': { opacity: '0' },
    },
    scaleIn: {
      '0%': { transform: 'scale(0.95)', opacity: '0' },
      '100%': { transform: 'scale(1)', opacity: '1' },
    },
    rowFlash: {
      '0%': { backgroundColor: 'transparent' },
      '30%': { backgroundColor: 'rgba(232,146,75,0.2)' },
      '100%': { backgroundColor: 'transparent' },
    },
    liveGlow: {
      '0%, 100%': { boxShadow: '0 0 0 0 rgba(255,59,59,0.4)' },
      '50%': { boxShadow: '0 0 8px 2px rgba(255,59,59,0.2)' },
    },
    pulseLive: {
      '0%, 100%': { transform: 'scale(1)', opacity: '1' },
      '50%': { transform: 'scale(1.15)', opacity: '0.7' },
    },
    shake: {
      '0%, 100%': { transform: 'translateX(0)' },
      '20%, 60%': { transform: 'translateX(-4px)' },
      '40%': { transform: 'translateX(4px)' },
      '80%': { transform: 'translateX(2px)' },
    },
    shimmer: {
      '0%': { backgroundPosition: '200% 0' },
      '100%': { backgroundPosition: '-200% 0' },
    },
    messageIn: {
      '0%': { transform: 'translateY(8px)', opacity: '0' },
      '100%': { transform: 'translateY(0)', opacity: '1' },
    },
    scalePulse: {
      '0%, 100%': { transform: 'scale(1)' },
      '50%': { transform: 'scale(1.1)' },
    },
    spin: {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' },
    },
  },

  animation: {
    'eq-1':        'eq-1 0.8s ease-in-out infinite',
    'eq-2':        'eq-2 0.6s ease-in-out infinite',
    'eq-3':        'eq-3 0.9s ease-in-out infinite',
    'slide-up':    'slideUp 300ms ease-out',
    'slide-out':   'slideOut 200ms ease-in forwards',
    'fade-in':     'fadeIn 200ms ease-out',
    'fade-out':    'fadeOut 150ms ease-in forwards',
    'scale-in':    'scaleIn 200ms ease-out',
    'row-flash':   'rowFlash 600ms ease-out',
    'live-glow':   'liveGlow 2s ease-in-out infinite',
    'pulse-live':  'pulseLive 2s ease-in-out infinite',
    'shake':       'shake 300ms ease-in-out',
    'shimmer':     'shimmer 1.5s ease-in-out infinite',
    'message-in':  'messageIn 200ms ease-out',
    'scale-pulse': 'scalePulse 250ms ease-out',
    'spin':        'spin 1s linear infinite',
  },

  transitionDuration: {
    instant: '50ms',
    fast:    '100ms',
    base:    '200ms',
    slow:    '300ms',
    slower:  '500ms',
  },

  transitionTimingFunction: {
    'ease-default': 'cubic-bezier(0.25, 0.1, 0.25, 1.0)',
    'ease-in':      'cubic-bezier(0.4, 0, 1, 1)',
    'ease-out':     'cubic-bezier(0, 0, 0.2, 1)',
    'ease-in-out':  'cubic-bezier(0.4, 0, 0.2, 1)',
    'ease-bounce':  'cubic-bezier(0.34, 1.56, 0.64, 1)',
    'ease-spring':  'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
}
```

---

## 3. Component Implementation Guide

> Full state tables are in `design/components.md`. This section gives the Tailwind classes for default states and key transitions.

**Conflict resolution note:** The old `components.md` references `radio-accent #e63946`. Per `visual-system.md`, primary is now `#e8924b` (amber). All component specs below use the new amber system. The LIVE badge uses `#ff3b3b`. Error uses `#f06060`.

---

### 3.1 PlayerBar

**Persistent bottom audio control bar.**

```
Position:  fixed bottom-0 left-0 right-0 z-50
Height:    h-16 (sm-lg) | xl:h-[72px]
```

**Default Tailwind classes:**
```
fixed bottom-0 left-0 right-0 z-50 h-16 xl:h-[72px]
bg-radio-surface-1/95 backdrop-blur-md
border-t border-radio-border-subtle
flex items-center px-4 gap-4
```

**HTML structure:**
```html
<div role="region" aria-label="Audio player" class="fixed bottom-0 ...">
  <button aria-label="Play"><!-- PlayPauseButton --></button>
  <div aria-hidden="true"><!-- Equalizer bars (when playing) --></div>
  <div class="flex-1 min-w-0 truncate">
    <span class="text-sm text-radio-text-primary">Track Title</span>
    <span class="text-xs text-radio-text-secondary">Artist</span>
  </div>
  <!-- LIVE badge (conditional) -->
  <button aria-label="Skip to next track"><!-- Skip icon --></button>
  <div class="hidden md:flex items-center gap-2"><!-- VolumeSlider --></div>
  <div aria-label="12 listeners" class="text-xs text-radio-text-secondary">12</div>
</div>
```

**State transitions:**
| State | Change |
|-------|--------|
| Playing | Add `shadow-[0_-1px_12px_0_rgba(232,146,75,0.15)]`, show equalizer bars |
| Paused | Remove glow shadow, hide equalizer |
| Live mode | Hide skip button, show LIVE badge, replace track info with "LIVE" |
| Error | Track info text becomes `text-radio-error`, show "Stream unavailable" |

**ARIA:** `role="region"` `aria-label="Audio player"`. Error text uses `aria-live="assertive"`.

---

### 3.2 Play/Pause Button

**The most important interactive element.**

```
Size:  w-11 h-11 (44px) in PlayerBar | w-14 h-14 (56px) hero/splash
Shape: rounded-full
```

**Default (Play) Tailwind classes:**
```
w-11 h-11 rounded-full
bg-radio-primary flex items-center justify-center
transition-all duration-base
focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2
focus-visible:ring-offset-radio-surface-base
```

**State transitions:**
| State | Class changes |
|-------|-------------|
| Hover | `hover:bg-radio-primary-hover` (or `filter brightness-110`) |
| Active | `active:scale-[0.95] active:bg-radio-primary-active` |
| Buffering | Replace icon with `animate-spin` spinner, add `aria-busy="true"` |

**Button text color:** Dark text `#101018` on amber background for 5.8:1 contrast. Icon SVGs use `fill="#101018"`.

**ARIA:** `aria-label="Play"` toggles to `"Pause"` when playing.

---

### 3.3 NowPlayingHero

**Large display of current track -- visual centerpiece.**

**Default Tailwind classes:**
```
bg-gradient-to-b from-radio-surface-1 to-transparent
border border-radio-border-subtle rounded-xl
min-h-[200px] md:min-h-[240px]
p-6 md:p-8
flex flex-col items-center justify-center
```

**Content structure:**
```html
<div aria-live="polite" class="...">
  <div aria-hidden="true" class="flex gap-[3px] h-6 items-end">
    <!-- 5 equalizer bars, 4px wide, rounded-full, bg-radio-primary -->
  </div>
  <h2 class="font-display text-2xl font-bold text-radio-text-primary mt-4">Track Title</h2>
  <p class="text-lg text-radio-text-secondary mt-1">Artist Name</p>
  <!-- LIVE badge (conditional) -->
  <p class="text-sm text-radio-text-secondary mt-6">12 listeners</p>
</div>
```

**State transitions:**
| State | Change |
|-------|--------|
| Live mode | Show LIVE badge (`bg-radio-live-bg text-[#ff3b3b] animate-live-glow`), show DJ name |
| Idle | Title becomes "EPIRBE Radio", subtitle "Waiting for stream...", hide equalizer |
| Track change | Title/artist cross-fade (opacity transition, 400ms) |

---

### 3.4 Chat Message + Input

**Message (`<li>` inside `<ul role="log" aria-live="polite">`):**

```
<!-- User message -->
<li class="px-4 py-1 animate-message-in">
  <span class="font-semibold text-radio-primary text-sm">username</span>
  <span class="text-radio-text-tertiary text-xs ml-2">2m ago</span>
  <span class="text-radio-text-primary text-sm ml-2">message text</span>
</li>

<!-- Own message: username uses text-radio-secondary (cyan) -->
<!-- System message: text-radio-text-tertiary text-xs italic, centered -->
```

**Chat Input:**
```
<div class="border-t border-radio-border-subtle flex items-center">
  <label for="chat-input" class="sr-only">Chat message</label>
  <input id="chat-input"
    class="flex-1 bg-transparent px-4 py-2 text-sm text-radio-text-primary
           placeholder:text-radio-text-tertiary
           focus-visible:outline-none"
    placeholder="Say something..." />
  <button class="px-4 py-2 text-sm font-semibold text-radio-primary
                 min-h-[44px] hover:bg-radio-surface-2 transition-colors">
    Send
  </button>
</div>
```

**ARIA:** `<ul role="log" aria-live="polite">`. Disabled state: `aria-disabled="true"`, placeholder "Connecting..."

---

### 3.5 Track Row

**A single row in the library table.**

**Default Tailwind classes:**
```
<tr class="transition-colors duration-fast hover:bg-radio-border-subtle/50">
  <td class="px-4 py-1.5">
    <input type="checkbox" class="accent-radio-primary" />
  </td>
  <td class="px-4 py-1.5 text-sm text-radio-text-primary truncate max-w-[200px]">
    Track Title
  </td>
  <td class="px-4 py-1.5 text-sm text-radio-text-secondary truncate max-w-[150px]">
    Artist
  </td>
  <td class="px-4 py-1.5 text-sm text-radio-text-secondary text-right">3:42</td>
  <td class="px-4 py-1.5">
    <button aria-label="Add to playlist" class="text-radio-primary hover:brightness-125 min-h-[44px]">+</button>
  </td>
</tr>
```

**State transitions:**
| State | Change |
|-------|--------|
| Hover | `bg-radio-border-subtle/50` |
| Selected | `bg-radio-primary-muted`, checkbox checked |
| Currently playing | `bg-radio-primary-muted`, left `border-l-2 border-radio-primary`, title `text-radio-primary` |
| Add flash | `animate-row-flash` on the `<tr>` |
| Disabled (no playlist) | Action button `opacity-50 cursor-not-allowed`, `title="Select a playlist first"` |

---

### 3.6 Button (Primary Variant)

**Sizes:** sm (44px min-h), md (48px min-h), lg (56px min-h)

**Default (primary, md) Tailwind classes:**
```
inline-flex items-center justify-center
min-h-[48px] min-w-[48px] px-4 py-2
bg-radio-primary text-radio-surface-1 text-base font-semibold
rounded-md transition-all duration-base
focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2
focus-visible:ring-offset-radio-surface-1
```

**State transitions:**
| State | Class changes |
|-------|-------------|
| Hover | `hover:bg-radio-primary-hover` |
| Active | `active:bg-radio-primary-active active:scale-[0.97]` |
| Disabled | `disabled:opacity-50 disabled:pointer-events-none` |
| Loading | Replace children with spinner, add `aria-busy="true"` |

**Note:** Primary buttons use **dark text** (`text-radio-surface-1` / `#101018`), not white, for 5.8:1 contrast on amber.

---

### 3.7 Search Input

**Default Tailwind classes:**
```
bg-radio-surface-base border border-radio-border-default rounded-sm
px-3 py-1 text-sm text-radio-text-primary
placeholder:text-radio-text-tertiary
w-40
focus:border-radio-primary focus-visible:outline-none
transition-colors duration-fast
```

**State transitions:**
| State | Change |
|-------|--------|
| Focused | `border-radio-primary` |
| Has value | Show clear button (X icon, `text-radio-text-tertiary hover:text-radio-text-primary`) |
| Loading | Show 12px spinner beside clear button, add `aria-busy="true"` |

**ARIA:** `<label for="library-search" class="sr-only">Search tracks</label>`

---

### 3.8 Playlist Item

**Default (sidebar entry) Tailwind classes:**
```
<div role="option" aria-selected="false" tabindex="0"
  class="flex items-center px-3 py-2 cursor-pointer transition-colors duration-fast
         hover:bg-radio-border-subtle/50">
  <span class="flex-1 truncate text-sm text-radio-text-primary">Playlist Name</span>
  <span class="text-xs text-radio-text-secondary ml-2">(12)</span>
  <button class="ml-2 bg-radio-primary-muted text-radio-primary text-xs px-2.5 py-1.5
                 min-h-[36px] rounded-md hover:bg-radio-primary-muted/60 transition-colors">
    Activate
  </button>
  <button aria-label="Delete Playlist Name"
    class="ml-1 bg-radio-error-muted text-radio-error text-xs px-2.5 py-1.5
           min-h-[36px] rounded-md hover:bg-radio-error-muted/60 transition-colors">
    Delete
  </button>
</div>
```

**State transitions:**
| State | Change |
|-------|--------|
| Selected (viewing) | `bg-radio-surface-2` |
| Active (playing) | Name becomes `text-radio-primary font-semibold`, Activate replaced by checkmark |
| Focus-visible | `ring-2 ring-white ring-offset-2` |

---

### 3.9 Toast

**Default Tailwind classes (success variant):**
```
<div role="status" aria-live="polite"
  class="flex items-center gap-3 rounded-lg border-l-4
         border-radio-success bg-radio-surface-1
         px-4 py-3 text-radio-text-primary shadow-lg
         text-sm max-w-[400px] animate-slide-up">
  <span class="text-radio-success">&#x2713;</span>
  <span class="flex-1">Track added to playlist</span>
  <button aria-label="Dismiss notification"
    class="text-radio-text-tertiary hover:text-radio-text-primary transition-colors">
    &times;
  </button>
</div>
```

**Variants by `border-l` color:** success `border-radio-success`, error `border-radio-error` (+ `role="alert" aria-live="assertive"`), info `border-radio-info`.

**Lifecycle:** Enter `animate-slide-up` (300ms). Auto-dismiss 4s (6s for errors). Exit `animate-slide-out` (200ms). Max 3 stacked, 8px gap.

---

### 3.10 LIVE Badge

**Default Tailwind classes (PlayerBar size):**
```
<span class="inline-flex items-center gap-1.5 bg-radio-live-bg text-[#ff3b3b]
             text-xs font-semibold px-2 py-0.5 rounded-full animate-live-glow">
  <span class="w-1.5 h-1.5 bg-radio-live rounded-full animate-pulse"
        aria-hidden="true"></span>
  LIVE
</span>
```

**Sizes:** PlayerBar: `px-2 py-0.5 text-xs`, dot `w-1.5 h-1.5`. Hero: `px-3 py-1 text-sm`, dot `w-2 h-2`.

**Reduced motion:** No pulse, no glow. Static red dot, static border.

**ARIA:** Visible text "LIVE" is sufficient. If standalone without text, add `aria-label="Live broadcast"`.

---

## 4. Layout System Summary

### 4.1 Screen Reference Table

| Screen | Breakpoint | Grid | Key Behavior |
|--------|-----------|------|-------------|
| Listener Mobile | `<640px` | `grid-cols-1` | Hero + Library stacked. Chat via FAB (48px circle, `bottom-20 right-4 z-40`) + bottom sheet (60vh max). PlayerBar `h-16`. No volume slider. |
| Listener Tablet | `768-1023px` | `grid-cols-2 gap-6` | Row 1: Hero + Chat side-by-side. Row 2: Library `col-span-2`. Chat `h-[320px]`. PlayerBar `h-16` with volume `w-16`. |
| Listener Desktop | `1280px+` | `grid-cols-[2fr_1.5fr_1fr] gap-6` | All three panels in one row. PlayerBar `h-[72px]` with volume `w-24`. |
| Admin Desktop | `1024px+` | `grid-cols-2 gap-6` | Left: Mic + Playlists. Right: Library + Chat. |
| Admin Mobile | `<640px` | Tab bar (4 tabs) | Tabs: Mic, Lists, Lib, Chat. Tab bar `h-12 sticky top-[56px] z-20`. |
| Splash | Any | No grid | `fixed inset-0 z-[60]` centered flex. "Start Listening" button. |
| Login | Any | Inline header | Password input expands inline in header. Mobile: wraps to second row. |

### 4.2 Z-Index Stack

```
z-0     Base content
z-10    Library sticky thead
z-20    Admin tab bar (mobile)
z-30    Chat bottom sheet overlay (mobile)
z-40    Chat bottom sheet + FAB (mobile)
z-50    Header (sticky) + PlayerBar (fixed bottom)
z-55    Toast notifications
z-60    Modals / Splash
z-70    Command bar (future)
```

### 4.3 Persistent Element Dimensions

| Element | sm | md | lg | xl+ |
|---------|----|----|----|----|
| Header height | 56px (min) | 56px | 56px | 56px |
| PlayerBar height | 64px | 64px | 64px | 72px |
| Play button | 44px | 44px | 44px | 44px |
| Content bottom padding | 80px | 80px | 80px | 96px |

---

## 5. Interaction Cheat Sheet

### 5.1 Keyboard Shortcuts

| Key | Action | Context |
|-----|--------|---------|
| `Space` | Play / Pause | Suppressed in text inputs |
| `N` | Skip track | Suppressed in text inputs. No-op when live. |
| `M` | Mute / Unmute | Suppressed in text inputs |
| `ArrowUp` | Volume +5% | Suppressed in text inputs and range inputs |
| `ArrowDown` | Volume -5% | Suppressed in text inputs and range inputs |
| `/` | Focus search input | Suppressed in text inputs |
| `Escape` | Close topmost overlay / exit admin | Always active |
| `?` | Toggle keyboard shortcuts overlay | Suppressed in text inputs |
| `Ctrl+K` / `Cmd+K` | Open command bar (future) | Always active |

### 5.2 Animation Reference

| Name | Duration | Timing | Iteration | Used By |
|------|----------|--------|-----------|---------|
| `eq-1` | 800ms | ease-in-out | infinite | Equalizer bar 1 |
| `eq-2` | 600ms | ease-in-out | infinite | Equalizer bar 2 |
| `eq-3` | 900ms | ease-in-out | infinite | Equalizer bar 3 |
| `slide-up` | 300ms | ease-out | once | Toast entry |
| `slide-out` | 200ms | ease-in | once | Toast exit |
| `fade-in` | 200ms | ease-out | once | General entrance |
| `fade-out` | 150ms | ease-in | once | General exit |
| `scale-in` | 200ms | ease-out | once | Dialog content entrance |
| `row-flash` | 600ms | ease-out | once | Track added to playlist |
| `live-glow` | 2000ms | ease-in-out | infinite | LIVE badge box-shadow |
| `pulse-live` | 2000ms | ease-in-out | infinite | LIVE dot scale+opacity |
| `shake` | 300ms | ease-in-out | once | Login error input |
| `shimmer` | 1500ms | ease-in-out | infinite | Skeleton loading |
| `message-in` | 200ms | ease-out | once | Chat message entry |
| `scale-pulse` | 250ms | ease-out | once | Play button press |
| `spin` | 1000ms | linear | infinite | Loading spinners |

### 5.3 User Flows (One-Liners)

1. **First Visit:** Splash (z-60) with "Start Listening" -> fade out 400ms -> focus Play button.
2. **Play/Pause:** Click or Space -> icon morph 200ms + scale pulse 250ms -> audio.play() await -> eq bars fade in.
3. **Skip Track:** Click or N -> flash skip button -> POST /api/stream/skip -> crossfade track info -> toast.
4. **Volume:** Drag slider or Up/Down arrows (5% steps) -> real-time update, no API call.
5. **Mute:** M key -> volume to 0, icon changes to muted. M again -> restore previous volume.
6. **Search Library:** / to focus -> type (300ms debounce) -> shimmer skeleton -> GET results -> stagger rows in (30ms each).
7. **Add to Playlist:** Click + button -> rotate+scale icon -> POST add -> row flash -> toast confirmation.
8. **Create Playlist:** Type name -> Enter or click Create -> POST -> slide-in new item + accent border flash 600ms -> toast.
9. **Activate Playlist:** Click Activate -> loading spinner -> POST activate -> accent border pulse + checkmark icon -> toast.
10. **Delete Playlist:** Click trash -> ConfirmDialog (scale-in 200ms) -> confirm -> row collapse (h->0, opacity->0, 200ms) -> toast.
11. **Go Live:** Click "Go Live" -> ConfirmDialog -> mic permission -> WebSocket -> LIVE badges appear (slide-in 200ms) -> AudioMeter activates.
12. **Send Chat:** Type + Enter -> input clears immediately -> WS sends -> message slide-up 200ms -> auto-scroll.
13. **Login as DJ:** Click DJ button -> password input slides in (200ms) -> type + Enter -> POST auth -> slide out -> switch to admin.
14. **View Switch:** Admin <-> Listener crossfade (outgoing 150ms, incoming 200ms, 100ms stagger).

---

## 6. Accessibility Quick Reference

### 6.1 Top 10 WCAG Items to Verify

| # | Criterion | What to Check |
|---|-----------|---------------|
| 1 | **1.1.1 Non-text Content** | Every icon button has `aria-label`. Decorative SVGs have `aria-hidden="true"`. AudioMeter has `role="meter"`. |
| 2 | **1.3.1 Info and Relationships** | Landmarks: `<header>`, `<main id="main-content">`, `role="region"` on PlayerBar. Headings: h1 "EPIRBE Radio", h2 for each section. Chat uses `<ul>/<li>`. Playlists use `role="listbox"`/`role="option"`. |
| 3 | **1.4.3 Contrast (Minimum)** | `text-primary` on `surface-1` = 13.6:1. `text-secondary` = 6.5:1. `text-tertiary` = 3.3:1 (large text only). Primary on surface-1 = 5.8:1. Primary buttons use dark text (5.8:1). |
| 4 | **2.1.1 Keyboard** | All functions reachable via Tab. Shortcuts: Space, N, M, /, Escape, ?. Shortcuts suppressed in text inputs. |
| 5 | **2.4.1 Bypass Blocks** | Skip-to-content link (`<a href="#main-content">`) as first focusable element, `sr-only focus:not-sr-only`. |
| 6 | **2.4.7 Focus Visible** | Global `*:focus-visible { outline: 2px solid #ffffff; outline-offset: 2px; }`. White on dark = 19:1 contrast. |
| 7 | **2.5.5 Target Size** | All interactive elements 44x44px minimum. Skip button, DJ button, chat send, library rows need padding increase. |
| 8 | **4.1.2 Name, Role, Value** | Buttons have `aria-label` or visible text. Inputs have `<label>`. Volume: `aria-valuenow`/`aria-valuetext`. Chat: `role="log"`. Dialog: `role="alertdialog"`. |
| 9 | **3.3.1 Error Identification** | Login error: red border + `aria-invalid="true"` + sr-only error message. API errors: toast with description. |
| 10 | **2.2.2 Pause, Stop, Hide** | `prefers-reduced-motion: reduce` kills all animations. Equalizer bars freeze at 10px. No auto-play. |

### 6.2 Focus Order by View

**Listener View:**
```
1. Skip-to-content link
2. [Header] DJ button
3. [Header] Login input + submit (if visible)
4. [Chat] Edit username button
5. [Chat] Message input
6. [Chat] Send button
7. [Library] Search input
8. [Library] Scan button
9. [Library] Track rows (checkbox, + button each)
10. [PlayerBar] Play/Pause
11. [PlayerBar] Skip
12. [PlayerBar] Volume slider
```

**Admin View:**
```
1. Skip-to-content link
2. [Admin Header] Listener View button
3. [Admin Header] Logout button
4. [Left] Go Live / Stop Mic button
5. [Left] Playlist name input + Create button
6. [Left] Each playlist item (Activate, Delete)
7. [Right] Library search + Scan + track rows
8. [Right] Chat input + Send
9. [PlayerBar] Play/Pause, Skip, Volume
```

### 6.3 aria-live Regions

| Component | Level | What It Announces |
|-----------|-------|-------------------|
| NowPlayingHero container | `polite` | Track changes: "[Title] by [Artist]" |
| Chat `<ul role="log">` | `polite` | New messages: "[username]: [message]" |
| Toast container | `polite` (success/info), `assertive` (error) | Toast text content |
| Listener count | `role="status"` | "[N] listeners" on count change |
| SrAnnouncer (root-level) | `polite` / `assertive` | Programmatic announcements (skip, mute, view switch) |
| Autoplay warning text | `assertive` | "Playback blocked. Press play again to start." |

---

## 7. Migration Checklist

### Token & Config Updates
- [ ] Replace `tailwind.config.js` colors with new `radio.*` token set (Section 2.2)
- [ ] Add `fontFamily` entries for `display`, `body`, `mono` to tailwind config
- [ ] Replace `fontSize` scale with new values including letter-spacing
- [ ] Add `borderRadius` scale (`sm: 6px`, `md: 10px`, etc.)
- [ ] Add `boxShadow` entries including all `glow-*` tokens
- [ ] Add all `keyframes` and `animation` entries to tailwind config
- [ ] Add `transitionDuration` and `transitionTimingFunction` entries
- [ ] Update `index.css` `:root` with full CSS custom properties block (Section 2.1)
- [ ] Add `prefers-reduced-motion` override block to `index.css`
- [ ] Add Google Fonts import for Space Grotesk, Inter, JetBrains Mono

### Component Restyling
- [ ] Restyle `Button` / `IconButton` with amber primary + dark text (`text-radio-surface-1`)
- [ ] Restyle `PlayerBar` with new surface/border tokens + amber glow when playing
- [ ] Restyle `NowPlayingHero` with gradient system + Space Grotesk headings
- [ ] Restyle `PlayPauseButton` with amber background + dark icon fill
- [ ] Update LIVE badge to use `#ff3b3b` (dedicated live color, not error red)
- [ ] Update `ChatMessage` username color from old accent to `text-radio-primary`
- [ ] Update `ChatInput` send button color to `text-radio-primary`
- [ ] Update `SearchInput` focus border to `border-radio-primary`
- [ ] Update `Toast` border-left colors to new semantic tokens (success/error/info)
- [ ] Update `ConfirmDialog` confirm button to amber primary (or red for danger variant)
- [ ] Update `PlaylistItem` active state to use `text-radio-primary` (amber)
- [ ] Restyle `TrackRow` hover/selected with new surface + primary-muted tokens
- [ ] Update `VolumeSlider` accent color to `accent-radio-primary`
- [ ] Update `AudioMeter` to use new success/warning/error colors
- [ ] Add `SourceSwitch` button states using new amber/warning/error token system

### Layout Changes
- [ ] Add `md:768px` responsive breakpoint to listener grid (currently only mobile/desktop)
- [ ] Implement 3-col grid `grid-cols-[2fr_1.5fr_1fr]` at `xl:1280px`
- [ ] Implement Chat as mobile FAB + bottom sheet (z-40)
- [ ] Implement Admin mobile tab bar (4 tabs, sticky below header, z-20)
- [ ] Update content bottom padding: `pb-20` (sm) / `pb-24` (xl+)
- [ ] Add `min-h-[44px]` to all interactive elements below 44px (skip button, DJ button, send, track rows, etc.)

### Accessibility
- [ ] Add `role="region" aria-label="Audio player"` to PlayerBar
- [ ] Add `<header role="banner">` / `<main role="main" id="main-content">`
- [ ] Add skip-to-content link as first focusable element
- [ ] Add `aria-live="polite"` to NowPlayingHero container
- [ ] Add `role="log" aria-live="polite"` to Chat message list
- [ ] Add `<label>` elements (visible or `sr-only`) to all inputs
- [ ] Add `aria-label` to all icon-only buttons
- [ ] Add `SrAnnouncer` component at app root for programmatic announcements
- [ ] Add global `*:focus-visible { outline: 2px solid #ffffff; outline-offset: 2px; }`
- [ ] Add `autocomplete="current-password"` to DJ password input
- [ ] Change AdminDashboard inner header from `<header>` to `<div>` with `<h2>`
- [ ] Add `prefers-contrast: more` and `forced-colors: active` CSS overrides

### Interaction Additions
- [ ] Implement keyboard shortcut handler (`useKeyboardShortcuts` hook with focus-guard)
- [ ] Implement keyboard shortcuts overlay (? key, modal, focus-trapped)
- [ ] Add play/pause icon morph animation (200ms opacity crossfade)
- [ ] Add PlayerBar glow-on-playing (`shadow-[0_-1px_12px_0_rgba(232,146,75,0.15)]`)
- [ ] Add toast slide-in/slide-out animations
- [ ] Add dialog backdrop blur + content scale-in animation
- [ ] Add track row flash animation on add-to-playlist
- [ ] Add input shake animation on login error
- [ ] Add shimmer skeleton loading states
- [ ] Add chat message slide-in animation
- [ ] Add view transition crossfade (listener <-> admin)
- [ ] Implement debounced search (300ms) in Library
- [ ] Implement virtual scrolling for Library track list (react-virtual)

### Bug Fixes (from UX Audit)
- [ ] Fix duplicate Chat rendering (single instance, CSS-positioned)
- [ ] Replace `alert()` with Toast system
- [ ] Fix play() race condition (await promise, handle autoplay block)
- [ ] Replace `setSelectedPlaylistId(null); setTimeout(...)` hack
- [ ] Connect `isLive` prop to SourceSwitch state
- [ ] Implement auth gate for DJ/admin controls

---

*Full specifications: `design/visual-system.md` (tokens), `design/components.md` (all states), `design/layouts.md` (wireframes), `design/interactions.md` (flows + animations), `design/accessibility.md` (WCAG compliance).*
