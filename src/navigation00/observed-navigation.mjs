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
  let pins=[],undo=[],rawBefore=null,readOnly=false,warning='';
  const LIMIT=8,MAX_BYTES=131072;
  const validList=list=>Array.isArray(list)&&list.length<=64&&list.every(validPin)&&new Set(list.map(p=>p.id)).size===list.length;
  const cloneList=list=>list.map(p=>Object.freeze({id:p.id,x:p.x,z:p.z,label:p.label}));
  if(storage){
    try{
      const raw=storage.getItem(key);rawBefore=raw;
      if(raw!==null){
        if(raw.length>MAX_BYTES)throw Error('Oversized navigation record');
        const data=JSON.parse(raw);
        if(data?.version!==1||data.seed!==seed||!validList(data.pins)||
          (data.undo!==undefined&&(!Array.isArray(data.undo)||data.undo.length>LIMIT||!data.undo.every(validList))))
          throw Error('Invalid navigation record');
        pins=cloneList(data.pins);undo=(data.undo||[]).map(cloneList);
      }
    }catch(e){readOnly=true;warning=String(e);}
  }
  function visible(p){return discovery.has(p.x,p.z);}
  function persist(next,nextUndo){
    if(readOnly)return false;
    if(!storage){pins=next;undo=nextUndo;warning='';return true;}
    const raw=JSON.stringify({version:1,seed,pins:next,undo:nextUndo});
    if(raw.length>MAX_BYTES){warning='Navigation history exceeds storage budget';return false;}
    try{
      if(storage.getItem(key)!==rawBefore){readOnly=true;throw Error('Navigation changed in another session; reopen the world');}
      storage.setItem(key,raw);
      if(storage.getItem(key)!==raw)throw Error('Navigation readback mismatch');
      rawBefore=raw;pins=next;undo=nextUndo;warning='';return true;
    }catch(e){
      warning=String(e);
      // Only roll back bytes that are demonstrably ours. Never overwrite
      // unexpected concurrent or corrupt storage with an assumed snapshot.
      if(!readOnly)try{
        const current=storage.getItem(key);
        if(current===raw){
          if(rawBefore===null){
            if(typeof storage.removeItem!=='function')throw Error('Cannot restore absent record');
            storage.removeItem(key);
          }else storage.setItem(key,rawBefore);
          if(storage.getItem(key)!==rawBefore)throw Error('Rollback verification failed');
        }else if(current!==rawBefore)readOnly=true;
      }catch(_){readOnly=true;}
      return false;
    }
  }
  const mutate=next=>persist(next,[...undo,pins].slice(-LIMIT));
  return Object.freeze({
    seed,key,get warning(){return warning;},get readOnly(){return readOnly;},get canUndo(){return !readOnly&&undo.length>0;},
    visiblePins(){return pins.filter(visible).map(p=>({...p}));},
    pin({id,x,z,label='Pin'}){
      const p={id,x,z,label};
      if(!validPin(p)||!visible(p)||pins.length>=64||pins.some(q=>q.id===id))return false;
      return mutate([...pins,Object.freeze(p)]);
    },
    unpin(id){if(!pins.some(p=>p.id===id))return false;return mutate(pins.filter(p=>p.id!==id));},
    rename(id,label){
      const old=pins.find(p=>p.id===id),next=old&&{...old,label};
      if(!validPin(next)||!visible(old)||!label.trim()||old.label===label)return false;
      return mutate(pins.map(p=>p.id===id?Object.freeze(next):p));
    },
    undo(){return undo.length>0&&persist(undo.at(-1),undo.slice(0,-1));},
    // Camera output is screen-space only; caller owns painting and input.
    project({player,panX=0,panZ=0,zoom=7,width,height,exact=false}){
      if(!player||![player.x,player.z,player.yaw,panX,panZ,zoom,width,height].every(finite)||
        width<=0||height<=0||width>4096||height>4096||zoom<NAV00_MIN_ZOOM||zoom>NAV00_MAX_ZOOM)throw Error('Invalid map camera');
      // Anchor to the player's discovered cell; retain sub-cell pan precision.
      const units=v=>exact?v/NAV00_CELL_SIZE-.5:Math.floor(v/NAV00_CELL_SIZE);
      const centerX=units(player.x)+panX/NAV00_CELL_SIZE;
      const centerZ=units(player.z)+panZ/NAV00_CELL_SIZE;
      const cx=Math.floor(centerX),cz=Math.floor(centerZ);
      const radiusX=Math.ceil(width/(2*zoom))+1,radiusZ=Math.ceil(height/(2*zoom))+1;
      if((2*radiusX+1)*(2*radiusZ+1)>MAX_PROJECTED_CELLS)throw Error('Map viewport exceeds bounded discovery scan');
      const cells=[];
      for(let dz=-radiusZ;dz<=radiusZ;dz++)for(let dx=-radiusX;dx<=radiusX;dx++){
        const x=cx+dx,z=cz+dz;
        // Do not query world height, block material, or landmarks before fog authorization.
        if(!discovery.seen.has(x+','+z))continue;
        cells.push({x,z,screenX:width/2+(x-centerX)*zoom,screenY:height/2+(z-centerZ)*zoom});
      }
      const toScreen=p=>({x:width/2+(units(p.x)-centerX)*zoom,
        y:height/2+(units(p.z)-centerZ)*zoom});
      return {version:NAV00_VERSION,cells,pins:this.visiblePins().map(p=>{const screen=toScreen(p);return {...p,worldX:p.x,worldZ:p.z,screenX:screen.x,screenY:screen.y};}).filter(p=>p.screenX>=-zoom&&p.screenX<=width+zoom&&p.screenY>=-zoom&&p.screenY<=height+zoom),
        player:{...toScreen(player),bearing:((player.yaw*180/Math.PI)%360+360)%360,
          worldX:player.x,worldZ:player.z},zoom,center:{x:centerX,z:centerZ}};
    }
  });
}
