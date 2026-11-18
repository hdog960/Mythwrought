// Roadmap #240: strictly read-only source-authentic browser evidence helpers.
// These test-owned helpers never modify cave producers, legacy saves, renderer,
// global streaming budgets or the intentional open-to-sky historic East Gallery.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {BLOCK,collides,chunkCoord} from '../src/voxel.mjs';
import {sectionForY,sectionWindow} from '../src/depth.mjs';
import {meshDepthSection} from '../src/depth-mesh.mjs';
import {descentRoute,DESCENT_ORIGIN} from '../src/underground-switchback-descent.mjs';
import {HISTORIC_NAMED_TARGETS,findNamedCavePlayerRoute}
 from '../src/manual-caves/named-destination-audit.mjs';

export async function historicSecondaryScenes(world,seed){
 // The original 16-case focused-native fixture remains the source of truth.
 // Any label/coordinate drift will fail browser acceptance rather than
 // inventing "near enough" replacement secondary caverns.
 const fixture=await readFile(resolve('tests/cave-roadmap-named-secondary-arms.test.mjs'),'utf8');
 const rows=[...fixture.matchAll(/^\s*\['([^']+)',(-?\d+),(-?\d+),(-?\d+),(-?\d+)\]/gm)]
   .map(x=>({name:x[1],depth:+x[2],d:+x[3],t:+x[4],floor:+x[5]}));
 assert.equal(rows.length,16,'Protected secondary authored target count changed');
 assert.equal(new Set(rows.map(x=>x.name)).size,16,'Repeated secondary original source label');
 const route=descentRoute(),slugs=new Set();
 return rows.map(row=>{
  const anchor=route.find(p=>p.floor===row.depth);
  assert.ok(anchor,'Source descent anchor missing '+row.depth);
  const lx=anchor.x-DESCENT_ORIGIN.x,lz=anchor.z-DESCENT_ORIGIN.z;
  const out=lz===0?[0,-1]:lz===28?[0,1]:lx===0?[-1,0]:[1,0],
    tan=[out[1],-out[0]];
  const x=anchor.x+out[0]*row.d+tan[0]*row.t,
    z=anchor.z+out[1]*row.d+tan[1]*row.t;
  const floorBlock=world.get(x,row.floor,z);
  assert.ok([BLOCK.STONE,BLOCK.DEEPSTONE].includes(floorBlock),
    'Secondary target floor is not original supported rock: '+row.name);
  for(let h=1;h<=4;h++)
   assert.equal(world.get(x,row.floor+h,z),BLOCK.AIR,
    'Secondary target source lacks 4-high headroom: '+row.name+' '+h);
  assert.equal(collides(world,x+.5,row.floor+1,z+.5),false,
    'Secondary source target collides: '+row.name);
  const slug=row.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  assert.ok(!slugs.has(slug),'Secondary screenshot name collision: '+slug);
  slugs.add(slug);
  return {name:'secondary-'+slug,secondary:row.name,
    proofSeed:seed,sourceFrame:{...row,x,z,sourceFloorBlock:floorBlock},
    at:{x,y:row.floor+1,z},to:{x:anchor.x,y:row.depth+2,z:anchor.z}};
 });
}

export function inspectDeepSkySourceBoundary(world,seed){
 // Authoritative composed-world voxel and original production section mesh:
 // investigate sky/void in nominally bounded deep authored caverns.
 // No faux blocking wall, artificial shadow, geometry edit or visual hiding.
 return ['Bifurcated Mineral Gallery','Vaulted Stone Fan'].map(name=>{
  const feature=HISTORIC_NAMED_TARGETS.find(x=>x.name===name);
  assert.ok(feature,'Protected named source feature missing '+name);
  const proof=findNamedCavePlayerRoute(world,feature);
  assert.equal(proof.ok,true,'Deep scene route not source supported '+name);
  const p=proof.target,back=proof.route[Math.max(0,proof.route.length-4)];
  const cx=chunkCoord(p.x),cz=chunkCoord(p.z);
  const activeSection=sectionForY(p.floor+1),
    sections=sectionWindow(p.floor+1,false);
  const mesh=meshDepthSection(world,cx,cz,activeSection);
  assert.ok(mesh.length>0,'Deep composed-world mesh empty '+name);
  const floorBlock=world.get(p.x,p.floor,p.z);
  assert.ok([BLOCK.STONE,BLOCK.DEEPSTONE].includes(floorBlock),
    'Deep scene source floor absent '+name);
  for(let h=1;h<=4;h++)
   assert.equal(world.get(p.x,p.floor+h,p.z),BLOCK.AIR,
     'Deep scene source headroom changed '+name+' '+h);
  const vectors=[['camera-to-spiral-route',back.x-p.x,back.z-p.z],
    ['east',1,0],['west',-1,0],['north',0,-1],['south',0,1]];
  const rays=vectors.map(([direction,dx,dz])=>{
   const norm=Math.hypot(dx,dz)||1;
   let firstSolid=null,firstOutsideStream=null,airWithinStream=0;
   for(let step=1;step<=80;step++){
    const x=Math.floor(p.x+.5+step*dx/norm);
    const z=Math.floor(p.z+.5+step*dz/norm);
    const inside=Math.abs(chunkCoord(x)-cx)<=1&&Math.abs(chunkCoord(z)-cz)<=1;
    const cell=world.get(x,p.floor+2,z);
    if(!inside&&firstOutsideStream===null)firstOutsideStream=step;
    if(inside&&cell===BLOCK.AIR)airWithinStream++;
    if(cell!==BLOCK.AIR){
     firstSolid={step,block:cell,insideStream:inside,x,z};break;
    }
   }
   return {direction,firstSolid,firstOutsideStream,airWithinStream};
  });
  const record={name,sourceSeed:seed,sourceTarget:p,floorBlock,
   activeSection,visibleSections:sections,
   expectedResidentSlots:sections.length*9,
   activeCenterMeshVertices:mesh.length/9,
   sourceRays:rays,
   backgroundRule:'Actual main.mjs renders procedural sky every frame independent of depth',
   acceptance:'SOURCE_AND_MESH_PROBE_ONLY_C6_VISUAL_STILL_OPEN'};
  console.log('CAVE DEEP SKY SOURCE/MESHER RAY PROBE',JSON.stringify(record));
  return record;
 });
}
