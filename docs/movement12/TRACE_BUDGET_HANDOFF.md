# Movement12 trace budget v1

Opt-in diagnostics only; not registered in production. `auditBoundedTrace` accepts a host-supplied full-body collision reader, finite feet positions, and a global sample budget. It preflights all segments before any collision calls, shares endpoints across adjacent segments, reports embedded starts, collision location and segment index, and returns `live:false` for every outcome.

This complements rather than replaces `swept-probe.mjs`: the earlier trace function can exhaust a global budget after earlier segments; this new contract fails closed before reading the host and avoids repeated shared-vertex samples. Neither diagnostic is proof of continuous collision safety between samples. Thin walls narrower than the sampling interval may still be missed; a production-authorized continuous/swept collision integration would be needed for that guarantee.

P0 evidence: 11 focused cases executed against a locally equivalent copy using Node 22; exact committed GitHub checkout and CI remain unverified. Real `stepPlayer` / `collides` integration, original-game Chromium WebGL2 at 667x375, 844x390, 932x430, 20-script regression, offline/schema-1 and physical iPhone tests remain outstanding. No game movement, controls, save or rendering code modified.
