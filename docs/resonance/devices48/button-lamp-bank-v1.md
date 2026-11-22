# :48 D1 button/lamp bank preview v1

A source-only, opt-in deterministic fixture for 1–8 independently controlled lamps. Each button has a distinct lamp identity, a stable roster, consecutive ticks and a per-lamp observed grant. Entries are sorted by button ID so caller ordering cannot change results. Reject duplicate identities, roster changes, missing ticks and forged authority flags.

This bank consumes the existing :48 button-lamp preview, not actual :36 receipts. All returned states explicitly deny activation, authoritative delivery and production binding. Counts describe *preview* lamps only. No game block IDs, player physics, renderer, saves or settlements are modified.

Future integration requires :36 receipt provenance pinned to a specific SHA, a game-owned actor/lighting bridge and genuine landscape WebGL2 acceptance. Do not treat these preview counts as production power status.
