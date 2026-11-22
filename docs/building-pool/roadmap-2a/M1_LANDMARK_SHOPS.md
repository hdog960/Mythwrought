# Builder 2A M1: six bespoke non-cross landmark shops (candidates 93–98)
**Detached source designs only; not approved or integrated.**

| Candidate | Reserved ID | Distinct original architecture |
|---|---|---|
| Thistledock Switchback Exchange | `r2:general-store:enchanted-forest:large:03` | riverfront switchback merchant aisle, open rear connection, tall counting roof |
| Aurelia Crescent Empty-Stall Bazaar | `r2:pet-shop:desert:large:03` | crescent empty-pen bazaar around real open air, covered rear feed gallery |
| Starfall Lantern Galleries | `r2:magic-shop:mountain:large:03` | mountain observatory galleries with distinct raised oriel and astrolabe roof |
| Rimebreak Cascade Apothecary | `r2:potion-shop:snow:large:03` | terraced snow herbal galleries, raised drying stack, lowered north herb roof |
| Honeyglass Courtyard Bakehouse | `r2:bakery:enchanted-forest:large:03` | long sugar-glass entry vault and taller oven-chimney bake-wing, open interior court |
| Sirocco Gatehouse Treasury | `r2:bank:desert:large:03` | asymmetric desert entry pylon, side bond wings and a real producer two-leaf vault shell |

Each source is independently parameterized by geographically distinct connected wing rectangles, at least two genuine floor/foundation/roof-empty courtyard regions, four walkable functional interior anchors, physical producer-backed Pack 5 fixture intents, and four non-identical source-voxel roof profiles (gable, sawtooth, tower, terrace). Interior source-based support piers and perimeter bearing walls root the roof stack; **physical wide-span roof engineering is not approved**. Noninteractable items only: no live shop, bank, spell, cooking or animal gameplay.

**Preflight independent of CI:** all six proposed normalized D4 floor footprints checked against 92 accepted source models. Maximum new IoU **0.820761**, below immutable threshold 0.89; all 24 entrance-to-room routes clear in shape-only path preflight after adding a real connecting gallery to Thistledock. These preflights do not replace the actual source and producer native tests.

**CI acceptance required:** 98 source-authored candidates, 588 real Chromium WebGL2 cube-proxy PNGs (98 × exterior/cutaway × 667×375/844×390/932×430), strict owner-only paths, producer multi-cell fixture physical occupancy, D4 no NEW high-overlap pairs and preservation of all 92 prior source snapshots. The 269 inherited high-overlap D4 floor pairs (30 exact) remain open debt and cannot be silently rewritten. Physical mesh, transparent glass mounts, actual roof span, performance on a physical iPhone, creator art approval, world incorporation and save compatibility need separate approval. v0.10 Gate A remains the only allowed game version; v0.11 locked.
