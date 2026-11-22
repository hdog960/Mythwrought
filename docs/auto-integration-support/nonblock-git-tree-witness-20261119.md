# :12 exact Git-tree membership witness — 2026-11-19

Candidate-only; PR #245. No runtime registration, producer edits, persistence changes or production merges.

GitHub Git Trees REST endpoints were read for the exact three producer commit SHAs below. The six path/blob mappings in the accompanying manifest were taken from those trees, not invented fixture hashes. This is a **checkpoint**: it becomes stale whenever a producer HEAD moves.

- :48 PR #226 HEAD `cec70254bcbacca0d49d4ad39777bd79051f0d66`: `src/nonblock-scene48/nonblock-object-v1.mjs` = `33ee82e68be152586548bc0975cd11d0cca5dffa`; `src/nonblock-scene48/interactive-session.mjs` = `4e6d4fbe8c7d309a33fc9775b768f397e80bdfe6`
- :24 PR #247 HEAD `3b31e5f648297dcfe7b67eff9fdce070d267efaf`: `src/nonblock-environments24/objects.mjs` = `6cfff08a2ae7815b6af9dff197d09d1cba439f01`; `src/nonblock-environments24/v1-bridge.mjs` = `0b846c34ef5a66796b5772f91538f68ff53de2fe`
- :36 PR #249 HEAD `3365213abd8fc6a49779a7ba256134efff58f514`: `src/nonblock-fittings36/fittings-phase1.mjs` = `562e360b259f5aca00ab8ce859bb5b8e2f09bc36`; `src/nonblock-fittings36/guarded-break-session.mjs` = `0bc1c05ee8484fd86fae3db4539b85a37b2f776a`

The new `verifyProducerTreeWitness` requires caller-supplied actual Git tree JSON, actual complete file bytes, and independently obtained current HEADs. It checks each HEAD, non-truncated tree membership, blob type/mode, Git blob SHA-1 framing and ownership. A manifest alone is **not** proof; missing bytes or stale HEADs fail closed. The six-file requirement is deliberate and does not imply all producer modules are covered.

Synthetic Node cases test the gate only, not producer APIs, real :00 callbacks, schema-1 save/reload or WebGL2. Live integration remains **NOT VERIFIED**. Next: retrieve exact six blobs and feed their actual bytes into the gate, then map real exported descriptors into the pre-existing :12 removal witnesses and obtain genuine :00 lifecycle evidence. No default spawning or visual-only objects.
