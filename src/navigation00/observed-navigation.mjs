// Opt-in navigation00 companion for the existing exploration-map module.
// Never generates terrain, reveals cells, edits the schema-1 save, or owns DOM/touch rails.
export const NAV00_VERSION=1;
export const NAV00_CELL_SIZE=4;
export const NAV00_MIN_ZOOM=4;
export const NAV00_MAX_ZOOM=14;
const integer=(n)=>Number.isSafeInteger(n);
const finite=(n)=>typeof n==='number'&&Number.isFinite(n);
const tile=(x,z)=>Math.floor(x/NAV00_CELL_SIZE)+','+Math.floor(z/NAV00_CELL_SIZE);
const MAX_PROJECTED_CELLS=20000;
const validPin=(p)=>p&&typeof p==='object'&&typeof p.id==='string'&&/^[a-zA-Z0-9_-]{1,48}$/.test(p.id)&&
  finite(p.x)&&finite(p.z)&&Math.abs(p.x)<=40000000&&Math.abs(p.z)<=40000000&&
  typeof p.label==='string'&&p.label.length<=48&&!/[<>\x00-\x1f]/.test(p.label);
export function createObservedNavigator({seed,discovery,storage=null}){
  if(!integer(seed)||!discovery||!(discovery.seen instanceof Set)||typeof discovery.has!=='function')
    throw Error('navigation00 requires real exploration-map discovery and integer seed');
  const key='mythwrought-navigation00-v1-'+seed;
  let pins=[],readOnly=false,warning='';
  if(storage){
    try{
      const raw=storage.getItem(key);
      if(raw!==null){
        if(raw.length>32768)throw Error('Oversized navigation record');
        const data=JSON.parse(raw);
        if(data?.version!==1||data.seed!==seed||!Array.isArray(data.pins)||data.pins.length>64||
          !data.pins.every(validPin)||new Set(data.pins.map(p=>p.id)).size!==data.pins.length)
          throw Error('Invalid navigation record');
        pins=data.pins.map(p=>Object.freeze({id:p.id,x:p.x,z:p.z,label:p.label}));
      }
    }catch(e){readOnly=true;warning=String(e);}
  }
  function visible(p){return discovery.has(p.x,p.z);}
  function persist(next){
    if(readOnly)return false;
    if(!storage){pins=next;return true;}
    const old=pins;
    try{
      const raw=JSON.stringify({version:1,seed,pins:next});
      storage.setItem(key,raw);
      if(storage.getItem(key)!==raw)throw Error('Navigation readback mismatch');
      pins=next;warning='';return true;
    }catch(e){
      warning=String(e);
      // Fail closed; no mutation of canonical exploration or voxel saves.
      try{
        const oldRaw=JSON.stringify({version:1,seed,pins:old});
        storage.setItem(key,oldRaw);
        if(storage.getItem(key)!==oldRaw)readOnly=true;
      }catch(_){readOnly=true;}
      return false;
    }
  }
  return Object.freeze({
    seed,key,get warning(){return warning;},get readOnly(){return readOnly;},
    visiblePins(){return pins.filter(visible).map(p=>({...p}));},
    pin({id,x,z,label='Pin'}){
      const p={id,x,z,label};
      if(!validPin(p)||!visible(p)||pins.length>=64||pins.some(q=>q.id===id))return false;
      return persist([...pins,Object.freeze(p)]);
    },
    unpin(id){if(!pins.some(p=>p.id===id))return false;return persist(pins.filter(p=>p.id!==id));},
    // Camera output is screen-space only; caller owns painting and input.
    project({player,panX=0,panZ=0,zoom=7,width,height}){
      if(!player||![player.x,player.z,player.yaw,panX,panZ,zoom,width,height].every(finite)||
        width<=0||height<=0||width>4096||height>4096||zoom<NAV00_MIN_ZOOM||zoom>NAV00_MAX_ZOOM)throw Error('Invalid map camera');
      const cx=Math.floor((player.x+panX)/NAV00_CELL_SIZE);
      const cz=Math.floor((player.z+panZ)/NAV00_CELL_SIZE);
      const radiusX=Math.ceil(width/(2*zoom))+1,radiusZ=Math.ceil(height/(2*zoom))+1;
      if((2*radiusX+1)*(2*radiusZ+1)>MAX_PROJECTED_CELLS)throw Error('Map viewport exceeds bounded discovery scan');
      const cells=[];
      for(let dz=-radiusZ;dz<=radiusZ;dz++)for(let dx=-radiusX;dx<=radiusX;dx++){
        const x=cx+dx,z=cz+dz;
        // Do not query world height, block material, or landmarks before fog authorization.
        if(!discovery.seen.has(x+','+z))continue;
        cells.push({x,z,screenX:width/2+dx*zoom,screenY:height/2+dz*zoom});
      }
      const toScreen=p=>({x:width/2+(Math.floor(p.x/NAV00_CELL_SIZE)-cx)*zoom,
        y:height/2+(Math.floor(p.z/NAV00_CELL_SIZE)-cz)*zoom});
      return {version:NAV00_VERSION,cells,pins:this.visiblePins().map(p=>({...p,...toScreen(p)})).filter(p=>p.x>=-zoom&&p.x<=width+zoom&&p.y>=-zoom&&p.y<=height+zoom),
        player:{...toScreen(player),bearing:((player.yaw*180/Math.PI)%360+360)%360,
          x:player.x,z:player.z},zoom,center:{x:cx,z:cz}};
    }
  });
}
