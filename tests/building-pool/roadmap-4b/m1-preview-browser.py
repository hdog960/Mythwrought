#!/usr/bin/env python3
"""Independent real Chromium WebGL2 cube-proxy audit for Builder 4B M1.
Must be explicitly run against exact checked-out PR HEAD; not part of root smoke.
Does NOT prove physical-family geometry, live registration or iPhone performance.
"""
import argparse
import hashlib
import json
from pathlib import Path
from urllib.parse import urlencode
from playwright.sync_api import sync_playwright

VIEWPORTS = ((667, 375), (844, 390), (932, 430))
TYPES = ("healers-house", "library", "schoolhouse",
         "magical-research-institute", "arcane-academy")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--base", default="http://127.0.0.1:4173")
    parser.add_argument("--out", default="/tmp/mythwrought-4b-m1-cube-webgl2")
    args = parser.parse_args()
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    repo = Path(__file__).resolve().parents[3]
    source = repo / "src/building-pool/roadmap-4b/m1-exemplars.mjs"
    digest = hashlib.sha256(source.read_bytes()).hexdigest()
    report = {
        "sourceSha256": digest,
        "renderer": "genuine Chromium WebGL2 with cube-proxy coordinates",
        "physicalFamilyMeshes": False, "physicalIphone": False,
        "gameRuntime": False, "captures": []
    }
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=[
            "--use-gl=angle", "--use-angle=swiftshader", "--enable-webgl",
            "--disable-web-security"
        ])
        try:
            for width, height in VIEWPORTS:
                page = browser.new_page(viewport={"width": width, "height": height},
                                        device_scale_factor=1)
                for i, label in enumerate(TYPES):
                    for view in ("exterior", "section"):
                        url = (args.base.rstrip("/") +
                            "/tests/building-pool/roadmap-4b/m1-preview.html?" +
                            urlencode({"index": i, "view": view}))
                        page.goto(url, wait_until="load")
                        page.wait_for_function("window.__m1Preview?.ready === true",
                                               timeout=15000)
                        evidence = page.evaluate("window.__m1Preview")
                        assert evidence["renderer"] == "genuine-webgl2-cube-proxy"
                        assert evidence["type"] == label
                        assert evidence["glError"] == 0
                        assert not evidence["contextLost"]
                        assert evidence["triangles"] > 300
                        assert evidence["drawCalls"] == 1
                        assert evidence["width"] == width
                        assert evidence["height"] == height
                        fn = f"4b-{i}-{label}-{view}-{width}x{height}.png"
                        page.screenshot(path=str(out / fn))
                        report["captures"].append({**evidence, "png": fn})
                page.close()
        finally:
            browser.close()
    report["allPassed"] = len(report["captures"]) == len(VIEWPORTS)*len(TYPES)*2
    (out / "source-exact-report.json").write_text(json.dumps(report, indent=2)+"\n")
    assert report["allPassed"]
    print(f"{len(report['captures'])}/30 actual Chromium WebGL2 cube-proxy captures PASS, "
          f"source SHA256 {digest}; no live/physical-iPhone claim")

if __name__ == "__main__":
    main()
