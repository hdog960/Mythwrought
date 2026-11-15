// Pack 1 only: pure, source-level, coordinated-integration simulation.
// No VoxelWorld registration, save schema change, shared runtime write, or live placement.
import {PACK1_BUILDER_CATALOG,pack1BuilderPlacementPlan,
  resolvePack1BuilderFamily} from './builder-handoff.mjs';
import {candidateSurface} from './webgl2-candidates.mjs';
const CATALOG=new Map(PACK1_BUILDER_CATALOG.map(x=>[x.id,x]));
const FACES=Object.freeze({north:[0,0,-1],south:[0,0,1],east:[1,0,0],west:[-1,0,0]});
const byKey=c=>c.join(',');
// Deterministic noncryptographic corruption guard. Production integrator may
// use a stronger transport digest; this DOES NOT authorize live save changes.
function checksum(world,state){
  const payload=JSON.stringify([world.schema,world.seed,world.edits,
    state.turns,state.variants,state.mounts]);
  let h=2166136261;
  for(let i=0;i<payload.length;i++)h=Math.imul(h^payload.charCodeAt(i),16777619)>>>0;
  return h.toString(16).padStart(8,'0');
}
const sorted=(a,b)=>a.cell[0]-b.cell[0]||a.cell[1]-b.cell[1]||a.cell[2]-b.cell[2];
const validCell=c=>Array.isArray(c)&&c.length===3&&c.every(Number.isSafeInteger)&&
  c.every(v=>Math.abs(v)<=1000000);
function validateEdits(edits){
  if(!Array.isArray(edits)||edits.length>50000)throw new TypeError('Invalid legacy edits');
  const cells=new Map();
  for(const row of edits){
    if(!Array.isArray(row)||row.length!==4||!validCell(row.slice(0,3))||
       !Number.isInteger(row[3])||row[3]<0||row[3]>254)
      throw new TypeError('Invalid schema-1 edit row');
    const key=byKey(row.slice(0,3));
    if(cells.has(key))throw new Error('Duplicate save cell: '+key);
    cells.set(key,row[3]);
  }
  return cells;
}
function validateSeed(seed){
  if(!Number.isSafeInteger(seed)||seed< -2147483648||seed>2147483647)
    throw new TypeError('Invalid schema-1 seed');
}
function supportedAt(cells,cell,face){
  if(!Object.hasOwn(FACES,face))return false;
  const delta=FACES[face],id=cells.get(byKey(cell.map((v,i)=>v+delta[i])));
  // Conservative fixture-only proof: these source-backed supports are full solid cubes.
  // Central integration must validate all other packs' real physical support faces.
  return [2,3,4,8,9,10,11,12,13,14].includes(id);
}
function singleCell(data,name){
  if(!data||!validCell(data.cell)||!Number.isInteger(data.blockId))
    throw new TypeError('Invalid '+name+' record');
  return byKey(data.cell);
}
function boundedState(arr,name){
  if(!Array.isArray(arr)||arr.length>4096)throw new TypeError('Invalid '+name+' sidecar');
  const m=new Map();
  for(const e of arr){
    const key=singleCell(e,name);
    if(m.has(key))throw new Error('Duplicate '+name+' sidecar cell');
    m.set(key,e);
  }
  return m;
}
export function compilePack1Construction(placements,{seed=179,existingEdits=[]}={}){
  validateSeed(seed);
  if(!Array.isArray(placements)||placements.length>10000)
    throw new TypeError('Invalid Pack 1 construction placements');
  const existing=validateEdits(existingEdits);
  if([...existing.values()].some(id=>CATALOG.has(id)))
    throw new Error('Existing Pack 1 blocks require explicit metadata-aware restoration');
  const cells=new Map(existing),plans=[];
  for(const request of placements){
    if(!request||!validCell(request.cell))throw new TypeError('Invalid builder placement cell');
    const requested=resolvePack1BuilderFamily(request.symbolicRef,{
      candidateId:request.candidateId??null,
      rotation:request.rotation??0,variant:request.variant??'lower'
    });
    const face=request.wallFace??null;
    if(face!==null&&!Object.hasOwn(FACES,face))throw new TypeError('Unknown wall face');
    if(requested.support==='vertical-face'&&face===null)
      throw new Error('Wall-mounted candidate requires an explicit support direction');
    if(requested.support!=='vertical-face'&&face!==null)
      throw new Error('Non-mounted candidate cannot have wall metadata');
    const plan=pack1BuilderPlacementPlan(requested.id,{
      cell:request.cell,rotation:request.rotation??0,
      variant:request.variant??'lower',wallMounted:face!==null
    });
    if(!plan.ok)throw new Error('Invalid placement: '+plan.reason);
    const key=byKey(request.cell);
    if(cells.has(key))throw new Error('Construction conflicts with occupied cell: '+key);
    cells.set(key,requested.id);
    plans.push({plan,face});
  }
  const turns=[],variants=[],mounts=[];
  for(const {plan,face} of plans){
    const cell=plan.cell,blockId=plan.id;
    if(face!==null){
      if(!supportedAt(cells,cell,face))
        throw new Error('Mounted vine has no validated supporting cube at '+byKey(cell));
      mounts.push({cell:[...cell],blockId,face});
    }
    if(plan.requiredOrientationSidecar)turns.push({cell:[...cell],blockId,
      turns:plan.requiredOrientationSidecar.turns});
    if(plan.requiredVariantState)variants.push({cell:[...cell],blockId,
      variant:plan.requiredVariantState.variant});
  }
  if(Math.max(turns.length,variants.length,mounts.length)>4096)
    throw new RangeError('Pack 1 sidecar budget exceeded');
  const edits=[...cells].map(([key,id])=>[...key.split(',').map(Number),id]);
  edits.sort((a,b)=>a[0]-b[0]||a[1]-b[1]||a[2]-b[2]);
  turns.sort(sorted);variants.sort(sorted);mounts.sort(sorted);
  // Save schema stays exactly {schema,seed,edits}; supplemental state is disjoint.
  const world={schema:1,seed,edits},pack1State={version:1,turns,variants,mounts};
  pack1State.checksum=checksum(world,pack1State);
  return {world,pack1State};
}
export function inspectPack1Construction(bundle){
  if(!bundle||!bundle.world||bundle.world.schema!==1||
     !bundle.pack1State||bundle.pack1State.version!==1)
    throw new TypeError('Missing schema-1 world or explicit Pack 1 sidecar');
  validateSeed(bundle.world.seed);
  if(!/^[0-9a-f]{8}$/.test(bundle.pack1State.checksum)||
    bundle.pack1State.checksum!==checksum(bundle.world,bundle.pack1State))
    throw new Error('Pack 1 state checksum mismatch or missing; refuse silent metadata loss');
  const cells=validateEdits(bundle.world.edits);
  const state=bundle.pack1State;
  const turns=boundedState(state.turns,'orientation');
  const variants=boundedState(state.variants,'variant');
  const mounts=boundedState(state.mounts,'mount');
  const placements=[];
  for(const [key,id] of cells){
    if(!CATALOG.has(id))continue; // preserve legacy and other packs exactly
    const cell=key.split(',').map(Number);
    const tr=turns.get(key),vr=variants.get(key),mt=mounts.get(key);
    if(tr&&(tr.blockId!==id||!Number.isInteger(tr.turns)||tr.turns<1||tr.turns>3))
      throw new Error('Stale or invalid orientation sidecar');
    if(vr&&(vr.blockId!==id||vr.variant!=='upper'||![15,16].includes(id)))
      throw new Error('Stale or invalid upper-variant sidecar');
    if(mt&&(mt.blockId!==id||!Object.hasOwn(FACES,mt.face)))
      throw new Error('Stale or invalid mounted-support sidecar');
    const asset=CATALOG.get(id);
    if(asset.support==='vertical-face'){
      if(!mt||!supportedAt(cells,cell,mt.face))
        throw new Error('Missing or stale wall support for mounted Pack 1 plant');
    }else if(mt)throw new Error('Unexpected mount state for non-mounted asset');
    const plan=pack1BuilderPlacementPlan(id,{cell,rotation:tr?.turns??0,
      variant:vr?.variant??'lower',wallMounted:!!mt});
    if(!plan.ok)throw new Error('Cannot restore Pack 1 construction plan');
    placements.push({cell,id,symbolicRef:asset.symbolicRef,rotation:tr?.turns??0,
      variant:vr?.variant??'lower',wallFace:mt?.face??null,plan});
  }
  for(const [name,entries] of [['orientation',turns],['variant',variants],['mount',mounts]])
    for(const [key] of entries)if(!CATALOG.has(cells.get(key)))
      throw new Error('Orphan '+name+' record at '+key);
  return {placements,pack1Count:placements.length,otherCount:cells.size-placements.length};
}
export function removePack1Construction(bundle,cell){
  if(!validCell(cell))throw new TypeError('Invalid removal cell');
  inspectPack1Construction(bundle);
  const key=byKey(cell),edits=bundle.world.edits;
  const row=edits.find(x=>byKey(x.slice(0,3))===key);
  if(!row||!CATALOG.has(row[3]))throw new Error('Not an owned Pack 1 cell');
  const next={
    world:{schema:1,seed:bundle.world.seed,edits:edits.filter(x=>byKey(x.slice(0,3))!==key)
      .map(x=>[...x])},
    pack1State:{version:1,...Object.fromEntries(
      ['turns','variants','mounts'].map(k=>[k,bundle.pack1State[k]
        .filter(e=>byKey(e.cell)!==key).map(e=>({...e,cell:[...e.cell]}))]))}
  };
  next.pack1State.checksum=checksum(next.world,next.pack1State);
  inspectPack1Construction(next); // reject support removal; original remains untouched
  return next;
}
export function estimatePack1SourceLoad(bundle,{chunkSize=16,maxChunks=25}={}){
  if(!Number.isInteger(chunkSize)||chunkSize<1||chunkSize>32||
     !Number.isInteger(maxChunks)||maxChunks<1||maxChunks>64)
    throw new TypeError('Invalid conservative source budget');
  const {placements}=inspectPack1Construction(bundle);
  const chunks=new Set(),surfaces=new Map();
  let triangles=0,parts=0,vertices=0;
  for(const p of placements){
    chunks.add(Math.floor(p.cell[0]/chunkSize)+','+Math.floor(p.cell[2]/chunkSize));
    const key=p.id+':'+p.rotation;
    let mesh=surfaces.get(key);
    if(!mesh){mesh=candidateSurface(p.id,p.rotation);surfaces.set(key,mesh);}
    triangles+=mesh.triangles;parts+=mesh.partsCount;vertices+=mesh.triangles*3;
  }
  if(chunks.size>maxChunks)throw new RangeError('Source stress exceeds chunk sample budget');
  // Upper bound BEFORE any chunk-neighbor occlusion; not a GPU time / FPS claim.
  return {candidateCount:placements.length,chunkCount:chunks.size,sourceTriangles:triangles,
    sourceTriangleVertices:vertices,sourcePartInstances:parts,cachedSurfaces:surfaces.size,
    shaderFPSMeasured:false,productionChunkMeshMeasured:false,physicalIPhoneMeasured:false};
}
