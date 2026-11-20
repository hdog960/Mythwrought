# Builder 2B — M0 acceptance and guarded handoff

## Verified prerequisites
- Infrastructure PR #178 exact candidate `7f7431f97a137c89d900735758b3cd2d183ea47b` merged as `e6bd7c173a4531ba7efc153e5f2eb89870c3b9db` after creator's separate explicit merge authorization. Exact-head CI run `43762245025` and main CI run `43764265884` succeeded.
- Current source main/checkpoint read at kickoff. Shared eight-lane roster keeps 2B exclusively market-square, tailor, butcher, jeweler, bookshop, temple, theater; PR #124 original and 2A store candidates remain independent.
- Original PR #124 pinned to `07c45d27bd36f4f3aa3197bba0e4f49ce2a58c68` and source blob `4cc1ccc4cedfb927f510c6a85c8c4aa11290eccc`; full native parity is a CI acceptance gate, not assumed from old reports.

## Count ledger
| Kind | Reserved | Full coordinate-authored M0 | Newly authored M0 | Still to author |
|---|---:|---:|---:|---:|
| Market Square | 60 | 0 | 0 | 60 |
| Tailor | 60 | 0 | 0 | 60 |
| Butcher | 60 | 0 | 0 | 60 |
| Jeweler | 60 | 0 | 0 | 60 |
| Bookshop | 60 | 0 | 0 | 60 |
| Temple | 75 | 15 inherited | 0 | 60 |
| Theater | 45 | 0 | 0 | 45 |
| **Total** | **420** | **15** | **0** | **405** |

Creator accepted: **0**. Production integrated: **0**. Placed in playable world: **0**.

## Unresolved dependencies and gates
- Material roster refs are source-known but **not certified** per-voxel for production shape, dimensions, support, orientation, yaw, mount, collision, selection, transparency, or schema-1 serialization. Particularly symbolic `pack1:008` stair facing/landings, `pack4:030/032` glass/framing and `pack5:093` altar remain typed architectural intentions pending physical ABI check.
- Biome130 dependencies are independent of manual five-pack integration; source catalog presence is not a production registration claim.
- Full physical contact-sheet/WebGL2 preview for new 2B lane, phone-scale cutaway inspections at 667×375, 844×390, 932×430, creator design approval and actual iPhone acceptance are **not covered by M0**. Browser smoke/layout in CI proves only production baseline, NOT a render of inherited temples.
- No worldgen, shared CI, runtime builder registry, pack, sibling path, main or original PR modifications.
- M0 may be considered technically complete only after exact PR-head focused CI proves the native legacy parity test, all local lane geometry tests, and browser smoke/layout. Do not claim green until checked.
