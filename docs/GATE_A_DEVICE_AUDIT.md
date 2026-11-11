# MYTHWROUGHT — Foundation Gate A device audit (OPEN)
Status: **manual validation protocol, not a passing hardware or art approval**. Continue v0.09 engineering foundation while v0.10 Gate A is open.

## New read-only v0.10 evidence feature
In the landscape game, open **☰ → GATE A · DEVICE CHECK → RUN DEVICE CHECK**. The report samples recent foreground gameplay frame intervals (up to 360), viewport/controller geometry, WebGL chunk count and whether the current world matches a readable saved snapshot. It performs one round-trip with a newly named **temporary unrelated localStorage key** and removes that key; it **does not edit or repair** world saves, journals, backups, world chunks or user settings. Browser storage quotas are estimates, not permanence guarantees. A browser screenshot is not an actual iPhone test. Copy the report manually if you wish to share it. No report is sent to any server or stored in a world save.

## Player-owned real device verification checklist
Test **Safari** and separately test **Add to Home Screen** at https://hdog960.github.io/Mythwrought/:
1. Open landscape, check central viewport is completely unobstructed, notch and safe areas do not clip grips or footer. Use both thumbs at once for movement, look, jump, MINE/PLACE; verify horizontal controls are intuitive and the help menu scrolls.
2. Play 10+ minutes across several chunk seams and multiple edits. Run the device check *after active gameplay*, copy results, note thermal feel, pauses, browser reloads, rendering glitches and frame timing. Compare landscape sizes and large-controller setting. Rough software-reported FPS is **not** a certified iPhone benchmark.
3. Save, export JSON, close/force-quit Safari, reopen and inspect the same edits and selected seed. Repeat in installed Home Screen mode; check what is and is not retained after app switching and orientation changes. Export again. Do **not** clear site data before obtaining your backup.
4. Check damaged-save protection using a **separate disposable test seed only**, never by manually corrupting a valued real save. Verify the app cannot silently erase an unreadable slot, and that it lets you choose another seed or import a previously exported backup. Current IndexedDB transactional migration is **not implemented**.
5. Review actual world artwork, materials, atmosphere, animation and eventual character/cave art. Mark art **unapproved** until an explicit personal visual review approves it. Current landscape is prototype engineering art, not a final premium fantasy biome.
6. Document airplane/offline behavior but do not claim offline support: a service worker and validated offline caching are future milestones. Browser storage eviction, low-memory termination and real-iPhone thermal limits remain risks.

## Gate decision
**Gate A stays OPEN** until actual iPhone Safari and installed Home Screen control/save/performance evidence is collected, production-scale save durability is addressed, and the required visual acceptance is explicitly granted. The automated Chromium test is useful regression evidence, never a substitute for this manual verification. Do not promote v0.10 or unlock v0.11 by counting this document as a passing device test.
