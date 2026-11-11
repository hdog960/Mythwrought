import {VoxelWorld,BLOCK,chunkCoord,chunkWindow,terrainHeight,meshChunk,raycast,outlineVertices,collides} from './voxel.mjs';
import {DEFAULT_WORLD_SEED,SELECTED_SEED_KEY,LEGACY_WORLD_KEY,worldSeedFromText,worldSlotKey} from './seeds.mjs';
import {SKY_VERTEX_SHADER,SKY_FRAGMENT_SHADER,DISTANCE_FOG_COLOR} from './sky.mjs';
import {clampLook,forwardVector,compassDegrees} from './camera.mjs';
import {normalizedStick,safePointerDelta,stickLookDelta,selectedLookMode,isWorldControlTarget} from './input.mjs';
import {calculateGripWidth,normalizeControlSize} from './layout.mjs';

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
  let world;
  function loadWorld(seed){
    let raw=localStorage.getItem(worldSlotKey(seed));
    if(raw===null&&seed===DEFAULT_WORLD_SEED)raw=localStorage.getItem(LEGACY_WORLD_KEY);
    if(raw===null)return new VoxelWorld(seed);
    const found=VoxelWorld.restore(JSON.parse(raw));
    if(found.seed!==seed)throw Error('Save seed does not match requested world');
    return found;
  }
  try{
    const choice=localStorage.getItem(SELECTED_SEED_KEY);
    world=loadWorld(choice===null?DEFAULT_WORLD_SEED:worldSeedFromText(choice));
  }catch(err){world=new VoxelWorld(DEFAULT_WORLD_SEED);message('Saved data unavailable; no old saves were deleted');}
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
    'if(vMat==3)shade*=.94+.10*speckle(floor(vUv*vec2(7.0,13.0))+3.0);',
    'if(vMat==4)shade*=.96+.07*sin(vUv.x*56.0);',
    'if(vMat==5)shade*=.98+.12*step(.65,fract(vUv.x*3.0+vUv.y*2.0));',
    'float fog=smoothstep(29.0,68.0,vDistance);',
    'vec3 colored=mix(vColor,vColor*shade,closeDetail*.8);',
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
  const chunks=new Map(),pending=new Map();
  const name=(x,z)=>x+','+z;
  const player={x:.5,z:.5,feet:terrainHeight(0,0,world.seed)+1.02,yaw:Math.PI,pitch:-.12,vY:0,onGround:false};
  const keys=new Set(),joystick={x:0,y:0},lookStick={x:0,y:0};
  const heldPointers=new Map();
  let precisionHeld=false;
  let frame=0,lastFrame=performance.now(),changed=false;
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
  function save(){
    try{localStorage.setItem(worldSlotKey(world.seed),JSON.stringify(world.save()));localStorage.setItem(SELECTED_SEED_KEY,String(world.seed));changed=false;}
    catch(err){message('Local save failed — export from the menu');}
  }
  function invalidate(x,z){
    const cx=chunkCoord(x),cz=chunkCoord(z);
    for(const [dx,dz] of [[0,0],[1,0],[-1,0],[0,1],[0,-1]])pending.set(name(cx+dx,cz+dz),[cx+dx,cz+dz]);
  }
  function edit(mode){
    const target=raycast(world,eye(),facing(),6);
    if(!target){message('Look at a nearby block');return;}
    const p=mode==='mine'?target.hit:target.adjacent;
    if(!p){message('No free space for placement');return;}
    const [x,y,z]=p,old=world.get(x,y,z);
    if(mode==='place'&&old!==BLOCK.AIR)return;
    if(mode==='mine'&&old===BLOCK.AIR)return;
    if(!world.set(x,y,z,mode==='mine'?BLOCK.AIR:selected)){message('Outside editable prototype height');return;}
    if(mode==='place'&&collides(world,player.x,player.feet,player.z)){
      world.set(x,y,z,old);message('Cannot place a block inside the player');return;
    }
    invalidate(x,z);changed=true;save();message(mode==='mine'?'Block removed and saved':'Block placed and saved');
  }
  function stream(){
    const desired=chunkWindow(player.x,player.z,2);
    const wanted=new Set(desired.map(c=>name(c.cx,c.cz)));
    // Discard stale pending meshes after fast travel across chunk boundaries.
    for(const k of pending.keys())if(!wanted.has(k))pending.delete(k);
    for(const c of desired){
      const k=name(c.cx,c.cz);
      if(!chunks.has(k)&&!pending.has(k))pending.set(k,[c.cx,c.cz]);
    }
    // Edit invalidations and new chunks are prioritized by proximity every frame.
    const cx=chunkCoord(player.x),cz=chunkCoord(player.z);
    const queue=[...pending.entries()].sort((a,b)=>{
      const da=(a[1][0]-cx)**2+(a[1][1]-cz)**2;
      const db=(b[1][0]-cx)**2+(b[1][1]-cz)**2;
      return da-db;
    });
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
    player.x=.5;player.z=.5;player.feet=terrainHeight(0,0,world.seed)+1.02;player.vY=0;player.yaw=Math.PI;player.pitch=-.12;
    message('Returned to spawn (temporary prototype safety reset)');
  }
  function jump(){if(player.onGround){player.vY=6.6;player.onGround=false;}}
  function move(dt){
    let strafe=(keys.has('KeyD')?1:0)-(keys.has('KeyA')?1:0)+joystick.x;
    let forward=(keys.has('KeyW')?1:0)-(keys.has('KeyS')?1:0)-joystick.y;
    const len=Math.hypot(strafe,forward);
    if(len>1){strafe/=len;forward/=len;}
    const dx=(Math.sin(player.yaw)*forward+Math.cos(player.yaw)*strafe)*dt*4.25;
    const dz=(Math.cos(player.yaw)*forward-Math.sin(player.yaw)*strafe)*dt*4.25;
    function axis(axis,n){
      if(!n)return;
      const x=player.x+(axis==='x'?n:0),z=player.z+(axis==='z'?n:0);
      if(!collides(world,x,player.feet,z)){player[axis]=axis==='x'?x:z;return;}
      if(player.onGround&&!collides(world,x,player.feet+1.01,z)){
        player.feet+=1.01;player[axis]=axis==='x'?x:z;player.onGround=false;
      }
    }
    axis('x',dx);axis('z',dz);
    player.onGround=collides(world,player.x,player.feet-.12,player.z);
    player.vY-=18*dt;
    const next=player.feet+player.vY*dt;
    if(collides(world,player.x,next,player.z)){
      if(player.vY<0){
        let low=next,high=player.feet;
        for(let i=0;i<10;i++){const mid=(low+high)/2;if(collides(world,player.x,mid,player.z))low=mid;else high=mid;}
        player.feet=high;player.onGround=true;
      }
      player.vY=0;
    }else{player.feet=next;player.onGround=false;}
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
    if(!document.hidden&&!graphicsLost){
      frame++;if(help.hidden)move(dt);
      const w=Math.max(1,Math.floor(canvas.clientWidth*Math.min(devicePixelRatio||1,1.5)));
      const h=Math.max(1,Math.floor(canvas.clientHeight*Math.min(devicePixelRatio||1,1.5)));
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
      canvas.dataset.loadedChunks=String(chunks.size); // Read-only diagnostic for real browser chunk completion.
      for(const c of chunks.values()){
        gl.bindBuffer(gl.ARRAY_BUFFER,c.buffer);
        gl.vertexAttribPointer(atPos,3,gl.FLOAT,false,36,0);
        gl.vertexAttribPointer(atColor,3,gl.FLOAT,false,36,12);
        gl.vertexAttribPointer(atUv,2,gl.FLOAT,false,36,24);
        gl.vertexAttribPointer(atMat,1,gl.FLOAT,false,36,32);
        gl.drawArrays(gl.TRIANGLES,0,c.count);
      }
      // A faint world-space targeted-block outline, never a HUD covering the scene.
      const focused=help.hidden?raycast(world,eye(),facing(),6):null;
      const focusKey=focused?focused.hit.join(','):'';
      canvas.dataset.targetBlock=focusKey;
      if(focusKey!==outlineKey){
        outlineKey=focusKey;
        const data=focused?outlineVertices(focused.hit):new Float32Array();
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
    joystick.x=next.x;joystick.y=next.y;
    const travel=Math.max(0,(movementPad.clientWidth-knob.offsetWidth)/2-7);
    knob.style.transform='translate('+Math.round(next.x*travel)+'px,'+Math.round(next.y*travel)+'px)';
  },()=>{joystick.x=joystick.y=0;knob.style.transform='';});
  pointerPad(cameraPad,(e,dx,dy,initial)=>{
    if(!help.hidden)return;
    if(lookMode==='stick'){
      const p=padPosition(cameraPad,e);
      const next=normalizedStick(p.x,p.y,p.radius,.1);
      lookStick.x=next.x;lookStick.y=next.y;
      const travel=Math.max(0,(cameraPad.clientWidth-cameraKnob.offsetWidth)/2-7);
      cameraKnob.style.transform='translate('+Math.round(next.x*travel)+'px,'+Math.round(next.y*travel)+'px)';
    }else if(!initial){
      const d=safePointerDelta(dx,dy);
      look(d.x,d.y);
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
    if(document.hidden)cancelAllPointers();
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
  document.getElementById('save').onclick=()=>{save();message('Local world edits saved');};
  const seedInput=document.getElementById('seedInput'),seedMessage=document.getElementById('seedMessage');
  seedInput.value=String(world.seed);
  document.getElementById('switchWorld').onclick=()=>{
    try{
      const next=worldSeedFromText(seedInput.value);
      if(next===world.seed){seedMessage.textContent='Already exploring this seed.';return;}
      save();
      const candidate=loadWorld(next); // Validate before changing the active world.
      for(const c of chunks.values())gl.deleteBuffer(c.buffer);
      chunks.clear();pending.clear();outlineKey='';outlineCount=0;world=candidate;respawnPrototype();
      seedLabel.textContent='WORLD '+world.seed;seedInput.value=String(world.seed);
      save();seedMessage.textContent='World '+world.seed+' ready. Other seed saves remain separate.';
      message('Loaded seed '+world.seed+' — building nearby chunks');
    }catch(err){seedMessage.textContent='World not changed: '+err.message;}
  };
  document.getElementById('export').onclick=()=>{
    const blob=new Blob([JSON.stringify(world.save(),null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download='mythwrought-seed-'+world.seed+'-prototype.json';document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),3000);message('Exported world edit backup');
  };
  document.getElementById('import').onclick=()=>document.getElementById('importFile').click();
  document.getElementById('importFile').addEventListener('change',async e=>{
    const f=e.target.files?.[0];if(!f)return;
    try{
      const imported=VoxelWorld.restore(JSON.parse(await f.text()));
      save(); // Keep the previously active world's slot before replacing.
      world=imported;
      for(const c of chunks.values())gl.deleteBuffer(c.buffer);
      chunks.clear();pending.clear();outlineKey='';outlineCount=0;respawnPrototype();seedLabel.textContent='WORLD '+world.seed;seedInput.value=String(world.seed);
      save();message('Imported voxel world');
    }catch(err){message('Import rejected: '+err.message);}
    e.target.value='';
  });
  let graphicsLost=false;
  canvas.addEventListener('webglcontextlost',e=>{
    e.preventDefault();graphicsLost=true;cancelAllPointers();
    fatal('Graphics context lost. Reload to resume saved terrain edits.');
  });
  canvas.addEventListener('webglcontextrestored',()=>{
    fatal('Graphics restarted. Reload to rebuild shaders and saved terrain safely.');
  });
  window.addEventListener('pagehide',()=>{cancelAllPointers();save();});
  message('Move, look, mine and place · ☰ for help');
  requestAnimationFrame(draw);
}
