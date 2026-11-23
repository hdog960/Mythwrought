# D6 admission-to-evidence bridge v1 — source-only

Consumes three actual `admitResonanceHud48` return objects from the original :48 viewport admission module, and passes normalized observations to the existing `auditHudEvidenceSequence` contract. This closes the gap between arbitrary hand-authored evidence and genuine :48 admission-shaped reports. Reports are still **caller supplied and unverified**: this is not a browser measurement, renderer attestation, real iPhone capture, or production permission.

Strict fail-closed checks: exact six-field report shape, schema and display-only authority, shared revision, approved viewport dimensions, three unique viewport sizes, canonical ordered bounded obstruction indices, consistency of admitted status and blockers, bounded identifiers and ticks. A blocked viewport fails the whole frame. Input report objects are never mutated. No imports or writes to :24/:36, game renderer, saves, inventory, physics, settlements, or production assets.

Targeted command from full original checkout: `node --test tests/resonance-devices48-hud-admission-evidence-bridge.test.mjs`. This only tests a source-only contract; full original-game WebGL2 and PWA evidence remains outstanding. Future handoff must supply real UI reserved rectangles and a verified :36 contract before claiming integration.
