#!/usr/bin/env python3
"""Roadmap 2-only genuine Chromium screenshots; NO game WebGL2 certification."""
from pathlib import Path
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from functools import partial
from threading import Thread
import os
import struct
import tempfile

REPO_ROOT = Path(__file__).resolve().parents[3]
PAGE = "tests/building-pool/roadmap-2/preview.html"
SIZES = ((667, 375), (844, 390), (932, 430))

def png_dimensions(path):
    with open(path, "rb") as file:
        header = file.read(24)
    if header[:8] != b"\x89PNG\r\n\x1a\n":
        raise AssertionError("Screenshot is not a PNG: " + str(path))
    return struct.unpack(">II", header[16:24])

def main():
    try:
        from playwright.sync_api import sync_playwright
    except ImportError as exc:
        raise SystemExit("BLOCKED: install free Python Playwright before browser QA") from exc
    output = Path(os.environ.get("MYTHWROUGHT_R2_SHOTS", tempfile.mkdtemp(prefix="mythwrought-r2-")))
    output.mkdir(parents=True, exist_ok=True)
    handler = partial(SimpleHTTPRequestHandler, directory=str(REPO_ROOT))
    server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
    thread = Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        with sync_playwright() as p:
            binary = os.environ.get("CHROMIUM_BIN")
            options = {"headless": True, "args": ["--no-sandbox", "--disable-dev-shm-usage", "--use-gl=swiftshader"]}
            if binary:
                options["executable_path"] = binary
            browser = p.chromium.launch(timeout=12000, **options)
            try:
                for width, height in SIZES:
                    page = browser.new_page(viewport={"width": width, "height": height}, device_scale_factor=1)
                    page.goto(f"http://127.0.0.1:{server.server_port}/{PAGE}", wait_until="networkidle", timeout=15000)
                    page.wait_for_function('document.documentElement.dataset.ready === "true"', timeout=10000)
                    status = page.locator("#status").inner_text()
                    if "685" not in status or "NOT game WebGL2" not in status:
                        raise AssertionError("Unverified preview status: " + status)
                    for canvas in ("external", "inside"):
                        path = output / f"r2-m0-{canvas}-{width}x{height}.png"
                        page.locator(f"#{canvas}").screenshot(path=str(path))
                        actual = png_dimensions(path)
                        if min(actual) <= 0 or path.stat().st_size < 500:
                            raise AssertionError("Empty actual screenshot: " + str(path))
                        print(f"CAPTURED {canvas} {width}x{height} canvas={actual} file={path}")
                    page.close()
            finally:
                browser.close()
    finally:
        server.shutdown()
        server.server_close()
    print("Six authentic canvas images captured, but visual review is STILL REQUIRED and not a WebGL2 test.")

if __name__ == "__main__":
    main()
