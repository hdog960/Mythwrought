# Roadmap A — Original Pack5 visible art versus collider-contact clearance (source-only)

## Engineering reason for this checkpoint

The preceding original-PACK5 mesh boundary witness reports where a full-source-cube **backing** collider has less than a complete source-authored exterior mesh boundary. Its result alone never proved that the **mounted dependent** material touches that backing cell. The unchanged original `pack5:079` plaster collision starts `0.025` block units inside its local backing face; unchanged `pack5:081` ceramic tile collision begins `0.015` block units above its nominal cell-bottom face. Even an original full-cube `pack5:080` fired-brick backing collider can therefore leave a physical air gap to the mounted finish. These offsets are from the original authored geometry, not invented replacement construction details or world physics.

## New independent, fail-closed witness

- `src/building-pool/roadmap-2a/roadmap-a-pack5-contact-gap-core.mjs`: true original-box closest face-gap computation for **both** dependent and backing physical collision volumes, requiring positive-area tangential projection overlap; separately computes the authored physical mesh-box gap; safeguards original attachment identities, geometry and all no-approval flags
- `src/building-pool/roadmap-2a/roadmap-a-pack5-contact-gap-producer.mjs`: adapter to unchanged `resolveOriginalPack5SupportPreview`, `auditOriginalPack5PreviewPhysicalSupports`, original Manual Five Pack mesh source through `resolveExplicitPack5PreviewFixture` and original support dependency audit; all variants and yaws provided explicitly by test fixture caller
- `tests/building-pool/roadmap-2a/roadmap-a-pack5-contact-gap-core.test.mjs`: 11 focused native pure-core tests for plaster 0.025 gap, ceramic 0.015 gap, six axes, box-face tangent non-contact, closest actual paired boxes, contact still not accepted, fake approvals and malformed coordinates
- `tests/building-pool/roadmap-2a/roadmap-a-pack5-contact-gap-producer.test.mjs`: four authentic original-repository producer tests, including all four plaster yaws and both original plaster alternatives, original exact brick backing and ceramic offset, uncertain backing and fail-closed source restrictions

A source-collider candidate is **not** structural contact proof. A zero closest gap is only an elementary AABB geometry contact candidate; it is not verified world physics, terrain support, load path, full face coverage, art appearance or GPU occlusion. A positive gap is a blocking preview warning rather than a code change to the original producer. No production selection of a source variant/yaw, correction of original material geometry, building placement, source voxel/structure assignment, real batch splitting or live engine alteration is authorized.

## Evidence and efficient CI

Local native Node 22 targeted pure-core checks: **20/20 PASS** combining pre-existing nine original mesh-boundary core tests with eleven newly added contact-gap pure-core tests. **Eight original-producer tests** (four previously unexecuted plus four new) still need original-repository-native execution. Existing six original dependency core native tests and historical 24/24 rotated Pack5 + 58/58 controlled V8 are reused, not re-run.

All A5 source-only 207/420 with 213 unwritten; prior 128 commerce, 345 industry, 315 government preserved. Protected main, protected draft PR406, old Roadmap A source, all other developers, five hourly automations, shared workflows, saves, schema1 PWA and v0.11 untouched. Essential subsequent gates remain original-repo native producer tests, real original-game collision/support, genuine WebGL2/iPhone visual-cost acceptance, and explicit creator approval. No new renderer optimization or structural certification is implied.
