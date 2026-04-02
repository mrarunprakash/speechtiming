

## Plan: Restyle Timer Display Component

Visual-only changes to `src/components/TimerView.tsx`. Zero logic changes.

### Changes

**1. Timer digits** (line 207)
- Scale to `text-[28vw] md:text-[18vw]` with `font-mono` (already maps to DM Mono)
- Remove `mb-4` spacing, let digits breathe

**2. Radial glow behind digits** (new wrapper around timer area, ~line 205)
- Add a `div` with absolute-positioned radial gradient glow
- Color derived from current status: green (`#22c55e`), yellow (`#eab308`), red (`#ef4444`), neutral (transparent)
- CSS: `radial-gradient(circle, {color}26 0%, transparent 70%)` with `blur-[80px]` or inline `filter`
- Apply `transition-all duration-[800ms] ease-in-out` for smooth color transitions
- Helper function `getGlowColor()` returns the color string based on same timing thresholds (no new logic — reuses existing second/threshold comparisons)

**3. Speaker name** (line 196)
- Restyle from `text-2xl font-bold` to `text-xs uppercase tracking-[0.25em] text-muted-foreground font-medium`
- Position stays above timer (already is)

**4. Color label** (line 210-212)
- Keep text but make it smaller/subtler since the glow now conveys status: `text-sm uppercase tracking-[0.2em] text-muted-foreground`

**5. Speaker info bar** (lines 195-202)
- Remove `bg-background/80 backdrop-blur-sm` wrapper — merge speaker name into the main timer area so digits sit directly on the status background

**6. Control buttons** (lines 258-331)
- Start/Pause/Resume/Stop buttons: change from `w-full h-16` rectangles to centered circular pills: `w-[72px] h-[72px] rounded-full p-0 mx-auto` with icon only (remove text labels like "Start", "Pause")
- Secondary buttons (Reset, Continue, Generate Report): keep as full-width but smaller
- Wrap controls in `flex flex-col items-center` instead of `space-y-3`

**7. Stopped overlay card** (lines 216-254)
- Keep as-is (already styled with `bg-[#ffffff08] rounded-2xl`)

### File changed
- `src/components/TimerView.tsx` only (~30 lines modified)

