

## Plan: Visual Restyling of Speech Timer App

Pure CSS/visual changes only. No logic, state, routing, or handlers touched.

### 1. Google Fonts (`index.html`)
Add Syne and DM Mono font imports in `<head>`:
```html
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### 2. CSS Variables & Base Styles (`src/index.css`)

**Light and dark root variables** — replace both `:root` and `.dark` with a single dark-only palette:
- `--background`: deep charcoal `#0e0e12` (converted to HSL ~240 12% 6%)
- `--foreground`: warm off-white `#f0ede6` (HSL ~40 20% 92%)
- `--card`: `#ffffff08` equivalent (very subtle white on dark)
- `--border`: transparent / `#ffffff0d`
- `--primary` / `--accent`: keep existing teal/cyan hue
- `--muted` / `--secondary`: dark tones matching charcoal

**Noise grain overlay** — add a pseudo-element on `#root`:
```css
#root::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  opacity: 0.025;
  background-image: url("data:image/svg+xml,..."); /* noise SVG pattern */
}
```

**Global font families:**
- `font-family: 'Syne', sans-serif` on body
- `.font-mono` override to `'DM Mono', monospace`

**Global shadow override:**
```css
* { --tw-shadow: 0 0 0 1px rgba(255,255,255,0.05) !important; }
```

### 3. Tailwind Config (`tailwind.config.ts`)

- Add `fontFamily` extend: `sans: ['Syne', ...], mono: ['DM Mono', ...]`
- Update `borderRadius` — set `lg` to `1rem`, `md` to `0.875rem`, `sm` to `0.75rem` (minimum `rounded-2xl` feel)

### 4. Card Component (`src/components/ui/card.tsx`)

Replace default card classes:
- Remove: `border bg-card shadow-sm`
- Add: `bg-[#ffffff08] rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.05)]`

### 5. Component-Level Tweaks (class-only changes)

**All components** — anywhere `rounded-lg` appears, upgrade to `rounded-2xl`. Anywhere `border` or `border-t` / `border-b` is used for decorative purposes, replace with `border-[#ffffff0d]` or remove.

**`Index.tsx`** header/footer: change `border-b` / `border-t` to `border-b border-[#ffffff0d]` and `bg-card/80` stays as-is (will inherit new card color).

**`SpeakersList.tsx`** bottom bar: `border-t` becomes `border-t border-[#ffffff0d]`.

**`TimerView.tsx`** stopped overlay: `bg-background/90 rounded-lg` becomes `bg-[#ffffff08] rounded-2xl`.

**`TimerReport.tsx`** summary badges: the colored `bg-green-100 text-green-800` chips adjusted to darker variants (`bg-green-500/15 text-green-400` etc.) to work on dark background.

**`SpeakerDialog.tsx`** / dialog: `bg-muted rounded-lg` becomes `bg-[#ffffff08] rounded-2xl`.

**`FAQ.tsx`**: `min-h-screen bg-background` unchanged (inherits new background).

### 6. Input & Button styles (`src/components/ui/input.tsx`, `button.tsx`)

- Input: add `rounded-2xl` and `bg-[#ffffff08] border-[#ffffff0d]`
- Button primary: ensure `rounded-2xl`

### Files Changed
- `index.html` (font link)
- `src/index.css` (variables, noise overlay, font families)
- `tailwind.config.ts` (fonts, border-radius)
- `src/components/ui/card.tsx` (card base classes)
- `src/components/ui/input.tsx` (rounded + bg)
- `src/pages/Index.tsx` (border colors)
- `src/components/SpeakersList.tsx` (border colors)
- `src/components/TimerView.tsx` (rounded, bg tweaks)
- `src/components/TimerReport.tsx` (dark-friendly badge colors)
- `src/components/SpeakerDialog.tsx` (rounded, bg tweaks)
- `src/pages/FAQ.tsx` (border color)

No logic, state, handlers, or routing changes.

