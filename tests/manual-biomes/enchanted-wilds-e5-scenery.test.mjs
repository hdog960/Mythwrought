import test from 'node:test';
import assert from 'node:assert/strict';
import {WildsFamilyResearchWorld,wildsRegionAt} from '../../src/manual-biomes/enchanted-wilds-family-source.mjs';
import {WILDS_GROUND_FAMILIES} from '../../src/manual-biomes/enchanted-wilds-ground.mjs';
import {WILDS_SCENERY_FAMILIES,planWildsScenery,openWildsScenery,WILDS_SCENERY_WORLD_ID} from '../../src/manual-biomes/enchanted-wilds-scenery.mjs';
import {candidateVertices,describeCandidateObject} from '../../src/nonblock/candidate-scene.mjs';
import {BLOCK} from '../../src/voxel.mjs';
const store=()=>{const m=new Map();return {m,getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)};};
const key=p=>p.anchor.join(',');
test('18 actual registered ground scenery identities, four authored variants each, finite original packed geometry',()=>{
 assert.equal(WILDS_GROUND_FAMILIES.length+WILDS_SCENERY_FAMILIES.length,24);
 assert.equal(new Set(WILDS_SCENERY_FAMILIES).size,18);
 let maxBytes=0;const rows=[];
 for(const id of WILDS_SCENERY_FAMILIES){
   let vertices=0;
   for(let variant=0;variant<4;variant++){
     const o=describeCandidateObject(179,{sceneId:id,anchor:[0,10,0],variant,orientation:0});
     assert.deepEqual(o.supports,[[0,9,0]]);
     const packed=candidateVertices([o]);
     assert.ok(packed.length>0&&packed.length%27===0&&packed.every(Number.isFinite));
     maxBytes=Math.max(maxBytes,packed.byteLength);vertices+=packed.length/9;
   }
   rows.push({id,vertices});
 }
 console.log('WILDS E5 SOURCE GEOMETRY',JSON.stringify({families:rows,maxBytes}));
});
test('real forest source placements, deterministic shared-window identities and bounded original scene owner',()=>{
 const w=new WildsFamilyResearchWorld(179),found=new Map();let maxBytes=0,maxCount=0,windows=0;
 // Broad but bounded real-source search, stop as soon as all families witnessed.
 outer:for(let cz=-48;cz<=-16;cz+=3)for(let cx=-18;cx<=18;cx+=3){
   const plan=planWildsScenery(w,cx,cz,wildsRegionAt);
   if(!plan.length)continue;
   const scene=openWildsScenery(w,cx,cz,wildsRegionAt,{storage:store()});
   const objects=scene.visible();assert.equal(objects.length,plan.length);
   assert.ok(objects.length<=27);assert.equal(new Set(plan.map(key)).size,plan.length);
   for(const p of plan){assert.notEqual(wildsRegionAt(p.anchor[0],p.anchor[2],179),null);found.set(p.sceneId,p.anchor);}
   const verts=candidateVertices(objects);assert.ok(verts.every(Number.isFinite));
   maxBytes=Math.max(maxBytes,verts.byteLength);maxCount=Math.max(maxCount,objects.length);windows++;
   if(found.size===18)break outer;
 }
 assert.equal(found.size,18,'all proposed reused scenery must have actual natural placement witnesses');
 const a=planWildsScenery(w,-3,-33,wildsRegionAt),b=planWildsScenery(w,-2,-33,wildsRegionAt);
 const owned=p=>Math.floor(p.anchor[0]/16)>=-3&&Math.floor(p.anchor[0]/16)<=-2;
 assert.deepEqual(a.filter(owned),b.filter(owned));
 assert.deepEqual(planWildsScenery(new WildsFamilyResearchWorld(179),-3,-33,wildsRegionAt),a);
 console.log('WILDS E5 NATURAL SCENERY',JSON.stringify({windows,maxCount,maxBytes,witnesses:[...found]}));
});
test('original triangle selection and removal sidecar; edits hide scene without changing deterministic layout',()=>{
 const w=new WildsFamilyResearchWorld(179),storage=store();
 storage.setItem('historical-bytes','unchanged');
 const cx=-3,cz=-33,layout=planWildsScenery(w,cx,cz,wildsRegionAt);
 assert.ok(layout.length>0);
 const scene=openWildsScenery(w,cx,cz,wildsRegionAt,{storage});
 let hit=null,origin,direction;
 outer:for(const o of scene.visible()){
  const p=o.positions;
  for(let i=0;i<p.length;i+=9){
   const a=Array.from(p.slice(i,i+3)),b=Array.from(p.slice(i+3,i+6)),c=Array.from(p.slice(i+6,i+9));
   const u=b.map((v,j)=>v-a[j]),v=c.map((v,j)=>v-a[j]);
   const n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],len=Math.hypot(...n);
   if(len<1e-8)continue;
   const center=a.map((v,j)=>(v+b[j]+c[j])/3);
   for(const sign of [1,-1]){
     origin=center.map((v,j)=>v+sign*n[j]/len*.1);
     direction=n.map(v=>-sign*v/len);
     const h=scene.pick(origin,direction,1);
     if(h?.instanceKey===o.instanceKey){hit=h;break outer;}
   }
  }
 }
 assert.ok(hit,'actual triangle pick required');
 assert.equal(scene.breakHit(hit,origin,direction),true);
 const cold=openWildsScenery(new WildsFamilyResearchWorld(179),cx,cz,wildsRegionAt,{storage});
 assert.ok(!cold.visible().some(o=>o.instanceKey===hit.instanceKey));
 assert.equal(storage.getItem('historical-bytes'),'unchanged');
 assert.ok([...storage.m.keys()].filter(k=>k!=='historical-bytes').every(k=>k.includes(encodeURIComponent(WILDS_SCENERY_WORLD_ID))));
 const remaining=cold.visible()[0];assert.ok(remaining);
 const [x,y,z]=remaining.anchor;
 assert.equal(w.set(x,y,z,BLOCK.STONE),true);
 assert.deepEqual(planWildsScenery(w,cx,cz,wildsRegionAt),layout);
 const edited=openWildsScenery(w,cx,cz,wildsRegionAt,{storage});
 assert.ok(!edited.visible().some(o=>o.instanceKey===remaining.instanceKey));
 console.log('WILDS E5 ORIGINAL PICK REMOVAL',JSON.stringify({removed:hit.sceneId,edited:remaining.sceneId,sidecarRecords:storage.m.size-1}));
});
