# D6 grant continuity admission v1 — source-only

New :48 advisory that improves on one-frame startup permission in the historical grant-dropout model. A powered mechanism is not marked advisory-ready until at least two **consecutive observed** ticks grant sufficient power. A missing tick, power deficit or missing grant immediately stops advisory readiness. After any dropout, it must requalify. This is deterministic and does not move actors.

Inputs are **untrusted fixture grants**, not an authenticated :36 network interface. Validation rejects nonmonotonic/duplicate ticks, duplicate IDs, fractional/out-of-range units, invalid device identifiers and oversized histories. Limits: 32 frames, 16 grants/frame, 64 units, configurable 2–8 consecutive ticks. Output is frozen and explicitly non-authoritative: no player motion, collision admission, inventory or world edits.

Local isolated Node test execution on 2026-11-23: 18/18 focused tests passed from exact authored source/test bytes before GitHub upload. This is NOT committed-head native repository CI or genuine iPhone/WebGL2 evidence. Verify committed blobs and run `node --test tests/resonance-devices48-grant-continuity-admission-v1.mjs` on a full authentic checkout before acceptance.

Integration blockers: authenticate :36 exact-SHA delivery shape, verify real power epoch semantics, implement a separately owned physical stop/occupancy bridge, verify old-save/offline compatibility, and capture actual WebGL2 at 667x375, 844x390 and 932x430. Do not register in production or change historical PRs.