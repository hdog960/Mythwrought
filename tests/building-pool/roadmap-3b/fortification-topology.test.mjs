import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {slots} from '../../../src/building-pool/roadmap-3b/roster.mjs';
import {validateGatehouseTopology,validateCityWallTopology} from '../../../src/building-pool/roadmap-3b/fortification-topology.mjs';

const ledger=JSON.parse(readFileSync(new URL('../../../docs/building-pool/roadmap-c/FOUR_BUILDER_OWNERSHIP_FENCE_V1.json',import.meta.url),'utf8'));
const c=x=>x[0]+','+x[1]+','+x[2];

function builder(type,width,height,depth){
 const voxel=new Map(),modules=new Map();
 const add=(role,x,y,z)=>{
  const k=c([x,y,z]);assert.ok(!voxel.has(k),'duplicate '+k);
  voxel.set(k,role);
  if(!modules.has(role))modules.set(role,[]);
  modules.get(role).push([x,y,z,'builtin:stone']);
 };
 return {
  add,source(){
   return {id:'r3:'+type+':temperate:small:1',type,
    envelope:{x:0,y:0,z:0,width,height,depth},
    modules:[...modules].map(([role,cells])=>({id:role,role,cells})),
    navigation:{nodes:[{id:'entry'}],edges:[{from:'entry',to:'top',kind:'stair'}]},
    spaces:type==='gatehouse'?[{kind:'gateway'}]:[{kind:'battlement'},{kind:'wall-run'}]};
  }
 };
}
function gatehouse(){
 const a=builder('gatehouse',12,12,10);
 for(let x=0;x<12;x++)for(let z=0;z<10;z++){
  a.add('foundation',x,0,z);a.add('floor',x,1,z);
 }
 for(let z=0;z<10;z++){
  for(let y=2;y<=5;y++){a.add('wall',3,y,z);a.add('wall',6,y,z);}
  for(let x=4;x<=5;x++)a.add('roof',x,5,z);
 }
 a.add('stair',0,2,0);
 const b=a.source();
 b.openings=[{x:4,y:2,z:0,width:2,height:3,facing:'north'},
  {x:4,y:2,z:9,width:2,height:3,facing:'south'}];
 b.fortification={gateRoute:{axis:'z',floorY:2,width:2,height:3,
  points:Array.from({length:10},(_,z)=>[4,z])}};
 return b;
}
function wall(){
 const a=builder('city-wall',15,12,15),route=[];
 const vertices=[[2,2],[11,2],[11,11],[2,11],[2,2]];
 for(let i=1;i<vertices.length;i++){
  const [x,z]=vertices[i-1],[xx,zz]=vertices[i],dx=Math.sign(xx-x),dz=Math.sign(zz-z);
  for(let t=0;t<Math.abs(xx-x)+Math.abs(zz-z);t++){
   const xx2=x+dx*t,zz2=z+dz*t,gate=zz2===2&&(xx2===6||xx2===7);
   route.push([xx2,7,zz2]);
   a.add('foundation',xx2,0,zz2);a.add('floor',xx2,1,zz2);
   for(let y=2;y<=5;y++)if(!(gate&&y<=4))a.add('wall',xx2,y,zz2);
   a.add('rampart',xx2,6,zz2);
  }
 }
 a.add('stair',0,2,0);
 const b=a.source();
 b.fortification={wallPath:vertices,rampartRoute:route,gatePassages:[
  {axis:'z',floorY:2,width:2,height:3,points:[[6,1],[6,2],[6,3]]}
 ]};
 return b;
}
const remove=(b,x,y,z)=>{
 const copy=structuredClone(b);
 let removed=0;
 for(const m of copy.modules){const n=m.cells.length;m.cells=m.cells.filter(v=>v[0]!==x||v[1]!==y||v[2]!==z);removed+=n-m.cells.length;}
 assert.equal(removed,1);
 return copy;
};

test('Roadmap C v1 ownership fence locks exactly 146 genuinely empty 2B trade slots and protects all 205 prior sources',()=>{
 assert.equal(ledger.schema,'mythwrought.four-builder-ownership-fence.v1');
 assert.equal(ledger.status,'FROZEN-SNAPSHOT-source-only');
 const two=ledger.slots.roadmap2B,three=ledger.slots.roadmap3B;
 assert.equal(two.length,420);assert.equal(three.length,360);
 const both=[...two,...three];assert.equal(new Set(both.map(s=>s.id)).size,780);
 assert.equal(two.filter(x=>x.owner==='B'&&x.state==='source-preserved').length,205);
 assert.equal(two.filter(x=>x.owner==='C'&&x.state==='exclusively-reserved').length,146);
 assert.equal(two.filter(x=>x.owner==='D'&&x.state==='exclusively-reserved').length,69);
 assert.equal(three.filter(x=>x.owner==='C').length,360);
 assert.deepEqual(new Set(three.map(x=>x.id)),new Set([...slots()].map(x=>x.id)));
 const cCount=Object.fromEntries(['market-square','tailor','butcher','jeweler','bookshop'].map(cat=>
  [cat,two.filter(x=>x.owner==='C'&&x.id.startsWith('r2:'+cat+':')).length]));
 assert.deepEqual(cCount,{'market-square':31,tailor:33,butcher:32,jeweler:32,bookshop:18});
 assert.ok(two.every(x=>['B','C','D'].includes(x.owner)));
 assert.ok(two.filter(x=>x.owner==='C').every(x=>!['temple','theater'].includes(x.id.split(':')[1])));
});

test('real source-backed gatehouse permits 2-wide, 3-high opposite passages and supported high arch',()=>{
 const b=gatehouse(),report=validateGatehouseTopology(b);
 assert.equal(report.routeSteps,10);assert.equal(report.clearCells,20);
 assert.equal(report.oppositeAccess,true);
});

test('gatehouse rejects a voxel-hidden collision, fake side supports and wrong exit orientation',()=>{
 const b=gatehouse();
 const bad=structuredClone(b);
 bad.modules.find(m=>m.role==='roof').cells.push([4,3,5,'builtin:stone']);
 assert.throws(()=>validateGatehouseTopology(bad),/blocked physical gateway/);
 assert.throws(()=>validateGatehouseTopology(remove(b,3,3,5)),/flanking post/);
 const wrong=structuredClone(b);wrong.openings[1].facing='north';
 assert.throws(()=>validateGatehouseTopology(wrong),/oppositely oriented/);
});

test('city wall validates an actual source-connected, physically supported closed perimeter with a real overhead gate crossing',()=>{
 const b=wall(),report=validateCityWallTopology(b);
 assert.equal(report.perimeterCells,36);
 assert.equal(report.physicalRampartCells,36);
 assert.equal(report.gateCrossingCells,2);
 assert.equal(report.closed,true);
 assert.deepEqual(report.elevationRange,[7,7]);
});

test('city wall rejects ornamental gap, virtual gate, disconnected path and insufficient support',()=>{
 const b=wall();
 assert.throws(()=>validateCityWallTopology(remove(b,11,6,7)),/not physically walkable/);
 const gap=structuredClone(b);gap.fortification.rampartRoute[12][0]+=1;
 assert.throws(()=>validateCityWallTopology(gap),/does not match/);
 const virtual=structuredClone(b);virtual.fortification.gatePassages=[];
 assert.throws(()=>validateCityWallTopology(virtual),/no actual gatehouse passage/);
 const support=remove(b,2,3,7);
 assert.throws(()=>validateCityWallTopology(support),/foundation-to-rampart continuity/);
});
