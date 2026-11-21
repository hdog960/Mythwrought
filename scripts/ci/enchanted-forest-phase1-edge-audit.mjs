// Enchanted Forest Phase 1: read-only wide seed/edge provenance.
// Measures the actual M7 world reader and records witnesses before strict assertions.
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../../src/manual-biomes/profile-world.mjs';
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import {VoxelWorld,BLOCK,terrainHeight,baseBlock} from '../../src/voxel.mjs';

const seeds=[179,7919,-88,7,2026,-8675309,123456];
const sha=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const report={schema:'enchanted-phase1-m7-wide-seed-edge-v1',head:sha,seeds,
  columns:0,interiorColumns:0,shoulderColumns:0,plainsColumns:0,otherBiomeColumns:0,
  interiorGrassCount:0,expectedEdgeGrassCount:0,adjacentCrossings:0,repeatable:0,
  witnesses:[],perSeed:[]};
function regionCenter(seed){
  // The promoted enchanted macro-region is centered near (0,-512);
  // independently resolve an actual full-weight cell for every seed.
  for(const d of [0,32,64,96,128,160])for(const x of [-d,d])
    for(const z of [-512-d,-512+d]){
      const b=v6BiomeAt(x,z,seed);
      if(b?.name==='enchanted'&&b.weight>.98)return [x,z];
    }
  throw Error('No enchanted promoted region found for seed '+seed);
}
function collect(world,legacy,seed,x,z,tag,result){
  const biome=v6BiomeAt(x,z,seed);
  const weight=biome?.weight??0;
  const old=terrainHeight(x,z,seed);
  const plan=world._columnPlan(x,z);
  const top=plan.size?Math.max(...plan.keys()):old;
  const id=world.naturalAndLandmarkBlock(x,top,z);
  report.columns++; result.columns++;
  if(!biome){
    report.plainsColumns++;result.plains++;
    assert.equal(plan.size,0,'plains profile must not gain enchanted writes');
  }else if(biome.name==='enchanted'&&weight>=.7){
    report.interiorColumns++;result.interior++;
  }else if(biome.name==='enchanted'){
    report.shoulderColumns++;result.shoulders++;
  }else report.otherBiomeColumns++;
  // Scan the entire original visible grass range, not just the chosen cap.
  // The scan intentionally does not flag neighboring Plains or legitimate
  // shoulder transition grass as an enchanted interior failure.
  const grass=[];
  for(let y=Math.max(-3,old-2);y<=Math.min(19,old+5);y++)
    if(world.naturalAndLandmarkBlock(x,y,z)===BLOCK.GRASS)grass.push(y);
  if(grass.length&&(biome?.name==='enchanted')){
    if(weight>=.7){report.interiorGrassCount+=grass.length;result.interiorGrass+=grass.length;}
    else report.expectedEdgeGrassCount+=grass.length;
    if(report.witnesses.length<70){
      const y=grass[0],above=[],rejections=[];
      for(let ay=old-2;ay<=19;ay++){
        const prior=world._environmentBaseline(x,ay,z);
        const rejected=ay>old?prior!==BLOCK.AIR:
          ![BLOCK.GRASS,BLOCK.DIRT,BLOCK.STONE].includes(prior);
        if(rejected&&rejections.length<10)
          rejections.push({y:ay,prior,cave:world.environmentCaves?.get(x,ay,z),
            legacy:legacy.naturalAndLandmarkBlock(x,ay,z),
            originalBase:baseBlock(x,ay,z,seed)});
        if(ay>old&&prior!==BLOCK.AIR&&above.length<6)
          above.push({y:ay,id:prior,legacy:legacy.naturalAndLandmarkBlock(x,ay,z)});
      }
      report.witnesses.push({seed,tag,x,y,z,biome:biome.name,weight,old,top,
        cap:id,plan:plan.size,base:baseBlock(x,y,z,seed),
        legacy:legacy.naturalAndLandmarkBlock(x,y,z),above,rejections,
        edited:world.edits.has(x+','+y+','+z)});
    }
  }
  if(biome?.name==='enchanted'&&weight<.70&&report.witnesses.length<70&&
     id===BLOCK.GRASS)
    report.witnesses.push({seed,tag,x,z,biome:biome.name,weight,edgeMaterial:BLOCK.GRASS});
  return {biome,cap:id,plan:plan.size};
}
for(const seed of seeds){
  const world=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
  const legacy=new VoxelWorld(seed);
  const [cx,cz]=regionCenter(seed),result={seed,center:[cx,cz],columns:0,interior:0,shoulders:0,
    plains:0,interiorGrass:0,edgeCandidates:0};
  const seen=new Set();
  const sample=(x,z,tag)=>{
    const key=x+','+z;
    if(seen.has(key))return;
    seen.add(key);
    return collect(world,legacy,seed,x,z,tag,result);
  };
  // Real connected 41x41 square, seeded center: includes significant
  // variation rather than 21x21 isolated fixtures.
  for(let dz=-40;dz<=40;dz+=2)for(let dx=-40;dx<=40;dx+=2)
    sample(cx+dx,cz+dz,'interior-grid');
  // Cross all four warped biome borders by deterministic cardinal transects;
  // also check parallels so we do not infer a border from one exact row.
  for(const offset of [-112,-56,0,56,112]){
    for(let t=-360;t<=360;t+=4){
      sample(cx+t,cz+offset,'east-west-transect');
      sample(cx+offset,cz+t,'north-south-transect');
    }
  }
  for(const [dx,dz] of [[-10,0],[0,-10],[0,0],[10,0],[0,10]]){
    const x=cx+dx,z=cz+dz;
    const again=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
    for(let y=terrainHeight(x,z,seed)-1;y<=Math.min(19,terrainHeight(x,z,seed)+4);y++)
      assert.equal(world.naturalAndLandmarkBlock(x,y,z),
        again.naturalAndLandmarkBlock(x,y,z),'independent world repeatability');
    report.repeatable++;
  }
  // Count actual adjacent biome crossings in the sampled transects.
  for(let x=cx-360;x<cx+360;x+=4){
    const a=v6BiomeAt(x,cz,seed),b=v6BiomeAt(x+4,cz,seed);
    if((a?.name??'plains')!==(b?.name??'plains'))report.adjacentCrossings++;
  }
  report.perSeed.push(result);
}
mkdirSync('artifacts/enchanted-forest',{recursive:true});
writeFileSync('artifacts/enchanted-forest/phase1-wide-edge-audit.json',
  JSON.stringify(report,null,2)+'\n');
console.log('ENCHANTED WIDE EDGE AUDIT '+JSON.stringify({...report,witnesses:report.witnesses.slice(0,20)}));
assert.ok(report.interiorColumns>=3000,'Insufficient enchanted interior sample');
assert.ok(report.plainsColumns>0,'No legitimate plains boundary controls');
assert.ok(report.shoulderColumns>0,'No enchanted blend-edge controls');
assert.ok(report.adjacentCrossings>0,'No real biome crossings in transects');
assert.equal(report.interiorGrassCount,0,
  'Confirmed GRASS persisted in enchanted interior; inspect actual coordinate witnesses');
