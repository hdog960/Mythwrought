#!/usr/bin/env python3
"""Validate source-exact Pack 3 Canvas2D Chromium evidence; never claim live WebGL2."""
import hashlib
import json
import re
import sys
from pathlib import Path
from PIL import Image

root = Path(sys.argv[1]).resolve()
head = sys.argv[2]
assert re.fullmatch(r"[0-9a-f]{40}", head), "Missing source-pinned PR SHA"
assert (root / "verified-candidate-head.txt").read_text().strip() == head
sizes = ("667x375", "844x390", "932x430")
angles = (0, 90, 180, 270)
files = []
for size in sizes:
    files.extend([root / "gallery" / f"pack3-review-{size}.png",
                  root / "contact-sheets" / f"pack3-all-angles-{size}.png"])
for name, stem in (("roof", "pack3-roof-assembly"),
                   ("ridge", "pack3-ridge-assembly"),
                   ("fortress", "pack3-fortification"),
                   ("aqueduct", "pack3-aqueduct")):
    for size in sizes:
        for yaw in angles:
            files.append(root / name / f"{stem}-{size}-yaw{yaw}.png")

assert len(files) == 54, len(files)
observed = sorted(root.rglob("*.png"))
assert observed == sorted(files), "Missing or unexpected candidate PNG files"
images = []
for path in files:
    data = path.read_bytes()
    assert data.startswith(b"\x89PNG\r\n\x1a\n"), f"Not authentic PNG bytes: {path}"
    with Image.open(path) as im:
        im.verify()
    with Image.open(path) as im:
        width, height = im.size
        if path.parent.name in ("roof", "ridge", "fortress", "aqueduct"):
            assert (width, height) == (960, 540), f"Wrong assembly dimensions: {path}"
        elif path.parent.name == "contact-sheets":
            assert (width, height) == (1196, 3119), f"Wrong matrix dimensions: {path}"
        else:
            css = re.search(r"(667x375|844x390|932x430)", path.name).group(1)
            w, h = map(int, css.split("x"))
            assert width == w and height >= h, f"Wrong gallery dimensions: {path}"
        colors = len(set(im.convert("RGB").resize((40, 30)).getdata()))
        assert colors >= 8, f"Blank or near-uniform screenshot: {path}"
    images.append({"path": str(path.relative_to(root)), "sha256": hashlib.sha256(data).hexdigest(),
                   "bytes": len(data), "width": width, "height": height, "sampleColors": colors})

matrix = json.loads((root / "contact-sheets" / "proof.json").read_text())
assert "Chromium Canvas2D" in matrix["engine"] and "NOT live WebGL2" in matrix["engine"]
samples = matrix["samples"]
assert set(samples) == set(sizes)
for size in sizes:
    entry = samples[size]
    assert set(entry) == set(map(str, range(109, 126))), f"Missing candidate in {size}"
    for candidate in range(109, 126):
        hashes = entry[str(candidate)]
        assert len(hashes) == (1 if candidate <= 112 else 4), (size, candidate)
        assert all(re.fullmatch(r"[0-9a-f]{64}", h) for h in hashes)
assert samples[sizes[0]] == samples[sizes[1]] == samples[sizes[2]], "Candidate render drift across viewport sizes"
assert len({samples[sizes[0]][str(i)][0] for i in range(109, 126)}) == 17, "Duplicate initial candidates"

for name, stem in (("roof", "pack3-roof-assembly"), ("ridge", "pack3-ridge-assembly"),
                   ("fortress", "pack3-fortification"), ("aqueduct", "pack3-aqueduct")):
    proof = json.loads((root / name / "proof.json").read_text())
    scenes = proof["scenes"]
    assert len(scenes) == 12, f"Expected 12 {name} scenes"
    per_size = {size: {} for size in sizes}
    for scene in scenes:
        size = scene["viewport"]
        yaw = scene["yaw"]
        assert size in per_size and yaw in range(4), (name, scene)
        expected = root / name / f"{stem}-{size}-yaw{yaw*90}.png"
        assert expected.exists(), expected
        digest = hashlib.sha256(expected.read_bytes()).hexdigest()
        assert digest == scene["hash"], f"Scene proof differs from PNG: {expected}"
        assert yaw not in per_size[size], f"Duplicate yaw in {name}"
        per_size[size][yaw] = digest
    reference = per_size[sizes[0]]
    assert len(reference) == 4 and len(set(reference.values())) == 4, f"Missing distinct {name} angles"
    assert all(per_size[size] == reference for size in sizes), f"{name} viewport pixel drift"

report = {
    "status": "CANDIDATE_CANVAS2D_CHROMIUM_PASS",
    "candidatePR": 112,
    "candidateCommit": head,
    "candidateIDs": list(range(109, 126)),
    "viewportCSS": list(sizes),
    "sourceExactIndividualFramesPerViewport": 56,
    "supportedIndividualFrameTotal": 168,
    "sourceExactAssemblyScreenshots": 48,
    "contactSheets": 3,
    "galleryScreenshots": 3,
    "screenshotCount": len(images),
    "renderer": "genuine Chromium Canvas2D using unregistered candidate geometry",
    "productionWebGL2AssetApproval": False,
    "physicalIPhoneReview": False,
    "creatorArtApproval": False,
    "gateAApproved": False,
    "v011Unlocked": False,
    "images": images,
}
(root / "evidence.json").write_text(json.dumps(report, indent=2) + "\n")
print(f"PASS exact-head {head}: 17 IDs, 56 angles x 3 viewports, "
      f"48 authentic assembled scenes, {len(images)} PNGs; Canvas2D only.")
