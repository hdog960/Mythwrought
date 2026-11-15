// Only actually authored Builder 1B blueprints. Do not count future slots as candidates.
import {getInheritedStables} from './legacy-import.mjs';
import {createTemperateSmallBathhouse} from './m1-bathhouse-temperate-small.mjs';
import {getM1ServiceExemplars} from './m1-regional-services.mjs';
import {getCrossBiome1BPlans} from './m1-cross-biome-plans.mjs';
import {getM2Community1BPlans} from './m2-community-structures.mjs';
import {validateAllocation} from './schema.mjs';
export function get1BCandidates(){
 const result=[...getInheritedStables(),createTemperateSmallBathhouse(),...getM1ServiceExemplars(),...getCrossBiome1BPlans(),...getM2Community1BPlans()];
 const allocation=validateAllocation(result);
 if(allocation.authored!==37||allocation.remaining!==398)throw Error('Builder 1B M1 census drift');
 return result;
}