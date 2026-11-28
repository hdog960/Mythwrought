// AB5 provisional desert species records, never admitted to original roster.
import {normalizeSpecies} from '../species.mjs';
import {approvedRequirement,normalizeExpansionCapabilities} from './catalog-index.mjs';
import {buildDesertModel,DESERT_MODEL_IDS} from './desert-models.mjs';
import {uprightMotionEnvelope} from './motion-envelope.mjs';
const rows={
 camel:[62,0,3.1,1.3,.7,2,'herd',['walk'],['ground'],[],'quadruped',14,.6,3,'ground'],
 jerboa:[9,0,3.8,.3,.3,2,'pair',['walk','jump'],['ground'],[],'quadruped',11,.75,4,'none'],
 'golden-scarab':[7,0,1.6,.3,.4,2,'solitary',['crawl'],['ground'],[],'crawler',6,.65,4,'none'],
 'oasis-ibis':[14,0,3.3,.5,.4,2,'pair',['walk','fly'],['ground','air'],['wade'],'winged',14,.5,3,'none'],
 dunewalker:[98,8,1.8,1.5,.8,2.8,'herd',['walk'],['ground'],[],'crawler',13,.12,2,'none'],
 mummy:[45,9,1.65,1.2,.75,2.1,'solitary',['walk'],['ground'],[],'biped',14,.6,3,'none'],
 'giant-scorpion':[61,14,2.7,1.8,.65,2.5,'solitary',['crawl'],['ground'],[],'crawler',14,.4,2,'none'],
 'dune-serpent':[48,15,3.0,1.6,.65,2.3,'solitary',['crawl'],['ground'],['burrow','emergence'],'crawler',15,.35,2,'none'],
 'mirage-djinn':[76,17,2.8,3.5,1.0,3.0,'solitary',['fly'],['air'],['hover'],'floating',19,.09,1,'none'],
 'sand-colossus':[230,32,1.15,2.7,1.4,4.2,'solitary',['walk'],['ground'],[],'biped',18,.025,1,'none']
};
export function desertCandidate(id){
 if(!Object.hasOwn(rows,id))return undefined;
 const spec=approvedRequirement(id),[health,damage,speed,reach,windup,cooldown,social,movement,spawnSupport,special,animation,sight,rarity,localLimit,mount]=rows[id];
 const body=uprightMotionEnvelope(buildDesertModel(id)).body,depth=[-3,120];
 const capability=normalizeExpansionCapabilities(id,{body,depth,movement,spawnSupport,special,mount});
 const passive=spec.classification==='passive',defensive=id==='dunewalker',ride=mount==='ground';
 const normalized=normalizeSpecies({id,displayName:spec.displayName,classification:spec.classification,
 body:{...body,radius:Math.min(body.radius,1.25),height:Math.min(body.height,3.5)},
 movement:{capabilities:movement,speed,stepHeight:movement.includes('walk')?.65:0},
 habitat:{biomes:['desert'],depth:[-3,32],light:[0,1]},
 combat:{health,damage,reach,windup,cooldown},perception:{sight,hearing:sight,threat:passive?(defensive?'defend':'avoid'):'hunt'},
 population:{localLimit,rarity},behavior:{social,territory:passive?15:24,defensive,grazes:id==='camel'},
 bonding:{eligible:false},breeding:{eligible:false},riding:{eligible:ride},taming:{eligible:ride},interactions:[],
 render:{model:id,animation},lifecycle:{replenishes:true,persistence:'transient'},implementation:'preview'});
 return Object.freeze({record:Object.freeze({...normalized,body:capability.body,habitat:Object.freeze({...normalized.habitat,depth:capability.depth})}),capability,requirement:spec});
}
export const DESERT_CANDIDATE_IDS=DESERT_MODEL_IDS;
