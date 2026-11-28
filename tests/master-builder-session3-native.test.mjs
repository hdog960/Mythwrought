import test from 'node:test';import assert from 'node:assert/strict';
import {getM1Blueprints} from '../src/building-pool/roadmap-1a/legacy-buildings.mjs';
import {getM1InnExemplars} from '../src/building-pool/roadmap-1a/m1-inn-exemplars.mjs';
import {getM2Originals} from '../src/building-pool/roadmap-1a/m2-originals.mjs';
import {getM2HousingTranche} from '../src/building-pool/roadmap-1a/m2-housing-tranche.mjs';
import {getM2HousingWave2} from '../src/building-pool/roadmap-1a/m2-housing-wave2.mjs';
import {getM2HousingWave3} from '../src/building-pool/roadmap-1a/m2-housing-wave3.mjs';
import {getM2HousingWave4} from '../src/building-pool/roadmap-1a/m2-housing-wave4.mjs';
import {getM2HousingWave5} from '../src/building-pool/roadmap-1a/m2-housing-wave5.mjs';
import {getM2HousingWave6} from '../src/building-pool/roadmap-1a/m2-housing-wave6.mjs';
import {getM2HousingWave7} from '../src/building-pool/roadmap-1a/m2-housing-wave7.mjs';
import {getM2HousingWave8} from '../src/building-pool/roadmap-1a/m2-housing-wave8.mjs';
import {getM2HousingWave9} from '../src/building-pool/roadmap-1a/m2-housing-wave9.mjs';
import {getHospitalityWave1} from '../src/building-pool/roadmap-1a/m3-hospitality-wave1.mjs';
import {getHospitalityWave2} from '../src/building-pool/roadmap-1a/m3-hospitality-wave2.mjs';
import {getHospitalityWave3} from '../src/building-pool/roadmap-1a/m3-hospitality-wave3.mjs';
import {getHospitalityWave4} from '../src/building-pool/roadmap-1a/m3-hospitality-wave4.mjs';
import {getHospitalityWave5} from '../src/building-pool/roadmap-1a/m3-hospitality-wave5.mjs';
import {getHospitalityWave6} from '../src/building-pool/roadmap-1a/m3-hospitality-wave6.mjs';
import {getHospitalityWave7} from '../src/building-pool/roadmap-1a/m3-hospitality-wave7.mjs';
import {getHospitalityWave8} from '../src/building-pool/roadmap-1a/m3-hospitality-wave8.mjs';
import {getHospitalityWave9} from '../src/building-pool/roadmap-1a/m3-hospitality-wave9.mjs';
import {getRoadmapC1AHousesWave10,ROADMAP_C_1A_WAVE10_IDS} from '../src/building-pool/roadmap-1a/m2-housing-wave10-roadmap-c.mjs';
import {validateBlueprint,validatePool,structuralFingerprint} from '../src/building-pool/roadmap-1a/legacy-schema.mjs';
import {auditM1PhysicalSources} from '../src/building-pool/roadmap-1a/m1-physical-sources.mjs';
import {getRoadmapC1AInnWave11,ROADMAP_C_1A_WAVE11_IDS} from '../src/building-pool/roadmap-1a/m3-inn-wave11-roadmap-c.mjs';
import {getRoadmapC1AHousesWave12,ROADMAP_C_1A_WAVE12_IDS} from '../src/building-pool/roadmap-1a/m2-housing-wave12-roadmap-c.mjs';
import {getRoadmapC1AHousesWave13,ROADMAP_C_1A_WAVE13_IDS} from '../src/building-pool/roadmap-1a/m2-housing-wave13-roadmap-c.mjs';
import {getRoadmapC1AHousesWave14,ROADMAP_C_1A_WAVE14_IDS} from '../src/building-pool/roadmap-1a/m2-housing-wave14-roadmap-c.mjs';
import {getRoadmapC1AHousesWave15,ROADMAP_C_1A_WAVE15_IDS} from '../src/building-pool/roadmap-1a/m2-housing-wave15-roadmap-c.mjs';

import {getRoadmapC1AHousesWave16,ROADMAP_C_1A_WAVE16_IDS} from '../src/building-pool/roadmap-1a/m2-housing-wave16-roadmap-c.mjs';
import {getRoadmapC1AHousesWave17} from '../src/building-pool/roadmap-1a/m2-housing-wave17-roadmap-c.mjs';
import {getRoadmapC1AHousesWave18} from '../src/building-pool/roadmap-1a/m2-housing-wave18-roadmap-c.mjs';
import {getRoadmapC1AInnWave19} from '../src/building-pool/roadmap-1a/m3-inn-wave19-roadmap-c.mjs';
import {getRoadmapC1AInnWave20} from '../src/building-pool/roadmap-1a/m3-inn-wave20-roadmap-c.mjs';
import {getRoadmapC1AInnWave21} from '../src/building-pool/roadmap-1a/m3-inn-wave21-roadmap-c.mjs';
import {getRoadmapC1ATavernWave22} from '../src/building-pool/roadmap-1a/m3-tavern-wave22-roadmap-c.mjs';
import {getRoadmapC1AHousesWave23} from '../src/building-pool/roadmap-1a/m2-housing-wave23-roadmap-c.mjs';
import {getRoadmapC1AInnWave24} from '../src/building-pool/roadmap-1a/m3-inn-wave24-roadmap-c.mjs';
import {getRoadmapC1AHousesWave25} from '../src/building-pool/roadmap-1a/m2-housing-wave25-roadmap-c.mjs';
import {getRoadmapC1AHousesWave26} from '../src/building-pool/roadmap-1a/m2-housing-wave26-roadmap-c.mjs';
import {getRoadmapC1AHousesWave27} from '../src/building-pool/roadmap-1a/m2-housing-wave27-roadmap-c.mjs';
import {getRoadmapC1AHousesWave28} from '../src/building-pool/roadmap-1a/m2-housing-wave28-roadmap-c.mjs';
import {getRoadmapC1AHousesWave29,ROADMAP_C_1A_WAVE29_HOUSE_IDS} from '../src/building-pool/roadmap-1a/m2-housing-wave29-roadmap-c.mjs';
import {getRoadmapC1AInnWave34,ROADMAP_C_1A_WAVE34_INN_IDS} from '../src/building-pool/roadmap-1a/m3-inn-wave34-roadmap-c.mjs';
import {getRoadmapC1AInnWave33} from '../src/building-pool/roadmap-1a/m3-inn-wave33-roadmap-c.mjs';
import {getRoadmapC1AInnWave32} from '../src/building-pool/roadmap-1a/m3-inn-wave32-roadmap-c.mjs';
import {getRoadmapC1AInnWave31} from '../src/building-pool/roadmap-1a/m3-inn-wave31-roadmap-c.mjs';
import {getRoadmapC1ATavernsWave30} from '../src/building-pool/roadmap-1a/m3-tavern-wave30-roadmap-c.mjs';
const historical=[...getM1Blueprints(),...getM1InnExemplars(),...getM2Originals(),...getM2HousingTranche(),...getM2HousingWave2(),...getM2HousingWave3(),...getM2HousingWave4(),...getM2HousingWave5(),...getM2HousingWave6(),...getM2HousingWave7(),...getM2HousingWave8(),...getM2HousingWave9(),...getHospitalityWave1(),...getHospitalityWave2(),...getHospitalityWave3(),...getHospitalityWave4(),...getHospitalityWave5(),...getHospitalityWave6(),...getHospitalityWave7(),...getHospitalityWave8(),...getHospitalityWave9(),...getRoadmapC1AHousesWave10(),...getRoadmapC1AInnWave11(),...getRoadmapC1AHousesWave12(),...getRoadmapC1AHousesWave13(),...getRoadmapC1AHousesWave14()],fresh=getRoadmapC1AHousesWave15(),pool=[...historical,...fresh];
const accepted=[...pool,...getRoadmapC1AHousesWave16(),...getRoadmapC1AHousesWave17(),...getRoadmapC1AHousesWave18(),...getRoadmapC1AInnWave19(),...getRoadmapC1AInnWave20(),...getRoadmapC1AInnWave21(),...getRoadmapC1ATavernWave22(),...getRoadmapC1AHousesWave23(),...getRoadmapC1AInnWave24(),...getRoadmapC1AHousesWave25(),...getRoadmapC1AHousesWave26(),...getRoadmapC1AHousesWave27(),...getRoadmapC1AHousesWave28(),...getRoadmapC1AHousesWave29(),...getRoadmapC1ATavernsWave30(),...getRoadmapC1AInnWave31(),...getRoadmapC1AInnWave32(),...getRoadmapC1AInnWave33()];
const pending=getRoadmapC1AInnWave34(),all=[...accepted,...pending];


import {getAlderweirSwitchbackHouse} from '../src/building-pool/master-builder/alderweir-switchback-house.mjs';
import {getMasterBuilderSession3Houses} from '../src/building-pool/master-builder/session3-regional-houses.mjs';
const batch=getMasterBuilderSession3Houses(),prior=getAlderweirSwitchbackHouse();
function checkGeometry(b,entry,expect,assert){
 const v=new Map(b.placements.map(p=>[p.at.join(','),p])),walk=new Set(b.walkable.map(p=>p.join(','))),rooms=new Map(b.rooms.map(r=>[r.id,r])),{width:w,height:h,depth:d}=b.footprint;
 const contains=(r,x,z)=>r&&x>=r.min[0]&&x<r.max[0]&&z>=r.min[2]&&z<r.max[2],dirs=[[1,0],[-1,0],[0,1],[0,-1]],yaw={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]},cuts=b.architecturalIdentity.exteriorNotches,absent=(x,z)=>cuts.some(([a,t,c,q])=>x>=a&&x<=c&&z>=t&&z<=q);
 const roof=b.placements.filter(p=>p.role==='roof'),win=b.placements.filter(p=>p.role==='window');
 assert(JSON.stringify([b.placements.length,b.walkable.length,b.rooms.length,b.portals.length,win.length,roof.length,b.architecturalIdentity.exteriorVoidFootprintCells,b.footprintReservations.length])===JSON.stringify(expect),'exact counts');
 assert(v.size===b.placements.length&&!b.worldPlacement&&!b.liveIntegration,'scope/duplicates');
 for(const p of b.portals){const [x,y,z]=p.at;assert(y===1&&walk.has(p.at.join(','))&&!v.has([x,2,z].join(',')),'blocked portal');assert(dirs.some(([dx,dz])=>{const a=[x-dx,z-dz],c=[x+dx,z+dz];return(p.from==='outside'?a[0]===entry&&a[1]===0:contains(rooms.get(p.from),...a))&&walk.has([a[0],1,a[1]].join(','))&&contains(rooms.get(p.to),...c)&&walk.has([c[0],1,c[1]].join(','))}),JSON.stringify(p));}
 for(const r of b.rooms)assert(b.walkable.some(([x,y,z])=>contains(r,x,z)),r.id);
 for(const p of win){const [x,y,z]=p.at,[dx,dz]=yaw[p.orientation],ox=x+dx,oz=z+dz;assert(p.asset==='pack4:030'&&walk.has([x-dx,1,z-dz].join(','))&&(absent(ox,oz)||ox===0||oz===0||ox===w-1||oz===d-1)&&!v.has([ox,2,oz].join(','))&&!v.has([ox,3,oz].join(',')),'blocked window '+p.at);}
 for(const p of roof)assert(v.has([p.at[0],p.at[1]-1,p.at[2]].join(',')),'floating roof');
 for(let x=0;x<w;x++)for(let z=0;z<d;z++){if(absent(x,z)){for(let y=0;y<h;y++)assert(!v.has([x,y,z].join(',')),'notch occupied');}else assert(v.get([x,0,z].join(','))?.role==='foundation','foundation');}
 const [a,t,c,q]=b.architecturalIdentity.outdoorCourtyard;for(let x=a;x<=c;x++)for(let z=t;z<=q;z++){assert(walk.has([x,1,z].join(',')),'court walk');for(let y=1;y<h;y++)assert(!v.has([x,y,z].join(',')),'court covered');}
 for(const r of b.footprintReservations)for(const f of r.extraCells)assert(!v.has(f.join(','))&&!walk.has(f.join(','))&&!v.has([f[0],f[1]+1,f[2]].join(',')),'bed clearance');
}
const points=(bp,t=0)=>{const o=bp.placements.filter(p=>p.role==='foundation').map(p=>{let [x,,z]=p.at;if(t&1)x=-x;if(t&2)[x,z]=[z,x];if(t&4)z=-z;return [x,z];});const mx=Math.min(...o.map(p=>p[0])),mz=Math.min(...o.map(p=>p[1]));return new Set(o.map(([x,z])=>(x-mx)+','+(z-mz)));};
const iou=(a,c)=>{let n=0;for(const p of a)if(c.has(p))n++;return n/(a.size+c.size-n||1);};
const silhouette=bp=>{const w=bp.footprint.width,d=bp.footprint.depth,notches=bp.architecturalIdentity.exteriorNotches??[],s=new Set();for(let x=0;x<16;x++)for(let z=0;z<16;z++){const a=Math.min(w-1,Math.floor((x+.5)*w/16)),q=Math.min(d-1,Math.floor((z+.5)*d/16));if(notches.every(n=>a<n[0]||a>n[2]||q<n[1]||q>n[3]))s.add(x+','+z);}return s;};
const partitions=bp=>new Set(bp.placements.filter(p=>p.role==='partition'&&p.at[1]===1).map(p=>Math.floor(16*p.at[0]/bp.footprint.width)+','+Math.floor(16*p.at[2]/bp.footprint.depth)));

const expected=[[4379,586,6,8,12,842,448,2],[4612,582,7,9,17,883,410,2]];
for(let i=0;i<batch.length;i++)test('Session3 geometry and actual Pack source '+batch[i].id,()=>{const b=batch[i];assert.equal(validateBlueprint(b),true);checkGeometry(b,[15,22][i],expected[i],assert.ok);const physical=auditM1PhysicalSources(b);assert.deepEqual(physical.errors,[]);assert.deepEqual(physical.unresolved,[]);assert.equal(physical.productionReady,false);});
test('Session3 strict original historical and batch identity/geometry comparison',()=>{
 assert.equal(all.length,290);assert.equal(new Set(all.map(x=>x.id)).size,290);assert.equal(validatePool([...all,prior,...batch]).authored,293);
 for(let i=0;i<batch.length;i++){const b=batch[i],transforms=Array.from({length:8},(_,j)=>points(b,j)),s=silhouette(b),p=partitions(b),fp=structuralFingerprint(b);
 for(const old of [...all,prior,...batch.slice(0,i)]){assert.notEqual(b.id,old.id);assert.notEqual(fp,structuralFingerprint(old));assert.ok(Math.max(...transforms.map(t=>iou(t,points(old))))<.89,'D4 '+b.id+' '+old.id);assert.ok(iou(s,silhouette(old))<.975,'silhouette '+b.id+' '+old.id);assert.ok(iou(p,partitions(old))<.88,'partition '+b.id+' '+old.id);}}
 // Separate protected B originals must also pass strict comparison before source acceptance.
});
