# Desert Phase 3 original-game visual execution checkpoint — 2026-11-22

## Exact provenance
- Accepted parent (comparison before): `3c1f87c0db53ebafa8fbb52fcb7964c23fd5ba68`
- Desert gameplay child (comparison after): `2bd0395d3ef163e9fdc491ab5119b1ee80844194`
- Isolated visual harness starting commit: `9b3f9dc99b878f9e2291e54082920617b10edeae`
- A *new isolated* push-triggered workflow `.github/workflows/desert-p3-junction-visual-proof-isolated.yml` was committed as `f3be1dd259d194c9a7d494e0135e7faf19ba26d6` on visual branch only. No shared workflow or gameplay source changed.

## Scheduled exact-original-engine proof
One job, exact pin verification, same two-site original-game Playwright/WebGL2 script copied without committing to protected source refs, consistent 932x430 viewport and SwiftShader, 25 loaded chunks, two real T-junction sites. Two screenshots before + two after, PNG decoding, SHA256 pairs, and bounded RGB pixel-change count. Artifacts upload even if failed.

- seed179 (-786,-1774), Desert/Mountain/Enchanted
- seed2026 (-2848,-774), Desert/Mountain/Snow

The workflow includes an artifact uploader and a comparison log. **GitHub run ID, conclusion, screenshots and image hashes have not been retrieved or verified from this session.** A committed workflow is **not** proof of successful browser execution or a passed visual gate. Inspect Actions for the exact isolated workflow and collect genuine outcome + artifact before accepting the fix.

## Evidence reuse and avoidance
Historical 5-seed original V6 junction census #45036277170 SUCCESS and existing gameplay-child 20/20 focused native test #45036500012 SUCCESS are inherited, **not rerun**. No broad ten-scene, Plains-only or full-suite checks performed. No merges/deployments, CI cancellation, protected PR edits, cave/sky/world/save/other development-lane changes.

## Next acceptance
Confirm isolated workflow run status and exact commit, inspect job logs, download PNGs and JSON manifests, validate CRC/SHA256 and inspect before/after landscape continuity. If a real Desert-only defect appears, patch only a new isolated child and run an exact focused gate. Do not infer iPhone frame timing or Home Screen acceptance from software WebGL2.
