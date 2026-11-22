# Builder 4A — M2 final civic and guild authoring checkpoint (10 original plans)

Source-authored module `src/building-pool/roadmap-4a/m2-final-civic-guild.mjs` at Git blob `a28cb1ccd6eedc177aed43bc0145af45c313096d`.

- `r4:civic-hall:enchanted-forest:small:05` — crescent-shaped moonroot village court, octagonal lantern center, southwest public fern gateway and distinct east arbitration annex
- `r4:civic-hall:enchanted-forest:large:05` — large faceted great-root high court with three roof lanterns, central real courtyard and separate outer petition wings
- `r4:civic-hall:mountain:small:04` — small mountain cliff treaty trident with varied slope and stone-pier registry
- `r4:civic-hall:mountain:small:05` — small mountain saddle hall with separated east toll and west rockslide claims, twin roof lanterns
- `r4:civic-hall:mountain:large:05` — large mountain double-cairn rotunda with real central open court, two lantern roofs and split bridge/ore taxation galleries
- `r4:guildhall:temperate:medium:03` — temperate sailwright guild with far-west dock pole warehouse, outboard semaphore shop, octagonal works and two different roof lanterns
- `r4:guildhall:snow:small:04` — snow small clockwright guild with bellcupola, cold repair room and octagonal chime-testing annex
- `r4:guildhall:snow:medium:03` — snow medium frost conduit guild with faceted glass test bay, side smelting forge and distinct gable/hip roof lanterns
- `r4:guildhall:enchanted-forest:small:04` — enchanted forest small lute/master guild with spore-root facade, angled octagonal tuning room and two lantern volumes
- `r4:guildhall:enchanted-forest:large:04` — enchanted large mycelial grand guild with faceted central court, eastern moonbough work, separated distant ink/sap annexes and triple skyroof masses

**Exact source preflight:** 92,642 physically occupied source voxels; 21,395 traversable 2-headroom positions; 62 fully navigable and nonoverlapping public/work rooms; 30 actual internal door openings; 23 distinct source-authored faceted/lantern skyline roof envelopes. Independent roof-window-access auditor passed 24,531 beam-backed roof cells, 71 exterior pane openings and 40 interior/public doors. Roof bands explicitly reserve cupola/lantern footprints; roof-on-roof stacking defects were corrected in candidate source. Ten plans use actual irregular/faceted geometry, not merely material changes or rotated fingerprints.

Catalog-level hard rejection: 150/150 unique source IDs, 150/150 distinct complete 3D D4 geometric signatures; new same-category normalized D4 floorplan IoU maximum 0.844228, strictly less than the 0.85 hard gate. Two early duplicate-like forest plans were rejected and rebuilt with supported original annexes. All historical 140 source blueprints remain byte-for-byte untouched. M2 theoretical inventory complete: all 75 civic halls and 60 guildhalls, plus 15 inherited castle-palace candidates; remaining 165 are outside M2.

**Physical and aesthetic limitations:** candidate symbols reference masonry Pack1, fixture Pack2, regional roof Pack3 and glazing Pack4. Pack5 physical catalog is read-only audited with other producers but is not directly instantiated by these new designs; no fictional producer collision or mounted-variant proof. No final game registration, no creator art signoff, no schema-1 yaw save integration, no physical iPhone performance, and no actual live Pack1–5 fidelity approval.

**Next gate:** exact-head isolated 150-design native tests plus genuine source-specific Chromium WebGL2 candidate/proxy exterior and cutaway PNG images at 667×375, 844×390 and 932×430 for 10 candidates × 2 views × 3 sizes = 60 source-pinned captures. Validate hashes, screenshot dimensions, GL status and camera framing; inspect original PNG contact sheet. Report visual defects rather than claiming art accepted. Also require full 20-browser-script regression on development PR exact head.

Authority restrictions: draft PRs #182/#207, untouched PR #123, no merges/deploy, main untouched, sibling builders, automation lanes, manual Block Packs, biome130, shared runtime/CI, save schema and v0.11 strictly unchanged. Creator accepted 0; integrated 0.

## Independent artifact-integrity remediation

The first successful focused test run #44016319678 at the 150-design source-exact snapshot exposed a **real incomplete screenshot artifact** on independent ZIP inspection: 60 in-memory captures but 54 uniquely saved PNG filenames. The two separate mountain-small civic variants shared six names, overwriting one variant's files. This does not invalidate authored source geometry or the render pipeline's captured hashes, but **does invalidate the downloadable 60-image evidence and exact-head gallery acceptance**. The Builder 4A-owned CDP gallery runner now includes the source `variant` in each filename, refuses existing paths, and re-reads every saved PNG to verify the recorded SHA-256, failing closed when unique files are not exactly 60. Its dedicated native test also asserts unique filenames and variant identity. Require a fresh source-exact PR #207 focused workflow and independent ZIP audit before marking this new gallery fully accepted. No changes to authored blueprint source, shared CI, runtime, saves, other lanes or deployment.
