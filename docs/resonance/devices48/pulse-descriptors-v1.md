# :48 D5 Resonance Pulse descriptors v1

This is an opt-in, **source-only** pure visual-description helper. It does not register renderer assets, allocate power, move objects, mutate saves, create block IDs, or activate lamps. It never asserts a genuine :36 grant.

Input: `{worldId, tick, devices:[{id,state,demand,grant}]}`, with 1–8 unique stable IDs and states `off`, `deficit`, `observed-sufficient`. Optional prior frame must be the immediately preceding tick in the same world and have an identical roster. Invalid and inconsistent observations fail closed.

Output: sorted immutable descriptors with rune/metal hex palette, bounded 0–3 intensity, deterministic 0–7 phase, and transition pulse `wake`, `steady`, `falter` or `fade`. All authorization flags remain false. The palette is a proposal for existing game art, **not** a WebGL2 screenshot or an approved renderer contract.

The :36 network owner must publish a SHA-pinned authoritative allocation contract before any binding. The renderer/game owner must independently approve real device IDs, material emission, performance budgets, accessibility, and offline/PWA compatibility. No production paths or protected branches may be edited by :48.

Tests: `node --test tests/resonance-devices48-pulse-descriptors-v1.test.mjs`. CI status and genuine captures must be reported separately; do not infer execution from authored tests.
