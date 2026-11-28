// AB4 candidate gameplay definitions; not imported into original live roster.
import {normalizeSpecies} from '../species.mjs';
import {approvedRequirement,normalizeExpansionCapabilities} from './catalog-index.mjs';
import {buildPlainsModel,PLAINS_MODEL_IDS} from './plains-models.mjs';
import {uprightMotionEnvelope} from './motion-envelope.mjs';
// id: health, damage, speed, reach, windup, cooldown, social, movement,
// spawn support, special, animation, sight, rarity, local cap.
const rows={
 bison:[75,12,2.1,1.8,.7,2.4,'herd',['walk'],['ground'],[],'quadruped',14,.60,4],
 badger:[18,4,2.3,.65,.45,1.8,'solitary',['walk','crawl'],['ground'],['burrow'],'quadruped',10,.65,2],
 meadowlark:[8,0,3.6,.3,.35,2,'pair',['walk','fly'],['ground','air'],['perch'],'winged',12,.8,4],
 honeybee:[4,0,2.8,.25,.35,2,'herd',['fly'],['air'],['hover'],'winged',7,.7,5],
 'golden-antelope':[34,0,5.2,.7,.5,2,'herd',['walk','jump'],['ground'],[],'quadruped',18,.38,4],
 werewolf:[94,18,4.1,1.6,.55,1.8,'solitary',['walk','jump'],['ground'],[],'biped',20,.25,1],
 scarefiend:[56,13,2.1,1.5,.9,2.8,'solitary',['walk'],['ground'],[],'biped',12,.42,2],
 'headless-knight':[128,24,1.9,2.1,1.15,3.4,'solitary',['walk'],['ground'],[],'biped',18,.08,1],
 'dire-hound':[42,11,4.6,1.4,.45,1.6,'pack',['walk','jump'],['ground'],[],'quadruped',20,.42,3],
 gravehand:[30,8,1.0,1.1,.65,2.7,'solitary',['crawl'],['ground'],['emergence'],'crawler',9,.45,2]
};
export function plainsCandidate(id){
 if(!Object.hasOwn(rows,id))return undefined;
 const spec=approvedRequirement(id),[health,damage,speed,reach,windup,cooldown,social,movement,spawnSupport,special,animation,sight,rarity,localLimit]=rows[id];
 const body=uprightMotionEnvelope(buildPlainsModel(id)).body,depth=[-3,120];
 const capability=normalizeExpansionCapabilities(id,{body,depth,movement,spawnSupport,special});
 const passive=spec.classification==='passive',defensive=id==='bison'||id==='badger';
 const light=['werewolf','gravehand'].includes(id)?[0,.3]:[0,1];
 // Reuse legacy validation for every unchanged field, validate enlarged body
 // and physical depth independently via expansion capability contract.
 const normalized=normalizeSpecies({id,displayName:spec.displayName,classification:spec.classification,
  body:{...body,radius:Math.min(body.radius,1.25),height:Math.min(body.height,3.5)},
  movement:{capabilities:movement,speed,stepHeight:movement.includes('walk')?.65:0},
  habitat:{biomes:['meadow'],depth:[depth[0],32],light},
  combat:{health,damage,reach,windup,cooldown},perception:{sight,hearing:sight,threat:passive?(defensive?'defend':'avoid'):'hunt'},
  population:{localLimit,rarity},behavior:{social,territory:passive?14:22,defensive,grazes:['bison','golden-antelope'].includes(id)},
  bonding:{eligible:false},breeding:{eligible:false},riding:{eligible:false},taming:{eligible:false},
  interactions:[],render:{model:id,animation},lifecycle:{replenishes:true,persistence:'transient'},implementation:'preview'});
 const record=Object.freeze({...normalized,body:capability.body,habitat:Object.freeze({...normalized.habitat,depth:capability.depth})});
 return Object.freeze({record,capability,requirement:spec});
}
export const PLAINS_CANDIDATE_IDS=PLAINS_MODEL_IDS;
