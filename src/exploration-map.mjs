// MYTHWROUGHT Gate A — isolated, seed-specific discovery map.
// A map cell is revealed ONLY by visiting its vicinity; never prefill from a seed.
// Discovery is stored outside the canonical schema-1 voxel save and never rewrites it.
import {terrainHeight,BLOCK} from './voxel.mjs';
import {profiledDiscoveredCellInk} from './manual-biomes/exploration-ink.mjs';
import {createNavigationAdapter} from './navigation00/navigation-adapter.mjs';
import {createNavigationGestures} from './navigation00/navigation-gestures.mjs';
import {paintNavigationFrame} from './navigation00/navigation-paint.mjs';
import {createNavigationLocationReadout} from './navigation00/navigation-location-readout.mjs';
import {navigationPose,observeNavigationSurface,eligibleSurfaceDiscovery} from './navigation00/navigation-live-observation.mjs';
import {createObservationCatalog,sampleNearbyObservations} from './navigation00/navigation-observation-catalog.mjs';
import {surfaceWitness,nearestVisibleMarker} from './navigation00/navigation-surface-witness.mjs';
import {classifyHeightObservation,inspectUpperCover} from './navigation00/navigation-height-observation.mjs';
import {MOUNTAIN_V8_MATERIAL,mountainV8Material} from './manual-biomes/mountain-v8-materials.mjs';
import {LEGACY_WORLD_MIN_Y,WORLD_MAX_Y} from './depth.mjs';
import {PHYSICAL_MAX_Y,UPPER_SECTION_COUNT,runtimeSectionBounds} from './world-height.mjs';

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
  let dirty=false,readOnly=false,warning='',rawBefore=null;
  try{
    const raw=storage.getItem(key);rawBefore=raw;
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
    reveal(x,z,eligible=()=>true){
      if(!Number.isFinite(x)||!Number.isFinite(z)||typeof eligible!=='function')return 0;
      const cx=Math.floor(x/MAP_CELL_SIZE),cz=Math.floor(z/MAP_CELL_SIZE);
      let added=0;
      for(let dz=-MAP_REVEAL_RADIUS;dz<=MAP_REVEAL_RADIUS;dz++){
        for(let dx=-MAP_REVEAL_RADIUS;dx<=MAP_REVEAL_RADIUS;dx++){
          if(dx*dx+dz*dz>MAP_REVEAL_RADIUS*MAP_REVEAL_RADIUS)continue;
          const cell=(cx+dx)+','+(cz+dz);
          if(seen.has(cell)||!eligible((cx+dx)*MAP_CELL_SIZE+2,(cz+dz)*MAP_CELL_SIZE+2))continue;
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
        if(storage.getItem(key)!==rawBefore){readOnly=true;throw Error('Exploration changed in another session');}
        storage.setItem(key,raw);
        if(storage.getItem(key)!==raw){readOnly=true;throw Error('Exploration map read-back differed');}
        rawBefore=raw;dirty=false;warning='';return true;
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
export function paintExploration(canvas,map,world,player,{expanded=false,panX=0,panZ=0,zoom=7,observedInk=null}={}){
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
      ctx.fillStyle=observedInk?observedInk(cx,cz):(profiledDiscoveredCellInk(world,cx,cz,MAP_CELL_SIZE)||
        surfaceInk(world,cx,cz));
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
export function installExplorationMap({storage,getWorld,getPlayer,onOpen,canOpen,residentAt=()=>false,upperOccupiedAt=()=>true,upperResidentAt=()=>false,readUpper=()=>1}){
  const mini=document.getElementById('miniMap');
  const openButton=document.getElementById('miniMapButton');
  const overlay=document.getElementById('explorationOverlay');
  const large=document.getElementById('expandedMap');
  const closeButton=document.getElementById('closeExploration');
  const coordinates=document.getElementById('explorationCoordinates');
  const summary=document.getElementById('explorationSummary');
  let map=loadExploration(storage,getWorld().seed);
  let lastPaint=-Infinity,lastSave=-Infinity,nav,gestures,catalog,paintRequest=null,observation=null,selected=null,tap=null,sampleIndex=0;
  const markerList=document.getElementById('navMarkerList'),markerName=document.getElementById('navMarkerName');
  const markerStatus=document.getElementById('navMarkerStatus');
  const addMarker=document.getElementById('navMarkerAdd'),renameMarker=document.getElementById('navMarkerRename');
  const removeMarker=document.getElementById('navMarkerRemove'),undoMarker=document.getElementById('navMarkerUndo');
  const hereMarker=document.getElementById('navMarkerHere'),landmarkList=document.getElementById('navLandmarkList'),focusMarker=document.getElementById('navMarkerFocus');
  const pose=()=>navigationPose(getPlayer());
  function refreshMarkers(){
    const pins=nav.navigator.visiblePins(),pin=pins.find(p=>p.id===selected?.id);
    const signature=JSON.stringify(pins.map(p=>[p.id,p.label]));
    if(markerList.dataset.signature!==signature){
      markerList.replaceChildren(new Option('Select waypoint',''));
      for(const p of pins)markerList.add(new Option(p.label,p.id));
      markerList.dataset.signature=signature;
    }
    markerList.value=pin?.id||'';
    const marks=catalog.visible(),ms=JSON.stringify(marks.map(p=>[p.id,p.label]));
    if(landmarkList.dataset.signature!==ms){landmarkList.replaceChildren(new Option('Select landmark',''));for(const m of marks)landmarkList.add(new Option(m.label,m.id));landmarkList.dataset.signature=ms;}
    landmarkList.value=selected?.landmarkId||'';
    focusMarker.disabled=!selected;
    markerName.disabled=!!selected?.landmarkId;
    const writable=!nav.navigator.readOnly;
    addMarker.disabled=!writable||!selected||!!pin||!!selected.landmarkId||!map.has(selected.x,selected.z);
    renameMarker.disabled=removeMarker.disabled=!writable||!pin;
    undoMarker.disabled=!nav.navigator.canUndo;
    markerStatus.textContent=nav.navigator.warning||(pin?'Waypoint · X '+pin.x.toFixed(1)+' Z '+pin.z.toFixed(1):
      selected?.landmarkId?selected.label+' · X '+selected.x.toFixed(1)+' Y '+selected.y.toFixed(1)+' Z '+selected.z.toFixed(1):
      selected?'Target · X '+selected.x.toFixed(1)+' Z '+selected.z.toFixed(1)+(map.has(selected.x,selected.z)?'':' · unexplored'):
      'Tap a discovered tile or select HERE.');
  }
  function selectTarget(target){
    selected=target;markerName.value=target?.label||'';refreshMarkers();renderExpanded();
  }
  function editMarker(action){
    const n=nav.navigator,label=markerName.value.trim();
    let ok=false;
    if(action==='add'&&selected&&!selected.id&&!selected.landmarkId&&label&&map.has(selected.x,selected.z)){
      const id='p-'+Array.from(crypto.getRandomValues(new Uint32Array(2)),v=>v.toString(16)).join('-');
      ok=n.pin({id,x:selected.x,z:selected.z,label});if(ok)selected={...selected,id,label};
    }else if(action==='rename'&&selected?.id&&label){ok=n.rename(selected.id,label);if(ok)selected={...selected,label};}
    else if(action==='remove'&&selected?.id){ok=n.unpin(selected.id);if(ok)selected=null;}
    else if(action==='undo'){ok=n.undo();if(ok)selected=null;}
    refreshMarkers();renderExpanded();
    if(!ok&&!n.warning)markerStatus.textContent='No change saved. Select a valid discovered target and name.';
  }
  const captured=new Set();
  function resetPointers(){
    gestures?.cancel();
    tap=null;
    const ids=[...captured];captured.clear();
    for(const id of ids){try{if(large.hasPointerCapture(id))large.releasePointerCapture(id);}catch(_){}}
  }
  function resetNavigation(){
    resetPointers();
    nav=createNavigationAdapter({seed:map.seed,discovery:map,storage,
      width:large.width,height:large.height,player:pose(),exact:true});
    catalog=createObservationCatalog({seed:map.seed,discovery:map,storage});sampleIndex=0;
    selected=null;observation=null;
    gestures=createNavigationGestures({viewport:nav.viewport});
    if(!overlay.hidden)gestures.open();
  }
  resetNavigation();
  function renderExpanded(){
    if(overlay.hidden)return;
    const world=getWorld(),player=pose();
    if(world.seed!==map.seed)return;
    nav.updatePlayer(player);
    const frame=nav.frame();
    const marks=catalog.visible().map(p=>({...p,...frame.projection.world(p.x,p.z)}));
    const target=selected&&!selected.id?frame.projection.world(selected.x,selected.z):null;
    paintNavigationFrame(large,frame,{landmarks:marks,target,selectedId:selected?.id,cellInk:cell=>catalog.ink(cell.x,cell.z)});
    // Production yaw zero faces +Z; north is -Z, east is +X.
    const currentObservation=observation?.x===Math.floor(player.x)&&observation?.z===Math.floor(player.z)?observation:null;
    const location=createNavigationLocationReadout({...player,yaw:-player.yaw},{headingOffset:180,decimals:1,surfaceY:currentObservation?.surfaceY??null});
    coordinates.textContent=location.coordinateLabel+' · '+location.direction+' '+Math.round(location.bearingDegrees)%360+'° · Seed '+world.seed;
    summary.textContent=map.warning||catalog.warning||map.seen.size+' discovered cells · '+(currentObservation?.kind==='upper'?'Upper world · surface not sampled':currentObservation?.kind==='underground'?'Underground · surface unknown':currentObservation?.kind==='covered'?'Below cover · '+(currentObservation.surfaceY===null?'height unknown':'Cover '+location.depth.toFixed(1)+' blocks above feet'):currentObservation?.kind==='surface'?'Surface / open sky':'Surface status unknown');
    if(!map.warning&&!catalog.warning&&currentObservation?.kind==='underground'){
      const priorTop=catalog.height(Math.floor(player.x/4),Math.floor(player.z/4));
      if(priorTop!==null)summary.textContent=map.seen.size+' discovered cells · Underground · '+Math.max(0,priorTop-player.y).toFixed(1)+' below last observed tile top (approx.)';
    }
    large.dataset.observedTiles=String(catalog.tileCount);
    large.dataset.observedLandmarks=String(marks.length);
    refreshMarkers();
    large.dataset.navigationZoom=String(frame.zoom);
  }
  function queueExpanded(){
    if(paintRequest!==null)return;
    paintRequest=requestAnimationFrame(()=>{paintRequest=null;renderExpanded();});
  }
  function syncSeed(){
    const world=getWorld();
    if(map.seed===world.seed)return;
    flushAll();
    map=loadExploration(storage,world.seed);
    resetNavigation();
  }
  function render(){
    const world=getWorld(),player=getPlayer();
    paintExploration(mini,map,world,player,{observedInk:(x,z)=>catalog.ink(x,z)});
    mini.dataset.discovered=String(map.seen.size);
    mini.dataset.seed=String(map.seed);
    renderExpanded();
  }
  function flushAll(){const fog=map.flush();return fog&&catalog.flush();}
  function close(){
    if(overlay.hidden)return;
    overlay.hidden=true;resetPointers();gestures.close();
    if(paintRequest!==null){cancelAnimationFrame(paintRequest);paintRequest=null;}
    flushAll();render();document.getElementById('scene').focus({preventScroll:true});
  }
  openButton.addEventListener('click',()=>{
    if(!overlay.hidden||!canOpen())return;
    syncSeed();onOpen();
    nav.viewport.reset();selected=null;markerName.value='';flushAll();
    overlay.hidden=false;gestures.open();render();closeButton.focus({preventScroll:true});
  });
  closeButton.addEventListener('click',close);
  hereMarker.addEventListener('click',()=>{const p=pose();selectTarget({x:p.x,z:p.z});});
  markerList.addEventListener('change',()=>selectTarget(nav.navigator.visiblePins().find(p=>p.id===markerList.value)||null));
  function selectLandmark(id){const p=catalog.visible().find(m=>m.id===id);selectTarget(p?{...p,id:undefined,landmarkId:p.id}:null);}
  landmarkList.addEventListener('change',()=>selectLandmark(landmarkList.value));
  focusMarker.addEventListener('click',()=>{
    if(!selected)return;
    resetPointers();nav.viewport.reset();const player=pose(),zoom=nav.viewport.snapshot().zoom;
    nav.viewport.panPixels({dx:(player.x-selected.x)*zoom/4,dy:(player.z-selected.z)*zoom/4});renderExpanded();
  });
  for(const [button,action] of [[addMarker,'add'],[renameMarker,'rename'],[removeMarker,'remove'],[undoMarker,'undo']])
    button.addEventListener('click',()=>editMarker(action));
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
    if(captured.size===0)tap={id:event.pointerId,x:p.x,y:p.y,moved:false};
    else tap=null;
    captured.add(event.pointerId);
    try{large.setPointerCapture(event.pointerId);}catch(_){}
  });
  large.addEventListener('pointermove',event=>{
    if(!captured.has(event.pointerId))return;
    event.preventDefault();event.stopPropagation();
    const p=localPoint(event);
    if(tap&&p&&Math.hypot(p.x-tap.x,p.y-tap.y)>7)tap.moved=true;
    if(tap&&!tap.moved)return;
    if(p&&gestures.move(event.pointerId,p.x,p.y))queueExpanded();
    else if(!gestures.activePointers)resetPointers();
  });
  function endPointer(event){
    if(!captured.delete(event.pointerId))return;
    event.preventDefault();event.stopPropagation();
    const point=localPoint(event);
    const isTap=tap?.id===event.pointerId&&!tap.moved&&captured.size===0&&point&&Math.hypot(point.x-tap.x,point.y-tap.y)<=7;
    tap=null;gestures.end(event.pointerId);
    if(isTap){
      const f=nav.frame(),marks=catalog.visible().map(p=>({...p,...f.projection.world(p.x,p.z)}));
      const nearest=nearestVisibleMarker({point,pins:f.pins,landmarks:marks,frame:f.frame});
      if(nearest?.kind==='waypoint')selectTarget(nav.navigator.visiblePins().find(p=>p.id===nearest.id));
      else if(nearest?.kind==='landmark')selectLandmark(nearest.id);
      else{const target=f.projection.atScreen(point.x,point.y);if(target)selectTarget(target);}
    }
    try{if(large.hasPointerCapture(event.pointerId))large.releasePointerCapture(event.pointerId);}catch(_){}
  }
  large.addEventListener('pointerup',endPointer);
  for(const event of ['pointercancel','lostpointercapture'])
    large.addEventListener(event,e=>{if(captured.has(e.pointerId))resetPointers();});
  window.addEventListener('blur',resetPointers);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){resetPointers();flushAll();}});
  window.addEventListener('pagehide',flushAll);
  return {
    isOpen:()=>!overlay.hidden,
    tick(now){
      syncSeed();
      if(now-lastPaint>320){
        if(overlay.hidden&&canOpen()){
          const player=pose(),world=getWorld();
          const upperCover=player.y>=LEGACY_WORLD_MIN_Y&&player.y<=WORLD_MAX_Y+1?inspectUpperCover({player,sections:UPPER_SECTION_COUNT,bounds:runtimeSectionBounds,
            occupied:upperOccupiedAt,resident:upperResidentAt,read:readUpper}):null;
          const physicalRead={get:readUpper};
          const legacy=upperCover===false?observeNavigationSurface({world:physicalRead,player,residentAt,minSurfaceY:LEGACY_WORLD_MIN_Y,maxY:WORLD_MAX_Y}):null;
          observation=classifyHeightObservation({player,legacyMax:WORLD_MAX_Y,physicalMax:PHYSICAL_MAX_Y,legacyObservation:legacy,upperCover});
          if(eligibleSurfaceDiscovery(observation,player)){
            const cx=Math.floor(player.x/4),cz=Math.floor(player.z/4);
            if(!map.readOnly)map.reveal(player.x,player.z,(x,z)=>Math.floor(x/4)===cx&&Math.floor(z/4)===cz);
            sampleNearbyObservations({catalog,discovery:map,player,refreshIndex:sampleIndex++,
              residentAt:(x,z)=>!map.readOnly&&residentAt(x,WORLD_MAX_Y,z),
              admit:(x,z)=>{map.reveal(player.x,player.z,(a,b)=>Math.floor(a/4)===x&&Math.floor(b/4)===z);return map.seen.has(x+','+z);},
              sample:(x,z)=>{
                for(let y=WORLD_MAX_Y;y>=LEGACY_WORLD_MIN_Y;y--){
                  const id=readUpper(x,y,z);if(id===BLOCK.AIR)continue;
                  if(!surfaceWitness({eye:[player.x,player.y+1.55,player.z],target:[x+.5,y+1.01,z+.5],
                    resident:(a,b,c)=>b<=PHYSICAL_MAX_Y&&(b>WORLD_MAX_Y?(upperResidentAt(a,c,Math.ceil((b-WORLD_MAX_Y)/16))||!upperOccupiedAt(a,c,Math.ceil((b-WORLD_MAX_Y)/16))):residentAt(a,b,c)),
                    read:(a,b,c)=>b>WORLD_MAX_Y?(upperOccupiedAt(a,c,Math.ceil((b-WORLD_MAX_Y)/16))?readUpper(a,b,c):0):readUpper(a,b,c)}))return null;
                  const material=mountainV8Material(id);
                  const ink=material?material.palette[0].map(v=>Math.round(v*255).toString(16).padStart(2,'0')).join(''):null;
                  const color=ink?'#'+ink:({1:'#6f9a6d',2:'#8b7b62',3:'#a49d8d',4:'#806747',7:'#477a69',76:'#468ca8',256:'#d5b276',257:'#bd765c',258:'#aa8a63',259:'#dfd4ae',272:'#e0edf0',277:'#a7d5df',278:'#b7c3c4',279:'#d2ddde',286:'#8e6ca8',293:'#a184bf',294:'#9278ac',302:'#858995',303:'#676d7c',305:'#686c7a',307:'#a87866'}[id]||'#8b9081');
                  return {ink:color,y:y+1};
                }
                return null;
              }});
            const x=Math.floor(player.x),z=Math.floor(player.z),y=observation.surfaceY-1;
            const id=world.get(x,y,z),base=world.base??world;
            if(player.y>=y+1&&player.y<=y+3&&[MOUNTAIN_V8_MATERIAL.stone,MOUNTAIN_V8_MATERIAL.slate,MOUNTAIN_V8_MATERIAL.gneiss].includes(id)&&
                typeof base.naturalAndLandmarkBlock==='function'&&base.naturalAndLandmarkBlock(x,y,z)===id&&!base.edits?.has(x+','+y+','+z)){
              catalog.observeLandmark({id:'alpine-'+Math.floor(x/16)+'-'+Math.floor(z/16),kind:'alpine',x:player.x,y:player.y,z:player.z},{witnessed:true});
            }
          }
        }
        render();lastPaint=now;
      }
      if(now-lastSave>5000){flushAll();lastSave=now;}
    },
    observeCavePassage(){
      syncSeed();const p=pose();
      if(!overlay.hidden||!canOpen()||!map.has(p.x,p.z))return false;
      const x=Math.floor(p.x/4),z=Math.floor(p.z/4);
      const id='cave-'+x+'-'+z;
      return catalog.observeLandmark({id,x:p.x,y:p.y,z:p.z,kind:'cave'},{witnessed:true});
    },
    flush:flushAll,
    close
  };
}