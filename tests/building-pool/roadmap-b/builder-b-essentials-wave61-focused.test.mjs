// Builder B Wave61 focused original-source acceptance; no installed game physics claims.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildAlderwispThreeLanternSeedCourt,ALDERWISP_THREE_LANTERN_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave61.mjs';
import {structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
import {buildAlderglassTrellisConservatory} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave2.mjs';
import {buildRimeglassCrescentSunGreenhouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave7.mjs';
import {buildGlimmerboughSplitSunOrchidHouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave13.mjs';
import {buildAmberwellSandglassConservatory} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave17.mjs';
import {buildAuroracrestFoldedFrostSeedhouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave19.mjs';
import {buildCrystalfenStaggeredWinterglass} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave23.mjs';
import {buildStarpetalDoubleGardenOrchidarium} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave29.mjs';
import {buildWillowglassTripleAtriumConservatory} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave31.mjs';
import {buildSilverpineFourCourtWinterglass} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave37.mjs';
import {buildMoonfernTriskelionArboretum} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave40.mjs';
import {buildFrostmerefoldFourCourtWinterConservatory} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave48.mjs';
import {buildSolglassFourTerraceSunhouse} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave54.mjs';
import {buildHazelspireFourDrySeedTerraceConservatory} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave60.mjs';
const peers=[buildAlderglassTrellisConservatory,buildRimeglassCrescentSunGreenhouse,buildGlimmerboughSplitSunOrchidHouse,buildAmberwellSandglassConservatory,buildAuroracrestFoldedFrostSeedhouse,buildCrystalfenStaggeredWinterglass,buildStarpetalDoubleGardenOrchidarium,buildWillowglassTripleAtriumConservatory,buildSilverpineFourCourtWinterglass,buildMoonfernTriskelionArboretum,buildFrostmerefoldFourCourtWinterConservatory,buildSolglassFourTerraceSunhouse,buildHazelspireFourDrySeedTerraceConservatory];
const freeze=JSON.parse(readFileSync(new URL('../../../docs/building-pool/roadmap-b/BUILDER_BD_EXCLUSIVE_1B_FREEZE.json',import.meta.url),'utf8'));
const b=buildAlderwispThreeLanternSeedCourt();
const K=(x,y,z)=>[x,y,z].join(',');
const m=new Map(b.placements.map(p=>[p.at.join(','),p]));
const walk=new Set(b.walkable.map(p=>p.join(',')));
const trays=[['west-sun-tray',12,15,14,19],['east-sun-tray',16,15,18,19],['south-ledger-tray',12,27,18,28]];
const dirs={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]};
function reachable(start){
 assert.ok(walk.has(start));const q=[start],seen=new Set(q);
 for(let i=0;i<q.length;i++){const[x,,z]=q[i].split(',').map(Number);
  for(const[dx,dz]of Object.values(dirs)){const X=x+dx,Z=z+dz,k=K(X,1,Z);
   if(seen.has(k)||!walk.has(k)||m.has(K(X,1,Z))||m.has(K(X,2,Z))||m.get(K(X,0,Z))?.asset!=='live:stone')continue;
   seen.add(k);q.push(k);
  }
 }return seen;
}
test('Frozen exclusive B115 ownership and no runtime activation',()=>{
 assert.equal(b.id,ALDERWISP_THREE_LANTERN_ID);
 assert.equal(b.id,'r1:greenhouse:temperate:small:003');
 assert.deepEqual([freeze.priorAcceptedIds.length,freeze.builderB.ids.length,freeze.builderD.ids.length],[228,115,92]);
 assert.ok(freeze.builderB.ids.includes(b.id));assert.ok(!freeze.builderD.ids.includes(b.id));
 assert.ok(!freeze.priorAcceptedIds.includes(b.id));assert.equal(b.status,'candidate');
 assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
 assert.equal(b.architecturalIdentity.workingCrops,false);assert.equal(b.architecturalIdentity.workingIrrigation,false);
 assert.equal(b.architecturalIdentity.schema1SaveWritten,false);
});
test('Exact physical source counts and 837 real stone footing cells',()=>{
 assert.deepEqual(b.footprint,{width:31,height:19,depth:35});
 assert.equal(b.placements.length,2250);assert.equal(m.size,2250);
 assert.equal(walk.size,689);assert.equal(b.rooms.length,5);assert.equal(b.portals.length,10);
 let n=0;for(let x=2;x<=28;x++)for(let z=2;z<=32;z++){
  assert.equal(m.get(K(x,0,z))?.asset,'live:stone');assert.equal(m.get(K(x,0,z))?.role,'foundation');n++;
 }assert.equal(n,837);
});
test('Entrance reaches every walkable source cell, all portal points, actual room interiors and south exit',()=>{
 const seen=reachable(K(15,1,3));assert.equal(seen.size,689);
 for(const p of b.portals){assert.ok(seen.has(p.at.join(',')));const[x,y,z]=p.at;assert.ok(!m.has(K(x,y+1,z)));}
 for(const room of b.rooms){
  assert.ok([...seen].some(k=>{const[x,,z]=k.split(',').map(Number);return x>room.min[0]&&x<room.max[0]&&z>room.min[2]&&z<room.max[2];}),room.id);
 }assert.ok(seen.has(K(15,1,32)));
});
test('338 unresolved Pack3 roof cells in three genuine named wings, each immediately stone-backed',()=>{
 const n={};for(const p of b.placements.filter(p=>p.role==='roof')){
  const[x,y,z]=p.at;assert.ok(p.asset.startsWith('pack3:'));assert.equal(p.occupancy.kind,'unresolved');
  assert.equal(m.get(K(x,y-1,z))?.asset,'live:stone');
  n[p.alderwispWing]=(n[p.alderwispWing]||0)+1;
 }assert.deepEqual(n,{'north-seed-reception':120,'west-propagation-lantern':101,'east-drying-lantern':117});
});
test('Three original stone bearings are continuous from foundation to each actual roof',()=>{
 for(const[name,x,z]of [['north-seed-reception',8,3],['west-propagation-lantern',3,10],['east-drying-lantern',20,11]]){
  const roof=b.placements.find(p=>p.alderwispWing===name&&p.at[0]===x&&p.at[2]===z);
  assert.ok(roof,name);for(let y=0;y<roof.at[1];y++)assert.equal(m.get(K(x,y,z))?.asset,'live:stone',name+' '+y);
 }
});
test('44 physically solid dry-tray bases, 38 raised rim blocks and 12 accessible sides, no phantom walking',()=>{
 const seen=reachable(K(15,1,3));let base=0,rim=0,sides=0;
 for(const[name,x0,z0,x1,z1]of trays){
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   const p=m.get(K(x,1,z));assert.equal(p?.alderwispDryTray,name);assert.equal(p.asset,'live:stone');assert.ok(!walk.has(K(x,1,z)));base++;
   if(x===x0||x===x1||z===z0||z===z1){assert.equal(m.get(K(x,2,z))?.alderwispDryRim,name);rim++;}
   else assert.ok(!m.has(K(x,2,z)));
   for(let y=3;y<19;y++)assert.ok(!m.has(K(x,y,z)));
  }
  const cx=Math.floor((x0+x1)/2),cz=Math.floor((z0+z1)/2);
  for(const[x,z]of [[x0-1,cz],[x1+1,cz],[cx,z0-1],[cx,z1+1]]){assert.ok(seen.has(K(x,1,z)),name+' '+x+','+z);sides++;}
 }assert.deepEqual([base,rim,sides],[44,38,12]);
});
test('64 unresolved Pack4 panes occupy sixteen four-high genuine outward stone-framed bays',()=>{
 const bays=new Map();let count=0;
 for(const p of b.placements.filter(p=>p.role==='window')){
  const[x,y,z]=p.at;const d=dirs[p.orientation];assert.ok(d);assert.equal(p.asset,'pack4:030');assert.equal(p.occupancy.kind,'unresolved');
  assert.equal(m.get(K(x,1,z))?.asset,'live:stone');assert.equal(m.get(K(x,6,z))?.asset,'live:stone');
  assert.ok(!m.has(K(x+d[0],y,z+d[1])));const k=x+','+z;
  if(!bays.has(k))bays.set(k,[]);bays.get(k).push(y);count++;
 }assert.equal(count,64);assert.equal(bays.size,16);
 for(const ys of bays.values())assert.deepEqual(ys.sort((a,b)=>a-b),[2,3,4,5]);
});
function d4(v,flip,t){const s=new Set(),{width:w,height:h,depth:d}=v.footprint;
 for(const p of v.placements){const X=Math.floor(16*p.at[0]/w),Y=Math.floor(12*p.at[1]/h),Z=Math.floor(16*p.at[2]/d),A=flip?15-X:X;
 let x=A,z=Z;if(t===1)[x,z]=[Z,15-A];if(t===2)[x,z]=[15-A,15-Z];if(t===3)[x,z]=[15-Z,A];s.add([x,Y,z,p.role].join('/'));}return s;
}
test('Thirteen authentic earlier greenhouse constructors and 104 unchanged D4 checks below 0.85',()=>{
 const target=d4(b,false,0);let total=0,max=0,closest=null;
 const fingerprint=structuralFingerprint(b);
 for(const create of peers){const old=create();assert.notEqual(old.id,b.id);assert.notEqual(structuralFingerprint(old),fingerprint);
  for(const flip of [false,true])for(let t=0;t<4;t++){const s=d4(old,flip,t);let n=0;for(const k of target)if(s.has(k))n++;
   const v=n/(s.size+target.size-n);assert.ok(v<0.85,old.id+' '+v);total++;if(v>max){max=v;closest=old.id;}
  }
 }assert.equal(total,104);console.log('ALDERWISP_104_D4 '+JSON.stringify({total,max,closest}));
});
