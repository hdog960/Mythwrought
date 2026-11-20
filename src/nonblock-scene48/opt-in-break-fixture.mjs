// Candidate-only, opt-in non-block interaction fixture. Never writes production saves.
import {createSceneMesh,SCENE_FAMILIES} from './flora-phase1.mjs';
export const INTERACTION_FIXTURE_VERSION='nonblock-interaction-fixture-v1';
const validAnchor=a=>Array.isArray(a)&&a.length===3&&a.every(Number.isSafeInteger);
export function fixtureInstance({sceneId,seed,anchor,variant=0}){
 if(!Object.hasOwn(SCENE_FAMILIES,sceneId)||!Number.isSafeInteger(seed)||!validAnchor(anchor)||!Number.isSafeInteger(variant)||variant<0||variant>255)throw new TypeError('invalid deterministic object identity');
 const {mesh}=createSceneMesh(sceneId,seed,...anchor);
 if(!mesh?.positions?.length||mesh.positions.length%9)throw new TypeError('invalid triangle mesh');
 const p=mesh.positions,lo=[Infinity,Infinity,Infinity],hi=[-Infinity,-Infinity,-Infinity];
 for(let i=0;i<p.length;i+=3)for(let k=0;k<3;k++){const v=p[i+k];if(!Number.isFinite(v))throw new TypeError('nonfinite mesh');lo[k]=Math.min(lo[k],v);hi[k]=Math.max(hi[k],v);}
 const instanceKey=JSON.stringify([seed,sceneId,...anchor,variant]);
 return Object.freeze({sceneId,seed,anchor:Object.freeze([...anchor]),variant,instanceKey,mesh,selectionAabb:Object.freeze({min:lo.map((v,i)=>v+anchor[i]),max:hi.map((v,i)=>v+anchor[i])}),collision:'pass-through',attachment:'ground',breakAction:'tombstone-instance',respawn:'never-until-explicit-reset'});
}
export function makeOptInBreakFixture(instances,initialTombstones=[]){
 if(!Array.isArray(instances)||!Array.isArray(initialTombstones))throw new TypeError('invalid fixture input');
 const objects=new Map();
 for(const desc of instances){const item=fixtureInstance(desc);if(objects.has(item.instanceKey))throw new Error('duplicate instance identity');objects.set(item.instanceKey,item);}
 const removed=new Set(initialTombstones);
 if(initialTombstones.some(k=>typeof k!=='string'))throw new TypeError('invalid tombstone');
 return Object.freeze({
  visible:()=>[...objects.values()].filter(o=>!removed.has(o.instanceKey)),
  pickPoint:(point)=>{if(!Array.isArray(point)||point.length!==3||!point.every(Number.isFinite))throw new TypeError('invalid pick point');return [...objects.values()].filter(o=>!removed.has(o.instanceKey)&&point.every((v,k)=>v>=o.selectionAabb.min[k]&&v<=o.selectionAabb.max[k])).sort((a,b)=>a.instanceKey.localeCompare(b.instanceKey))[0]??null;},
  breakByKey:(key)=>{if(!objects.has(key)||removed.has(key))return false;removed.add(key);return true;},
  tombstoneSidecar:()=>Object.freeze({version:INTERACTION_FIXTURE_VERSION,removed:[...removed].sort()})
 });
}
