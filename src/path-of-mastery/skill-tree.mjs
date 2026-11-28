// PM5 isolated definition compiler and pure allocation transaction. No live effects.
import {getSkill} from './registry.mjs';
const id=x=>typeof x==='string'&&/^[a-z][a-z0-9:_-]{0,63}$/.test(x);
const integer=(x,min,max)=>Number.isSafeInteger(x)&&x>=min&&x<=max;
const exact=(x,keys)=>x&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
const fail=()=>{throw Error('Invalid skill tree');};
export function compileSkillTree(definition,{allowedEffects=[]}={}){
  if(!exact(definition,['skill','nodes'])||!getSkill(definition.skill)||!Array.isArray(definition.nodes)||
     definition.nodes.length<1||definition.nodes.length>128||!Array.isArray(allowedEffects)||!allowedEffects.every(id))fail();
  const nodes=new Map(),effects=new Set(allowedEffects);
  for(const n of definition.nodes){
    if(!exact(n,['id','level','costs','requires','excludes','effect'])||!id(n.id)||nodes.has(n.id)||
       !integer(n.level,1,99)||!Array.isArray(n.costs)||n.costs.length<1||n.costs.length>10||
       !Array.from(n.costs).every(c=>integer(c,1,1000))||!Array.isArray(n.requires)||n.requires.length>128||
       !Array.isArray(n.excludes)||n.excludes.length>128||!Array.from(n.excludes).every(id)||
       new Set(n.excludes).size!==n.excludes.length||!effects.has(n.effect))fail();
    const requires=new Map();
    for(const q of n.requires){if(!exact(q,['id','rank'])||!id(q.id)||requires.has(q.id)||!integer(q.rank,1,10))fail();requires.set(q.id,q.rank);}
    nodes.set(n.id,Object.freeze({...n,costs:Object.freeze([...n.costs]),
      requires:Object.freeze([...requires].map(([id,rank])=>Object.freeze({id,rank}))),excludes:Object.freeze([...n.excludes])}));
  }
  for(const n of nodes.values()){
    for(const q of n.requires)if(!nodes.has(q.id)||q.rank>nodes.get(q.id).costs.length)fail();
    for(const x of n.excludes)if(x===n.id||!nodes.has(x)||!nodes.get(x).excludes.includes(n.id))fail();
  }
  const visiting=new Set(),closure=new Map();
  function ancestors(key){
    if(visiting.has(key))fail();if(closure.has(key))return closure.get(key);
    visiting.add(key);const all=new Set([key]);for(const q of nodes.get(key).requires)for(const a of ancestors(q.id))all.add(a);
    visiting.delete(key);for(const a of all)for(const b of nodes.get(a).excludes)if(all.has(b))fail();
    closure.set(key,all);return all;
  }
  for(const key of nodes.keys())ancestors(key);
  function inspect(ranks,level,budget){
    if(!ranks||typeof ranks!=='object'||Array.isArray(ranks)||!integer(level,1,99)||!integer(budget,0,1000000))fail();
    let spent=0;const copy={};
    for(const [key,rank] of Object.entries(ranks)){
      const n=nodes.get(key);if(!n||!integer(rank,1,n.costs.length)||level<n.level)fail();
      for(const q of n.requires)if(!Object.hasOwn(ranks,q.id)||ranks[q.id]<q.rank)fail();
      for(const x of n.excludes)if(Object.hasOwn(ranks,x))fail();
      spent+=n.costs.slice(0,rank).reduce((a,b)=>a+b,0);Object.defineProperty(copy,key,{value:rank,enumerable:true});
    }
    if(spent>budget)fail();return Object.freeze({ranks:Object.freeze(copy),spent,remaining:budget-spent});
  }
  return Object.freeze({skill:definition.skill,nodes:Object.freeze([...nodes.values()]),inspect,
    purchase(ranks,key,level,budget){
      const before=inspect(ranks,level,budget),n=nodes.get(key);
      if(!n)fail();const rank=(Object.hasOwn(before.ranks,key)?before.ranks[key]:0)+1;
      return inspect({...before.ranks,[key]:rank},level,budget);
    }});
}
