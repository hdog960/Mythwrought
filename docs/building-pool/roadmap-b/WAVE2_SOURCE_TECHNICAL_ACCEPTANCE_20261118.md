# MYTHWROUGHT Roadmap B — Wave2 source-only technical acceptance

Date: 2026-11-18. Combined isolated draft [PR #241](https://github.com/hdog960/Mythwrought/pull/241).
**Accepted source-only HEAD:** `3a6f3da2d6c7af9c62e6f4f4f32be91b61b6140c`. Full technical CI and WebGL2 checks passed. This does **not** authorize production registration or merges.

## Exact-head acceptance
- [Dedicated Actions #44329196466](https://github.com/hdog960/Mythwrought/actions/runs/44329196466) completed **SUCCESS**, all three jobs: 1B native 182/182, 2B native 207/207, Wave1+Wave2 72/72 source-specific genuine Chromium software WebGL2 PNG captures.
- [Full Actions #44329195992](https://github.com/hdog960/Mythwrought/actions/runs/44329195992) completed **SUCCESS**: 12/12 CI contracts, 939/939 repository native, full 20-script WebGL2 acceptance.
- Independently downloaded and verified archive artifact #14438601374: 72/72 decoded PNGs with 72 distinct SHA-256, 24 each at 667x375, 844x390 and 932x430; 12 source identities x 2 views x 3 sizes. All 72 recorded sha256 values matched archive bytes, manifest gitHead matched exact source HEAD.
- Native Builder 1B archive #14438599477: 930 PNGs, 930 unique SHA-256, 310 images per requested landscape size. Builder 2B archive #14440485080: 252 valid PNGs, 252 unique SHA-256, 80/86/86 at 667x375, 844x390 and 932x430 respectively. This 2B heritage gallery is **not** claimed to show all 146 historical buildings in all three sizes.
- Six independently authored Wave2 source IDs: `r1:lighthouse:desert:large:004`, `r1:fishing-lodge:snow:large:004`, `r1:bathhouse:enchanted-forest:large:004`, `r2:jeweler:mountain:large:04`, `r2:market-square:desert:large:04`, `r2:theater:snow:medium:03`. Actual native blueprints validate; 14 combined isolated Roadmap B candidates pass 91 D4 floor IoU comparisons, strict maximum 0.8438617402 (< 0.85).
- 1B all protected source blobs byte-identical to repaired PR #233; 2B all protected source blobs byte-identical to original PR #187, original historic stable and temple identity parity preserved. Original PRs #184/#187/#222/#233 untouched.

## Inventory — remain separate
- Historical 1B authored 169/435 (266 unfilled) and 2B authored 146/420 (274 unfilled). Historical **315/855** total, 540 unfilled.
- 14 additional source-only staged candidates: two provisional originals, six Wave1, six Wave2. **No** additions to historical authoritative catalog, no numeric block registry, no in-game world placement, no user save modifications.

## Explicit limitations
- The 72 source previews are real Chromium WebGL2 **point-voxel proxy** views, **not** Pack1-5 production producer meshes, actual physical visibleBoxes AABBs, collider/roof/glass/fixture load verification, or creator-art acceptance.
- No actual iPhone Safari PWA test or on-foot building pathing within the real game, no physical producer ABI certification, no rollback release approval; all schema-1 saves and v0.11 stay protected.
- Production main separately advanced to `e9223217ef1e91d282900c3fc13a21eeda316b63`. No rebase, merge or deployment.

**Decision:** Wave2 technical/source gallery ACCEPTED on exact head above, physical and creator gates HOLD. Future Waves must pass their own exact-head verification before technical acceptance.