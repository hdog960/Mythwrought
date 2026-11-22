# Roadmap A Pack5 — original GPU staging vertex fidelity and read-only browser hardening

## Source-only engineering purpose

Roadmap A physical Pack5 work discovered 88 original selection AABB / authored mesh-ray warnings in an earlier 3,600-ray deterministic near-boundary census. Those are **not proof of live gameplay failures**. Original production Pack5 render streaming does not upload the original indexed mesh unchanged: \`src/pack5-integration/terrain-buffer.mjs\` converts it to **Float32 nine-float triangle vertices** (position xyz; original pigment RGB; UV; neutral material ID 0). Before attempting a true browser comparison, we need to show that this conversion **does not add a new geometric discrepancy** and to constrain any browser pilot so that native/visual evidence cannot be confused with a rendered Pack5 object in the real game.

This checkpoint is read-only/source-only and changes NO original module.

## New producer-level evidence

- \`src/building-pool/roadmap-2a/roadmap-a-pack5-terrain-ray-staging-producer.mjs\` imports the **unchanged original** \`pack5TerrainVertices\`, \`resolvePack5BuilderAsset\`, original manual Five Pack physical previews, \`makePack5Fixture\`, and earlier source-only triangle-ray evaluator. It examines the **two source-authored fired-brick variants** at **both** original yaw 2 and yaw 3 as four research-only alternatives. No actual Roadmap A building variant/yaw is assigned.
- For **every** indexed triangle vertex: asserts exact Float32 signed coordinate equality between original source vertex and the nine-float renderer staging output, exact original pigment RGB (clamped per unchanged source), exact original UV rounding, and material ID 0. Rejects incorrect Float64/F32 types, nonfinite original geometry, altered indices, over-budget staging and altered shader data. Counts every verified original indexed vertex; avoids sampling-only assertions for the vertex stream.
- For each of the four explicit variant+yaw previews: verifies 108 independent axis-ray probes, across 6 faces × six near-boundary coordinates ±0.00000005 around 0.02/0.98 × three other-axis coordinates. Total **432 original source-only ray probes** comparing (1) unchanged source indexed triangles, (2) exactly the **staged production Float32 nine-float triangles**, and (3) unchanged Pack5 fixture **selection boxes**. Source triangle and staged triangle hit/distance must match. Selection-vs-staged mismatches remain reportable as a **separate** unapproved risk and are never ignored to claim GPU visual proof.
- Original physical full-cube fired brick collider and detailed 32+ source visible/selection boxes are not rewritten. Previous original source ray/selection mismatches remain valid historical warnings. No hypothetical renderer, source mesh mutation, structural loading, camera UI, world/gameplay edit or saved sidecar.

## Optional original-game read-only browser pilot hardening

The existing manual one-viewport original-game browser pilot was changed ONLY in Roadmap A's own \`tests/building-pool/roadmap-2a/roadmap-a-pack5-game-readonly-browser.mjs\`:

- Still **manual/optional**, still just **one 844×390 ephemeral localhost Chromium context**, still **never** taps a control, toggles Pack5, calls any privileged game fixture/placement debug action, writes a world block or saves a sidecar. Tests original game bootstrap and then imports independent source-only Pack5 preview objects into browser JavaScript. Actual in-game Pack5 rendering/selection is **not tested**.
- Its 72 independent browser source-only preview rays now additionally compare **original source indexed triangles to actual original nine-float Float32 staged triangles**, and report hit counts plus a separate exact mismatch count. **Zero source/staged triangle ray mismatches** is a hard gate, not a substitute for GPU pixel testing.
- Actual disposable browser storage keys+values are read before/after preview probes, together with stable read-only original game snapshot fields. Failure to retain the same storage or snapshot is a **failed** pilot. This check is intended to detect unexpected effects inside a clean, temporary browser context; it does **not** certify user Safari/PWA storage or long-term save behavior.
- Before saving any report, validate PNG binary signature and exact **844×390** IHDR dimensions. A green original-game WebGL2 boot screenshot is **not** a placed Pack5 fixture screenshot.
- \`src/building-pool/roadmap-2a/roadmap-a-pack5-game-browser-readiness-core.mjs\` result validator now requires original indexed-to-staged triangle hit parity, zero mismatches, stable original game storage/read-only snapshot, and existing zero Pack5 sidecar/live instance/unauthorized world edit assertions. Updated focused negative tests intentionally inject staging/sidecar/storage/snapshot/viewport/error-fraud and demand fail-closed rejection.

## Focused new validation plan

Run ONLY:
\`\`\`bash
node --check tests/building-pool/roadmap-2a/roadmap-a-pack5-game-readonly-browser.mjs
node --test tests/building-pool/roadmap-2a/roadmap-a-pack5-terrain-ray-staging.test.mjs tests/building-pool/roadmap-2a/roadmap-a-pack5-game-browser-readiness.test.mjs
\`\`\`

The second suite has changed to enforce new evidence semantics, so this is *not* rerunning identical native CI. Use an isolated **CI-only** child of exact source revision; never change existing project-wide workflows, broad test suites, protected PR406 or main. Do NOT execute the Playwright browser runner automatically in this phase. Do not declare native tests passed before actual source-native GitHub Actions result is available.

Historical native evidence reused, never repeated: original 8/8 prior browser pilot readiness #45061280438, camera 7/7 #45057409771, ray/occlusion 6/6 #45055300060, original mesh/selection 15/15 #45049471293 including historical 88 original edge warnings, 40/40 original producer #45044721507, footprint core 9/9 + producer 5/5, earlier original Pack5 24/24 and 58/58 controlled V8.

## Remaining gates — no creator approval

1. A real separately authorized original game browser run with **actual rendered Pack5 object** and camera/player selection at near-edge angles, with truthful pixels/mesh source and disposable world. The current pilot explicitly does not do that.
2. Genuine iPhone Safari installed Home Screen PWA performance and physical hitbox/selection proof, and actual original WebGL2 GPU pixel verification — not inferred from Float32 staging.
3. All original 79 A5 source designs retain explicit chosen (creator-approved) variant, orientation and real mixed Pack1–5 wall/floor/roof structural support tests. These source-only analyses neither choose nor certify anything.
4. Original Roadmap A remains **207/420 SOURCE ONLY, 213 unwritten**, 128 historic commerce, 345 industrial, 315 government unchanged.

Protected main must remain exactly \`7016e14cd6289f45eaf7fc6a79a362b47996df65\`; protected OPEN DRAFT PR406 code HEAD remains \`1d71f5e37891280a21c777e5189f0762014ed8a9\`. No changes to original game modules, other developers, five hourly automations, saved schema1 world, Home Screen PWA, locked v0.11, shared CI, merges/deployments/cancellations or any original game/world production data. Publish a separate exact-source checkpoint in PR406 comment only.

## Exact original-source native checkpoint — SUCCESS

Isolated original source-only engineering commit \`72dbc1a9b81db9132c555117a0dc6fc16e999a82\` contains 6 own-lane files (two new source/test modules, changed read-only browser evidence validator + runner + tests and new documentation). CI-only validation branch \`roadmap-a-pack5-render-staging-native-ci-20261122\` exact HEAD \`611b699cff95210ab23b06931241b7e01fa203d7\` adds ONE workflow file *only* on the validation child and retains byte-identical research source.

**Original repository + Node 22.16.0 GitHub Actions [#45073277516](https://github.com/hdog960/Mythwrought/actions/runs/45073277516) COMPLETED SUCCESS — 15/15 PASS, zero failures.** This was the only new CI run in this session. It executed three syntax checks (source staging module, changed readiness core, and manual nonexecuted browser runner) and exactly the **seven newly authored original-source vertex/ray tests** plus **eight modified fail-closed browser readiness tests**. No browser launch, GPU pixel capture, full suite or redundant historical workflows.

The newly tested source staging audit imported exact original \`pack5TerrainVertices()\` and genuine original Pack5 fired-brick meshes. For **all four explicitly previewed (never assigned) variant/yaw combinations**, it compared *every* original indexed Float32 source coordinate/pigment/UV/material value against the nine-float per-vertex production stream and executed **432** original authored source-triangle vs production Float32 staged-triangle vs original selection-box ray probes. **Zero indexed original triangle / staged triangle ray differences** were found for this deterministic source grid. The separate original selection-vs-mesh boundary risk is *not* eliminated: raw source selection-versus-renderer differences remain separately counted, without an invented numerical total from this run. The original **88** earlier raw near-edge warnings remain untouched and unresolved as potential live-game behavior.

The changed readiness test strictly rejects forged staged hit counts, forged original game read-only world/storage stability, false WebGL2/iPhone approval, actual sidecar/world edits, and mismatched screenshot source constraints. The optional manual original-game browser runner is **not executed** and remains isolated: a future run would require actual 844×390 original-game WebGL2 boot, 72 original in-browser *independent* preview rays, source/Float32 staged triangle parity, no live-world Pack5 instances/sidecar writes, stable disposable context storage, and a real PNG signature and dimensions. A read-only original game screenshot would **not** establish actual in-game Pack5 geometry/pickability.

The remaining holds are genuine active in-game world/rendered Pack5 object selection/occlusion/physics proof at grazing rays (a separate authorized disposable acceptance test), real iPhone Safari Home Screen PWA shader/frame performance, physical wall/floor/roof mixed-pack support and creator-authored A5 variant/yaw selection. Do not claim renderer or structural acceptance from this native source evidence.

Main \`7016e14cd6289f45eaf7fc6a79a362b47996df65\`, OPEN DRAFT PR406 code HEAD \`1d71f5e37891280a21c777e5189f0762014ed8a9\`, A5 207/420 source-only with 213 unwritten, historical 128 commerce, 345 industry, 315 government, all other builder lanes, 5 hourly automations, shared workflows, installed PWA, schema1 and locked v0.11 remain untouched. No merges, deployments, CI cancellations, original gameplay/source building writes or creator/structural approvals.
