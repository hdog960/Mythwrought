# MYTHWROUGHT Builder D25 — original live:wood roof zones and safe overhead timber proposals

**Source-only, isolated, no approval for gameplay or structural capacity.** Parent exact isolated D23 HEAD `7396311339d0a950384b878259fa6485884c1485`. New branch `builder-d-d25-livewood-zones-isolated-20261122` (head SHA supplied by GitHub upon commit). Production main, protected PR #399/#402/#405, other developers, five automations, settlements and saves remain untouched. No merge/deploy.

## Engineering

D24's seven synthetic native tests are preserved as source/test files inside the actual 4B repository. D25 reads the **unchanged original** Wave16/17 `buildDistinctive4B` output. It independently enumerates live:wood Y7 weather-plane cells, walking navigation and Y2–6 occupancy, and discovers foundation-backed Y6 wall anchors only where every source course Y0–6 exists. D24's strict wall-only roof-distance output never counts an unverified timber joint as a grounded bearing.

D25 separately measures D19/D22 **hypothetical** center-contact proximity and, only in a *distinct conceptual third lane*, searches full original-wall-to-wall short spans at Y6 beneath actual authored live:wood Y7 roof cells. Candidate Pack2 ID61 beams must occupy real empty original Y6 locations, have uninterrupted original Y0–6 bearings at BOTH ends, never collide with original cells or D19/D22 beam locations, and stay bounded (default ≤10 spans, ≤72 beam cells, ≤12 air cells per span per building). These are **not** a substitute for physical testing of original Pack2-to-live-wood joint, player collision, material load data, or a rated truss; no world changes or Pack3 swap are made.

The method groups unresolved roof cells into real four-neighbor zones after hypothetical geometric additions and prints exact source counts for 16 structures. Long unbounded interior roof fields still require a separately engineered long-span live-wood support strategy or creator-approved architecture. No floor-to-roof pillars may invade navigation. No roof load capacity is invented from 8-cell planning radius or 48-cell observed distance.

## Source provenance and test plan

New native Node 22 synthetic D24+D25 tests execute locally. Focused source-authentic D25 tests import exact genuine Wave16/17, D19, D22, and D23 modules and demand exact D23 16-building counts (`115894` Y7 live:wood roof, `107819` open+walk columns, `6273` original wall anchors, `181` old spans, `1270` old beam cells, `56449` hypothetical within radius 8, `59445` beyond) with zero legal full-height piers. The original test requires the complete repository; it cannot run locally from this small handoff tree.

The dedicated push-only GitHub Actions job checks literal original parent plus original blob IDs, performs **one** focused native D24/D25 source run and **one** targeted W14–17/D19–23 native compatibility pass. It does not dispatch broad CI, install browsers, capture WebGL2 evidence, modify releases, merge, deploy, cancel or rerun other jobs. Report real log status, never substitute V8 for Node. Mandatory full 3644 D4 comparisons, all 285 owners (132 provisional), actual Pack1–5 physics/picking, game WebGL2 and installed iPhone Home Screen PWA acceptance remain outstanding; no release gate was weakened.
