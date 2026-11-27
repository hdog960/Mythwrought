// Phase46: detached finite-window retained structural deck revision.
// This is a NEW geometry candidate, not automatic veto-filter admission.
// No original terrain mutation, save, city approval, or production import.
import {createPeakGalleryProjection} from './peak-gallery-acceptance-renderer.mjs';
import {compactUpperHubResearchAirAt} from './compact-upper-hub-research.mjs';
import {planUnderworldRegion,networkAirAt} from './worldwide-network.mjs';
import {GALLERY_CONSTRUCTION_LIMITS as limits} from './physical-gallery-construction.mjs';
import {engineWantedSections} from './gallery-streaming-working-set.mjs';
import {isCandidateGeologyMaterial} from './protected-entrance-envelope.mjs';
import {VoxelWorld,BLOCK,baseBlock,chunkCoord,collides} from '../voxel.mjs';
import {sectionForY,sectionBounds,depthMeshKey} from '../depth.mjs';
import {gradeHallInsideOriginalMask} from './grade-hall-geometry.mjs';
import {traverseRetainedDescent} from './retained-switchback-descent-route.mjs';
const key=(x,y,z)=>x+','+y+','+z,xyz=k=>k.split(',').map(Number);
const dirs=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
const cardinal=dirs.filter(d=>d[1]===0);
const owner=(x,y,z)=>{const s=sectionForY(y);return s===null?null:depthMeshKey(chunkCoord(x),chunkCoord(z),s);};
const check=(v,m)=>{if(!v)throw Error(m);};
const peak=engineWantedSections(-40,-135,-3),selected=engineWantedSections(-40,-136,-2);
const stage=['-39,-135,-2','-39,-135,-3','-40,-135,-2','-40,-135,-3','-40,-136,-2','-40,-136,-3'];
export const RETAINED_DECK_CANDIDATE=Object.freeze({
 id:'retained-gallery-deck-research-v1',geometry:'compact network with immutable original gallery support decks',
 preservesOriginalGalleryClearance:true,addsNoCellsOutsideOriginalNetwork:true,constructionAdmission:false
});
function components(cells,neighbors){
 const label=new Map(),sizes=[];
 for(const start of cells){
  if(label.has(start))continue;
  const id=sizes.length,q=[start];label.set(start,id);
  for(let i=0;i<q.length;i++)for(const n of neighbors(q[i])){
   if(cells.has(n)&&!label.has(n)){label.set(n,id);q.push(n);}
  }
  sizes.push(q.length);
 }
 return {label,sizes};
}
const around=k=>{const [x,y,z]=xyz(k);return dirs.map(([a,b,c])=>key(x+a,y+b,z+c));};
export function captureRetainedDeckSource({extraOwners=[],socket=null,interlayer=null}={}){
 const p=createPeakGalleryProjection(),{original,cuts,floors}=p,legacy=new VoxelWorld(original.seed);
 const baseOwners=[...new Set([...peak,...selected])];
 check(baseOwners.length===42,'FROZEN_OWNER_SCOPE_CHANGED');
 check(Array.isArray(extraOwners)&&extraOwners.length<=16&&extraOwners.every(k=>typeof k==='string'&&/^-?\d+,-?\d+,-[45]$/.test(k)),'EXTRA_OWNER_SCOPE');
 const owners=[...new Set([...baseOwners,...extraOwners])],domain=new Set(owners);
 const inDomain=(x,y,z)=>domain.has(owner(x,y,z));
 const socketAir=socket?.air??new Set(),socketSupports=socket?.support??new Set();
 const socketConflicts={galleryFloor:0,galleryAir:0,compactSupport:0,addedCuts:0,outsideCompactCuts:0,checkedSupport:0,checkedAir:0};
 for(const k of socketAir){check(inDomain(...xyz(k)),'SOCKET_AIR_OWNER_MISSING:'+k);if(floors.has(k))socketConflicts.galleryFloor++;check(networkAirAt(original.seed,...xyz(k)),'SOCKET_OUTSIDE_FROZEN_NETWORK:'+k);}
 for(const k of socketSupports){check(inDomain(...xyz(k)),'SOCKET_SUPPORT_OWNER_MISSING:'+k);if(cuts.has(k))socketConflicts.galleryAir++;check(!socketAir.has(k),'SOCKET_SELF_CONFLICT:'+k);}
 check(!socketConflicts.galleryFloor&&!socketConflicts.galleryAir,'SOCKET_GALLERY_MUTUAL_VETO');
 const interlayerAir=interlayer?.air??new Set(),interlayerSupports=interlayer?.support??new Set();
 const interlayerSource={checkedSupport:0,checkedAir:0,addedCuts:0};
 if(interlayer){
  check(socket,'INTERLAYER_REQUIRES_EXACT_SOCKET');
  for(const k of interlayerAir){
   check(inDomain(...xyz(k)),'INTERLAYER_AIR_OWNER_MISSING:'+k);
   check(!floors.has(k)&&!socketSupports.has(k)&&!interlayerSupports.has(k),'INTERLAYER_AIR_SUPPORT_CONFLICT:'+k);
   check(networkAirAt(original.seed,...xyz(k)),'INTERLAYER_OUTSIDE_FROZEN_NETWORK:'+k);
  }
  for(const k of interlayerSupports){
   check(inDomain(...xyz(k)),'INTERLAYER_SUPPORT_OWNER_MISSING:'+k);
   check(!cuts.has(k)&&!socketAir.has(k),'INTERLAYER_SUPPORT_AIR_CONFLICT:'+k);
  }
 }
 const retainedSupports=new Set([...floors,...socketSupports,...interlayerSupports]);
 const data=new Map(),rows=[],rawAir=new Set(),revisedAir=new Set(),future=new Set(),conflicts=new Set(),otherVetoes=[];
 const rawRequest=new Set(),revisedCuts=new Set(),floorValues=new Map(),halo=new Map();
 let sourceCalls=0,maxOwnerReads=0,checked=0;
 // Independent exact read of each full owner and its halo for both candidate
 // geometry and topology. All source calls charged BEFORE execution, no
 // uncounted cross-owner source reads inside each transaction. Reuse halo
 // samples across owner boundaries; direct entries, not internal generator work.
 for(const k of owners){
  const [cx,cz,s]=xyz(k),b=sectionBounds(s),row={key:k,reads:0,checked:0,requests:0,newCuts:0,retainedDeck:0,unsafe:0};
  const read=fn=>{if(row.reads>=limits.originalNaturalReads)throw Error('DECK_OWNER_READ_LIMIT:'+k);row.reads++;sourceCalls++;return fn();};
  const get=(x,y,z)=>{const c=key(x,y,z);if(!halo.has(c))halo.set(c,read(()=>original.get(x,y,z)));return halo.get(c);};
  // Full one-cell halo includes all six real face-neighbor source positions.
  for(let y=b.minY-1;y<=b.maxY+1;y++)for(let x=cx*16-1;x<=cx*16+16;x++)for(let z=cz*16-1;z<=cz*16+16;z++)get(x,y,z);
  for(let y=b.minY;y<=b.maxY;y++)for(let x=cx*16;x<cx*16+16;x++)for(let z=cz*16;z<cz*16+16;z++){
   const c=key(x,y,z),id=get(x,y,z);data.set(c,id);row.checked++;checked++;
   const compact=compactUpperHubResearchAirAt(original.seed,x,y,z);
   const socketCut=socketAir.has(c),socketFloor=socketSupports.has(c);
   const interlayerCut=interlayerAir.has(c),interlayerFloor=interlayerSupports.has(c);
   const stairAir=socketCut||interlayerCut,stairSupport=socketFloor||interlayerFloor,mask=compact||stairAir;
   const baseAir=id===BLOCK.AIR||cuts.has(c);
   if(mask)rawRequest.add(c);
   if(baseAir||mask)rawAir.add(c);
   if(stairAir||stairSupport){
    const edited=read(()=>original.edits.has(c)),authored=read(()=>original.environmentCaves.get(x,y,z));
    const protectedCell=read(()=>legacy.naturalAndLandmarkBlock(x,y,z))!==read(()=>baseBlock(x,y,z,original.seed));
    const material=read(()=>original.naturalAndLandmarkBlock(x,y,z));
    const routeName=socketCut||socketFloor?'SOCKET':'INTERLAYER';
    check(!edited&&!protectedCell&&(authored===undefined||stairAir&&authored===BLOCK.AIR)&&isCandidateGeologyMaterial(material),routeName+'_SOURCE_VETO:'+c);
    if(stairSupport)check(!baseAir,routeName+'_SUPPORT_MISSING:'+c);
    if(socketFloor){socketConflicts.checkedSupport++;if(compact)socketConflicts.compactSupport++;}
    if(socketCut){socketConflicts.checkedAir++;if(!baseAir){socketConflicts.addedCuts++;if(!compact)socketConflicts.outsideCompactCuts++;}}
    if(interlayerFloor)interlayerSource.checkedSupport++;
    if(interlayerCut){interlayerSource.checkedAir++;if(!baseAir&&!socketCut)interlayerSource.addedCuts++;}
   }
   if(retainedSupports.has(c)){
    check(!baseAir,'RETAINED_DECK_BASELINE_NOT_SOLID:'+c);
    floorValues.set(c,id);
   }
   if(baseAir){revisedAir.add(c);if(mask&&id!==BLOCK.AIR)row.requests++;continue;}
   if(!mask)continue;
   row.requests++;row.newCuts++;
   if(retainedSupports.has(c)){if(floors.has(c)){conflicts.add(c);row.retainedDeck++;}continue;}
   let reason=null;
   if(original.edits.has(c))reason='PLAYER_EDIT';
   else if(read(()=>original.environmentCaves.get(x,y,z))!==undefined)reason='AUTHORED_SOURCE';
   else if(read(()=>legacy.naturalAndLandmarkBlock(x,y,z))!==read(()=>baseBlock(x,y,z,original.seed)))reason='LANDMARK';
   else if(!isCandidateGeologyMaterial(id))reason='UNSAFE_MATERIAL';
   if(reason){row.unsafe++;otherVetoes.push({cell:c,reason});continue;}
   future.add(c);revisedAir.add(c);
  }
  maxOwnerReads=Math.max(maxOwnerReads,row.reads);rows.push(row);
 }
 // Refuse the ENTIRE revised geometry on any non-deck veto, never approve a
 // subset of a failed source request. Deck precedence is explicit geometry;
 // connectivity and combined budget proof are independent mandatory gates.
 check(otherVetoes.length===0,'NON_DECK_VETO:'+JSON.stringify(otherVetoes.slice(0,8)));
 for(const c of conflicts)check(floorValues.has(c)&&!revisedAir.has(c),'DECK_GEOMETRY_LOST:'+c);
 for(const c of future){check(rawRequest.has(c)&&!retainedSupports.has(c)&&!cuts.has(c),'NEW_GEOMETRY_ESCAPED:'+c);revisedCuts.add(c);}
 return {p,original,cuts,floors:retainedSupports,galleryFloors:floors,socket,socketAir,socketSupports,socketConflicts,interlayer,interlayerAir,interlayerSupports,interlayerSource,owners,baseOwners,domain,inDomain,data,rows,rawAir,revisedAir,future,conflicts,rawRequest,floorValues,halo,sourceCalls,maxOwnerReads,checked};
}
// Construct deterministic topology-only connector centerlines through the
// complete source-qualified compact envelope. No pre-existing solid support
// can be removed. This is explicit added geometry, not filtering a failure
// or certifying a one-voxel bore as a walkable corridor.
function connectRetainedComponents(c,selectedAir){
 const open=new Set(selectedAir),extra=new Set(),paths=[];
 const root=key(-628,-30,-2162),originalParts=components(c.rawAir,around),rawId=originalParts.label.get(root);
 const available=new Set([...c.revisedAir].filter(k=>originalParts.label.get(k)===rawId));
 for(let round=0;round<12;round++){
  const parts=components(open,around);
  const rootPieces=new Set([...parts.label].filter(([k])=>available.has(k)).map(([,id])=>id));
  if(rootPieces.size<=1)return {ok:true,extra,paths,components:parts.sizes.length,rootPieces:rootPieces.size};
  const id=parts.label.get(root);if(id===undefined)throw Error('CONNECTOR_ROOT_MISSING');
  // Dijkstra in integer buckets: cost1 for open passage, cost8 for new
  // excavation, deterministic tie order. Cap path search and new cuts.
  const buckets=Array.from({length:2049},()=>[]),dist=new Map(),parent=new Map();
  for(const [k,v] of parts.label)if(v===id){dist.set(k,0);parent.set(k,null);buckets[0].push(k);}
  let found=null,visited=0;
  outer:for(let d=0;d<buckets.length;d++)for(const k of buckets[d]){
   if(dist.get(k)!==d)continue;
   if(++visited>available.size)break outer;
   if(open.has(k)&&parts.label.get(k)!==id){found=k;break outer;}
   for(const n of around(k)){
    if(!available.has(n))continue;
    const nd=d+(open.has(n)?1:8);
    if(nd>=buckets.length||nd>=(dist.get(n)??Infinity))continue;
    dist.set(n,nd);parent.set(n,k);buckets[nd].push(n);
   }
  }
  if(!found)return {ok:false,reason:'NO_SOURCE_SAFE_AIR_CONNECTOR',extra,paths,components:parts.sizes.length};
  const path=[];for(let k=found;k!==null;k=parent.get(k))path.push(k);
  path.reverse();
  const additions=path.filter(k=>!open.has(k));
  if(extra.size+additions.length>128||path.length>192)return {ok:false,reason:'CONNECTOR_GEOMETRY_CAP',extra,paths,components:parts.sizes.length};
  for(const k of additions){check(c.future.has(k)&&!c.floors.has(k),'CONNECTOR_SOURCE_ESCAPE');extra.add(k);open.add(k);}
  paths.push({from:path[0],to:path.at(-1),length:path.length,newCuts:additions.length,cells:additions});
 }
 return {ok:false,reason:'CONNECTOR_COMPONENT_CAP',extra,paths,components:components(open,around).sizes.length};
}
export function inspectRetainedDeckCandidate({capture=null,profile=null,joinAir=false,inspectProjection=null}={}){
 const c=capture??captureRetainedDeckSource();
 if(profile?.exactStairways)check(c.socket&&c.interlayer,'HALL_REQUIRES_BOTH_STAIRWAYS');
 const {p,original,cuts,floors,owners,domain,inDomain,data,rawAir,conflicts,rawRequest,floorValues,halo,sourceCalls,maxOwnerReads,checked}=c;
 const rows=c.rows.map(r=>({...r})),otherVetoes=[];
 const future=profile?new Set([...c.future].filter(k=>c.socketAir.has(k)||c.interlayerAir.has(k)||gradeHallInsideOriginalMask(original.seed,...xyz(k),profile))):new Set(c.future);
 const revisedCuts=future,revisedAir=new Set([...c.revisedAir].filter(k=>!c.future.has(k)||future.has(k)));
 const connector=joinAir?connectRetainedComponents(c,revisedAir):null;
 if(connector)for(const k of connector.extra){future.add(k);revisedAir.add(k);}
 const sourceAt=(x,y,z)=>{
  const c=key(x,y,z);if(!halo.has(c))throw Error('OUTSIDE_CAPTURED_ORIGINAL_HALO:'+c);return halo.get(c);
 };
 const projectedAt=(x,y,z)=>{
  const c=key(x,y,z);return cuts.has(c)||revisedCuts.has(c)?BLOCK.AIR:sourceAt(x,y,z);
 };
 const view=Object.create(original);
 Object.defineProperty(view,'get',{value:projectedAt});
 Object.defineProperty(view,'set',{value(){throw Error('READ_ONLY_COMBINED_PROJECTION');}});
 const replayExact=(path)=>{
  const forward=traverseRetainedDescent(view,path),reverse=traverseRetainedDescent(view,[...path].reverse());
  return {forward,reverse,stations:path.length,ok:forward.ok&&reverse.ok};
 };
 const replayProtected=(route)=>{
  if(!route)return null;
  const replay=replayExact(route.joined);
  const supportParity=[...route.support].every(k=>projectedAt(...xyz(k))===data.get(k)&&data.get(k)!==BLOCK.AIR);
  const airParity=[...route.air].every(k=>projectedAt(...xyz(k))===BLOCK.AIR);
  return {...replay,supportParity,airParity,ok:replay.ok&&supportParity&&airParity};
 };
 const socketReplay=replayProtected(c.socket),interlayerReplay=replayProtected(c.interlayer);
 // Independent binary full-cube face census on complete owner interiors and
 // halo, not the sparse changed-face accumulator from previous sessions.
 for(const row of rows){
  const [cx,cz,s]=xyz(row.key),b=sectionBounds(s);
  let oldFaces=0,galleryFaces=0,combinedFaces=0,galleryCuts=0,combinedCuts=0;
  const air=(x,y,z,mode)=>{const c=key(x,y,z);return sourceAt(x,y,z)===BLOCK.AIR||
   mode>=1&&cuts.has(c)||mode===2&&revisedCuts.has(c);};
  for(let y=b.minY;y<=b.maxY;y++)for(let x=cx*16;x<cx*16+16;x++)for(let z=cz*16;z<cz*16+16;z++){
   const a=air(x,y,z,0),g=air(x,y,z,1),n=air(x,y,z,2);
   if(!a&&g)galleryCuts++;if(!a&&n)combinedCuts++;
   if(n){}else for(const [dx,dy,dz] of dirs)combinedFaces+=Number(air(x+dx,y+dy,z+dz,2));
   if(!g)for(const [dx,dy,dz] of dirs)galleryFaces+=Number(air(x+dx,y+dy,z+dz,1));
   if(!a)for(const [dx,dy,dz] of dirs)oldFaces+=Number(air(x+dx,y+dy,z+dz,0));
  }
  Object.assign(row,{galleryCuts,combinedCuts,oldFaces,galleryFaces,combinedFaces,
   galleryGrowth:Math.max(0,galleryFaces-oldFaces),combinedGrowth:Math.max(0,combinedFaces-oldFaces)});
 }
 const cost=(keys,stageKeys=[])=>{
  const r=rows.filter(x=>keys.includes(x.key)),s=rows.filter(x=>stageKeys.includes(x.key));
  const sum=(a,f)=>a.reduce((n,x)=>n+x[f],0);
  const out={owners:r.length,galleryCuts:sum(r,'galleryCuts'),galleryFaces:sum(r,'galleryGrowth'),
   combinedCuts:sum(r,'combinedCuts'),combinedFaces:sum(r,'combinedGrowth'),
   maxOwnerFaces:Math.max(0,...r.map(x=>x.combinedGrowth)),
   stagedCuts:sum(r,'combinedCuts')+sum(s,'combinedCuts'),stagedFaces:sum(r,'combinedGrowth')+sum(s,'combinedGrowth')};
  return {...out,withinLimits:out.combinedCuts<=limits.ownedCarves&&out.combinedFaces<=limits.faceGrowth&&
   out.maxOwnerFaces<=limits.perChunkFaceGrowth&&out.stagedCuts<=limits.ownedCarves&&out.stagedFaces<=limits.faceGrowth};
 };
 // Six-neighbor AIR connectivity is independent of controller walkability.
 // Compare surviving cell membership for each original raw-air component.
 const before=components(rawAir,around),after=components(revisedAir,around),mapped=new Map();
 for(const c of revisedAir){const a=before.label.get(c),b=after.label.get(c);check(a!==undefined,'AIR_CREATED_OUTSIDE_RAW_GEOMETRY');if(!mapped.has(a))mapped.set(a,new Set());mapped.get(a).add(b);}
 const componentBounds=after.sizes.map(size=>({size,min:[Infinity,Infinity,Infinity],max:[-Infinity,-Infinity,-Infinity],example:null}));
 for(const [k,id] of after.label){const p=xyz(k),b=componentBounds[id];b.example??=k;for(let i=0;i<3;i++){b.min[i]=Math.min(b.min[i],p[i]);b.max[i]=Math.max(b.max[i],p[i]);}}
 const split=[...mapped].filter(([,ids])=>ids.size>1).map(([id,ids])=>({rawSize:before.sizes[id],pieces:[...ids].map(i=>after.sizes[i])}));
 let boundaryRaw=0,boundaryRevised=0,removedBoundary=0;
 for(const c of rawAir){const [x,y,z]=xyz(c);if(dirs.some(([a,b,d])=>!inDomain(x+a,y+b,z+d))){boundaryRaw++;if(revisedAir.has(c))boundaryRevised++;else removedBoundary++;}}
 // Walk graph: body and support use actual original native collision.
 // Only captured interior cells may be graph feet; one-cell halo is source
 // data, not a claim that future geometry outside the window is constructed.
 const feet=new Set();
 for(const c of revisedAir){
  const [x,y,z]=xyz(c);
  if(!inDomain(x,y-1,z)||!inDomain(x,y+1,z))continue;
  if(projectedAt(x,y-1,z)===BLOCK.AIR||projectedAt(x,y+1,z)!==BLOCK.AIR)continue;
  if(!collides(view,x+.5,y,z+.5)&&collides(view,x+.5,y-.002,z+.5))feet.add(c);
 }
 const adjacent=c=>{
  const [x,y,z]=xyz(c),out=[];
  for(const [a,,d] of cardinal)for(const dy of [0,1,-1]){
   const n=key(x+a,y+dy,z+d);if(!feet.has(n))continue;
   // A one-block riser must have headroom on the lower side in both directions.
   const low=dy>0?[x,y,z]:[x+a,y+dy,z+d];
   if(dy&&(!inDomain(low[0],low[1]+2,low[2])||projectedAt(low[0],low[1]+2,low[2])!==BLOCK.AIR))continue;
   out.push(n);
  }return out;
 };
 let joinedReplay=null;
 if(socketReplay?.ok&&interlayerReplay?.ok){
  const stationKey=p=>key(p.x,p.feet,p.z);
  const from=stationKey(c.interlayer.joined.at(-1)),to=stationKey(c.socket.joined[0]);
  const [fromX,fromY,fromZ]=xyz(from),[toX,toY,toZ]=xyz(to);
  const junctionRadius=Math.abs(fromX-toX)+Math.abs(fromZ-toZ)+4;
  const junction=[from],previous=new Map([[from,null]]);
  // The qualified routes terminate in the same hub. Search only around the
  // existing junction and re-run the entire walk without resetting the player.
  for(let i=0;i<junction.length&&!previous.has(to);i++)for(const next of adjacent(junction[i])){
   const [x,y,z]=xyz(next);
   if(previous.has(next)||Math.abs(x-fromX)+Math.abs(z-fromZ)>junctionRadius||y<Math.min(fromY,toY)-2||y>Math.max(fromY,toY)+2)continue;
   previous.set(next,junction[i]);junction.push(next);
  }
  if(previous.has(to)){
   const bridge=[];
   for(let at=previous.get(to);at!==null&&at!==from;at=previous.get(at)){
    const [x,feet,z]=xyz(at);bridge.push({x,feet,z});
   }
   bridge.reverse();
   joinedReplay={bridge,...replayExact([...c.interlayer.joined,...bridge,...c.socket.joined.slice(Number(from===to))])};
  }else joinedReplay={ok:false,reason:'NO_SUPPORTED_HUB_JUNCTION'};
 }
 const walk=components(feet,adjacent),start=key(-628,-30,-2162);
 check(feet.has(start),'PREVIOUSLY_QUALIFIED_CAMERA_LOST');
 const parent=new Map([[start,null]]),distance=new Map([[start,0]]),queue=[start];
 for(let i=0;i<queue.length;i++)for(const n of adjacent(queue[i]))if(!parent.has(n)){parent.set(n,queue[i]);distance.set(n,distance.get(queue[i])+1);queue.push(n);}
 const routes=[],plan=planUnderworldRegion(original.seed,-3,-9);
 const replay=(label,target)=>{
  if(!target){routes.push({label,ok:false,reason:'NO_REACHABLE_SUPPORTED_TARGET'});return;}
  const path=[];for(let at=target;at!==null;at=parent.get(at))path.push(at);
  path.reverse();
  if(path.length>256){routes.push({label,ok:false,reason:'NATIVE_REPLAY_STATION_CAP',stations:path.length});return;}
  const points=path.map(c=>{const [x,feet,z]=xyz(c);return {x,feet,z};});
  let forward,reverse;
  try{forward=traverseRetainedDescent(view,points);reverse=traverseRetainedDescent(view,[...points].reverse());}
  catch(e){routes.push({label,target,ok:false,reason:String(e),stations:points.length});return;}
  routes.push({label,target,stations:points.length,forward,reverse,ok:forward.ok&&reverse.ok});
 };
 const reachableNew=queue.filter(c=>future.has(c));
 reachableNew.sort((a,b)=>distance.get(b)-distance.get(a)||a.localeCompare(b));
 replay('gallery to new cavern supported floor',reachableNew.find(c=>distance.get(c)<=180));
 if(profile){replay('phase48 52-station endpoint',parent.has('-653,-31,-2168')?'-653,-31,-2168':null);replay('phase47 55-station endpoint',parent.has('-656,-31,-2170')?'-656,-31,-2170':null);replay('previous cavern endpoint',parent.has('-656,-32,-2171')?'-656,-32,-2171':null);replay('previous hub endpoint',parent.has('-625,-31,-2153')?'-625,-31,-2153':null);}
 const anchors=[];
 for(const [name,a] of [['upper hub',plan.layers[0].hub],['middle hub',plan.layers[1].hub],...Object.entries(plan.layers[0].portals),['upper socket',plan.surfaceSocket]]){
  const inside=inDomain(a.x,a.y,a.z);
  if(!inside){anchors.push({name,anchor:a,scope:'outside finite owner union',qualified:false});continue;}
  const options=queue.filter(c=>{const [x,y,z]=xyz(c);return Math.hypot(x-a.x,z-a.z)<=3&&Math.abs(y-a.y)<=10;})
   .sort((a,b)=>distance.get(a)-distance.get(b));
  anchors.push({name,anchor:a,scope:'inside',reachableSupportedFeet:options.length,qualified:false});
  replay(name,options[0]);
 }
 // Independently replay genuine lower chamber walking on the expanded
 // owner snapshot. Do not imply upper/lower pedestrian continuity.
 const middle=plan.layers[1].hub,lowerRoutes=[];
 if(c.owners.length>42){
  const lowerFeet=[...feet].filter(k=>{const [x,y,z]=xyz(k);return y>=middle.y-4&&y<=middle.y+5&&Math.abs(x-middle.x)<=32&&Math.abs(z-middle.z)<=32;});
  const startLower=lowerFeet.filter(k=>{const [x,y,z]=xyz(k);return Math.abs(x-middle.x)+Math.abs(z-middle.z)<=3&&Math.abs(y-middle.y)<=2;}).sort((a,b)=>{
   const score=k=>{const [x,y,z]=xyz(k);return Math.abs(x-middle.x)+Math.abs(y-middle.y)+Math.abs(z-middle.z);};return score(a)-score(b)||a.localeCompare(b);
  })[0];
  if(startLower){
   const allowed=new Set(lowerFeet),parents=new Map([[startLower,null]]),q=[startLower];
   for(let i=0;i<q.length;i++)for(const n of adjacent(q[i]))if(allowed.has(n)&&!parents.has(n)){parents.set(n,q[i]);q.push(n);}
   for(const [label,predicate] of [['west lower opening',([x,y,z])=>x<=middle.x-24&&Math.abs(z-(middle.z+6))<=3],['north lower hall',([x,y,z])=>z<=middle.z-16],['east lower hall',([x,y,z])=>x>=middle.x+20]]){
    const target=q.find(k=>predicate(xyz(k)));
    if(!target){lowerRoutes.push({label,ok:false,reason:'NO_SUPPORTED_TARGET'});continue;}
    const route=[];for(let k=target;k!==null;k=parents.get(k)){const [x,feet,z]=xyz(k);route.push({x,feet,z});}
    route.reverse();let forward,reverse;
    try{forward=traverseRetainedDescent(view,route);reverse=traverseRetainedDescent(view,[...route].reverse());}catch(e){lowerRoutes.push({label,ok:false,reason:String(e),stations:route.length});continue;}
    lowerRoutes.push({label,target,stations:route.length,forward,reverse,ok:forward.ok&&reverse.ok});
   }
  }else lowerRoutes.push({label:'middle hub',ok:false,reason:'NO_SUPPORTED_MIDDLE_START'});
 }
 // Compare actual crossing pairs on every owner-union boundary plane.
 // External future AIR is hypothetical, not source-admitted. For each raw
 // connected opening patch require a surviving crossing in that same patch.
 const seamGroups=new Map();
 for(const k of rawAir){
  const [x,y,z]=xyz(k);
  for(const [dx,dy,dz] of dirs){
   const a=x+dx,b=y+dy,d=z+dz;if(inDomain(a,b,d))continue;
   const other=key(a,b,d),old=sourceAt(a,b,d)===BLOCK.AIR||cuts.has(other);
   const proposed=compactUpperHubResearchAirAt(original.seed,a,b,d);
   if(!old&&!proposed)continue;
   const group=[dx,dy,dz,dx?x:dy?y:z].join(',');
   if(!seamGroups.has(group))seamGroups.set(group,new Map());
   const outside=old||proposed&&!floors.has(other)&&(!profile||gradeHallInsideOriginalMask(original.seed,a,b,d,profile));
   seamGroups.get(group).set(k,{survives:revisedAir.has(k)&&outside,originalOutsideAir:old});
  }
 }
 let patches=0,lostPatches=0,rawCrossings=0,retainedCrossings=0,originalOutsideCrossings=0;const lost=[];
 for(const [plane,cells] of seamGroups){
  const [dx,dy,dz]=xyz(plane),tangent=dirs.filter(([a,b,d])=>a*dx+b*dy+d*dz===0);
  const labels=components(new Set(cells.keys()),k=>{const [x,y,z]=xyz(k);return tangent.map(([a,b,d])=>key(x+a,y+b,z+d));});
  const counts=labels.sizes.map(size=>({size,kept:0,example:null}));
  for(const [k,id] of labels.label){const entry=cells.get(k);counts[id].kept+=Number(entry.survives);counts[id].example??=k;originalOutsideCrossings+=Number(entry.survives&&entry.originalOutsideAir);}
  for(const row of counts){patches++;rawCrossings+=row.size;retainedCrossings+=row.kept;if(!row.kept){lostPatches++;if(lost.length<12)lost.push({plane,...row});}}
 }
 const peakCost=cost(peak,stage),selectedCost=cost(selected,stage),middleCost=cost(engineWantedSections(-40,-135,-5));
 // Fixed earlier boundary patch remains measurable even when the expanded
 // capture moves the owner-union boundary west. Require both actual cells.
 const westPatch={originalPairs:0,actualOpenPairs:0,examples:[]};
 if(c.owners.length>42)for(let z=-2157;z<=-2147;z++)for(let y=-67;y<=-64;y++){
  if(!inDomain(-656,y,z)||!inDomain(-657,y,z)||!compactUpperHubResearchAirAt(original.seed,-656,y,z)||!compactUpperHubResearchAirAt(original.seed,-657,y,z))continue;
  westPatch.originalPairs++;if(projectedAt(-656,y,z)===BLOCK.AIR&&projectedAt(-657,y,z)===BLOCK.AIR){westPatch.actualOpenPairs++;westPatch.examples.push([-656,y,z]);}
 }
 // Export the exact projection only to the detached native measurement
 // callback, never a live generator or a writable source.
 if(inspectProjection)inspectProjection({view,rows,future,owners,original,projectedAt});
 const floorReadback=[...floorValues].every(([c,id])=>projectedAt(...xyz(c))===id);
 check(floorReadback,'RETAINED_DECK_READBACK_FAILED');
 check(JSON.stringify(original.save())===p.initial,'SOURCE_SAVE_MUTATED');
 return {candidate:profile??RETAINED_DECK_CANDIDATE,owners:owners.length,checked,originalGalleryCuts:cuts.size,
  rawRequests:rows.reduce((n,r)=>n+r.requests,0),rawNewCuts:rows.reduce((n,r)=>n+r.newCuts,0),
  originalFloorConflicts:conflicts.size,remainingFloorConflicts:0,retainedFloorCells:floorValues.size,
  futureCuts:future.size,otherVetoes:otherVetoes.length,floorReadback,sourceCalls,maxOwnerReads,
  peakCost,selectedCost,middleCost,westPatch,socketReplay,socketSource:c.socketConflicts,interlayerReplay,interlayerSource:c.interlayerSource,joinedReplay,baseOwnerCount:c.baseOwners.length,baseFloorConflicts:rows.filter(r=>c.baseOwners.includes(r.key)).reduce((n,r)=>n+r.retainedDeck,0),connector:connector?{...connector,extra:[...connector.extra]}:null,lowerRoutes,rows,airConnectivity:{rawComponents:before.sizes.length,revisedComponents:after.sizes.length,
   splitComponents:split.length,splitExamples:split.slice(0,8),componentBounds:componentBounds.slice(0,16),disappearedComponents:before.sizes.length-mapped.size,
   boundaryRaw,boundaryRevised,removedBoundary},
  seams:{patches,lostPatches,rawCrossings,retainedCrossings,originalOutsideCrossings,lost,externalProposedGeometryNotSourceQualified:true},
  walking:{feet:feet.size,components:walk.sizes.length,reachableFeet:queue.length,reachableNewFeet:reachableNew.length,routes,anchors},
  finiteWindowOnly:true,fullRegionPortalConnectivityQualified:false,fullDescentUnchanged:true,cityVetoUnchanged:true,
  sourceCallsAreDirectEntries:true,sourceSaveUnchanged:true,worldWrites:0,constructionAdmission:false};
}
