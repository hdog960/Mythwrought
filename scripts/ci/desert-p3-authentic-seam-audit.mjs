// Original-source Desert Phase 3 seam sharpness survey, not a terrain modifier.
// Exercises authentic V6 neighbors and actual V7 guarded _columnPlan.
// This deliberately reports discontinuities without assuming every boundary is bad.
import assert from 'node:assert/strict';
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../../src/manual-biomes/profile-world.mjs';
import {ENVIRONMENT_GROUND as G} from '../../src/environment-ground.mjs';

const sites=[
  {seed:179,x:-786,z:-1774,other:'enchanted'},
  {seed:2026,x:-2848,z:-774,other:'snow'}
];
const offsets=[[14,0],[-14,0],[0,14],[0,-14]];
const summaries=[];
for(const site of sites){
  const {seed,x:cx,z:cz}=site;
  const world=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
  const original=v6BiomeAt(cx,cz,seed);
  assert.equal(original?.name,'desert');
  const centerPlan=world._columnPlan(cx,cz);
  assert.equal(centerPlan.get(Math.max(...centerPlan.keys())),G.scree);
  const cells=new Map();
  // 17x17 original-world cells, two blocks apart: 289 columns per site.
  // Never bypass real cave / landmark veto, never write a world edit.
  for(let dz=-16;dz<=16;dz+=2)for(let dx=-16;dx<=16;dx+=2){
    const x=cx+dx,z=cz+dz,biome=v6BiomeAt(x,z,seed);
    if(biome?.name!=='desert'||biome.weight>.50)continue;
    const neighbors=offsets.map(([ox,oz])=>v6BiomeAt(x+ox,z+oz,seed)?.name??'plains');
    const plan=world._columnPlan(x,z);
    const top=plan.size?Math.max(...plan.keys()):null;
    cells.set(x+','+z,{x,z,weight:biome.weight,neighbors,eligible:plan.size>0,
      top,cap:plan.size?plan.get(top):null});
  }
  let eligible=0,veto=0,scree=0,hardpan=0,other=0;
  let neighboringPairs=0,materialTransitions=0,sharpScreeHardpan=0;
  let maxTopDifference=0,unprotectedSharp=0;
  const examples=[];
  for(const cell of cells.values()){
    if(!cell.eligible){veto++;continue;}
    eligible++;
    if(cell.cap===G.scree)scree++;
    else if(cell.cap===258)hardpan++;
    else other++;
    for(const [dx,dz] of [[2,0],[0,2]]){
      const peer=cells.get((cell.x+dx)+','+(cell.z+dz));
      if(!peer?.eligible)continue;
      neighboringPairs++;
      const difference=Math.abs(cell.top-peer.top);
      maxTopDifference=Math.max(maxTopDifference,difference);
      if(cell.cap===peer.cap)continue;
      materialTransitions++;
      if([cell.cap,peer.cap].includes(G.scree)&&[cell.cap,peer.cap].includes(258)){
        sharpScreeHardpan++;
        // Eligible plans have already passed the original cave/landmark veto.
        unprotectedSharp++;
        if(examples.length<12)examples.push({a:[cell.x,cell.z,cell.cap,cell.top],
          b:[peer.x,peer.z,peer.cap,peer.top],heightDelta:difference,
          mountainNearA:cell.neighbors.includes('mountain'),
          mountainNearB:peer.neighbors.includes('mountain')});
      }
    }
  }
  assert.ok(eligible>0,'No actual Desert columns survived original V7 veto');
  assert.ok(neighboringPairs>0,'No valid original-world nearby columns sampled');
  assert.deepEqual(world.save().edits,[],'Read-only audit must never edit saves');
  const summary={site,survey:'17x17 original columns at 2-block spacing',
    examined:289,desertEdgeColumns:cells.size,eligible,protectedVeto:veto,
    scree,hardpan,other,neighboringPairs,materialTransitions,
    sharpScreeHardpan,unprotectedSharp,maxTopDifference,examples};
  summaries.push(summary);
  console.log('DESERT_P3_SEAM_SOURCE '+JSON.stringify(summary));
}
assert.equal(summaries.length,2);
console.log('DESERT_P3_SEAM_SOURCE_COMPLETE '+JSON.stringify({
  totalEligible:summaries.reduce((n,s)=>n+s.eligible,0),
  totalSharp:summaries.reduce((n,s)=>n+s.sharpScreeHardpan,0),
  note:'Descriptive measurements, not visual acceptance or terrain mutations'
}));
