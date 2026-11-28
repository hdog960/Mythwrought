// AB9 provisional cave species records, never admitted to original roster.
import {normalizeSpecies} from '../species.mjs';
import {approvedRequirement,normalizeExpansionCapabilities} from './catalog-index.mjs';
import {buildCaveModel,CAVE_MODEL_IDS} from './cave-models.mjs';
import {uprightMotionEnvelope} from './motion-envelope.mjs';
const rows={
 'cave-bat':[9,0,3.4,.3,.4,2,'herd',['fly'],['ceiling','air'],['roost'],'winged',12,.7,5,'none'],
 'crystal-snail':[12,0,.35,.25,.5,2,'solitary',['crawl'],['ground'],[],'crawler',5,.5,3,'none'],
 'blind-cavefish':[8,0,2.4,.3,.4,2,'herd',['swim'],['water'],[],'crawler',4,.6,5,'none'],
 'lantern-beetle':[10,0,1.5,.3,.4,2,'herd',['crawl'],['ground'],[],'crawler',7,.65,4,'none'],
 geodeback:[108,14,1.2,1.5,.8,3,'solitary',['walk'],['ground'],[],'quadruped',12,.10,1,'none'],
 'burrowing-horror':[77,17,2.8,1.8,.7,2.7,'solitary',['crawl'],['ground'],['burrow','emergence'],'crawler',15,.32,2,'none'],
 'abyssal-sentinel':[185,28,1.4,2.6,1.1,3.6,'solitary',['walk'],['ground'],[],'biped',17,.08,1,'none'],
 'echo-stalker':[73,16,3.7,1.5,.65,2.1,'solitary',['walk','crawl'],['ground'],[],'crawler',10,.28,2,'none'],
 'ceiling-lurker':[63,16,2.7,1.5,.65,2.5,'solitary',['crawl','climb'],['ceiling'],['ceiling-attachment'],'crawler',14,.32,2,'none'],
 'abyssal-hydra':[320,34,2.0,2.8,1.0,4.0,'solitary',['walk'],['ground'],[],'quadruped',22,.015,1,'none']
};
export function caveCandidate(id){
 if(!Object.hasOwn(rows,id))return undefined;
 const spec=approvedRequirement(id),[health,damage,speed,reach,windup,cooldown,social,movement,spawnSupport,special,animation,sight,rarity,localLimit,mount]=rows[id];
 const body=uprightMotionEnvelope(buildCaveModel(id)).body,depth=id==='cave-bat'?[-100,-4]:['crystal-snail','blind-cavefish','echo-stalker','ceiling-lurker'].includes(id)?[-210,-4]:id==='lantern-beetle'?[-210,-35]:[-210,-80];
 const capability=normalizeExpansionCapabilities(id,{body,depth,movement,spawnSupport,special,mount});
 const passive=spec.classification==='passive',defensive=id==='geodeback',ride=mount!=='none';
 const normalized=normalizeSpecies({id,displayName:spec.displayName,classification:spec.classification,
 body:{...body,radius:Math.min(body.radius,1.25),height:Math.min(body.height,3.5)},
 movement:{capabilities:movement,speed,stepHeight:movement.includes('walk')?.65:0},
 habitat:{biomes:['cave'],depth:[...depth],light:[0,1]},
 combat:{health,damage,reach,windup,cooldown},perception:{sight,hearing:id==='echo-stalker'?22:sight,threat:passive?(defensive?'defend':'avoid'):'hunt'},
 population:{localLimit,rarity},behavior:{social,territory:passive?15:24,defensive,grazes:false},
 bonding:{eligible:false},breeding:{eligible:false},riding:{eligible:ride},taming:{eligible:false},interactions:[],
 render:{model:id,animation},lifecycle:{replenishes:true,persistence:'transient'},implementation:'preview'});
 return Object.freeze({record:Object.freeze({...normalized,body:capability.body,habitat:Object.freeze({...normalized.habitat,depth:capability.depth})}),capability,requirement:spec});
}
export const CAVE_CANDIDATE_IDS=CAVE_MODEL_IDS;
