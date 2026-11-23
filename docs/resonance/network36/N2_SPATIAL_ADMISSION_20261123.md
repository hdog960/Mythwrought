# N2 bounded wireless admission — source-only handoff (2026-11-23)

The opt-in `deriveSpatialWirelessAdmission` composes the original N1 channel graph with the N2 spatial candidate enumerator. It never edits chunks, blocks, saves, UI, generators, or consumers. It does not activate gameplay.

Inputs: authenticated loaded channel, transmitter and endpoint descriptors with unique IDs and integral coordinates. Transmitters attach only when adjacent to exactly one channel network. The spatial enumerator checks Euclidean radius for active transmitters and applies a hard comparison budget before publishing any output. Wired membership is retained; multiple distinct reachable networks or ambiguous wired membership fail closed. Disconnected devices receive no network. Deterministic IDs and sorting keep results independent of input order.

The nine focused tests compare the adapter to the earlier wireless semantics, check ambiguity, invalid data, permutation invariance, work budget, and immutability. Tests are authored, not yet authenticated on committed HEAD. This module deliberately does not claim transmitter power consumption, per-chunk provenance, browser/WebGL2, offline saves or iPhone acceptance.

The :24 generator contract remains externally owned; verify its exact versioned blob/SHA before integration. The :48 lane owns visual pulses, device usage and UI. Preserve all historical drafts. No production registration or merge authorization.
