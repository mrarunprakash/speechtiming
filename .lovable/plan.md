

## Plan: Rework Timer Controls — Pause/Resume/Stop

### Current Behavior
- **Pause** stops the timer and immediately shows a "Recorded Time" status card with timing evaluation
- **Paused state** shows "Continue" (or "Generate Report") — acts as save & next
- No "Resume" or "Stop" button exists

### Desired Behavior
- **Pause** simply pauses the timer — no status card, no evaluation shown
- **Resume** continues the timer from where it left off
- **Stop Timing** finalizes the speaker's time and shows the status summary, then offers "Continue" / "Generate Report"

### Changes to `src/components/TimerView.tsx`

1. **Add a `isStopped` state** (separate from `isPaused`) to distinguish paused vs finalized
2. **Rework control buttons:**
   - **Running:** Show `Pause` button
   - **Paused:** Show `Resume` button + `Stop Timing` button (destructive style)
   - **Stopped:** Show the recorded time/status card + `Continue`/`Generate Report` button + `Reset`
3. **Remove the status card from the paused state** — only show it in stopped state
4. **Add `Square` (stop) icon** from lucide-react for the Stop button
5. **Keep Reset** available in paused and stopped states

### Button Layout (matching current UI style)

- **Initial:** `[▶ Start]` full-width primary + `[↺ Reset]` outline
- **Running:** `[⏸ Pause]` full-width secondary + `[↺ Reset]` outline
- **Paused:** `[▶ Resume]` full-width primary + `[⏹ Stop Timing]` full-width destructive + `[↺ Reset]` outline
- **Stopped:** `[Continue / Generate Report]` full-width primary + `[↺ Reset]` outline

