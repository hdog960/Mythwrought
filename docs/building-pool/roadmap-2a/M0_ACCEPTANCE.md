# Mythwrought Builder 2A — M0 source-exact migration acceptance

**Draft only.** Original PR #124 remains open, unmodified and read-only. Owner paths are exclusively `src/building-pool/roadmap-2a/`, `tests/building-pool/roadmap-2a/`, and `docs/building-pool/roadmap-2a/`.

## Exact provenance and parity

- Baseline main `e6bd7c173a4531ba7efc153e5f2eb89870c3b9db` and merged infrastructure PR #178. Previous exact-head CI #43766782321 PASS at M0 branch commit `4b0d05631d7beeb55c60fe5876436dc241618006`. New head must be independently retested.
- Original PR #124 read at exact head `07c45d27bd36f4f3aa3197bba0e4f49ce2a58c68`, 15 General Stores preserved and 15 Temples excluded for Builder 2B. Input Git blobs: original hand-store `7211223b2cc51290b89f5f886c1cbb59cc495747`, generator `4cc1ccc4cedfb927f510c6a85c8c4aa11290eccc`, schema `253ad26a8fb3537a1cb6776d6b86dd89909d69f1`, catalog `f52488952aa9dd805847de1b65f7b207627f16ad`.
- `temperate-store.mjs` and `schema.mjs` are owner-local copies byte-identical to the original files; `m1-general-stores.mjs` selectively extracts only the 14 generated stores and removes the original Temple-generation branch. Original stable `r2:general-store:<biome>:<size>:01` identities and source schema preserved.
- Authoring check evaluated both actual original and migrated JS: **15/15 complete JSON blueprint representations identical** (including voxel order/coordinates/materials/roofs, physical windows and openings, rooms, accessible circulation, named features and unresolved refs). Independently **15/15 original shape fingerprints identical**, and **15/15 structurally distinct**. SHA-256 goldens captured from the independent original computation are pinned per ID in `manifest.json` and checked by native Node tests against the new owner modules. These are content checks, not physical asset ABI certification.
- Original **184/184 storefront window-kind voxels** retained and source-exact material-specific opening registrations. Original Temperate Small Store retains **685 coordinate voxels**, **16 window cells**, two rooms. Other 14 are deterministic generated from the unchanged original spatial rules after excluding Temple-specific logic.

## Counts and safety

**420 planned / 15 genuine migrated coordinate-authored candidates / 405 new ones still to author / 0 newly authored / 0 creator-approved / 0 in game.** Exactly 6 categories × 5 biomes × 3 sizes and their quota. Remaining symbolic biome130 and real orientation/collision/support/window shape/appearance decisions are not silently certified by integrated manual 96-family/106-variant assets. No new production ID, save/schema-1, PWA, controls, shared runtime, CI, automation, other builder or world placement edits.

Run `node --test tests/building-pool/roadmap-2a/*.test.mjs` from the repository root. Expected source-exact native tests include quota+ownership, 15 original SHA256 payloads, original window+room checks, 3-high aisle reachability and invalid-metadata negatives. PR-head GitHub CI and real browser evidence must be independently checked before M0 is declared technically complete. Current tests do NOT prove creator art acceptance or physical iPhone gameplay. Gate A remains OPEN, v0.11 LOCKED.
