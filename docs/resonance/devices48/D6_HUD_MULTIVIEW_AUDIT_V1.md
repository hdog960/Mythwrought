# D6 all-viewport HUD admission audit v1 — SOURCE ONLY

A deterministic, fail-closed three-viewport aggregate for 667×375, 844×390, and 932×430. Uses the existing :48 admission observation sequence read-only. Rejects duplicate/missing/unsupported viewports and malformed ticks/revisions; returns frozen, display-only results in canonical viewport order. A single obstruction rejects the aggregate. No mutation of input, power delivery, renderer, saves, or gameplay.

Focused native command: `node --test tests/resonance-devices48-hud-multiview-audit-v1.test.mjs`.

**Evidence boundary:** Fixtures are caller supplied. Passing these tests does NOT prove actual iPhone controls, safe areas, WebGL2, real screenshots, or :36 power contracts. Integration must supply authentic measured HUD and thumb-rail rectangles. No production registration or settlement work.
