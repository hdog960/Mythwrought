// AB8 provisional alpine species records, never admitted to original roster.
import {normalizeSpecies} from '../species.mjs';
import {approvedRequirement,normalizeExpansionCapabilities} from './catalog-index.mjs';
import {buildAlpineModel,ALPINE_MODEL_IDS} from './alpine-models.mjs';
import {uprightMotionEnvelope} from './motion-envelope.mjs';
const rows={
 yak:[72,0,2.0,1.4,.65,2.4,'herd',['walk'],['ground'],[],'quadruped',14,.65,4,'none'],
 'golden-eagle':[18,0,4.6,.6,.4,2,'pair',['walk','fly'],['air','ground'],['perch'],'winged',20,.4,2,'none'],
 pika:[8,0,3.5,.3,.35,2,'pair',['walk','jump'],['ground'],[],'quadruped',10,.7,4,'none'],
 skyray:[34,0,3.9,.7,.5,2,'herd',['fly'],['air'],['glide'],'winged',17,.27,3,'none'],
 griffin:[138,18,5.0,1.8,.7,2.6,'solitary',['walk','fly'],['air','ground'],['glide'],'winged',22,.02,1,'aerial'],
 cyclops:[190,30,1.9,2.8,1.2,3.8,'solitary',['walk'],['ground'],[],'biped',18,.22,1,'none'],
 wyvern:[124,23,5.0,2.0,.7,2.6,'solitary',['fly','walk'],['air'],['glide'],'winged',22,.08,1,'none'],
 'avalanche-beast':[155,26,3.8,2.0,.85,3.1,'solitary',['walk','jump'],['ground'],[],'quadruped',18,.25,1,'none'],
 'storm-elemental':[91,17,3.4,3.8,.9,2.7,'solitary',['fly'],['air'],['hover'],'floating',20,.27,2,'none'],
 'cliff-reaver':[59,13,3.2,1.4,.55,2.2,'solitary',['walk','climb','jump'],['ground','climb-surface'],[],'crawler',17,.38,2,'none']
};
export function alpineCandidate(id){
 if(!Object.hasOwn(rows,id))return undefined;
 const spec=approvedRequirement(id),[health,damage,speed,reach,windup,cooldown,social,movement,spawnSupport,special,animation,sight,rarity,localLimit,mount]=rows[id];
 const body=uprightMotionEnvelope(buildAlpineModel(id)).body,depth=[-3,250];
 const capability=normalizeExpansionCapabilities(id,{body,depth,movement,spawnSupport,special,mount});
 const passive=spec.classification==='passive',defensive=id==='griffin',ride=mount!=='none';
 const normalized=normalizeSpecies({id,displayName:spec.displayName,classification:spec.classification,
 body:{...body,radius:Math.min(body.radius,1.25),height:Math.min(body.height,3.5)},
 movement:{capabilities:movement,speed,stepHeight:movement.includes('walk')?.65:0},
 habitat:{biomes:['alpine'],depth:[-3,32],light:[0,1]},
 combat:{health,damage,reach,windup,cooldown},perception:{sight,hearing:sight,threat:passive?(defensive?'defend':'avoid'):'hunt'},
 population:{localLimit,rarity},behavior:{social,territory:passive?15:24,defensive,grazes:id==='yak'},
 bonding:{eligible:false},breeding:{eligible:false},riding:{eligible:ride},taming:{eligible:ride||id==='yak'},interactions:[],
 render:{model:id,animation},lifecycle:{replenishes:true,persistence:'transient'},implementation:'preview'});
 return Object.freeze({record:Object.freeze({...normalized,body:capability.body,habitat:Object.freeze({...normalized.habitat,depth:capability.depth})}),capability,requirement:spec});
}
export const ALPINE_CANDIDATE_IDS=ALPINE_MODEL_IDS;
