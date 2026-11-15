# Mythwrought CI queue isolation — infrastructure-only proposal

This proposal changes only GitHub Actions verification plus dedicated `scripts/ci/` and `tests/ci/` helpers. It does **not** merge a Block Pack or Building Roadmap, allocate IDs, change world rendering, touch schema-1 saves, deploy Pages, update automations, approve Gate A, or unlock v0.11.

## Verified bottleneck

Before this patch, each PR's same `node-and-browser` job runs `npm test` and 20 full-game Chromium scripts. Root `npm test` discovers `tests/*.test.mjs`, but **not** any of the nine nested roadmap native suites. The nine latest manual PR actions were all reported queued at the start of the audit; one subsequently entered in-progress. Queue status does **not** establish its underlying cause, and this patch does not alter GitHub runner quotas.

## Proposed behavior only AFTER creator-authorized merge

- `main` pushes, manual dispatch, any shared/unknown file changes, CI changes, missing Git history or failed scope resolution retain the **complete original root + 20-script browser gate**.
- A pull request with a diff entirely inside one or more exclusive `src|tests/block-packs/pack-1..5/**` and `src|tests|docs/building-pool/roadmap-1..4/**` directories gets root tests, **all recursively discovered native `*.test.mjs` tests for each affected lane**, and genuine Chromium production smoke + landscape layout checks. Missing native suites fail rather than silently passing. If both independently owned lanes change, both execute.
- New PR commits cancel only superseded runs of their **own** PR. Different roadmaps have independent concurrency groups; main runs cannot be cancelled.
- Retains exact `Mythwrought verification / node-and-browser` check name for existing branch protections. The browser installation and artifact publication remain in place.
- Browser smoke proves limited production smoke/layout behavior only. It is **not** source-derived gallery capture or production registration/shape/old-save/offline/physical-iPhone acceptance. Each roadmap retains its separate creator review and Gate A gates.

## Browser sandbox findings

- Several local sandbox runs reported GitHub DNS/clone failure or Chromium URL-navigation `ERR_BLOCKED_BY_ADMINISTRATOR`; restrictions vary by execution environment.
- GitHub-hosted Actions already uses checkout and HTTP-served Playwright Chromium. This changes CI selection but **does not bypass sandbox or administrator policy**. Local runs still need independent authentic browser evidence when their gate requires it.

## Validation and safety

- Execute `node --test tests/ci/*.test.mjs`. Cases verify five Pack owners, four building owners, mixed lane changes, full-suite fallback on shared/unknown paths, invalid names, recursive nested native execution, rejection of unknown lanes, and failure on zero tests.
- Syntax-check all helper scripts and validate YAML with a YAML parser or GitHub's workflow parser.
- This **infrastructure-only PR** modifies the CI workflow itself, so its exact-head Actions run must take the **full original regression path** before acceptance. Any failed/queued result is not a pass.
- Current nine PRs continue using the old workflow until a separate explicit creator-authorized merge. No integration or deployment is authorized by this draft.
- Emergency rollback after any future authorized merge: revert the infrastructure commit(s). No lane source, production saves, registry or worldgen is changed by this proposal.
