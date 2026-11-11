# Mythwrought — Release ledger
This is the source of truth for ACTUALLY implemented and independently verified features, separate from the 100 planned releases.

| Release | Git commit | Tested behavior | Deployment | Result |
|---|---|---|---|---|
| Initial repository | `784739d` | Initial README | Legacy Pages build | Baseline |
| Design authority | `41e3550` | Seven canonical docs, 100 release acceptance entries | GitHub main | Documents committed |
| v0.01 foundation prototype | `4dd132a` | Node **7/7**; JS syntax; headless Chromium landscape rendering, side grips, help, actual MINE operation and persisted block edit | [Pages + public resource fetch PASS](https://github.com/hdog960/Mythwrought/actions/runs/42945013696) | **v0.01 code proven by automated checks; iPhone and art gates OPEN** |

## Exact verification
- [CI run 42945013621](https://github.com/hdog960/Mythwrought/actions/runs/42945013621): Node model tests; Chromium WebGL2 no blank display, no JS/page resource errors, viewport uncontaminated by touch grips, functional menu, real mining edit in browser saved to localStorage. Screenshot archived as workflow artifact `mythwrought-browser-smoke`.
- [Pages workflow 42945013696](https://github.com/hdog960/Mythwrought/actions/runs/42945013696): syntax/model tests, publication success AND public `https://hdog960.github.io/Mythwrought/` HTML/JavaScript retrieval verified by curl.
- Live playable prototype: https://hdog960.github.io/Mythwrought/
- Latest verified candidate implementation: `4dd132aa5e3fb90a1995f314585305ef1a4ab1f1` (before this ledger-only commit).
- Earlier failed browser workflow `42944546572` was an unsupported Playwright/Ubuntu 26.04 runner issue. Fixed by explicit `ubuntu-24.04`; later browser runs pass.

## Features NOT implemented
The v0.01 prototype is colored voxel terrain, not premium handcrafted fantasy artwork. No authored village, deep cavern cities, NPCs, combat, classless progression, actual magic, water/lava simulation, blueprint editor, crafting, companions, wildlife, runic machinery, portals, or Death Echo yet. These remain locked design targets, not shipped systems.

## Open validation gates
1. **Gate A:** Actual iPhone Safari and installed landscape Home Screen visual, performance, control ergonomics, persistence across termination, error handling and save-integrity tests; not yet verified.
2. **Art gate:** Original material quality, characters, cave art and animation require owner acceptance, not a self-declared pass.
3. **Save gate:** Current v0.01 uses localStorage as temporary proof of concept. IndexedDB, versioned migration and backup/recovery safeguards remain needed.
4. **Scale gate:** Real iPhone chunk streaming, caves, world saves and simulation load still must be profiled.

## Reporting rule
Never label planned roadmap releases complete without independently tested implementation evidence and user-required gates. No guarantee the page works on every iPhone solely because headless Chromium and HTTP fetch pass.
