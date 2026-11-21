# Roadmap A Builder 2A — isolated real-Chromium gallery server correction

**No merge/deploy.** This CI-only downstream draft is based on protected commerce Wave07 PR #325 exact HEAD `cc619e068317342f54221ffc70737520e822b414`. Production `main` has externally advanced to `7016e14cd6289f45eaf7fc6a79a362b47996df65` and MUST NOT be changed or reverted.

## Confirmed same-port failure evidence
- PR #323 Actions #44830292763: root 920/920, real historical and new-source D4 passed; Wave06 gallery failed at `Page.goto: net::ERR_CONNECTION_REFUSED` on `127.0.0.1:4173`, while other gallery files had succeeded.
- PR #325 Actions #44838233990: root 920/920, 79-new-vs-128 historical and all79-peer strict D4 passed, Wave06 72/72 real WebGL2 PNG passed; Wave07 gallery intermittently lost the same hardcoded `127.0.0.1:4173` server on its 932×430 cutaway.
- PR #321/#327 parallel gallery tests also show `ERR_CONNECTION_REFUSED` for other Wave04/05 drivers on that identical fixed port.
- Existing scripts run as distinct concurrent Node test subprocesses, each launching `python -m http.server 4173`, then indiscriminately terminating its `srv` handle after completion. Other scripts can attach to the wrong instance or lose the shared port when its owner finishes.

## Narrow remedy — no test relaxation
Wave04, Wave05, Wave06, Wave07 Python gallery drivers now use an in-process `ThreadingHTTPServer(('127.0.0.1',0), ...)` bound to its own OS-selected ephemeral port, serving the same repository directory. Every screenshot URL uses the locally bound `base_url`; server shutdown is scoped to that server instance, with a joined thread. Source identities, 72 real PNG output, all three viewports, exterior/cutaway, real SwiftShader Chromium, PNG chunk/size/SHA, in-frame screenshot, source geometry evidence and all D4 thresholds remain **unchanged**. No source construction, catalog, production or actor registration edits.

## Required independent acceptance
1. Full exact-head Actions root repository tests and original historical browser suites.
2. Every same-head gallery (historical 768, Wave01/02 114, Wave03–Wave07 72 each) succeeds in one run without server collision; no gallery may be skipped.
3. Download actual artifact and inspect each PNG SHA-256, PNG CRC, dimensions, six-group identity, source file hashes and checked-out PR HEAD ancestry.
4. Keep visual-art HOLD and Manual Pack engineering/mounting/iPhone proof unresolved even if all screenshots pass.
