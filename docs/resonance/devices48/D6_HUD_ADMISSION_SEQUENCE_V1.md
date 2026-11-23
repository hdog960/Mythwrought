# D6 HUD admission observation sequence v1 — source-only

This opt-in D6 sequence consumes the existing viewport admission function without editing its source. It requires monotonically increasing nonnegative integer ticks and nondecreasing revision numbers, validates every new viewport and reservation snapshot, and suppresses redundant display updates when geometry and admission results are unchanged. Obstruction changes trigger display-only reports. Invalid observations do not advance the sequence; reset is explicit.

Focused command: `node --test tests/resonance-devices48-hud-admission-sequence-v1.test.mjs`.

No rendering, measured thumb rails, WebGL2/iPhone screenshots, power authority, save writes or production registration. The caller must supply real game-owned viewport and control reservations; synthetic fixtures are not evidence of actual UI clearance. No settlement work.
