// MYTHWROUGHT Gate A — isolated, seed-specific discovery map.
// A map cell is revealed ONLY by visiting its vicinity; never prefill from a seed.
// Discovery is stored outside the canonical schema-1 voxel save and never rewrites it.
import {terrainHeight,BLOCK} from './voxel.mjs';
import {profiledDiscoveredCellInk} from './manual-biomes/exploration-ink.mjs';
import {createNavigationAdapter} from './navigation00/navigation-adapter.mjs';
import {createNavigationGestures} from './navigation00/navigation-gestures.mjs';
import {paintNavigationFrame} from './navigation00/navigation-paint.mjs';
import {createNavigationLocationReadout} from './navigation00/navigation-location-readout.mjs';

export const MAP_CELL_SIZE=4;
export const MAP_REVEAL_RADIUS=3;
export const MAP_MAX_CELLS=120000;
export function mapStorageKey(seed){return 'mythwrought-exploration-v1-'+seed;}
export function mapCell(x,z){
  if(!Number.isFinite(x)||!Number.isFinite(z))throw Error('Invalid map position');
  return Math.floor(x/MAP_CELL_SIZE)+','+Math.floor(z/MAP_CELL_SIZE);
}
export function loadExploration(storage,seed){
  if(!Number.isInteger(seed))throw Error('Map needs an integer world seed');
  const key=mapStorageKey(seed);
  const seen=new Set();
  let dirty=false,readOnly=false,warning='';
  try{
    const raw=storage.getItem(key);
    if(raw!==null){
      if(raw.length>3600000)throw Error('Exploration record exceeds safe size');
      const data=JSON.parse(raw);
      if(data?.version!==1||data.seed!==seed||data.cellSize!==MAP_CELL_SIZE||
        !Array.isArray(data.cells)||data.cells.length>MAP_MAX_CELLS)
        throw Error('Invalid exploration map format');
      for(const cell of data.cells){
        if(typeof cell!=='string'||!(/^-?\d+,-?\d+$/.test(cell)))
          throw Error('Invalid exploration tile');
        const [x,z]=cell.split(',').map(Number);
        if(!Number.isSafeInteger(x)||!Number.isSafeInteger(z)||Math.abs(x)>10000000||Math.abs(z)>10000000)
          throw Error('Exploration tile is out of bounds');
        if(seen.has(cell))throw Error('Duplicate exploration tile');
        seen.add(cell);
      }
    }
  }catch(error){
    // Never delete, overwrite or auto-repair possibly valuable corrupt map bytes.
    seen.clear();readOnly=true;warning='Map record protected (read only): '+String(error);
  }
  return {
    seed,seen,key,
    get dirty(){return dirty;},
    get readOnly(){return readOnly;},
    get warning(){return warning;},
    has(x,z){return seen.has(mapCell(x,z));},
    reveal(x,z){
      const cx=Math.floor(x/MAP_CELL_SIZE),cz=Math.floor(z/MAP_CELL_SIZE);
      let added=0;
      for(let dz=-MAP_REVEAL_RADIUS;dz<=MAP_REVEAL_RADIUS;dz++){
        for(let dx=-MAP_REVEAL_RADIUS;dx<=MAP_REVEAL_RADIUS;dx++){
          if(dx*dx+dz*dz>MAP_REVEAL_RADIUS*MAP_REVEAL_RADIUS)continue;
          const cell=(cx+dx)+','+(cz+dz);
          if(seen.has(cell))continue;
          if(seen.size>=MAP_MAX_CELLS){
            warning='Exploration record full; older discoveries remain preserved';
            return added;
          }
          seen.add(cell);dirty=true;added++;
        }
      }
      return added;
    },
    flush(){
      if(!dirty)return !readOnly;
      if(readOnly)return false;
      try{
        const raw=JSON.stringify({version:1,seed,cellSize:MAP_CELL_SIZE,cells:[...seen].sort()});
        storage.setItem(key,raw);
        if(storage.getItem(key)!==raw)throw Error('Exploration map read-back differed');
        dirty=false;warning='';return true;
      }catch(error){
        warning='Map exploration not saved: '+String(error);
        return false;
      }
    }
  };
}
function surfaceInk(world,cx,cz){
  const x=cx*MAP_CELL_SIZE+2,z=cz*MAP_CELL_SIZE+2;
  const h=terrainHeight(x,z,world.seed);
  const top=world.get(x,h+1,z);
  const earth=world.get(x,h,z);
  if(top===BLOCK.CRYSTAL)return '#6ac8ca';
  if(top===BLOCK.WOOD)return '#bd8d58';
  if(top===BLOCK.STONE)return '#a49d8d';
  if(earth===BLOCK.AIR)return '#44575a';
  if(earth!==BLOCK.GRASS)return '#8b7b62';
  if(h>=10)return '#a9ada0';
  if(h>=8)return '#859477';
  if(h>=6)return '#6f9a6d';
  if(h>=4)return '#588d66';
  return '#477a69';
}
export function paintExploration(canvas,map,world,player,{expanded=false,panX=0,panZ=0,zoom=7}={}){
  const ctx=canvas.getContext('2d');
  if(!ctx)return;
  const w=canvas.width,h=canvas.height,px=expanded?zoom:5;
  ctx.imageSmoothingEnabled=false;
  ctx.fillStyle='#122126';ctx.fillRect(0,0,w,h);
  const mx=Math.floor((player.x+panX)/MAP_CELL_SIZE),mz=Math.floor((player.z+panZ)/MAP_CELL_SIZE);
  const reachX=Math.ceil(w/(2*px))+1,reachZ=Math.ceil(h/(2*px))+1;
  for(let dz=-reachZ;dz<=reachZ;dz++){
    for(let dx=-reachX;dx<=reachX;dx++){
      const cx=mx+dx,cz=mz+dz;
      // CRITICAL: never query world terrain for undiscovered cells.
      if(!map.seen.has(cx+','+cz))continue;
      // CRITICAL: the fog check above must happen before ALL source calls.
      // Use actual profiled-world solid geology for previously visited tiles;
      // preserve the old source-exact color path on every legacy seed.
      ctx.fillStyle=profiledDiscoveredCellInk(world,cx,cz,MAP_CELL_SIZE)||
        surfaceInk(world,cx,cz);
      ctx.fillRect(Math.floor(w/2+dx*px-px/2),Math.floor(h/2+dz*px-px/2),px,px);
    }
  }
  const rx=w/2+(Math.floor(player.x/MAP_CELL_SIZE)-mx)*px;
  const rz=h/2+(Math.floor(player.z/MAP_CELL_SIZE)-mz)*px;
  if(rx>=-12&&rx<=w+12&&rz>=-12&&rz<=h+12){
    const a=player.yaw;
    const dx=Math.sin(a),dz=Math.cos(a),sx=Math.cos(a),sz=-Math.sin(a);
    const size=expanded?9:5;
    ctx.beginPath();
    ctx.moveTo(rx+dx*size,rz+dz*size);
    ctx.lineTo(rx-dx*size*.65+sx*size*.55,rz-dz*size*.65+sz*size*.55);
    ctx.lineTo(rx-dx*size*.65-sx*size*.55,rz-dz*size*.65-sz*size*.55);
    ctx.closePath();ctx.fillStyle='#fff5d6';ctx.fill();
    ctx.strokeStyle='#1b3535';ctx.lineWidth=expanded?2:1;ctx.stroke();
  }
  if(expanded){
    ctx.font='bold 15px system-ui';ctx.fillStyle='#f7e5b7';ctx.fillText('N',12,22);
  }
}
export function installExplorationMap({storage,getWorld,getPlayer,onOpen,canOpen}){
  const mini=document.getElementById('miniMap');
  const openButton=document.getElementById('miniMapButton');
  const overlay=document.getElementById('explorationOverlay');
  const large=document.getElementById('expandedMap');
  const closeButton=document.getElementById('closeExploration');
  const coordinates=document.getElementById('explorationCoordinates');
  const summary=document.getElementById('explorationSummary');
  let map=loadExploration(storage,getWorld().seed);
  let lastPaint=-Infinity,lastSave=-Infinity,nav,gestures,paintRequest=null;
  const captured=new Set();
  function resetPointers(){
    gestures?.cancel();
    for(const id of captured){try{if(large.hasPointerCapture(id))large.releasePointerCapture(id);}catch(_){}}
    captured.clear();
  }
  function resetNavigation(){
    resetPointers();
    nav=createNavigationAdapter({seed:map.seed,discovery:map,storage,
      width:large.width,height:large.height,player:getPlayer()});
    gestures=createNavigationGestures({viewport:nav.viewport});
    if(!overlay.hidden)gestures.open();
  }
  resetNavigation();
  function renderExpanded(){
    if(overlay.hidden)return;
    const world=getWorld(),player=getPlayer();
    if(world.seed!==map.seed)return;
    nav.updatePlayer(player);
    const frame=nav.frame();
    paintNavigationFrame(large,frame,{cellInk:cell=>{
      // Double-check the live discovery owner before ANY terrain read.
      if(!map.seen.has(cell.x+','+cell.z))return '#122126';
      return profiledDiscoveredCellInk(world,cell.x,cell.z,MAP_CELL_SIZE)||surfaceInk(world,cell.x,cell.z);
    }});
    // Production yaw zero faces +Z; north is -Z, east is +X.
    const location=createNavigationLocationReadout({...player,yaw:-player.yaw},{headingOffset:180});
    coordinates.textContent=location.coordinateLabel+' · '+location.direction+' '+Math.round(location.bearingDegrees)%360+'° · Seed '+world.seed;
    summary.textContent=map.warning||nav.navigator.warning||map.seen.size+' discovered cells · surface map';
    large.dataset.navigationZoom=String(frame.zoom);
  }
  function queueExpanded(){
    if(paintRequest!==null)return;
    paintRequest=requestAnimationFrame(()=>{paintRequest=null;renderExpanded();});
  }
  function syncSeed(){
    const world=getWorld();
    if(map.seed===world.seed)return;
    map.flush();
    map=loadExploration(storage,world.seed);
    resetNavigation();
  }
  function render(){
    const world=getWorld(),player=getPlayer();
    paintExploration(mini,map,world,player);
    mini.dataset.discovered=String(map.seen.size);
    mini.dataset.seed=String(map.seed);
    renderExpanded();
  }
  function close(){
    if(overlay.hidden)return;
    overlay.hidden=true;resetPointers();gestures.close();
    if(paintRequest!==null){cancelAnimationFrame(paintRequest);paintRequest=null;}
    map.flush();render();document.getElementById('scene').focus({preventScroll:true});
  }
  openButton.addEventListener('click',()=>{
    if(!overlay.hidden||!canOpen())return;
    syncSeed();onOpen();
    nav.viewport.reset();map.flush();
    overlay.hidden=false;gestures.open();render();closeButton.focus({preventScroll:true});
  });
  closeButton.addEventListener('click',close);
  overlay.addEventListener('pointerdown',e=>{if(e.target===overlay)close();});
  document.addEventListener('keydown',e=>{
    if(!overlay.hidden&&e.key==='Escape'){e.preventDefault();close();}
  });
  document.getElementById('mapRecenter').addEventListener('click',()=>{
    resetPointers();nav.viewport.reset();renderExpanded();
  });
  function zoomBy(factor){
    resetPointers();
    const f=nav.viewport.snapshot().frame;
    nav.viewport.zoomAt({factor,screenX:f.x+f.width/2,screenY:f.y+f.height/2});
    renderExpanded();
  }
  document.getElementById('mapZoomIn').addEventListener('click',()=>zoomBy(1.25));
  document.getElementById('mapZoomOut').addEventListener('click',()=>zoomBy(.8));
  function localPoint(event){
    const b=large.getBoundingClientRect();
    if(!large.clientWidth||!large.clientHeight)return null;
    return {x:(event.clientX-b.left-large.clientLeft)*large.width/large.clientWidth,
      y:(event.clientY-b.top-large.clientTop)*large.height/large.clientHeight};
  }
  large.addEventListener('pointerdown',event=>{
    if(overlay.hidden||event.button!==0)return;
    event.preventDefault();event.stopPropagation();
    const p=localPoint(event);
    if(!p||!gestures.begin(event.pointerId,p.x,p.y))return;
    captured.add(event.pointerId);
    try{large.setPointerCapture(event.pointerId);}catch(_){}
  });
  large.addEventListener('pointermove',event=>{
    if(!captured.has(event.pointerId))return;
    event.preventDefault();event.stopPropagation();
    const p=localPoint(event);
    if(p&&gestures.move(event.pointerId,p.x,p.y))queueExpanded();
    else if(!gestures.activePointers)resetPointers();
  });
  function endPointer(event){
    if(!captured.delete(event.pointerId))return;
    event.preventDefault();event.stopPropagation();
    gestures.end(event.pointerId);
    try{if(large.hasPointerCapture(event.pointerId))large.releasePointerCapture(event.pointerId);}catch(_){}
  }
  large.addEventListener('pointerup',endPointer);
  for(const event of ['pointercancel','lostpointercapture'])
    large.addEventListener(event,e=>{if(captured.has(e.pointerId))resetPointers();});
  window.addEventListener('blur',resetPointers);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){resetPointers();map.flush();}});
  window.addEventListener('pagehide',()=>map.flush());
  return {
    isOpen:()=>!overlay.hidden,
    tick(now){
      syncSeed();
      if(overlay.hidden&&canOpen())map.reveal(getPlayer().x,getPlayer().z);
      if(now-lastPaint>320){render();lastPaint=now;}
      if(now-lastSave>5000){map.flush();lastSave=now;}
    },
    flush:()=>map.flush(),
    close
  };
}