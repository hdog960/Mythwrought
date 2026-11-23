# D6 paired HUD geometry observation — SOURCE ONLY

This module takes two independently caller-supplied snapshots at the same tick, revision, world and layout identity. It clones plain, data-only records (rejecting accessors, cycles, nonfinite numbers, nonplain prototypes and excess nesting), audits the three required landscape viewports with the existing :48 multiview gate, and rejects geometry that changes between observations. Permutation of viewport fixtures is normalized. The output is frozen and explicitly `display-only`.

Run `node --test tests/resonance-devices48-hud-snapshot-pair-v1.test.mjs`.

**Limitations:** These are caller-supplied fixtures, not independently sourced native iPhone measurements. The pair cannot prove provenance or eliminate a malicious caller supplying two identical lies. No production UI, renderer, controls, saves, physics or :36 allocation is modified. No live authority is granted.
