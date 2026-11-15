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
