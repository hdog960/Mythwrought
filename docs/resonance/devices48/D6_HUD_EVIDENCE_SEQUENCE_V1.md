# D6 HUD evidence sequence v1 — SOURCE ONLY

A fail-closed, bounded three-viewport multi-frame audit. Each frame must contain exactly one observation for 667x375, 844x390 and 932x430, with strictly increasing tick and revision. All observations must match the expected world and layout, and their safe flags must agree with their obstruction descriptors. Output is frozen and canonicalized. A single blocked viewport makes the entire sequence unsafe.

This is **caller-supplied unverified evidence**, not native iPhone, WebGL2, renderer, controller or :36 network authentication. The result has explicit display-only authority and cannot enable power, alter saves, move actors or modify inventories. An attacker can supply identical false observations; no authenticity claim is made.

Run: `node --test tests/resonance-devices48-hud-evidence-sequence-v1.test.mjs`.
