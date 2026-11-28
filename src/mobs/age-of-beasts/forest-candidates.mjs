// AB7 provisional forest species records, never admitted to original roster.
import {normalizeSpecies} from '../species.mjs';
import {approvedRequirement,normalizeExpansionCapabilities} from './catalog-index.mjs';
import {buildForestModel,FOREST_MODEL_IDS} from './forest-models.mjs';
import {uprightMotionEnvelope} from './motion-envelope.mjs';
const rows={
 unicorn:[58,0,4.2,1.2,.55,2,'solitary',['walk','jump'],['ground'],[],'quadruped',18,.08,1,'ground'],
 faerie:[9,0,3.1,.25,.4,2,'pair',['fly'],['air'],['hover'],'winged',10,.6,4,'none'],
 sproutling:[20,0,1.5,.4,.5,2,'herd',['walk'],['ground'],[],'biped',8,.65,4,'none'],
 prismwing:[7,0,3.6,.3,.4,2,'pair',['fly'],['air'],['perch'],'winged',12,.55,4,'none'],
 glimmerstag:[40,0,3.4,.8,.5,2,'herd',['walk','jump'],['ground'],[],'quadruped',17,.09,2,'none'],
 'corrupted-treant':[165,26,1.4,2.6,1.0,3.5,'solitary',['walk'],['ground'],[],'biped',16,.24,1,'none'],
 'nightshade-witch':[67,14,2.2,3.6,.9,2.9,'solitary',['walk'],['ground'],[],'biped',18,.3,1,'none'],
 sporebeast:[82,12,2.1,2.1,.8,3.2,'solitary',['walk'],['ground'],[],'biped',12,.4,2,'none'],
 chimera:[155,26,3.8,2.3,.85,2.6,'solitary',['walk','jump'],['ground'],[],'quadruped',21,.075,1,'none'],
 dreamweaver:[76,16,2.7,3.4,1.1,3.2,'solitary',['fly'],['air'],['hover'],'floating',18,.32,2,'none']
};
export function forestCandidate(id){
 if(!Object.hasOwn(rows,id))return undefined;
 const spec=approvedRequirement(id),[health,damage,speed,reach,windup,cooldown,social,movement,spawnSupport,special,animation,sight,rarity,localLimit,mount]=rows[id];
 const body=uprightMotionEnvelope(buildForestModel(id)).body,depth=[-3,240];
 const capability=normalizeExpansionCapabilities(id,{body,depth,movement,spawnSupport,special,mount});
 const passive=spec.classification==='passive',defensive=false,ride=mount==='ground';
 const normalized=normalizeSpecies({id,displayName:spec.displayName,classification:spec.classification,
 body:{...body,radius:Math.min(body.radius,1.25),height:Math.min(body.height,3.5)},
 movement:{capabilities:movement,speed,stepHeight:movement.includes('walk')?.65:0},
 habitat:{biomes:['forest'],depth:[-3,32],light:[0,1]},
 combat:{health,damage,reach,windup,cooldown},perception:{sight,hearing:sight,threat:passive?(defensive?'defend':'avoid'):'hunt'},
 population:{localLimit,rarity},behavior:{social,territory:passive?15:24,defensive,grazes:id==='glimmerstag'},
 bonding:{eligible:false},breeding:{eligible:false},riding:{eligible:ride},taming:{eligible:ride},interactions:[],
 render:{model:id,animation},lifecycle:{replenishes:true,persistence:'transient'},implementation:'preview'});
 return Object.freeze({record:Object.freeze({...normalized,body:capability.body,habitat:Object.freeze({...normalized.habitat,depth:capability.depth})}),capability,requirement:spec});
}
export const FOREST_CANDIDATE_IDS=FOREST_MODEL_IDS;
