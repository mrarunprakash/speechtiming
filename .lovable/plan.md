

## Plan: Add Status Summary Section to Report

Add a summary bar between the report header card and the speaker list in `src/components/TimerReport.tsx`.

### Implementation

**`src/components/TimerReport.tsx`** — After the header `<Card>` and before the speaker list `<div className="space-y-3">`:

1. Compute counts per status from `speakers` array (WITHIN, UNDER, OVER, DISQUALIFIED)
2. Render a row of colored stat badges/chips showing non-zero counts:
   - Green chip: "3 On Time"
   - Yellow chip: "1 Under Time"
   - Orange chip: "1 Over Time"  
   - Red chip: "1 Disqualified"
3. Also show total speaker count (e.g., "6 Speakers")
4. Use a simple `Card` with a flex-wrap row of colored badges

Only `TimerReport.tsx` changes. ~15 lines added.

