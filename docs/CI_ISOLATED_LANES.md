# Mythwrought CI queue isolation — proposed infrastructure only

This proposal changes only GitHub Actions verification and its dedicated `scripts/ci/` + `tests/ci/` support files. It does **not** merge a manual Block Pack or Building Roadmap, allocate IDs, alter world rendering, touch production saves, deploy Pages, update automation prompts, approve Gate A, or unlock v0.11.

## Why the existing checks queue

Before this patch, every PR runs the identical root `node-and-browser` job with `npm test` and 20 full-game Chromium scripts. The root `npm test` discovers only `tests/*.test.mjs` and therefore does **not** execute the manual packs' or building roadmaps' nested native suites. All nine latest manual PR runs were queued when audited; some subsequently started. Their status establishes queueing but not the cause (runner capacity, GitHub scheduling, or another account setting cannot be proven from the run status alone).

## New behavior after authorized merge (not active from this draft)

- `main` pushes, manual dispatch, mixed-lane-plus-shared changes, unknown paths, CI modifications, automation paths, deletions outside lanes or missing Git history: retain the full original 20-browser-script verification plus root native tests.
- Pull requests whose entire diff stays inside `src/block-packs/pack-N/**` or `tests/block-packs/pack-N/**` for N=1..5, and `src|tests|docs/building-pool/roadmap-N/**` for N=1..4: run root Node tests, the changed lanes' native `*.test.mjs` suites, and real Chromium production smoke/layout checks. If there are no nested tests or a suite fails, the job fails. Multiple exclusive lanes are each tested. CI never assumes candidate test PASS implies integrated or visually approved assets.
- Per-PR concurrency cancels superseded runs from the **same** pull request only. Nine different manual PRs remain independent, and main runs are never cancelled. This cannot manufacture GitHub runners or override service limits.
- Full GitHub-hosted checkout and HTTP-served Chromium are used on the authorized GitHub runner. Restricted local sandboxes can still reject network/localhost/data/file navigation; no attempt is made to bypass administrator policy. Real preview galleries, asset-shape/interaction tests, offline PWA checks, creator art review and physical iPhone controls remain distinct acceptance gates.

## Invariants and review checklist

1. Existing root `node-and-browser` job name remains unchanged for check/branch-protection compatibility. No branch, PR or GitHub Pages setting changes.
2. If scope resolution fails or a shared file is touched, verification falls back to full, never skipped.
3. No blanket `paths-ignore` or workflow skip that could accidentally satisfy a required check without executing tests.
4. `tests/ci/scope.test.mjs` validates all nine owners, mixed-lane diffs and fail-closed shared-file cases. CI itself is a shared path, so this infrastructure PR receives the **full** root/browser gate.
5. Recheck exact-head GitHub Actions result and inspect logs on this draft. Until a separate explicit merge authorization, existing nine PRs continue using their preexisting workflow; this draft does not remove existing queue pressure yet.
6. Final per-lane visual/production evidence must still be collected by each lane's own acceptance process; a focused CI PASS is **not** Gate A or real iPhone sign-off.

## Emergency rollback

If authorized and merged later, reverting this single infrastructure commit restores the original full-suite-on-every-PR behavior without modifying any lane source or saves.
