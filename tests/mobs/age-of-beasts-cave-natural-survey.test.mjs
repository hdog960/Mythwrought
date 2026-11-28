import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK} from '../../src/voxel.mjs';
import {Pack2LiveWorld} from '../../src/pack2-world.mjs';
import {FourRegionWorld,fourRegionProfile,M8_MOUNTAIN_GENERATOR} from '../../src/manual-biomes/profile-world.mjs';
import {createExpansionOwnerView} from '../../src/mobs/age-of-beasts/owner-view.mjs';
import {createExpansionWorldQuery} from '../../src/mobs/age-of-beasts/physical-query.mjs';
import {readExpansionHabitatFacts} from '../../src/mobs/age-of-beasts/habitat-facts.mjs';
import {completeBeastCandidateCatalog} from '../../src/mobs/age-of-beasts/complete-catalog.mjs';
import {chooseExpansionSpawn} from '../../src/mobs/age-of-beasts/spawn-selection.mjs';
const cat=completeBeastCandidateCatalog();
test('rider habitat includes actual overhead volume and supported accessible boarding side',()=>{
 const c=cat.get('camel'),p=[.5,-2,.5];
 function facts(roof){
  const get=(x,y,z)=>y===-3||roof&&y===2?BLOCK.STONE:BLOCK.AIR;
  const query=createExpansionWorldQuery({get},{resident:()=>true,revision:()=>1,observe:()=>({biome:'desert',hazard:false,light:.8,dayPhase:'day'}),extraOverlayBlocked:()=>false});
  return readExpansionHabitatFacts({query,revision:()=>1,materialAt:get},p,c.capability,c.requirement);
 }
 assert.equal(facts(false)?.['rider-clearance'],true);assert.equal(facts(true)?.['rider-clearance'],false);
});
test('actual baseline deep cave source survey reports supported samples without editing saves',()=>{
 const all=[];
 for(const seed of [179,42,2026]){
  const world=new Pack2LiveWorld(new FourRegionWorld(seed,fourRegionProfile(seed,M8_MOUNTAIN_GENERATOR))),before=JSON.stringify(world.save());
  const view=createExpansionOwnerView(world,{hasOwner:()=>true,overlayEpoch:()=>0,observe:([x,y,z])=>({biome:y<=-4?'cave':'meadow',hazard:false,light:.2,dayPhase:'night'})});
  const row={seed,columns:0,scanned:0,ground:0,ceiling:0,water:0,attempts:0,admitted:{}};
  const candidates=cat.candidates.filter(c=>c.requirement.biome==='cave');
  for(const x of [-32,0,32])for(const z of [-32,0,32]){
   row.columns++;const samples={ground:[],ceiling:[],water:[]};
   for(let y=-6;y>=-180;y--){
    row.scanned++;const id=world.get(x,y,z);
    if(id===BLOCK.AIR){
     if(world.get(x,y-1,z)!==BLOCK.AIR&&samples.ground.length<3)samples.ground.push(y);
     if(world.get(x,y+1,z)!==BLOCK.AIR&&samples.ceiling.length<3)samples.ceiling.push(y+1);
    }
    if(id===76&&samples.water.length<3)samples.water.push(y+.1);
   }
   for(const kind of ['ground','ceiling','water']){
    row[kind]+=samples[kind].length;
    for(const y of samples[kind])for(const c of candidates){
     if(!c.capability.spawnSupport.includes(kind))continue;
     const p=[x+.5,kind==='ceiling'?y-c.record.body.height:y,z+.5];row.attempts++;
     const result=chooseExpansionSpawn(view,{proposals:[{id:c.record.id,point:p,rarityRoll:0}],observer:[x+8.5,p[1],z+.5],entities:[],homeChunk:[Math.floor(x/16),Math.floor(z/16),Math.floor(p[1]/16)].join(',')});
     if(result){assert.equal(result.id,c.record.id);assert.equal(result.revision,view.revision());row.admitted[result.id]=(row.admitted[result.id]??0)+1;}
    }
   }
  }
  assert.equal(row.columns,9);assert.equal(row.scanned,1575);assert.equal(JSON.stringify(world.save()),before);assert.equal(world.pack2Snapshot().cells.length,0);all.push(row);
 }
 console.log('AB16 actual baseline cave survey '+JSON.stringify(all));
 assert.equal(all.reduce((n,r)=>n+r.scanned,0),4725);
 // No forced nonzero admission: actual current baseline coverage is evidence,
 // not a reason to weaken habitat requirements or invent natural chambers.
});
