// Real M5 fog and walking invariants: included in full repository npm test.
// The long-distance travel hard gate is a separate workflow and MUST fail
// honestly if any distant natural biome cannot be walked to.
import './manual-biomes/m5-natural-overland.test.mjs';

// Experimental immutable v5 switchback is independently gated and never
// changes the accepted default v4 fresh-world baseline.
import './manual-biomes/m5-mountain-pass-v5.test.mjs';
