// Standalone Desert Phase 1 evidence: use real V7 biome coordinates, real
// environmental tree plans and the canonical game-world voxel reader.
// No mock biome map, no synthetic success counts, no world/save mutations.
import assert from 'node:assert/strict';
import {test} from 'node:test';
import {BLOCK,terrainHeight} from '../src/voxel.mjs';
import {WORLD_MAX_Y} from '../src/depth.mjs';
import {ENVIRONMENT_GROUND as G} from '../src/environment-ground.mjs';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
import {naturalTreeTouchesDesert,environmentalTreesForChunk}
  from '../src/manual-biomes/environment-v7.mjs';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../src/manual-biomes/profile-world.mjs';

const SEEDS=[179,2026,2201,-443,77,-918];
const WORLD_SEEDS=[179,2026,2201];
const NEIGHBORS=['plains','snow','mountain','enchanted'];
const label=(x,z,seed)=>v6BiomeAt(x,z,seed)?.name??'plains';
const naturalLeaves=new Set([BLOCK.LEAVES,G.coldNeedles,G.snowyNeedles,
  G.aetherBark,G.aetherLeaves,G.moonLeaves]);
const key=(x,z)=>x+','+z;

// Probe actual biome fields across macrotiles and trace adjacent 1-block
// Desert borders for *each* of the four possible neighboring biomes.
// This is a deterministic census, not four hardcoded canonical coordinates.
function boundaryCensus(seed){
  const found=new Map(NEIGHBORS.map(name=>[name,[]]));
  const step=48,radius=1800,limit=2;
  for(let z=-radius;z<=radius;z+=step)
    for(let x=-radius;x<=radius;x+=step){
      const a=label(x,z,seed);
      for(const [sx,sz] of [[step,0],[0,step]]){
        const b=label(x+sx,z+sz,seed);
        if(a===b||a!=='desert'&&b!=='desert')continue;
        const neighbor=a==='desert'?b:a;
        if(!found.has(neighbor)||found.get(neighbor).length>=limit)continue;
        let previous=a;
        for(let offset=1;offset<=step;offset++){
          const px=x+(sx?offset-1:0),pz=z+(sz?offset-1:0);
          const nx=x+(sx?offset:0),nz=z+(sz?offset:0);
          const current=label(nx,nz,seed);
          if(current===previous)continue;
          if([current,previous].includes('desert')&&
             [current,previous].includes(neighbor)){
            const desert=previous==='desert'?[px,pz]:[nx,nz];
            const outside=previous==='desert'?[nx,nz]:[px,pz];
            found.get(neighbor).push({neighbor,desert,outside});
          }
          break;
        }
      }
    }
  for(const neighbor of NEIGHBORS){
    const rows=found.get(neighbor);
    assert.equal(rows.length,limit,
      'Missing genuine Desert/'+neighbor+' borders for seed '+seed);
    for(const {desert,outside} of rows){
      assert.equal(label(...desert,seed),'desert');
      assert.equal(label(...outside,seed),neighbor);
      assert.equal(Math.abs(desert[0]-outside[0])+
        Math.abs(desert[1]-outside[1]),1,'A border must be adjacent');
    }
  }
  return found;
}

test('V7 six seeds expose both sides of all four real, adjacent Desert biome boundaries',()=>{
  let samples=0;
  for(const seed of SEEDS){
    const discovered=boundaryCensus(seed);
    for(const name of NEIGHBORS)samples+=discovered.get(name).length;
    console.log('# DESERT_V7_REAL_BORDERS '+JSON.stringify({
      seed,pairs:Object.fromEntries(NEIGHBORS.map(name=>
        [name,discovered.get(name).map(({desert,outside})=>({desert,outside}))]))
    }));
  }
  assert.equal(samples,SEEDS.length*NEIGHBORS.length*2);
});

test('V7 six-seed tree plans have zero Desert trunk, leaf or cross-chunk canopy cells',()=>{
  const readColumn=()=>new Map([[5,BLOCK.GRASS]]);
  const readCell=(_x,y)=>y<=5?BLOCK.GRASS:BLOCK.AIR;
  let chunks=0,treeCells=0,desertColumns=0,borderPairs=0;
  for(const seed of SEEDS){
    const seenChunks=new Set();
    for(const [name,edges] of boundaryCensus(seed))
      for(const {desert,outside} of edges){
        borderPairs++;
        const [x,z]=desert;
        // Full 3x3 chunk halo catches overhangs and both sides of
        // every boundary, not just the root-containing chunk.
        for(let cz=Math.floor(z/16)-1;cz<=Math.floor(z/16)+1;cz++)
          for(let cx=Math.floor(x/16)-1;cx<=Math.floor(x/16)+1;cx++){
            const chunk=key(cx,cz);
            if(seenChunks.has(chunk))continue;
            seenChunks.add(chunk);
            const forward=environmentalTreesForChunk(
              cx,cz,seed,readColumn,readCell);
            const repeated=environmentalTreesForChunk(
              cx,cz,seed,readColumn,readCell);
            assert.deepEqual(repeated,forward,
              'Tree chunk changed on replay for '+seed+' '+chunk);
            chunks++;
            for(const [cell,id] of forward){
              const [tx,,tz]=cell.split(',').map(Number);
              if(label(tx,tz,seed)==='desert')desertColumns++;
              assert.notEqual(label(tx,tz,seed),'desert',
                'Actual generator emitted tree inside Desert at '+seed+' '+cell);
              assert.ok([BLOCK.WOOD,G.coldNeedles,G.snowyNeedles,
                G.aetherBark,G.aetherLeaves,G.moonLeaves].includes(id),
                'Unexpected generated tree material');
              treeCells++;
            }
          }
        assert.equal(label(...outside,seed),name);
      }
    console.log('# DESERT_V7_PLAN_CENSUS '+JSON.stringify({
      seed,chunks:seenChunks.size,treeCells,borderPairs,desertLeaks:desertColumns
    }));
  }
  assert.equal(borderPairs,48);
  assert.ok(chunks>=72,'Border corpus must cover multiple distinct chunks');
  assert.ok(treeCells>0,'Positive-control neighboring trees must really exist');
  assert.equal(desertColumns,0);
});

test('V7 canonical real-world reader exposes zero natural leaves across four desert-border types on three seeds',()=>{
  let worlds=0,readCells=0,desertColumns=0,adjacentPairs=0;
  const evidence=[];
  for(const seed of WORLD_SEEDS){
    const world=new FourRegionWorld(seed,
      fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
    assert.equal(world.generationProfile.generator,M7_ENVIRONMENT_GENERATOR);
    const edges=boundaryCensus(seed);
    let seedCells=0,seedColumns=0;
    const sampled=new Set();
    for(const [name,rows] of edges)
      for(const {desert,outside} of rows){
        adjacentPairs++;
        assert.equal(label(...outside,seed),name);
        const [a,b]=desert;
        for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++){
          const x=a+dx,z=b+dz;
          if(label(x,z,seed)!=='desert'||sampled.has(key(x,z)))continue;
          sampled.add(key(x,z));
          desertColumns++;
          seedColumns++;
          const low=Math.max(2,terrainHeight(x,z,seed)-2);
          for(let y=low;y<=WORLD_MAX_Y;y++){
            const id=world.naturalAndLandmarkBlock(x,y,z);
            assert.equal(naturalLeaves.has(id),false,
              'Natural leaf/bark voxel leaked into Desert: '+
              JSON.stringify({seed,neighbor:name,x,y,z,id}));
            readCells++;
            seedCells++;
          }
        }
      }
    // Sample an interior Desert plot in the same canonical gameplay reader.
    if(label(512,0,seed)==='desert')
      for(let dx=-3;dx<=3;dx++)for(let dz=-3;dz<=3;dz++){
        const x=512+dx,z=dz;
        if(label(x,z,seed)!=='desert'||sampled.has(key(x,z)))continue;
        sampled.add(key(x,z));desertColumns++;seedColumns++;
        for(let y=Math.max(2,terrainHeight(x,z,seed)-2);y<=WORLD_MAX_Y;y++){
          const id=world.naturalAndLandmarkBlock(x,y,z);
          assert.equal(naturalLeaves.has(id),false,
            'Interior Desert natural leaf/bark voxel '+JSON.stringify({seed,x,y,z,id}));
          readCells++;seedCells++;
        }
      }
    assert.equal(world.edits.size,0,'Census must not write player edits');
    worlds++;
    const row={seed,adjacentPairs:edges.size*2,desertColumns:seedColumns,
      realVoxelReads:seedCells,zeroNaturalFoliage:true,saveEdits:world.edits.size};
    evidence.push(row);
    console.log('# DESERT_V7_REAL_WORLD '+JSON.stringify(row));
  }
  assert.equal(worlds,WORLD_SEEDS.length);
  assert.equal(adjacentPairs,WORLD_SEEDS.length*NEIGHBORS.length*2);
  assert.ok(desertColumns>=40,'Expected multiple genuine Desert surface columns');
  assert.ok(readCells>=500,'Expected actual game-world voxel readings');
  console.log('# DESERT_V7_REAL_WORLD_TOTAL '+JSON.stringify({
    worlds,adjacentPairs,desertColumns,readCells,evidence
  }));
});
