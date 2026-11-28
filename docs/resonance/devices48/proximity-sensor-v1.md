# :48 D2 proximity sensor preview v1

Source-only opt-in proximity sensing, not a game actor, collider, raycast, real inventory or renderer. `stepProximitySensor(previous,input)` consumes caller-supplied distance (0–256) and an **observed** binary grant, never a :36-authoritative delivery receipt. It tracks detection with enter/exit hysteresis and 1–16 consecutive observations. A lost grant immediately blanks `output` while retaining the detected observation. Caller must supply one sequential tick per invocation; identity and configuration are immutable across ticks.

`output` is advisory preview data only. Every result has `activationAuthorized=false`, `authoritativeDelivery=false`, `productionBound=false`; it may not move a gate/lift or bypass real collision or save ownership. No block IDs, production registration, player-build edits or settlement work.

The inherited CI failure in workflow 45051448632 was five `untrusted lift history` failures because the test fixture omitted mandatory `productionBound:false`; the fixture was repaired on this new isolated branch, leaving the strict production-boundary assertion unchanged.

Local standalone equivalent proximity tests: 10/10 passed on Node; committed-head tests and GitHub Actions remain separate gates. Real iPhone WebGL2, :36 contract authentication and actor integration remain pending.
