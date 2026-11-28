// AB6 provisional snow species records, never admitted to original roster.
import {normalizeSpecies} from '../species.mjs';
import {approvedRequirement,normalizeExpansionCapabilities} from './catalog-index.mjs';
import {buildSnowModel,SNOW_MODEL_IDS} from './snow-models.mjs';
import {uprightMotionEnvelope} from './motion-envelope.mjs';
const rows={
 'woolly-mammoth':[130,18,1.65,2.3,.85,3.2,'herd',['walk'],['ground'],[],'quadruped',16,.24,3,'ground'],
 ptarmigan:[11,0,2.5,.35,.4,2,'pair',['walk','fly'],['ground'],['perch'],'winged',11,.7,4,'none'],
 ermine:[15,0,4.1,.4,.35,2,'solitary',['walk','crawl'],['ground'],[],'quadruped',14,.65,2,'none'],
 'aurora-wisp':[12,0,2.2,.3,.4,2,'solitary',['fly'],['air'],['hover'],'floating',10,.09,2,'none'],
 snowdrifter:[38,0,2.1,.6,.5,2,'herd',['walk'],['ground'],['roll'],'floating',10,.55,3,'none'],
 yeti:[145,24,3.2,2.2,.9,2.8,'solitary',['walk','jump'],['ground'],[],'biped',19,.25,1,'none'],
 'ice-golem':[175,27,1.35,2.3,1.2,3.5,'solitary',['walk'],['ground'],[],'biped',15,.2,1,'none'],
 'rime-widow':[59,13,3.0,1.5,.55,2.2,'solitary',['crawl'],['ground'],[],'crawler',16,.4,2,'none'],
 'blizzard-drake':[112,20,4.2,2.9,.85,3.0,'solitary',['fly','walk'],['air','ground'],['glide'],'winged',21,.07,1,'none'],
 'pale-reaper':[83,19,3.1,2.0,.8,2.6,'solitary',['fly'],['air'],['hover'],'floating',20,.08,1,'none']
};
export function snowCandidate(id){
 if(!Object.hasOwn(rows,id))return undefined;
 const spec=approvedRequirement(id),[health,damage,speed,reach,windup,cooldown,social,movement,spawnSupport,special,animation,sight,rarity,localLimit,mount]=rows[id];
 const body=uprightMotionEnvelope(buildSnowModel(id)).body,depth=[-3,180];
 const capability=normalizeExpansionCapabilities(id,{body,depth,movement,spawnSupport,special,mount});
 const passive=spec.classification==='passive',defensive=id==='woolly-mammoth',ride=mount==='ground';
 const normalized=normalizeSpecies({id,displayName:spec.displayName,classification:spec.classification,
 body:{...body,radius:Math.min(body.radius,1.25),height:Math.min(body.height,3.5)},
 movement:{capabilities:movement,speed,stepHeight:movement.includes('walk')?.65:0},
 habitat:{biomes:['snow'],depth:[-3,32],light:[0,1]},
 combat:{health,damage,reach,windup,cooldown},perception:{sight,hearing:sight,threat:passive?(defensive?'defend':'avoid'):'hunt'},
 population:{localLimit,rarity},behavior:{social,territory:passive?15:24,defensive,grazes:id==='woolly-mammoth'},
 bonding:{eligible:false},breeding:{eligible:false},riding:{eligible:ride},taming:{eligible:ride},interactions:[],
 render:{model:id,animation},lifecycle:{replenishes:true,persistence:'transient'},implementation:'preview'});
 return Object.freeze({record:Object.freeze({...normalized,body:capability.body,habitat:Object.freeze({...normalized.habitat,depth:capability.depth})}),capability,requirement:spec});
}
export const SNOW_CANDIDATE_IDS=SNOW_MODEL_IDS;
