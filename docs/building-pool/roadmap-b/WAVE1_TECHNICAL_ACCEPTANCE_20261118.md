# MYTHWROUGHT Roadmap B — Wave1 technical acceptance checkpoint

Date: 2026-11-18. Exact accepted draft staging HEAD: `7c0bc573b8eb90c53647d5e9c1a8e1227e29cabd`.
PR: https://github.com/hdog960/Mythwrought/pull/241
Status: **source-only TECHNICAL CI ACCEPTED**, not creator-approved or production-registered.

## Evidence verified independently

- GitHub Actions https://github.com/hdog960/Mythwrought/actions/runs/44321526410: all three separate jobs **SUCCESS** on exact HEAD. The repair to the 2B test harness fetched the original legacy commit and serialized concurrent browser tests; original source shapes stayed identical.
- Dedicated 1B: **182/182** native tests passed; gallery **930/930** real Chromium source-cell WebGL2 PNGs for **155 browser-eligible** identities in 3 sizes × 2 views. Independent ZIP decoding: **930 distinct SHA-256 hashes**, 310 PNGs each at 667×375, 844×390, 932×430, no image corruption. The **169/435** authored census includes 14 additional candidates not in this gallery; do not confuse the census with gallery coverage.
- Dedicated 2B: **207/207** native tests passed, legacy PR #124 original temple geometry parity affirmed. Independent ZIP: **252 valid PNGs and 252 distinct SHA-256 hashes**, with **80 / 86 / 86** at 667×375 / 844×390 / 932×430. Uneven size coverage remains an explicit independent **historic gallery completeness follow-up**, not a claim of 146 complete six-view coverage.
- Wave1 original six: **36/36** source-specific Chromium WebGL2 captures at exactly 667×375, 844×390, 932×430 (12 per size; 18 exterior + 18 cutaway); **36/36 distinct PNG SHA-256**, all manifest SHA-256 records matched, manifest references this HEAD. The seven referenced source-code SHA-256s were preserved exactly.
- Full repository https://github.com/hdog960/Mythwrought/actions/runs/44321526667: **SUCCESS**, 12/12 CI contracts, **935/935** repository native tests, full 20-script WebGL2 browser acceptance; unchanged schema-1 world/PWA and six-size flight checks. New-source Wave1 tests are in the native suite.
- Original draft builder PRs #184, #187, #222 and #233 remained unchanged, draft and unmerged. All original source 1B and 2B Git blobs on staging match repaired PR #233 and source PR #187 respectively. Main at `e9223217ef1e91d282900c3fc13a21eeda316b63` was not written.

## Authored inventories

- Builder 1B original authored census: **169/435**, 266 unfilled.
- Builder 2B original authored census: **146/420**, 274 unfilled.
- The previous **two provisional** original designs in Roadmap B staging remain outside the above censuses.
- **Wave1 six new source candidates**: desert-large Saffron Mesa Split Granary, snow-medium Frostglass Offset Botanical Conservatory, enchanted-forest-large Glowroot Serpentine Harbor Registry; desert-large Saffron Arch Drapers and Dyers, enchanted-forest-large Mossglen Cooled Wilds Provision Hall, snow-medium Hearthscript Split Archive and Reading Rooms. **Source-only Wave1 technical CI accepted;** not added to legacy census, world, numeric ID registry or creator approved.
- Eight staged provisional designs (two earlier + six Wave1) are all isolated; the earlier Ironpass source was adjusted to D4 floor footprint IoU **0.8208709942** vs Stonevein from previous **0.8575107296**; the annex's 853 walkable floor cells were source flood-connected.

## Explicit blockers / limits

- Screenshots use a real Chromium WebGL2 **source-coordinate point/cube proxy**; they are **not actual Pack1–5 producer meshes** or finished artistic acceptance. Visual review found schematic material silhouettes with similarly appearing roof profiles, requiring creator review and real Pack rendering.
- No producer shape/variant/yaw/offset/collider **AABB** certification, actual load support or gameplay walking for the six new designs. Symbolic Pack asset references intentionally unresolved.
- No physical iPhone Safari test; no schema-1 world placement/reload approval; no deployment; no merge; v0.11 locked.
- All historical building source fingerprints and protected PRs remain immutable. The combined staged branch is behind the separately updated production main; do **not** auto-rebase or merge.

**Gate decision:** PASS **source-only Wave1 CI and Chromium proxy gallery**, HOLD creator-art, physical Pack ABI, real iPhone and in-game integration. New designs stay outside authoritative 169/146 original ledgers until all appropriate acceptance gates pass.
