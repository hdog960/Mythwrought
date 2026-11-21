// Living Underworld Phase 2 — calibrated detached candidate ONLY.
// These thresholds are provisional against 20-seed voxel samples; they do not
// modify M7, the player's world, save data or surface biomes.
import {candidateNoiseScoreAt,candidateChamberAt} from './procedural-core.mjs';
import {networkAirAt} from './worldwide-network.mjs';
import {cityMaterialOverrideAt} from './city-floor-proposal.mjs';

const valid=(seed,x,y,z)=>[seed,x,y,z].every(Number.isSafeInteger)&&seed===(seed|0);
const smooth=t=>t*t*(3-2*t);
export const CAVE_CALIBRATION=Object.freeze({
 upper:.23,middle:.175,deep:.135,lowest:.09,
 targetOverall:Object.freeze({min:35,max:40}),
 note:'prototype thresholds; aggregate 20-seed audit required before adoption'
});
export function caveThresholdForDepth(y){
 if(!Number.isSafeInteger(y)||y<-210||y>-4)
  throw new TypeError('Invalid calibrated cave depth');
 if(y>=-36)return CAVE_CALIBRATION.upper;
 if(y>=-44)return CAVE_CALIBRATION.middle+
   (CAVE_CALIBRATION.upper-CAVE_CALIBRATION.middle)*smooth((y+44)/8);
 if(y>=-96)return CAVE_CALIBRATION.middle;
 if(y>=-104)return CAVE_CALIBRATION.deep+
   (CAVE_CALIBRATION.middle-CAVE_CALIBRATION.deep)*smooth((y+104)/8);
 if(y>=-156)return CAVE_CALIBRATION.deep;
 if(y>=-164)return CAVE_CALIBRATION.lowest+
   (CAVE_CALIBRATION.deep-CAVE_CALIBRATION.lowest)*smooth((y+164)/8);
 return CAVE_CALIBRATION.lowest;
}
export function detachedCalibratedUnderworldAirAt(seed,x,y,z){
 if(!valid(seed,x,y,z))throw new TypeError('Invalid calibrated cavern query');
 if(y<-210||y>-4)return false;
 // No city-floor hole can be carved by any noise or network component.
 const cityMaterial=cityMaterialOverrideAt(seed,x,y,z);
 if(cityMaterial<0)return false;
 if(cityMaterial>0)return true;
 if(networkAirAt(seed,x,y,z))return true;
 if(candidateNoiseScoreAt(seed,x,y,z)>caveThresholdForDepth(y))return true;
 return candidateChamberAt(seed,x,y,z);
}
