# D3 bounded custom moving-assembly envelope v1

Opt-in source-only preview for 1–32 authored lattice cells in an at-most 8×8×8 envelope. Translation is limited to 16 lattice units per axis. A conservative integer supercover lists candidate swept cells in stable lexicographic order and calculates a simple deterministic preview demand (parts × longest-axis steps). No inventory, voxel edits, moving player builds, production registration, physics or save changes.

**Critical:** `mayActuate: false` is unconditional. Swept cells are advisory only, not an authoritative collision sweep. The game collision owner must independently verify all actors, edits, and intervening motion. The :36 owner must provide authenticated delivered-power receipts before physical movement. Stop safely on loss of power. Reject forged authority, duplicate coordinates, unsafe sizes and malformed identities.

Focused native test file: `tests/resonance-devices48-assembly-envelope-v1.mjs`. No genuine WebGL2 captures or old-save integration evidence yet.
