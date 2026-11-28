import {SKILLS,SKILL_CATEGORIES,getSkill} from './registry.mjs';
import {experienceProgress} from './experience.mjs';
export function createSkillView({ledger,trees=new Map()}={}){
  if(typeof ledger?.read!=='function'||!(trees instanceof Map))throw Error('Invalid view host');
  const catalog=new Map(trees);for(const [id,t] of catalog)if(!getSkill(id)||t?.tree?.skill!==id||typeof t.engine?.read!=='function')throw Error('Invalid tree host');
  let generation=0;
  return Object.freeze({async read(category='combat',selected=null){
    if(!SKILL_CATEGORIES.includes(category))throw Error('Invalid category');
    const request=++generation;const data=await ledger.read();
    if(!['empty','ready','sealed'].includes(data?.kind)||!data.progress?.xp) return {ok:false,reason:'ledger-unavailable'};
    const skills=SKILLS.map(s=>Object.freeze({...s,...experienceProgress(data.progress.xp[s.id])}));
    const entries=skills.filter(s=>s.category===category),skill=entries.find(s=>s.id===selected)??entries[0],host=catalog.get(skill.id);
    const allocation=host?await host.engine.read():null;
    if(request!==generation)return {ok:false,reason:'stale-view'};
    return Object.freeze({ok:true,category,skill,entries:Object.freeze(entries),skills:Object.freeze(skills),revision:data.progress.revision,kind:data.kind,tree:host?.tree??null,allocation:allocation?.ok&&allocation.view.level===skill.level?allocation.view:null});
  },invalidate(){generation++;}});
}
// Layout uses prerequisite depth; no mutation of the compiled tree.
export function layoutSkillTree(tree){
  if(!tree||!Array.isArray(tree.nodes)||tree.nodes.length>128)throw Error('Invalid tree');
  const byId=new Map(tree.nodes.map(n=>[n.id,n])),depth=new Map(),visiting=new Set();
  function visit(id){if(depth.has(id))return depth.get(id);if(visiting.has(id)||!byId.has(id))throw Error('Invalid graph');visiting.add(id);const n=byId.get(id),d=n.requires.length?1+Math.max(...n.requires.map(r=>visit(r.id))):0;visiting.delete(id);depth.set(id,d);return d;}
  const counts=new Map();const nodes=tree.nodes.map(n=>{const d=visit(n.id),row=counts.get(d)??0;counts.set(d,row+1);return Object.freeze({id:n.id,x:20+d*164,y:20+row*82});});
  return Object.freeze({nodes:Object.freeze(nodes),width:Math.max(320,180+Math.max(0,...nodes.map(n=>n.x))),height:Math.max(200,90+Math.max(0,...nodes.map(n=>n.y)))});
}
// Feedback is derived from verified snapshots, not button presses or arbitrary XP events.
export function progressionFeedback(before,after){
  if(!before?.ok||!after?.ok||!['empty','ready'].includes(before.kind)||after.kind!=='ready'||!Number.isSafeInteger(before.revision)||!Number.isSafeInteger(after.revision)||after.revision<=before.revision)return Object.freeze([]);
  if(before.skills.length!==24||after.skills.length!==24)return Object.freeze([]);
  const prior=new Map(before.skills.map(s=>[s.id,s]));
  if(after.skills.some(s=>!prior.has(s.id)||s.xp<prior.get(s.id).xp))return Object.freeze([]);
  return Object.freeze(after.skills.filter(s=>s.xp>prior.get(s.id).xp).map(s=>Object.freeze({id:s.id,name:s.name,gain:s.xp-prior.get(s.id).xp,levels:s.level-prior.get(s.id).level,maxed:s.maxed})));
}
