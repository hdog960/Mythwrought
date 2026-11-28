import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,VoxelWorld,terrainHeight} from '../../src/voxel.mjs';
import {Pack2LiveWorld} from '../../src/pack2-world.mjs';
import {FourRegionWorld,fourRegionProfile,M8_MOUNTAIN_GENERATOR} from '../../src/manual-biomes/profile-world.mjs';
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import {createExpansionOwnerView} from '../../src/mobs/age-of-beasts/owner-view.mjs';
import {createExpansionWorldQuery} from '../../src/mobs/age-of-beasts/physical-query.mjs';
import {completeBeastCandidateCatalog} from '../../src/mobs/age-of-beasts/complete-catalog.mjs';
import {chooseExpansionSpawn} from '../../src/mobs/age-of-beasts/spawn-selection.mjs';
import {expansionSupport} from '../../src/mobs/age-of-beasts/environment-support.mjs';
import {createCaveActor,stepCaveActor} from '../../src/mobs/age-of-beasts/plains-execution.mjs';
const cat=completeBeastCandidateCatalog();
const obs=()=>({biome:'cave',light:.2,hazard:false,dayPhase:'night'});
function query(get){return createExpansionWorldQuery({get},{resident:()=>true,revision:()=>1,observe:obs,extraOverlayBlocked:()=>false});}
test('ceiling lurker returns from a real drop via a supported wall without teleportation',()=>{
 const q=query((x,y,z)=>x===2||y===-10||y===-5?BLOCK.STONE:BLOCK.AIR);
 const c=cat.get('ceiling-lurker'),p=[2-c.record.body.radius,-5-c.record.body.height,.5],a=createCaveActor(c,p,q),target={position:[p[0],-8.7,.5]},hits=[];
 for(let i=0;i<220;i++){
  const before=[...a.position];assert.ok(stepCaveActor(a,q,{target:hits.length?undefined:target,commitDamage:(t,n,rev,k)=>{hits.push(k);return true;}}));
  assert.ok(Math.hypot(...a.position.map((v,k)=>v-before[k]))<.4);
  if(hits.length&&a.dropState===null&&expansionSupport(q,a.position,c.record.body,'ceiling'))break;
 }
 assert.deepEqual(hits,['drop-attack']);assert.equal(a.dropState,null);assert.equal(a.motionMode,'ceiling-crawl');
 assert.ok(expansionSupport(q,a.position,c.record.body,'ceiling'));
});
test('echo stalker uses original hearing for resident owner disturbances but cannot damage an unseen source',()=>{
 const q=query((x,y,z)=>y===-10?BLOCK.STONE:BLOCK.AIR),c=cat.get('echo-stalker'),a=createCaveActor(c,[.5,-9,.5],q);
 const position=[14,-9,.5];let hits=0;
 assert.ok(stepCaveActor(a,q,{readDisturbances:()=>({revision:1,events:[{position,loudness:1}]}),commitDamage:()=>{hits++;return true;}}));
 assert.equal(a.action,'investigate');assert.ok(a.position[0]>.5);assert.equal(hits,0);
 const x=a.position[0];assert.ok(stepCaveActor(a,q,{readDisturbances:()=>({revision:0,events:[{position,loudness:1}]})}));assert.equal(a.action,'idle');assert.equal(a.position[0],x);
 assert.ok(stepCaveActor(a,q,{facts:{heard:position}}));assert.equal(a.action,'idle');
});
test('bounded actual seeded baseline survey reports generated-source admissions without editing saves',()=>{
 const counts={proposals:0,admitted:0,seeds:[]};
 for(const seed of [179,42,2026]){
  const world=new Pack2LiveWorld(new FourRegionWorld(seed,fourRegionProfile(seed,M8_MOUNTAIN_GENERATOR)));
  const before=JSON.stringify(world.save()),seedCounts={seed,proposals:0,admitted:0};
  const view=createExpansionOwnerView(world,{hasOwner:()=>true,overlayEpoch:()=>0,observe:([x,y,z])=>({biome:({mountain:'alpine',enchanted:'forest',snow:'snow',desert:'desert'})[v6BiomeAt(x,z,seed)?.name]??'meadow',hazard:false,light:.2,dayPhase:'night'})});
  // Survey nine actual plains columns per seed, no terrain edits; controlled sky and resident fixture.
  for(const x of [-8,0,8])for(const z of [-8,0,8]){
   const y=terrainHeight(x,z,seed)+1,point=[x+.5,y,z+.5];
   const proposals=['headless-knight','werewolf','dire-hound','scarefiend','bison','golden-antelope'].map(id=>({id,point,rarityRoll:0}));
   seedCounts.proposals+=proposals.length;
   const out=chooseExpansionSpawn(view,{proposals,observer:[x+8.5,y,z+.5],entities:[],homeChunk:[Math.floor(x/16),Math.floor(z/16),0].join(',')});
   if(out){seedCounts.admitted++;assert.equal(view.revision(),out.revision);assert.ok(expansionSupport(view.query,out.point,cat.get(out.id).record.body,'ground'));}
  }
  assert.equal(JSON.stringify(world.save()),before);assert.equal(world.pack2Snapshot().cells.length,0);
  counts.proposals+=seedCounts.proposals;counts.admitted+=seedCounts.admitted;counts.seeds.push(seedCounts);
 }
 console.log('AB14 actual baseline seeded survey '+JSON.stringify(counts));
 assert.equal(counts.proposals,162);assert.ok(counts.admitted>0,'no actual generated-source candidate admitted');
});
