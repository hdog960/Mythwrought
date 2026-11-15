# Mythwrought 17-lane CI isolation (infrastructure draft, not yet live)

Five old manual pack lanes + four original building lanes + eight new 1A–4B lanes. Unknown/shared changes fail closed to full 20-script WebGL2 browser gate. Main always runs full.
Builder Markdown-only edits run fast syntax/CI contract tests without installing Chromium. Isolated code edits run root tests, all modified lane nested native tests and genuine Chromium production smoke/layout; no nested suites is a failure.
PR-number concurrency cancels obsolete runs for the SAME PR only. Main and other PRs are not canceled. A version-pinned npm/Playwright browser cache reduces repeated downloads.
Read-only queue monitor reports queued/running and >15-minute pending jobs. This does not expand runner capacity or prevent genuine failures.
Each builder owns isolated source/test/docs, uses the single integrated 96-family manual block catalog and central integration seam. No one builder merges/changes shared engine, saves or settlement placement.
Validate with node --test tests/ci/*.test.mjs plus GitHub exact-head full PR CI after PR creation. No merge, deployment, automatic builder activation or Gate A/v0.11 changes.
