import {VoxelWorld,BLOCK,BODY_RADIUS,BODY_HEIGHT,chunkCoord,chunkWindow,terrainHeight,meshChunk,raycast,outlineVertices,collides} from './voxel.mjs';
import {WORLD_MIN_Y,WORLD_MAX_Y,sectionForY,sectionWindow,surfaceOpeningNearby,sectionChunkRadius,verticalEditSections,depthMeshKey} from './depth.mjs';
import {meshDepthSection} from './depth-mesh.mjs';
import {DEFAULT_WORLD_SEED,SELECTED_SEED_KEY,LEGACY_WORLD_KEY,worldSeedFromText,worldSlotKey} from './seeds.mjs';
import {SKY_VERTEX_SHADER,SKY_FRAGMENT_SHADER,DISTANCE_FOG_COLOR} from './sky.mjs';
import {STORYBOOK_MATERIAL_FRAGMENT_SHADER} from './storybook-materials.mjs';
import {clampLook,forwardVector,compassDegrees,MAX_PITCH} from './camera.mjs';
import {normalizedStick,safePointerDelta,stickLookDelta,selectedLookMode,isWorldControlTarget,touchMovementX,touchCameraX} from './input.mjs';
import {chunkKey,editAffectedChunks} from './chunks.mjs';
import {calculateGripWidth,normalizeControlSize} from './layout.mjs';
import {newPlayer,stepPlayer,findSafeSpawn} from './physics.mjs';
import {applyBlockAction,inspectBlockTarget,BLOCK_NAMES} from './blocks.mjs';
import {BIOME130_REGISTERED_IDS,biome130Block} from './biome130-registry.mjs';
import {Pack2LiveWorld,loadPack2LiveWorld,savePack2LiveWorld,pack2ExportBundle,pack2ImportBundle} from './pack2-world.mjs';
import {PACK2_LIVE_IDS,PACK2_LIVE_NAMES,isPack2LiveId,pack2IsHinged,
  pack2NormalizeState,pack2CycleState,pack2WaterSectionVertices,
  pack2BodyIntersects} from './pack2-integration.mjs';
import {recordWorldEditFeedback,sampleWorldEditFeedback} from './edit-feedback.mjs';
import {naturalCaveCorridor,updateCaveDiscovery} from './exploration-cues.mjs';
import {loadWorldSafe,saveWorldSafe,importWorldData,saveFingerprint,MAX_IMPORT_BYTES} from './persistence.mjs';
import {FrameHistory,gripClearance,probeTemporaryStorage,formatPreflightReport} from './preflight.mjs';
import {ForegroundFrameDriver,MeshFrameCadence} from './foreground.mjs';
import {GpuUploadRetry,uploadChunkBuffer} from './gpu-recovery.mjs';
import {buildGpuPipeline} from './gpu-pipeline.mjs';
import {createVaultBackup,listVaultBackups,inspectVaultBackup,deleteVaultBackup} from './vault.mjs';
import {MIRROR_PREF,MirrorWriteQueue,inspectMirror,getMirrorCopy} from './mirror.mjs';
import {normalizeRenderPreset,bufferDimensions,RENDER_PREF} from './render-budget.mjs';
import {installExplorationMap} from './exploration-map.mjs';
import {createG2FlightState,armG2Flight,selectG2FlightProfile,planG2FlightStep,
  holdG2Flight} from './creative-integration/g2-flight.mjs';
import {createG2ControlState,enterG2ControlOwnership,dispatchG2Control,
  clearG2Controls,resumeG2Controls,readG2ControlIntent,
  releaseG2ControlOwnership} from './creative-integration/g2-control-state.mjs';
import {inspectG2Landing,commitG2Landing} from './creative-integration/g2-landing.mjs';
import {MANUAL_FIVE_PACK_CATALOG,resolveManualFivePackAsset} from './builder-assets/manual-five-pack.mjs';
import {createManual14SavedBridge} from './builder-assets/manual14-layer.mjs';
import {meshManual14Chunk} from './builder-assets/manual14-mesh.mjs';
import {createManualFivePackLiveBuilder} from './builder-assets/manual-five-pack-live.mjs';
import {createPack3LiveBridge,combinePack3ChunkMesh,isPack3BlockId} from './builder-assets/pack3-live.mjs';
import {installPack3Palette} from './builder-assets/pack3-palette.mjs';
import {exportPack3Portable,inspectPack3Portable,restorePack3Portable} from './builder-assets/pack3-portable.mjs';

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
    const p2=loadPack2LiveWorld(localStorage,result.world);
    if(p2.recovered||p2.warning)recoveryNote=p2.warning||recoveryNote;
    return p2.world;
  }
  try{
    const choice=localStorage.getItem(SELECTED_SEED_KEY);
    world=loadWorld(choice===null?DEFAULT_WORLD_SEED:worldSeedFromText(choice));
  }catch(err){
    // A damaged seed is NEVER replaced by auto-saving a fresh starter world.
    storageReadOnly=true;world=new Pack2LiveWorld(new VoxelWorld(DEFAULT_WORLD_SEED));
    recoveryNote='SAVE PROTECTION: '+err.message+' Choose a different seed or import backup.';
  }
  let pack3=createPack3LiveBridge(world,localStorage);
  seedLabel.textContent='WORLD '+world.seed;
  const VS=[
    '#version 300 es','precision highp float;',
    'in vec3 aPos; in vec3 aColor; in vec2 aUv; in float aMat;',
    'uniform vec3 uEye,uForward,uRight,uUp;',
    'uniform float uAspect,uTan;',
    'out vec3 vColor; out float vDistance; out vec2 vUv; flat out int vMat; out float vPack2Alpha;',
    'void main(){ vec3 d=aPos-uEye;',
    'float x=dot(d,uRight); float y=dot(d,uUp); float z=dot(d,uForward);',
    'gl_Position=vec4(x/(uAspect*uTan),y/uTan,1.0015*z-0.1501,z);',
    'vColor=aColor; vDistance=length(d); vUv=aUv; vMat=int(floor(aMat+.001)); vPack2Alpha=fract(aMat); }'
  ].join('\n');
  // Reserved transparent-water material 20; legacy materials stay unchanged.
  const FS=STORYBOOK_MATERIAL_FRAGMENT_SHADER
    .replace('in float vDistance;','in float vDistance; in float vPack2Alpha;')
    .replace('void main(){',
      'void main(){ if(vMat==20){ float f=smoothstep(29.0,68.0,vDistance);'+
      'outColor=vec4(mix(vColor,uFog,f),vPack2Alpha); return; }');
  let program,skyProgram,atPos,atColor,atUv,atMat,U,skyU,outlineBuffer;
  function initializeGpuPipeline(){
    const resources=buildGpuPipeline(gl,{
      terrainVertex:VS,terrainFragment:FS,
      skyVertex:SKY_VERTEX_SHADER,skyFragment:SKY_FRAGMENT_SHADER
    });
    program=resources.terrainProgram;skyProgram=resources.skyProgram;
    atPos=resources.atPos;atColor=resources.atColor;
    atUv=resources.atUv;atMat=resources.atMat;
    U=resources.uniforms;skyU=resources.skyUniforms;
    outlineBuffer=resources.outlineBuffer;
    gl.viewport(0,0,canvas.width,canvas.height);
  }
  try{initializeGpuPipeline();}
  catch(error){fatal('Voxel/sky shader failed to initialize: '+error.message);return;}

  let caveDiscovery={inside:false,last:-Infinity,discoveries:0};
  let selected=BLOCK.STONE,selectedRotation=0,pack3Yaw=0;
  let pack2Selection=null;
  let outlineKey='',outlineCount=0,editFeedback=[];
  const targetInfo=document.getElementById('targetInfo');
  let lastTargetText='';
  const chunks=new Map(),pending=new Map();
  const name=chunkKey;
  const player=newPlayer(world);
  const manual14Ids=new Set(MANUAL_FIVE_PACK_CATALOG.filter(x=>x.pack===1||x.pack===4).map(x=>x.numericId));
  const manual14ById=new Map(MANUAL_FIVE_PACK_CATALOG.filter(x=>manual14Ids.has(x.numericId))
    .map(x=>[x.numericId,x]));
  const manual14MeshCache=new Map();
  let manual14=null,manual14Yaw=0,manual14Variant='lower';
  function resetManual14ForWorld(){
    // No mutation of legacy world ID storage: all authored manual 1/4 pieces
    // reside in their own checked, seed-scoped construction sidecar.
    manual14MeshCache.clear();
    manual14=createManual14SavedBridge(world,localStorage,{rebuild:refreshManual14Cells});
    world.manual14Layer=manual14.layer;
    world.manual14Collision=box=>manual14.collision(box);
    const stat=document.getElementById('manual14Status');
    if(stat)stat.textContent=manual14.blocked??('Ready · '+manual14.layer.size()+
      ' saved shaped Pack 1/4 pieces for seed '+world.seed);
  }
  resetManual14ForWorld();
  // Real Pack 5 geometry is opt-in; the production cube palette is unchanged.
  let pack5Builder=null,pack5Gpu=null,pack5Mode=false;
  // The future settlement-builder source imports exactly this contract.
  // All five owner-specific save sidecars remain authoritative and isolated.
  const fivePackBuilder=createManualFivePackLiveBuilder({
    getWorld:()=>world,getManual14:()=>manual14,getPack3:()=>pack3,
    getPack5:()=>pack5Builder,loadPack5:ensurePack5Loaded,
    getPlayer:()=>player,storage:localStorage,
    canEdit:()=>!storageReadOnly&&!graphicsLost&&!document.hidden,
    rebuildPack2:refreshEditedMeshes,rebuildPack3:refreshPhysicalChunk,
    rebuildPack5:()=>{if(!pack5Gpu)throw Error('Pack 5 GPU layer not loaded');
      pack5Gpu.refresh(eye());}
  });
  function resetPack5ForWorld(){
    if(pack5Gpu){pack5Gpu.dispose();pack5Gpu=null;}
    pack5Builder=null;pack5Mode=false;
    const toggle=document.getElementById('pack5Enabled');
    if(toggle)toggle.checked=false;
    queueMicrotask(()=>{void restoreSavedPack5Scene();});
    const hint=document.getElementById('pack5Status');
    if(hint)hint.textContent='Off after world change. Enable again for this seed’s separate sidecar.';
  }
  // G2B only: explicit-session feature, no persistent settings, edits or new GPU queue.
  let g2Epoch=0,g2Flight=null,g2Controls=createG2ControlState();
  const g2Toggle=document.getElementById('g2bFlightEnable');
  const g2Profile=document.getElementById('g2bFlightProfile');
  const g2Status=document.getElementById('g2bFlightStatus');
  const g2Active=()=>g2Flight?.mode==='flight';
  const g2Token=()=>world.seed+'#'+g2Epoch;
  // G2A uses cx,cz,section; the GPU uses cx,cz for surface, cx,cz,section deep.
  const g2Section=y=>y>WORLD_MAX_Y&&y<=WORLD_MAX_Y+BODY_HEIGHT+1?0:sectionForY(y);
  function g2MeshKey(key){
    const parts=key.split(',').map(Number);
    if(parts.length!==3||!parts.every(Number.isSafeInteger)||parts[2]>0)return null;
    try{return depthMeshKey(...parts);}catch(_){return null;}
  }
  function g2Ready(p){
    if(!p||!['x','y','z'].every(k=>Number.isFinite(p[k]))||
       p.y<WORLD_MIN_Y||p.y>WORLD_MAX_Y+1||graphicsLost)return false;
    const e=1e-5;
    for(const y of [p.y+e,p.y+BODY_HEIGHT-e]){
      const section=g2Section(y);
      if(section===null)return false;
      for(const x of [p.x-BODY_RADIUS+e,p.x+BODY_RADIUS-e])
        for(const z of [p.z-BODY_RADIUS+e,p.z+BODY_RADIUS-e]){
          const c=chunks.get(depthMeshKey(chunkCoord(x),chunkCoord(z),section));
          if(!c||!c.buffer||c.section!==section)return false;
        }
    }
    return true;
  }
  function g2Clear(p){
    try{return p&&['x','y','z'].every(k=>Number.isFinite(p[k]))&&
      !collides(world,p.x,p.y,p.z);}
    catch(_){return false;}
  }
  const g2Host=()=>({worldToken:g2Token(),isRegionReady:g2Ready,
    isBodyClear:g2Clear,sectionForY:g2Section});
  function g2Sync(){
    const on=g2Active();
    document.body.classList.toggle('g2b-flight-active',on);
    g2Toggle.checked=on;g2Profile.disabled=!on;
    for(const [id,label,aria] of [
      ['dig',on?'DOWN':'MINE',on?'Hold to descend':'Mine targeted block'],
      ['place',on?'UP':'PLACE',on?'Hold to ascend':'Place selected block'],
      ['jump',on?'LAND ×2':'JUMP',on?'Double-tap for safe landing':'Jump; double-tap to toggle Creative flight']]){
      const el=document.getElementById(id);el.textContent=label;el.setAttribute('aria-label',aria);
    }
    g2Status.textContent=on?'FLIGHT · '+g2Flight.profile+' · '+g2Flight.reason:
      'Flight OFF · normal Explore controls';
    canvas.dataset.g2bFlight=String(on);
    canvas.dataset.g2bProfile=on?g2Flight.profile:'off';
  }
  function g2Pause(reason){
    if(!g2Active())return;
    g2Controls=clearG2Controls(g2Controls,reason);
    g2Flight=holdG2Flight(g2Flight,reason);
    // A planner can never clear shared production GPU queues.
  }
  function g2NewWorld(){
    // The original world-change code immediately installs a safe newPlayer.
    g2Flight=null;g2Controls=createG2ControlState();g2Epoch++;g2Sync();
  }
  function g2Start(){
    if(g2Active())return true;
    const at={x:player.x,y:player.feet,z:player.z};
    if(document.hidden||graphicsLost||exploration.isOpen()||
       !g2Ready(at)||!g2Clear(at)){
      g2Status.textContent='Flight unavailable: body/region not ready';
      message('Flight unavailable: stand in a loaded, clear area and double-tap JUMP again');return false;
    }
    try{
      const initial=createG2FlightState({position:at,worldToken:g2Token(),
        heightBounds:{minFeet:WORLD_MIN_Y,maxFeet:WORLD_MAX_Y+1}});
      const active=armG2Flight(initial,{enabled:true,isRegionReady:g2Ready,isBodyClear:g2Clear});
      if(active.mode!=='flight'){g2Status.textContent=active.reason;message(active.reason);return false;}
      g2Flight=selectG2FlightProfile(active,g2Profile.value);
      g2Controls=enterG2ControlOwnership(createG2ControlState(),
        {featureEnabled:true,flightReady:true});
      player.vX=player.vY=player.vZ=0;player.onGround=false;player.coyote=0;
      player.jumpBuffer=0;jumpQueued=false;g2Sync();return true;
    }catch(e){g2Status.textContent='Flight refused: '+e.message;message(g2Status.textContent);return false;}
  }
  function g2LandingHost(){
    const host=g2Host();
    const physicalSupport=p=>{
      try{return g2Clear(p)&&collides(world,p.x,p.y-.065,p.z);}
      catch(_){return false;}
    };
    return {...host,hasGroundSupport:physicalSupport,
      isSafeDescent(from,to){
        const dist=Math.hypot(from.x-to.x,from.y-to.y,from.z-to.z);
        for(let i=1,n=Math.max(1,Math.ceil(dist/.25));i<=n;i++){
          const t=i/n,p={x:from.x+(to.x-from.x)*t,
            y:from.y+(to.y-from.y)*t,z:from.z+(to.z-from.z)*t};
          if(!g2Ready(p)||!g2Clear(p))return false;
        }return true;
      },
      findGroundCandidates(from){
        const results=[];
        for(const [dx,dz] of [[0,0],[1,0],[-1,0],[0,1],[0,-1],
          [1,1],[-1,1],[1,-1],[-1,-1],[2,0],[-2,0],[0,2],[0,-2]]){
          for(let y=Math.floor(from.y);y>=Math.max(WORLD_MIN_Y,from.y-32);y--){
            const p={x:from.x+dx,y,z:from.z+dz};
            if(g2Ready(p)&&g2Clear(p)&&physicalSupport(p)){results.push(p);break;}
          }
        }
        return results; // max 13, below source G2A bound 64.
      }};
  }
  function g2Land(){
    if(!g2Active())return true;
    try{
      const host=g2LandingHost(),check=inspectG2Landing(g2Flight,host);
      if(!check.canLand){g2Status.textContent=check.reason;message(check.reason);return false;}
      const result=commitG2Landing(g2Flight,check,host);
      if(!result.landed){g2Status.textContent=result.reason;return false;}
      g2Controls=releaseG2ControlOwnership(g2Controls,{landed:true});
      g2Flight=null;
      Object.assign(player,{x:result.restorePlayer.position.x,
        feet:result.restorePlayer.position.y,z:result.restorePlayer.position.z,
        vX:0,vY:0,vZ:0,onGround:true,coyote:0,jumpBuffer:0});
      g2Sync();message('Landed safely · Explore controls restored');return true;
    }catch(e){g2Status.textContent='Landing blocked: '+e.message;return false;}
  }
  function g2ResumeControls(){
    // A first key/touch can arrive before the next frame after closing settings.
    // Resume synchronously ONLY when body, GPU, overlay and foreground are safe.
    if(!g2Active()||!g2Controls.paused||document.hidden||graphicsLost||
       !help.hidden||exploration.isOpen())return false;
    const p={x:player.x,y:player.feet,z:player.z};
    if(!g2Ready(p)||!g2Clear(p))return false;
    g2Controls=resumeG2Controls(g2Controls,{flightStillSafe:true});
    return !g2Controls.paused;
  }
  function g2Move(dt){
    if(!g2Active())return;
    if(g2Controls.paused&&!g2ResumeControls())return;
    const intent=readG2ControlIntent(g2Controls);
    if(intent.landRequested){g2Land();return;}
    try{
      const result=planG2FlightStep(g2Flight,
        {dt,strafe:intent.strafe,forward:intent.forward,
          vertical:intent.vertical,yaw:player.yaw,pitch:player.pitch},g2Host());
      g2Flight=result.state;
      // Reuse ONLY the renderer-owned desired/pending chunk queue.
      // Never expand the 25/34/27 resident budgets for flight prefetch.
      for(const req of result.requests){
        const key=g2MeshKey(req.key);
        if(!key||!wanted.has(key)||chunks.has(key)||pending.has(key)||
           pending.size>=34)continue;
        const coords=req.key.split(',').map(Number);
        pending.set(key,coords);
      }
      if(g2Ready(g2Flight.position)&&g2Clear(g2Flight.position)){
        player.x=g2Flight.position.x;player.feet=g2Flight.position.y;
        player.z=g2Flight.position.z;
        player.vX=player.vY=player.vZ=0;player.onGround=false;
      }else g2Pause('Flight halted at unsafe/unloaded boundary');
      canvas.dataset.g2bBlocked=String(g2Flight.blocked);
      canvas.dataset.g2bPending=String(g2Flight.prefetch.pending.length);
      g2Status.textContent=g2Flight.reason;
    }catch(e){g2Pause('Flight failed safely: '+e.message);}
  }
  g2Toggle.checked=false;g2Profile.value='normal';g2Sync();
  g2Toggle.addEventListener('change',()=>{
    if(g2Toggle.checked){g2Start();g2Sync();}
    else if(!g2Land())g2Sync();
  });
  g2Profile.addEventListener('change',()=>{
    if(!g2Active())return;
    try{g2Flight=selectG2FlightProfile(g2Flight,g2Profile.value);g2Sync();}
    catch(e){g2Status.textContent=e.message;}
  });
  // Manual UI-owned feature: distinct from the five autonomous world-content lanes.
  const exploration=installExplorationMap({storage:localStorage,getWorld:()=>world,getPlayer:()=>player,
    onOpen:()=>cancelAllPointers(),canOpen:()=>help.hidden&&!document.hidden&&!graphicsLost});
  let jumpQueued=false;
  const keys=new Set(),joystick={x:0,y:0},lookStick={x:0,y:0};
  const heldPointers=new Map();
  let precisionHeld=false;
  let frame=0,lastFrame=performance.now(),changed=false;
  const frameHistory=new FrameHistory(360);
  const meshCadence=new MeshFrameCadence({budgetMs:12,maxCooldown:2});
  const gpuRetry=new GpuUploadRetry({baseDelayMs:250,maxDelayMs:8000});
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
    const overlay=savePack2LiveWorld(localStorage,world);
    if(!overlay.ok){
      message('Pack 2 blocks not saved; original world untouched');
      saveHealth.textContent='PACK 2 SAVE PROTECTION: '+overlay.reason;
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
    saveHealth.textContent=result.warning||
      'Verified legacy schema-1 world and independent checksummed Pack 2 sidecar.';
    if(result.warning)message(result.warning);
    return true;
  }
  function deleteChunkBuffers(chunk){
    if(!chunk)return;
    gl.deleteBuffer(chunk.buffer);
    if(chunk.waterBuffer)gl.deleteBuffer(chunk.waterBuffer);
  }
  // Both buffers stage before publishing; on failure neither can leak.
  function uploadPack2Chunk(vertices,water){
    let buffer=null,waterBuffer=null;
    try{
      buffer=uploadChunkBuffer(gl,vertices);
      if(water.length)waterBuffer=uploadChunkBuffer(gl,water);
      return {buffer,count:vertices.length/9,waterBuffer,waterCount:water.length/9};
    }catch(error){
      if(buffer)gl.deleteBuffer(buffer);
      if(waterBuffer)gl.deleteBuffer(waterBuffer);
      throw error;
    }
  }
  let editMeshBatches=0;
  let lastEditMeshKeys=[];
  function manual14AtChunk(cx,cz,section){
    const key=depthMeshKey(cx,cz,section);
    if(manual14MeshCache.has(key))return manual14MeshCache.get(key);
    const meshes=meshManual14Chunk(manual14.layer,cx,cz,section);
    if(manual14MeshCache.size>=30)manual14MeshCache.delete(manual14MeshCache.keys().next().value);
    manual14MeshCache.set(key,meshes);
    return meshes;
  }
  function combineVertices(base,extra){
    if(!extra.length)return base;
    const combined=new Float32Array(base.length+extra.length);
    combined.set(base);combined.set(extra,base.length);
    return combined;
  }
  function meshPlayableChunk(cx,cz,section){
    const original=section===0?meshChunk(world,cx,cz):meshDepthSection(world,cx,cz,section);
    const pack3Mesh=combinePack3ChunkMesh(original,pack3.runtime,cx,cz,section);
    return combineVertices(pack3Mesh,manual14AtChunk(cx,cz,section).opaque);
  }
  function meshPlayableWater(cx,cz,section){
    return combineVertices(pack2WaterSectionVertices(world,cx,cz,section),
      manual14AtChunk(cx,cz,section).transparent);
  }
  function refreshEditedMeshes(x,z,y=0){
    // Rebuild every LOADED neighboring horizontal chunk AND adjacent vertical
    // sections at Y-seams. All buffers stage before any published replacement.
    const batch=[];
    for(const section of verticalEditSections(y))
      for(const {cx,cz} of editAffectedChunks(x,z)){
        const key=depthMeshKey(cx,cz,section);
        if(!chunks.has(key))continue;
        const vertices=meshPlayableChunk(cx,cz,section);
        const water=meshPlayableWater(cx,cz,section);
        batch.push({key,cx,cz,section,vertices,water});
      }
    const ready=[];
    try{
      for(const item of batch){
        ready.push({...item,...uploadPack2Chunk(item.vertices,item.water)});
      }
    }catch(err){
      for(const item of ready)deleteChunkBuffers(item);
      throw err;
    }
    for(const item of ready){
      const old=chunks.get(item.key);
      chunks.set(item.key,{x:item.cx,z:item.cz,section:item.section,
        buffer:item.buffer,count:item.count,
        waterBuffer:item.waterBuffer,waterCount:item.waterCount});
      deleteChunkBuffers(old);
    }
    editMeshBatches++;
    lastEditMeshKeys=ready.map(item=>item.key);
    // Unloaded deep sections always use the current saved world.get on arrival.
  }
  function refreshPhysicalChunk(x,z,y){
    const section=sectionForY(y);
    if(section===null)throw Error('Physical Pack 3 block is outside loaded depth');
    const cx=chunkCoord(x),cz=chunkCoord(z),key=depthMeshKey(cx,cz,section);
    if(!chunks.has(key))return;
    const vertices=meshPlayableChunk(cx,cz,section);
    const water=meshPlayableWater(cx,cz,section);
    const buffers=uploadPack2Chunk(vertices,water);
    const old=chunks.get(key);
    chunks.set(key,{x:cx,z:cz,section,...buffers});
    deleteChunkBuffers(old);
    editMeshBatches++;
    lastEditMeshKeys=[key];
  }
  function refreshManual14Cells(cells){
    if(!Array.isArray(cells)||cells.some(c=>!Array.isArray(c)||c.length!==3))
      throw Error('Invalid mounted construction update batch');
    // Stage all affected loaded sections first; partial GPU uploads are
    // deleted before publication, and the saved layer rolls back if staging
    // fails. Unloaded sections reconstruct from their verified seed sidecar.
    manual14MeshCache.clear();
    const unique=new Map();
    for(const [x,y,z] of cells){
      const section=sectionForY(y);
      if(section===null)throw Error('Manual shaped piece outside playable depth');
      const cx=chunkCoord(x),cz=chunkCoord(z),key=depthMeshKey(cx,cz,section);
      if(chunks.has(key))unique.set(key,{key,cx,cz,section});
    }
    const ready=[];
    try{
      for(const item of unique.values()){
        const vertices=meshPlayableChunk(item.cx,item.cz,item.section);
        const water=meshPlayableWater(item.cx,item.cz,item.section);
        ready.push({...item,...uploadPack2Chunk(vertices,water)});
      }
    }catch(error){
      for(const item of ready)deleteChunkBuffers(item);
      throw error;
    }
    for(const item of ready){
      const old=chunks.get(item.key);
      chunks.set(item.key,{x:item.cx,z:item.cz,section:item.section,
        buffer:item.buffer,count:item.count,
        waterBuffer:item.waterBuffer,waterCount:item.waterCount});
      deleteChunkBuffers(old);
    }
    if(ready.length){
      editMeshBatches++;
      lastEditMeshKeys=ready.map(x=>x.key);
    }
  }
  function edit(mode){
    // No world mutation behind settings, during app suspension, or on lost WebGL.
    if(!help.hidden||exploration.isOpen()||document.hidden||graphicsLost||g2Active())return;
    if(pack5Mode&&pack5Builder){
      if(storageReadOnly){message('Protected world read-only; Pack 5 edit blocked');return;}
      const result=mode==='place'?
        pack5Builder.placeFacing(eye(),facing(),
          document.getElementById('pack5Family').value,
          Number(document.getElementById('pack5Rotation').value),
          document.getElementById('pack5Variant').value,player):
        pack5Builder.removeFacing(eye(),facing());
      if(result.ok){
        pack5Gpu?.refresh(eye());
        message(mode==='place'?'Pack 5 furnishing placed · separate save verified':
          'Pack 5 furnishing removed · separate save verified');
      }else message(result.reason||'Pack 5 construction rejected');
      return;
    }
    const physicalState=inspectBlockTarget(world,eye(),facing(),selected,player,
      isPack3BlockId(selected)?pack3Yaw:selectedRotation);
    const existingPack3=physicalState.hit?pack3.getAt(...physicalState.hit):null;
    const existingManual14=physicalState.hit?manual14.layer.get(physicalState.hit):null;
    if((mode==='place'&&manual14Ids.has(selected))||(mode==='mine'&&existingManual14)){
      let result;
      if(storageReadOnly)result={ok:false,reason:'Protected world read-only'};
      else if(manual14.blocked)result={ok:false,reason:manual14.blocked};
      else if(!physicalState.hit)result={ok:false,reason:physicalState.reason};
      else if(mode==='place'&&!physicalState.canPlace)result={ok:false,reason:physicalState.reason};
      else if(mode==='mine'&&!physicalState.canMine)result={ok:false,reason:'Cannot remove here'};
      else if(mode==='mine'&&manual14.supportsLegacyCell(physicalState.hit))
        result={ok:false,reason:'Remove attached pieces before removing their support'};
      else if(mode==='mine')result=manual14.remove(physicalState.hit);
      else {
        const asset=manual14ById.get(selected);
        const state=resolveManualFivePackAsset(asset.symbol,{
          numericId:selected,orientation:manual14Yaw,
          variant:asset.pack===1?manual14Variant:null
        });
        const placement={asset:asset.symbol,numericId:selected,
          at:physicalState.adjacent,orientation:manual14Yaw,
          ...(asset.pack===1?{variant:manual14Variant}:{})};
        if(state.supportPolicy==='vertical-face')placement.supportAt=physicalState.hit;
        result=manual14.placeMany([placement],{
          playerBody:[player.x-.28,player.feet,player.z-.28,
            player.x+.28,player.feet+1.78,player.z+.28]});
      }
      if(!result.ok){message(result.reason);return;}
      message((mode==='mine'?'Removed ':'Placed ')+
        (BLOCK_NAMES[existingManual14?.numericId??selected]||'shaped block')+
        ' · physical save readback verified');
      const stat=document.getElementById('manual14Status');
      if(stat)stat.textContent=manual14.layer.size()+' physical blocks · verified separate save';
      return;
    }
    if(mode==='mine'&&physicalState.hit&&manual14.supportsLegacyCell(physicalState.hit)){
      message('This cell supports mounted Pack 1/4 objects. Remove attachments first.');return;
    }
    if((mode==='place'&&isPack3BlockId(selected))||(mode==='mine'&&existingPack3)){
      let result;
      if(storageReadOnly)result={ok:false,reason:'Protected world read-only'};
      else if(!physicalState.hit)result={ok:false,reason:physicalState.reason};
      else if(mode==='place'&&!physicalState.canPlace)result={ok:false,reason:physicalState.reason};
      else if(mode==='mine'&&!physicalState.canMine)result={ok:false,reason:'Cannot mine here'};
      else result=pack3.mutate({mode,
        cell:mode==='place'?physicalState.adjacent:physicalState.hit,
        id:selected,orientation:pack3Yaw,player,rebuild:refreshPhysicalChunk});
      editFeedback=recordWorldEditFeedback(editFeedback,result,performance.now(),
        mode==='place'?physicalState:null);
      if(!result.ok){message(result.reason);return;}
      message((mode==='mine'?'Removed ':'Placed ')+
        (BLOCK_NAMES[result.block]||'Pack 3 shaped block')+' · separate save verified');
      return;
    }
    if(pack5Builder){
      const target=inspectBlockTarget(world,eye(),facing(),selected,player);
      const shape=pack5Builder.layer.raycast(eye(),facing(),6);
      if(shape&&(!target.hit||shape.distance<target.distance-1e-6)){
        message('Shaped furnishing ahead; use Pack 5 mode to edit it');return;
      }
      if(mode==='mine'&&target.hit&&pack5Builder.supportsLegacyCell(target.hit)){
        message('This block supports Pack 5 furniture. Remove furniture first.');return;
      }
      if(mode==='place'&&target.adjacent&&pack5Builder.layer.cell(target.adjacent)){
        message('Building space occupied by Pack 5 furniture');return;
      }
    }
    // Contextual hinged interaction uses the existing PLACE thumb button.
    // Selecting a matching gate, door or hatch makes the action intuitive
    // without crowding the iPhone two-thumb control rails.
    if(mode==='place'&&pack2IsHinged(selected)){
      const targeted=raycast(world,eye(),facing(),6)?.hit;
      const existing=targeted?world.getPack2State?.(...targeted):null;
      if(existing?.id===selected){
        const next=pack2CycleState(selected,existing,'toggle');
        if(!next.open&&pack2BodyIntersects(selected,next,targeted,
          {x:player.x,z:player.z,feet:player.feet,radius:.28,height:1.78})){
          message('Cannot close a door or gate through the player');return;
        }
        world.updatePack2State(...targeted,next);
        try{refreshEditedMeshes(targeted[0],targeted[2],targeted[1]);}
        catch(error){world.updatePack2State(...targeted,existing);
          message('Gate update failed; original shape retained: '+error.message);return;}
        changed=true;const persisted=save();
        message((next.open?'Opened ':'Closed ')+BLOCK_NAMES[selected]+
          (persisted?' · saved':' · save not verified'));
        return;
      }
    }
    const inspection=mode==='place'?inspectBlockTarget(world,eye(),facing(),selected,player,selectedRotation):null;
    const result=applyBlockAction(world,eye(),facing(),mode,selected,player,refreshEditedMeshes,{rotation:selectedRotation});
    editFeedback=recordWorldEditFeedback(editFeedback,result,performance.now(),inspection);
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
    const horizontalCenter=name(chunkCoord(player.x),chunkCoord(player.z));
    const nearShaft=player.feet<3&&surfaceOpeningNearby(world,player.x,player.z);
    const visibleSections=sectionWindow(player.feet,nearShaft);
    const center=visibleSections.length===1&&visibleSections[0]===0?
      horizontalCenter:horizontalCenter+'|'+visibleSections.join(',');
    if(center!==lastStreamingCenter){
      lastStreamingCenter=center;
      meshCadence.resetCooldown();
      const desired=visibleSections.flatMap(section=>
        chunkWindow(player.x,player.z,sectionChunkRadius(section,visibleSections[0]))
          .map(c=>({...c,section})));
      wanted=new Set(desired.map(c=>depthMeshKey(c.cx,c.cz,c.section)));
      gpuRetry.keepOnly(wanted);
      // Keep only the immediate bounded vertical section neighborhood.
      // At normal surface height this remains the original 25 GPU chunks.
      for(const [k,c] of chunks){
        if(!wanted.has(k)){deleteChunkBuffers(c);chunks.delete(k);}
      }
      for(const c of desired){
        const k=depthMeshKey(c.cx,c.cz,c.section);
        if(!chunks.has(k)&&!pending.has(k))
          pending.set(k,[c.cx,c.cz,c.section]);
      }
    }
    for(const k of pending.keys())if(!wanted.has(k))pending.delete(k);
    const cx=chunkCoord(player.x),cz=chunkCoord(player.z);
    const activeSection=sectionForY(Math.max(WORLD_MIN_Y,Math.min(19,Math.floor(player.feet))))??0;
    const weight=([x,z,section])=>
      (x-cx)**2+(z-cz)**2+(section-activeSection)**2*12;
    const queue=[...pending.entries()].sort((a,b)=>
      weight(a[1])-weight(b[1])||
      a[1][2]-b[1][2]||a[1][1]-b[1][1]||a[1][0]-b[1][0]);
    const now=performance.now();
    const next=queue.find(([k])=>gpuRetry.ready(k,now));
    if(next&&meshCadence.ready()){
      const [k,[x,z,section]]=next;
      const begin=performance.now();
      try{
        const data=meshPlayableChunk(x,z,section);
        const water=meshPlayableWater(x,z,section);
        const buffers=uploadPack2Chunk(data,water);
        pending.delete(k);gpuRetry.success(k);
        const old=chunks.get(k);
        chunks.set(k,{x,z,section,...buffers});
        deleteChunkBuffers(old);
      }catch(error){
        const state=gpuRetry.fail(k,performance.now(),error.message);
        if(state.attempt===1)message('Chunk GPU upload deferred safely; retry scheduled');
      }finally{
        meshCadence.finished(performance.now()-begin);
      }
    }
    if(frame%45===0)for(const [k,c] of chunks){
      if(!wanted.has(k)){deleteChunkBuffers(c);chunks.delete(k);}
    }
  }
  function respawnPrototype(){
    Object.assign(player,newPlayer(world));
    jumpQueued=false;
    message('Returned to a safe surface near spawn (prototype void recovery)');
  }
  function jump(){if(!g2Active()&&help.hidden&&!exploration.isOpen()&&!document.hidden&&!graphicsLost)jumpQueued=true;}
  function move(dt){
    const strafe=(keys.has('KeyD')?1:0)-(keys.has('KeyA')?1:0)+joystick.x;
    const forward=(keys.has('KeyW')?1:0)-(keys.has('KeyS')?1:0)-joystick.y;
    if(g2Active()){jumpQueued=false;g2Move(dt);}
    else{
      const result=stepPlayer(world,player,{strafe,forward,jump:jumpQueued},dt);
      jumpQueued=false;
      if(result.landed && !result.stepped)
        canvas.dataset.landings=String((Number(canvas.dataset.landings)||0)+1);
    }
    const arrowsX=(keys.has('ArrowRight')?1:0)-(keys.has('ArrowLeft')?1:0);
    const arrowsY=(keys.has('ArrowDown')?1:0)-(keys.has('ArrowUp')?1:0);
    if(arrowsX||arrowsY)look(arrowsX*dt*1.9,arrowsY*dt*1.6,1);
    if(lookMode==='stick'&&(lookStick.x||lookStick.y)){
      const d=stickLookDelta(lookStick,dt);
      look(d.x,d.y);
    }
    if(player.feet<WORLD_MIN_Y-12)respawnPrototype();
  }
  function draw(now){
    const dt=Math.min(.035,Math.max(0,(now-lastFrame)/1000));lastFrame=now;
    frameHistory.frame(now,!document.hidden&&help.hidden&&!exploration.isOpen()&&!graphicsLost);
    if(!document.hidden&&!graphicsLost){
      frame++;if(help.hidden&&!exploration.isOpen())move(dt);
      if(frame%16===0)exploration.tick(now);
      // Low-frequency real-cave check: no synthetic map markers or geometry.
      if(help.hidden&&!exploration.isOpen()&&frame%24===0){
        caveDiscovery=updateCaveDiscovery(caveDiscovery,naturalCaveCorridor(world,player),now);
        if(caveDiscovery.entered)message('Natural cave passage discovered · explore carefully');
      }
      const buffer=bufferDimensions(canvas.clientWidth,canvas.clientHeight,renderPreset,devicePixelRatio||1);
      const w=buffer.width,h=buffer.height;
      canvas.dataset.renderPreset=renderPreset;
      canvas.dataset.storybookQuality=renderPreset==='economy'?'base-colors':'painted-materials';
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
      gl.uniform1f(U.uArtQuality,renderPreset==='economy'?0:1);
      stream();
      canvas.dataset.renderedFrames=String(frame);
      canvas.dataset.meshCadenceSkipped=String(meshCadence.skipped);
      canvas.dataset.loadedChunks=String(chunks.size);
      canvas.dataset.pendingChunks=String(pending.size);
      canvas.dataset.chunkCenter=lastStreamingCenter;
      canvas.dataset.meshEditBatches=String(editMeshBatches);
      canvas.dataset.lastEditedChunks=lastEditMeshKeys.join(';');
      canvas.dataset.renderedMeshVertices=String([...chunks.values()].reduce((sum,c)=>sum+c.count,0));
      canvas.dataset.pack3PhysicalCount=String(pack3.runtime.size());
      canvas.dataset.pack3SelectedId=String(isPack3BlockId(selected)?selected:0);
      canvas.dataset.manual14PhysicalCount=String(manual14.layer.size());
      canvas.dataset.manual14SelectedId=String(manual14Ids.has(selected)?selected:0);
      // This is the ACTUAL GPU-resident source geometry, not just a saved
      // sidecar count. Browser acceptance checks this positive on three sizes.
      let manual14ResidentVerts=0,manual14ResidentInstances=0;
      for(const c of chunks.values()){
        const shape=manual14AtChunk(c.x,c.z,c.section);
        manual14ResidentVerts+=shape.vertices;
        manual14ResidentInstances+=shape.instances;
      }
      canvas.dataset.manual14MeshVertices=String(manual14ResidentVerts);
      canvas.dataset.manual14VisibleInstances=String(manual14ResidentInstances);
      for(const c of chunks.values()){
        gl.bindBuffer(gl.ARRAY_BUFFER,c.buffer);
        gl.vertexAttribPointer(atPos,3,gl.FLOAT,false,36,0);
        gl.vertexAttribPointer(atColor,3,gl.FLOAT,false,36,12);
        gl.vertexAttribPointer(atUv,2,gl.FLOAT,false,36,24);
        gl.vertexAttribPointer(atMat,1,gl.FLOAT,false,36,32);
        gl.drawArrays(gl.TRIANGLES,0,c.count);
      }
      // Pack 5 uses the EXISTING game terrain program and fog, exactly one
      // optional shaped-triangle draw, with bounded GPU memory and streaming.
      if(pack5Gpu){
        // At most one <=384 KiB page upload per refresh. Progress pending
        // rooms every third frame; fully resident scenes retain 20-frame scans.
        if(frame%20===0||frame===1||
           (pack5Gpu.stats().pendingPages>0&&frame%3===0))
          pack5Gpu.refresh(eye());
        canvas.dataset.pack5MeshVertices=String(
          pack5Gpu.draw({atPos,atColor,atUv,atMat}));
        const pack5Stats=pack5Gpu.stats();
        canvas.dataset.pack5VisibleInstances=String(pack5Stats.instances);
        canvas.dataset.pack5GpuBytes=String(pack5Stats.bytes);
        canvas.dataset.pack5DrawCalls=String(pack5Stats.drawCalls);
        canvas.dataset.pack5PendingPages=String(pack5Stats.pendingPages);
        canvas.dataset.pack5BudgetExcluded=String(pack5Stats.budgetExcluded);
      }else{
        canvas.dataset.pack5MeshVertices='0';
        canvas.dataset.pack5VisibleInstances='0';
        canvas.dataset.pack5GpuBytes='0';
        canvas.dataset.pack5DrawCalls='0';
        canvas.dataset.pack5PendingPages='0';
        canvas.dataset.pack5BudgetExcluded='0';
      }
      // Genuine transparent-water pass, only for chunks with water candidates.
      if([...chunks.values()].some(c=>c.waterBuffer)){
        gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
        gl.depthMask(false);
        const waterChunks=[...chunks.values()].filter(c=>c.waterBuffer).sort((a,b)=>{
          const distance=c=>((c.x*16+8-player.x)**2+(c.z*16+8-player.z)**2+
            (c.section*16-player.feet)**2);
          return distance(b)-distance(a);
        });
        for(const chunk of waterChunks){
          gl.bindBuffer(gl.ARRAY_BUFFER,chunk.waterBuffer);
          gl.vertexAttribPointer(atPos,3,gl.FLOAT,false,36,0);
          gl.vertexAttribPointer(atColor,3,gl.FLOAT,false,36,12);
          gl.vertexAttribPointer(atUv,2,gl.FLOAT,false,36,24);
          gl.vertexAttribPointer(atMat,1,gl.FLOAT,false,36,32);
          gl.drawArrays(gl.TRIANGLES,0,chunk.waterCount);
        }
        gl.depthMask(true);gl.disable(gl.BLEND);
      }
      // A faint world-space targeted-block outline, never a HUD covering the scene.
      const focused=help.hidden?inspectBlockTarget(world,eye(),facing(),selected,player,selectedRotation):null;
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
      const echo=help.hidden?sampleWorldEditFeedback(editFeedback,now):{key:'',vertices:new Float32Array()};
      const nextOutlineKey=focusKey+'|'+placeKey+'|'+echo.key;
      if(nextOutlineKey!==outlineKey){
        outlineKey=nextOutlineKey;
        // Teal indicates the mineable target; amber marks the adjacent
        // valid placement cell. Both are world-space geometry, not HUD.
        const mine=focused?.hit?outlineVertices(focused.hit,[.44,.90,.81]):new Float32Array();
        const preview=placeKey?outlineVertices(focused.adjacent,[.97,.76,.38]):new Float32Array();
        const data=new Float32Array(mine.length+preview.length+echo.vertices.length);
        data.set(mine);data.set(preview,mine.length);
        data.set(echo.vertices,mine.length+preview.length);
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
  }
  const frameDriver=new ForegroundFrameDriver(
    callback=>requestAnimationFrame(callback),id=>cancelAnimationFrame(id),draw
  );
  // Capture is per grip: moving and aiming simultaneously never compete for one pointer.
  function pointerPad(el,update,release,g2Zone=null){
    let active=null,lastX=0,lastY=0;
    function stop(){
      if(active===null)return;
      if(g2Active()&&g2Zone)g2Controls=dispatchG2Control(g2Controls,{type:'pointerup',id:active});
      heldPointers.delete(active);active=null;release();el.classList.remove('engaged');
    }
    el.addEventListener('pointerdown',e=>{
      // A second touch must never steal a held grip. Settings and background
      // transitions cannot create invisible held pointers behind the overlay.
      if(active!==null||!help.hidden||exploration.isOpen()||document.hidden)return;
      e.preventDefault();active=e.pointerId;lastX=e.clientX;lastY=e.clientY;
      heldPointers.set(active,stop);
      try{el.setPointerCapture(active);}catch(_){}
      el.classList.add('engaged');update(e,0,0,true);
      if(g2Active()&&g2Zone){
        g2ResumeControls();
        g2Controls=dispatchG2Control(g2Controls,{type:'pointerdown',id:active,zone:g2Zone});
        if(g2Zone==='move')g2Controls=dispatchG2Control(g2Controls,
          {type:'pointermove',id:active,x:joystick.x,y:joystick.y});
      }
    });
    el.addEventListener('pointermove',e=>{
      if(active!==e.pointerId)return;
      e.preventDefault();
      const dx=e.clientX-lastX,dy=e.clientY-lastY;
      lastX=e.clientX;lastY=e.clientY;update(e,dx,dy,false);
      if(g2Active()&&g2Zone){
        g2Controls=dispatchG2Control(g2Controls,{type:'pointermove',
          id:active,x:g2Zone==='move'?joystick.x:lookStick.x,
          y:g2Zone==='move'?joystick.y:lookStick.y});
      }
    });
    for(const event of ['pointerup','pointercancel']){
      el.addEventListener(event,e=>{if(active===e.pointerId)stop();});
      // iOS can release capture during a second-finger action or resize.
      // A window capture listener catches the release even if the grip
      // no longer receives its own pointerup; stop() is idempotent.
      window.addEventListener(event,e=>{if(active===e.pointerId)stop();},true);
    }
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
  },()=>{joystick.x=joystick.y=0;knob.style.transform='';},'move');
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
  },()=>{lookStick.x=lookStick.y=0;cameraKnob.style.transform='';},'look');
  const precisionButton=document.getElementById('precision');
  let precisionPointer=null,precisionTouchId=null;
  function releasePrecision(e){
    if(precisionPointer===null||(e&&e.pointerId!==precisionPointer))return;
    precisionPointer=null;precisionTouchId=null;precisionHeld=false;
    precisionButton.classList.remove('held');
  }
  precisionButton.addEventListener('pointerdown',e=>{
    // Retain the first precision finger until it actually releases.
    // Otherwise a second touch overwrites its ID and leaves AIM stuck.
    if(precisionPointer!==null||!help.hidden||exploration.isOpen()||document.hidden)return;
    e.preventDefault();precisionPointer=e.pointerId;precisionHeld=true;
    precisionButton.classList.add('held');
    try{precisionButton.setPointerCapture(e.pointerId);}catch(_){}
  });
  for(const event of ['pointerup','pointercancel']){
    precisionButton.addEventListener(event,releasePrecision);
    window.addEventListener(event,releasePrecision,true);
  }
  precisionButton.addEventListener('lostpointercapture',releasePrecision);
  // Preserve the owning touch across Safari pointer-capture interruptions.
  // TouchEnd identifies the finger even if the matching pointerup is lost.
  precisionButton.addEventListener('touchstart',e=>{
    // touchstart precedes pointerdown on Chromium/Safari. Remember the first
    // finger before a second touch can race into the AIM button.
    if(precisionTouchId===null&&help.hidden&&!exploration.isOpen()&&!document.hidden&&e.changedTouches.length)
      precisionTouchId=e.changedTouches[0].identifier;
  },{passive:true});
  for(const name of ['touchend','touchcancel'])window.addEventListener(name,e=>{
    if(precisionTouchId!==null&&Array.from(e.changedTouches)
      .some(t=>t.identifier===precisionTouchId))releasePrecision();
  },true);
  function cancelAllPointers(){
    for(const stop of [...heldPointers.values()])stop();
    lookStick.x=lookStick.y=0;
    precisionPointer=null;precisionTouchId=null;precisionHeld=false;
    keys.clear();joystick.x=joystick.y=0;
    jumpQueued=false;drag=null;
    precisionButton.classList.remove('held');
    cameraKnob.style.transform='';knob.style.transform='';
    g2Pause('Touch interrupted; hover safely');
  }
  let drag=null;
  canvas.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&help.hidden&&!exploration.isOpen()&&!document.hidden){drag={id:e.pointerId,x:e.clientX,y:e.clientY,moved:false,button:e.button};canvas.setPointerCapture(e.pointerId);}});
  canvas.addEventListener('pointermove',e=>{
    if(!drag||drag.id!==e.pointerId)return;
    const {x:dx,y:dy}=safePointerDelta(e.clientX-drag.x,e.clientY-drag.y);
    if(Math.abs(dx)+Math.abs(dy)>1)drag.moved=true;
    look(dx,dy,.006);
    drag.x=e.clientX;drag.y=e.clientY;
  });
  canvas.addEventListener('pointerup',e=>{if(drag&&drag.id===e.pointerId){if(!g2Active()&&!drag.moved&&help.hidden&&!exploration.isOpen()&&!document.hidden)edit(drag.button===2?'place':'mine');drag=null;}});
  // Interrupted mouse drags must not become delayed mine/place actions.
  canvas.addEventListener('pointercancel',e=>{if(drag?.id===e.pointerId)drag=null;});
  canvas.addEventListener('lostpointercapture',e=>{if(drag?.id===e.pointerId)drag=null;});
  canvas.addEventListener('contextmenu',e=>e.preventDefault());
  document.addEventListener('keydown',e=>{
    // Do not steal arrows, space or WASD from accessibility controls and form fields.
    if(!isWorldControlTarget(e.target,e)||!help.hidden||exploration.isOpen()||document.hidden)return;
    if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();
    if(g2Active()){
      g2ResumeControls();
      g2Controls=dispatchG2Control(g2Controls,{type:'key',code:e.code,pressed:true});
      if(['KeyQ','KeyE','Space'].includes(e.code))e.preventDefault();
    }else if(e.code==='Space'&&!e.repeat)jump();
    keys.add(e.code);
  });
  document.addEventListener('keyup',e=>{
    keys.delete(e.code);
    if(g2Active())g2Controls=dispatchG2Control(g2Controls,
      {type:'key',code:e.code,pressed:false});
  });
  window.addEventListener('blur',cancelAllPointers);
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){
      frameDriver.pause();
      frameHistory.frame(performance.now(),false);
      cancelAllPointers();
      if(mirrorEnabled&&pendingMirrors.size)flushMirror();
    }else if(!graphicsLost){
      lastFrame=performance.now(); // never simulate hidden time as movement
      frameDriver.resume();
    }
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
  // A mode-changing LAND pointerdown must consume its own subsequent click.
  // Otherwise a delayed click could activate ordinary Explore JUMP after landing.
  const g2ConsumedClicks=new Map();
  // Safari can suppress a synthesized click on a second touch while the
  // movement pad holds pointer capture. Execute touch actions on pointerdown,
  // but preserve click for mouse, keyboard and accessibility activation.
  function bindGameplayAction(id,action){
    const button=document.getElementById(id);
    let lastTouchAt=-Infinity;
    button.addEventListener('pointerdown',e=>{
      if(e.pointerType!=='touch')return;
      e.preventDefault();
      // A flight-mode tap may switch to Explore before Safari emits click.
      if(g2Active()){
        lastTouchAt=performance.now();
        g2ConsumedClicks.set(id,lastTouchAt);
        return;
      }
      // A queued iOS touch must not edit the world behind settings or on app suspension.
      if(!help.hidden||exploration.isOpen()||document.hidden||button.disabled)return;
      lastTouchAt=performance.now();
      action();
    });
    button.addEventListener('click',e=>{
      const consumed=g2ConsumedClicks.get(id);
      if(consumed!==undefined&&performance.now()-consumed<850){
        g2ConsumedClicks.delete(id);
        e.preventDefault();return;
      }
      g2ConsumedClicks.delete(id);
      if(e.detail!==0&&performance.now()-lastTouchAt<750){
        e.preventDefault();
        return;
      }
      if(!help.hidden||exploration.isOpen()||document.hidden||button.disabled||g2Active()){e.preventDefault();return;}
      action();
    });
  }
  // Single tap preserves normal JUMP; double-tap toggles Creative Flight.
  // iPhone touch uses pointerdown because another thumb may suppress click.
  const G2_JUMP_DOUBLE_TAP_MS=500;
  let lastG2JumpTap=-Infinity;
  function g2JumpTap(){
    const now=performance.now(),delta=now-lastG2JumpTap;
    if(delta>=0&&delta<=G2_JUMP_DOUBLE_TAP_MS){
      lastG2JumpTap=-Infinity;
      if(g2Active())g2Land();else g2Start();
    }else{
      lastG2JumpTap=now;
      if(!g2Active())jump();
    }
  }
  function g2BindJumpToggle(){
    const button=document.getElementById('jump');
    let lastTouchAt=-Infinity;
    button.addEventListener('pointerdown',e=>{
      if(e.pointerType!=='touch')return;
      e.preventDefault();
      if(!help.hidden||exploration.isOpen()||document.hidden||
         graphicsLost||button.disabled)return;
      lastTouchAt=performance.now();
      g2JumpTap();
    });
    button.addEventListener('click',e=>{
      // Never double-count the synthesized click after an iPhone pointerdown.
      if(performance.now()-lastTouchAt<850){
        e.preventDefault();return;
      }
      if(!help.hidden||exploration.isOpen()||document.hidden||
         graphicsLost||button.disabled){e.preventDefault();return;}
      g2JumpTap();
    });
  }
  g2BindJumpToggle();
  bindGameplayAction('dig',()=>edit('mine'));
  bindGameplayAction('place',()=>edit('place'));
  // Held flight actions are NEVER generic MINE/PLACE/JUMP actions.
  // Pointerdown is necessary on iPhone while another thumb holds its pad.
  function g2BindHold(id,zone){
    const button=document.getElementById(id);
    let active=null,lastTouch=-Infinity;
    const release=e=>{
      if(active===null||(e&&e.pointerId!==active))return;
      if(g2Active())g2Controls=dispatchG2Control(g2Controls,{type:'pointerup',id:active});
      active=null;
    };
    button.addEventListener('pointerdown',e=>{
      if(!g2Active()||!help.hidden||exploration.isOpen()||document.hidden||
         graphicsLost||button.disabled||active!==null)return;
      e.preventDefault();active=e.pointerId;
      lastTouch=performance.now();g2ConsumedClicks.set(id,lastTouch);
      g2ResumeControls();
      g2Controls=dispatchG2Control(g2Controls,{type:'pointerdown',id:active,zone});
      try{button.setPointerCapture(active);}catch(_){}
      // A quick tap may start/end between frames. One immediate bounded,
      // physically checked step guarantees an UP/DOWN response on iPhone.
      // Keeping the pointer owned continues movement while held.
      if(zone==='up'||zone==='down')g2Move(.05);
    });
    for(const type of ['pointerup','pointercancel']){
      button.addEventListener(type,release);
      window.addEventListener(type,release,true);
    }
    button.addEventListener('lostpointercapture',release);
    button.addEventListener('click',e=>{
      if(!g2Active())return;
      e.preventDefault();
      if(performance.now()-lastTouch<750)return;
      // Accessible keyboard activation: a single small UP/DOWN nudge;
      // keyboard Q/E continue to supply sustained motion.
      if(!g2Ready({x:player.x,y:player.feet,z:player.z}))return;
      const action=zone==='up'?1:-1;
      try{
        const r=planG2FlightStep(g2Flight,{dt:.05,vertical:action,
          yaw:player.yaw,pitch:player.pitch},g2Host());
        if(!r.state.blocked&&g2Ready(r.state.position)&&g2Clear(r.state.position)){
          g2Flight=r.state;player.feet=r.state.position.y;
          player.onGround=false;player.vX=player.vY=player.vZ=0;
        }
      }catch(_){g2Pause('Keyboard flight nudge refused safely');}
    });
  }
  g2BindHold('dig','down');g2BindHold('place','up');
  const pack5Enabled=document.getElementById('pack5Enabled'),
    pack5Family=document.getElementById('pack5Family'),
    pack5Variant=document.getElementById('pack5Variant'),
    pack5Status=document.getElementById('pack5Status');
  function refreshPack5Variants(){
    if(!pack5Builder)return;
    const item=pack5Builder.layer.catalog.find(x=>x.symbolicId===pack5Family.value);
    pack5Variant.replaceChildren();
    for(const variant of (item?.variants||[])){
      const option=document.createElement('option');
      option.value=variant;option.textContent=variant.replaceAll('-',' ');
      pack5Variant.append(option);
    }
  }
  pack5Family.addEventListener('change',refreshPack5Variants);
  let pack5LoadPromise=null,pack5LoadWorld=null;
  async function ensurePack5Loaded(){
    if(pack5Builder)return true;
    if(pack5LoadPromise&&pack5LoadWorld===world)return pack5LoadPromise;
    const requestedWorld=world;
    const current=(async()=>{
      const [{createPack5LiveAdapter},{createPack5GpuStream}]=await Promise.all([
        import('./pack5-integration/live-adapter.mjs'),
        import('./pack5-integration/terrain-buffer.mjs')
      ]);
      if(world!==requestedWorld)return false;
      const candidate=createPack5LiveAdapter(world,{storage:localStorage});
      const box=[player.x-.28,player.feet,player.z-.28,
        player.x+.28,player.feet+1.78,player.z+.28];
      if(candidate.layer.collidesPack5(box))
        throw Error('Stored furnishing overlaps player. Move clear before loading.');
      const renderer=createPack5GpuStream(gl,candidate.layer);
      if(world!==requestedWorld){renderer.dispose();return false;}
      pack5Builder=candidate;pack5Gpu=renderer;
      world.pack5Collision=box=>candidate.collision(box);
      world.pack5Layer=candidate.layer;
      pack5Family.replaceChildren();
      for(const f of candidate.layer.catalog){
        const option=document.createElement('option');
        option.value=f.symbolicId;option.textContent=f.symbolicId+' · '+f.name;
        pack5Family.append(option);
      }
      refreshPack5Variants();
      renderer.refresh(eye());
      return true;
    })();
    pack5LoadWorld=requestedWorld;pack5LoadPromise=current;
    try{return await current;}
    finally{
      if(pack5LoadPromise===current){pack5LoadPromise=null;pack5LoadWorld=null;}
    }
  }
  async function restoreSavedPack5Scene(){
    if(storageReadOnly||pack5Builder)return;
    const key='mythwrought.pack5.builder.seed.'+world.seed;
    try{
      if([key,key+'.journal',key+'.backup'].every(k=>localStorage.getItem(k)===null))
        return;
      if(await ensurePack5Loaded()&&!pack5Mode)
        pack5Status.textContent='Saved Pack 5 furniture restored and physically solid · editing OFF.';
    }catch(error){
      // Corrupt/unsupported independent sidecars remain untouched for export.
      pack5Status.textContent='Pack 5 stored data protected and not loaded: '+
        String(error.message||error);
    }
  }
  pack5Enabled.addEventListener('change',async()=>{
    if(!pack5Enabled.checked){
      pack5Mode=false;
      pack5Status.textContent='Editing off. Placed Pack 5 pieces remain rendered and solid.';
      return;
    }
    try{
      const loaded=await ensurePack5Loaded();
      if(!loaded||!pack5Enabled.checked)return;
      pack5Mode=true;
      pack5Status.textContent='Pack 5 ON · MINE/PLACE edit shaped furniture · '+
        pack5Builder.layer.count()+' pieces in verified separate seed sidecar.';
    }catch(error){
      pack5Mode=false;pack5Enabled.checked=false;
      pack5Status.textContent='Pack 5 unavailable; original saves preserved: '+
        String(error.message||error);
    }
  });
  document.getElementById('pack5Export').addEventListener('click',()=>{
    if(!pack5Builder){
      pack5Status.textContent='No loaded Pack 5 construction to export.';
      return;
    }
    try{
      const raw=JSON.stringify(pack5Builder.snapshot(),null,2);
      const href=URL.createObjectURL(new Blob([raw],{type:'application/json'}));
      const link=document.createElement('a');
      link.href=href;link.download='mythwrought-pack5-seed-'+world.seed+'.json';
      document.body.append(link);link.click();link.remove();
      setTimeout(()=>URL.revokeObjectURL(href),1500);
      pack5Status.textContent='Separate Pack 5 JSON export prepared; schema-1 world untouched.';
    }catch(error){
      pack5Status.textContent='Pack 5 export unavailable; original sidecar preserved: '+String(error);
    }
  });
  const pack5ImportFile=document.getElementById('pack5ImportFile');
  document.getElementById('pack5Import').addEventListener('click',()=>{
    if(storageReadOnly){
      pack5Status.textContent='Protected world read-only; Pack 5 import blocked';
      return;
    }
    pack5ImportFile.click();
  });
  pack5ImportFile.addEventListener('change',async e=>{
    const file=e.target.files?.[0];
    try{
      if(!file||storageReadOnly)return;
      if(file.size>2*1024*1024)throw Error('Pack 5 JSON exceeds 2 MiB limit');
      const raw=await file.text(),data=JSON.parse(raw),requestedWorld=world;
      if(!data||data.format!=='mythwrought.pack5.builder-layer.v1'||
          data.seed!==world.seed||!Array.isArray(data.entries))
        throw Error('Not a Pack 5 sidecar for the current world seed');
      if(!await ensurePack5Loaded()||world!==requestedWorld)
        throw Error('World changed while preparing Pack 5 import');
      if(!window.confirm('Replace Pack 5 furnishings for world '+world.seed+
          ' with '+data.entries.length+' pieces? This does not edit terrain.'))
        return;
      if(world!==requestedWorld)throw Error('World changed before import');
      const playerBox=[player.x-.28,player.feet,player.z-.28,
        player.x+.28,player.feet+1.78,player.z+.28];
      const result=pack5Builder.importJson(raw,{confirmReplace:true,playerBox});
      pack5Gpu.refresh(eye());
      pack5Status.textContent='Pack 5 import saved: '+result.count+
        ' pieces. Prior primary preserved in sidecar backup.';
    }catch(error){
      pack5Status.textContent='Pack 5 import rejected; original saves retained: '+
        String(error.message||error);
    }finally{e.target.value='';}
  });
  const pack2List=document.getElementById('pack2Materials');
  for(const id of PACK2_LIVE_IDS){
    const b=document.createElement('button');
    b.type='button';b.dataset.block=String(id);b.textContent=id+' · '+PACK2_LIVE_NAMES[id];
    b.setAttribute('aria-pressed','false');pack2List.append(b);
  }
  const pack2StateText=document.getElementById('pack2StateText');
  function updatePack2SelectionUI(){
    world.nextPack2State=pack2Selection;
    const s=pack2Selection;
    pack2StateText.textContent=s?
      PACK2_LIVE_NAMES[s.id]+' · '+
      (s.rotation===undefined?'':('rotation '+s.rotation*90+'° · '))+
      (s.variant===undefined?'':(s.variant+' · '))+
      (s.open===undefined?'':(s.open?'open · ':'closed · '))+
      (s.level===undefined?'':('water level '+s.level+' · '+s.flow)):
      'Select a Pack 2 material to adjust its physical placement state.';
  }
  // The full biome130 palette lives in the existing scrollable settings sheet,
  // NOT in the independent two-thumb control rails or over the game viewport.
  const physicalPalette=document.createElement('div');
  physicalPalette.className='looksetting';
  const physicalLabel=document.createElement('label');
  physicalLabel.htmlFor='biome130Select';
  physicalLabel.textContent='AUTOMATION BIOME BLOCKS · '+BIOME130_REGISTERED_IDS.length+' PHYSICAL MATERIALS';
  const biomeSelect=document.createElement('select');
  biomeSelect.id='biome130Select';
  biomeSelect.setAttribute('aria-label','Biome construction block');
  const emptyChoice=document.createElement('option');
  emptyChoice.value='';emptyChoice.textContent='Select a biome construction material';
  biomeSelect.append(emptyChoice);
  for(const [title,start,end] of [['Desert',1,15],['Snow',16,30],['Enchanted forest',31,45],['Mountains',46,60],['Ancient ruins',61,70],['Underground civilization',71,80],['Dungeon hardware',81,90],['Biome architecture',91,100],['Natural stone',101,112],['Raw logs',113,121],['Natural foliage',122,130]]){
    const group=document.createElement('optgroup');group.label=title;
    for(const id of BIOME130_REGISTERED_IDS){
      const ordinal=id-255;if(ordinal<start||ordinal>end)continue;
      const opt=document.createElement('option');
      opt.value=String(id);opt.textContent=String(ordinal).padStart(3,'0')+' · '+biome130Block(id).name;
      group.append(opt);
    }
    biomeSelect.append(group);
  }
  const turnLabel=document.createElement('label');
  turnLabel.htmlFor='biome130Rotation';
  turnLabel.textContent='Block orientation';
  const biomeRotation=document.createElement('select');
  biomeRotation.id='biome130Rotation';biomeRotation.setAttribute('aria-label','Biome block rotation');
  for(const [rotation,name] of ['North','East','South','West'].entries()){
    const opt=document.createElement('option');opt.value=String(rotation);opt.textContent=name;
    biomeRotation.append(opt);
  }
  physicalPalette.append(physicalLabel,biomeSelect,turnLabel,biomeRotation);
  const moreBlockArea=help.querySelector('[data-block="8"]')?.closest('.looksetting');
  if(moreBlockArea?.parentElement)moreBlockArea.insertAdjacentElement('afterend',physicalPalette);
  else help.querySelector('.helpbody')?.append(physicalPalette);
  biomeRotation.addEventListener('change',()=>{
    selectedRotation=Number(biomeRotation.value);
    if(BIOME130_REGISTERED_IDS.includes(selected))
      message('Selected '+biome130Block(selected).name+' · '+biomeRotation.selectedOptions[0].textContent);
  });
  biomeSelect.addEventListener('change',()=>{
    const chosen=Number(biomeSelect.value);
    if(!BIOME130_REGISTERED_IDS.includes(chosen))return;
    selected=chosen;selectedRotation=Number(biomeRotation.value);
    manual14Select.value='';pack3Palette.clear();pack2Selection=null;world.nextPack2State=null;
    document.getElementById('pack2StateText').textContent='Select a Pack 2 block to adjust its state.';
    document.querySelectorAll('[data-block]').forEach(q=>{
      q.classList.remove('selected');q.setAttribute('aria-pressed','false');
    });
    message('Selected '+biome130Block(selected).name+' · PLACE to build, MINE to remove');
  });
  const manual14Panel=document.createElement('div');
  manual14Panel.className='looksetting';
  manual14Panel.setAttribute('aria-label','Manual Block Packs 1 and 4');
  const manual14Heading=document.createElement('h2');
  manual14Heading.className='audit-title';
  manual14Heading.textContent='MANUAL BLOCK PACKS 1 & 4 · 53 PHYSICAL VARIANTS';
  const manual14Label=document.createElement('label');
  manual14Label.htmlFor='manual14Select';manual14Label.textContent='Shaped construction material';
  const manual14Select=document.createElement('select');
  manual14Select.id='manual14Select';
  const empty14=document.createElement('option');empty14.value='';
  empty14.textContent='Select a physical Block Pack 1/4 asset';
  manual14Select.append(empty14);
  for(const pack of [1,4]){
    const group=document.createElement('optgroup');
    group.label=pack===1?'Pack 1 · masonry, stone, flora':'Pack 4 · windows, lights, furnishings';
    for(const asset of MANUAL_FIVE_PACK_CATALOG.filter(x=>x.pack===pack)){
      const option=document.createElement('option');
      option.value=String(asset.numericId);
      option.textContent=asset.numericId+' · '+(asset.name||asset.symbol);
      group.append(option);
    }
    manual14Select.append(group);
  }
  const manual14RotateLabel=document.createElement('label');
  manual14RotateLabel.htmlFor='manual14Rotate';
  manual14RotateLabel.textContent='Shaped material orientation';
  const manual14Rotate=document.createElement('select');
  manual14Rotate.id='manual14Rotate';
  for(const [i,name] of ['North','East','South','West'].entries()){
    const option=document.createElement('option');option.value=String(i);option.textContent=name;
    manual14Rotate.append(option);
  }
  const manual14UpperLabel=document.createElement('label');
  manual14UpperLabel.htmlFor='manual14Upper';
  const manual14Upper=document.createElement('input');
  manual14Upper.type='checkbox';manual14Upper.id='manual14Upper';
  manual14UpperLabel.append(manual14Upper,document.createTextNode(' Upper slab/stair variant (IDs 15/16)'));
  const manual14Status=document.createElement('p');
  manual14Status.id='manual14Status';manual14Status.className='controlhint';
  manual14Status.setAttribute('role','status');
  manual14Status.textContent='Shaped objects save separately by seed; original world save stays schema-1.';
  manual14Panel.append(manual14Heading,manual14Label,manual14Select,
    manual14RotateLabel,manual14Rotate,manual14UpperLabel,manual14Status);
  const pack2Section=document.getElementById('pack2Materials')?.closest('.looksetting');
  if(pack2Section?.parentElement)pack2Section.insertAdjacentElement('beforebegin',manual14Panel);
  else help.querySelector('.helpbody')?.append(manual14Panel);
  manual14Select.addEventListener('change',()=>{
    const id=Number(manual14Select.value);
    if(!manual14Ids.has(id))return;
    selected=id;manual14Yaw=Number(manual14Rotate.value);
    manual14Variant=manual14Upper.checked?'upper':'lower';
    if(manual14Variant==='upper'&&id!==15&&id!==16){
      manual14Upper.checked=false;manual14Variant='lower';
    }
    pack2Selection=null;updatePack2SelectionUI();biomeSelect.value='';
    document.querySelectorAll('[data-block]').forEach(q=>{
      q.classList.remove('selected');q.setAttribute('aria-pressed','false');
    });
    pack3Palette.clear();
    manual14Status.textContent=manual14.blocked??('Selected '+BLOCK_NAMES[id]+
      ' · '+manual14Yaw*90+'° · Return then use PLACE/MINE');
  });
  manual14Rotate.addEventListener('change',()=>{manual14Yaw=Number(manual14Rotate.value);});
  manual14Upper.addEventListener('change',()=>{
    manual14Variant=(manual14Upper.checked&&[15,16].includes(selected))?'upper':'lower';
  });
  const pack3Palette=installPack3Palette(help,(id,yaw)=>{
    selected=id;pack3Yaw=yaw;biomeSelect.value='';manual14Select.value='';
    pack2Selection=null;updatePack2SelectionUI();
    document.querySelectorAll('[data-block]').forEach(q=>{
      q.classList.remove('selected');q.setAttribute('aria-pressed','false');
    });
    message('Selected '+BLOCK_NAMES[id]+' · facing '+yaw*90+'°');
  },{
    onExport:()=>({raw:exportPack3Portable(pack3,world,localStorage),seed:world.seed}),
    onImport:async raw=>{
      if(storageReadOnly||changed)throw Error('Save current world safely before importing physical construction');
      if(help.hidden||document.hidden||graphicsLost)throw Error('Pack 3 import requires active settings');
      const examined=inspectPack3Portable(raw,world);
      if(!window.confirm('Restore '+examined.count+' Pack 3 blocks for seed '+examined.seed+'? Existing construction is backed up first.'))
        return {message:'Pack 3 restore cancelled; existing construction unchanged'};
      const result=restorePack3Portable(raw,pack3,world,localStorage,{approved:true});
      if(result.requiresReload)location.reload();
      return {message:result.requiresReload?'Pack 3 restored and reloading':'Pack 3 record already current'};
    }
  });
  document.querySelectorAll('[data-block]').forEach(b=>b.onclick=()=>{
    selected=Number(b.dataset.block);
    biomeSelect.value='';manual14Select.value='';pack3Palette.clear();
    pack2Selection=isPack2LiveId(selected)?pack2NormalizeState(selected):null;
    selectedRotation=0;
    document.querySelectorAll('[data-block]').forEach(q=>{
      q.classList.toggle('selected',q===b);
      q.setAttribute('aria-pressed',String(q===b));
    });
    updatePack2SelectionUI();
    message('Selected '+(BLOCK_NAMES[selected]||'material'));
  });
  for(const [button,action] of [['pack2Rotate','rotate'],['pack2Variant','variant'],
    ['pack2WaterLevel','water-level'],['pack2WaterFlow','water-flow']]){
    document.getElementById(button).onclick=()=>{
      if(!pack2Selection){message('Select a Pack 2 material first');return;}
      pack2Selection=pack2CycleState(selected,pack2Selection,action);
      updatePack2SelectionUI();
    };
  }
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
        render:graphicsLost?'WebGL context lost':'WebGL2 active, '+chunks.size+' loaded GPU chunks; '+renderPreset+' '+canvas.width+'×'+canvas.height+' framebuffer pixels; mesh uploads '+meshCadence.meshes+', deferred frames '+meshCadence.skipped+', longest measured mesh '+meshCadence.slowestMs+' ms; GPU upload retry faults '+gpuRetry.stats().failures+', pending '+gpuRetry.stats().pendingRetries,
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
    // Legacy vault parser accepts the original schema-1 envelope while the
    // additional Pack 2 sidecar is retained for a complete JSON restore.
    const raw=JSON.stringify(world.pack2Cells.size?
      pack2ExportBundle(world):world.save());
    const snapshot=await createVaultBackup(raw);
    if(capturedSeed!==snapshot.seed)throw Error('Snapshot seed mismatch');
    await refreshVault(snapshot.id);
    vaultStatus.textContent='Verified device backup for seed '+snapshot.seed+
      ' ('+snapshot.edits+' legacy edits'+
      (world.pack2Cells.size?', '+world.pack2Cells.size+' Pack 2 placements':'')+
      '). Download JSON for an independent off-device copy.';
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
    // Legacy vault snapshots retain schema-1 bytes. Restore the independently
    // verified Pack 2 overlay for this seed, or abort before touching saves.
    const candidate=JSON.parse(snapshot.raw).pack2?
      pack2ImportBundle(JSON.parse(snapshot.raw),imported):
      loadPack2LiveWorld(localStorage,imported).world;
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
    const overlay=savePack2LiveWorld(localStorage,candidate);
    if(!overlay.ok)throw Error('Pack 2 verified overlay not updated; export backups before retry: '+overlay.reason);
    for(const c of chunks.values())deleteChunkBuffers(c);
    chunks.clear();pending.clear();lastStreamingCenter='';wanted.clear();
    gpuRetry.clear();
    outlineKey='';outlineCount=0;lastEditMeshKeys=[];
    g2NewWorld();world=candidate;world.nextPack2State=pack2Selection;pack3=createPack3LiveBridge(world,localStorage);resetManual14ForWorld();resetPack5ForWorld();storageReadOnly=false;changed=false;
    clearMirrorDownload();
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
      }
      mirrorStatus.textContent=requested?
        'Mirroring enabled; existing snapshots are unchanged. Sync to verify the current seed.':
        'Mirroring disabled. Already committed copies remain; automatic future copies stopped.';
      if(requested)scheduleMirrorForWorld();
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
      '. Check the current world and exported backups before retrying.';}
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
    const selectedSeed=world.seed,selectedVersion=mirrorSlot.value;
    const snap=await getMirrorCopy(selectedSeed,selectedVersion);
    if(world.seed!==selectedSeed)throw Error('Active world changed during export; select this seed again');
    mirrorDownloadUrl=URL.createObjectURL(new Blob([snap.raw],{type:'application/json'}));
    mirrorDownload.href=mirrorDownloadUrl;
    mirrorDownload.download='mythwrought-mirror-seed-'+selectedSeed+'-'+selectedVersion+'.json';
    mirrorDownload.hidden=false;
    mirrorStatus.textContent='Verified '+mirrorSlot.value+' copy. Tap the separate DOWNLOAD link to export this original schema-1 JSON file.';
  });
  document.getElementById('mirrorRestore').onclick=()=>withMirror(async()=>{
    if(storageReadOnly)throw Error('Read-only startup protection active; use the regular IMPORT flow to repair damaged saved bytes');
    await settleMirrorWrites(); // Never let an older queued write race a restore.
    const seed=world.seed,which=mirrorSlot.value;
    const snap=await getMirrorCopy(seed,which);
    const restored=importWorldData(snap.raw);
    const candidate=JSON.parse(snap.raw).pack2?
      pack2ImportBundle(JSON.parse(snap.raw),restored):
      loadPack2LiveWorld(localStorage,restored).world;
    if(restored.seed!==seed)throw Error('Mirror seed does not match the active world');
    if(!window.confirm('RESTORE the '+which+' verified mirror of seed '+seed+
      ' with '+snap.edits+' edits? The current primary will be kept in the previous-good local backup. Cancel changes nothing.')){
      mirrorStatus.textContent='Restore cancelled. No world or mirror copy changed.';return;
    }
    if(world.seed!==seed||changed)throw Error('World changed or contains unsaved edits; export or SAVE before restoring');
    const out=saveWorldSafe(localStorage,restored);
    if(!out.ok)throw Error('Canonical world restore failed; '+out.detail);
    const overlay=savePack2LiveWorld(localStorage,candidate);
    if(!overlay.ok)throw Error('Cannot verify Pack 2 state after restore: '+overlay.reason);
    for(const c of chunks.values())deleteChunkBuffers(c);
    chunks.clear();pending.clear();lastStreamingCenter='';wanted.clear();
    gpuRetry.clear();
    outlineKey='';outlineCount=0;lastEditMeshKeys=[];
    g2NewWorld();world=candidate;world.nextPack2State=pack2Selection;pack3=createPack3LiveBridge(world,localStorage);resetManual14ForWorld();resetPack5ForWorld();changed=false;respawnPrototype();
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
      for(const c of chunks.values())deleteChunkBuffers(c);
      chunks.clear();pending.clear();lastStreamingCenter='';wanted.clear();
    gpuRetry.clear();
      outlineKey='';outlineCount=0;lastEditMeshKeys=[];
      g2NewWorld();world=candidate;world.nextPack2State=pack2Selection;pack3=createPack3LiveBridge(world,localStorage);resetManual14ForWorld();resetPack5ForWorld();
      storageReadOnly=false;changed=false;respawnPrototype();
      clearMirrorDownload();
      seedLabel.textContent='WORLD '+world.seed;seedInput.value=String(world.seed);
      saveHealth.textContent='Verified separate seed '+world.seed+'; other world slots preserved.';
      seedMessage.textContent='World '+world.seed+' loaded safely. Other seeds remain separate.';
      message('Loaded seed '+world.seed+' with saved world edits');
      scheduleMirrorForWorld();
    }catch(err){seedMessage.textContent='World not changed: '+err.message;}
  };
  document.getElementById('export').onclick=()=>{
    try{
      const exported=world.pack2Cells.size?pack2ExportBundle(world):world.save();
      const data=JSON.stringify(exported,null,2);
      importWorldData(data); // Legacy schema-1 fields remain valid and unchanged.
      if(exported.pack2)pack2ImportBundle(exported,world.base); // Verify extended records.
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
      const rawImport=await f.text();
      const imported=importWorldData(rawImport); // Validate original schema-1 first.
      const incoming=JSON.parse(rawImport);
      const previousOverlay=loadPack2LiveWorld(localStorage,imported).world;
      // Legacy-only imports must NOT delete placed Pack 2 objects. Preserve
      // the matching per-seed sidecar, or refuse incompatible old-world bytes.
      const candidate=Object.hasOwn(incoming,'pack2')?
        pack2ImportBundle(incoming,imported):previousOverlay;
      const pack2Conflict=JSON.stringify(candidate.pack2Snapshot())!==
        JSON.stringify(previousOverlay.pack2Snapshot());
      if(!storageReadOnly&&!save())throw Error('Current world could not be verified saved; export first.');
      let existing=null,damaged=false;
      try{existing=loadWorldSafe(localStorage,imported.seed).world;}
      catch(_){damaged=true;}
      const conflict=existing&&JSON.stringify(existing.save())!==JSON.stringify(imported.save())&&
        (existing.edits.size>0||imported.seed===world.seed);
      if((damaged||conflict||pack2Conflict)&&!window.confirm(
        'Replace saved edits for seed '+imported.seed+
        (pack2Conflict?' AND its Pack 2 constructions?':'?')+
        ' Prior versions will be preserved in local backup slots where available. Cancel leaves the current world unchanged.'
      )){
        message('Import cancelled; existing world unchanged');return;
      }
      const outcome=saveWorldSafe(localStorage,imported,{allowReplaceCorrupt:damaged});
      if(!outcome.ok)throw Error(outcome.reason);
      const overlay=savePack2LiveWorld(localStorage,candidate);
      if(!overlay.ok)throw Error('Pack 2 sidecar not written; previous verified data retained: '+overlay.reason);
      g2NewWorld();world=candidate;world.nextPack2State=pack2Selection;pack3=createPack3LiveBridge(world,localStorage);resetManual14ForWorld();resetPack5ForWorld();storageReadOnly=false;changed=false;
      clearMirrorDownload();
      for(const c of chunks.values())deleteChunkBuffers(c);
      chunks.clear();pending.clear();lastStreamingCenter='';wanted.clear();
    gpuRetry.clear();
      outlineKey='';outlineCount=0;lastEditMeshKeys=[];
      respawnPrototype();seedLabel.textContent='WORLD '+world.seed;
      seedInput.value=String(world.seed);
      saveHealth.textContent='Imported verified schema-1 world with previous data preserved.';
      message('Imported world safely · '+world.edits.size+' block edit deltas');
      scheduleMirrorForWorld();
    }catch(err){message('Import rejected; existing world unchanged: '+err.message);}
    finally{e.target.value='';}
  });
  let graphicsLost=false,graphicsLossCount=0,graphicsRestoreCount=0;
  canvas.addEventListener('webglcontextlost',e=>{
    // Safari/WebKit can evict the WebGL context without losing JS or local
    // storage. Prevent default allows the browser to attempt recovery.
    e.preventDefault();
    if(graphicsLost)return;
    graphicsLost=true;graphicsLossCount++;
    pack5Gpu?.invalidate();
    frameDriver.pause();cancelAllPointers();
    frameHistory.frame(performance.now(),false);
    fatal('Graphics paused — attempting a safe WebGL recovery. Your saved world is untouched.');
  });
  canvas.addEventListener('webglcontextrestored',()=>{
    if(!graphicsLost)return;
    try{
      // Context loss invalidates EVERY old WebGL object; rebuilding only the
      // terrain mesh buffers while keeping old programs produces black frames.
      initializeGpuPipeline();
      // Invalidate ephemeral GPU cache, never world edits or save metadata.
      chunks.clear();pending.clear();wanted.clear();lastStreamingCenter='';
      pack5Gpu?.invalidate();
      gpuRetry.clear();meshCadence.resetCooldown();
      outlineKey='';outlineCount=0;lastTargetText='';
      lastEditMeshKeys=[];lastFrame=performance.now();
      graphicsLost=false;graphicsRestoreCount++;
      notice.hidden=true;
      message('Graphics restored · rebuilding the nearby world without reloading saves');
      if(!document.hidden)frameDriver.resume();
    }catch(error){
      // Fail closed: no half-initialized rendering loop and no world writes.
      graphicsLost=true;frameDriver.pause();
      fatal('Graphics recovery failed safely: '+error.message+' Reload to retry; saved worlds were not changed.');
    }
  });
  window.addEventListener('pagehide',()=>{
    frameDriver.pause();
    frameHistory.frame(performance.now(),false);
    cancelAllPointers();
    // Do not rewrite valid/externally damaged saves on an ordinary reload.
    // Actual edits already save synchronously; only retry if still dirty.
    if(changed&&!storageReadOnly)save();
    // Best effort only: Safari may terminate pending IndexedDB transactions.
    // Already-verified localStorage remains authoritative on force quit.
    if(mirrorEnabled&&pendingMirrors.size)flushMirror();
  });
  window.addEventListener('pageshow',()=>{
    // iOS Safari BFCache restoration can resume without rerunning this module.
    if(!document.hidden&&!graphicsLost){
      lastFrame=performance.now();
      frameDriver.resume();
    }
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
      teleportCave(x,y,z){
        // Local regression-only camera for inspecting actual underground art.
        // Never accessible from the public GitHub Pages build.
        if(![x,y,z].every(Number.isInteger)||collides(world,x+.5,y+.01,z+.5))
          throw Error('Unsafe local-only underground camera position');
        Object.assign(player,{x:x+.5,feet:y+.01,z:z+.5,
          vX:0,vY:0,vZ:0,onGround:true});
        jumpQueued=false;
        return {x:player.x,feet:player.feet,z:player.z};
      },
      aimAt(x,y,z){
        const dx=x+.5-player.x,dy=y+.5-(player.feet+1.55),dz=z+.5-player.z;
        player.yaw=Math.atan2(dx,dz);
        player.pitch=Math.atan2(dy,Math.hypot(dx,dz));
      },
      block(x,y,z){return manual14.layer.get([x,y,z])?.numericId??pack3.getAt(x,y,z)?.id??world.get(x,y,z);},
      manual14Block(x,y,z){return manual14.layer.get([x,y,z])??null;},
      // Localhost-only building-roadmap acceptance: the actual internal
      // production builder contract, not a separate mock voxel world.
      placeBuilderAsset(row){return fivePackBuilder.place(row);},
      placeManualBuilderBatch(rows){return fivePackBuilder.placeManual14Batch(rows);},
      builderInventory(){return fivePackBuilder.inventory;},
      placeManual14Fixture(x,y,z,id,yaw=0,variant='lower'){
        const item=manual14ById.get(id);
        if(!item)throw Error('Unknown Pack 1/4 ID');
        const entry={asset:item.symbol,numericId:id,at:[x,y,z],orientation:yaw,
          ...(item.pack===1?{variant}:{})};
        const result=manual14.placeMany([entry]);
        if(!result.ok)throw Error(result.reason);
        return {ok:true,id,at:[x,y,z],worldSchema:world.save().schema};
      },
      removeManual14Fixture(x,y,z){
        const result=manual14.remove([x,y,z]);
        if(!result.ok)throw Error(result.reason);
        return result;
      },
      pack3Block(x,y,z){return pack3.getAt(x,y,z);},
      placePack3Fixture(x,y,z,id,yaw=0){
        const result=pack3.mutate({mode:'place',cell:[x,y,z],id,orientation:yaw,
          player:{x:1e6,feet:19,z:1e6},rebuild:refreshPhysicalChunk});
        if(!result.ok)throw Error(result.reason);
        return result;
      },
      removePack3Fixture(x,y,z){
        const result=pack3.mutate({mode:'mine',cell:[x,y,z],rebuild:refreshPhysicalChunk});
        if(!result.ok)throw Error(result.reason);
        return result;
      },
      setOrientation(yaw,pitch){
        if(![yaw,pitch].every(Number.isFinite))throw Error('Invalid debug camera orientation');
        player.yaw=yaw;player.pitch=Math.max(-MAX_PITCH,Math.min(MAX_PITCH,pitch));
      },
      placeFixture(x,y,z,id){
        const old=world.get(x,y,z);
        if(!world.set(x,y,z,id))throw Error('Invalid test block');
        try{refreshEditedMeshes(x,z,y);}catch(err){world.set(x,y,z,old);throw err;}
        save();
      },
      // Localhost-only real-game GPU fixture, unavailable on deployed Pages.
      // Used by Chromium to verify the actual terrain shader + Pack 5 buffer.
      placePack5DenseTestFixture(count=64){
        if(!pack5Builder||!Number.isInteger(count)||count<1||count>96)
          throw Error('Invalid local-only Pack 5 dense fixture request');
        const old=pack5Builder.snapshot();
        const x=Math.floor(player.x)+4,z=Math.floor(player.z)+4;
        let added=0,heightTotal=0;
        try{
          for(let i=0;i<count;i++){
            const px=x+i%10*2,pz=z+Math.floor(i/10)*2;
            // Highest genuine solid-to-air transition: bricks sit on the
            // untouched seed terrain rather than floating above the camera.
            let accepted=false;
            for(let y=19;y>=1;y--){
              if(world.get(px,y,pz)!==0||world.get(px,y-1,pz)===0)continue;
              const result=pack5Builder.layer.place('pack5:080',[px,y,pz],i%4);
              if(result.ok){accepted=true;heightTotal+=y;break;}
            }
            if(!accepted)throw Error('No supported, empty test cell');
            added++;
          }
          pack5Builder.save();
          // Local-only test camera, aimed at actual authored rendered bricks.
          // No player position, terrain edits or touch controls are changed.
          const tx=x+9.5,tz=z+6.5,ty=heightTotal/count+.6;
          const dx=tx-player.x,dz=tz-player.z,dy=ty-(player.feet+1.55);
          player.yaw=Math.atan2(dx,dz);
          player.pitch=Math.max(-MAX_PITCH,
            Math.min(MAX_PITCH,Math.atan2(dy,Math.hypot(dx,dz))));
        }catch(error){
          pack5Builder.layer.restore(old);
          throw error;
        }
        pack5Gpu.refresh(eye());
        return {ok:true,added,total:pack5Builder.layer.count(),
          resident:pack5Gpu.stats(),schema:world.save().schema};
      },
      placePack5TestFixture(x,y,z){
        if(!pack5Builder||![x,y,z].every(Number.isSafeInteger))
          throw Error('Pack 5 test mode not initialized');
        const cell=[x,y,z];
        const result=pack5Builder.layer.place('pack5:080',cell,0);
        if(result.ok){
          try{pack5Builder.save();}
          catch(error){pack5Builder.layer.remove(cell);throw error;}
          pack5Gpu.refresh(eye());
          const dx=x+.5-player.x,dy=y+.5-(player.feet+1.55),dz=z+.5-player.z;
          player.yaw=Math.atan2(dx,dz);
          player.pitch=Math.atan2(dy,Math.hypot(dx,dz));
        }
        return {...result,scene:pack5Gpu.stats(),worldSchema:world.save().schema};
      },
      flightInfo(){return {active:g2Active(),profile:g2Active()?g2Flight.profile:'off',
        position:{x:player.x,y:player.feet,z:player.z},
        blocked:Boolean(g2Flight?.blocked),reason:g2Flight?.reason||'off',
        controlsPaused:g2Controls.paused,
        heldKeys:[...g2Controls.controls.keys],
        token:g2Token(),pendingPlans:g2Flight?.prefetch.pending.length||0,
        minY:WORLD_MIN_Y,maxY:WORLD_MAX_Y+1,
        bodyClear:g2Clear({x:player.x,y:player.feet,z:player.z}),
        resident:g2Ready({x:player.x,y:player.feet,z:player.z}),
        residentChunks:chunks.size};},
      snapshot(){return {chunks:[...chunks.keys()],pending:[...pending.keys()],
        lastEditMeshKeys:[...lastEditMeshKeys],editMeshBatches,seed:world.seed,
        frameDriver:frameDriver.snapshot(),meshCadence:meshCadence.stats(),
        gpuRetry:gpuRetry.stats(),pack3PhysicalBlocks:pack3.runtime.size(),
        manual14PhysicalBlocks:manual14.layer.size(),
        graphics:{lost:graphicsLost,lossCount:graphicsLossCount,
          restoredCount:graphicsRestoreCount,shaderReady:Boolean(program&&skyProgram)}};}
    });
  }
  saveHealth.textContent=storageReadOnly?
    'READ ONLY: damaged world data preserved; import or select another seed.':
    'Schema-1 saved edits; checksum journal and verified previous-world backup.';
  message(recoveryNote||'Move, look, mine and place · ☰ for help');
  // Restore saved shaped pieces without enabling construction editing.
  void restoreSavedPack5Scene();
  if(!document.hidden)frameDriver.resume();
}
