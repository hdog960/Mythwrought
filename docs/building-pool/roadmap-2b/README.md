# Mythwrought — isolated Builder 2B (Markets, Trades & Culture)

**M0 draft only. No merge, runtime registration, placement, deployment, user-save modification or Gate A approval.**

- Main at branch creation: `e6bd7c173a4531ba7efc153e5f2eb89870c3b9db` (creator-authorized infrastructure PR #178 merge).
- Infrastructure exact-head PR CI `43762245025`: success; merged-main verification `43764265884`: success at M0 kickoff.
- Original PR #124 remains open, draft, unmerged and read only. Source: `07c45d27bd36f4f3aa3197bba0e4f49ce2a58c68`; exact original temple source blob: `4cc1ccc4cedfb927f510c6a85c8c4aa11290eccc`.
- **420 slots** across seven categories, five biomes, three size classes. **15 restored temple candidate identities and full coordinate blueprints; 405 not yet authored.** No creator-accepted or in-game integrated buildings.
- Slot IDs retain `r2:<category>:<biome>:<size>:NN` to keep original identity. This isolated lane excludes ALL general stores, other shops and bank designs owned by 2A.
- `catalog.mjs`: quota reservation (planned records are not fabricated geometry).
- `schema.mjs`: isolated validator fork preserving old schema identity and exact authored temple parity; future changes must not silently mutate legacy geometry.
- `legacy-temples.mjs`: 15 generated-at-load deterministic **fully coordinate-authored** inherited temples, with their original belfries, three-wide portals, dais/stair intentions, physical window metadata, supports and circulation.
- `manifest.json`: 15 explicit old identity → new module → pinned original source blob mappings.
- `tests/building-pool/roadmap-2b/m0.test.mjs`: real native Node validation of quotas, 15 authored geometry instances, windows, distinct structure and full exact-original-PR native source parity.

**Symbolic dependency policy:** integrated manual five-pack catalog has 96 family symbols/106 physical variants, but this legacy design's bare `packN:NNN` references do not prove specific shape, orientation, collision, mount or material acceptance. Any `biome130:NNN` element remains unresolved until verified independently. No numeric production block IDs are assigned here. The central integrator later owns physical fill-in.

M1: inspect original visuals and structural/circulation issues, then produce the first genuine new 2B-category exemplars. Browser landscape/WebGL2 blueprint-specific proof, creator artwork review and physical iPhone checks remain open. All builder ownership remains restricted to `src/`, `tests/`, `docs/building-pool/roadmap-2b/`.
