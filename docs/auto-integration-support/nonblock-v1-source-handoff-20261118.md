# :12 nonblock-object-v1 source-exact handoff (2026-11-18)

CANDIDATE ONLY — unmerged, undeployed. Read-only producer inspection; no production registration.

| Lane | Draft PR | Examined commit | Source blob | Observed API |
| --- | --- | --- | --- | --- |
| :48 | #226 | 501118db6c415d597b3ddb540c39bf3e3dde98af | 832a18ce79cd7145ce53f6154c9d1751674eedb9 | describeNonblockObject, nonblockInstanceKey, createNonblockSidecar; canonical nb1 key; typed mesh |
| :24 | #247 | 2adbf2d46a85c936892f05ed6cb6e67bd092703f | 8ceb37ab4d5d22cb5f56861648c1b400a9130320 | makeEnvironmentObject: proposal contract, object anchor, colon-joined key, JS triangle arrays, selection-relative bounds |
| :36 | #249 | 98c94d98c45ee2347a125677dc3f03524fe1d1c7 | 3b1482fb06c3acc79d07f055f8164ea1ef4e537c | describeFitting: v1 contract, typed mesh, world AABB, orientation suffix :r0..3 in key |

## Concrete ABI conflicts (not yet repaired)

1. :24 descriptor is **not** :48 v1: contract is `nonblock-object-v1-proposal-24`; anchor is `{x,y,z}` instead of `[x,y,z]`; key is colon-joined, not `nb1:` canonical; selection is local, not `selectionAabbs` world-space; break/removal and mesh types differ. A deliberate versioned translation with :48/:00 approval is required.
2. :36 descriptor nearly matches v1, but its `:r0..3` orientation suffix changes identity. Dropping orientation can alias differently oriented objects; keeping it breaks :48 tombstone parsing. :48/:36/:00 must agree on an orientation-aware identity version or a safe canonical instance policy before persistence.
3. :48 sidecar is explicitly disposable. No source-authenticated :00 schema-1 pick/break/save/reload bridge was executed. Individual object removal across real browser reload is **NOT VERIFIED**.
4. All three producers are unmerged. A source SHA assertion is not equivalent to authenticated executable callback provenance. The :12 handshake checks supplied descriptor shapes only; callers must independently authenticate checkout and module exports.

## Manual incorporation order and safety

First agree on a shared descriptor/identity contract and exact source SHAs with :48, :24, :36 and :00. Then validate a single family from each producer against the :12 opt-in handshake, object collision/edit protection, and true :00 pick/remove/tombstone/schema-1 reload. Only after source-exact Node and genuine Chromium/WebGL2 667x375, 844x390, 932x430 plus iPhone control and budget acceptance should the manual incorporator consider a production connection. Preserve original schema-1 data and backups; disable the candidate scene adapter for rollback, not player edits. Do not auto-spawn, merge or deploy.

## Evidence

New :12 source and seven tests committed to PR #245. Tests WRITTEN, **NOT EXECUTED** from committed HEAD: direct GitHub checkout DNS resolution failed. No genuine browser captures. No producer or :00 files changed. Historical :12 PR #206, cave candidates and manual PRs remain untouched.
