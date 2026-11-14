#!/usr/bin/env bash
# Mythwrought Pack 2 — explicit, opt-in, FREE native candidate acceptance.
# Does not merge, deploy, place blocks, modify production saves or run worldgen.
# Requires exact checked-out GitHub PR source, Node 22, Python Playwright + Chromium.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$ROOT"
ACTUAL_HEAD="$(git rev-parse HEAD)"
EXPECTED_HEAD="${MYTHWROUGHT_PACK2_EXPECT_HEAD:-$ACTUAL_HEAD}"
if [[ "$ACTUAL_HEAD" != "$EXPECTED_HEAD" ]]; then
  echo "REFUSED: expected Git HEAD $EXPECTED_HEAD, checked out $ACTUAL_HEAD" >&2
  exit 2
fi
if [[ -n "$(git status --porcelain -- src/block-packs/pack-2/ tests/block-packs/pack-2/)" ]]; then
  echo "REFUSED: Pack 2 worktree must match committed exact-head blobs" >&2
  exit 2
fi
echo "Pack 2 QA HEAD: $ACTUAL_HEAD"
echo "Running SIX real nested Node test suites (not the root npm test glob)..."
node --test tests/block-packs/pack-2/pack-2.test.mjs \
  tests/block-packs/pack-2/joinery.test.mjs \
  tests/block-packs/pack-2/ground.test.mjs \
  tests/block-packs/pack-2/infrastructure.test.mjs \
  tests/block-packs/pack-2/water.test.mjs \
  tests/block-packs/pack-2/acceptance.test.mjs
echo "Running EXTRA production-boundary suite against the REAL VoxelWorld graph..."
echo "A fixture facade is deliberately rejected by this suite."
node --test tests/block-packs/pack-2/production-boundary.test.mjs
echo "Running REAL local Chromium Canvas 2D candidate gallery..."
if ! python3 -c 'from playwright.sync_api import sync_playwright' >/dev/null 2>&1; then
  echo "REFUSED: free Python Playwright is not installed" >&2
  exit 2
fi
OUT="${MYTHWROUGHT_PACK2_SCREENSHOTS:-/tmp/mythwrought-pack2-gallery-$ACTUAL_HEAD}"
python3 tests/block-packs/pack-2/gallery-browser.py \
  --root "$ROOT" --expected-head "$ACTUAL_HEAD" --screenshots "$OUT"
echo "Completed exact-head candidate QA; authentic screenshots: $OUT"
echo "NOTE: this checks isolated Canvas2D candidates. Production WebGL2, fluid"
echo "simulation, save schema-1, offline PWA and physical iPhone remain unverified."
