# Mythwrought M5 — offline-first Chromium and physical iPhone acceptance

**Source:** isolated draft PR #265; release integration is NOT authorized. The
old ordinary generator **v4 remains default**; opt-in v5 only uses an UNUSED
seed and immutable profile. All canonical edits remain schema-1.

## New staging cache
`sw-m5.js` creates a **separate versioned static-only** CacheStorage namespace,
`mythwrought-m5-shell-20261118-v3`, scoped to the app directory. Registration
is initiated **only** for a newly confirmed or previously saved experimental
v5 world; it is not registered for ordinary legacy/v2/v3/v4 worlds. Install
pre-caches the complete static app shell, all `src/**/*.mjs` and required
`src/**/*.json` modules, and critical index/styles/manifest/icon. An install
failure does not activate a partial new worker or destroy prior other caches.
Activation deletes only *earlier M5-owned* cache names. Fetch serves only
same-scope, same-origin **GET** for specifically known game assets, never API,
POST, dynamic personal storage, unknown URLs, or cross-origin resources.
Offline reloads reuse the already-active exact M5 worker instead of re-registering (and performing an offline script-update network check). Browser acceptance records any attempted HTTP request after network cutoff without loosening zero-request requirements. Updating any cached source requires a **new unique cache version and a fresh
cache-asset list** before any future approved incorporation.

This is a candidate OFFLINE implementation; do not infer that an unrelated
production Pages PWA has already installed it, since the tested M5 branch is
draft/unmerged.

## Chromium hard acceptance
The isolated `manual-four-biomes-m5-offline-pwa.yml` workflow tests 667x375,
844x390 and 932x430 as separate actual Chromium WebGL2 jobs. A fresh browser
starts in the old legacy seed, verifies no M5 worker is registered, and uses the
existing real-game menu to explicitly select an unused v5 seed. It verifies
ServiceWorker activation and CacheStorage coverage before turning Chromium's
whole browser context network **OFF**. The **first offline cold reload** must
load all real JS modules from cache and produce a native game WebGL2 viewport.
Actual keyboard WASD must move the real player and reveal authentic fog.
After SAVE, a **second offline reload** must keep exact immutable profile,
schema-1 canonical save and discoveries, with zero server requests since
cutoff.

The browser intentionally damages its *own test-profile metadata* and test-map
bytes separately to require a read-only fail-closed warning, preserving every
original bad byte without automatic repair. It then restores exact saved test
bytes and checks offline recovery. Only test-local storage is mutated; no
real user save is accessed or migrated. Genuine screenshots/manifest retain
SHA256/dimensions and source witness. The native full-distance 12/12 routes and
36/36 art proofs remain a **separate completed acceptance** and are not
substituted by this shorter offline controls test.

## Creator physical iPhone Safari + Home Screen checklist (not yet tested)
1. **Only after an explicitly approved safe preview URL exists**, open that
   exact isolated test page in iPhone Safari. Do NOT replace live production
   or create a new repository without permission.
2. In landscape, back up any world you care about with **WORLD EXPORT**.
   Pick a different, genuinely unused test seed and explicitly tap
   **CREATE NEW MOUNTAIN-PASS WORLD (V5 TEST)**. Confirm the displayed seed and
   that ordinary **CREATE NEW FOUR-BIOME WORLD** is still v4.
3. While ONLINE, stay on the game until its world, shaders and map have loaded;
   a service worker must install its full source cache. Confirm the 3D scene,
   two-thumb rails, mini-map and movement are responsive; SAVE the test world.
   If the app/worker reports storage or installation failure, **do not** assume
   offline support: stop and preserve exported backups.
4. On Safari, use **Share → Add to Home Screen** for that approved preview.
   Open the resulting Home Screen icon while still ONLINE once. This tests the
   installed standalone scope rather than merely reloading a Safari tab.
5. Switch on **Airplane Mode** and independently turn Wi-Fi OFF (verify no
   network). Force-close the Home Screen app, reopen **from its icon**, and
   check real 3D terrain, player movement/jump, two-thumb hit targets, mini-map,
   cave/landmark geometry, correct test seed and the v5 profile still intact.
6. Walk at least 5–10 genuine blocks with the on-screen thumb control, check
   newly revealed fog, SAVE the test world, force-close and reopen again **while
   still offline**. Confirm the same fog/recovered seed and a navigable frame.
7. Restore networking, verify the world still reports exact v5, and export the
   test world again. Validate independent unchanged earlier saves and old v4
   worlds; compare before/after world exports if possible. If the offline app
   fails or storage warnings appear, DO NOT clear website data, reinstall,
   delete the PWA, overwrite a seed, or allow migration; export and report logs.
8. Return screenshots and a copied **Device Audit** at landscape size, with
   approximate FPS and any failed steps. Mark **physical iPhone acceptance**
   only after this actual device test succeeds.

**Still outside this milestone:** any deployment, merge, rebase, schema
modification, v0.11 unlock, editing builders/caves/automations, physical iPhone
claims, or changing the existing production app's cache. The released PWA's
identity and offline behavior must be retested only after separate approval.
