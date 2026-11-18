# Roadmap 9 — M1 standalone landscape UX acceptance

**Scope:** Creative Mode draft PR #186. **Prerequisite:** M0 exact head `a2ee61d8e07c97a6d087a9ced7655094ea26cfde` passed GitHub Actions run #43767145743, including the 20-script production WebGL2 gate. All previous five Creative-owned files remained isolated; `main` was unchanged at authorization.

## Implementation (feature-local only)

- `src/creative-mode/preview.html`, `.css`, `.mjs`: standalone browser UX harness; **never imported into `index.html` or `src/main.mjs`**. This detached view has a decorative CSS landscape, not a running voxel game.
- `src/creative-mode/ux-state.mjs`: immutable view-model transitions for Explore/Creative, sample inventory search/filter, six hotbar slots and clearing selections. All sample entries carry `previewOnly:true`, `registered:false`, `placeable:false`. They do not supply runtime asset IDs, cannot reach an edit/save adapter, and never claim production availability.
- Real buttons: Explore/Creative toggle, open/close drawer, search, All/Blocks/Objects filters, assign sample to selected hotbar slot, clear slot and six slot selectors. Escape dismisses the drawer. On opening, focus enters search; closing restores focus. The drawer pauses input to both isolated pads.
- Left/right isolated pointer pads show drag feedback and release/cancel to idle. They **do not** move the player or camera. The upper-right minimap has reserved and labeled space outside the drawer.
- Portrait has a rotate notice; compact landscape uses flexible slot widths, protected center screen, safe-area inset padding and no document scroll.

## Verification protocol and limitations

- `node --test tests/creative-mode-m0.test.mjs tests/creative-mode-m1.test.mjs` for root-discovered native suites (8 M0 + 8 M1 tests).
- `python3 tests/creative-mode/preview-browser.py` checks genuine system Chromium using Playwright and the actual preview HTML/CSS/JS. Localhost navigation was blocked by the container's browser networking policy, so the harness injects original HTML, CSS, and JS into Chromium on `about:blank`, remapping only its ESM import to a data URI. This is **real Chromium rendering and pointer/keyboard interaction**, not a WebGL2 production game test or HTTP/PWA/offline check.
- Six simulated landscape viewport sizes: 568×320, 667×375, 844×390, 932×430, 956×440 and 1180×520; verify controls do not overlap screen, map reservation remains visible when drawer is open, hotbar/inventory operations, search/category, clear, Escape, no JS exceptions, drag/release and portrait notice.
- Local screenshots taken in `artifacts/creative-mode/` for 568×320 and 956×440. Screenshots are local test artifacts, **not production UI screenshots or iPhone evidence**.

## Explicitly pending

- Exact new PR-head GitHub Actions results following M1 commit; full root regression and WebGL2 gate may be slow, but must not be reported green until complete.
- M2 flight and safe motion/streaming; M3 authority-backed registry inventory; M4 real place/break; M5 schema-1 save/undo; M8 performance/physical-iPhone acceptance.
- No shared renderer, app shell, input, map, saves, worldgen, CI, other roadmap or deployment changes. No merge/enablement/deployment until creator authorization.
