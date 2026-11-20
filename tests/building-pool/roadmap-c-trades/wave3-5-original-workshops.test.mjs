// Roadmap C strict physical trade Wave03–05. Only three C-fenced new IDs.
import test from 'node:test';
import assert from 'node:assert/strict';
import {validateBlueprint,structuralFingerprint} from '../../../src/building-pool/roadmap-2b/schema.mjs';
import {createCCopperfordButcher} from '../../../src/building-pool/roadmap-c-trades/wave3-copperford-butcher.mjs';
import {createCSilverfinchJeweler} from '../../../src/building-pool/roadmap-c-trades/wave4-silverfinch-jeweler.mjs';
import {createCWrenfieldBookshop} from '../../../src/building-pool/roadmap-c-trades/wave5-wrenfield-bookshop.mjs';

const cases=[
 {build:createCCopperfordButcher,id:'r2:butcher:temperate:small:02',
  count:2927,ground:708,roof:708,window:18,
  void:{x0:17,x1:18,z0:22,z1:25},targets:'roomAccess',
  requirements:['sales-floor','service-counter','butcher-workspace','cold-storage']},
 {build:createCSilverfinchJeweler,id:'r2:jeweler:temperate:small:02',
  count:3043,ground:682,roof:682,window:22,
  void:{x0:16,x1:17,z0:19,z1:21},targets:'physicalPublicWaypoints',
  requirements:['sales-floor','service-counter','jewelry-display','secure-workroom']},
 {build:createCWrenfieldBookshop,id:'r2:bookshop:temperate:small:02',
  count:3911,ground:933,roof:933,window:20,
  void:{x0:17,x1:18,z0:23,z1:25},targets:'originalWalkTargets',
  requirements:['sales-floor','service-counter','bookshelves','reading-area']}
];

for(const spec of cases){
 test('C source exact category original geometry: '+spec.id,()=>{
  const b=spec.build(),v=validateBlueprint(b);
  assert.equal(b.id,spec.id);
  assert.equal(v.voxels,spec.count);
  assert.equal(b.voxels.filter(v=>v.kind==='foundation').length,spec.ground);
  assert.equal(b.voxels.filter(v=>v.kind==='roof').length,spec.roof);
  assert.equal(b.voxels.filter(v=>v.kind==='window').length,spec.window);
  assert.equal(b.worldPlaced,false);assert.equal(b.isolated,true);
  assert.equal(structuralFingerprint(b),structuralFingerprint(spec.build()));
  assert.ok(spec.requirements.every(use=>b.rooms.some(room=>room.uses.includes(use))),'lost functional room program');
  assert.equal(b.openings.filter(o=>o.type==='internal-doorway').length,4);
  assert.equal(b.openings.filter(o=>o.type==='window').length,spec.window);
  assert.equal(b[spec.targets].length,14,'missing actual source route witnesses');
 });
 test('C source groundless court and real continuously walkable physical rooms: '+spec.id,()=>{
  const b=spec.build(),has=new Set(b.voxels.map(v=>[v.x,v.y,v.z].join(','))),
   key=(x,y,z)=>[x,y,z].join(',');
  const standing=(x,z)=>has.has(key(x,0,z))&&has.has(key(x,1,z))
   &&[2,3,4].every(y=>!has.has(key(x,y,z)));
  const v=spec.void;let empty=0;
  for(let x=v.x0;x<=v.x1;x++)for(let z=v.z0;z<=v.z1;z++){
   for(let y=0;y<b.extents.y;y++)assert.ok(!has.has(key(x,y,z)),'fake source courtyard '+key(x,y,z));
   empty++;
  }
  assert.equal(empty,spec.id.includes('butcher')?8:6);
  const entry=b.openings.find(o=>o.type==='entrance');
  assert.ok(standing(entry.x,entry.z),'street entry is physically obstructed');
  const visited=new Set([entry.x+','+entry.z]),queue=[[entry.x,entry.z]];
  for(let i=0;i<queue.length;i++){
   const [x,z]=queue[i];
   for(const [dx,dz] of [[-1,0],[1,0],[0,-1],[0,1]]){
    const xx=x+dx,zz=z+dz,k=xx+','+zz;
    if(!visited.has(k)&&standing(xx,zz)){visited.add(k);queue.push([xx,zz]);}
   }
  }
  assert.ok(queue.length>130,'insufficient truly connected source floor');
  for(const node of b[spec.targets])assert.ok(visited.has(node.x+','+node.z),'fake unreachable room '+JSON.stringify(node));
  for(const o of b.openings.filter(x=>x.type==='entrance'||x.type==='internal-doorway')){
   assert.equal(o.clearHeightCells,3);
   assert.ok(standing(o.x,o.z),'metadata only entrance '+JSON.stringify(o));
  }
 });
}

test('Roadmap C trade waves 3–5 cannot repeat or recolor a source geometry within the new C portfolio',()=>{
 const b=cases.map(c=>c.build()),keys=new Set(b.map(x=>structuralFingerprint(x)));
 assert.equal(new Set(b.map(x=>x.id)).size,3);
 assert.equal(keys.size,3,'repeated original trade structure');
 assert.deepEqual(b.map(x=>x.voxels.length),[2927,3043,3911]);
});
