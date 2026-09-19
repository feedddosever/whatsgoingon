# Store assets

## Icon

`assets/` no longer carries Expo's default template icon. The mark is a route
map: a bright direct line straight up the middle to a mortarboard, and two dim
routes that wander through extra waypoints before arriving at the same place.
That is the product in one drawing — every route ends at the degree, and the
app's whole job is to show you which one costs less.

Colours are the app's own tokens (`src/ui/theme.ts`): `#0B0F14` background,
`#5BE895`/`#22C55E` accent. Regenerate with `scripts/art/` — the SVG source is
checked in rather than a binary blob, so the next change is an edit and not a
redraw.

One trap, recorded because it cost a render: a `linearGradient` with the default
`objectBoundingBox` units renders **nothing at all** on a perfectly vertical
line, because the bounding box has zero width and the gradient degenerates. Use
`gradientUnits="userSpaceOnUse"`.

Layers:

| File | What it is |
|---|---|
| `icon.png` | 1024×1024, opaque. iOS and the store listing. |
| `splash-icon.png` | 1024×1024, same mark with more margin (`resizeMode: contain`). |
| `android-icon-foreground.png` | 1024×1024 **RGBA**, mark inside Android's ~66% safe zone. |
| `android-icon-background.png` | 1024×1024, the dark radial. |
| `android-icon-monochrome.png` | 1024×1024 RGBA silhouette for themed icons. |
| `favicon.png` | Web. |

## Screenshots

`docs/store/screenshots/` — captured from the **real built bundle** at 412×915
CSS pixels, device scale 2.62 (1079×2397, Galaxy-Tab-and-phone safe), by
`scripts/shots.mjs`. Nothing is mocked up: if a screenshot shows a number, the
app produced it.

Deliberately a Texas plan rather than a Californian one. A reviewer who has
never heard of Cal-GETC still understands "finish the 42-hour Texas Core
anywhere and it transfers whole", and the unconfirmed rows show honestly in
amber — which is the thing about this app worth photographing.

| File | Screen |
|---|---|
| `01-questions.png` | The four questions. No account, no transcript. |
| `02-state-guarantee.png` | State picker with the statewide rule under it. |
| `03-routes.png` | Three routes, the saving, and what binds them. |
| `04-plan-map.png` | The plan map — every requirement and how it is cleared. |
| `05-breakdown.png` | Row by row, with provenance on every claim. |

Regenerate: `npm run build:web && npm run serve:web`, then
`node scripts/shots.mjs`.
