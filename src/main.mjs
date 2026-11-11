import {VoxelWorld,BLOCK,CHUNK_SIZE,chunkCoord,terrainHeight,meshChunk,raycast,collides} from './voxel.mjs';

const canvas=document.getElementById('scene');
const notice=document.getElementById('notice');
const status=document.getElementById('status');
const compass=document.getElementById('compass');
const seedLabel=document.getElementById('seed');
const help=document.getElementById('help');
const SAVE_KEY='mythwrought-v001-world';
const gl=canvas.getContext('webgl2',{alpha:false,antialias:false,depth:true,powerPreference:'high-performance'});
function message(s){status.textContent=s;}
function fatal(s){notice.hidden=false;notice.textContent=s;message('3D renderer unavailable');}
if(!gl)fatal('This browser does not provide WebGL2. A compatible iPhone or desktop browser is required.');
else start();

function start(){
  let world;
  try{const s=localStorage.getItem(SAVE_KEY);world=s?VoxelWorld.restore(JSON.parse(s)):new VoxelWorld(179);}
  catch(e){world=new VoxelWorld(179);message('Save unavailable; beginning a fresh prototype world');}
  seedLabel.textContent='WORLD '+String(world.seed).padStart(4,'0');
  const VS=[
    '#version 300 es','precision highp float;',
    'in vec3 aPos; in vec3 aColor;',
    'uniform vec3 uEye,uForward,uRight,uUp;',
    'uniform float uAspect,uTan;',
    'out vec3 vColor; out float vDistance;',
    'void main(){ vec3 d=aPos-uEye;',
    'float x=dot(d,uRight); float y=dot(d,uUp); float z=dot(d,uForward);',
    'gl_Position=vec4(x/(uAspect*uTan),y/uTan,1.0015*z-0.1501,z);',
    'vColor=aColor; vDistance=length(d); }'
  ].join('\n');
  const FS=[
    '#version 300 es','precision highp float;',
    'in vec3 vColor; in float vDistance; out vec4 outColor;',
    'uniform vec3 uFog;',
    'void main(){ float fog=smoothstep(29.0,68.0,vDistance);',
    'outColor=vec4(mix(vColor,uFog,fog),1.0); }'
  ].join('\n');
  function shader(type,src){
    const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);
    if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));
    return s;
  }
  let program;
  try{
    program=gl.createProgram();
    gl.attachShader(program,shader(gl.VERTEX_SHADER,VS));
    gl.attachShader(program,shader(gl.FRAGMENT_SHADER,FS));
    gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));
  }catch(err){fatal('Voxel shader failed to initialize: '+err.message);return;}
  gl.useProgram(program);
  const atPos=gl.getAttribLocation(program,'aPos'),atColor=gl.getAttribLocation(program,'aColor');
  gl.enableVertexAttribArray(atPos);gl.enableVertexAttribArray(atColor);
  const U={};
  for(const k of ['uEye','uForward','uRight','uUp','uAspect','uTan','uFog'])U[k]=gl.getUniformLocation(program,k);
  gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.disable(gl.CULL_FACE);

  let selected=BLOCK.STONE;
  const chunks=new Map(),pending=new Map();
  const name=(x,z)=>x+','+z;
  const player={x:.5,z:.5,feet:terrainHeight(0,0,world.seed)+1.02,yaw:Math.PI,pitch:-.12,vY:0,onGround:false};
  const keys=new Set(),joystick={x:0,y:0};
  let frame=0,lastFrame=performance.now(),changed=false;
  const eye=()=>[player.x,player.feet+1.55,player.z];
  const facing=()=>[Math.sin(player.yaw)*Math.cos(player.pitch),Math.sin(player.pitch),Math.cos(player.yaw)*Math.cos(player.pitch)];
  function save(){
    try{localStorage.setItem(SAVE_KEY,JSON.stringify(world.save()));changed=false;}
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
    const cx=chunkCoord(player.x),cz=chunkCoord(player.z),needed=[];
    for(let dz=-2;dz<=2;dz++)for(let dx=-2;dx<=2;dx++){
      const x=cx+dx,z=cz+dz,k=name(x,z);
      if(!chunks.has(k)&&!pending.has(k))needed.push([x,z,dx*dx+dz*dz]);
    }
    needed.sort((a,b)=>a[2]-b[2]);
    for(const [x,z] of needed)pending.set(name(x,z),[x,z]);
    for(const [k,[x,z]] of pending){
      pending.delete(k);
      if(Math.abs(cx-x)>2||Math.abs(cz-z)>2)continue;
      const old=chunks.get(k);if(old)gl.deleteBuffer(old.buffer);
      const data=meshChunk(world,x,z),buffer=gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);
      chunks.set(k,{x,z,buffer,count:data.length/6});
      break; // only one chunk meshed/uploaded per frame
    }
    if(frame%90===0)for(const [k,c] of chunks)
      if(Math.abs(c.x-cx)>2||Math.abs(c.z-cz)>2){gl.deleteBuffer(c.buffer);chunks.delete(k);}
  }
  function respawnPrototype(){
    player.x=.5;player.z=.5;player.feet=terrainHeight(0,0,world.seed)+1.02;player.vY=0;
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
    if(keys.has('ArrowLeft'))player.yaw-=dt*1.9;
    if(keys.has('ArrowRight'))player.yaw+=dt*1.9;
    if(keys.has('ArrowUp'))player.pitch=Math.min(1.3,player.pitch+dt*1.6);
    if(keys.has('ArrowDown'))player.pitch=Math.max(-1.3,player.pitch-dt*1.6);
    if(player.feet<-15)respawnPrototype();
  }
  function draw(now){
    const dt=Math.min(.035,Math.max(0,(now-lastFrame)/1000));lastFrame=now;
    if(!document.hidden){
      frame++;if(help.hidden)move(dt);
      const w=Math.max(1,Math.floor(canvas.clientWidth*Math.min(devicePixelRatio||1,1.5)));
      const h=Math.max(1,Math.floor(canvas.clientHeight*Math.min(devicePixelRatio||1,1.5)));
      if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);}
      gl.clearColor(.52,.69,.72,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
      gl.useProgram(program);
      gl.uniform3fv(U.uEye,eye());
      gl.uniform3fv(U.uForward,facing());
      gl.uniform3fv(U.uRight,[-Math.cos(player.yaw),0,Math.sin(player.yaw)]);
      gl.uniform3fv(U.uUp,[-Math.sin(player.pitch)*Math.sin(player.yaw),Math.cos(player.pitch),-Math.sin(player.pitch)*Math.cos(player.yaw)]);
      gl.uniform1f(U.uAspect,w/h);
      gl.uniform1f(U.uTan,Math.tan(72*Math.PI/360));
      gl.uniform3f(U.uFog,.52,.69,.72);
      stream();
      for(const c of chunks.values()){
        gl.bindBuffer(gl.ARRAY_BUFFER,c.buffer);
        gl.vertexAttribPointer(atPos,3,gl.FLOAT,false,24,0);
        gl.vertexAttribPointer(atColor,3,gl.FLOAT,false,24,12);
        gl.drawArrays(gl.TRIANGLES,0,c.count);
      }
      const deg=(540-player.yaw*180/Math.PI)%360;
      compass.textContent=['N','NE','E','SE','S','SW','W','NW'][Math.round(deg/45)%8]+' · '+String(Math.round(deg)).padStart(3,'0')+'°';
    }
    requestAnimationFrame(draw);
  }
  function pointerPad(el,update,release){
    let id=null,lx=0,ly=0;
    el.addEventListener('pointerdown',e=>{e.preventDefault();id=e.pointerId;lx=e.clientX;ly=e.clientY;el.setPointerCapture(id);update(e,0,0,true);});
    el.addEventListener('pointermove',e=>{if(e.pointerId!==id)return;e.preventDefault();const dx=e.clientX-lx,dy=e.clientY-ly;lx=e.clientX;ly=e.clientY;update(e,dx,dy,false);});
    const finish=e=>{if(id===e.pointerId){id=null;release();}};
    el.addEventListener('pointerup',finish);el.addEventListener('pointercancel',finish);el.addEventListener('lostpointercapture',()=>{id=null;release();});
  }
  const movementPad=document.getElementById('movePad'),knob=document.getElementById('moveKnob');
  pointerPad(movementPad,e=>{
    const r=movementPad.getBoundingClientRect();
    joystick.x=Math.max(-1,Math.min(1,(e.clientX-r.left-r.width/2)/(r.width*.35)));
    joystick.y=Math.max(-1,Math.min(1,(e.clientY-r.top-r.height/2)/(r.height*.35)));
    knob.style.transform='translate('+joystick.x*23+'px,'+joystick.y*23+'px)';
  },()=>{joystick.x=joystick.y=0;knob.style.transform='';});
  pointerPad(document.getElementById('lookPad'),(_e,dx,dy,initial)=>{
    if(initial)return;
    player.yaw+=dx*.008;player.pitch=Math.max(-1.3,Math.min(1.3,player.pitch-dy*.008));
  },()=>{});
  let drag=null;
  canvas.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'){drag={id:e.pointerId,x:e.clientX,y:e.clientY,moved:false,button:e.button};canvas.setPointerCapture(e.pointerId);}});
  canvas.addEventListener('pointermove',e=>{
    if(!drag||drag.id!==e.pointerId)return;
    const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
    if(Math.abs(dx)+Math.abs(dy)>1)drag.moved=true;
    player.yaw+=dx*.006;player.pitch=Math.max(-1.3,Math.min(1.3,player.pitch-dy*.006));
    drag.x=e.clientX;drag.y=e.clientY;
  });
  canvas.addEventListener('pointerup',e=>{if(drag&&drag.id===e.pointerId){if(!drag.moved)edit(drag.button===2?'place':'mine');drag=null;}});
  canvas.addEventListener('contextmenu',e=>e.preventDefault());
  document.addEventListener('keydown',e=>{if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();if(e.code==='Space'&&!e.repeat)jump();keys.add(e.code);});
  document.addEventListener('keyup',e=>keys.delete(e.code));
  window.addEventListener('blur',()=>{keys.clear();joystick.x=joystick.y=0;});
  document.getElementById('jump').onclick=jump;
  document.getElementById('dig').onclick=()=>edit('mine');
  document.getElementById('place').onclick=()=>edit('place');
  document.querySelectorAll('[data-block]').forEach(b=>b.onclick=()=>{
    selected=Number(b.dataset.block);
    document.querySelectorAll('[data-block]').forEach(q=>{q.classList.toggle('selected',q===b);q.setAttribute('aria-pressed',String(q===b));});
    message('Selected '+({3:'stone',4:'wood',5:'crystal'})[selected]);
  });
  document.getElementById('menu').onclick=()=>{help.hidden=false;keys.clear();};
  document.getElementById('closeHelp').onclick=()=>help.hidden=true;
  document.getElementById('save').onclick=()=>{save();message('Local world edits saved');};
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
      world=VoxelWorld.restore(JSON.parse(await f.text()));
      for(const c of chunks.values())gl.deleteBuffer(c.buffer);
      chunks.clear();pending.clear();respawnPrototype();seedLabel.textContent='WORLD '+String(world.seed).padStart(4,'0');
      save();message('Imported voxel world');
    }catch(err){message('Import rejected: '+err.message);}
    e.target.value='';
  });
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();fatal('Graphics context lost. Reload to resume saved terrain edits.');});
  window.addEventListener('pagehide',save);
  message('Move, look, mine and place · ☰ for help');
  requestAnimationFrame(draw);
}
