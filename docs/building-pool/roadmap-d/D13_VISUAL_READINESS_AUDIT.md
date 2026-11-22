# Builder D D13 — visual-readiness and literal-HEAD provenance gate (isolated draft)

This is a **design/verification checkpoint only**, not source acceptance or final artwork. Parent protected draft PR #399 exact SHA `88e9f9c45ebcca43576bb2031b2ff1b1c1c82d4f`. No earlier Builder D sources, Builder A/B/C, five automations, production, saves, D0 ID ownership, settlements, integration, or gameplay registration are modified.

## Evidence independently inspected on November 21, 2026

Downloaded actual Wave11 artifact #14727971284, Wave12 #14730220606 and Wave13 #14731616695; three ZIP hashes:

- W11 `3f52732a6e6bd9a77d44f718f385659db9fe4b1e579d82a8f6238ca7590deadf`
- W12 `82b1f5843ebcc2abf7f394debe327317aa8ac4d23fe60e02bc6020d2b98b4a2c`
- W13 `0c84bef40b855cb25442cbddd174cca02db2e1d46e949ba9b7a3228f389381b2`

All **three archives independently passed ZIP CRC**; 50 entries each, **48 PNG frames each, all 144 unique**, three authentic landscape pixel dimensions, 8 originals × exterior/cutaway each wave. Genuine Chromium WebGL2 screenshot evidence passes the geometric/source-proxy testing it claims. **These are NOT Manual Pack1–5 physical-family meshes, furnished art or iPhone PWA acceptance.** All three manifests explicitly say `cubeProxy=true`, `physicalMeshesAccepted=false`, `iphoneAccepted=false`.

All 24 authentic source-proxy **844×390 exterior** images share the same most common non-background roof pixel `RGB(77,44,43)`, covering **18.71%–25.47% of total image area**, median **23.22%**. Their squat reddish roofs, windows and similarly low profiles are visually repetitive even though the measured original physical footprints pass strict D4 novelty. Mathematical floorplan noncloning is necessary, not sufficient, for architectural art individuality.

## New development artifact

`src/building-pool/roadmap-d/d13-visual-art-direction.mjs` records *eight individually different proposed* roof profiles, silhouettes, facades, landmarks and furnishing concepts tied one-to-one to the eight original D13 canonical source IDs. No material ID is invented, no rendered asset is claimed completed. A native read-only test verifies exact original ID ownership, unique intent concepts, and five explicit false acceptance flags. This is visual design planning evidence, **not generated physical geometry**.

## CI provenance correction

Previous Wave11/12/13 pull_request workflow artifacts have `audit.json.gitHead` equal to GitHub's synthetic PR merge ref (`b39c4c8…`, `31e4ea2…`, `a68e422…`), **not** the literal protected branch SHA (`eaed572…`, `1dd0299…`, `88e9f9c…`). Prior CI runs were successful on that merge ref but must not be called literal **exact-HEAD checkout**. The new isolated narrow verification workflow explicitly checks out `github.event.pull_request.head.sha`, then asserts `git rev-parse HEAD` matches the event HEAD before running source-ID/visual intent tests. It does not pretend to retroactively rerun older long WebGL2 jobs on exact heads.

## Unfinished acceptance gates

1. Implement actual distinct roof heights/volumes and Manual Pack1–5 physical material families in further **isolated** development (no runtime registration); audit the original producer mappings before claiming wall, roof, floor and furniture suitability.
2. Validate actual facades, landmark silhouettes and furnished rooms across all biomes with genuine source-based renders; review D13 close D4 `0.889050` Snow/Temperate large-school pair visually (passes current <0.89 numerical threshold).
3. Repeat performance/visual review on original iPhone 17 Pro Max landscape Home Screen PWA only after creator authorizes future integration. No merge or deployment now.
4. 153 historical accepted plus 100 D1–D13 provisional = **253/285 source authored; 32 vacant, all 100 new unapproved for final art/gameplay**.

No PR merge, deployment, settlement/world registration, save modification or edits to protected source branches are authorized.
