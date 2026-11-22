// Read-only Mountain V8 tile census. Not connected to the live V7 engine.
// This deliberately calls the genuine read-only adapter with ONE shared
// original VoxelWorld per seed. No save, edit, chunk mesh, or profile mutation.
import {VoxelWorld,BLOCK} from '../voxel.mjs';
import {v6BiomeAt} from './v6-balanced-biomes.mjs';
import {WORLD_MAX_Y} from '../depth.mjs';
import {surveyMountainV8OriginalWorld} from './mountain-v8-original-world.mjs';
import {mountainV8TileRoot} from './mountain-v8-source-adapter.mjs';
import {planMountainV8PlantCells} from './mountain-v8-vegetation-cells.mjs';
import {planMountainV8PhysicalColumn} from './mountain-v8-physical-column.mjs';
import {certifyMountainV8Seam} from './mountain-v8-seam-certificate.mjs';
import {createMountainV8SurveyCache} from './mountain-v8-survey-cache.mjs';

const valid=n=>Number.isSafeInteger(n);
const key=(x,z)=>x+','+z;
const biomeProbes=Object.freeze([[0,0],[4,0],[-4,0],[0,4],[0,-4]]);
/** Every tile candidate is sampled at its single source-selected root.
 * No hypothetical random tree height is assumed; all plant cells are
 * verified against the untouched original world's existing AIR/landmarks.
 * The caller can inspect per-seed veto counts and supported physical-cell
 * budgets before any V8 integration.
 * Bounded to 64 tiles and exactly one source-backed site per tile.
 */
export function censusMountainV8Tiles({seed,tileX,tileZ,width=4,height=4,
  world,inspect=sourcSurvey}={}){
  if(!valid(seed)||seed!==(seed|0)||![tileX,tileZ,width,height].every(valid)||
     width<1||height<1||width*height>64||typeof inspect!=='function')return null;
  const source=world??new VoxelWorld(seed);
  if(source.constructor!==VoxelWorld||source.seed!==seed||
     source.edits.size||source.rotations.size)return null;
  const before=JSON.stringify(source.save()),sites=[],stats={
    tiles:width*height,eligible:0,plants:0,plantCells:0,
    rejected:0,terrainRejected:0,seamRejected:0,terrainCells:0,
    seamExposedFaces:0,
    seamVetoReasons:{biomeBoundary:0,sourceUnavailableInMountain:0,
      foreignProposal:0,noPhysicalSupport:0,invalidPhysicalDescriptor:0,
      physicalBudget:0,tooSteep:0,unsupportedExposedFace:0,
      faceBudget:0,unsafeCoordinate:0},
    nonMeadow:0,occupied:0,rock:0,snow:0,meadow:0,
    cliff:0,seen:0
  };
  // Reuse authentic original-world proposals across seam and foliage checks.
  // Nine possible sites per tile: one root, four seams, four foliage offsets.
  const cache=createMountainV8SurveyCache({seed,maxSites:width*height*9,
    read:(x,z)=>inspect(x,z,seed,{world:source})});
  if(!cache)return null;
  for(let dz=0;dz<height;dz++)for(let dx=0;dx<width;dx++){
    const tx=tileX+dx,tz=tileZ+dz;
    // One source-backed read at the unique owner site: 64x fewer
    // candidate surveys than scanning every square of each 8x8 tile.
    if(!valid(tx)||!valid(tz))return null;
    const root=mountainV8TileRoot(tx,tz,seed);
    if(!root)return null; // unsafe distant coordinates are never sampled
    const {rootX,rootZ}=root;
    const chosen=cache.survey(rootX,rootZ);
    stats.seen++;
    if(chosen&&(chosen.x!==rootX||chosen.z!==rootZ||
       !chosen.vegetationSite?.chosen))
      throw Error('V8 tile root or provenance mismatch');
    if(!chosen){stats.rejected++;continue;}
    const terrain=planMountainV8PhysicalColumn(chosen,{
      worldMaxY:WORLD_MAX_Y,ids:BLOCK,
      readOriginalBlock:(x,y,z)=>source.naturalAndLandmarkBlock(x,y,z)
    });
    if(!terrain){stats.terrainRejected++;continue;}
    // Source-backed one-block adjacency, not the 4-block noise slope proxy.
    // A protected cave or >2-height seam fails closed before admission.
    let seamVeto=null;
    const seam=certifyMountainV8Seam(rootX,rootZ,seed,(x,z)=>{
      return cache.survey(x,z);
    },{
      onVeto:issue=>{seamVeto=issue;},
      readSupport:p=>p.x===rootX&&p.z===rootZ?terrain:
        planMountainV8PhysicalColumn(p,{
          worldMaxY:WORLD_MAX_Y,ids:BLOCK,
          readOriginalBlock:(x,y,z)=>source.naturalAndLandmarkBlock(x,y,z)
        })
    });
    if(!seam){
      if(!seamVeto)throw Error('Unclassified V8 seam rejection');
      const code=seamVeto.reason;
      let category;
      if(code==='source-unavailable'){
        // A missing proposal could be a protected cave/landmark, but only
        // authoritative V6 climate can prove the missing site is a biome
        // border. Never guess a cave/landmark classification from null.
        const outside=biomeProbes.some(([dx,dz])=>{
          const b=v6BiomeAt(seamVeto.x+dx,seamVeto.z+dz,seed);
          return b?.name!=='mountain'||b.weight<.82;
        });
        category=outside?'biomeBoundary':'sourceUnavailableInMountain';
      }else category=({
        'foreign-proposal':'foreignProposal',
        'no-physical-support':'noPhysicalSupport',
        'invalid-physical-descriptor':'invalidPhysicalDescriptor',
        'physical-budget':'physicalBudget',
        'too-steep':'tooSteep',
        'unsupported-exposed-face':'unsupportedExposedFace',
        'face-budget':'faceBudget',
        'unsafe-coordinate':'unsafeCoordinate'
      })[code];
      if(!category||!Object.hasOwn(stats.seamVetoReasons,category))
        throw Error('Unexpected V8 seam veto reason: '+code);
      stats.seamVetoReasons[category]++;
      stats.seamRejected++;
      continue;
    }
    if(!seam.physicallyVerified||seam.exposedFaces.length>8)
      throw Error('Unverified V8 physical seam escaped rejection');
    stats.seamExposedFaces+=seam.exposedFaces.length;
    stats.terrainCells+=terrain.estimatedCells;
    stats.eligible++;
    if(chosen.cliff)stats.cliff++;
    if(chosen.cap==='snow')stats.snow++;
    else if(chosen.cap==='alpine-grass')stats.meadow++;
    else stats.rock++;
    if(!chosen.vegetation){stats.nonMeadow++;continue;}
    // Vegetation must also clear terrain *after* the V8 uplift, not merely
    // original AIR. Read at most five horizontal footprint coordinates,
    // memoized across every occupied cell of this sparse plant.
    const elevations=new Map();
    const proposedSurfaceAt=(x,z)=>{
      const k=key(x,z);
      if(!elevations.has(k)){
        const p=cache.survey(x,z);
        elevations.set(k,p?.top??null);
      }
      return elevations.get(k);
    };
    const physical=planMountainV8PlantCells(chosen,{
      worldMaxY:WORLD_MAX_Y,airId:BLOCK.AIR,
      proposedSurfaceAt,
      readOriginalBlock:(x,y,z)=>source.naturalAndLandmarkBlock(x,y,z),
      protectedAt:()=>false,
      mountainAt:(x,z)=>{const b=v6BiomeAt(x,z,seed);
        return b?.name==='mountain'&&b.weight>=.82;}
    });
    if(!physical){stats.occupied++;continue;}
    stats.plants++;stats.plantCells+=physical.estimatedCells;
    if(stats.plantCells>64*18)throw Error('Unbounded vegetation cells');
    sites.push(Object.freeze({tileX:tx,tileZ:tz,x:chosen.x,z:chosen.z,
      top:chosen.top,cap:chosen.cap,kind:physical.kind,
      cells:physical.estimatedCells}));
  }
  if(Object.values(stats.seamVetoReasons).reduce((a,b)=>a+b,0)!==stats.seamRejected)
    throw Error('V8 seam diagnostic counts failed to reconcile');
  Object.freeze(stats.seamVetoReasons);
  const readCosts=cache.stats();
  if(!readCosts.complete)throw Error('Mountain V8 source census budget exhausted');
  stats.sourceBudgetExhausted=readCosts.exhausted;
  stats.sourceSites=readCosts.uniqueSites;
  stats.sourceCacheHits=readCosts.cacheHits;
  stats.cachedSourceVetoes=readCosts.cachedRejections;
  if(stats.sourceSites>width*height*9)
    throw Error('Mountain V8 source budget exceeded');
  if(JSON.stringify(source.save())!==before||source.edits.size||source.rotations.size)
    throw Error('Read-only Mountain V8 census changed a schema-1 save');
  return Object.freeze({seed,stats:Object.freeze(stats),
    sites:Object.freeze(sites),source:'original-VoxelWorld-readonly',
    safeToIntegrate:false,generatorIdentityRequired:'v8-new-opt-in'});
}
function sourcSurvey(x,z,seed,options){
  return surveyMountainV8OriginalWorld(x,z,seed,options);
}
