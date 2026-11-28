# N2 bounded wireless spatial candidate search — 2026-11-23

Source-only, opt-in candidate stacked on draft PR #479 at exact parent a0d966406722202f69374b87bb5bef343e7ccf12. This adds a pure deterministic broad-phase spatial enumerator; it does NOT replace or edit the existing wireless-links module. One energy type: Resonance.

Inputs are loaded, unique, integer-position transmitters/endpoints with finite radius. Cells are maxRadius+1 wide; all endpoints within transmitter radius must lie in its own or one of 26 adjacent cells. Every candidate receives exact Euclidean squared-distance filtering. Results are sorted by IDs independent of input order. The maxComparisons ceiling throws before returning partial links; callers must fail closed rather than apply incomplete power allocation. Up to 4096 descriptors; no world, renderer, block registry or save writes.

Important limits: this is an independent broad-phase contract, NOT authenticated integration with wireless-links, the :24 generator power contract, :48 transmitter power gating, chunk provenance or active network allocation. Adversarial dense clusters can exceed the comparison budget and must remain disconnected safely. Per-tick incremental work, exact-head native tests, WebGL2, offline saves and real iPhone acceptance are not proven. No merges or deployments authorized.
