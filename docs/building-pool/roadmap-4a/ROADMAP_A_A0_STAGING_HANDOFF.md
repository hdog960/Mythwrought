# MYTHWROUGHT — ROADMAP A / A0 protected staging handoff

Date: 2026-11-17 (America/Chicago)
Source PR: #182 (draft/open/unmerged)
Protected original branch source HEAD: `cfbe984a0c8ba69eb4dc2b247dd5a26866e77f05`
New isolated staging branch: `roadmap-a-4a-staging-20261117` (created at that exact source commit)
Latest source-head GitHub Actions verification: #44198988075 — completed success, shared full scope; focused stage skipped

## Workstream A2: Government & State Knowledge
- Source tally: 164/315, of which 30 inherited and 134 original; 151 remaining.
- Completed and preserved: 75 civic halls, 60 guildhalls.
- Remaining: 26 castle-palaces of 45, 41 embassies of 45, 41 grand archives of 45, 43 observatories of 45.
- Continue original biome-region authored state and knowledge buildings, each with true source coordinates, independent massing and functional interior room graph.
- Strict same-category eight-way D4 normalized floorplan IoU < 0.85; no renames or cosmetic reskins.
- Confirm physical stairs and landings for any reachable upper floor, real courtyard connectivity, supported roofs and read-only actual Pack1–5 producer physical envelope checks.
- Source manifest currently records creatorAccepted=0, integratedBuildings=0; do not change absent true approval.

## Non-negotiable isolation
- Original source PR is the protected, read-only handoff baseline. No rebase, force-push, merge, deletion or changes to it from this staging effort.
- All source, tests and documentation edits must remain within this builder's own `src/building-pool/roadmap-*/`, `tests/building-pool/roadmap-*/`, and `docs/building-pool/roadmap-*/` namespace. Never touch other builders, the production runtime, manual block pack producers, biome automation, GitHub Actions/shared CI, saves or v0.11.
- Development candidate only: not merged, deployed, creator-art approved, physical-iPhone accepted, or world registered.
- Source-exact fingerprint, inherited IDs, legacy references and historic D4 debt are immutable.
- Passing the latest full verification workflow does NOT independently establish focused native or all source-specific Chromium image acceptance: focused stages were skipped in the latest selected full workflows. Use earlier dedicated evidence, and rerun exact new-head focused stages before accepting new designs.
- After any candidate change, verify source, D4, physical producer AABB/clearance/support, screenshot hash and dimensions, genuine Chromium WebGL2 exterior/cutaways at 667x375, 844x390, 932x430, repository Node and landscape smoke. Do not confuse proxy graphics with final meshes or software Chromium with physical iPhone evidence.

## Advancement gate
A0 branch initialized. A1/A2/A3 source changes must take place on this staging branch only. Promote no commit or result back to the original PR, main, or production without a separately authorized integration. A4 acceptance and A5 creator review remain distinct gates.
