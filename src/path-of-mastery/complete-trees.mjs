// V3 candidate policy. Preserve V1/V2 definitions for old fixture saves.
import {INDIVIDUALIZED_TREES} from './individualized-trees.mjs';
const plans={
 strength:[[['capstone-a','insight-a',1],['insight-a','path-a',2]],'focus-a','heavy-strike'],
 archery:[[['focus-a','insight-a',2],['insight-a','path-a',1]],'focus-a','stationary-aim'],
 sorcery:[[['capstone-b','insight-b',1],['insight-b','path-b',2]],'focus-b','elemental-cast'],
 constitution:[[['focus-b','insight-b',1],['insight-b','path-b',1]],'focus-b','wounded'],
 woodcutting:[[['insight-a','path-a',2],['capstone-b','insight-b',2]],'focus-b','natural-tree'],
 fishing:[[['focus-b','insight-a',1],['insight-a','path-b',1]],'focus-b','shore-fishing'],
 foraging:[[['capstone-a','insight-a',2],['insight-b','path-b',2]],'focus-a','wild-herb'],
 hunting:[[['focus-a','insight-b',1],['insight-a','path-a',1]],'focus-a','tracked-quarry'],
 excavation:[[['capstone-a','insight-b',2],['insight-b','path-a',1]],'focus-a','natural-relic'],
 agility:[[['focus-b','insight-a',2],['insight-a','path-b',2]],'focus-b','sustained-travel'],
 survival:[[['capstone-b','insight-a',1],['insight-a','path-b',2]],'focus-b','harsh-climate'],
 tracking:[[['focus-a','insight-a',1],['insight-b','path-b',3]],'focus-a','verified-trail'],
 climbing:[[['capstone-a','insight-a',1],['capstone-b','insight-b',1]],'focus-a','supported-ascent'],
 diving:[[['focus-a','insight-a',2],['insight-b','path-b',1]],'focus-a','submerged'],
 restoration:[[['capstone-a','insight-a',1],['insight-b','path-b',1]],'focus-a','verified-healing'],
 mysticism:[[['focus-b','insight-b',2],['insight-a','path-a',2]],'focus-b','ritual-context'],
 stealth:[[['capstone-a','insight-a',2],['insight-a','path-a',2]],'focus-a','undetected'],
 attunement:[[['capstone-b','insight-a',2],['insight-a','path-b',1]],'focus-b','matched-affinity']
};
const freeze=x=>{if(x&&typeof x==='object'&&!Object.isFrozen(x)){Object.values(x).forEach(freeze);Object.freeze(x);}return x;};
export const COMPLETE_TREES=freeze(INDIVIDUALIZED_TREES.map(t=>{
 const key=t.definition.skill.slice(3),plan=plans[key];if(!plan)return t;
 const next=JSON.parse(JSON.stringify(t)),[edges,node,condition]=plan;
 for(const [n,r,rank] of edges)next.definition.nodes.find(x=>x.id===n).requires.push({id:r,rank});
 // Propagate level gates transitively; never display a node earlier than its prerequisite.
 for(let i=0;i<next.definition.nodes.length;i++)for(const n of next.definition.nodes)for(const r of n.requires)n.level=Math.max(n.level,next.definition.nodes.find(x=>x.id===r.id).level);
 const effect=next.typedEffects.find(e=>e.id===key+':'+node);effect.kind='conditional';effect.payload={condition,...effect.payload};
 return next;
}));
