import {compileSkillTree} from './skill-tree.mjs';
import {validateFixtureEffect} from './effect-contracts.mjs';
export function compileTypedFixtureTree(definition,effects){
  if(!Array.isArray(effects)||effects.length<1||effects.length>128)throw Error('Invalid effect catalog');
  const catalog=new Map();for(const raw of effects){const e=validateFixtureEffect(raw);if(catalog.has(e.id))throw Error('Duplicate effect');catalog.set(e.id,e);}
  const tree=compileSkillTree(definition,{allowedEffects:[...catalog.keys()]});
  const descriptors=Object.freeze([...catalog.values()].sort((a,b)=>a.id.localeCompare(b.id)));
  return Object.freeze({tree,descriptors,policy:JSON.stringify([tree.skill,tree.nodes,descriptors]),
    project(ranks,level,budget){const checked=tree.inspect(ranks,level,budget);return Object.freeze(tree.nodes.filter(n=>Object.hasOwn(checked.ranks,n.id)).map(n=>Object.freeze({node:n.id,rank:checked.ranks[n.id],effect:catalog.get(n.effect)})));}});
}
