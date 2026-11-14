#!/usr/bin/env python3
"""Pack 2 authentic Chromium QA without a local HTTP server or Node Playwright.

Run in an exact GitHub checkout:
    python3 tests/block-packs/pack-2/gallery-browser.py --screenshots /tmp/pack2-gallery

Requires free Python Playwright + Chromium. This inlines the committed original
ES modules with data: URLs because some sandboxes block localhost/file access.
It does NOT test production WebGL2, Safari, fluid simulation or real iPhone.
"""
from __future__ import annotations

import argparse
import base64
import json
import os
import shutil
import subprocess
from pathlib import Path

from playwright.sync_api import sync_playwright

ASSET_MODULES = (
    "definitions.mjs", "joinery.mjs", "ground.mjs",
    "infrastructure.mjs", "water.mjs",
)
VIEWPORTS = ((667, 375), (844, 390), (932, 430))
ALL_IDS = list(range(59, 77))
PIXEL_STATS_JS = """() => {
    const canvas=document.querySelector('#preview');
    const data=canvas.getContext('2d').getImageData(230,90,430,230).data;
    let h=2166136261, painted=0, translucent=0;
    for(let i=0;i<data.length;i+=4){
      if(data[i+3]>5)painted++;
      if(data[i+3]>5 && data[i+3]<250)translucent++;
      for(let j=0;j<4;j++)h=Math.imul(h^data[i+j],16777619);
    }
    return {hash:h>>>0,painted,translucent};
}"""


def as_module_url(source: str) -> str:
    data = base64.b64encode(source.encode("utf-8")).decode("ascii")
    return "data:text/javascript;base64," + data


def make_inline_html(root: Path) -> str:
    """Read actual checked-in sources; never synthesize or alter geometry data."""
    src = root / "src/block-packs/pack-2"
    tests = root / "tests/block-packs/pack-2"
    urls = {}
    for name in ASSET_MODULES:
        urls[name] = as_module_url((src / name).read_text(encoding="utf-8"))

    def rewrite_imports(body: str) -> str:
        for name, url in urls.items():
            original = "../../../src/block-packs/pack-2/" + name
            if ("'" + original + "'") not in body:
                raise AssertionError("Required source import missing: " + original)
            body = body.replace("'" + original + "'", "'" + url + "'")
        return body

    fixture = rewrite_imports((tests / "fixture.mjs").read_text(encoding="utf-8"))
    fixture_url = as_module_url(fixture)
    html = (tests / "preview.html").read_text(encoding="utf-8")
    html = rewrite_imports(html)
    if "'./fixture.mjs'" not in html:
        raise AssertionError("Missing exact fixture import in inspector")
    return html.replace("'./fixture.mjs'", "'" + fixture_url + "'")


def capture(page, output_dir: Path | None, basename: str) -> None:
    if output_dir is not None:
        page.locator("#preview").screenshot(path=str(output_dir / basename))


def verify(root: Path, screenshots: Path | None = None) -> list[dict]:
    if screenshots is not None:
        screenshots.mkdir(parents=True, exist_ok=True)
    html = make_inline_html(root)
    results = []
    with sync_playwright() as playwright:
        # Use Playwright's bundled browser when installed, or the available
        # free system Chromium. No network install/paid service required.
        bundled = Path(playwright.chromium.executable_path)
        chromium_bin = (os.environ.get("MYTHWROUGHT_PACK2_CHROMIUM")
                        or (str(bundled) if bundled.is_file() else None)
                        or shutil.which("chromium")
                        or shutil.which("chromium-browser"))
        if not chromium_bin:
            raise RuntimeError("No Chromium executable installed: provide "
                               "MYTHWROUGHT_PACK2_CHROMIUM or install Chromium")
        browser = playwright.chromium.launch(
            executable_path=chromium_bin,
            headless=True, args=["--no-sandbox", "--disable-dev-shm-usage"]
        )
        try:
            for width, height in VIEWPORTS:
                page = browser.new_page(viewport={"width": width, "height": height},
                                        device_scale_factor=1)
                errors: list[str] = []
                page.on("pageerror", lambda error: errors.append(str(error)))
                page.set_content(html, wait_until="load")
                page.wait_for_function(
                    "document.querySelectorAll('#asset option').length === 18",
                    timeout=20000,
                )
                all_ids = [int(o) for o in page.locator("#asset option").evaluate_all(
                    "(options) => options.map(option => option.value)"
                )]
                assert sorted(all_ids) == ALL_IDS, all_ids

                hashes: list[int] = []
                painted: list[int] = []
                for candidate_id in all_ids:
                    page.select_option("#asset", str(candidate_id))
                    choice = page.evaluate("window.pack2Fixture.selection()")
                    assert choice["id"] == candidate_id, choice
                    stat = page.evaluate(PIXEL_STATS_JS)
                    assert stat["painted"] > 150, (candidate_id, stat)
                    hashes.append(stat["hash"])
                    painted.append(stat["painted"])
                    capture(page, screenshots,
                            f"pack2-{candidate_id}-{width}x{height}.png")
                assert len(set(hashes)) == len(ALL_IDS), (
                    "Duplicate candidate preview hash", hashes
                )

                for candidate_id in (73, 74, 75):
                    page.select_option("#asset", str(candidate_id))
                    page.click("#variant")
                    page.click("#rotate")
                    assert page.evaluate("window.pack2Fixture.selection().rotation") == 1
                    page.click("#place")
                page.select_option("#asset", "76")
                page.click("#waterLevel")
                page.click("#waterFlow")
                state = page.evaluate("window.pack2Fixture.selection()")
                assert (state["id"], state["level"], state["flow"]) == (
                    76, 1, "north"
                ), state
                water_pixels = page.evaluate(PIXEL_STATS_JS)
                assert water_pixels["translucent"] > 200, water_pixels
                page.click("#place")
                snapshot = page.evaluate("window.pack2Fixture.serialize()")
                assert any(row[3] == 76 and len(row) == 7
                           for row in snapshot["cells"])

                fixture_test = page.evaluate("""() => {
                    const f=new window.pack2Fixture.constructor();
                    for(let id=59;id<=76;id++){
                      f.select(id);
                      if(!f.place([id-59,1,0]))return false;
                    }
                    const serial=f.serialize();
                    const saved=JSON.stringify(serial);
                    const roundtrip=f.constructor.restore(
                      JSON.parse(saved)).serialize();
                    return {rows:serial.cells.length,
                      exact:JSON.stringify(roundtrip)===saved};
                }""")
                assert fixture_test == {"rows": 18, "exact": True}, fixture_test

                overflow = page.evaluate(
                    "document.documentElement.scrollWidth - window.innerWidth"
                )
                assert overflow <= 4, (width, height, overflow)
                assert not errors, (width, height, errors)

                if screenshots is not None:
                    page.screenshot(
                        path=str(screenshots / f"pack2-water-full-{width}x{height}.png"),
                        full_page=True
                    )
                    capture(page, screenshots, f"pack2-water-{width}x{height}.png")
                    page.select_option("#asset", "66")
                    page.click("#hinge")
                    capture(page, screenshots, f"pack2-gate-open-{width}x{height}.png")
                    page.select_option("#asset", "74")
                    page.click("#variant")
                    capture(page, screenshots, f"pack2-parapet-slot-{width}x{height}.png")

                results.append({
                    "viewport": f"{width}x{height}",
                    "all_assets": len(all_ids),
                    "unique_candidate_hashes": len(set(hashes)),
                    "painted_pixel_min": min(painted),
                    "water_translucent_pixels": water_pixels["translucent"],
                    "fixture_records": fixture_test["rows"],
                    "snapshot_exact": fixture_test["exact"],
                    "page_errors": errors,
                })
                page.close()
        finally:
            browser.close()
    return results


def checkout_head(root: Path, expected: str | None) -> str | None:
    """Verify that a requested exact GitHub commit is actually checked out."""
    command = subprocess.run(
        ["git", "-C", str(root), "rev-parse", "HEAD"],
        capture_output=True, text=True, check=False
    )
    actual = command.stdout.strip() if command.returncode == 0 else None
    if expected is not None:
        if actual is None:
            raise AssertionError("Exact head requested but git checkout metadata is absent")
        if actual != expected:
            raise AssertionError(f"Wrong checkout: expected {expected}, got {actual}")
        changes = subprocess.run(
            ["git", "-C", str(root), "status", "--porcelain", "--",
             "src/block-packs/pack-2/", "tests/block-packs/pack-2/"],
            capture_output=True, text=True, check=True
        )
        if changes.stdout.strip():
            raise AssertionError("Uncommitted Pack 2 source/test changes invalidate exact-head QA")
    return actual


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--screenshots", type=Path)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[3])
    parser.add_argument("--expected-head", help="Require this exact Git HEAD and clean Pack 2 source")
    args = parser.parse_args()
    head = checkout_head(args.root, args.expected_head)
    result = verify(args.root, args.screenshots)
    print(json.dumps({"status": "PASS", "git_head": head,
                      "exact_head_verified": bool(args.expected_head),
                      "results": result}, indent=2))


if __name__ == "__main__":
    main()
