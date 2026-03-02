# Motion Design System

## Philosophy

This motion design system follows a **physics-based approach** where animation timing and easing reflect the natural behavior of objects in motion:

- **Smaller components** move faster (less mass, quick feedback)
- **Larger components** move slower (more visual weight, graceful motion)
- **Closing animations** are 68% the speed of opening (0.68x ratio) for snappier feel
- **Easing curves** match component size (snappier for small, smoother for large)

---

## Component Size Classification

| Size | Examples | Use Case |
|------|----------|----------|
| **XS** | Progress bars, toggles, spinners | Micro-interactions |
| **SM** | Buttons, icons, badges, tooltips | Small UI elements |
| **MD** | Dropdowns, cards, menus, compact states | Standard components |
| **LG** | Modals, panels, overlays, full states | Large components |
| **XL** | Full-page transitions, side panels | Page-level transitions |

---

## Duration Tokens

### Opening (CSS)
```css
duration-xs   → 150ms
duration-sm   → 200ms
duration-md   → 300ms (default)
duration-lg   → 400ms
duration-xl   → 500ms
```

### Closing (CSS) - 0.68x ratio
```css
duration-xs-close   → 100ms
duration-sm-close   → 140ms
duration-md-close   → 200ms
duration-lg-close   → 270ms
duration-xl-close   → 340ms
```

### GSAP Equivalents (in seconds)
```js
// Opening
xs: 0.15, sm: 0.2, md: 0.3, lg: 0.4, xl: 0.5

// Closing
xsClose: 0.1, smClose: 0.14, mdClose: 0.2, lgClose: 0.27, xlClose: 0.34
```

---

## Easing Curves

Easing curves are matched to component size for natural motion:

| Size | Opening | Closing | Bezier Curve |
|------|---------|---------|--------------|
| **SM** | `power3-out` | `power3-in` | Snappy, energetic |
| **MD** | `power2-out` | `power2-in` | Balanced, standard |
| **LG** | `power1-out` | `power1-in` | Gentle, smooth |

### CSS Usage
```css
transition-power3-out  /* Small components opening */
transition-power3-in   /* Small components closing */
transition-power2-out  /* Medium components opening */
transition-power2-in   /* Medium components closing */
transition-power1-out  /* Large components opening */
transition-power1-in   /* Large components closing */
```

### GSAP Usage
```js
ease: 'power3.out'  // Small components opening
ease: 'power3.in'   // Small components closing
ease: 'power2.out'  // Medium components opening
ease: 'power2.in'   // Medium components closing
ease: 'power1.out'  // Large components opening
ease: 'power1.in'   // Large components closing
```

---

## Transform Values

### Y-Translation
Vertical movement distance based on component size:

```css
translate-y-motion-xs  →   4px
translate-y-motion-sm  →   8px
translate-y-motion-md  →  16px
translate-y-motion-lg  →  24px
translate-y-motion-xl  →  32px
```

### Scale
Subtle scale animations for appear/disappear effects:

```css
scale-motion-sm  →  0.90  /* Small components */
scale-motion-md  →  0.95  /* Medium components */
scale-motion-lg  →  0.98  /* Large components */
scale-motion-xl  →  0.99  /* XL components */
```

### GSAP Usage
```js
// Small component
gsap.fromTo(element,
  { y: 8, scale: 0.9, opacity: 0 },
  { y: 0, scale: 1, opacity: 1, duration: 0.2, ease: 'power3.out' }
)

// Medium component
gsap.fromTo(element,
  { y: 16, scale: 0.95, opacity: 0 },
  { y: 0, scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' }
)

// Large component
gsap.fromTo(element,
  { y: 24, scale: 0.98, opacity: 0 },
  { y: 0, scale: 1, opacity: 1, duration: 0.4, ease: 'power1.out' }
)
```

---

## Stagger Values

**Stagger** = delay between animating sequential items

Scale stagger based on what you're animating:
- **Small items** (menu items, list items inside a component): `0.03s` (30ms)
- **Medium items** (cards, component sections): `0.05s` (50ms)
- **Large items** (page sections, large cards): `0.07s` (70ms)

### GSAP Usage
```js
// Animating menu items (small)
gsap.to(items, {
  y: 0,
  opacity: 1,
  duration: 0.3,
  stagger: 0.03,
  ease: 'power2.out'
})

// Animating cards (medium)
gsap.to(cards, {
  y: 0,
  opacity: 1,
  duration: 0.4,
  stagger: 0.05,
  ease: 'power2.out'
})

// Animating page sections (large)
gsap.to(sections, {
  y: 0,
  opacity: 1,
  duration: 0.5,
  stagger: 0.07,
  ease: 'power1.out'
})
```

### Closing Stagger
For closing animations, reduce stagger by ~40% for snappier feel:
- Small: `0.02s`
- Medium: `0.03s`
- Large: `0.04s`

---

## Usage Examples

### Example 1: Button Hover (Small Component)
```tsx
<button className="
  transform transition-all
  duration-sm ease-power3-out
  hover:scale-105 hover:-translate-y-motion-sm
">
  Click me
</button>
```

### Example 2: Modal Opening (Large Component)
```tsx
// CSS approach
<div className="
  transform transition-all
  duration-lg ease-power1-out
  scale-motion-lg translate-y-motion-lg opacity-0
  data-[open=true]:scale-100 data-[open=true]:translate-y-0 data-[open=true]:opacity-100
">
  Modal content
</div>

// GSAP approach
useEffect(() => {
  if (isOpen) {
    gsap.fromTo(modalRef.current,
      { y: 24, scale: 0.98, opacity: 0 },
      { y: 0, scale: 1, opacity: 1, duration: 0.4, ease: 'power1.out' }
    )
  } else {
    gsap.to(modalRef.current,
      { y: 24, scale: 0.98, opacity: 0, duration: 0.27, ease: 'power1.in' }
    )
  }
}, [isOpen])
```

### Example 3: Menu with Staggered Items (Medium Component)
```tsx
const openMenu = () => {
  gsap.set(menu, { display: 'flex' })

  // Container
  gsap.fromTo(menu,
    { opacity: 0, scale: 0.95, y: 16 },
    { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: 'power2.out' }
  )

  // Items (small stagger for items inside)
  gsap.fromTo(items,
    { y: 16, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.3, stagger: 0.03, ease: 'power2.out' }
  )
}

const closeMenu = () => {
  // Items close faster
  gsap.to(items,
    { y: 16, opacity: 0, duration: 0.2, stagger: 0.02, ease: 'power2.in' }
  )

  // Container
  gsap.to(menu,
    { opacity: 0, scale: 0.95, y: 16, duration: 0.2, ease: 'power2.in',
      onComplete: () => gsap.set(menu, { display: 'none' })
    }
  )
}
```

### Example 4: State Transition (Medium → Compact)
```tsx
// For components that transition between states (not open/close)
// Use medium timing as a baseline, can be faster than initial open

gsap.to(player, {
  borderRadius: isCompact ? '9999px' : '1rem',
  duration: 0.25, // Faster than initial open (0.4s)
  ease: 'power2.out'
})
```

---

## Decision Guidelines

### When choosing duration:
1. **Measure the component** - How much screen space does it occupy?
2. **Consider visual weight** - Dense content = larger size classification
3. **Context matters** - State transitions can be faster than initial reveals

### When choosing easing:
1. **Small components** (buttons, icons) → power3 (snappy)
2. **Medium components** (cards, menus) → power2 (balanced)
3. **Large components** (modals, pages) → power1 (smooth)

### When choosing stagger:
1. **What are you staggering?** Items inside a component or components on a page?
2. **Small items** → 0.03s
3. **Medium items** → 0.05s
4. **Large items** → 0.07s
5. **Closing** → reduce by ~40%

---

## Common Patterns

### Pattern: Fade + Scale + Y-translation (The "Hey-Oko" entrance)
```js
gsap.fromTo(element,
  { y: [motion-value], scale: [scale-value], opacity: 0 },
  { y: 0, scale: 1, opacity: 1, duration: [duration], ease: [easing] }
)
```

### Pattern: Opening Choreography
```js
// 1. Container appears
// 2. Content items stagger in
// 3. Overlap timing with negative offset

const tl = gsap.timeline()
tl.fromTo(container, {...}, {...})
tl.fromTo(items, {...}, {..., stagger: 0.03}, '-=0.1') // Start 0.1s before container finishes
```

### Pattern: Closing Choreography
```js
// Reverse order: items first, then container
const tl = gsap.timeline()
tl.to(items, {..., stagger: 0.02})
tl.to(container, {...}, '-=0.05') // Overlap slightly
```

---

## Notes for Developers

- **Always use tokens** - Don't hardcode values like `duration-300` or `0.3s` without understanding why
- **Size matters** - A small button and large modal shouldn't use the same timing
- **Opening > Closing** - Opening should feel welcoming (slower), closing should feel efficient (faster)
- **Stagger context** - Small items inside vs large components on page require different stagger values
- **Test on device** - Motion feels different at 60fps vs 120fps, test on target devices
- **Respect prefers-reduced-motion** - Always provide reduced motion alternatives

---

## Quick Reference Card

| Component Size | Duration Open | Duration Close | Easing | Y-Translate | Scale | Stagger (items inside) |
|----------------|---------------|----------------|--------|-------------|-------|------------------------|
| **XS** | 150ms | 100ms | - | 4px | - | - |
| **SM** | 200ms | 140ms | power3 | 8px | 0.90 | 0.03s |
| **MD** | 300ms | 200ms | power2 | 16px | 0.95 | 0.05s |
| **LG** | 400ms | 270ms | power1 | 24px | 0.98 | 0.07s |
| **XL** | 500ms | 340ms | power1 | 32px | 0.99 | 0.07s |

**Closing stagger:** ~40% reduction from opening stagger
