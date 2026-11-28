# D6 HUD stream structural integrity v1 — source only

`auditHudAdmissionStreamIntegrity48(checkpoint)` independently checks exact checkpoint/frame keys, source-only provenance, identities, capacity (1–32), chronological tick/revision ordering, canonical viewport obstruction lists, safe/blocked consistency, tail alignment and the visible-history implication of the sticky ever-blocked flag. It never mutates the caller and returns frozen diagnostic results.

**Security boundary:** Caller-supplied checkpoints are untrusted. A structurally valid checkpoint can still be fabricated; a rolled-out blocked frame cannot be reconstructed or authenticated. This audit grants no power allocation, device movement, UI clearance, collision, save, renderer or gameplay authority. It is not a replacement for genuine :36 delivery receipts, browser evidence, or native original-world validation.

Focused command: `node --test tests/resonance-devices48-hud-stream-integrity.test.mjs`. No protected paths, production runtime or historical PRs are modified.
