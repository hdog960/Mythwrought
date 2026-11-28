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
const b=getAlderweirSwitchbackHouse(),vox=new Map(b.placements.map(p=>[p.at.join(','),p]));
const walk=new Set(b.walkable.map(p=>p.join(','))),rooms=new Map(b.rooms.map(r=>[r.id,r]));
const contains=(r,x,z)=>r&&x>=r.min[0]&&x<r.max[0]&&z>=r.min[2]&&z<r.max[2];
const cuts=b.architecturalIdentity.exteriorNotches,absent=(x,z)=>cuts.some(([a,t,c,d])=>x>=a&&x<=c&&z>=t&&z<=d);
const dirs=[[1,0],[-1,0],[0,1],[0,-1]],yaw={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]};
test('Alderweir original candidate, reserved identity and physical source connectivity',()=>{
 assert.equal(b.id,'r1:house:temperate:small:019');assert.equal(validateBlueprint(b),true);
 assert.deepEqual([b.placements.length,b.walkable.length,b.rooms.length,b.portals.length,b.footprintReservations.length],[3469,449,7,10,2]);
 assert.equal(vox.size,b.placements.length);assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
 for(const p of b.portals){const [x,y,z]=p.at;assert.equal(y,1);assert.ok(walk.has(p.at.join(','))&&!vox.has([x,2,z].join(',')));
 assert.ok(dirs.some(([dx,dz])=>{const a=[x-dx,z-dz],c=[x+dx,z+dz];
 return (p.from==='outside'?a[0]===16&&a[1]===0:contains(rooms.get(p.from),...a))&&walk.has([a[0],1,a[1]].join(','))&&contains(rooms.get(p.to),...c)&&walk.has([c[0],1,c[1]].join(','));}),JSON.stringify(p));}
 for(const r of b.rooms)assert.ok(b.walkable.some(([x,y,z])=>contains(r,x,z)),r.id);
});
test('Alderweir notches, open garden, supported roof and physical-source apertures',()=>{
 let missing=0;for(let x=0;x<34;x++)for(let z=0;z<31;z++){if(absent(x,z)){missing++;for(let y=0;y<12;y++)assert.ok(!vox.has([x,y,z].join(',')));}else assert.equal(vox.get([x,0,z].join(','))?.role,'foundation');}
 assert.equal(missing,354);for(let x=26;x<=28;x++)for(let z=12;z<=14;z++){assert.ok(walk.has([x,1,z].join(',')));for(let y=1;y<12;y++)assert.ok(!vox.has([x,y,z].join(',')));}
 const roof=b.placements.filter(p=>p.role==='roof');assert.equal(roof.length,691);assert.ok(new Set(roof.map(p=>p.at[1])).size>=4);
 for(const p of roof)assert.ok(vox.has([p.at[0],p.at[1]-1,p.at[2]].join(',')));
 for(const w of b.architecturalIdentity.roofWings){const [a,t,c,d]=w.rect;assert.ok(roof.some(p=>p.at[0]>=a&&p.at[0]<=c&&p.at[2]>=t&&p.at[2]<=d));}
 const windows=b.placements.filter(p=>p.role==='window');assert.equal(windows.length,12);
 for(const p of windows){const [x,y,z]=p.at,[dx,dz]=yaw[p.orientation],ox=x+dx,oz=z+dz;assert.equal(p.asset,'pack4:030');assert.ok(walk.has([x-dx,1,z-dz].join(',')));assert.ok(absent(ox,oz)||ox===0||ox===33||oz===0||oz===30);assert.ok(!vox.has([ox,2,oz].join(','))&&!vox.has([ox,3,oz].join(',')));}
 for(const r of b.footprintReservations)for(const f of r.extraCells){assert.ok(!vox.has(f.join(','))&&!walk.has(f.join(','))&&!vox.has([f[0],f[1]+1,f[2]].join(',')));}
 const physical=auditM1PhysicalSources(b);assert.deepEqual(physical.errors,[]);assert.deepEqual(physical.unresolved,[]);assert.equal(physical.productionReady,false);
});
const points=(bp,t=0)=>{const o=bp.placements.filter(p=>p.role==='foundation').map(p=>{let [x,,z]=p.at;if(t&1)x=-x;if(t&2)[x,z]=[z,x];if(t&4)z=-z;return [x,z];});const mx=Math.min(...o.map(p=>p[0])),mz=Math.min(...o.map(p=>p[1]));return new Set(o.map(([x,z])=>(x-mx)+','+(z-mz)));};
const iou=(a,c)=>{let n=0;for(const p of a)if(c.has(p))n++;return n/(a.size+c.size-n||1);};
const silhouette=bp=>{const w=bp.footprint.width,d=bp.footprint.depth,notches=bp.architecturalIdentity.exteriorNotches??[],s=new Set();for(let x=0;x<16;x++)for(let z=0;z<16;z++){const a=Math.min(w-1,Math.floor((x+.5)*w/16)),q=Math.min(d-1,Math.floor((z+.5)*d/16));if(notches.every(n=>a<n[0]||a>n[2]||q<n[1]||q>n[3]))s.add(x+','+z);}return s;};
const partitions=bp=>new Set(bp.placements.filter(p=>p.role==='partition'&&p.at[1]===1).map(p=>Math.floor(16*p.at[0]/bp.footprint.width)+','+Math.floor(16*p.at[2]/bp.footprint.depth)));
test('Alderweir versus all 290 accepted historical C originals; unchanged strict thresholds',()=>{
 assert.equal(all.length,290);assert.equal(new Set(all.map(x=>x.id)).size,290);assert.ok(!all.some(x=>x.id===b.id));
 assert.equal(validatePool([...all,b]).authored,291);
 const transforms=Array.from({length:8},(_,i)=>points(b,i)),s=silhouette(b),p=partitions(b),fingerprint=structuralFingerprint(b);
 for(const old of all){assert.notEqual(structuralFingerprint(old),fingerprint,old.id);assert.ok(Math.max(...transforms.map(t=>iou(t,points(old))))<.89,'D4 '+old.id);assert.ok(iou(s,silhouette(old))<.975,'silhouette '+old.id);assert.ok(iou(p,partitions(old))<.88,'partition '+old.id);}
 // B provisional sources are maintained on separate protected PR384; cross-lane geometry comparison remains an explicit additional qualification gate.
});
