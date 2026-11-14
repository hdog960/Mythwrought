# Pack 4 — Windows & Furnishings progress ledger
**UNMERGED CANDIDATE — NOT IN LIVE GAME • Gate A v0.10**

**Branch:** \`pack-4-m0-m1-windows-openings-20261114\`
**Base main:** \`f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84\`
**Latest creator incorporation:** checkpoint 006, game code \`1006e5cd5fd44e5696943d2651e63fb30a393003\`.
**Exact PR HEAD:** GitHub PR \`head.sha\` and PR description provide the
final immutable review SHA after the last commit. Do not embed a commit's
own SHA inside itself. New commits require updating PR handoff and re-testing.
**Ownership:** Pack 4 source/tests ONLY; ID band 159–208. Protected 0–8 / 255.

| Roster | Family | Candidate persistent IDs | Variants | State |
|---:|---|---|---|---|
| 30 | Clear glass | 159 | Clear beveled pane | Candidate built, tests authored |
| 31 | Stained glass | 160,161 | Sunfire; Moonveil | Candidate built, tests authored |
| 32 | Wooden window frames | 162 | Open carved oak sash | Candidate built, tests authored |
| 33 | Wooden shutters | 163 | Closed double-leaf oak | Candidate built, tests authored |
| 34 | Iron bars | 164 | Four-rod wrought grille | Candidate built, tests authored |
| 35 | Lantern blocks | — | — | Planned, M2 |
| 36 | Wall-mounted lanterns | — | — | Planned, M2 |
| 37 | Crystal lanterns | — | — | Planned, M2 |
| 38 | Torch blocks | — | — | Planned, M2 |
| 56 | Barrels | — | — | Planned, M3 |
| 57 | Wooden crates | — | — | Planned, M3 |
| 58 | Wooden benches | — | — | Planned, M3 |
| 59 | Wooden tables | — | — | Planned, M3 |
| 60 | Wooden signs | — | — | Planned, M3 |
| 61 | Hanging banners | — | — | Planned, M3 |
| 62 | Market canopy blocks | — | — | Planned, M3 |
| 63 | Chimney blocks | — | — | Planned, M4 |
| 64 | Fireplace blocks | — | — | Planned, M4 |
| 65 | Well rim blocks | — | — | Planned, M4 |
| 66 | Well roof blocks | — | — | Planned, M4 |
| 67 | Well pulley blocks | — | — | Planned, M4 |
| 68 | Fountain blocks | — | — | Planned, M4 |

### Milestones
- **M0 Foundation:** base/checkpoint/Issue #109/registry and open PRs
  inspected; dedicated branch, unique namespace, explicit manifest and
  isolated test directory created. Other manual packs and automated lanes
  remain untouched.
- **M1 Windows/openings:** six visual/physical variants across five
  exclusively owned families implemented in \`windows.mjs\`, with actual
  partial selection/collision boxes, four-way Y rotations, transparent
  material separation and strict state serialization. **Candidate only,
  awaiting Node + browser and integration acceptance.**
- **M2** four lighting families (35–38) not started.
- **M3** seven furniture/market families (56–62) not started.
- **M4** six hearth/civic families (63–68) not started.
- **M5** full 22-family review and manual handoff pending.

### Verification status
- Source parser and 24 asset/rotation pairs: **PASS** in connector's
  JavaScript V8 check (not a Node or browser run).
- Exact authored 29 test bodies evaluated in the same V8 compatibility
  harness: **29/29 PASS** after fixing malformed shutter panel and
  incomplete serialized orientation handling.
- **Node test runner:** NOT YET EXECUTED in this candidate checkout.
- **Genuine Chromium WebGL2 gallery:** authored, NOT YET RUN/SCREENSHOT-REVIEWED.
- **Real iPhone:** NOT TESTED. **Merged/deployed:** NO.

Dependencies: unmerged generic shapes [#108](https://github.com/hdog960/Mythwrought/pull/108),
targeting [#106](https://github.com/hdog960/Mythwrought/pull/106),
central persistent registry, transparent sorted-depth pass and schema-1
optional orientation adapter. Current main only IDs 0–8. No new lighting
or open/close behavior is claimed. Gallery is *not* an in-world screenshot.

**Next task:** run exact branch Node/Chromium and inspect transparency/depth
and rotations; resolve defects within Pack 4 only. Then implement M2 lanterns,
wall lanterns, crystal lanterns, and torches with actual shapes/support and
explicit light metadata; leave lighting engine to central integration.
