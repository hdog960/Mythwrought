# Desert P3 — original-game two-site visual gate hardening (2026-11-22)

## Isolation and provenance
- Prior isolated branch checkpoint `449e0b3e26d3ee569227782918131db0d8dfcbd5`.
- Actual in-game browser test hardening `c68a6a281328df8c4a5a0d9b3aa3fc9f6161d3bc`.
- Isolated workflow harness checkout correction `2dca82c2fc21416aada1ba6cf00ec2e2f4647f1a`.
- Before source: `3c1f87c0db53ebafa8fbb52fcb7964c23fd5ba68`; after source: `2bd0395d3ef163e9fdc491ab5119b1ee80844194`; these remain fixed, untouched.

## Concrete test defects fixed
1. A remote teleport could appear "ready" when 25 GPU chunks from the **old** center were still resident. The focused script now derives the actual new target from real player feet position and original `chunkCoord`, and requires `scene.dataset.chunkCenter` to match before screenshot.
2. Dynamic sky time could give incomparable lighting for different worktree launches. The script now presses the game's actual `SET DAY` control in each scene and records daytime illumination / residency diagnostics before accepting each frame.
3. Previous workflow fetched an **older harness SHA**, so new reliability fixes would never be used. The isolated push workflow now checks out the exact triggering `github.sha` and verifies it against `GITHUB_SHA`. The two gameplay source checkouts stay immutable.

## Evidence status
- Reused **only** historical exact gameplay-child native 20/20 (#45036500012) and original five-seed biome census (#45036277170); no duplicate native or full-browser suite was run.
- Connector GitHub `fetch_commit_workflow_runs` returns only pull-request-triggered workflow runs and reported none for commits `f3be1dd` and `449e0b3`. The actual isolated job is **push-triggered**. Therefore the negative lookup does **not** establish that the job never ran.
- Public web/CLI network access to GitHub is unavailable from this execution environment. **No actual run ID, job conclusion, logs, PNG ZIP bytes, CRC, SHA256 or visual inspection could be obtained and no successful execution is claimed**.
- Screenshot test remains **authored and committed but not verified executed**. Do not accept visual quality, screenshot artifact identity, hardware GPU timing, or physical iPhone experience yet.
- Changed files in this follow-on are only the existing isolated visual test, isolated workflow, and this checkpoint. Protected main, all Phase 1/2/3 refs, other developers, saves, cave/sky, automations, and deployment remain untouched.

## Next minimum acceptance
Read the run ID/conclusion of `desert-p3-junction-visual-proof-isolated.yml` from GitHub Actions for its latest push, fetch its one job log and one named artifact `desert-p3-triple-junction-original-game`. Check exact three-worktree SHAs, actual script execution, source cap values 258 before vs scree after, JSON manifests, PNG integrity and SHA256, 932x430 frame, two target centers and daylight. Inspect four actual screenshots: seed179 Desert/Mountain/Enchanted, seed2026 Desert/Mountain/Snow before/after. Repair a **real** Desert-only visual failure in a separate isolated child; no broad suite or shared workflow changes.
