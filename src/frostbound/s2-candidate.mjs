import {FourRegionWorld,fourRegionProfile,M8_MOUNTAIN_GENERATOR} from '../manual-biomes/profile-world.mjs';
import {admitTree,createTreeSource} from './s2-trees.mjs';
// Unsavable original combined-world host. Explicit admitted sites are fixtures,
// not the future deterministic forest placement or public world generator.
export class FrostboundS2Candidate extends FourRegionWorld{
 constructor(seed,sites){super(seed,fourRegionProfile(seed,M8_MOUNTAIN_GENERATOR));const trees=sites.map(s=>{const t=admitTree(this,...s);if(!t)throw Error('Unadmitted Frostbound root');return t;});this._trees=createTreeSource(seed,trees);}
 naturalAndLandmarkBlock(x,y,z){return this._trees?.get(x,y,z)||super.naturalAndLandmarkBlock(x,y,z);}
 upperNaturalOccupied(key){return this._trees.upper.occupied(key);}
 get upperNaturalRevision(){return this._trees.upper.revision();}
 save(){throw Error('Unregistered Frostbound candidate cannot save');}
}
