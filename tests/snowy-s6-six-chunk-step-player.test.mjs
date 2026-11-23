import assert from 'node:assert/strict';
import test from 'node:test';
import {auditSnowS6CrossOwnerForest as audit}
  from '../src/manual-biomes/snowy-s6-cross-owner-forest-audit.mjs';
import {proposedSnowTree} from '../src/manual-biomes/snowy-s3-tree-prototypes.mjs';
const M7='mythwrought-five-surface-regions-v7';
const key=(x,y,z)=>x+','+y+','+z;
function fixture(seed=179){
 const edits=new Map(),caves=new Map(),other=new Map();
 const get=(x,y,z)=>edits.get(key(x,y,z))??other.get(key(x,y,z))??
   (y===6?272:y===5?278:y<5?3:0);
 const world={seed,edits,generationProfile:{generator:M7},
   environmentCaves:{get:(...a)=>caves.get(key(...a))},
   get,naturalAndLandmarkBlock:get,_environmentBaseline:get,
   _columnPlan:()=>new Map([[5,278],[6,272]]),
   save:()=>({schema:1,seed,edits:[...edits]})};
 const collides=(w,x,feet,z)=>{
   const r=.28,h=1.78,e=1e-5;
   for(let bx=Math.floor(x-r+e);bx<=Math.floor(x+r-e);bx++)
     for(let bz=Math.floor(z-r+e);bz<=Math.floor(z+r-e);bz++)
       for(let by=Math.floor(feet+e);by<=Math.floor(feet+h-e);by++)
         if(w.get(bx,by,bz)!==0)return true;
   return false;
 };
 const deps={biomeAt:()=>({name:'snow',weight:.96}),terrainHeight:()=>5,
   legacyNatural:()=>0,proposedSnowTree,planScenery:()=>[],
   describeScene:()=>null,collides};
 return {world,deps,edits,caves,other};
}
test('default original four-chunk evidence remains frozen and no walking is implied',()=>{
 const {world,deps}=fixture();
 const a=audit(world,-1,32,deps);
 assert.equal(a.safe,true,a.reason);
 assert.deepEqual(a.window,[-1,32,2,2]);
 assert.equal(a.chunks.length,4);
 assert.equal(a.originalStepPlayerSourceUsed,false);
 assert.equal(a.originalStepFrames,0);
 assert.equal(a.originalWalkedTrees,0);
 assert.deepEqual(a.walks,[]);
});
test('six-chunk cross-owner union is stable in both request directions',()=>{
 const {world,deps}=fixture();
 const before=JSON.stringify(world.save());
 const a=audit(world,-2,32,deps,{width:3,height:2});
 const b=audit(world,-2,32,deps,{width:3,height:2,reverse:true});
 assert.equal(a.safe,true,a.reason);
 assert.deepEqual(a.window,[-2,32,3,2]);
 assert.equal(a.chunks.length,6);
 assert.deepEqual(b,a);
 assert.ok(a.distinctAcceptedTrees>=1);
 assert.equal(a.distinctAcceptedTrees,a.trees.length);
 assert.ok(a.physicalCells>0);
 assert.ok(a.chunks.every(c=>c.physicalCells<=640));
 assert.equal(JSON.stringify(world.save()),before);
});
test('detached movement callback is explicitly labeled non-native in fixtures',()=>{
 const {world,deps}=fixture();
 let calls=0;
 const mockStep=(w,p)=>{calls++;p.z+=.01;};
 const a=audit(world,-2,32,deps,{width:3,height:2,stepPlayer:mockStep});
 assert.equal(a.safe,true,a.reason);
 assert.equal(a.originalStepPlayerSourceUsed,true);
 assert.ok(a.originalStepFrames>=45);
 assert.ok(a.originalWalkedTrees>=1);
 assert.equal(a.originalStepFrames,calls);
 assert.ok(a.walks.every(w=>w.frames===45));
 assert.ok(a.walks.every(w=>Object.isFrozen(w)));
});
test('invalid wide dimensions and nonfunction movement callback cannot bypass gate',()=>{
 const {world,deps}=fixture();
 for(const options of [{width:4,height:2},{width:1,height:2},
  {width:3,height:3},{height:1},{width:-1},{stepPlayer:'fake'},
  {reverse:'unknown'}]){
   const result=audit(world,-2,32,deps,options);
   assert.equal(result.safe,false,JSON.stringify(options));
   assert.match(result.reason,/source-contract/);
 }
});
test('original world saved edits triggered by malicious movement callbacks fail closed',()=>{
 const {world,deps,edits}=fixture();
 let once=false;
 const malicious=(w,p)=>{p.z+=.01;
   if(!once){once=true;edits.set('999,9,999',0);}};
 const result=audit(world,-2,32,deps,{width:3,height:2,stepPlayer:malicious});
 assert.equal(result.safe,false);
 assert.match(result.reason,/schema-1-save-mutated/);
 assert.equal(edits.get('999,9,999'),0);
});
test('stepPlayer returning an invalid or penetrating pose never creates accepted forest',()=>{
 const {world,deps}=fixture();
 const broken=(w,p)=>{p.x=NaN;};
 const result=audit(world,-2,32,deps,{width:3,height:2,stepPlayer:broken});
 assert.equal(result.safe,false);
 assert.match(result.reason,/penetration-or-invalid-pose/);
});
