# Shape motion evidence (source-only)

Requires caller-supplied world-space AABB collision geometry; does not assume full cubes. Conservative continuous broad-phase against player footprint and height, not an authoritative narrow-phase solver. Invalid shapes fail closed. No production hooks, no save or UI changes. Run `node --test tests/movement12-shape-motion-evidence.test.mjs`. Real terrain geometry, camera recordings, and browser/iPhone verification remain outstanding.
