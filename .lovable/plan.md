

## Plan: Color-Coded Report Cards by Status

### What Changes

**`src/components/TimerReport.tsx`** — Add status-based color styling to each speaker card in the report:

1. **Card border/left accent by status:**
   - WITHIN → green left border (`border-l-4 border-l-green-500`)
   - UNDER → yellow left border (`border-l-4 border-l-yellow-500`)
   - OVER → orange left border (`border-l-4 border-l-orange-500`)
   - DISQUALIFIED → red left border (`border-l-4 border-l-red-500`)

2. **Actual Time text color by status:**
   - WITHIN → `text-green-600`
   - UNDER → `text-yellow-600`
   - OVER → `text-orange-600`
   - DISQUALIFIED → `text-red-600`

3. **Disqualification detail** already exists — keep as-is with `text-destructive`

4. **PDF report** — already has colored status cells, no changes needed there

### Scope
- Only `TimerReport.tsx` is modified
- ~10 lines changed: add a helper function for status-to-color mapping, apply classes to the Card and time display

