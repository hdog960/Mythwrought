// Read-only bounded candidate selection for the existing ecology owner.
// No clock, population manager, live spawning, new world or save keys.
import {completeBeastCandidateCatalog} from './complete-catalog.mjs';
import {expansionSupport,expansionHabitatEligible} from './environment-support.mjs';
import {readExpansionHabitatFacts} from './habitat-facts.mjs';
import {planBodyVolume,bodiesOverlap} from './body-contract.mjs';
import {regionalWildCounts,CANDIDATE_LIMITS} from './catalog-index.mjs';
const EPS=1e-5;
function generatedSupport(view,p,body,kind){
 const plan=planBodyVolume(p,body);
 if(!plan||!expansionSupport(view.query,p,body,kind))return false;
 // Require unedited generated/landmark cells for every body cell.
 if(plan.cells.some(({x,y,z})=>view.generatedMaterialAt(x,y,z)===undefined))return false;
 if(kind==='climb-surface')return false; // wall provenance not implemented
 if(kind==='ground'||kind==='ceiling'){
  const b=plan.bounds,y=Math.floor((kind==='ground'?b[1]-.035:b[4]+.035));
  for(let x=Math.floor(b[0]+EPS);x<=Math.floor(b[3]-EPS);x++)
   for(let z=Math.floor(b[2]+EPS);z<=Math.floor(b[5]-EPS);z++)
    if(view.generatedMaterialAt(x,y,z)===undefined)return false;
 }
 return true;
}
export function chooseExpansionSpawn(view,{proposals,observer,entities,homeChunk,isProtected=()=>false}={}){
 if(!view?.query||typeof view.generatedMaterialAt!=='function'||typeof view.revision!=='function'||
 !Array.isArray(proposals)||proposals.length>6||!Array.isArray(entities)||entities.length>=CANDIDATE_LIMITS.liveEntities||
 typeof isProtected!=='function'||typeof homeChunk!=='string')return null;
 try{
  const {index,get}=completeBeastCandidateCatalog(),rev=view.revision();
  if(!Number.isSafeInteger(rev)||rev<0)return null;
  const counts=regionalWildCounts(index,entities,homeChunk,isProtected);
  const q=view.query,generatedView={...view,materialAt:view.generatedMaterialAt};
  for(const row of proposals){
   const c=get(row?.id),p=Array.isArray(row?.point)?Object.freeze([...row.point]):null;
   if(!c||!planBodyVolume(p,c.record.body)||!Number.isFinite(row.rarityRoll)||row.rarityRoll<0||row.rarityRoll>=1||
    row.rarityRoll>c.record.population.rarity||(counts.get(c.record.id)??0)>=c.record.population.localLimit)continue;
   if(!c.capability.spawnSupport.some(k=>generatedSupport(view,p,c.record.body,k)))continue;
   if(!expansionHabitatEligible(q,p,c.capability,c.requirement,{observer,lightRange:c.record.habitat.light,
     facts:()=>readExpansionHabitatFacts(generatedView,p,c.capability,c.requirement)}))continue;
   if(entities.some(e=>bodiesOverlap(p,c.record.body,e.position,e.species.body)!==false))continue;
   if(view.revision()!==rev)return null;
   return Object.freeze({id:c.record.id,point:p,homeChunk,revision:rev,dormant:Math.hypot(...p.map((n,i)=>n-observer[i]))>18});
  }
  return null;
 }catch{return null;}
}
