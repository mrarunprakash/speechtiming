

## Plan: Restyle Timer Report List

Visual-only changes to `src/components/TimerReport.tsx`. No logic, data, or export handler changes.

### Changes

**1. Summary stats section** (lines 217-238, replace the badge chips)
- Replace the current `Card` with badge chips → three large stat numbers in a flex row:
  - **Total Speakers** (speakers.length)
  - **Total Time** (sum of all actualSeconds, formatted)
  - **On Time %** (WITHIN count / total, as percentage)
- Each stat: large `font-mono text-3xl` number on top, small `text-xs uppercase tracking-widest text-muted-foreground` label below
- No card wrapper — just a flex row with gaps, sitting on the background

**2. Speaker rows** (lines 240-294, replace Card-based list)
- Remove `<Card>` wrapping per speaker — use plain `<div>` rows
- Remove all cell borders and inner card backgrounds
- Left border: `border-l-[3px]` colored by status (green-500 for WITHIN, amber-500 for UNDER, red-500 for OVER/DISQUALIFIED, transparent for no status)
- Alternating row backgrounds: even rows `bg-[#ffffff04]`, odd rows `bg-transparent`
- Layout per row (three columns):
  - **Left**: Speaker name — `text-lg font-bold text-left`, with `#{index}` removed (or kept very subtle)
  - **Center**: Speech type — `text-xs uppercase tracking-widest text-muted-foreground text-center`
  - **Right**: Actual time — `font-mono text-xl font-bold text-right`, colored by status
- Remove the inner "Target Time / Actual Time" detail box — just show actual time prominently
- Keep disqualification detail text below the row if status is DISQUALIFIED

**3. Export button** (lines 301-316)
- Change from current style to full-width pill: add `rounded-full` class
- Keep existing `onClick={handleGeneratePDF}` handler exactly as-is

### File changed
- `src/components/TimerReport.tsx` only

