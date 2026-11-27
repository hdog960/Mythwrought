# Developer toolkit pilot and adoption

## Baseline and controlled result

Before implementation, the public repository listed 904 branch refs. The latest 100 Actions records, from run 45835198223 through 46008279325, had 99 completions and one in progress. They contained zero repeated workflow-path and head pairs and zero visible rerun attempts. The listing exposes neither repeated log/artifact requests nor startup, session or polling costs. The zero duplicates in this sample do not establish a repository-wide duplicate-work rate. Reported recurring handoff and shared-doc conflicts appear in `docs/AUTODEV_HANDOFF.md` and `docs/INTEGRATION_CHECKPOINTS.md`, which together were 59,728 worktree bytes in the sampled Windows checkout.

On the same Windows worktree and warmed Git object database, four handoff consumers looked up the same main and Age of Beasts refs and authenticated the same known installed qualification. The comparison ran four independent lookups versus one shared report, checked that every result matched and issued no writes. Reproduce with `node tools/devkit/benchmark.mjs`. This measures a reproducible fan-out scenario using live GitHub data. Times are from one trial and vary with network conditions.

| Measure | Independent lookups | Shared report | Observed change |
|---|---:|---:|---:|
| Wall time | 4,463 ms | 611 ms | 86% lower |
| Git operations | 24 | 5 | 79% lower |
| API reads | 12 | 3 | 75% lower |
| CI dispatches, polling requests, artifact downloads | 0 each | 0 each | equal |

The metadata validated both live mining evidence records and did not download the archives. The archive cache test used an explicit controlled fixture and did one download across two requests; corruption was rejected. The review used the existing artifact's GitHub digest, without making new claims about image inspection or device acceptance. The exact installed evidence is [run 45932330549](https://github.com/hdog960/Mythwrought/actions/runs/45932330549/attempts/1) and the native evidence is [run 45931884263](https://github.com/hdog960/Mythwrought/actions/runs/45931884263/attempts/1).

The report recovered a valid checkpoint, accepted the exact hosted branch and rejected stale input during a local run of the Actions entry point. The same restricted entry point returned the expected continuation and pending-work diagnosis for synthetic checkpoint inputs using each of the five identity slots. These are compatibility demonstrations. Actual scheduler execution requires the existing automation's environment and a real normal run. An Age of Beasts comparison against the previous production SHA identified relevant main changes in world, height, creatures, rendering and persistence. The branch shared no changed filenames in that comparison. That finding does not establish semantic compatibility.

The existing manifest check passed against the 339 committed assets in an LF checkout. Git's CRLF worktree conversion changes byte hashes on Windows; use a checkout with `core.autocrlf=false` to verify published bytes. None of the toolkit files are part of the gameplay or service worker asset closure.

## Activation after creator approval

1. Review the isolated toolkit revision and preserve existing required checks. Approve its default-branch integration using the existing queue and expected-head procedure. The present Pages job deploys on main pushes and uploads the repository root. Coordinate this approval as a Pages publication even for infrastructure-only changes. Existing branches, workflows and schedules keep their owners. If the creator wants the toolkit off the public site entirely, they must first authorize a separate change to publication packaging.
2. Default-branch `AGENTS.md`, the README and the report workflow provide central discovery for new checkouts and GitHub readers. No separate installations are needed. Publish one repository-wide standing instruction in the creator's existing coordination surface for conversations or scheduled prompts that do not discover repository instructions. Use the same instruction in a global configuration if their host supports a shared project prompt. If the host has independent prompts only, the person authorized to edit them can append the exact same line once without changing assignments, schedule or status. Use the previous saved copy to reverse that change if necessary.
3. Validate adoption at the next normally scheduled run for each minute and the next normal session for each connected environment. Use an existing handoff or run record. Capture slot or environment, toolkit revision, assignment source, observed head, valid checkpoint retrieval, treatment of one evidence item, next action and one measurable time or operation count. A missing receipt remains pending. A shared read-only operator can provide reports for sessions with restricted access; those sessions should explicitly document which checks they could perform themselves.
4. Compare normal session measurements before broadening use. Record time to first engineering action, checkpoint recovery minutes, Git/API reads, artifact fetches, avoidable dispatches and polls, useful completed objectives per session, genuine blocker resolution time, qualification queue and runner minutes, escaped defects, and release prep minutes. Use matching assignment types and include pending work. Actual rollout and engineering output improvement remain unmeasured until those observations exist.

Use this single standing instruction:

> At the start of your existing MYTHWROUGHT assignment, read `docs/DEVELOPER_EFFICIENCY.md` from repository default branch and follow “Continue development” using your current branch, ownership boundaries and latest checkpoint. Use your permitted terminal, GitHub or conversation procedure. Save the observed toolkit revision and outcome in your existing handoff. Preserve your normal schedules, assignments and creator approval requirements.

After rollout, subsequent changes are reviewed on the same canonical branch through normal creator authorization. Codex worktrees and automation hosts that discover repository instructions pick up changes through that pointer. Restricted hosts use the current GitHub document or report. To roll back, restore the prior approved default-branch version and restore a prompt only if its permanent bootstrap pointer itself needs to be removed.
