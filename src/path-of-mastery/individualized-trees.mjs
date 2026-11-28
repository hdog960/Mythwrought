// PM5 v2 fixture policy: deliberately separate from the earlier candidate save policy.
import {CANDIDATE_TREES} from './candidate-trees.mjs';
const freeze=x=>{if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;};
const changes={
  attack:[['capstone-a','insight-a',1],['capstone-b','insight-b',1]],
  defense:[['focus-a','insight-a',1]],
  mining:[['insight-a','path-a',1],['insight-b','path-b',1]],
  exploration:[['capstone-a','insight-a',2]],
  'beast-mastery':[['focus-b','insight-b',1],['insight-a','path-a',1]],
  resonance:[['capstone-b','insight-b',2],['insight-a','path-a',1]]
};
const conditional={attack:['focus-a','guard-open'],defense:['focus-a','guarding'],mining:['focus-a','natural-vein'],exploration:['focus-a','first-discovery'],'beast-mastery':['focus-b','mounted'],resonance:['focus-b','delivered-power']};
export const INDIVIDUALIZED_TREES=freeze(CANDIDATE_TREES.map(t=>{
  const key=t.definition.skill.slice(3);if(!changes[key])return t;
  const next=JSON.parse(JSON.stringify(t));
  for(const [node,req,rank] of changes[key]){const n=next.definition.nodes.find(x=>x.id===node);n.requires.push({id:req,rank});n.level=Math.max(n.level,next.definition.nodes.find(x=>x.id===req).level);}
  const [node,condition]=conditional[key],effect=next.typedEffects.find(e=>e.id===key+':'+node);effect.kind='conditional';effect.payload={condition,...effect.payload};
  return next;
}));
