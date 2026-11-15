# Mythwrought independent Chromium verification: draft-only handoff

This is an **additive** evidence workflow, separate from infrastructure PRs #134 and #135 and the five manual Block Pack / four Building Roadmap branches. It changes no shared CI workflow, main, saves, block registry, PWA, game physics, Pages deployment, automation, Gate A or v0.11. The existing full integration CI is still separately mandatory.

## How the isolated verifier runs

The new workflow runs on an ordinary same-repository pull request to main affecting its own verifier files or the nine known manual roadmap path families. There is **no workflow_dispatch** or deployment action. On this infrastructure PR, it selects all nine candidates; for later isolated roadmap changes, it selects only matching owned lanes. Empty/unknown scopes fail closed. Selection scans the entire paginated PR file list. One runner executes lanes sequentially, avoiding nine simultaneous runner claims and browser installations.

For each lane, GitHub's read-only PR API must show an **open draft** in this repository based on main. It fetches the candidate's own refs/pull/NUMBER/head without merging, creating a detached worktree. Git SHA must match the freshly queried PR head. Candidate scripts do not receive GH_TOKEN, and workflow credentials are not persisted. Node 22 executes nested original tests, not V8 facades. Free Python/Node Playwright plus official Chromium, Xvfb/Mesa software GL run real browser tests. There is no administrator-policy bypass on restricted developer containers.

The common WebGL2 preflight actually obtains a context, clears a framebuffer, checks GPU readPixels, records a renderer and screenshots at **667×375, 844×390 and 932×430**. It is explicitly **transport-only**, never candidate geometry evidence. The candidate's existing committed browser runner must separately execute and produce authentic PNGs. The verifier checks PNG integrity by actual decoding, dimensions (including cropped Pack 2 model captures), color diversity, filenames, all three viewport classes, SHA-256 checksums, minimum image count, exact PR SHA, native TAP test totals and zero skipped/failed tests. Logs and screenshots are saved with evidence.json and uploaded through actions/upload-artifact even for partially completed lanes. No screenshot is synthesized or substituted.

| Lane | Draft PR | Minimum genuine Node | Existing candidate browser suite | Minimum screenshots | Evidence classification |
|---|---:|---:|---|---:|---|
| Pack 1 | #113 | 93 | 5 original galleries / real interaction and offline fixtures | 30 | Canvas2D; **WebGL2 candidate gate BLOCKED** |
| Pack 2 | #114 | 89 | Original asset gallery + real VoxelWorld boundary suite | 66 | Canvas2D; **WebGL2 candidate gate BLOCKED** |
| Pack 3 | #112 | 72 | Original geometry gallery + rotation contact sheets | 3 viewport pages + contact sheets | Canvas2D; **WebGL2 candidate gate BLOCKED** |
| Pack 4 | #115 | 181 | 23 original candidate assets × four rotations, true WebGL2 | 12 | Isolated WebGL2 candidate technical gate |
| Pack 5 | #119 | 156 | Six genuine WebGL2 native ES-module source galleries | 36 | Isolated WebGL2 candidate technical gate |
| Building 1 | #121 | 85 | Authored exterior and cutaway browser previews | 54 | Canvas2D; **WebGL2 candidate gate BLOCKED** |
| Building 2 | #124 | 48 | Authored 30-building three-viewport galleries | 90 | Canvas2D; **WebGL2 candidate gate BLOCKED** |
| Building 3 | #122 | 56 | Source-exact WebGL2 diagnostic cube envelopes | 180 | Diagnostic WebGL2 only, final block mesh not proven |
| Building 4 | #123 | 60 | Source-exact WebGL2 diagnostic architectural geometry | 180 | Diagnostic WebGL2 only, live integration not proven |

Canvas2D-only lanes **must report BLOCKED**, even if their genuine Chromium screenshots and native Node tests pass. A successful generic WebGL2 capability probe never changes that classification. Genuine diagnostic WebGL2 in Building 3/4 cannot certify final symbolic dependency geometry. Source-exact tests and screenshots are only **isolated candidate evidence**.

## Approval and operating restrictions

- This PR is a **proposal**, and cannot certify any test until its own exact-head GitHub Actions run actually starts, logs real execution and uploads verifiable artifacts. A queued job is not a pass.
- A passing supplementary job does not replace the original full game CI, production WebGL2 integration, shape/collision/persistence verification, visual human review, real iPhone Safari or two-thumb control acceptance.
- Creator Gate A approval remains open; v0.11 remains locked. Candidate packs and buildings remain unmerged/unregistered/undeployed.
- No manual CI trigger, CI rerun, merge, production deployment or workflow policy loosening is authorized here. No administrator browser restrictions are bypassed. All writes are to this independent draft infrastructure branch only.
