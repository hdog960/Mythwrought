# Builder 3B — M0 isolated source setup and inheritance

Status: **M0 draft candidate**, never merged, deployed, or approved. This lane is the only writer
to `src/building-pool/roadmap-3b/`, `tests/building-pool/roadmap-3b/` and
`docs/building-pool/roadmap-3b/`.

## Verified pinned inputs
- Main baseline: `e6bd7c173a4531ba7efc153e5f2eb89870c3b9db`; merged infrastructure PR #178 exact head
  `7f7431f97a137c89d900735758b3cd2d183ea47b` (exact-head CI success;
  main verification + Pages success, separate creator iPhone review unproven).
- Original untouched draft source: PR #122 exact head `e35b8eca644f6de06e76ab946103ce64a6b7fb91`.
- Legacy M1 generator blob `189ac4deb11042534743045b5087a7a7525e3bf1`; M1 manifest blob `deab2505c5be9ad752ab9f01c0f6cc776b19fc66`.
- Existing building family roster on main: 96 manual symbols, 106 physical variants.
  Never assume the original legacy references encode the final family variant, rotation,
  state, colliders, support mount or occupancy. Investigate with exact builder interface
  in subsequent review. Biome130 assets remain independent until verified.
- Source origin: original `r3:watchtower:<biome>:<size>:1` identities preserved.
  Copied only the geometry-critical shared helper section + watchtower implementation
  verbatim from the pinned legacy file; removed blacksmith generator and unowned
  categories. Existing shape code and authored coordinates are not redesigned.

## Exact quota
| Category | Each biome × size | Total | Imported | New needed |
|---|---:|---:|---:|---:|
| Lumberyard | 4 | 60 | 0 | 60 |
| Mill | 4 | 60 | 0 | 60 |
| Watchtower | 5 | 75 | 15 | 60 |
| Barracks | 4 | 60 | 0 | 60 |
| Gatehouse | 4 | 60 | 0 | 60 |
| City wall (complete gated perimeter) | 3 | 45 | 0 | 45 |
| **TOTAL** | **24** | **360** | **15** | **345** |

Exactly five regions × three sizes. Imported watchtowers are one variation in each of
the fifteen biome/size cells. Their identity and coordinates remain theoretical; 0
creator-final-accepted, 0 actually integrated. No village/town/city placement.

The legacy PR's 71,293 conceptual coordinates are **combined** blacksmith + watchtower
and are not all attributed to Builder 3B. See `M0_WATCHTOWER_IMPORT.json` for the
fifteen watchtower-only source values and fingerprints/provenance inputs.

## Tests and later gates
- Run `node --test tests/building-pool/roadmap-3b/*.test.mjs` on actual native Node.
- Current M0 tests assert exact quota, source manifest identity/count/envelope/stair parity,
  source-authored 15 structures, geometry uniqueness, canonical deterministic output.
- Independent against-original generated coordinate-list hash/parity and true WebGL2
  source preview at 667×375, 844×390, 932×430 must still be reviewed in M1;
  matching manifest counts alone do not certify byte-identical coordinate parity.
- Physical-world colliders, stair clearance/fit, asset mapping by *real* variant,
  mounting and support, save ABI, iPhone review and final artwork are not claimed.
- Source, tests, docs only; no shared code/CI changes. Original #122 remains draft
  and unmodified, sibling 3A blacksmiths are not duplicated, Gate A v0.10 open,
  v0.11 locked; no merge or deploy.
