# :12 non-block capture evidence integrity — 2026-11-19

Non-production, opt-in validator. This check strengthens the prior capture-byte-binding gate by rejecting a PNG header-only forgery, truncated chunks, wrong dimensions, incorrect CRC32, missing IDAT/IEND and trailing bytes. It checks a declared SHA-256 over supplied bytes; it does **not** establish browser provenance, actual WebGL2 rendering, source-to-commit membership, or real :00 PICK → BREAK → TOMBSTONE → RELOAD.

## GitHub PR HEAD checkpoints (read from PR metadata this run)

- :48 PR #226: `5b05963da8643f4df89723f152ba5451439e8aba`; actual `src/nonblock-scene48/nonblock-object-v1.mjs` blob `33ee82e68be152586548bc0975cd11d0cca5dffa` fetched at that HEAD.
- :24 PR #247: `adbffae52390634ee7517202ad15e0e13b0ddf94`; source bytes not authenticated this run.
- :36 PR #249: `90b00365984db88fb2b5894e567ce3761b5bf768`; source bytes not authenticated this run.
- historical :12 PR #206: `aedabf1d3e6250f16e3495ec77bdc056fafc1f46`; unchanged.
- :12 PR #245 starting HEAD: `b93d6ba37f8ffa59ad0d333d5a16d925d99731ae`.

The :48 source confirms canonical `nb1:` keys, explicit selection AABBs, and a disposable tombstone sidecar. This is **not** schema-1 save integration. The new PNG validator is a separate fixture helper and does not auto-spawn or register any object. It must be paired with an independently sourced Chromium execution transcript, gl.getError results, real :00 hooks, seed/edit/backup evidence, and genuine 667×375, 844×390, 932×430 screenshots. PNG structure alone cannot establish that pixels are meaningful or from a real browser.

## Next

Run `node --test tests/auto-integration-support/nonblock-png-structure-gate.test.mjs` at exact PR HEAD. Authenticate :24/:36 source bytes and :00 read-only interfaces, then bind actual three-size browser evidence to the existing lifecycle gate. Do not merge, deploy, or modify owner paths.
