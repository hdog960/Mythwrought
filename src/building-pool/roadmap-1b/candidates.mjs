// Only actually authored Builder 1B blueprints. Do not count future slots as candidates.
import {getInheritedStables} from './legacy-import.mjs';
import {createTemperateSmallBathhouse} from './m1-bathhouse-temperate-small.mjs';
import {getM1ServiceExemplars} from './m1-regional-services.mjs';
import {getCrossBiome1BPlans} from './m1-cross-biome-plans.mjs';
import {getM2Community1BPlans} from './m2-community-structures.mjs';
import {getM2Expansion1BPlans} from './m2-community-expansion.mjs';
import {getM2Diverse1BPlans} from './m2-diverse-regions.mjs';
import {getM2NextRegion1BPlans} from './m2-next-regions.mjs';
import {getM2Asymmetric1BPlans} from './m2-asymmetric-services.mjs';
import {getM2Beacon1BPlans} from './m2-beacon-regions.mjs';
import {getM2GroveHarbor1BPlans} from './m2-grove-harbor.mjs';
import {getM2IRegional1BPlans} from './m2i-regional-source.mjs';
import {getM2JRegional1BPlans} from './m2j-regional-source.mjs';
import {getM2KRegional1BPlans} from './m2k-regional-source.mjs';
import {getM2LRegional1BPlans} from './m2l-regional-source.mjs';
import {getM2MRegional1BPlans} from './m2m-regional-source.mjs';
import {getM2NRegional1BPlans} from './m2n-regional-source.mjs';
import {getM2ORegional1BPlans} from './m2o-regional-source.mjs';
import {getM2PRegional1BPlans} from './m2p-regional-source.mjs';
import {validateAllocation} from './schema.mjs';
export function get1BCandidates(){
 const result=[...getInheritedStables(),createTemperateSmallBathhouse(),...getM1ServiceExemplars(),...getCrossBiome1BPlans(),...getM2Community1BPlans(),...getM2Expansion1BPlans(),...getM2Diverse1BPlans(),...getM2NextRegion1BPlans(),...getM2Asymmetric1BPlans(),...getM2Beacon1BPlans(),...getM2GroveHarbor1BPlans(),...getM2IRegional1BPlans(),...getM2JRegional1BPlans(),...getM2KRegional1BPlans(),...getM2LRegional1BPlans(),...getM2MRegional1BPlans(),...getM2NRegional1BPlans(),...getM2ORegional1BPlans(),...getM2PRegional1BPlans()];
 const allocation=validateAllocation(result);
 if(allocation.authored!==154||allocation.remaining!==281)throw Error('Builder 1B M2 census drift');
 return result;
}