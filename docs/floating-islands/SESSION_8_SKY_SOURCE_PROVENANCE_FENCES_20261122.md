# MYTHWROUGHT Floating Islands - Session 8 exact source-provenance and headroom checkpoint (2026-11-22)

## Protected references and source availability

- Starting isolated branch `research/floating-islands-sky-runtime-adapter-20261122` exact HEAD `eafaccaa3eaa90694a13d572fb0d7b61f4360275`, protected main `7016e14cd6289f45eaf7fc6a79a362b47996df65` (both verified before changes).
- Read exact GitHub `docs/floating-islands/SESSION_7_NATIVE_OWNER_G2_HANDOFF_20261122.md` and reran preserved `MYTHWROUGHT_Floating_Islands_S7_48_native_tests.zip` tests locally (48/48, Node 22.16.0).
- Searched GitHub branches, PRs and commits once. No pushed Codex Floating Islands generator could be located. This work is source-only and does NOT imply the Codex worldgen, save format, actual physical island heights/density, iPhone FPS, three-moon daylight or installed PWA have been tested.
- Direct local GitHub checkout still fails DNS. The three prior `sky-original-native.test.mjs` tests needing the entire genuine original repository remain UNRUN. All native-module-backed tests below use byte-identical GitHub source copies of `src/depth.mjs`, `src/gpu-recovery.mjs`, `src/creative-integration/g2-flight.mjs` and `src/creative-integration/g2-streaming.mjs` with simulated GPU/physics.

## Source defects proven and repaired

1. **Sky-world source provenance was missing from upper GPU buffers.** A key such as `sky:0,0,0` alone is not proof that the GPU buffer represents the current world after a seed/world switch, a new generator revision, or a player-mined AIR edit. A stale buffer could falsely satisfy full-body G2 readiness and be drawn until replaced.
2. **Physical headroom was not checked against the Y=256 sky ceiling.** Prior `verifySkyIslandFlightSpace`, `verifySkyCreativeFlightStep` and the native G2 bridge checked feet, but a player with feet near Y255 could place their head beyond the bounded authoritative source. The revised controls now require the full 1.78-block body to remain within the upper-world bound. This is provisional until actual Codex world height semantics are known.
3. **Cached or otherwise unproven geometry could be stamped as current by a GPU staging bridge.** A mesher's chunk key and vertex count do not certify that the vertices were generated from the current edited source. A proof from the actual source meshing interval is required before upload.

## New source-only integration components

- `src/floating-islands/sky-certified-owner.mjs`: wraps existing exact original GPU owner and renderer grant. Requires authoritative `readIdentity()` `{worldToken,generatorFingerprint,epoch}` and `sectionRevision(key)` callbacks. Ignores/retire-on-success stale or untagged sky buffers without evicting original native surface/depth chunks; requests at most two newly certified sky meshes per frame and up to eight full-body seam sections within the shared 25 slots. Publishes only existing source-current sections plus newly staged buffers, never placeholder keys. Stamps each staged chunk with exact source identity+section revision, including mining revisions; compare-and-swap original in-place Map publication is guarded before and after GPU work. Source changes during GPU upload trigger cleanup, except context loss where unsafe deletion is refused. Old world and unrelated native ground/depth buffers are preserved.
- `src/floating-islands/sky-attested-mesh.mjs`: wraps the detached genuine-source `createOriginalSkyPhysicalHost.meshSection` with before/after generator-identity and per-section-revision checks. It requires authoritative 9-float original triangle data and source-only staging flags. Outputs an immutable `sourceProof` which the certified GPU owner requires. An unspecified or cached original mesh without revision attestation is refused, not relabeled.
- `src/floating-islands/sky-runtime-adapter.mjs`: exports `SKY_ISLAND_PLAYER_HEIGHT=1.78`; full-body headroom verification now enforces Y<=256.
- `src/floating-islands/sky-creative-bridge.mjs`: dual-world Creative flight readiness rejects head-over-ceiling, including sideways movement at the top.
- `src/floating-islands/sky-native-g2.mjs`: the genuine original G2 math bridge now includes the same complete player-body ceiling check. Original G2 and physical checks still both own approval. No change to production G2 controllers.

## Focused tests, provenance and anti-clogging

- Local Node v22.16.0: `node --test tests/floating-islands/sky-certified-owner.test.mjs tests/floating-islands/sky-attested-mesh.test.mjs tests/floating-islands/sky-native-owner.test.mjs tests/floating-islands/sky-native-g2.test.mjs`: **73/73 PASS** (25 newly authored and 48 exact Session 7 regressions). All changed `.mjs` parse checks passed.
- Cases include four successive two-upload frames completing an eight-section x/z/y flight seam; world switches with same GPU keys; a player edit changing exactly one of eight section revisions; missing current source revision; mesh source mutation during upload and publication; original in-place renderer CAS rollback; WebGL context loss; stale remote coordinates; source-certified multi-box physical mesh contract; and Y255 feet plus 1.78-block head outside Y256 refusal.
- This tests original-module-compatible adapters and fixture worlds, NOT genuine full-repository `VoxelWorld` or actual WebGL2, browser visual, or iPhone acceptance. Prior exact test evidence remains valid for unchanged files and was not redundantly rerun. No GitHub Actions or broad browser jobs were initiated.

## Future native integration sequence

1. Retrieve actual Codex generator, original sky-source API, source edit sidecar, real per-section revision/identity and height semantics. Do not assume these new provisional interfaces equal Codex's code. Adapt without deleting or rewriting Codex's work.
2. Run the 3 earlier full original-world tests on a real complete original checkout once; then directly wire original `createOriginalSkyPhysicalHost` with actual generator and saved AIR edits to `createAttestedOriginalSkyMesher` and `planCertifiedSkyOwner`.
3. Original renderer MUST explicitly grant the reduction from 25 surface slots to 17 native plus 8 upper. Underground 27 and native mine breach 34 slots stay untouched. Integrate at the original renderer's synchronous frame boundary; handle transparent waterBuffer retirement, epoch/context faults, and only source-current sky buffers.
4. Validate physically mineable source-authentic tree/foliage materials, saved edit roundtrip, shapes/raycast/collision, naturally detailed islands at signed +/-10,000 block coordinates, sky/day/night/three moons without perpetual ground darkness, real iPhone GPU frame time/texture budgets and installed Home Screen PWA. No new shadow pass and no fake foliage IDs.
5. Long-term island settlements/mobs/structures remain deferred; no user approval requested for this isolated research work.

No production `src/main.mjs`, original generator, other developer branch, protected `main`, user saved worlds, CI configuration, workflow queue, Pages deployment, or PWA was modified. This is a research checkpoint only, NOT an approved playable release.
