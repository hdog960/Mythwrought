# PR #208 — Safe iPhone Candidate Build (NOT DEPLOYED)

Build source: `9ab03c3bbff5f449006a344e97e68c9d0141c228`.
This branch is a **build-only staging branch**. Its workflow runs on a push to
`pr208-iphone-candidate-build`, builds that exact PR source, runs native tests,
and uploads `mythwrought-pr208-iphone-candidate-unpublished`.
It does **not** merge, deploy, update Pages or alter a world save.

## Why branch push rather than workflow_dispatch?
GitHub requires a new workflow_dispatch workflow to exist on the default branch
before it can be manually triggered. We avoid changing production main by using
an isolated branch-only push trigger. After its initial run, GitHub Actions can
re-run the same run manually, without further commits or deployment.

## Important baseline distinction
The accepted PR branch is still based on `1f67efc9805e83866549515ffdad4dc7e225b234`.
Production main subsequently gained Creative G1/G2/G2B integration changes.
The candidate **does not merge or incorporate these newer main changes**.
The build records the observed main tip and verifies the original base remains
an ancestor. Its source checkout is pinned to the exact PR commit.

## Storage risk / iPhone preview gate
The URL path under `hdog960.github.io` does NOT provide origin isolation:
same-origin preview and production share localStorage and IndexedDB. The game
contains fixed world-slot keys, journals, vault and mirror stores. Before
publishing a candidate under the same hostname, explicitly authorize a
preview-only Pages publication strategy that cannot replace production
`/Mythwrought/` and **never test it in the primary Safari profile**.
Use a new Safari profile called `Mythwrought QA` with its own website data
and disposable seed. Do not clear production website data. Safari profiles
are separately scoped per Apple WebKit documentation. A Home Screen app
must be verified separately from Safari; do not assume storage is shared.

## After separate creator approval for HTTPS publishing
1. Verify the deployed `preview-build.json` identifies the exact PR source SHA.
2. Export valuable production world JSON and Pack5 exports externally first.
3. Open candidate ONLY in Safari's new QA profile. Verify fresh storage.
4. Test all foliage IDs 377–385, ice IDs 275/276/277/280/281/282/350,
   and Pack2 water ID76. Camera-swap ice/water inside one chunk to observe
   the known incorrect within-chunk blending order; record accept/block.
5. Play each Balanced, Battery Saver and Economy preset for 10+ minutes in
   iPhone landscape. Exercise both thumb rails, movement, aim, jump,
   MINE/PLACE, chunk boundaries and minimap.
6. Open `☰ → GATE A · DEVICE CHECK → RUN DEVICE CHECK → COPY REPORT`.
   Copy early and post-10-minute reports for each graphics preset.
7. Proposed targets, pending creator acceptance: approximately >=55 FPS,
   p95 <=23 ms, preferably <=3 frames >33.4 ms per 360-frame sample;
   <=25 surface GPU chunks; no context-loss, stuck controls, lost saves,
   or persistent upload retry fault.
8. SAVE, EXPORT, reload and verify foliage/ice/water block IDs in the
   disposable world. Install candidate as distinct Home Screen icon only
   after isolation and repeat with a separate disposable world.
9. The static manifest supports standalone landscape; **offline is unproven**:
   accepted source tree contains no service worker.

## Hard stops
No Pages publication; no release or production merge; no edits to source
renderer, 130 block registry, five manual packs, eight separate builder PRs,
rails, schema-1 save fields, v0.10 Gate A or the v0.11 lock. The within-chunk
water/ice ordering bug is known and remains unresolved. All later publishing
requires a NEW, explicit creator authorization.
