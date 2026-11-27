// AB1 catalog/index and locomotion contracts. No production admission.
import {speciesRegistry} from '../species.mjs';
import {APPROVED,BIOMES,ORIGINAL_IDS,composeCompleteRoster} from './roster-contract.mjs';
import {validExpansionBody} from './body-contract.mjs';
import {PHYSICAL_MIN_Y,PHYSICAL_MAX_Y} from '../../world-height.mjs';
export const CANDIDATE_LIMITS=Object.freeze({species:100,liveEntities:32,activeEntities:8});
const MODES=Object.freeze(['walk','swim','fly','climb','jump','crawl']);
const SUPPORTS=Object.freeze(['ground','water','air','ceiling','climb-surface']);
const SPECIAL=Object.freeze(['burrow','perch','roost','roll','glide','ceiling-attachment','emergence','wade','hover']);
const requirements=new Map(APPROVED.map(s=>[s.id,s]));
function tags(items,allowed,minimum=1){
 if(!Array.isArray(items)||items.length<minimum||items.length>allowed.length||new Set(items).size!==items.length||items.some(x=>!allowed.includes(x)))throw TypeError('Invalid capability tags');
 return Object.freeze([...items].sort());
}
// Bounded capability declaration, not implementation. Aerial mounts require
// the authoritative movement-owner interface later, not another flight engine.
export function normalizeExpansionCapabilities(id,input){
 const spec=requirements.get(id);
 if(!spec||!input||!validExpansionBody(input.body))throw TypeError('Invalid expansion body or ID');
 const {body,depth,movement,spawnSupport,special=[],mount='none'}=input;
 if(!Array.isArray(depth)||depth.length!==2||!depth.every(Number.isFinite)||depth[0]<PHYSICAL_MIN_Y||depth[1]>PHYSICAL_MAX_Y||depth[0]>depth[1]||depth[1]+body.height>PHYSICAL_MAX_Y+1)throw TypeError('Invalid physical habitat bounds');
 const modes=tags(movement,MODES),support=tags(spawnSupport,SUPPORTS),states=tags(special,SPECIAL,0);
 if(support.includes('water')&&!modes.includes('swim')||support.includes('air')&&!modes.includes('fly')||
 support.includes('ceiling')&&!states.includes('ceiling-attachment')&&!states.includes('roost')||
 support.includes('climb-surface')&&!modes.includes('climb'))throw TypeError('Unsupported spawn medium');
 if(!['none','ground','aerial'].includes(mount)||mount==='ground'&&!modes.includes('walk')||mount==='aerial'&&!modes.includes('fly'))throw TypeError('Unsupported mount mode');
 if((id==='griffin'&&mount!=='aerial')||(['camel','unicorn'].includes(id)&&mount!=='ground')||
 (!['griffin','camel','unicorn','woolly-mammoth'].includes(id)&&mount!=='none')||
 (id==='woolly-mammoth'&&mount==='aerial'))throw TypeError('Unapproved mount');
 if(id==='blind-cavefish'&&(support.length!==1||support[0]!=='water')||
 id==='ceiling-lurker'&&(support.length!==1||support[0]!=='ceiling')||
 id==='cave-bat'&&(!support.includes('ceiling')||!modes.includes('fly')))throw TypeError('Required habitat capability missing');
 return Object.freeze({id,body:Object.freeze({...body}),depth:Object.freeze([...depth]),movement:modes,spawnSupport:support,special:states,mount});
}
function buildIndex(records){
 const byId=new Map(records.map(r=>[r.id,r]));
 const biomeIndex=new Map(BIOMES.map(b=>[b,Object.freeze(records.filter(r=>r.habitat.biomes.includes(b)))]));
 return Object.freeze({size:records.length,records:Object.freeze([...records]),get:id=>byId.get(id),
 byBiome:b=>biomeIndex.get(b)??Object.freeze([])});
}
export const legacyIndex=buildIndex(speciesRegistry);
export function approvedRequirement(id){return requirements.get(id);}
export function approvedForBiome(b){return Object.freeze(APPROVED.filter(r=>r.biome===b));}
// Structural integration candidate only; actual model/behavior and qualification separate.
export function createCompleteCandidateIndex(additions,capabilities){
 const records=composeCompleteRoster(speciesRegistry,additions);
 if(!Array.isArray(capabilities)||capabilities.length!==60||new Set(capabilities.map(c=>c?.id)).size!==60)throw TypeError('Incomplete capability roster');
 for(const r of records.slice(40)){
  const c=capabilities.find(x=>x.id===r.id),v=normalizeExpansionCapabilities(r.id,c);
  if(!Object.isFrozen(r)||!Object.isFrozen(r.body)||!Object.isFrozen(r.habitat)||!Object.isFrozen(r.habitat.depth)||!Object.isFrozen(r.habitat.biomes)||!Object.isFrozen(r.movement)||!Object.isFrozen(r.movement.capabilities)||
    !r.movement?.capabilities||!r.habitat?.depth||
    !['radius','height','collision'].every(k=>Object.is(r.body?.[k],v.body[k]))||
    r.habitat.depth.length!==2||r.habitat.depth.some((n,i)=>n!==v.depth[i])||
    r.movement.capabilities.length!==v.movement.length||!v.movement.every(m=>r.movement.capabilities.includes(m))||
    r.riding?.eligible!==(v.mount!=='none'))throw TypeError('Candidate record/capability mismatch: '+r.id);
 }
 return buildIndex(records);
}
// One bounded pass rather than a per-species population scan.
export function regionalWildCounts(index,entities,homeChunk,isProtected=()=>false){
 if(!index||![40,100].includes(index.size)||!Array.isArray(entities)||entities.length>CANDIDATE_LIMITS.liveEntities||
 typeof homeChunk!=='string'||homeChunk.length>64||typeof isProtected!=='function')throw TypeError('Invalid population query');
 const result=new Map(),seen=new Set();
 for(const mob of entities){
  if(!mob||typeof mob.id!=='string'||seen.has(mob.id)||index.get(mob.species?.id)!==mob.species)throw TypeError('Unknown or duplicate live entity');
  seen.add(mob.id);
  if(mob.homeChunk===homeChunk&&!mob.important&&!isProtected(mob))result.set(mob.species.id,(result.get(mob.species.id)??0)+1);
 }
 return result;
}
if(legacyIndex.size!==ORIGINAL_IDS.length)throw Error('Legacy catalog changed');
