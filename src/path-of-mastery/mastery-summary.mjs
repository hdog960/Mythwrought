// Deterministic milestones reconstructed from the persisted XP ledger; no new reward writes.
import {SKILLS} from './registry.mjs';
import {experienceProgress} from './experience.mjs';
const thresholds=Object.freeze([10,25,50,75,99]);
export function deriveMasterySummary(data){
  if(!['empty','ready','sealed'].includes(data?.kind)||!Number.isSafeInteger(data.progress?.revision))return null;
  try{const entries=SKILLS.map(s=>{const p=experienceProgress(data.progress.xp[s.id]);return Object.freeze({id:s.id,level:p.level,xp:p.xp,milestones:Object.freeze(thresholds.filter(l=>l<=p.level))});});
    return Object.freeze({revision:data.progress.revision,readOnly:data.kind==='sealed',entries:Object.freeze(entries),totalXp:entries.reduce((n,e)=>n+e.xp,0),totalLevel:entries.reduce((n,e)=>n+e.level,0),milestones:entries.reduce((n,e)=>n+e.milestones.length,0)});
  }catch{return null;}
}
