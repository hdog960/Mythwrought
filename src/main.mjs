import {VoxelWorld,BLOCK,chunkCoord,chunkWindow,terrainHeight,meshChunk,raycast,outlineVertices,collides} from './voxel.mjs';
import {DEFAULT_WORLD_SEED,SELECTED_SEED_KEY,LEGACY_WORLD_KEY,worldSeedFromText,worldSlotKey} from './seeds.mjs';
import {SKY_VERTEX_SHADER,SKY_FRAGMENT_SHADER,DISTANCE_FOG_COLOR} from './sky.mjs';
import {clampLook,forwardVector,compassDegrees} from './camera.mjs';
import {normalizedStick,safePointerDelta,stickLookDelta,selectedLookMode,isWorldControlTarget,touchMovementX,touchCameraX} from './input.mjs';
import {chunkKey,prepareSeamBatch,priorityMissingChunks} from './chunks.mjs';
import {calculateGripWidth,normalizeControlSize} from './layout.mjs';
import {newPlayer,stepPlayer,findSafeSpawn} from './physics.mjs';
import {applyBlockAction,inspectBlockTarget,BLOCK_NAMES} from './blocks.mjs';
import {loadWorldSafe,saveWorldSafe,importWorldData,saveFingerprint,MAX_IMPORT_BYTES} from './persistence.mjs';
import {FrameHistory,gripClearance,probeTemporaryStorage,formatPreflightReport} from './preflight.mjs';
import {createVaultBackup,listVaultBackups,inspectVaultBackup,deleteVaultBackup} from './vault.mjs';
import {MIRROR_PREF,MirrorWriteQueue,inspectMirror,getMirrorCopy} from './mirror.mjs';
import {normalizeRenderPreset,bufferDimensions,RENDER_PREF} from './render-budget.mjs';

const canvas=document.getElementById('scene');
const notice=document.getElementById('notice');
const status=document.getElementById('status');
const compass=document.getElementById('compass');
const seedLabel=document.getElementById('seed');
const help=document.getElementById('help');
const gl=canvas.getContext('webgl2',{alpha:false,antialias:false,depth:true,powerPreference:'high-performance'});
function message(s){status.textContent=s;}
function fatal(s){notice.hidden=false;notice.textContent=s;message('3D renderer unavailable');}
if(!gl)fatal('This browser does not provide WebGL2. A compatible iPhone or desktop browser is required.');
else start();

function start(){
  let world,storageReadOnly=false,recoveryNote='';
  function loadWorld(seed){
    const result=loadWorldSafe(localStorage,seed);
    if(result.recovered)recoveryNote=result.warning;
    return result.world;
  }
  try{
    const choice=localStorage.getItem(SELECTED_SEED_KEY);
    world=loadWorld(choice===null?DEFAULT_WORLD_SEED:worldSeedFromText(choice));
  }catch(err){
    // A damaged seed is NEVER replaced by auto-saving a fresh starter world.
    storageReadOnly=true;world=new VoxelWorld(DEFAULT_WORLD_SEED);
    recoveryNote='SAVE PROTECTION: '+err.message+' Choose a different seed or import backup.';
  }
  seedLabel.textContent='WORLD '+world.seed;
  const VS=[
    '#version 300 es','precision highp float;',
    'in vec3 aPos; in vec3 aColor; in vec2 aUv; in float aMat;',
    'uniform vec3 uEye,uForward,uRight,uUp;',
    'uniform float uAspect,uTan;',
    'out vec3 vColor; out float vDistance; out vec2 vUv; flat out int vMat;',
    'void main(){ vec3 d=aPos-uEye;',
    'float x=dot(d,uRight); float y=dot(d,uUp); float z=dot(d,uForward);',
    'gl_Position=vec4(x/(uAspect*uTan),y/uTan,1.0015*z-0.1501,z);',
    'vColor=aColor; vDistance=length(d); vUv=aUv; vMat=int(aMat+.5); }'
  ].join('\n');
  const FS=[
    '#version 300 es','precision highp float;',
    'in vec3 vColor; in float vDistance; in vec2 vUv; flat in int vMat; out vec4 outColor;',
    'uniform vec3 uFog;',
    'float speckle(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
    'void main(){',
    'float closeDetail=1.0-smoothstep(10.0,36.0,vDistance);',
    'float tiled=speckle(floor(vUv*vec2(13.0))+float(vMat)*17.3);',
    'float shade=.93+.14*tiled;',
    'if(vMat==1)shade*=.97+.05*step(.73,speckle(floor(vUv*17.0)+17.0));',
    'if(vMat==2)shade*=.91+.16*speckle(floor(vUv*vec2(11.0,15.0))+41.0);',
    'if(vMat==3)shade*=.88+.18*speckle(floor(vUv*vec2(11.0,13.0))+3.0);',
    'if(vMat==3)shade*=.97+.06*step(.93,speckle(floor(vUv*vec2(9.0,11.0))+vec2(4.0,2.0)));',
    'if(vMat==4)shade*=.85+.18*smoothstep(.20,.92,abs(sin(vUv.x*22.0+sin(vUv.y*9.0))));',
    'if(vMat==4)shade*=.98+.04*step(.88,speckle(floor(vUv*vec2(12.0,8.0))+4.0));',
    'if(vMat==5)shade*=.83+.24*step(.48,fract(vUv.x*3.0+vUv.y*2.0));',
    'if(vMat==5)shade*=.91+.13*step(.82,speckle(floor(vUv*vec2(12.0))+5.0));',
    'if(vMat==6)shade*=.90+.18*step(.69,speckle(floor(vUv*15.0)+vec2(26.0,19.0)));',
    'float fog=smoothstep(29.0,68.0,vDistance);',
    'vec3 colored=mix(vColor,vColor*shade,closeDetail*.8);',
    'if(vMat==5)colored=mix(colored,vec3(.52,.85,.95),closeDetail*.12);',
    'if(vMat==6)colored=mix(colored,vec3(.84,.69,.40),closeDetail*.07);',
    'outColor=vec4(mix(colored,uFog,fog),1.0); }'
  ].join('\n');
  function shader(type,src){
    const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);
    if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));
    return s;
  }
  let program,skyProgram;
  try{
    function linkProgram(vertexSource,fragmentSource){
      const p=gl.createProgram();
      gl.attachShader(p,shader(gl.VERTEX_SHADER,vertexSource));
      gl.attachShader(p,shader(gl.FRAGMENT_SHADER,fragmentSource));
      gl.linkProgram(p);
      if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(p));
      return p;
    }
    program=linkProgram(VS,FS);
    skyProgram=linkProgram(SKY_VERTEX_SHADER,SKY_FRAGMENT_SHADER);
  }catch(err){fatal('Voxel/sky shader failed to initialize: '+err.message);return;}
  gl.useProgram(program);
  const atPos=gl.getAttribLocation(program,'aPos'),atColor=gl.getAttribLocation(program,'aColor');
  const atUv=gl.getAttribLocation(program,'aUv'),atMat=gl.getAttribLocation(program,'aMat');
  for(const index of [atPos,atColor,atUv,atMat])gl.enableVertexAttribArray(index);
  const U={};
  for(const k of ['uEye','uForward','uRight','uUp','uAspect','uTan','uFog'])U[k]=gl.getUniformLocation(program,k);
  const skyU={resolution:gl.getUniformLocation(skyProgram,'uResolution'),
    yaw:gl.getUniformLocation(skyProgram,'uYaw'),pitch:gl.getUniformLocation(skyProgram,'uPitch')};
  gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.disable(gl.CULL_FACE);

  let selected=BLOCK.STONE;
  const outlineBuffer=gl.createBuffer();
  let outlineKey='',outlineCount=0;
  const targetInfo=document.getElementById('targetInfo');
  let lastTargetText='';
  const chunks=new Map(),pending=new Map();
  const name=chunkKey;
  const player=newPlayer(world);
  let jumpQueued=false;
  const keys=new Set(),joystick={x:0,y:0},lookStick={x:0,y:0};
  const heldPointers=new Map();
  let precisionHeld=false;
  let frame=0,lastFrame=performance.now(),changed=false;
  const frameHistory=new FrameHistory(360);
  const mirrorQueue=new MirrorWriteQueue();
  const mirrorStatus=document.getElementById('mirrorStatus');
  const mirrorSlot=document.getElementById('mirrorSlot');
  const mirrorDownload=document.getElementById('mirrorDownload');
  let mirrorEnabled=false,mirrorTimer=null,mirrorDownloadUrl=null;
  const pendingMirrors=new Map();
  try{mirrorEnabled=localStorage.getItem(MIRROR_PREF)==='enabled';}catch(_){}
  function clearMirrorDownload(){
    if(mirrorDownloadUrl){URL.revokeObjectURL(mirrorDownloadUrl);mirrorDownloadUrl=null;}
    mirrorDownload.hidden=true;mirrorDownload.removeAttribute('href');
  }
  function verifiedLiveBytes(){
    if(storageReadOnly)throw Error('Protected read-only world: keep original damaged data');
    const raw=localStorage.getItem(worldSlotKey(world.seed));
    if(!raw||raw!==JSON.stringify(world.save()))
      throw Error('Live world does not match a verified primary save. Use SAVE first.');
    return raw;
  }
  function queueMirror(seed,raw){
    return mirrorQueue.enqueue(raw).then(
      result=>{mirrorStatus.textContent='Verified device mirror for seed '+seed+
        ', '+result.edits+' edits. The prior verified copy is retained.';return result;},
      error=>{mirrorStatus.textContent='MIRROR NOT VERIFIED for seed '+seed+': '+String(error)+
        '. Local world save is unchanged; export JSON.';throw error;}
    );
  }
  function flushMirror(){
    if(mirrorTimer!==null){clearTimeout(mirrorTimer);mirrorTimer=null;}
    const tasks=[...pendingMirrors.entries()];pendingMirrors.clear();
    return Promise.allSettled(tasks.map(([seed,raw])=>queueMirror(seed,raw)));
  }
  function scheduleMirrorForWorld(){
    if(!mirrorEnabled)return;
    try{
      const raw=verifiedLiveBytes();
      pendingMirrors.set(world.seed,raw);
      if(mirrorTimer!==null)clearTimeout(mirrorTimer);
      mirrorTimer=setTimeout(()=>{flushMirror();},400);
      mirrorStatus.textContent='Local save verified; device mirror queued (not yet verified).';
    }catch(error){mirrorStatus.textContent='Device mirror pending: '+String(error.message||error);}
  }
  async function settleMirrorWrites(){await flushMirror();await mirrorQueue.idle();}
  let renderPreset='balanced';
  try{renderPreset=normalizeRenderPreset(localStorage.getItem(RENDER_PREF));}catch(_){}
  const renderSelect=document.getElementById('renderPreset');
  renderSelect.value=renderPreset;
  renderSelect.addEventListener('change',()=>{
    renderPreset=normalizeRenderPreset(renderSelect.value);
    try{localStorage.setItem(RENDER_PREF,renderPreset);}catch(_){}
    message('3D pixel workload: '+renderSelect.selectedOptions[0].textContent);
  });
  const CONTROL_SIZE_KEY='mythwrought-v005-control-size';
  let controlSize='regular';
  try{controlSize=normalizeControlSize(localStorage.getItem(CONTROL_SIZE_KEY));}catch(_){}
  const CAMERA_PREF='mythwrought-v003-look-percent';
  const LOOK_MODE_KEY='mythwrought-v004-look-mode';
  let lookMode='swipe';
  try{lookMode=selectedLookMode(localStorage.getItem(LOOK_MODE_KEY));}catch(_){}
  let sensitivity=1;
  try{
    const stored=Number(localStorage.getItem(CAMERA_PREF));
    if(stored>=50&&stored<=180)sensitivity=stored/100;
  }catch(_){}
  const eye=()=>[player.x,player.feet+1.55,player.z];
  const facing=()=>forwardVector(player.yaw,player.pitch);
  function look(dx,dy,scale=.008){
    const precise=precisionHeld||keys.has('ShiftLeft')||keys.has('ShiftRight');
    const adjusted=clampLook(player.yaw,player.pitch,dx,dy,sensitivity,scale*(precise ? .4 : 1));
    player.yaw=adjusted.yaw;player.pitch=adjusted.pitch;
  }
  const saveHealth=document.getElementById('saveHealth');
  function save(){
    if(storageReadOnly){
      message('SAVE PROTECTION ACTIVE — damaged original world not overwritten');
      saveHealth.textContent='READ ONLY: original damaged save preserved. Import a verified backup or choose another seed.';
      return false;
    }
    const result=saveWorldSafe(localStorage,world);
    if(!result.ok){
      message(result.reason+' — EXPORT your world');
      saveHealth.textContent='UNSAVED: '+result.detail+'. Export current world before leaving.';
      return false;
    }
    changed=false;
    scheduleMirrorForWorld();
    saveHealth.textContent=result.warning||'Verified save: schema-1 deltas, checksum journal and previous-good backup.';
    if(result.warning)message(result.warning);
    return true;
  }
  let editMeshBatches=0;
  let lastEditMeshKeys=[];
  function refreshEditedMeshes(x,z){
    // Rebuild adjacent LOADED meshes in one event turn; no partially updated
    // chunk-boundary frame can be shown between the neighbor replacements.
    const batch=prepareSeamBatch(world,chunks,x,z);
    const ready=[];
    try{
      for(const item of batch){
        const buffer=gl.createBuffer();
        if(!buffer)throw Error('WebGL buffer allocation failed');
        ready.push({...item,buffer,count:item.vertices.length/9});
        gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
        gl.bufferData(gl.ARRAY_BUFFER,item.vertices,gl.STATIC_DRAW);
      }
    }catch(err){
      for(const item of ready)gl.deleteBuffer(item.buffer);
      throw err;
    }
    for(const item of ready){
      const old=chunks.get(item.key);
      chunks.set(item.key,{x:item.cx,z:item.cz,buffer:item.buffer,count:item.count});
      if(old)gl.deleteBuffer(old.buffer);
    }
    editMeshBatches++;
    lastEditMeshKeys=ready.map(item=>item.key);
    // Not-yet-loaded chunks read the current global voxel world when meshed.
  }
  function edit(mode){
    const result=applyBlockAction(world,eye(),facing(),mode,selected,player,refreshEditedMeshes);
    if(!result.ok){message(result.reason);return;}
    changed=true;
    const persisted=save();
    const label=BLOCK_NAMES[result.block]||'block';
    const action=mode==='mine'?'Removed':'Placed';
    message(action+' '+label+(persisted?' · saved':' · save failed, export backup'));
  }
  let lastStreamingCenter='';
  let wanted=new Set();
  function stream(){
    const center=name(chunkCoord(player.x),chunkCoord(player.z));
    if(center!==lastStreamingCenter){
      lastStreamingCenter=center;
      const desired=chunkWindow(player.x,player.z,2);
      wanted=new Set(desired.map(c=>name(c.cx,c.cz)));
      // Eagerly delete GPU buffers behind the player; never accumulate old border chunks.
      for(const [k,c] of chunks){
        if(!wanted.has(k)){gl.deleteBuffer(c.buffer);chunks.delete(k);}
      }
      for(const c of desired){
        const k=name(c.cx,c.cz);
        if(!chunks.has(k)&&!pending.has(k))pending.set(k,[c.cx,c.cz]);
      }
    }
    // Edit invalidations may add neighbors; never mesh outside the active bounded window.
    for(const k of pending.keys())if(!wanted.has(k))pending.delete(k);
    // Bounded missing mesh uploads, nearest to the player first.
    const cx=chunkCoord(player.x),cz=chunkCoord(player.z);
    const queue=priorityMissingChunks(pending,cx,cz);
    if(queue.length){
      const [k,[x,z]]=queue[0];pending.delete(k);
      const old=chunks.get(k);if(old)gl.deleteBuffer(old.buffer);
      const data=meshChunk(world,x,z),buffer=gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);
      chunks.set(k,{x,z,buffer,count:data.length/9});
    } // one chunk mesh per frame, bounded visible radius
    if(frame%45===0)for(const [k,c] of chunks){
      if(!wanted.has(k)){gl.deleteBuffer(c.buffer);chunks.delete(k);}
    }
  }
  function respawnPrototype(){
    Object.assign(player,newPlayer(world));
    jumpQueued=false;
    message('Returned to a safe surface near spawn (prototype void recovery)');
  }
  function jump(){if(help.hidden)jumpQueued=true;}
  function move(dt){
    const strafe=(keys.has('KeyD')?1:0)-(keys.has('KeyA')?1:0)+joystick.x;
    const forward=(keys.has('KeyW')?1:0)-(keys.has('KeyS')?1:0)-joystick.y;
    const result=stepPlayer(world,player,{strafe,forward,jump:jumpQueued},dt);
    jumpQueued=false;
    if(result.landed && !result.stepped)canvas.dataset.landings=String((Number(canvas.dataset.landings)||0)+1);
    const arrowsX=(keys.has('ArrowRight')?1:0)-(keys.has('ArrowLeft')?1:0);
    const arrowsY=(keys.has('ArrowDown')?1:0)-(keys.has('ArrowUp')?1:0);
    if(arrowsX||arrowsY)look(arrowsX*dt*1.9,arrowsY*dt*1.6,1);
    if(lookMode==='stick'&&(lookStick.x||lookStick.y)){
      const d=stickLookDelta(lookStick,dt);
      look(d.x,d.y);
    }
    if(player.feet<-15)respawnPrototype();
  }
  function draw(now){
    const dt=Math.min(.035,Math.max(0,(now-lastFrame)/1000));lastFrame=now;
    frameHistory.frame(now,!document.hidden&&help.hidden&&!graphicsLost);
    if(!document.hidden&&!graphicsLost){
      frame++;if(help.hidden)move(dt);
      const buffer=bufferDimensions(canvas.clientWidth,canvas.clientHeight,renderPreset,devicePixelRatio||1);
      const w=buffer.width,h=buffer.height;
      canvas.dataset.renderPreset=renderPreset;
      canvas.dataset.renderScale=String(buffer.scale);
      if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);}
      gl.clearColor(...DISTANCE_FOG_COLOR,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
      // Cheap procedural WebGL sky; the depth buffer is reserved for editable voxels.
      gl.disable(gl.DEPTH_TEST);
      gl.useProgram(skyProgram);
      gl.uniform2f(skyU.resolution,w,h);
      gl.uniform1f(skyU.yaw,player.yaw);
      gl.uniform1f(skyU.pitch,player.pitch);
      gl.drawArrays(gl.TRIANGLES,0,3);
      gl.enable(gl.DEPTH_TEST);
      gl.useProgram(program);
      gl.uniform3fv(U.uEye,eye());
      gl.uniform3fv(U.uForward,facing());
      gl.uniform3fv(U.uRight,[-Math.cos(player.yaw),0,Math.sin(player.yaw)]);
      gl.uniform3fv(U.uUp,[-Math.sin(player.pitch)*Math.sin(player.yaw),Math.cos(player.pitch),-Math.sin(player.pitch)*Math.cos(player.yaw)]);
      gl.uniform1f(U.uAspect,w/h);
      gl.uniform1f(U.uTan,Math.tan(72*Math.PI/360));
      gl.uniform3fv(U.uFog,DISTANCE_FOG_COLOR);
      stream();
      canvas.dataset.loadedChunks=String(chunks.size);
      canvas.dataset.pendingChunks=String(pending.size);
      canvas.dataset.chunkCenter=lastStreamingCenter;
      canvas.dataset.meshEditBatches=String(editMeshBatches);
      canvas.dataset.lastEditedChunks=lastEditMeshKeys.join(';');
      canvas.dataset.renderedMeshVertices=String([...chunks.values()].reduce((sum,c)=>sum+c.count,0));
      for(const c of chunks.values()){
        gl.bindBuffer(gl.ARRAY_BUFFER,c.buffer);
        gl.vertexAttribPointer(atPos,3,gl.FLOAT,false,36,0);
        gl.vertexAttribPointer(atColor,3,gl.FLOAT,false,36,12);
        gl.vertexAttribPointer(atUv,2,gl.FLOAT,false,36,24);
        gl.vertexAttribPointer(atMat,1,gl.FLOAT,false,36,32);
        gl.drawArrays(gl.TRIANGLES,0,c.count);
      }
      // A faint world-space targeted-block outline, never a HUD covering the scene.
      const focused=help.hidden?inspectBlockTarget(world,eye(),facing(),selected,player):null;
      const focusKey=focused?.hit?.join(',')||'';
      const placeKey=focused?.canPlace?focused.adjacent.join(','):'';
      canvas.dataset.targetBlock=focusKey;
      canvas.dataset.targetPlace=placeKey;
      canvas.dataset.canPlace=String(Boolean(placeKey));
      const display=focused?.hit?
        (BLOCK_NAMES[focused.block]||'block').toUpperCase()+' · '+focused.distance.toFixed(1)+'m'+
        '\n'+(focused.canPlace?'GOLD = BUILD SPACE':'PLACE BLOCKED'):
        'LOOK AT A BLOCK';
      if(display!==lastTargetText){
        lastTargetText=display;targetInfo.textContent=display;
        // Do not leave a previous "no target" or "blocked" warning on the
        // footer after the player successfully re-aims elsewhere.
        if(focused?.hit&&status.textContent==='Look at a nearby block')
          message('Target found · use MINE or PLACE');
        if(focused?.canPlace&&status.textContent==='Cannot place inside the player')
          message('Build space clear · choose MINE or PLACE');
      }
      const nextOutlineKey=focusKey+'|'+placeKey;
      if(nextOutlineKey!==outlineKey){
        outlineKey=nextOutlineKey;
        // Teal indicates the mineable target; amber marks the adjacent
        // valid placement cell. Both are world-space geometry, not HUD.
        const mine=focused?.hit?outlineVertices(focused.hit,[.44,.90,.81]):new Float32Array();
        const preview=placeKey?outlineVertices(focused.adjacent,[.97,.76,.38]):new Float32Array();
        const data=new Float32Array(mine.length+preview.length);
        data.set(mine);data.set(preview,mine.length);
        gl.bindBuffer(gl.ARRAY_BUFFER,outlineBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,data,gl.DYNAMIC_DRAW);
        outlineCount=data.length/9;
      }
      if(outlineCount){
        gl.bindBuffer(gl.ARRAY_BUFFER,outlineBuffer);
        gl.vertexAttribPointer(atPos,3,gl.FLOAT,false,36,0);
        gl.vertexAttribPointer(atColor,3,gl.FLOAT,false,36,12);
        gl.vertexAttribPointer(atUv,2,gl.FLOAT,false,36,24);
        gl.vertexAttribPointer(atMat,1,gl.FLOAT,false,36,32);
        gl.drawArrays(gl.LINES,0,outlineCount);
      }
      const deg=compassDegrees(player.yaw);
      compass.textContent=['N','NE','E','SE','S','SW','W','NW'][Math.round(deg/45)%8]+' · '+String(deg).padStart(3,'0')+'°';
      canvas.dataset.skyDrawn='true';
      canvas.dataset.cameraYaw=String(player.yaw);
      canvas.dataset.cameraPitch=String(player.pitch);
      canvas.dataset.playerX=String(player.x);
      canvas.dataset.playerZ=String(player.z);
      canvas.dataset.playerFeet=String(player.feet);
      canvas.dataset.playerGrounded=String(player.onGround);
      canvas.dataset.playerVelocityY=String(player.vY);
      canvas.dataset.playerVelocityX=String(player.vX);
      canvas.dataset.playerVelocityZ=String(player.vZ);
      canvas.dataset.playerColliding=String(collides(world,player.x,player.feet,player.z));
      canvas.dataset.lookMode=lookMode;
      canvas.dataset.precision=String(precisionHeld||keys.has('ShiftLeft')||keys.has('ShiftRight'));
    }
    requestAnimationFrame(draw);
  }
  // Capture is per grip: moving and aiming simultaneously never compete for one pointer.
  function pointerPad(el,update,release){
    let active=null,lastX=0,lastY=0;
    function stop(){
      if(active===null)return;
      heldPointers.delete(active);active=null;release();el.classList.remove('engaged');
    }
    el.addEventListener('pointerdown',e=>{
      if(active!==null)return;
      e.preventDefault();active=e.pointerId;lastX=e.clientX;lastY=e.clientY;
      heldPointers.set(active,stop);
      try{el.setPointerCapture(active);}catch(_){}
      el.classList.add('engaged');update(e,0,0,true);
    });
    el.addEventListener('pointermove',e=>{
      if(active!==e.pointerId)return;
      e.preventDefault();
      const dx=e.clientX-lastX,dy=e.clientY-lastY;
      lastX=e.clientX;lastY=e.clientY;update(e,dx,dy,false);
    });
    for(const event of ['pointerup','pointercancel'])el.addEventListener(event,e=>{if(active===e.pointerId)stop();});
    el.addEventListener('lostpointercapture',stop);
    return stop;
  }
  const movementPad=document.getElementById('movePad'),knob=document.getElementById('moveKnob');
  const consoleFrame=document.querySelector('.console');
  const sizeSelect=document.getElementById('controlSize');
  sizeSelect.value=controlSize;
  function updateControllerLayout(){
    // Mobile viewport units can lag behind orientation/Chrome emulation resize.
    // Pin the physical console to the visible viewport height before sizing grips.
    const visibleHeight=Math.max(1,Math.floor(window.visualViewport?.height||window.innerHeight));
    consoleFrame.style.setProperty('--console-height',visibleHeight+'px');
    const style=getComputedStyle(consoleFrame);
    const inset=(parseFloat(style.paddingLeft)||0)+(parseFloat(style.paddingRight)||0);
    const width=Math.max(280,consoleFrame.getBoundingClientRect().width-inset);
    const grip=calculateGripWidth(width,consoleFrame.getBoundingClientRect().height,controlSize);
    consoleFrame.style.setProperty('--grip-width',grip+'px');
    canvas.dataset.gripWidth=String(grip);
  }
  sizeSelect.addEventListener('change',()=>{
    controlSize=normalizeControlSize(sizeSelect.value);
    try{localStorage.setItem(CONTROL_SIZE_KEY,controlSize);}catch(_){}
    updateControllerLayout();
  });
  window.addEventListener('resize',updateControllerLayout,{passive:true});
  window.visualViewport?.addEventListener('resize',updateControllerLayout,{passive:true});
  updateControllerLayout();
  const cameraPad=document.getElementById('lookPad'),cameraKnob=document.getElementById('lookKnob');
  function padPosition(el,e){
    const r=el.getBoundingClientRect();
    return {x:e.clientX-r.left-r.width/2,y:e.clientY-r.top-r.height/2,radius:Math.max(1,Math.min(r.width,r.height)*.36)};
  }
  pointerPad(movementPad,e=>{
    if(!help.hidden)return;
    const p=padPosition(movementPad,e);
    const next=normalizedStick(p.x,p.y,p.radius);
    joystick.x=touchMovementX(next.x);joystick.y=next.y;
    const travel=Math.max(0,(movementPad.clientWidth-knob.offsetWidth)/2-7);
    knob.style.transform='translate('+Math.round(next.x*travel)+'px,'+Math.round(next.y*travel)+'px)';
  },()=>{joystick.x=joystick.y=0;knob.style.transform='';});
  pointerPad(cameraPad,(e,dx,dy,initial)=>{
    if(!help.hidden)return;
    if(lookMode==='stick'){
      const p=padPosition(cameraPad,e);
      const next=normalizedStick(p.x,p.y,p.radius,.1);
      lookStick.x=touchCameraX(next.x);lookStick.y=next.y;
      const travel=Math.max(0,(cameraPad.clientWidth-cameraKnob.offsetWidth)/2-7);
      cameraKnob.style.transform='translate('+Math.round(next.x*travel)+'px,'+Math.round(next.y*travel)+'px)';
    }else if(!initial){
      const d=safePointerDelta(dx,dy);
      look(touchCameraX(d.x),d.y);
    }
  },()=>{lookStick.x=lookStick.y=0;cameraKnob.style.transform='';});
  const precisionButton=document.getElementById('precision');
  let precisionPointer=null;
  function releasePrecision(e){
    if(precisionPointer===null||(e&&e.pointerId!==precisionPointer))return;
    precisionPointer=null;precisionHeld=false;precisionButton.classList.remove('held');
  }
  precisionButton.addEventListener('pointerdown',e=>{
    e.preventDefault();precisionPointer=e.pointerId;precisionHeld=true;
    precisionButton.classList.add('held');
    try{precisionButton.setPointerCapture(e.pointerId);}catch(_){}
  });
  for(const event of ['pointerup','pointercancel'])precisionButton.addEventListener(event,releasePrecision);
  precisionButton.addEventListener('lostpointercapture',()=>releasePrecision());
  function cancelAllPointers(){
    for(const stop of [...heldPointers.values()])stop();
    lookStick.x=lookStick.y=0;
    precisionPointer=null;precisionHeld=false;
    keys.clear();joystick.x=joystick.y=0;
    precisionButton.classList.remove('held');
    cameraKnob.style.transform='';knob.style.transform='';
  }
  let drag=null;
  canvas.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'){drag={id:e.pointerId,x:e.clientX,y:e.clientY,moved:false,button:e.button};canvas.setPointerCapture(e.pointerId);}});
  canvas.addEventListener('pointermove',e=>{
    if(!drag||drag.id!==e.pointerId)return;
    const {x:dx,y:dy}=safePointerDelta(e.clientX-drag.x,e.clientY-drag.y);
    if(Math.abs(dx)+Math.abs(dy)>1)drag.moved=true;
    look(dx,dy,.006);
    drag.x=e.clientX;drag.y=e.clientY;
  });
  canvas.addEventListener('pointerup',e=>{if(drag&&drag.id===e.pointerId){if(!drag.moved)edit(drag.button===2?'place':'mine');drag=null;}});
  canvas.addEventListener('contextmenu',e=>e.preventDefault());
  document.addEventListener('keydown',e=>{
    // Do not steal arrows, space or WASD from accessibility controls and form fields.
    if(!isWorldControlTarget(e.target)||!help.hidden)return;
    if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();
    if(e.code==='Space'&&!e.repeat)jump();
    keys.add(e.code);
  });
  document.addEventListener('keyup',e=>keys.delete(e.code));
  window.addEventListener('blur',cancelAllPointers);
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){cancelAllPointers();if(mirrorEnabled&&pendingMirrors.size)flushMirror();}
    lastFrame=performance.now();
  });
  const lookModeSelect=document.getElementById('lookMode');
  lookModeSelect.value=lookMode;
  lookModeSelect.addEventListener('change',()=>{
    lookMode=selectedLookMode(lookModeSelect.value);
    lookStick.x=lookStick.y=0;cameraKnob.style.transform='';
    try{localStorage.setItem(LOOK_MODE_KEY,lookMode);}catch(_){}
  });
  const sensitivitySlider=document.getElementById('lookSensitivity');
  const sensitivityValue=document.getElementById('lookValue');
  function syncSensitivity(){
    sensitivitySlider.value=String(Math.round(sensitivity*100));
    sensitivityValue.textContent=Math.round(sensitivity*100)+'%';
  }
  syncSensitivity();
  sensitivitySlider.addEventListener('input',()=>{
    sensitivity=Math.max(.5,Math.min(1.8,Number(sensitivitySlider.value)/100));
    syncSensitivity();
    try{localStorage.setItem(CAMERA_PREF,String(Math.round(sensitivity*100)));}catch(_){}
  });
  document.getElementById('jump').onclick=jump;
  document.getElementById('dig').onclick=()=>edit('mine');
  document.getElementById('place').onclick=()=>edit('place');
  document.querySelectorAll('[data-block]').forEach(b=>b.onclick=()=>{
    selected=Number(b.dataset.block);
    document.querySelectorAll('[data-block]').forEach(q=>{q.classList.toggle('selected',q===b);q.setAttribute('aria-pressed',String(q===b));});
    message('Selected '+({3:'stone',4:'wood',5:'crystal'})[selected]);
  });
  document.getElementById('menu').onclick=()=>{cancelAllPointers();help.hidden=false;};
  document.getElementById('closeHelp').onclick=()=>{
    cancelAllPointers();help.hidden=true;
    // Return keyboard/gamepad-like input focus to world after closing modal.
    canvas.focus({preventScroll:true});
  };
  document.getElementById('save').onclick=()=>{if(save())message('World edits verified and saved');};
  // User-initiated diagnostics only; no world write, migration, auto-repair or
  // fabricated physical-device acceptance. On-screen report can be copied on iOS.
  const auditReport=document.getElementById('auditReport');
  const auditStatus=document.getElementById('auditStatus');
  document.getElementById('runAudit').onclick=async()=>{
    // Never show or copy an outdated report while a new asynchronous probe runs.
    auditReport.value='';
    auditStatus.textContent='Gathering read-only session measurements…';
    try{
      const left=document.querySelector('.left').getBoundingClientRect();
      const right=document.querySelector('.right').getBoundingClientRect();
      const view=canvas.getBoundingClientRect();
      const grips=gripClearance(left,right,view);
      let saved='unknown';
      if(storageReadOnly)saved='READ ONLY: damaged selected save preserved; no automatic repair';
      else if(changed)saved='UNSAVED world edits; export a backup';
      else try{
        const raw=localStorage.getItem(worldSlotKey(world.seed));
        if(raw===null)saved='No canonical save for this seed yet';
        else{
          const loaded=loadWorldSafe(localStorage,world.seed);
          const same=JSON.stringify(loaded.world.save())===JSON.stringify(world.save());
          saved=(same?'Current world matches stored edits':'MISMATCH: world edits differ')+
            '; source='+loaded.source;
        }
      }catch(err){saved='UNVERIFIED: '+String(err);}
      const probe=probeTemporaryStorage(localStorage,
        'mythwrought-v010-probe-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,11));
      let quota='not exposed by browser';
      try{
        const estimate=await navigator.storage?.estimate?.();
        if(estimate){
          const mb=n=>Number.isFinite(n)?(n/1048576).toFixed(1)+' MiB':'unknown';
          quota='usage '+mb(estimate.usage)+' / browser quota '+mb(estimate.quota)+' (eviction still possible)';
        }
      }catch(err){quota='unavailable: '+String(err);}
      const standalone=Boolean(navigator.standalone||matchMedia('(display-mode: standalone)').matches);
      auditReport.value=formatPreflightReport({
        stamp:new Date().toISOString(),agent:navigator.userAgent,
        dimensions:innerWidth+'×'+innerHeight+' CSS px, DPR '+(devicePixelRatio||1),
        homeScreen:standalone?'standalone reported, not independently confirmed':'browser or unknown',
        grips,frames:frameHistory.stats(),
        render:graphicsLost?'WebGL context lost':'WebGL2 active, '+chunks.size+' loaded GPU chunks; '+renderPreset+' '+canvas.width+'×'+canvas.height+' framebuffer pixels',
        save:saved,probe,quota
      });
      auditStatus.textContent='Report ready. Copy it for Gate A review; manual iPhone and art approval remain open.';
    }catch(err){auditStatus.textContent='Device check could not finish: '+String(err);}
  };
  document.getElementById('copyAudit').onclick=async()=>{
    if(!auditReport.value){auditStatus.textContent='Run the check before copying.';return;}
    try{
      if(!navigator.clipboard?.writeText)throw Error('Clipboard API unavailable');
      await navigator.clipboard.writeText(auditReport.value);
      auditStatus.textContent='Diagnostic text copied; no world edits were changed.';
    }catch(_){
      auditReport.focus();auditReport.select();
      auditStatus.textContent='Clipboard blocked; text selected for manual Copy.';
    }
  };
  // Optional Gate A snapshots live in IndexedDB; v0.02 localStorage remains
  // the canonical save. No startup migration or automatic destructive restore.
  const vaultSelect=document.getElementById('vaultSelect');
  const vaultStatus=document.getElementById('vaultStatus');
  const vaultLink=document.getElementById('vaultDownloadLink');
  const vaultButtons=[...document.querySelectorAll('.vault-settings button')];
  let vaultBusy=false,vaultObjectUrl=null;
  function clearVaultLink(){
    if(vaultObjectUrl){URL.revokeObjectURL(vaultObjectUrl);vaultObjectUrl=null;}
    vaultLink.hidden=true;vaultLink.removeAttribute('href');
  }
  function chosenVaultId(){
    const id=vaultSelect.value;
    if(!id)throw Error('Show device backups and select a snapshot first');
    return id;
  }
  async function useVault(action){
    if(vaultBusy)return;
    vaultBusy=true;vaultButtons.forEach(button=>button.disabled=true);
    vaultStatus.textContent='Checking on-device backup storage…';
    try{await action();}
    catch(error){vaultStatus.textContent='Device vault: '+String(error.message||error)+'. Live world unchanged unless explicitly stated.';}
    finally{vaultButtons.forEach(button=>button.disabled=false);vaultBusy=false;}
  }
  async function refreshVault(prefer=''){
    clearVaultLink();
    const records=await listVaultBackups();
    const selected=prefer||vaultSelect.value;
    vaultSelect.replaceChildren();
    const prompt=document.createElement('option');
    prompt.value='';prompt.textContent='Choose a device backup';vaultSelect.append(prompt);
    for(const record of records){
      const option=document.createElement('option');
      option.value=record.id;
      option.textContent=(record.valid?'✓ ':'⚠ DAMAGED · ')+
        'Seed '+(record.seed??'?')+' · '+String(record.createdAt).slice(0,16).replace('T',' ')+
        (record.valid?' · '+record.edits+' edits':' · cannot restore');
      vaultSelect.append(option);
    }
    if(records.some(record=>record.id===selected))vaultSelect.value=selected;
    vaultStatus.textContent=records.length+' device backups found; select one to prepare JSON or restore. No automatic migration.';
    return records;
  }
  vaultSelect.addEventListener('change',clearVaultLink);
  document.getElementById('vaultRefresh').onclick=()=>useVault(()=>refreshVault());
  document.getElementById('vaultBackup').onclick=()=>useVault(async()=>{
    if(storageReadOnly)throw Error('Current world is in protected read-only mode; select a healthy seed or import a backup');
    const capturedSeed=world.seed;
    const raw=JSON.stringify(world.save());
    const snapshot=await createVaultBackup(raw);
    if(capturedSeed!==snapshot.seed)throw Error('Snapshot seed mismatch');
    await refreshVault(snapshot.id);
    vaultStatus.textContent='Verified device backup for seed '+snapshot.seed+
      ' ('+snapshot.edits+' edits). This does NOT replace a downloadable JSON backup.';
  });
  document.getElementById('vaultPrepare').onclick=()=>useVault(async()=>{
    clearVaultLink();
    const snapshot=await inspectVaultBackup(chosenVaultId());
    // A second user tap on the actual link preserves Safari's download gesture.
    vaultObjectUrl=URL.createObjectURL(new Blob([snapshot.raw],{type:'application/json'}));
    vaultLink.href=vaultObjectUrl;
    vaultLink.download='mythwrought-vault-seed-'+snapshot.seed+'-'+snapshot.id.replace(/:/g,'-')+'.json';
    vaultLink.hidden=false;
    vaultStatus.textContent='Backup verified. Tap DOWNLOAD VERIFIED JSON BACKUP; use regular IMPORT to restore this file later.';
  });
  document.getElementById('vaultRestore').onclick=()=>useVault(async()=>{
    clearVaultLink();
    const activeSeed=world.seed;
    const snapshot=await inspectVaultBackup(chosenVaultId());
    const imported=importWorldData(snapshot.raw);
    // Always require approval, including when restoring a different seed.
    if(!window.confirm('RESTORE device backup for seed '+snapshot.seed+' with '+snapshot.edits+
      ' edits? The current saved world will be preserved in the previous-good slot where possible. Cancel changes nothing.')) {
      vaultStatus.textContent='Restore cancelled. Current world and backups unchanged.';return;
    }
    if(world.seed!==activeSeed)throw Error('Current world changed while restoring; retry');
    if(!storageReadOnly&&changed&&!save())throw Error('Current world has unsaved edits. Export it before restoring');
    let damaged=false;
    try{loadWorldSafe(localStorage,imported.seed);}catch(_){damaged=true;}
    const result=saveWorldSafe(localStorage,imported,{allowReplaceCorrupt:damaged});
    if(!result.ok)throw Error('Restore failed without replacing the active game: '+result.detail);
    for(const c of chunks.values())gl.deleteBuffer(c.buffer);
    chunks.clear();pending.clear();lastStreamingCenter='';wanted.clear();
    outlineKey='';outlineCount=0;lastEditMeshKeys=[];
    world=imported;storageReadOnly=false;changed=false;
    respawnPrototype();seedLabel.textContent='WORLD '+world.seed;
    document.getElementById('seedInput').value=String(world.seed);
    saveHealth.textContent='Restored a verified IndexedDB snapshot; original schema-1 live save confirmed.';
    message('Restored device backup for seed '+world.seed+' · '+snapshot.edits+' edits');
    vaultStatus.textContent='Restore complete. Export JSON for an independent off-device backup.';
    scheduleMirrorForWorld();
  });
  document.getElementById('vaultDelete').onclick=()=>useVault(async()=>{
    clearVaultLink();
    const id=chosenVaultId();
    const all=await listVaultBackups();
    const entry=all.find(item=>item.id===id);
    if(!entry)throw Error('Selected backup no longer exists');
    if(!window.confirm('Permanently DELETE only this device backup from seed '+(entry.seed??'?')+
      '? This cannot be undone. Your live world and other snapshots will not be touched.')){
      vaultStatus.textContent='Deletion cancelled. No backup changed.';return;
    }
    await deleteVaultBackup(id);
    const remaining=await refreshVault();
    vaultStatus.textContent='Selected snapshot deleted and verified; '+remaining.length+' backups remain. Live world unchanged.';
  });
  // Explicit opt-in. No existing seed is migrated, restored or mirrored on
  // startup. Only successful, read-back-verified canonical writes enqueue a
  // secondary copy, and only while the player has enabled this preference.
  const mirrorEnabledCheck=document.getElementById('mirrorEnabled');
  const mirrorButtons=[...document.querySelectorAll('.mirror-settings button')];
  let mirrorBusy=false;
  mirrorEnabledCheck.checked=mirrorEnabled;
  mirrorStatus.textContent=mirrorEnabled?
    'Mirroring enabled. New verified local saves will be copied after a short delay.':
    'Mirroring off. Existing backups can still be inspected or exported.';
  mirrorEnabledCheck.addEventListener('change',()=>{
    const requested=mirrorEnabledCheck.checked;
    try{
      // Refuse enabling before changing preferences when startup has protected
      // a damaged world; otherwise a reload could accidentally opt the user in.
      if(requested&&storageReadOnly)throw Error('Selected world is protected read-only; export or select a healthy seed first');
      localStorage.setItem(MIRROR_PREF,requested?'enabled':'disabled');
      if(localStorage.getItem(MIRROR_PREF)!==(requested?'enabled':'disabled'))
        throw Error('Preference read-back failed');
      mirrorEnabled=requested;
      if(!requested){
        if(mirrorTimer!==null){clearTimeout(mirrorTimer);mirrorTimer=null;}
        pendingMirrors.clear();
      }else scheduleMirrorForWorld();
      mirrorStatus.textContent=requested?
        'Mirroring enabled; existing snapshots are unchanged. Sync to verify the current seed.':
        'Mirroring disabled. Already committed copies remain; automatic future copies stopped.';
    }catch(error){
      mirrorEnabledCheck.checked=mirrorEnabled;
      mirrorStatus.textContent='Could not persist mirror preference: '+String(error)+'. Current setting unchanged.';
    }
  });
  async function withMirror(action){
    if(mirrorBusy)return;
    mirrorBusy=true;mirrorButtons.forEach(button=>button.disabled=true);
    clearMirrorDownload();
    mirrorStatus.textContent='Checking verified local saves and on-device mirror…';
    try{await action();}
    catch(error){mirrorStatus.textContent='Mirror operation refused: '+String(error.message||error)+
      '. Canonical saved world has not been replaced by this operation.';}
    finally{mirrorBusy=false;mirrorButtons.forEach(button=>button.disabled=false);}
  }
  document.getElementById('mirrorSync').onclick=()=>withMirror(async()=>{
    const raw=verifiedLiveBytes(),seed=world.seed;
    await settleMirrorWrites();
    const result=await queueMirror(seed,raw);
    mirrorStatus.textContent='Verified mirror synced for seed '+seed+' ('+result.edits+
      ' edits). Current and prior copies retained separately from live localStorage.';
  });
  document.getElementById('mirrorCheck').onclick=()=>withMirror(async()=>{
    await settleMirrorWrites();
    const state=await inspectMirror(world.seed);
    if(!state.exists){mirrorStatus.textContent='No device mirror for seed '+world.seed+'. Save and SYNC to make one.';return;}
    const summarize=(label,slot)=>label+': '+(slot===null?'absent':
      slot.valid?'verified, '+slot.edits+' edits, '+slot.createdAt:'DAMAGED ('+slot.error+')');
    mirrorStatus.textContent='Seed '+world.seed+' — '+
      summarize('latest',state.current)+'; '+summarize('previous',state.previous)+
      '. No restoration performed.';
  });
  mirrorSlot.addEventListener('change',clearMirrorDownload);
  document.getElementById('mirrorPrepare').onclick=()=>withMirror(async()=>{
    await settleMirrorWrites();
    const snap=await getMirrorCopy(world.seed,mirrorSlot.value);
    mirrorDownloadUrl=URL.createObjectURL(new Blob([snap.raw],{type:'application/json'}));
    mirrorDownload.href=mirrorDownloadUrl;
    mirrorDownload.download='mythwrought-mirror-seed-'+world.seed+'-'+mirrorSlot.value+'.json';
    mirrorDownload.hidden=false;
    mirrorStatus.textContent='Verified '+mirrorSlot.value+' copy. Tap the separate DOWNLOAD link to export this original schema-1 JSON file.';
  });
  document.getElementById('mirrorRestore').onclick=()=>withMirror(async()=>{
    if(storageReadOnly)throw Error('Read-only startup protection active; use the regular IMPORT flow to repair damaged saved bytes');
    await settleMirrorWrites(); // Never let an older queued write race a restore.
    const seed=world.seed,which=mirrorSlot.value;
    const snap=await getMirrorCopy(seed,which);
    const restored=importWorldData(snap.raw);
    if(restored.seed!==seed)throw Error('Mirror seed does not match the active world');
    if(!window.confirm('RESTORE the '+which+' verified mirror of seed '+seed+
      ' with '+snap.edits+' edits? The current primary will be kept in the previous-good local backup. Cancel changes nothing.')){
      mirrorStatus.textContent='Restore cancelled. No world or mirror copy changed.';return;
    }
    if(world.seed!==seed||changed)throw Error('World changed or contains unsaved edits; export or SAVE before restoring');
    const out=saveWorldSafe(localStorage,restored);
    if(!out.ok)throw Error('Canonical world restore failed; '+out.detail);
    for(const c of chunks.values())gl.deleteBuffer(c.buffer);
    chunks.clear();pending.clear();lastStreamingCenter='';wanted.clear();
    outlineKey='';outlineCount=0;lastEditMeshKeys=[];
    world=restored;changed=false;respawnPrototype();
    seedLabel.textContent='WORLD '+seed;
    saveHealth.textContent='Verified mirror restored to original schema-1 canonical storage; previous-good backup retained.';
    message('Restored '+which+' device mirror · '+snap.edits+' edits · saved');
    scheduleMirrorForWorld();
    mirrorStatus.textContent='Restore verified for seed '+seed+'. Export JSON for storage outside the browser.';
  });
  const seedInput=document.getElementById('seedInput'),seedMessage=document.getElementById('seedMessage');
  seedInput.value=String(world.seed);
  document.getElementById('switchWorld').onclick=()=>{
    try{
      const next=worldSeedFromText(seedInput.value);
      if(next===world.seed&&!storageReadOnly){seedMessage.textContent='Already exploring this seed.';return;}
      if(!storageReadOnly&&!save())throw Error('Current world is not verified saved. Export before switching.');
      const candidate=loadWorld(next);
      const result=saveWorldSafe(localStorage,candidate);
      if(!result.ok)throw Error(result.reason);
      for(const c of chunks.values())gl.deleteBuffer(c.buffer);
      chunks.clear();pending.clear();lastStreamingCenter='';wanted.clear();
      outlineKey='';outlineCount=0;lastEditMeshKeys=[];
      world=candidate;storageReadOnly=false;changed=false;respawnPrototype();
      seedLabel.textContent='WORLD '+world.seed;seedInput.value=String(world.seed);
      saveHealth.textContent='Verified separate seed '+world.seed+'; other world slots preserved.';
      seedMessage.textContent='World '+world.seed+' loaded safely. Other seeds remain separate.';
      message('Loaded seed '+world.seed+' with saved world edits');
      scheduleMirrorForWorld();
    }catch(err){seedMessage.textContent='World not changed: '+err.message;}
  };
  document.getElementById('export').onclick=()=>{
    try{
      const data=JSON.stringify(world.save(),null,2);
      importWorldData(data); // Ensure the export is a valid original schema-1 file.
      const blob=new Blob([data],{type:'application/json'});
      const url=URL.createObjectURL(blob),a=document.createElement('a');
      a.href=url;a.download='mythwrought-seed-'+world.seed+'-prototype.json';
      document.body.appendChild(a);a.click();a.remove();
      setTimeout(()=>URL.revokeObjectURL(url),3000);
      message('Exported verified world backup · '+saveFingerprint(data));
    }catch(err){message('Export failed: '+err.message);}
  };
  document.getElementById('import').onclick=()=>document.getElementById('importFile').click();
  document.getElementById('importFile').addEventListener('change',async e=>{
    const f=e.target.files?.[0];if(!f)return;
    try{
      if(f.size>MAX_IMPORT_BYTES)throw Error('Backup file is too large');
      const imported=importWorldData(await f.text()); // Validate before mutation.
      if(!storageReadOnly&&!save())throw Error('Current world could not be verified saved; export first.');
      let existing=null,damaged=false;
      try{existing=loadWorldSafe(localStorage,imported.seed).world;}
      catch(_){damaged=true;}
      const conflict=existing&&JSON.stringify(existing.save())!==JSON.stringify(imported.save())&&
        (existing.edits.size>0||imported.seed===world.seed);
      if((damaged||conflict)&&!window.confirm(
        'Replace saved edits for seed '+imported.seed+'? The previous data will be preserved in the local backup slot. Cancel leaves the current world unchanged.'
      )){
        message('Import cancelled; existing world unchanged');return;
      }
      const outcome=saveWorldSafe(localStorage,imported,{allowReplaceCorrupt:damaged});
      if(!outcome.ok)throw Error(outcome.reason);
      world=imported;storageReadOnly=false;changed=false;
      for(const c of chunks.values())gl.deleteBuffer(c.buffer);
      chunks.clear();pending.clear();lastStreamingCenter='';wanted.clear();
      outlineKey='';outlineCount=0;lastEditMeshKeys=[];
      respawnPrototype();seedLabel.textContent='WORLD '+world.seed;
      seedInput.value=String(world.seed);
      saveHealth.textContent='Imported verified schema-1 world with previous data preserved.';
      message('Imported world safely · '+world.edits.size+' block edit deltas');
      scheduleMirrorForWorld();
    }catch(err){message('Import rejected; existing world unchanged: '+err.message);}
    finally{e.target.value='';}
  });
  let graphicsLost=false;
  canvas.addEventListener('webglcontextlost',e=>{
    e.preventDefault();graphicsLost=true;cancelAllPointers();
    fatal('Graphics context lost. Reload to resume saved terrain edits.');
  });
  canvas.addEventListener('webglcontextrestored',()=>{
    fatal('Graphics restarted. Reload to rebuild shaders and saved terrain safely.');
  });
  window.addEventListener('pagehide',()=>{
    cancelAllPointers();
    // Do not rewrite valid/externally damaged saves on an ordinary reload.
    // Actual edits already save synchronously; only retry if still dirty.
    if(changed&&!storageReadOnly)save();
    // Best effort only: Safari may terminate pending IndexedDB transactions.
    // Already-verified localStorage remains authoritative on force quit.
    if(mirrorEnabled&&pendingMirrors.size)flushMirror();
  });
  if(['localhost','127.0.0.1'].includes(location.hostname)){
    // Local-only regression interface; absent from the public Pages runtime.
    window.__mythwroughtTest=Object.freeze({
      teleport(x,z){
        if(![x,z].every(Number.isFinite))throw Error('Invalid debug position');
        const pos=findSafeSpawn(world,x,z);
        Object.assign(player,pos,{vX:0,vZ:0,vY:0,onGround:true});
        jumpQueued=false;
        return {...pos};
      },
      aimAt(x,y,z){
        const dx=x+.5-player.x,dy=y+.5-(player.feet+1.55),dz=z+.5-player.z;
        player.yaw=Math.atan2(dx,dz);
        player.pitch=Math.atan2(dy,Math.hypot(dx,dz));
      },
      block(x,y,z){return world.get(x,y,z);},
      setOrientation(yaw,pitch){
        if(![yaw,pitch].every(Number.isFinite))throw Error('Invalid debug camera orientation');
        player.yaw=yaw;player.pitch=Math.max(-1.3,Math.min(1.3,pitch));
      },
      placeFixture(x,y,z,id){
        const old=world.get(x,y,z);
        if(!world.set(x,y,z,id))throw Error('Invalid test block');
        try{refreshEditedMeshes(x,z);}catch(err){world.set(x,y,z,old);throw err;}
        save();
      },
      snapshot(){return {chunks:[...chunks.keys()],pending:[...pending.keys()],
        lastEditMeshKeys:[...lastEditMeshKeys],editMeshBatches,seed:world.seed};}
    });
  }
  saveHealth.textContent=storageReadOnly?
    'READ ONLY: damaged world data preserved; import or select another seed.':
    'Schema-1 saved edits; checksum journal and verified previous-world backup.';
  message(recoveryNote||'Move, look, mine and place · ☰ for help');
  requestAnimationFrame(draw);
}
