

## Plan: Back Button Confirmation with Timer State Preservation

### Problem
Clicking the back arrow during timing immediately discards the timer — no warning, no way to resume.

### Changes

#### 1. `src/pages/Index.tsx` — Lift paused timer state
- Add a `pausedTimers` state: `Record<number, number>` mapping speaker index → paused seconds
- When `TimerView` calls a new `onPauseAndBack(seconds)` callback, store `pausedTimers[currentSpeakerIndex] = seconds` and navigate back to speakers list
- When entering timing view, pass `initialSeconds={pausedTimers[currentSpeakerIndex] || 0}` to `TimerView`
- Modify `handleStartTiming` to resume from the paused speaker index if one exists, instead of always resetting to 0

#### 2. `src/components/TimerView.tsx` — Add confirmation dialog + accept initial seconds
- Add `initialSeconds` prop (default 0) and `onPauseAndBack` callback prop
- Initialize `seconds` state from `initialSeconds`; if `initialSeconds > 0`, start in paused state so user can resume
- Add `showBackDialog` state
- Replace direct `onBack()` call on back button with: if `seconds > 0`, show an `AlertDialog` with:
  - **"Pause & Go Back"** — calls `onPauseAndBack(seconds)` (pauses timer, saves time, goes back)
  - **"Stop & Discard"** — calls `onBack()` directly (loses time)
  - **"Cancel"** — closes dialog, timer continues
- Auto-pause the timer when the dialog opens (so time doesn't keep ticking while deciding)
- If `seconds === 0`, back button works immediately without dialog (nothing to lose)

#### 3. Files changed
- `src/pages/Index.tsx` (~15 lines)
- `src/components/TimerView.tsx` (~30 lines)

