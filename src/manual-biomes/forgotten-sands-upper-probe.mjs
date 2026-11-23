// MYTHWROUGHT — Forgotten Sands Phase 0, source-native upper-section probe.
// Research only; NEVER imported by gameplay. Retain the original -210..19 ABI.
// Its section meshing delegates to the actual original depth-mesh implementation.
import {WORLD_MAX_Y,sectionBounds,sectionWindow,sectionChunkRadius,
  verticalEditSections,depthMeshKey} from '../depth.mjs';
import {meshDepthSection} from '../depth-mesh.mjs';
import {BLOCK} from '../voxel.mjs';
import {prototypePyramidBlock,prototypePyramidChunkBounds} from
  './forgotten-sands-monument-prototype.mjs';

export const P0_UPPER_SECTION_HEIGHT=16;
export const P0_MAX_UPPER_SECTIONS=8; // Research ceiling 147; NOT a new engine limit.
export const P0_UPPER_MIN_Y=WORLD_MAX_Y+1;
export const P0_UPPER_MAX_Y=P0_UPPER_MIN_Y+
  P0_UPPER_SECTION_HEIGHT*P0_MAX_UPPER_SECTIONS-1;
export const P0_PREFLIGHT_VOXEL_LIMIT=150000;
const integer=Number.isSafeInteger;

export function p0UpperSectionBounds(section){
  if(!integer(section)||section<1||section>P0_MAX_UPPER_SECTIONS)
    throw Error('Invalid proposed upper section');
  const minY=P0_UPPER_MIN_Y+(section-1)*P0_UPPER_SECTION_HEIGHT;
  return Object.freeze({minY,maxY:minY+P0_UPPER_SECTION_HEIGHT-1});
}
export function p0UpperSectionForY(y){
  if(!Number.isFinite(y)||y<P0_UPPER_MIN_Y||y>=P0_UPPER_MAX_Y+1)return null;
  return Math.floor((y-P0_UPPER_MIN_Y)/P0_UPPER_SECTION_HEIGHT)+1;
}
export function p0SectionsForEdit(y){
  if(!integer(y))return [];
  if(y<P0_UPPER_MIN_Y-1)return verticalEditSections(y);
  if(y===P0_UPPER_MIN_Y-1)return [0,1];
  const section=p0UpperSectionForY(y);
  if(section===null)return [];
  const bounds=p0UpperSectionBounds(section),result=[section];
  if(y===bounds.minY)result.push(section===1?0:section-1);
  if(y===bounds.maxY&&section<P0_MAX_UPPER_SECTIONS)result.push(section+1);
  return result;
}
export function p0SectionKey(cx,cz,section){
  if(!integer(cx)||!integer(cz)||!integer(section)||
      section<0||section>P0_MAX_UPPER_SECTIONS)
    throw Error('Invalid upper-probe chunk key');
  return depthMeshKey(cx,cz,section);
}

// This adapter calls ORIGINAL meshDepthSection in its ORIGINAL -1 slice,
// shifting the 16-block coordinate window without copying its geometry logic.
// Both its section-border halos and source block IDs go through real world.get.
// The emitted 9-float vertex ABI is unchanged except for translated Y.
export function meshP0UpperSection(world,cx,cz,section){
  if(!world||typeof world.get!=='function'||![cx,cz].every(integer))
    throw Error('Invalid source world or chunk');
  const bounds=p0UpperSectionBounds(section);
  const native=sectionBounds(-1);
  if(native.maxY-native.minY!==P0_UPPER_SECTION_HEIGHT-1)
    throw Error('Original depth section ABI changed');
  const shift=bounds.minY-native.minY;
  const shifted={
    seed:world.seed,
    get:(x,y,z)=>world.get(x,y+shift,z),
    rotationAt:(x,y,z)=>world.rotationAt?.(x,y+shift,z)??0,
    getPack2State:(x,y,z)=>world.getPack2State?.(x,y+shift,z)
  };
  const vertices=meshDepthSection(shifted,cx,cz,-1);
  for(let i=1;i<vertices.length;i+=9)vertices[i]+=shift;
  return vertices;
}

// Provisional read-only high-air scan. It may reject an entire site, but
// must not install a per-chunk decision whose result depends on load order.
// It deliberately never claims a grounded or cave-safe monument is admitted.
export function preflightP0UpperOnly(baseWorld,site,{veto=null}={}){
  if(!baseWorld||typeof baseWorld.get!=='function'||!site||
      !integer(baseWorld.seed)||site.seed!==baseWorld.seed)
    return Object.freeze({accepted:false,reason:'Missing world or seed mismatch',scanned:0});
  if(site.maxY>P0_UPPER_MAX_Y||site.maxY<P0_UPPER_MIN_Y)
    return Object.freeze({accepted:false,reason:'Outside bounded upper research envelope',scanned:0});
  if(veto!==null&&typeof veto!=='function')
    return Object.freeze({accepted:false,reason:'Invalid veto callback',scanned:0});
  const bounds=prototypePyramidChunkBounds(site);
  let scanned=0;
  for(let cx=bounds.minCX;cx<=bounds.maxCX;cx++)
    for(let cz=bounds.minCZ;cz<=bounds.maxCZ;cz++){
      const minX=Math.max(site.minX,cx*16),maxX=Math.min(site.maxX,cx*16+15);
      const minZ=Math.max(site.minZ,cz*16),maxZ=Math.min(site.maxZ,cz*16+15);
      for(let x=minX;x<=maxX;x++)for(let z=minZ;z<=maxZ;z++)
        for(let y=Math.max(site.baseY,P0_UPPER_MIN_Y);y<=site.maxY;y++){
          const id=prototypePyramidBlock(site,x,y,z);
          if(id===null)continue;
          if(++scanned>P0_PREFLIGHT_VOXEL_LIMIT)
            return Object.freeze({accepted:false,reason:'Preflight cell cap; needs streaming site-index proof',scanned});
          if(veto?.(x,y,z,id))
            return Object.freeze({accepted:false,reason:'Reserved or protected upper cell',scanned});
          if(baseWorld.get(x,y,z)!==BLOCK.AIR)
            return Object.freeze({accepted:false,reason:'Existing upper occupancy',scanned});
        }
    }
  return Object.freeze({accepted:true,reason:'Upper-only read-through accepted; foundation NOT admitted',scanned});
}

// No set/save/restore. This read-only proxy proves native collision, raycast,
// above-section meshing and original surface meshing against the SAME world.get.
// Below Y=20, the exact original world reader remains authoritative.
// Until terrain/cave/reservation admission is engineered, no underground
// foundation and no terrain replacement are exposed.
export function createP0UpperOnlyView(baseWorld,site,{veto=null}={}){
  const admission=preflightP0UpperOnly(baseWorld,site,{veto});
  if(!admission.accepted)throw Error('P0 upper view refused: '+admission.reason);
  const read=(x,y,z)=>{
    if(y<P0_UPPER_MIN_Y||y>P0_UPPER_MAX_Y)return baseWorld.get(x,y,z);
    const candidate=prototypePyramidBlock(site,x,y,z);
    return candidate??baseWorld.get(x,y,z);
  };
  return Object.freeze({
    seed:baseWorld.seed,
    get:read,
    rotationAt:(x,y,z)=>baseWorld.rotationAt?.(x,y,z)??0,
    getPack2State:(x,y,z)=>baseWorld.getPack2State?.(x,y,z),
    edits:baseWorld.edits,
    base:baseWorld.base,
    generationProfile:baseWorld.generationProfile,
    // The ORIGINAL M7 surface mesher calls sourceWorld._columnPlan to
    // validate natural Desert/Mountain RGB seam eligibility. A proxy must
    // retain that source query, not silently remove the accepted tint.
    _columnPlan:typeof baseWorld._columnPlan==='function'?
      (x,z)=>baseWorld._columnPlan(x,z):undefined,
    p0Admission:admission
  });
}

// Separate *proposed* resident budget, never wired to the production queue.
// In untouched wilderness, delegates exactly to original streaming rules.
// Near a proposed tower, use 3x3 per 16-height section: 18 at legacy
// surface, at most 27 when climbing, instead of 25+9+9=43 buffers.
// A cave shaft+upper landmark simultaneously is deliberately not certified.
export function planP0VerticalResidence(feet,{nearUpperSite=false,openShaft=false}={}){
  if(!Number.isFinite(feet)||typeof nearUpperSite!=='boolean'||
     typeof openShaft!=='boolean')throw Error('Invalid proposed resident options');
  let sections, radius;
  if(!nearUpperSite||feet<0){
    sections=sectionWindow(feet,openShaft);
    radius=s=>sectionChunkRadius(s,sections[0]);
  }else{
    if(openShaft)throw Error('Upper/cave-shaft overlap needs an explicit shared budget');
    const active=feet<P0_UPPER_MIN_Y?0:p0UpperSectionForY(feet);
    if(active===null)throw Error('Player above bounded upper research envelope');
    sections=active===0?[0,1]:
      [active,active-1,...(active<P0_MAX_UPPER_SECTIONS?[active+1]:[])];
    radius=()=>1;
  }
  const planned=sections.map(section=>Object.freeze({
    section,radius:radius(section),count:(radius(section)*2+1)**2
  }));
  const buffers=planned.reduce((sum,p)=>sum+p.count,0);
  if(buffers>34||nearUpperSite&&buffers>27)
    throw Error('Upper-probe resident GPU budget exceeded');
  return Object.freeze({sections:Object.freeze(sections),
    allocations:Object.freeze(planned),residentBufferLimit:buffers});
}
