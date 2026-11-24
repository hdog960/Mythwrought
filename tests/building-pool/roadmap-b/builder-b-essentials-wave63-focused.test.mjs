import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildSaffronveilShadeConservatory,SAFFRONVEIL_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave63.mjs';
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
import {buildAlderwispThreeLanternSeedCourt} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave61.mjs';
import {buildFrostwillowSixColdframes} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave62.mjs';
const peers=[buildAlderglassTrellisConservatory,buildRimeglassCrescentSunGreenhouse,buildGlimmerboughSplitSunOrchidHouse,buildAmberwellSandglassConservatory,buildAuroracrestFoldedFrostSeedhouse,buildCrystalfenStaggeredWinterglass,buildStarpetalDoubleGardenOrchidarium,buildWillowglassTripleAtriumConservatory,buildSilverpineFourCourtWinterglass,buildMoonfernTriskelionArboretum,buildFrostmerefoldFourCourtWinterConservatory,buildSolglassFourTerraceSunhouse,buildHazelspireFourDrySeedTerraceConservatory,buildAlderwispThreeLanternSeedCourt,buildFrostwillowSixColdframes];
const freeze=JSON.parse(readFileSync(new URL('../../../docs/building-pool/roadmap-b/BUILDER_BD_EXCLUSIVE_1B_FREEZE.json',import.meta.url),'utf8'));
const b=buildSaffronveilShadeConservatory(),K=(x,y,z)=>[x,y,z].join(',');
const m=new Map(b.placements.map(p=>[p.at.join(','),p])),walk=new Set(b.walkable.map(p=>p.join(',')));
const dirs={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]};
const halls=[['west-seed-vault',5,7,16,27],['east-drying-house',29,9,41,31],['north-record-pavilion',19,4,26,13],['central-open-shade',20,21,26,29]];
const beds=[['west-seed-stone-tray',8,11,12,15,true],['east-drying-stone-tray',32,15,36,19,true],['north-sun-ledger',20,15,25,17,false],['south-hardening-bed',20,32,25,34,false]];
function bfs(start,allow=()=>true){assert.ok(walk.has(start));const q=[start],seen=new Set(q);for(let i=0;i<q.length;i++){const[x,,z]=q[i].split(',').map(Number);for(const[dx,dz]of Object.values(dirs)){const X=x+dx,Z=z+dz,k=K(X,1,Z);if(!allow(X,Z)||seen.has(k)||!walk.has(k)||m.has(K(X,2,Z))||m.get(K(X,0,Z))?.asset!=='live:stone')continue;seen.add(k);q.push(k);}}return seen;}
test('Frozen B115-exclusive desert medium greenhouse and no registration or simulation',()=>{
 assert.equal(b.id,SAFFRONVEIL_ID);assert.equal(b.id,'r1:greenhouse:desert:medium:003');
 assert.deepEqual([freeze.priorAcceptedIds.length,freeze.builderB.ids.length,freeze.builderD.ids.length],[228,115,92]);assert.ok(freeze.builderB.ids.includes(b.id));assert.ok(!freeze.builderD.ids.includes(b.id));assert.ok(!freeze.priorAcceptedIds.includes(b.id));assert.equal(b.status,'candidate');assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
 for(const k of ['workingCrops','workingIrrigation','workingClimateControl','productionRegistered','schema1SaveWritten'])assert.equal(b.architecturalIdentity[k],false);
});
test('Unique source placements and all 1505 contiguous original stone foundations',()=>{
 assert.deepEqual(b.footprint,{width:47,height:21,depth:39});assert.equal(m.size,4471);assert.equal(b.placements.length,m.size);assert.equal(walk.size,1253);assert.equal(b.rooms.length,6);assert.equal(b.portals.length,13);
 let n=0;for(let x=2;x<=44;x++)for(let z=2;z<=36;z++){assert.equal(m.get(K(x,0,z))?.asset,'live:stone');n++;}assert.equal(n,1505);
});
test('Exterior entry physically reaches every two-high source walk node and named room interior',()=>{
 const seen=bfs(K(10,1,7));assert.equal(seen.size,walk.size);
 for(const p of b.portals){const[x,y,z]=p.at;assert.ok(seen.has(p.at.join(',')));assert.ok(!m.has(K(x,y+1,z)));}
 for(const room of b.rooms)assert.ok([...seen].some(k=>{const[x,,z]=k.split(',').map(Number);return x>room.min[0]&&x<room.max[0]&&z>room.min[2]&&z<room.max[2];}),room.id);
});
test('694 actual roof cells in four occupied sections, every roof backed and sixteen corner bearings solid',()=>{
 const roofs=b.placements.filter(p=>p.role==='roof'),counts={};for(const p of roofs){const[x,y,z]=p.at;assert.ok(p.asset.startsWith('pack3:'));assert.equal(p.occupancy.kind,'unresolved');assert.equal(m.get(K(x,y-1,z))?.asset,'live:stone');counts[p.saffronveilWing]=(counts[p.saffronveilWing]||0)+1;}
 assert.deepEqual(counts,{'west-seed-vault':252,'east-drying-house':299,'north-record-pavilion':80,'central-open-shade':63});
 for(const[name,x0,z0,x1,z1]of halls)for(const[x,z]of [[x0,z0],[x0,z1],[x1,z0],[x1,z1]]){const p=roofs.find(p=>p.saffronveilWing===name&&p.at[0]===x&&p.at[2]===z);assert.ok(p);for(let y=0;y<p.at[1];y++)assert.equal(m.get(K(x,y,z))?.asset,'live:stone');}
});
test('All four dry trays physically founded, 86 body cells and 60 rims, sixteen accessible sides',()=>{
 const seen=bfs(K(10,1,7));let body=0,rim=0,sides=0;
 for(const[name,x0,z0,x1,z1,sheltered]of beds){
 for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
 const p=m.get(K(x,1,z));assert.equal(p?.saffronveilBed,name);assert.equal(p.asset,'live:stone');assert.equal(p.sheltered,sheltered);assert.ok(!walk.has(K(x,1,z)));body++;
 if(x===x0||x===x1||z===z0||z===z1){assert.equal(m.get(K(x,2,z))?.saffronveilRim,name);rim++;}else assert.ok(!m.has(K(x,2,z)));
 let roof=false;for(let y=3;y<21;y++){const p=m.get(K(x,y,z));if(p?.role==='roof')roof=true;if(!sheltered)assert.ok(!p);}assert.equal(roof,sheltered);
 }const cx=Math.floor((x0+x1)/2),cz=Math.floor((z0+z1)/2);
 for(const[x,z]of [[x0-1,cz],[x1+1,cz],[cx,z0-1],[cx,z1+1]]){assert.ok(seen.has(K(x,1,z)),name+' '+x+','+z);sides++;}}
 assert.deepEqual([body,rim,sides],[86,60,16]);
});
test('Three enclosed pavilion wall envelopes close to roof backing except two-high doors and framed windows',()=>{
 const door=new Set(b.portals.map(p=>p.at[0]+','+p.at[2]));let checked=0;
 for(const[name,x0,z0,x1,z1]of halls.slice(0,3))for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
 if(x!==x0&&x!==x1&&z!==z0&&z!==z1)continue;
 const p=b.placements.find(p=>p.saffronveilWing===name&&p.at[0]===x&&p.at[2]===z);assert.ok(p);
 for(let y=1;y<p.at[1];y++){if(y<=2&&door.has(x+','+z))continue;const cell=m.get(K(x,y,z));assert.ok(cell&&(cell.asset==='live:stone'||cell.role==='window'));checked++;}}
 assert.ok(checked>1000);
});
test('Open shade canopy has 59 physically clear ground cells, all four directional entrances and independent cross-plaza path',()=>{
 const inside=(x,z)=>x>=20&&x<=26&&z>=21&&z<=29;
 const seen=bfs(K(23,1,21),inside);assert.equal(seen.size,59);
 for(const[x,z]of [[23,21],[23,29],[20,25],[26,25]])assert.ok(seen.has(K(x,1,z)));
 const open=bfs(K(18,1,14),(x,z)=>x>=17&&x<=28&&z>=14&&z<=36);
 assert.ok(open.has(K(27,1,36)));assert.ok(open.has(K(23,1,25)));
});
test('Real interior seed partition contains 24 solid timber cells and two two-high clear passages',()=>{
 let n=0;for(let x=6;x<=15;x++)for(let y=1;y<=3;y++){
 if(x===10||x===11){assert.ok(!m.has(K(x,y,19)));continue;}
 assert.equal(m.get(K(x,y,19))?.saffronveilSeedDivision,true);n++;}
 assert.equal(n,24);for(const x of [10,11])for(const z of [18,19,20])assert.ok(walk.has(K(x,1,z)));
});
test('Actual outward four-high unresolved glazing with solid stone sills and headers',()=>{
 const bays=new Map();let count=0;
 for(const p of b.placements.filter(p=>p.role==='window')){const[x,y,z]=p.at,d=dirs[p.orientation];assert.ok(d);assert.equal(p.asset,'pack4:030');assert.equal(p.occupancy.kind,'unresolved');assert.equal(m.get(K(x,1,z))?.asset,'live:stone');assert.equal(m.get(K(x,6,z))?.asset,'live:stone');assert.ok(!m.has(K(x+d[0],y,z+d[1])));const k=x+','+z;if(!bays.has(k))bays.set(k,[]);bays.get(k).push(y);count++;}
 assert.equal(count,40);assert.equal(bays.size,10);for(const ys of bays.values())assert.deepEqual(ys.sort((a,b)=>a-b),[2,3,4,5]);
});
const shape=(v,flip,t)=>{const s=new Set(),{width:w,height:h,depth:d}=v.footprint;for(const p of v.placements){const X=Math.floor(16*p.at[0]/w),Y=Math.floor(12*p.at[1]/h),Z=Math.floor(16*p.at[2]/d),A=flip?15-X:X;let x=A,z=Z;if(t===1)[x,z]=[Z,15-A];if(t===2)[x,z]=[15-A,15-Z];if(t===3)[x,z]=[15-Z,A];s.add([x,Y,z,p.role].join('/'));}return s;};
test('Fifteen prior original greenhouse constructors and 120 strict unchanged D4 comparisons',()=>{
 const target=shape(b,false,0),fp=structuralFingerprint(b);let total=0,max=0,closest=null;
 for(const fn of peers){const old=fn();assert.notEqual(old.id,b.id);assert.notEqual(structuralFingerprint(old),fp);for(const flip of [false,true])for(let t=0;t<4;t++){const s=shape(old,flip,t);let n=0;for(const k of target)if(s.has(k))n++;const v=n/(s.size+target.size-n);assert.ok(v<0.85,old.id+' '+v);total++;if(v>max){max=v;closest=old.id;}}}
 assert.equal(total,120);console.log('SAFFRONVEIL_120_D4 '+JSON.stringify({total,max,closest}));
});
