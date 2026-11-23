# D5 status-transition pulses v1 — source-only

Consumes the existing :48 status-observation-sequence v1 read-only. Emits only the initial status and subsequent POWER OK/LOW transitions, with stable rune-blue or amber-gold palette descriptors, bounded to 1–32 pulses. Invalid status inputs, inconsistent demand, forged actuation, duplicate ticks, and pulse-budget overflow fail closed. Frozen output never grants power, mutates actors, saves, inventory, renderer, or terrain. No settlement work. Not bound to genuine :36 receipts, WebGL2, or the live game.

Focused native command: `node --test tests/resonance-devices48-status-transition-pulses-v1.test.mjs`. Requires committed-head execution. The separate local equivalent prototype was tested 16/16, but is not the committed implementation and must not be counted as native verification. Real three-size iPhone/WebGL2 and authoritative :36 integration remain pending. No merges or deployment.
