// Only PR #121 stable candidates are imported; legacy IDs and geometry preserved.
import {getM1Blueprints} from './legacy-stable-buildings.mjs';
import {validateAllocation,BIOMES,SIZES} from './schema.mjs';
export function getInheritedStables(){
 const result=getM1Blueprints();if(result.length!==15)throw Error('Expected exactly 15 original stables');
 for(const b of result)if(b.category!=='stable'||b.animals?.length||b.worldPlacement||b.liveIntegration)throw Error('1B ownership or runtime violation');
 for(const biome of BIOMES)for(const size of SIZES)if(result.filter(b=>b.biome===biome&&b.size===size).length!==1)throw Error('Missing inherited stable slot');
 validateAllocation(result);return result;
}
