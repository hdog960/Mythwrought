# Shape box adapter (P1 source-only)

Normalizes caller-supplied real axis-aligned collision bounds into defensive copies. Fractional-height shapes are preserved. Unsupported rotated/curved shapes, nonfinite or inverted bounds, and oversized lists fail closed; they are **not** silently converted into full cubes. The caller must obtain genuine terrain shapes from the authorized engine API. This module does not inspect world data, run the gameplay solver, modify production, or certify WebGL2/iPhone behavior.

Run: `node --test tests/movement12-shape-box-adapter.test.mjs`. Integration remains opt-in and requires creator authorization.