# Mythwrought — Release ledger
This is the source of truth for ACTUALLY implemented and independently verified features, separate from the 100 planned releases.

| Release | Git commit | Tested behavior | Deployment | Result |
|---|---|---|---|---|
| Initial repository | `784739d` | Initial README | Legacy Pages build | Baseline |
| Design authority | `41e3550` | Seven canonical docs, 100 release acceptance entries | GitHub main | Documents committed |
| v0.06 grounded voxel movement and collision | `c33948bc` (merged PR #5) | **43/43 Node** on main; 4 Chromium suites including real walking/jump landing, voxel corner/ceiling collision, step climbing, compact landscape and existing save/dual-thumb tests | [Pages + public file retrieval PASS](https://github.com/hdog960/Mythwrought/actions/runs/43036157699) | **Verified v0.06 engine, iPhone/art gates OPEN** |
| v0.05 original landscape handheld grips | `3e4ca3c` (merged PR #4) | **29/29 Node** on main; Chromium WebGL, dual-touch controls, five landscape sizes, footer/controls fit, persisted large controls, safe-area simulation | [Pages + public files PASS](https://github.com/hdog960/Mythwrought/actions/runs/43030672007) | **CI/Pages verified; real iPhone/visual approval OPEN** |
| v0.04 independent precision camera/voxel targeting | `2ad8e4e` (merged PR #3) | **25/25 Node** on main; WebGL browser screenshot, seed/edit/targeting, simultaneous Chromium touch movement+look, mode persistence, precision, blur cancellation | [Pages deployment/HTTP PASS](https://github.com/hdog960/Mythwrought/actions/runs/42965722891) | **Automated verification passed; iPhone/art gates OPEN** |
| v0.03 WebGL landscape/sky | `0adbb31` (merged PR #2) | **17/17 Node** on main, Chromium sky/camera/sensitivity, mining, seed-save and full-chunk screenshot checks | [Pages deploy and public HTTP PASS](https://github.com/hdog960/Mythwrought/actions/runs/42956423659) | **Verified prototype, iPhone and visual gates OPEN** |
| v0.02 deterministic multi-seed terrain | `401e1df` (merged PR #1) | **12/12 Node** on main; syntax; Chromium WebGL2 layout, mine/edit, saved seed switching, reload, chunk rebuild | [Pages + HTTP verification PASS](https://github.com/hdog960/Mythwrought/actions/runs/42948496495) | **Automated and live public site checks passed; art/iPhone gates OPEN** |
| v0.01 foundation prototype | `4dd132a` | Node **7/7**; JS syntax; headless Chromium landscape rendering, side grips, help, actual MINE operation and persisted block edit | [Pages + public resource fetch PASS](https://github.com/hdog960/Mythwrought/actions/runs/42945013696) | **v0.01 code proven by automated checks; iPhone and art gates OPEN** |

## v0.06 verification and limitations
- [Merged PR #5](https://github.com/hdog960/Mythwrought/pull/5), implementation merge SHA `c33948bc3955b2b3980562c5240c8dfc936652a6`.
- [Main CI 43036157896](https://github.com/hdog960/Mythwrought/actions/runs/43036157896): **43 passing Node tests**, 4 Chromium suites (scene render and save edits, actual two-finger movement/look, five landscape layouts and the new live grounded jump/walk test). Browser screenshots archived in `mythwrought-browser-smoke`.
- [Pages 43036157699](https://github.com/hdog960/Mythwrought/actions/runs/43036157699): deploy + externally fetched public site HTML and JavaScript verified.
- New deterministic voxel physics: exact player-sized AABB against cubes, capped time steps, axis sliding/clearance, one-block steps with support and ceiling protection, coyote/jump-buffered input, real gravity/landing, spawn search on built/edited terrain, safe void recovery. No save schema changes.
- Movement now stops rapidly after lifting thumb; earlier drift defect caught by Chromium and fixed. Early-landed/hover defect caught by Node regression and fixed. Chromium test updated to observe actual motion states on slower software GPU rather than depending on fixed 210ms.
- Chunk meshes are cached by current chunk center and stale GPU buffers released when changing chunk radius; original atmospheric materials and rough procedural dirt/ore shading advanced slightly.
- Still missing premium voxel character animation, substantial authored settlements, playable RPG story, robust IndexedDB saves and mobile hardware evidence; no Gate A or art sign-off has been claimed.

## v0.05 verification and limitations
- [Merged PR #4](https://github.com/hdog960/Mythwrought/pull/4), implementation merge SHA `3e4ca3c56fc5c6a191ae046430e4f9b25ea3133a`.
- [Main CI 43030671792](https://github.com/hdog960/Mythwrought/actions/runs/43030671792): **29/29 Node tests**, syntax, Chromium world/save/two-finger interactions and five responsive landscape viewport suites, tested with full-viewport controller and footer clipping checks; captured regular, large and small screenshots as workflow artifacts.
- [Pages workflow 43030672007](https://github.com/hdog960/Mythwrought/actions/runs/43030672007): GitHub Pages deployment and external public HTML/JS fetch succeeded.
- Implemented hand-authored carved-bronze/wood-like console materials using dependency-free CSS; game-canvas/compass separation remains strict. Dynamic grip width and visible-height calculations, artificial safe-area inset checks, persisted accessible large-controls preference, clearer buttons and proportional thumb-stick knob travel.
- A CI screenshot revealed a REAL compact-layout clipping bug; initial stricter test failed, then fixed using bounded console height, responsive grip min-size and compact-height CSS. Latest PR and merged-main checks green. This is not proof that all actual iPhone models are comfortable.
- The terrain art and NPCs are NOT at approved premium standard. No authored 3D characters or story areas have been added in this control-focused release. iPhone hardware Safari/Home Screen, thermal, production save durability and premium art gates remain OPEN. User artwork acceptance is still required.

## v0.04 verification and limitations
- [Merged PR #3](https://github.com/hdog960/Mythwrought/pull/3), implementation merge commit `2ad8e4e78c744d141f4abce3522552c80f8fb1ab`.
- [Main CI 42965722843](https://github.com/hdog960/Mythwrought/actions/runs/42965722843): **25/25 Node tests** and both Chromium suites passed. Tests cover UI grip containment, sky rendering, voxel edit saving, persistent world seeds, exact DDA voxel selection across signed chunk boundaries, controller math, simultaneous two-finger input with movement and look, button-held precision, stick mode continuing only while held, saved mode preferences, blur release, keyboard focus and scroll prevention.
- [Pages workflow 42965722891](https://github.com/hdog960/Mythwrought/actions/runs/42965722891): merge deployed and public HTML/JS fetch verified. Main screenshot artifact `mythwrought-browser-smoke` is attached to main CI.
- Implemented two independent thumb controllers; swipe or stick look modes; radial movement deadzone; fine-aim temporary hold; exact voxel DDA and subtle 3D block outlining (not HUD); safe input state reset on blur/menu/background and paused drawing after lost context.
- No claims about real iPhone acceptance. No production-grade saves (prototype uses localStorage), premium original character art, combat, companions, story quests, magical machinery or deep city world yet. Hardware/performance and visual acceptance gates remain **OPEN**.

## v0.03 verification and limitations
- [Merged PR #2](https://github.com/hdog960/Mythwrought/pull/2), implementation merge commit `0adbb31cac5ca31c428eab2427b731177be8784b`.
- [Main CI 42956423673](https://github.com/hdog960/Mythwrought/actions/runs/42956423673): **17 passing Node tests**, syntax checks and Chromium landscape/WebGL2 smoke. Tests include deterministic seed behavior, material vertex and adjacent-chunk face culling, camera math, touch-pad rotation, saved look sensitivity, editable terrain, menus, save isolation, and composited screenshot with multiple colors.
- [Pages deploy 42956423659](https://github.com/hdog960/Mythwrought/actions/runs/42956423659): published merged main, with public HTML and game JavaScript HTTP verification.
- Original GPU sky shader adds warm horizon, daylight gradient, sun, restrained clouds and distant atmospheric mountain silhouettes. Terrain world generation and serialized schema remain compatible with v0.02.
- Camera keyboard controls now defer to focused form controls. Help panel permits vertical scrolling; game canvas and touch grips remain touch-captured.
- The landscape is **still an engineering prototype**, not a polished fantasy world. Actual iPhone performance, Home Screen comfort, premium world material/character standards, long-session play and crash-proof persistence **NOT VERIFIED**.

## v0.02 verification and limitations
- [Merged PR #1](https://github.com/hdog960/Mythwrought/pull/1), implementation merge commit `401e1df050f7017e8690134bf24657dd8049098c`.
- [Main CI 42948496448](https://github.com/hdog960/Mythwrought/actions/runs/42948496448) passed all **12 Node tests**, syntax and Chromium screenshot/seed-switch regression checks.
- [Main Pages workflow 42948496495](https://github.com/hdog960/Mythwrought/actions/runs/42948496495) passed deployment and public HTML/JS retrieval.
- v0.02 includes Unicode-normalized named/numeric seeds, separated local world edit slots, v0.01 legacy save fallback, terrain material UV/pixel detail, prioritized chunk work queue and a post-seed-change full-chunk browser test.
- Save format is STILL temporary localStorage schema 1; no IndexedDB or durable recovery guarantee.
- A headless Chromium screenshot is NOT an actual iPhone gameplay benchmark. Visual gate remains UNAPPROVED.

## Exact verification
- [CI run 42945013621](https://github.com/hdog960/Mythwrought/actions/runs/42945013621): Node model tests; Chromium WebGL2 no blank display, no JS/page resource errors, viewport uncontaminated by touch grips, functional menu, real mining edit in browser saved to localStorage. Screenshot archived as workflow artifact `mythwrought-browser-smoke`.
- [Pages workflow 42945013696](https://github.com/hdog960/Mythwrought/actions/runs/42945013696): syntax/model tests, publication success AND public `https://hdog960.github.io/Mythwrought/` HTML/JavaScript retrieval verified by curl.
- Live playable prototype: https://hdog960.github.io/Mythwrought/
- Latest verified implementation: `401e1df050f7017e8690134bf24657dd8049098c` (before this ledger/test-hardening commit).
- Earlier failed browser workflow `42944546572` was an unsupported Playwright/Ubuntu 26.04 runner issue. Fixed by explicit `ubuntu-24.04`; later browser runs pass.

## Features NOT implemented
The v0.02 prototype is procedurally shaded voxel terrain, not premium handcrafted fantasy artwork. No authored village, deep cavern cities, NPCs, combat, classless progression, actual magic, water/lava simulation, blueprint editor, crafting, companions, wildlife, runic machinery, portals, or Death Echo yet. These remain locked design targets, not shipped systems.

## Open validation gates
1. **Gate A:** Actual iPhone Safari and installed landscape Home Screen visual, performance, control ergonomics, persistence across termination, error handling and save-integrity tests; not yet verified.
2. **Art gate:** Original material quality, characters, cave art and animation require owner acceptance, not a self-declared pass.
3. **Save gate:** Current v0.01 uses localStorage as temporary proof of concept. IndexedDB, versioned migration and backup/recovery safeguards remain needed.
4. **Scale gate:** Real iPhone chunk streaming, caves, world saves and simulation load still must be profiled.

## Reporting rule
Never label planned roadmap releases complete without independently tested implementation evidence and user-required gates. No guarantee the page works on every iPhone solely because headless Chromium and HTTP fetch pass.
