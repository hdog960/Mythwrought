# Mythwrought Builder 1B — M2 fourth original architecture tranche

**DRAFT, NOT MERGED, NOT DEPLOYED.** All files exclusively in `src/building-pool/roadmap-1b/`, `tests/building-pool/roadmap-1b/` or `docs/building-pool/roadmap-1b/`.

## Proven starting state

- PR [#184](https://github.com/hdog960/Mythwrought/pull/184) exact baseline `71501891fe723aaf938fe6a9906f455018f3217b` (draft), GitHub Actions [#43779041785](https://github.com/hdog960/Mythwrought/actions/runs/43779041785) completed SUCCESS, **735/735 main Node, 12/12 contracts, 53/53 1B native, 192/192 genuine Chromium WebGL2 source-cell cube-proxy captures**.
- Original unmerged Builder R1 PR #121 exact head `88a9e410a0eda7cf961cb6b624241666eb3a48a1`; all **15 inherited stable IDs and full source cells** preserved, never regenerated/moved. Main `e6bd7c173a4531ba7efc153e5f2eb89870c3b9db`, integration checkpoint 009. No modifications to sibling builders, five manual packs, biome130, automations, runtime, saves, Gate A, v0.11 or deployment.

## Nine additional original, fully physical-coordinate source programs

New module `src/building-pool/roadmap-1b/m2-diverse-regions.mjs` makes nine **nonduplicated** fixed integer-voxel architectural programs via existing strict 1B `sourcePlan()`. It does not merely rotate/mirror/recolor an earlier shell: each design has independent floor layout, two-high portals, room graph, fixtures, roof silhouette and source-constructed load paths.

| Building | Exclusive slot and functional geometry |
|---|---|
| **Willowcrown Public Bath Terrace** | Bathhouse / Temperate / Large / 001 — two opposite covered treatment wings, uncovered dry garden court, independent stone rear pavilion and dual empty basin rims |
| **Qasr Sun-Arcade Baths** | Bathhouse / Desert / Large / 001 — stepped stone reception arcade, separate left/right shaded ablution wings, open central concourse and rear cooling gallery |
| **Frostspire Grand Winter Bathhouse** | Bathhouse / Snow / Large / 001 — fully snow-roofed high winter bath, transparent-source `pack4:030` *unapproved* glass clerestory, three enclosed treatment halls and nonworking boiler room |
| **Thistleford Six-Bay Carriage Stable** | Stable / Temperate / Medium / 004 — six physically empty and independent pen doors, wide cart aisle, stacked source-built raised roof monitor and rear tack gallery |
| **Ridgebreak Snow Relay Stables** | Stable / Snow / Large / 004 — eight empty pens, five-wide snow aisle, genuine windlock, high pitched snow main roof and separately lower rear ice-store roof |
| **Mosswick Lantern-Fern Stable** | Stable / Enchanted Forest / Medium / 004 — four open empty pen doors, real central unroofed lightwell and four separate timber canopy masses with protected rear tack |
| **Meadowspan Triple-Gate Grain Court** | Farm Barn / Temperate / Large / 001 — three true wagon gates, open central dry aeration court, independent timber drying/hay wings and separate back record/repair rooms |
| **Saltwind Courtyard Threshing Store** | Farm Barn / Desert / Medium / 001 — triple-sheltered sandstone grain store around an uncovered threshing pad, functional cart access and source-built rear gear |
| **Fircrest Raised-Ridge Sled Barn** | Farm Barn / Snow / Medium / 001 — high pitched snow-deflection grain/lumber roof, deep weatherlock, two separated cargo bays and an **unapproved one-cell load-bearing front porch cantilever** rather than a fake supported roof |

All nine have *fixed coordinate full-cell* voxel arrays, full foundation and roof, integer 3D occupancy, named rooms and doors, >400 two-high connected walking cells, physical source roof supports touching an authored roof cell, and deterministic serialization. **No functional livestock, baths, heating, harvesting, farming, crafting, wind/water, economy or light mechanics are claimed.** Physical Pack 4 `pack4:030` is the checked source-clear-glass family but final rotation/partial bounds, attachment, weather, collider and schema-1 compatibility are still unresolved; its preview is a source coordinate **cube proxy**.

## Quantitative preflight, not CI acceptance

- M2c nine models: **25,104 physically authored occupied cell placements**, **66 original structural roof-pier heads** resting on physical foundations and touching authored roofs with no gaps.
- Candidate pool now **55/435** if exact-head CI passes: 15 identical inherited stables + 40 new authored candidates = **380 unauthored**.
- Category census: bathhouse **11/60**, stable **25/75**, farm-barn **11/60**, greenhouse **2/60**, fishing lodge **2/60**, harbor office **2/60**, lighthouse **2/60**.
- Independent source preflight: **55/55 distinct IDs**, **55/55 distinct physical-geometry fingerprints**, nine original architectural programs; each new design passes actual strict `validateBlueprint`. Existing M2 suite checks D4 90°/180°/270° rotations and mirror equivalence for **all 55**. New focused 1B-only native test adds **12 cases**, including independent horizontal walking BFS and 66 support-contact checks.
- The genuine Chromium WebGL2 browser harness now targets **41 source-authored candidate exemplars × 2 views (exterior/cutaway) × 3 CSS landscape sizes (667×375, 844×390, 932×430) = 246 screenshots**. It checks GL errors, viewport, source ID, actual authored cell counts, PNG validity/hash and cutaway/source voxel differences. **Do not claim 246 passed until exact new GitHub Actions head succeeds.** This is *not* final Pack 4 source-shape mesh or a physical iPhone check.
- Creator-approved **0**, integrated **0**, production world placement **0**. Gate A preserved, v0.11 locked. No merge/deploy.

## Acceptance and open issues

Native exact-head CI and genuine browser evidence must pass and screenshots must be inspected. Remaining future physical integration: transparent Pack 4 pane geometry, building structural weather/roof load, front snow-porch cantilever engineering, physical-scale navigation with final blocks, iPhone art approval, engine collision, live save schema 1 and runtime registration. Do not claim approval or deploy.

## Exact-HEAD source-render test cleanup regression and repair
[Actions #43782799691](https://github.com/hdog960/Mythwrought/actions/runs/43782799691) at source HEAD `7d6e2e23f036e47275be9ce00479f89cde2c5d17` completed the **246/246 genuine Chromium WebGL2 exterior/cutaway captures**, 735/735 root native tests and 12/12 CI contract tests. Of the 65 focused Builder 1B native tests, 64 passed; the *only* failure happened after capture in `m1-source-webgl.test.mjs`, where recursive `rm` raced a still-exiting Chrome process and produced `ENOTEMPTY` for its temporary `Default` profile. No candidate geometry, screenshot, content parity or runtime defect was found. The Builder 1B-only test cleanup now awaits Chrome child exit and uses bounded native `fs.rm` retries before clearing its temp profile; captured screenshots and assertions remain unchanged. The new exact-head workflow must pass before the 65/65 technical acceptance claim can be made. No production code, save schema, packs, builder siblings or game preview changed.
