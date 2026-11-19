// Manual four-biome M0/M1 acceptance gate. Root-level npm test includes
// this file, so a generic green full-game CI cannot silently skip the
// preserved candidate or the new authoritative profile/save regressions.
import './surface-regions/regions.test.mjs';
import './surface-regions/relief-profiles.test.mjs';
import './surface-regions/geological-bands.test.mjs';
import './surface-regions/multichunk-acceptance.test.mjs';
import './surface-regions/edit-persistence-acceptance.test.mjs';
import './surface-regions/four-region-engine-acceptance.test.mjs';
import './manual-biomes/profile-world.test.mjs';
