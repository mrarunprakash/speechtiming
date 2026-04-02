

## Plan: Dynamic "Resume Timing" Button Label

**`src/components/SpeakersList.tsx`** — Change the "Start Timing" button text to check if `pausedTimers` has any entries:

- If `Object.keys(pausedTimers).length > 0` → show "Resume Timing (N speakers)"
- Otherwise → show "Start Timing (N speakers)"

One line changed in the button label.

