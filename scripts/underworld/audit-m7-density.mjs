// Usage: node scripts/underworld/audit-m7-density.mjs [seed [columnsPerSide]]
// Reads real M7 new-world natural voxels; never calls world.set/save or browser code.
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR} from '../../src/manual-biomes/profile-world.mjs';
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import {measureNaturalCaveDensity} from '../../src/living-underworld/density-audit.mjs';
const seed=process.argv[2]===undefined?179:Number(process.argv[2]);
const columnsPerSide=process.argv[3]===undefined?8:Number(process.argv[3]);
if(!Number.isSafeInteger(seed)||seed!==(seed|0)||!Number.isInteger(columnsPerSide)||columnsPerSide<1||columnsPerSide>32)
  throw Error('Usage: node scripts/underworld/audit-m7-density.mjs [int32-seed [1..32]]');
const world=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
const report=measureNaturalCaveDensity({
  seed,columnsPerSide,
  blockAt:(x,y,z)=>world.naturalAndLandmarkBlock(x,y,z),
  biomeAt:(x,z,s)=>v6BiomeAt(x,z,s)?.name??'plains'
});
console.log(JSON.stringify({revision:'run-on-checked-out-source',generator:M7_ENVIRONMENT_GENERATOR,...report},null,2));
