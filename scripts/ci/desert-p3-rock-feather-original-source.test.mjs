// Authentic original V7 world research: non-production hardpan/rock feather.
import assert from 'node:assert/strict';
import {test} from 'node:test';
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../../src/manual-biomes/profile-world.mjs';
import {ENVIRONMENT_GROUND as G} from '../../src/environment-ground.mjs';
import {proposedDesertRockFeather,FEATHER_DESERT_ROCK}
  from './desert-p3-rock-feather-proposal.mjs';
const sites=[
  {seed:179,x:-786,z:-1774,other:'enchanted'},
  {seed:2026,x:-2848,z:-774,other:'snow'}
];
const sampleOffsets=[[14,0],[-14,0],[0,14],[0,-14]];
const neighborOffsets=[[1,0],[-1,0],[0,1],[0,-1]];
test('research feather is deterministic, mountain scree remains immutable, and only eligible hardpan can change',()=>{
  for(const site of sites){
    const {seed,x:cx,z:cz}=site;
    const world=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
    const original=v6BiomeAt(cx,cz,seed);
    assert.equal(original?.name,'desert');
    const center=world._columnPlan(cx,cz);
    assert.equal(center.get(Math.max(...center.keys())),G.scree);
    const cells=new Map();
    // 33x33 actual source columns, include a one-cell halo for exact nearest
    // scree adjacency. Every original guard/veto is observed, not bypassed.
    for(let dz=-17;dz<=17;dz++)for(let dx=-17;dx<=17;dx++){
      const x=cx+dx,z=cz+dz,biome=v6BiomeAt(x,z,seed);
      const plan=world._columnPlan(x,z);
      const eligible=plan.size>0,top=eligible?Math.max(...plan.keys()):null;
      const cap=eligible?plan.get(top):null;
      cells.set(x+','+z,{x,z,biome,eligible,top,cap,proposal:cap});
    }
    let desertEdge=0,eligible=0,protectedVeto=0,proposedRock=0;
    let sharpBefore=0,sharpAfter=0,nearbyHardpan=0;
    let originalScree=0,immutableScree=0,otherKept=0;
    const examples=[];
    for(const item of cells.values()){
      const isDesertEdge=item.biome?.name==='desert'&&item.biome.weight<=.50;
      const neighbors=sampleOffsets.map(([dx,dz])=>v6BiomeAt(item.x+dx,item.z+dz,seed)?.name??'plains');
      const realMountain=neighbors.includes('mountain');
      if(!isDesertEdge){otherKept++;continue;}
      desertEdge++;
      if(!item.eligible){protectedVeto++;continue;}
      eligible++;
      if(item.cap===G.scree)originalScree++;
      // Only direct one-block cardinal contact with original, eligible scree
      // may allow existing Desert rock to break the flat 258/401 threshold.
      let screeNeighbor=false;
      for(const [dx,dz] of neighborOffsets){
        const adj=cells.get((item.x+dx)+','+(item.z+dz));
        if(adj?.eligible&&adj.cap===G.scree&&adj.biome?.name==='desert'){
          screeNeighbor=true;break;
        }
      }
      if(item.cap===258&&screeNeighbor)nearbyHardpan++;
      item.proposal=proposedDesertRockFeather({
        seed,x:item.x,z:item.z,cap:item.cap,eligible:item.eligible,screeNeighbor
      });
      assert.equal(item.proposal,proposedDesertRockFeather({
        seed,x:item.x,z:item.z,cap:item.cap,eligible:item.eligible,screeNeighbor
      }));
      if(item.cap===G.scree){assert.equal(item.proposal,G.scree);immutableScree++;}
      if(realMountain&&item.cap===G.scree)assert.equal(item.proposal,G.scree);
      if(item.proposal!==item.cap){
        assert.equal(item.cap,258);
        assert.equal(item.proposal,FEATHER_DESERT_ROCK);
        assert.ok(screeNeighbor);
        proposedRock++;
        if(examples.length<16)examples.push({x:item.x,z:item.z,top:item.top,
          from:item.cap,to:item.proposal,nearMountain:realMountain});
      }
    }
    // Exactly one-block material contacts, not 2-block-grid estimates.
    for(let z=cz-16;z<=cz+16;z++)for(let x=cx-16;x<=cx+16;x++){
      const a=cells.get(x+','+z);
      for(const [dx,dz] of [[1,0],[0,1]]){
        const b=cells.get((x+dx)+','+(z+dz));
        if(!a||!b||!a.eligible||!b.eligible)continue;
        if(a.biome?.name!=='desert'||b.biome?.name!=='desert')continue;
        if([a.cap,b.cap].includes(258)&&[a.cap,b.cap].includes(G.scree))sharpBefore++;
        if([a.proposal,b.proposal].includes(258)&&[a.proposal,b.proposal].includes(G.scree))sharpAfter++;
      }
    }
    assert.ok(eligible>0&&originalScree>0);
    assert.equal(immutableScree,originalScree);
    assert.ok(sharpAfter<=sharpBefore,'Proposal may not increase direct hardpan/scree boundaries');
    assert.deepEqual(world.save().edits,[],'Research must never write saves');
    console.log('DESERT_P3_FEATHER_REAL_SOURCE '+JSON.stringify({
      site,examined:1225,desertEdge,eligible,protectedVeto,
      originalScree,immutableScree,nearbyHardpan,proposedRock,
      sharpBefore,sharpAfter,avoidedSharp:sharpBefore-sharpAfter,
      examples,note:'proposal only; no renderer or terrain source modified'
    }));
  }
});
test('proposal fails closed for non-hardpan, protected and absent scree proximity',()=>{
  for(const cap of [null,0,256,257,259,261,401,402])
    assert.equal(proposedDesertRockFeather({
      seed:179,x:0,z:0,cap,eligible:true,screeNeighbor:true}),cap);
  assert.equal(proposedDesertRockFeather({
    seed:179,x:0,z:0,cap:258,eligible:false,screeNeighbor:true}),258);
  assert.equal(proposedDesertRockFeather({
    seed:179,x:0,z:0,cap:258,eligible:true,screeNeighbor:false}),258);
});
