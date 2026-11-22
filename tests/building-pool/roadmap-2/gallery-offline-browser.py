#!/usr/bin/env python3
"""Standalone genuine Chromium Canvas2D QA with zero HTTP/network requests."""
from pathlib import Path
from hashlib import sha256
import os
import re
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[3]
OUT=Path(os.getenv("MYTHWROUGHT_R2_SHOTS",str(ROOT/"screenshots")))
OUT.mkdir(parents=True,exist_ok=True)
SRC=ROOT/"src/building-pool/roadmap-2"
PRE=ROOT/"tests/building-pool/roadmap-2"
PARTS=[]
for path in (SRC/"catalog.mjs",SRC/"schema.mjs",SRC/"temperate-store.mjs",PRE/"preview.mjs"):
    code=path.read_text()
    code=re.sub(r'^import [^\n]+\n','',code,flags=re.M)
    code=re.sub(r'^export ','',code,flags=re.M)
    if path.name=="preview.mjs":
        code='const bp=TEMPERATE_SMALL_GENERAL_STORE;\n'+code
    PARTS.append(code)
SCRIPT="\n".join(PARTS)
HTML=re.sub(r'<script type="module" src="./preview.mjs"></script>',"", (PRE/"preview.html").read_text())
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path=os.environ.get("CHROMIUM_BIN","/usr/bin/chromium"),args=["--no-sandbox","--disable-dev-shm-usage","--use-gl=swiftshader"])
    try:
        for w,h in [(667,375),(844,390),(932,430)]:
            page=browser.new_page(viewport={"width":w,"height":h},device_scale_factor=1)
            errors=[]
            page.on("pageerror",lambda e: errors.append(str(e)))
            # about:blank set_content avoids blocked localhost/remote navigation.
            page.set_content(HTML)
            page.add_script_tag(content=SCRIPT)
            page.wait_for_function('document.documentElement.dataset.ready === "true"',timeout=6000)
            if errors: raise RuntimeError("Browser JS exception: "+repr(errors))
            assert "685" in page.locator("#status").inner_text()
            assert page.locator("canvas").count()==2
            shot=OUT/f"roadmap2-composite-{w}x{h}.png"
            page.screenshot(path=str(shot),full_page=False)
            for name in ("external","inside"):
                canvas=page.locator("#"+name)
                assert canvas.evaluate("(el)=>el.width>50&&el.height>50")
                canvas.screenshot(path=str(OUT/f"roadmap2-{name}-{w}x{h}.png"))
            print(f"CHROMIUM CAPTURED viewport {w}x{h} two canvases sha256={sha256(shot.read_bytes()).hexdigest()}")
            page.close()
    finally:
        browser.close()
print("Nine authentic screenshots (three full frames + six canvases); manual visual review still required; NO production WebGL2 claim.")
