// Real M7 V7 world-column geometry diagnostics for two photographed Desert interiors.
// Native Node only: NO synthetic cube proxy, browser, source edits or save writes.
// Results show whether straight shelves arise from actual terrain, protected
// baseline vetoes, or the projected camera; they do not silently change terrain.
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../../src/manual-biomes/profile-world.mjs';
import {terrainHeight,BLOCK} from '../../src/voxel.mjs';
import {WORLD_MAX_Y} from '../../src/depth.mjs';
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';

const centers=[[179,512,0,'golden'],[2026,384,0,'red']];
const R=24,WIDTH=2*R+1;
const OUTSIDE=new Set([BLOCK.AIR]);
function longestStraightEdge(grid,axis){
  let best={length:0,start:null,orientation:axis,heightBefore:null,heightAfter:null};
  for(let outer=0;outer<WIDTH-1;outer++){
    let run=0,runStart=0,pair=null;
    function flush(end){
      if(run>best.length)best={length:run,start:axis==='x'?
        [runStart-R,outer-R]:[outer-R,runStart-R],
        orientation:axis,heightBefore:pair?.[0]??null,heightAfter:pair?.[1]??null};
    }
    for(let inner=0;inner<=WIDTH;inner++){
      const v=inner<WIDTH?
        (axis==='x'?[grid[outer][inner],grid[outer+1][inner]]:
          [grid[inner][outer],grid[inner][outer+1]]):[null,null];
      const k=v.every(Number.isInteger)&&Math.abs(v[0]-v[1])>=2?
        v.join(':'):null;
      if(k&&k===pair?.join(':'))run++;
      else{flush(inner);pair=k?v:null;run=k?1:0;runStart=inner;}
    }
  }
  return best;
}
function read(seed,cx,cz,label){
  const world=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
  const grid=Array.from({length:WIDTH},()=>new Array(WIDTH));
  const raisedHist={},stepHist={},vetoExamples=[],transect=[],surfaceIds={};
  let veto=0,caveVeto=0,solidVeto=0,unchanged=0,changed=0,cells=0,grass=0;
  for(let dz=-R;dz<=R;dz++)for(let dx=-R;dx<=R;dx++){
    const x=cx+dx,z=cz+dz,biome=v6BiomeAt(x,z,seed);
    assert.equal(biome?.name,'desert','Photographed interior grid must be genuine V7 Desert');
    const old=terrainHeight(x,z,seed),plan=world._columnPlan(x,z);
    let top=null;
    for(let y=WORLD_MAX_Y;y>=Math.max(0,old-2);y--){
      const id=world.naturalAndLandmarkBlock(x,y,z);
      if(id===BLOCK.AIR)continue;
      // Exclude overhead non-terrain when identifying the real solid surface.
      if(y>old&&![256,257,258,259,260,261,262,263,264,BLOCK.GRASS,BLOCK.DIRT,BLOCK.STONE].includes(id))
        continue;
      top=y;
      surfaceIds[id]=(surfaceIds[id]??0)+1;
      if(id===BLOCK.GRASS)grass++;
      break;
    }
    assert.notEqual(top,null,'Original V7 floor is missing');
    const raised=top-old;
    raisedHist[raised]=(raisedHist[raised]??0)+1;
    if(raised)changed++;else unchanged++;
    if(!plan.size){
      veto++;
      let reason='unknown';
      for(let y=old-2;y<=WORLD_MAX_Y;y++){
        const prior=world._environmentBaseline(x,y,z);
        if(y>old?prior!==BLOCK.AIR:![BLOCK.GRASS,BLOCK.DIRT,BLOCK.STONE].includes(prior)){
          reason=prior===BLOCK.AIR?'protected-air':'protected-solid';break;
        }
      }
      if(reason==='protected-air')caveVeto++;
      if(reason==='protected-solid')solidVeto++;
      if(vetoExamples.length<12)vetoExamples.push({x,z,old,top,reason});
    }
    grid[dz+R][dx+R]=top;
    if(dz===0)transect.push({x,old,top,raised,plan:plan.size});
    cells++;
  }
  for(let z=0;z<WIDTH;z++)for(let x=0;x<WIDTH;x++){
    for(const [a,b] of [[0,1],[1,0]]){
      if(x+a>=WIDTH||z+b>=WIDTH)continue;
      const step=Math.abs(grid[z][x]-grid[z+b][x+a]);
      stepHist[step]=(stepHist[step]??0)+1;
    }
  }
  assert.equal(cells,WIDTH*WIDTH);
  assert.equal(world.save().edits.length,0,'Reading real V7 terrain may not save edits');
  const result={seed,label,center:[cx,cz],width:WIDTH,sourceColumns:cells,
    changes:{unchanged,raised:changed},heightAboveLegacy:raisedHist,
    planVeto:{total:veto,protectedAir:caveVeto,protectedSolid:solidVeto,examples:vetoExamples},
    actualTerrainTopIDs:surfaceIds,adjacentSteps:stepHist,
    straightShelf: [longestStraightEdge(grid,'x'),longestStraightEdge(grid,'z')],
    xTransectZ0:transect, naturalGrassAtTop:grass,savedEdits:0};
  console.log('DESERT_P3_GEOMETRY_SOURCE '+JSON.stringify(result));
}
for(const [seed,x,z,label] of centers)read(seed,x,z,label);
