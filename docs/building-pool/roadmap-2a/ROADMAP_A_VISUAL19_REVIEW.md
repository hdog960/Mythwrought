# Roadmap A Visual19 — reversible original-source skyline review, NO production
Protected parent PR #314 exact HEAD `c626cc54419db7866fe410d2481fda293aed6dd8`.

## Purpose
Real Chromium screenshots for the first 19 new 2A commerce sources in PR #302 passed technically (114 real images) but manual visual review identified repetitive low roof silhouettes. **Do not treat repainting a cube proxy as a fix**. This child draft creates **19 additive, alternative source geometry models**: six distinct high rooftop architectures (needle observation spire, paired belvederes, courtyard crenellations, diagonal clerestory ridge, offset belfry, true roof sawtooth). Each is built ONLY on occupied roof cells from its original source, with every raised column vertically connected to an unchanged original authored roof column. Courtyard voids, entrance, interior rooms, original walls, windows, roof plates and original source voxels are immutable. Styles are repeated across biomes in different spatial envelopes; every candidate has actual +Y skyline geometry.

## Source acceptance gates
The new native test checks all original integer voxel objects remain deep-equal, no new nonroof solid, zero unsupported vertical roof cells, zero sky-open courtyard fill, minimum 32 distinct rooftop anchor columns per model, >=6 additional height cells, no duplicate coordinates, complete source schema, and only unapproved alternatives. The original 19 approved-for-source-only designs in Wave01/02 are retained untouched; this is a **different possible art direction**, NOT silent replacement or a new block ID.

Pending: exact-head native/full CI, genuine 114 Chromium WebGL2 screenshots at three iPhone landscape sizes, independent CRC/PNG dimensions/SHA/frame review, measurable 19 silhouette comparison to original baseline real artifact #14674857885, final real Pack family meshes with load path/weather/door/window physical mounting, live gameplay, creator/iPhone confirmation. The screenshot renderer still shows source-coordinate proxy cubes, not actual Pack partial shapes.

NO merge, deployment, production registration, schema-1 saves, old blueprint/auto builder changes or automation edit.
