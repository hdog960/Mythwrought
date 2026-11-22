// MYTHWROUGHT — isolated Floating Islands upper-world runtime adapter.
// SOURCE-ONLY bridge; it never changes production terrain, saves, shaders,
// WebGL buffers, world generation, or G2 flight controls. Codex generator
// integration requires real source confirmation before wiring this into main.
export const SKY_ISLAND_MIN_Y = 20;
export const SKY_ISLAND_MAX_Y = 256;
export const SKY_ISLAND_PLAYER_HEIGHT = 1.78;
export const SKY_ISLAND_SECTION_HEIGHT = 16;
export const SKY_ISLAND_MAX_VIEW_RADIUS_CHUNKS = 6;
export const SKY_ISLAND_SECTION_COUNT = Math.ceil((SKY_ISLAND_MAX_Y-SKY_ISLAND_MIN_Y+1)/SKY_ISLAND_SECTION_HEIGHT);
export const SKY_ISLAND_LIGHTING_POLICY = Object.freeze({
  castSurfaceShadows:false,
  darkenGroundUnderIslands:false,
  shadowDrawPasses:0,
  requiresDepthReadback:false
});
const valid = n=>typeof n==='number'&&Number.isFinite(n);
const integer = n=>Number.isSafeInteger(n);
const fail = message=>{throw new TypeError('Sky island runtime: '+message);};
const freezeRows = rows=>Object.freeze(rows.map(row=>Object.freeze(row)));
const d2 = (a,cx,cz)=>(a.cx-cx)**2+(a.cz-cz)**2;
const order = (a,b)=>a.score-b.score||a.cz-b.cz||a.cx-b.cx||(a.section??0)-(b.section??0);
const regionKey=(cx,cz,section)=>'sky:'+cx+','+cz+','+section;

export function skyIslandSectionForY(y){
  if(!valid(y)||y<SKY_ISLAND_MIN_Y||y>SKY_ISLAND_MAX_Y)return null;
  return Math.floor((Math.floor(y)-SKY_ISLAND_MIN_Y)/SKY_ISLAND_SECTION_HEIGHT);
}
export function skyIslandSectionBounds(section){
  if(!integer(section)||section<0||section>=SKY_ISLAND_SECTION_COUNT)fail('invalid upper section');
  return Object.freeze({minY:SKY_ISLAND_MIN_Y+section*SKY_ISLAND_SECTION_HEIGHT,
    maxY:Math.min(SKY_ISLAND_MAX_Y, SKY_ISLAND_MIN_Y+(section+1)*SKY_ISLAND_SECTION_HEIGHT-1)});
}
export function skyIslandMeshKey(cx,cz,section){
  if(!integer(cx)||!integer(cz))fail('invalid sky chunk coordinates');
  skyIslandSectionBounds(section);
  return regionKey(cx,cz,section);
}

// Flight must certify EVERY overlapping x/z chunk and vertical section:
// a head or shoulder on an upper seam must not slip through an unloaded tile.
// Below Y20 remains under the existing surface/underground host authority.
export function skyIslandBodyRegions({x,feet,z,radius=.28,height=1.78}={}){
  if(![x,feet,z,radius,height].every(valid)||radius<=0||radius>1||height<=0||height>4)
    fail('invalid physical body');
  if(feet>SKY_ISLAND_MAX_Y+1||feet+height<SKY_ISLAND_MIN_Y)return Object.freeze([]);
  const xMin=Math.floor((x-radius)/16),xMax=Math.floor((x+radius)/16);
  const zMin=Math.floor((z-radius)/16),zMax=Math.floor((z+radius)/16);
  const yMin=Math.max(SKY_ISLAND_MIN_Y,feet),yMax=Math.min(SKY_ISLAND_MAX_Y,feet+height);
  if(yMin>yMax)return Object.freeze([]);
  const first=skyIslandSectionForY(yMin),last=skyIslandSectionForY(yMax);
  const regions=[];
  for(let section=first;section<=last;section++)
    for(let cx=xMin;cx<=xMax;cx++)for(let cz=zMin;cz<=zMax;cz++)
      regions.push({cx,cz,section,key:regionKey(cx,cz,section)});
  regions.sort((a,b)=>a.section-b.section||a.cx-b.cx||a.cz-b.cz);
  return freezeRows(regions);
}

export function verifySkyIslandFlightSpace(position,{isSkySectionLoaded,isBodyClear}={}){
  if(!position||!valid(position.x)||!valid(position.feet)||!valid(position.z)||
     typeof isSkySectionLoaded!=='function'||typeof isBodyClear!=='function')
    fail('live physical host and position are required');
  // This check supplements, NEVER replaces, original G2 region readiness.
  if(position.feet+SKY_ISLAND_PLAYER_HEIGHT>SKY_ISLAND_MAX_Y+1e-9)
    return Object.freeze({ready:false,reason:'Full player body exceeds upper-world ceiling',required:Object.freeze([])});
  const required=skyIslandBodyRegions(position);
  const missing=required.filter(region=>!isSkySectionLoaded(region));
  if(missing.length)return Object.freeze({ready:false,reason:'Upper section not resident',required,missing:freezeRows(missing)});
  if(!isBodyClear(position))return Object.freeze({ready:false,reason:'Physical body obstructed',required});
  return Object.freeze({ready:true,reason:'Upper sections resident and body clear',required});
}

// The Codex generator provides section metadata as 'sky'; this planner never
// queries tens of thousands of voxels or invents/island-generates blocks.
// Shared total budget includes ground and upper mesh slots. Near-ground 3x3
// gets first refusal, followed by actual upper sections and remaining terrain.
export function planSkyIslandResidency({position,ground=[],sky=[],maxResident=25,
  maxSkyResident=6,minimumSkyReserve=3}={}){
  if(!position||![position.x,position.feet,position.z].every(valid)||
     !Array.isArray(ground)||!Array.isArray(sky)||ground.length>256||sky.length>256||
     !integer(maxResident)||maxResident<9||maxResident>27||
     !integer(maxSkyResident)||maxSkyResident<0||maxSkyResident>maxResident||
     !integer(minimumSkyReserve)||minimumSkyReserve<0||minimumSkyReserve>maxSkyResident)
    fail('invalid bounded residency request');
  const px=Math.floor(position.x/16),pz=Math.floor(position.z/16);
  const terrain=new Map(),upper=new Map();
  for(const p of ground){
    if(!p||!integer(p.cx)||!integer(p.cz))fail('invalid terrain candidate');
    const key='ground:'+p.cx+','+p.cz;
    terrain.set(key,{kind:'ground',cx:p.cx,cz:p.cz,key,
      score:d2(p,px,pz)+Math.max(0,position.feet-40)/8});
  }
  for(const p of sky){
    if(!p||!integer(p.cx)||!integer(p.cz))fail('invalid sky candidate');
    const bounds=skyIslandSectionBounds(p.section),key=regionKey(p.cx,p.cz,p.section);
    if(Math.max(Math.abs(p.cx-px),Math.abs(p.cz-pz))>SKY_ISLAND_MAX_VIEW_RADIUS_CHUNKS)continue;
    const center=(bounds.minY+bounds.maxY)*.5;
    upper.set(key,{kind:'sky',cx:p.cx,cz:p.cz,section:p.section,key,
      score:d2(p,px,pz)+.04*((center-position.feet)/16)**2});
  }
  const groundSorted=[...terrain.values()].sort(order),skySorted=[...upper.values()].sort(order);
  const chosen=[],seen=new Set();let skyCount=0;
  const add=row=>{
    if(!row||seen.has(row.key)||chosen.length>=maxResident||
       (row.kind==='sky'&&skyCount>=maxSkyResident))return false;
    chosen.push(row);seen.add(row.key);if(row.kind==='sky')skyCount++;return true;
  };
  // Protect nearby real ground when walking. In high flight, release this
  // priority so the limited GPU slots can serve upper-world geometry instead.
  if(position.feet<=52)
    for(const row of groundSorted)
      if(Math.max(Math.abs(row.cx-px),Math.abs(row.cz-pz))<=1)add(row);
  for(const row of skySorted.slice(0,minimumSkyReserve))add(row);
  for(const row of [...groundSorted,...skySorted].sort(order))add(row);
  return Object.freeze({slots:freezeRows(chosen),total:chosen.length,skyCount,
    groundCount:chosen.length-skyCount,maxResident,shadowPolicy:SKY_ISLAND_LIGHTING_POLICY});
}

// Preparation-only, bounded per-frame mesh requests. Live renderer must stage
// successful replacements and commit atomically; no buffers or saves touched.
export function planSkyIslandMeshJobs({desired=[],resident=[],maxNewJobs=2}={}){
  if(!Array.isArray(desired)||!Array.isArray(resident)||desired.length>27||resident.length>27||
     !integer(maxNewJobs)||maxNewJobs<0||maxNewJobs>2||
     !desired.every(row=>row&&typeof row.key==='string'&&['ground','sky'].includes(row.kind))||
     !resident.every(key=>typeof key==='string'))fail('invalid bounded mesh plan');
  const target=new Set(desired.map(row=>row.key)),existing=new Set(resident);
  const requests=desired.filter(row=>row.kind==='sky'&&!existing.has(row.key))
    .slice(0,maxNewJobs).map(row=>({key:row.key,cx:row.cx,cz:row.cz,section:row.section}));
  const staleSky=resident.filter(key=>key.startsWith('sky:')&&!target.has(key));
  return Object.freeze({requests:freezeRows(requests),staleSky:Object.freeze(staleSky),
    // The renderer must never treat this as permission to discard ground.
    commitAllowed:false,requiresAtomicGpuStaging:true});
}
