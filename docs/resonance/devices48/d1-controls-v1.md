# Resonance :48 D1 — deterministic controls v1

Source-only opt-in fixture, not production-registered. `stepDeviceControls(previous, frame)` accepts a world ID, monotonically increasing integer tick, up to 32 explicitly supplied device definitions and 32 actions. Lever `toggle` and button `press` drive candidate lamp requests. Buttons remain active for an explicit bounded number of simulation ticks (1–120). Device IDs and output ordering are deterministic. Duplicate IDs/actions, missing controls, type changes, malformed frames and replayed ticks fail closed.

All lamp outputs set `energized:false`, `authority:'candidate-only'`, with `authoritativeDelivery:false` and `productionBound:false`. Requested energy is **not** a grant or a :36 delivered-energy receipt. Do not use this module to actuate game lamps, move actors, alter collision, edit blocks, register block IDs, change saves, or claim rendered visual evidence. This module introduces no inventory or settlement work.

Next integration dependency: consume a SHA-pinned authoritative :36 delivery receipt and approved existing lamp assets, through a separate owner-reviewed adapter. Production main, offline PWA, schema-1 saves, and mobile control rails remain untouched.

Local equivalent Node test run on 2026-11-21: four cases passed. Committed exact-head tests and genuine three-size WebGL2 captures require separate verification.
