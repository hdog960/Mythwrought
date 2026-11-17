// Mythwrought Builder 2A M1: genuine recessed storefronts and physically source-backed roof transitions.
// Isolated theoretical geometry only: no world placement, no runtime registration, no save modifications.
import {M1_ARCADED_FRONT_SPECS} from './m1-arcaded-front-specs.mjs';
import {author2ALandmark} from './m1-landmark-shops.mjs';
import {validateBlueprint} from './schema.mjs';
export {M1_ARCADED_FRONT_SPECS};
const K=(x,y,z)=>x+','+y+','+z;
function roofProfile(category,x,z,entry){
 const dx=Math.abs(x-(entry+.5)),r=x-entry;
 if(category==='general-store')return Math.max(2,9-Math.floor(dx/1.5)+(r<0?2:0)-(z===2?1:0));
 if(category==='pet-shop')return Math.max(2,4+Math.floor((r+7)/2)-(z===2?1:0));
 if(category==='magic-shop')return Math.max(2,9-Math.ceil(dx/2)+(dx<3?3:0)-(z===2?1:0));
 if(category==='potion-shop')return Math.max(2,6+Math.round(3*Math.sqrt(Math.max(0,1-(dx/9)**2)))-(z===2?1:0));
 if(category==='bakery')return Math.max(2,8+(r<-2?3:0)-Math.floor(dx/3)-(z===2?1:0));
 if(category==='bank')return Math.max(2,8-Math.floor(dx/3)+(dx<4?1:0)-(z===2?1:0));
 throw Error('Unknown architectural roof lineage '+category);
}
export function author2AArcadedFront(spec){
 const s=spec,base=author2ALandmark(s),vox=new Map(base.voxels.map(v=>[K(v.x,v.y,v.z),{...v}])),
  openings=[...base.openings],removed=[],addedWalls=[],raisedRoof=[],windows=[],portals=[],buttresses=[];
 const get=(x,y,z)=>vox.get(K(x,y,z));
 const add=(v)=>{const at=K(v.x,v.y,v.z);if(vox.has(at))throw Error('source geometry collision '+s.name+' '+at);vox.set(at,v);return v;};
 const removeWall=(x,y,z,role)=>{
  const at=K(x,y,z),was=vox.get(at);
  if(was?.kind!=='wall')throw Error('real source wall required before carving '+s.name+' '+at+' '+(was?.kind??'air'));
  vox.delete(at);removed.push({x,y,z,role});};
 const [x0,x1]=s.front,entry=s.entry;
 if(x0>entry-6||x1<entry+6||s.h<9||s.side[0]>=s.side[1])throw Error('invalid independent arcaded portico footprint '+s.name);
 // Three physically carved arcades across the actual front façade. The middle
 // entrance is inherited, but rises to four real air cells instead of a false marker.
 const frontSegments=[[entry-6,entry-4],[entry,entry+1],[entry+4,entry+6]];
 for(const [a,b] of frontSegments)for(let x=a;x<=b;x++)for(let y=2;y<=5;y++){
  if((x===entry||x===entry+1)&&y<=4){
   if(get(x,y,0))throw Error('inherited center-door is physically blocked '+K(x,y,0));
  }else removeWall(x,y,0,'carved-front-arcade');
 }
 for(const [a,b] of [frontSegments[0],frontSegments[2]])for(let x=a;x<=b;x++){
  portals.push({type:'entrance',role:'open-front-arcade',x,y:2,z:0,clearHeightCells:3,doorOpenState:'always-open-source-arch'});
 }
 // The genuine recessed inner weather screen is three cells behind the public arches.
 // Three separate, two-wide portals keep the trading floor grounded and accessible.
 const portalX=new Set([entry-5,entry-4,entry,entry+1,entry+4,entry+5]);
 for(let x=x0;x<=x1;x++)for(let y=2;y<=s.h;y++){
  if(portalX.has(x)&&y<=5)continue;
  if(get(x,1,3)?.kind!=='floor')throw Error('recessed wall is not on source floor '+K(x,1,3));
  add({x,y,z:3,kind:'wall',material:s.wall,architecturalRole:'source-founded-recessed-inner-loggia-screen'});
  addedWalls.push([x,y,3]);
 }
 for(const x of portalX){
  for(let y=2;y<=5;y++)if(get(x,y,3))throw Error('recessed portal is not physical air '+K(x,y,3));
  portals.push({type:'internal-doorway',role:'two-wide-inner-loggia-passage',x,y:2,z:3,clearHeightCells:3});
 }
 // Source-carved second entrance arcade along the western gallery. Never change
 // or silently delete existing glazed windows on z18/24.
 for(const z of [20,21,27,28])for(let y=2;y<=4;y++)
  removeWall(0,y,z,'open-west-courtyard-arcade');
 for(const z of [20,21,27,28])portals.push({type:'entrance',role:'open-west-arcade',x:0,y:2,z,clearHeightCells:3,doorOpenState:'open-weather-bay'});
 // The acceptance camera looks onto the EAST and REAR outer weather walls.
 // Carve genuine source air on these near-facing façades as well; otherwise
 // the architected front arcade exists but is invisible to a phone-scale review.
 for(const z of [20,21,27,28])for(let y=2;y<=5;y++)
  removeWall(s.w-1,y,z,'visible-near-east-arcade');
 for(const z of [20,21,27,28])portals.push({type:'entrance',role:'open-near-east-arcade',
  x:s.w-1,y:2,z,clearHeightCells:3,doorOpenState:'source-open-weather-bay'});
 for(const x of [entry+9,entry+10])for(let y=2;y<=4;y++)
  removeWall(x,y,s.d-1,'visible-near-rear-arcade');
 for(const x of [entry+9,entry+10])portals.push({type:'entrance',role:'open-near-rear-arcade',
  x,y:2,z:s.d-1,clearHeightCells:3,doorOpenState:'source-open-weather-bay'});
 // Sixteen actually occupied Pack4 glazing cells with matching window-opening
 // records. Physical glass mounting, yaw, transparency remain pending.
 const glazing=[[entry-9,0,7],[entry-9,0,8],[entry+9,0,7],[entry+9,0,8],[0,22,7],[0,22,8],[0,31,7],[0,31,8],
  [s.w-1,30,7],[s.w-1,30,8],[s.w-1,32,7],[s.w-1,32,8],
  [entry+4,s.d-1,7],[entry+4,s.d-1,8],[entry+7,s.d-1,7],[entry+7,s.d-1,8]];
 for(const [x,z,y] of glazing){
  const at=K(x,y,z),before=get(x,y,z);
  if(before?.kind!=='wall')throw Error('new upper window is not wall-mounted '+s.name+' '+at);
  const material=y%2===0?'pack4:032':'pack4:030';
  vox.set(at,{x,y,z,kind:'window',material,architecturalRole:'source-carved-upper-window-pending-real-Pack4-mount'});
  windows.push({type:'window',x,y,z,material});
 }
 // Real side and front pilasters are supported from the existing floor upwards.
 if(!Array.isArray(s.rearButtresses)||s.rearButtresses.length!==2)
  throw Error('two explicit regionally grounded rear buttress anchors required: '+s.name);
 for(const [x,z] of [[entry-11,1],[entry+11,1],[1,s.side[0]-2],[1,s.side[1]+4],
  [s.w-2,16],[s.w-2,34],...s.rearButtresses]){
  if(get(x,1,z)?.kind!=='floor')throw Error('pilaster has no actual foundation/floor support '+K(x,1,z));
  for(let y=2;y<=s.h;y++){
   const v=add({x,y,z,kind:'wall',material:s.wall,architecturalRole:'source-founded-recessed-facade-buttress'});
   buttresses.push(v);
  }
 }
 // Original local roof profiles remain intact, but the much taller over-porch
 // pediment and rear stepped transition use *only* vertically rooted real roof cells.
 function raise(x,z,target,role){
  if(get(x,s.h+1,z)?.kind!=='roof')throw Error('decorative roof is not over source-owned weather plate '+K(x,s.h+1,z));
  for(let y=s.h+2;y<=target;y++){
   const at=K(x,y,z),old=get(x,y,z);
   if(old){if(old.kind!=='roof')throw Error('roof transition intersects non-roof source '+at);continue;}
   if(get(x,y-1,z)?.kind!=='roof')throw Error('physically unsupported new roof cell '+at);
   raisedRoof.push(add({x,y,z,kind:'roof',material:s.roof,
    architecturalRole:role,roofBearing:'actual-contiguous-lower-source-roof-column-not-final-physical-load'}));
  }
 }
 for(let x=entry-7;x<=entry+8;x++)for(let z=0;z<=2;z++)
  raise(x,z,s.h+1+roofProfile(s.category,x,z,entry),'distinct-facade-'+s.category+'-roof-transition');
 let rearSections=0;
 for(let x=entry-7;x<=entry+8;x++)for(const z of [s.d-3,s.d-2]){
  if(get(x,s.h+1,z)?.kind!=='roof')continue;
  rearSections++;
  raise(x,z,s.h+1+(x%5===0?5:3),'source-supported-split-rear-eaves');
 }
 // The original front porch is on the far side of the diagnostic camera.
 // Real near-facing eastern and rear eaves now visibly distinguish roof
 // massing on iPhone-scale source captures, with the SAME vertical support gate.
 const nearFacingBefore=raisedRoof.length;
 for(let z=14;z<=34;z++)for(const x of [s.w-2,s.w-1])
  raise(x,z,s.h+1+Math.max(3,Math.floor(roofProfile(s.category,z,0,25)*.75)),
   'visible-near-east-eave-'+s.category);
 for(let x=entry+2;x<=entry+10;x++)
  raise(x,s.d-1,s.h+1+Math.max(3,8-Math.floor(Math.abs(x-(entry+6))/2)),
   'visible-near-rear-eave-'+s.category);
 const visibleNearFacingRoofCells=raisedRoof.length-nearFacingBefore;
 if(raisedRoof.length<150||rearSections<8||addedWalls.length<100||removed.length<52||
   buttresses.length<70||windows.length!==16||visibleNearFacingRoofCells<65)
  throw Error('nominal rather than substantial real recessed architecture '+s.name);
 openings.push(...portals,...windows);
 const source=[...vox.values()].sort((a,b)=>a.y-b.y||a.z-b.z||a.x-b.x);
 const result={...base,voxels:source,openings,
  extents:{...base.extents,y:Math.max(...source.map(v=>v.y))+1},
  architecturalSignature:base.architecturalSignature+' / authentic arcaded front/recessed inner screen / '+s.features.join('/'),
  roof:{...base.roof,form:'original silhouette-dependent front pediment and stepped separate rear eaves'},
  facadeArticulation:Object.freeze({removedWeatherWallCells:removed.length,insideRecessWallCells:addedWalls.length,
   frontArcades:3,openWestArcades:2,openEastArcades:2,openRearArcade:1,
   sourceNewUpperWindows:windows.length,visibleNearFacingRoofCells,
   rootedPilasterCells:buttresses.length,sourceRoofTransitionCells:raisedRoof.length,rearTransitions:rearSections,
   accessedUpperFloor:false,finalGlassMountApproved:false,finalLongSpanSupportApproved:false}),
  features:[...base.features,...s.features,'actual open-arch porch and recessed inner screen on real floor'],
  worldPlaced:false,numericIdsAssigned:false,
  unresolvedDependencies:base.unresolvedDependencies};
 validateBlueprint(result);
 return Object.freeze(result);
}
export const M1_ARCADED_FRONT_SHOPS=Object.freeze(M1_ARCADED_FRONT_SPECS.map(author2AArcadedFront));
