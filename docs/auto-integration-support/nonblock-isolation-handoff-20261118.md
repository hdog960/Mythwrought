# Non-block :12 isolation handoff — 2026-11-18

Candidate PR #245, branch auto-12-nonblock-compat-20261117. This document is not a production integration approval.

Exact producer references inspected:
- main e9223217ef1e91d282900c3fc13a21eeda316b63 (manual geometry removal #232)
- :48 #226 92578e5628063fb962c9632b35a2a25368be1ab9 — src/nonblock-scene48/nonblock-object-v1.mjs, canonical nb1 identity, disposable removal sidecar
- :24 #247 359a0f91e2638f7f514a4ef2ad6994e09f4bbf7c — src/nonblock-environments24/objects.mjs and interaction.mjs present
- :36 #249 7b438b616f273bba11dd9db6b766735973101d5b — src/nonblock-fittings36/fittings-phase1.mjs, edit-safe-interaction.mjs and guarded-break-session.mjs present
- :00 runtime hooks: NOT AUTHENTICATED.

New nonblock-removal-isolation.mjs is a pure opt-in fixture validator. It checks unique namespaced keys, family ownership, explicit break targets, pick-box existence, target tombstone retention, pre-existing tombstone retention, and survival of unaffected neighbors. Provenance fields are declarations, NOT independently source-authenticated callbacks. Passing means DECLARED_CALLBACK_FIXTURE_ONLY_NOT_SCHEMA1_PROOF.

Before manual incorporation: reconcile producer descriptor exports to :48 v1, agree orientation-stable tombstone keys with :00, prove source-exact callback binding, execute tests from committed HEAD, exercise real schema-1 save/backups/reload and offline iPhone landscape WebGL2. No object spawning or producer registration is authorized by this handoff. Revert isolated candidate adapters if tests fail; leave live runtime and historical saves unchanged.
