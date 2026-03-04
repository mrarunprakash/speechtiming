

## Plan: Make App Fit Viewport Without Scrolling (Native-Feel Layout)

The core issue is that every screen uses `min-h-screen` with its own padding/spacing, and `MeetingSetup` has a nested `min-h-screen` inside the already `min-h-screen` parent layout in `Index.tsx`. This causes double-height content and unnecessary scrolling.

### Root Cause
- `Index.tsx` wraps everything in `flex min-h-screen flex-col` with header + main + footer
- Each child component (MeetingSetup, SpeakersList, TimerView, TimerReport) also uses `min-h-screen`, doubling the height
- No use of `h-screen` / `overflow-hidden` to contain content within the viewport

### Changes

**1. `src/pages/Index.tsx`**
- Change outer wrapper from `min-h-screen` to `h-[100dvh]` (dynamic viewport height for mobile browsers) with `overflow-hidden`
- Make `<main>` use `flex-1 overflow-hidden` so child content fills remaining space between header and footer

**2. `src/components/MeetingSetup.tsx`**
- Remove `min-h-screen` — replace with `h-full flex items-center justify-center`
- Content will center within the available main area

**3. `src/components/SpeakersList.tsx`**
- Remove `min-h-screen` — use `h-full flex flex-col overflow-hidden`
- Make the speakers list area scrollable (`overflow-y-auto flex-1`) while keeping header card and bottom button fixed
- Change the fixed bottom button from `fixed` positioning to a flex-based sticky footer within the container

**4. `src/components/TimerView.tsx`**
- Remove `min-h-screen` — use `h-full flex flex-col`
- Timer display area uses `flex-1` to fill available space
- Controls stay pinned at bottom naturally

**5. `src/components/TimerReport.tsx`**
- Remove `min-h-screen` — use `h-full flex flex-col overflow-hidden`
- Make speaker cards area scrollable with `overflow-y-auto flex-1`
- Keep action buttons pinned at bottom

**6. `src/index.css`**
- Add `html, body, #root { height: 100%; overflow: hidden; }` to prevent any page-level scrolling

These changes will make every screen fit exactly within the viewport on phone, tablet, and desktop — no page scroll, with internal scroll only where content overflows (speakers list, report cards).

