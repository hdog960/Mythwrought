#!/usr/bin/env python3
"""Opt-in Chromium QA for original Pack 3 candidate gallery, not production WebGL.

Requires Python Playwright + local Chromium. No network, game-state or save writes.
Run: python tests/block-packs/pack-3/gallery-browser.py
Optional: PACK3_SCREENSHOT_DIR=/tmp/screens python .../gallery-browser.py
"""
import asyncio
import json
import os
from pathlib import Path
import re

from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[3] / "src/block-packs/pack-3"
MODULES = [
    ("roofing-materials.mjs", ["PACK3_ROOFING_ASSETS"]),
    ("roof-geometry.mjs", ["PACK3_ROOF_GEOMETRY", "pack3GeometryById"]),
    ("fortified-pieces.mjs", ["PACK3_FORTIFIED_ASSETS", "pack3FortifiedById"]),
    ("ornamental-pieces.mjs", ["PACK3_ORNAMENTAL_ASSETS", "pack3OrnamentalById"]),
    ("monumental-pieces.mjs", ["PACK3_MONUMENTAL_ASSETS", "pack3MonumentalById"]),
]

def source_gallery():
    html = (ROOT / "preview.html").read_text()
    modules = []
    for filename, names in MODULES:
        code = (ROOT / filename).read_text()
        if re.search(r"^import\s", code, re.M):
            raise AssertionError(f"Unexpected import in {filename}")
        code = re.sub(r"^export\s+", "", code, flags=re.M)
        bindings = ",".join(names)
        modules.append(f"const {{{bindings}}}=(()=>{{\n{code}\nreturn {{{bindings}}};\n}})();")
    html = html.replace('<script type="module">', '<script>', 1)
    html = re.sub(r"^import\s+[^;]+;\s*\n", "", html, flags=re.M)
    return html.replace("<script>", "<script>\n" + "\n".join(modules), 1)

HASHES = r"""() => [...document.querySelectorAll('main article')].map(card => {
  const c=card.querySelector('canvas');
  const data=c.getContext('2d').getImageData(0,0,c.width,c.height).data;
  let h=2166136261,paint=0,colors=new Set();
  for(let i=0;i<data.length;i+=4){
    h=Math.imul(h^data[i],16777619);
    h=Math.imul(h^data[i+1],16777619);
    h=Math.imul(h^data[i+2],16777619);
    colors.add((data[i]<<16)|(data[i+1]<<8)|data[i+2]);
    if(Math.abs(data[i]-21)+Math.abs(data[i+1]-33)+Math.abs(data[i+2]-42)>25)paint++;
  }
  return {id:Number(card.querySelector('small').textContent.match(/ID (\d+)/)[1]),
    hash:(h>>>0).toString(16),colors:colors.size,paint};
})"""

async def verify():
    output = os.environ.get("PACK3_SCREENSHOT_DIR")
    if output:
        Path(output).mkdir(parents=True, exist_ok=True)
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            executable_path=os.environ.get("PACK3_CHROMIUM", "/usr/bin/chromium"),
            headless=True, args=["--no-sandbox", "--disable-dev-shm-usage"])
        print("Chromium", browser.version)
        for w,h in [(667,375),(844,390),(932,430)]:
            page=await browser.new_page(viewport={"width":w,"height":h})
            errors=[]
            page.on("pageerror", lambda e: errors.append(str(e)))
            page.on("console", lambda m: errors.append(m.text) if m.type=="error" else None)
            await page.set_content(source_gallery(), wait_until="load")
            await page.wait_for_function("document.querySelectorAll('main article').length===17")
            assert await page.locator("main article").count()==17
            assert await page.get_by_role("button",name="Rotate 90°").count()==13
            initial=await page.evaluate(HASHES)
            assert [a["id"] for a in initial]==list(range(109,126))
            assert len({a["hash"] for a in initial})==17, "Duplicate asset pixels"
            assert min(a["colors"] for a in initial)>15
            assert min(a["paint"] for a in initial)>250
            variations={}
            for index,id in enumerate(range(113,126),start=4):
                button=page.locator("main article").nth(index).locator("button")
                before=(await page.evaluate(HASHES))[index]["hash"]
                hashes=[before]
                for rotation in (1,2,3,0):
                    await button.click()
                    assert f"orientation {rotation}" in await button.inner_text()
                    hashes.append((await page.evaluate(HASHES))[index]["hash"])
                assert hashes[-1]==before, f"Four-turn pixel reset mismatch {id}"
                variations[id]=len(set(hashes))
            for id in (113,114,116,118,121,123,125):
                assert variations[id]>1, f"Directional candidate {id} did not change"
            assert not errors, errors
            if output:
                await page.locator("main article").nth(12).locator("button").click()
                await page.screenshot(path=str(Path(output)/f"pack3-review-{w}x{h}.png"),full_page=True)
            print(json.dumps({"viewport":f"{w}x{h}","uniqueImageHashes":17,
                "rotationControls":13,"fourTurnReset":True,"directionalShapesChanged":7,
                "minPaintedPixels":min(a["paint"] for a in initial),
                "errors":len(errors)}))
            await page.close()
        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify())
