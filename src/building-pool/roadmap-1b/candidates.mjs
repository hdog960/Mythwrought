// Only actually authored Builder 1B blueprints. Do not count future slots as candidates.
import {getInheritedStables} from './legacy-import.mjs';
import {createTemperateSmallBathhouse} from './m1-bathhouse-temperate-small.mjs';
import {validateAllocation} from './schema.mjs';
export function get1BCandidates(){
 const result=[...getInheritedStables(),createTemperateSmallBathhouse()];
 const allocation=validateAllocation(result);
 if(allocation.authored!==16||allocation.remaining!==419)throw Error('Builder 1B M1 census drift');
 return result;
}