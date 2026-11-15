#!/usr/bin/env python3
"""Optional source-exact multi-angle Pack 3 creator evidence (not production WebGL).

Requires local Chromium, Python Playwright and Pillow. Captures real Chromium canvas
pixels for each supported candidate/rotation and arranges an inspectable contact sheet.
No network, saves, runtime registry, production filesystem or game-state mutation.

PACK3_MATRIX_DIR=/tmp/pack3-review python tests/block-packs/pack-3/creator-review-matrix.py
"""
import asyncio
import base64
import hashlib
import importlib.util
import io
import json
import os
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from playwright.async_api import async_playwright

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("pack3_gallery", HERE / "gallery-browser.py")
gallery = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gallery)

SIZES = [(667, 375), (844, 390), (932, 430)]
BACK = "#17212a"
TEXT = "#f5e8cf"
SUB = "#ceb99b"


def font(size, bold=False):
    names = ["/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else
             "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"]
    for name in names:
        if Path(name).exists():
            return ImageFont.truetype(name, size)
    return ImageFont.load_default()


async def run():
    dest = Path(os.environ.get("PACK3_MATRIX_DIR", str(Path.cwd() / "pack3-review-matrix")))
    dest.mkdir(parents=True, exist_ok=True)
    hashes = {}
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            executable_path=os.environ.get("PACK3_CHROMIUM", "/usr/bin/chromium"),
            headless=True, args=["--no-sandbox", "--disable-dev-shm-usage"])
        for width, height in SIZES:
            page = await browser.new_page(viewport={"width": width, "height": height})
            js_errors = []
            page.on("pageerror", lambda e: js_errors.append(str(e)))
            page.on("console", lambda m: js_errors.append(m.text) if m.type == "error" else None)
            await page.set_content(gallery.source_gallery(), wait_until="load")
            cards = page.locator("main article")
            assert await cards.count() == 17
            image_data = {}
            for index, aid in enumerate(range(109, 126)):
                card = cards.nth(index)
                name = (await card.locator("h2").inner_text()).strip()
                screenshot = base64.b64decode(await card.locator("canvas").evaluate("(c) => c.toDataURL('image/png').split(',')[1]"))
                assert screenshot[:8] == b"\x89PNG\r\n\x1a\n"
                images = [Image.open(io.BytesIO(screenshot)).convert("RGB")]
                digest = [hashlib.sha256(screenshot).hexdigest()]
                if aid >= 113:
                    button = card.locator("button")
                    for turn in (1, 2, 3, 0):
                        await button.click()
                        assert f"orientation {turn}" in await button.inner_text(), (aid,turn)
                        png = base64.b64decode(await card.locator("canvas").evaluate("(c) => c.toDataURL('image/png').split(',')[1]"))
                        assert png[:8] == b"\x89PNG\r\n\x1a\n"
                        if turn:
                            images.append(Image.open(io.BytesIO(png)).convert("RGB"))
                            digest.append(hashlib.sha256(png).hexdigest())
                        else:
                            assert png == screenshot, f"Four-turn exact PNG reset failed: ID {aid}"
                image_data[aid] = {"name": name, "images":images,"sha256":digest}
            assert len(image_data)==17
            assert sum(len(v["images"]) for v in image_data.values())==56
            assert len({v["sha256"][0] for v in image_data.values()})==17
            assert not js_errors, js_errors
            # Rows: 4 flat roofing materials, then 13 rotated geometry families.
            row_height=212; col_width=289; left=20; top=115
            sheet=Image.new("RGB",(left+col_width*4+20,top+row_height*14+36),BACK)
            d=ImageDraw.Draw(sheet)
            f_header=font(25,True);f_t=font(14,True);f_sm=font(12)
            d.text((20,14),"MYTHWROUGHT · PACK 3 PHYSICAL CANDIDATE REVIEW",fill=TEXT,font=f_header)
            d.text((20,54),f"Actual Chromium Canvas2D source geometry | {width}×{height} CSS viewport | UNMERGED / NOT IN GAME",fill=SUB,font=f_sm)
            d.text((20,73),"Flat roofing row: four materials. Remaining rows: yaw 0° / 90° / 180° / 270°.",fill=SUB,font=f_sm)
            for j,aid in enumerate(range(109,113)):
                x=left+j*col_width;y=top
                frame=image_data[aid]["images"][0].resize((264,165),Image.Resampling.LANCZOS)
                sheet.paste(frame,(x,y+29))
                d.text((x,y+5),f"{aid} · {image_data[aid]['name'][:28]}",font=f_t,fill=TEXT)
            for r,aid in enumerate(range(113,126),start=1):
                y=top+r*row_height
                for angle in range(4):
                    x=left+angle*col_width
                    frame=image_data[aid]["images"][angle].resize((264,165),Image.Resampling.LANCZOS)
                    sheet.paste(frame,(x,y+29))
                    d.text((x,y+5),f"{aid} · yaw {angle*90}°"+(f" · {image_data[aid]['name'][:16]}" if angle==0 else ""),fill=TEXT,font=f_t)
            destfile=dest/f"pack3-all-angles-{width}x{height}.png"
            sheet.save(destfile,optimize=True)
            hashes[str(width)+'x'+str(height)]={str(i):v['sha256'] for i,v in image_data.items()}
            print(json.dumps({"viewport":f"{width}x{height}","ids":17,"frames":56,"rotatable":13,"distinctInitialRenders":17,"resetExact":13,"consoleErrors":len(js_errors),"contactSheet":str(destfile),"bytes":destfile.stat().st_size}))
            await page.close()
        await browser.close()
    (dest/"proof.json").write_text(json.dumps({"engine":"Chromium Canvas2D (NOT live WebGL2)","samples":hashes},indent=2))
    # Canvas pixels should not depend on the host viewport for the same exact source.
    v=list(hashes.values())
    assert v[0]==v[1]==v[2],"Canvas pixel hashes drifted between viewports"
    print("Verified 56 source geometry frames × three viewport sizes; hashes stable across viewports.")

if __name__=="__main__":
    asyncio.run(run())
