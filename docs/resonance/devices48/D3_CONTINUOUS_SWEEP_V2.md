# D3 continuous swept unit-cell preview v2

Source-only opt-in. Unlike v1's integer sample positions, this module checks the continuous straight-line translation of each unit-cube part against integer cell volumes with inclusive slab intersections. It conservatively includes boundary contacts, even where no collision would occur under the real game's half-open conventions. Candidate ranges are bounded by 32 parts, 8-cell assembly span and 16-cell axis travel. Stable sorted frozen results.

The output is **not** a collision certificate, power receipt, voxel edit, player movement, registered asset, or live gameplay. `mayActuate` is always false. Real game physics must evaluate moving actors, rotations, velocity, edits, and time of contact; :36 must authenticate delivered energy. This code never modifies any protected source, saves, inventories or settlements.

Focused tests: `node --test tests/resonance-devices48-continuous-assembly-sweep-v2.mjs`. No real WebGL2/mobile proof claimed.
