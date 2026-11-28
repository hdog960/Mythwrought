# Camera timestamp validation priority

Source-only camera auditor now rejects nonmonotonic timestamps and missing intervals before classifying a frame as camera lag. Keeps the historical maxJerk acceleration limit and midpoint acceleration calculation. Eight deterministic tests cover duplicate/decreasing timestamps, gaps, 30/60/120 FPS, valid lag and camera/player time misalignment. This does not hook the production camera or certify iPhone/WebGL2 behavior.
