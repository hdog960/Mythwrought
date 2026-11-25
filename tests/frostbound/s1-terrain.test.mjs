import test from 'node:test';
import assert from 'node:assert/strict';
import {planFrostboundColumn,frostboundWindField} from '../../src/frostbound/s1-terrain.mjs';
import {FrostboundS1Candidate} from '../../src/frostbound/s1-candidate.mjs';
import {FourRegionWorld,fourRegionProfile,M8_MOUNTAIN_GENERATOR} from '../../src/manual-biomes/profile-world.mjs';
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import {terrainHeight,meshChunk} from '../../src/voxel.mjs';
const snow={name:'snow',weight:1};
const context=(extra={})=>({x:0,z:0,seed:179,region:snow,original:new Map(),oldTop:5,
 readRaw:(x,y,z)=>y===5?1:y<5?2:0,caveAt:()=>undefined,maxY:19,...extra});
function driftSite(){for(let x=-100;x<100;x++)for(let z=-100;z<100;z++)
 if(frostboundWindField(x,z,179)>.85)return [x,z];throw Error('no drift');}
test('ordinary snow grass cap changes physically, retaining original source below and above',()=>{
 const c=context(),p=planFrostboundColumn(c);
 assert.equal(p.size,1);assert.ok([272,279].includes(p.get(5)));assert.equal(c.original.size,0);
 assert.equal(planFrostboundColumn(context({caveAt:()=>0})).size,0);
 assert.equal(planFrostboundColumn(context({readRaw:()=>6})).size,0);
});
test('natural lee drift is one supported physical layer, no original mutation, cave and overhang veto',()=>{
 const [x,z]=driftSite(),original=new Map([[5,278],[6,272]]);
 const c=context({x,z,original}),p=planFrostboundColumn(c);
 assert.deepEqual([...p],[[5,278],[6,278],[7,272]]);
 assert.deepEqual([...original],[[5,278],[6,272]]);
 for(const y of [5,6,7,8])assert.equal(planFrostboundColumn({...c,caveAt:(a,b)=>b===y?0:undefined}),original);
 assert.equal(planFrostboundColumn({...c,readRaw:(a,b)=>b===8?4:0}),original);
 assert.equal(planFrostboundColumn({...c,maxY:8}),original);
});
test('non-snow, weak shoulders, non-winter caps and prior high envelope unchanged',()=>{
 const original=new Map([[5,401]]);
 for(const region of [null,{name:'mountain',weight:1},{name:'snow',weight:.64},snow])
 assert.equal(planFrostboundColumn(context({region,original})),original);
});
test('actual combined profile candidate: deterministic source columns, protected cave cells, physical mine and build, no historical save alias',()=>{
 const seed=179,base=new FourRegionWorld(seed,fourRegionProfile(seed,M8_MOUNTAIN_GENERATOR));
 const w=new FrostboundS1Candidate(seed,{maxCachedColumns:32});
 let changed=0,first=null;
 for(let x=-96;x<=96;x+=4)for(let z=400;z<=624;z+=4){
  const region=v6BiomeAt(x,z,seed);if(region?.name!=='snow')continue;
  const a=base._columnPlan(x,z),b=w._columnPlan(x,z);
  if(JSON.stringify([...a])===JSON.stringify([...b]))continue;
  changed++;
  for(const [y,id] of b){
   if(a.get(y)===id)continue;
   assert.equal(w.environmentCaves.get(x,y,z),undefined);
   assert.equal(w.get(x,y,z),id);
   if(!first)first=[x,y,z,id];
  }
 }
 assert.ok(changed>0,'actual source snow columns must change');
 assert.ok(w._frostColumns.size<=32);
 const [x,y,z,id]=first;
 assert.equal(w.get(x,y,z),id);assert.equal(w.set(x,y,z,0),true);assert.equal(w.get(x,y,z),0);
 assert.equal(w.set(x,y,z,3),true);assert.equal(w.get(x,y,z),3);
 assert.throws(()=>w.save(),/not a registered durable generator/);
 assert.equal(base.get(x,y,z),base.naturalAndLandmarkBlock(x,y,z));
 console.log('FROSTBOUND_S1_ACTUAL '+JSON.stringify({changed,first,cache:w._frostColumns.size}));
});
