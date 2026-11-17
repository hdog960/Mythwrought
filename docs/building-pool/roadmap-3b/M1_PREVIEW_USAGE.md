# 3B M1 preview usage — diagnostics, not finished blocks

- Source: `tests/building-pool/roadmap-3b/preview.html`.
- Run local read-only static HTTP server from the repository root, then open that
  path in Chromium/WebGL2. Nothing writes into the actual game or the saved world.
- Optional browser acceptance (requires free Playwright + served project):
  `node tests/building-pool/roadmap-3b/preview-browser.mjs`.
- Collects 15 inherited towers × exterior/cutaway × 667×375 / 844×390 / 932×430
  = **90 possible screenshots**, NOT screenshots already captured.
- Rendering classification: source-exact conceptual **unit-cube diagnostic WebGL2**.
  It is NOT actual integrated-pack physical AABB meshing, production world
  WebGL2, gameplay collision validation, artwork approval or physical-iPhone QA.
- Origin: original PR #122 generic preview mesher/camera/browser concepts, copied
  only into Builder 3B-owned diagnostic paths and restricted to watchtowers.
  Original PR #122 and the sibling Builder 3A remain untouched.

## Exact-head browser screenshot gate (isolated CI)
The 3B-owned native suite now includes `chromium-diagnostic.test.mjs`, which
launches actual system Chrome/Chromium via CDP, serves the authored preview as
local ES modules, verifies WebGL2 and nonblank RGB pixel readback, and captures
90 PNG exteriors/cutaways under
`artifacts/building-roadmap-3b-m1/chromium-webgl2-diagnostic/`.
It emits `acceptance.json` containing the renderer classification, viewport,
design IDs, color/readback and zero GPU errors. It fails closed if Chrome, WebGL2,
source geometry or screenshot capture is unavailable. The CI artifact upload
remains the shared workflow's existing `artifacts/` collection; no workflow
change is authorized.
**Do not claim this gate ran or passed until exact-head Actions confirms it.**
A real WebGL2 cube-envelope diagnostic does not prove manual/biome family AABB,
live runtime placement, gameplay collision, artwork or physical iPhone.
