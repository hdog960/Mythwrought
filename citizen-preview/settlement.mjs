import {BIOMES,PROFESSIONS,RACES,SETTLEMENT_STYLES} from '../src/citizens/registry.mjs';
import {workplaceCompatible} from '../src/citizens/entity.mjs';
import {citizenInteraction} from '../src/citizens/jobs.mjs';
import {ordinaryAppearancePool} from '../src/citizens/ordinary-appearance.mjs';
import {planSettlementCitizens} from '../src/citizens/population.mjs';
import {createCitizenRenderer} from '../src/citizens/renderer.mjs';
import {createCitizenSimulation} from '../src/citizens/simulation.mjs';
import {loadCitizenState,saveCitizenState} from '../src/citizens/state.mjs';
import {MobEngine} from '../src/mobs/engine.mjs';
import {BehaviorController} from '../src/mobs/behavior.mjs';
import {MobCombat} from '../src/mobs/combat.mjs';
import {createLiveMobRenderer} from '../src/mobs/live-render.mjs';
import {createWorldQuery} from '../src/mobs/world-query.mjs';
import {BLOCK,meshChunk} from '../src/voxel.mjs';
import {formatSkyTime,SKY_DAY_TARGET_MS} from '../src/world-clock.mjs';

const field=id=>document.getElementById(id);
const options=(id,rows)=>field(id).replaceChildren(...rows.map(([value,label])=>new Option(label,value)));
const titled=values=>values.map(value=>[value,value.replaceAll('-',' ').replace(/^./,letter=>letter.toUpperCase())]);
const canvas=field('scene');
const playerBody={radius:.28,height:1.78};
const gl=canvas.getContext('webgl2',{alpha:false,antialias:true});
const worldSeed=179;
const fixtureLimit=48;
const housingColumns=[3.5,5.3,7.1,8.9,10.7,12.5,14.5,16.1];
const fixtureSizes={village:20,town:24,city:28};
const pools={temperate:BLOCK.GRASS,desert:BLOCK.DIRT,snow:BLOCK.STONE,
  'enchanted-forest':BLOCK.GRASS,mountain:BLOCK.DEEPSTONE};
const moving=new Set(['wander','move-to-workplace','return-to-settlement','flee','defend']);

options('style',titled(SETTLEMENT_STYLES));
options('biome',titled(BIOMES));
options('profession',[['','Ordinary citizen'],...Object.values(PROFESSIONS).map(({id,name})=>[id,name])]);
options('race',Object.values(RACES).map(({id,name})=>[id,name]));
options('hostile',[['hollowbound','Hollowbound'],['briarlurker','Briarlurker'],['ashfang','Ashfang']]);
field('profession').value='blacksmith';

function makeSettlement(style,biome) {
  const id=`citizen-fixture-${style}-${biome}`;
  const side=fixtureSizes[style];
  const settlement={
    id,type:style,biome,name:`Test ${style}`,populationLimit:fixtureLimit,
    regions:[{minX:1,maxX:side-1,minZ:1,maxZ:side-1}],
    housing:Array.from({length:fixtureLimit},(_,index)=>({
      id:`home-${String(index).padStart(2,'0')}`,
      position:[housingColumns[index%8],0,3.5+Math.floor(index/8)*1.7],
    })),
    workplaces:Object.values(PROFESSIONS).flatMap((role,index)=>{
      const idPrefix=`work-${String(index).padStart(2,'0')}`;
      const tags=[role.workplaceTags[0]];
      const label=role.name+' station';
      const primary=[3.5+(index%8)*1.8,0,3.5+Math.floor(index%40/8)*1.7];
      // A large fixture needs reachable anchors for the later housing rows.
      // The original anchor ID stays valid for previously saved fixtures.
      return [primary,[primary[0]+.6,0,primary[2]],[5.5,0,10.5],[10.5,0,10.5],[15.5,0,10.5]].map((position,slot)=>({
        id:slot===0?idPrefix:`${idPrefix}-${slot}`,settlementId:id,label,tags,position,
        waypoints:[[7.5,0,9.5],[11.5,0,12.5]],
      }));
    }),
    gathering:[[3.5,0,3.5],[12.5,0,11.5]],
  };
  // Authored rectangular test grounds, simple walls, and no production assets.
  const terrain={seed:worldSeed,get(x,y,z) {
    if (x<0 || z<0 || x>=side || z>=side) return BLOCK.AIR;
    if (y===-1) return pools[biome];
    if (y>=0 && y<=2 && x===13 && z>=12 && z<=15) return BLOCK.WOOD;
    if (y===0 && (x===0 || z===0 || x===side-1 || z===side-1)) return BLOCK.STONE;
    return BLOCK.AIR;
  }};
  return {settlement,terrain,side};
}

function combinedTerrain(terrain,side) {
  const parts=[];
  for(let x=0;x<Math.ceil(side/16);x++) for(let z=0;z<Math.ceil(side/16);z++) parts.push(meshChunk(terrain,x,z));
  const mesh=new Float32Array(parts.reduce((sum,part)=>sum+part.length,0));
  let offset=0;
  for(const part of parts) {
    mesh.set(part,offset);
    offset+=part.length;
  }
  // Citizen renderer uses the first six voxel floats; terrain has no joints.
  for(let i=6;i<mesh.length;i+=9) mesh.fill(0,i,i+3);
  return mesh;
}

const tell=message=>{field('message').textContent=message;};
let renderer,mobRenderer,engine,combat,simulation,fixture,query,scope;
let resident=true,citizens=[],slots=0,previous=0,accumulator=0,frame=0,started=0;
let lastReport=0,frameRequest=0;
const samples=[];
let assetLoadMs=0;
let modelLoadMs=0;

function refreshCitizenOptions() {
  const current=field('citizen').value;
  options('citizen',citizens.map(({citizen})=>{
    const description=citizenInteraction(citizen,{settlement:fixture.settlement});
    return [citizen.id,`${description.name} · ${description.profession??'Ordinary'}`];
  }));
  if (citizens.some(row=>row.citizen.id===current)) field('citizen').value=current;
  field('talk').disabled=citizens.length===0;
  refreshWorkplaceOptions();
}

function refreshWorkplaceOptions() {
  const citizen=citizens.find(row=>row.citizen.id===field('citizen').value)?.citizen;
  const compatible=citizen?.profession
    ? fixture.settlement.workplaces.filter(workplace=>workplaceCompatible(citizen,workplace))
    : [];
  const fieldName=field('workplace');
  options('workplace',compatible.length ? compatible.map(({id,label,position:[x,,z]})=>
    [id,`${label} (${x.toFixed(1)}, ${z.toFixed(1)})`]) : [['','No compatible workplace']]);
  if (compatible.some(place=>place.id===citizen.workplaceId)) fieldName.value=citizen.workplaceId;
  fieldName.disabled=field('assign').disabled=compatible.length===0;
}

function resetFixture() {
  const start=performance.now();
  renderer?.dispose();
  mobRenderer?.dispose();
  engine?.dispose();
  resident=true;
  field('residency').textContent='Unload settlement';
  fixture=makeSettlement(field('style').value,field('biome').value);
  scope={worldSeed,settlementId:fixture.settlement.id};
  query=createWorldQuery(fixture.terrain,{
    resident:()=>resident,
    observe:()=>({hazard:false,biome:fixture.settlement.biome==='enchanted-forest'?'forest':'meadow',dayPhase:'day'}),
  });
  engine=new MobEngine(query,worldSeed);
  combat=new MobCombat(engine,query,new BehaviorController(engine,query));
  simulation=createCitizenSimulation({query,settlement:fixture.settlement,mobEngine:engine});
  renderer=createCitizenRenderer(gl,{staticMesh:combinedTerrain(fixture.terrain,fixture.side),lodDistance:14});
  mobRenderer=createLiveMobRenderer(gl);
  citizens=[];
  slots=0;
  samples.length=0;
  delete canvas.dataset.profile;
  started=performance.now();
  previous=started;
  accumulator=0;
  assetLoadMs=performance.now()-start;
  modelLoadMs=0;
  field('citizenDetails').textContent='';
  refreshCitizenOptions();
}

function spawn() {
  if (!resident) throw Error('Load the settlement before spawning citizens.');
  const count=Number(field('count').value);
  if (slots+count>fixtureLimit) throw Error('Clear the fixture before spawning above 48.');
  const profession=field('profession').value||null;
  const race=field('race').value, variant=Number(field('variant').value);
  const pool=ordinaryAppearancePool(fixture.settlement.biome);
  const requests=Array.from({length:count},(_,index)=>{
    const slot=slots+index;
    const chosen=profession ? {race,variant,profession} :
      pool.find(row=>row.race===race&&row.variant===variant)??pool[slot%pool.length];
    return {slot,...chosen,homeId:fixture.settlement.housing[slot].id};
  });
  const preparing=performance.now();
  const planned=planSettlementCitizens({worldSeed,settlement:fixture.settlement,requests,query});
  for(const {citizen,position} of planned) simulation.add(citizen,position);
  slots+=count;
  modelLoadMs=performance.now()-preparing;
  citizens=simulation.snapshots();
  samples.length=0;
  delete canvas.dataset.profile;
  refreshCitizenOptions();
  tell(`Spawned ${count} citizen${count===1?'':'s'}.`);
}

function spawnHostile() {
  if (!resident) throw Error('Load the settlement before spawning creatures.');
  const target=citizens.find(row=>row.citizen.id===field('citizen').value)?.position??[3.5,0,3.5];
  const position=[Math.min(fixture.side-2,target[0]+2.5),0,target[2]];
  if (!engine.spawn(field('hostile').value,position)) throw Error('No safe hostile spawn or the mob limit was reached.');
  tell('The existing mob engine spawned a hostile.');
}

function selectTarget() {
  for (const enemy of engine.all()) {
    if (enemy.species.classification!=='hostile' || enemy.health<=0 || enemy.state==='dormant') continue;
    let best=null,range=9;
    for (const row of citizens) {
      const distance=Math.hypot(...row.position.map((value,index)=>value-enemy.position[index]));
      if (row.health>0 && distance<range) {
        best=row;
        range=distance;
      }
    }
    if (best) return simulation.combatTarget(best.citizen.id);
  }
  return null;
}

function tick(seconds) {
  if (!resident) return;
  combat.advance(seconds,selectTarget());
  const selected=field('view').value==='follow'?
    citizens.find(row=>row.citizen.id===field('citizen').value):null;
  const mid=fixture.side*.48;
  citizens=simulation.step(seconds,{focus:selected?.position??[mid,0,mid]});
}

function render(now) {
  const elapsed=Math.max(0,now-previous);
  previous=now;
  accumulator+=Math.min(100,elapsed);
  const aiStart=performance.now();
  for(let ticks=0;accumulator>=1000/15 && ticks<2;ticks++) {
    accumulator-=1000/15;
    tick(1/15);
  }
  const aiMs=performance.now()-aiStart;
  const time=(now-started)/1000;
  const ratio=Math.min(devicePixelRatio,1.5);
  const width=Math.round(canvas.clientWidth*ratio),height=Math.round(canvas.clientHeight*ratio);
  if (canvas.width!==width || canvas.height!==height) {
    canvas.width=width;
    canvas.height=height;
  }
  const aspect=width/height;
  const following=field('view').value==='follow'?
    citizens.find(row=>row.citizen.id===field('citizen').value):null;
  const mid=fixture.side*.48;
  const center=following ? [following.position[0],following.position[1]+.87,following.position[2]] : [mid,0,mid];
  const pitch=following ? .29 : .68;
  const angle=.34;
  const d=following ? 3.55 : fixture.side*.77;
  const forward=[-Math.sin(angle)*Math.cos(pitch),-Math.sin(pitch),-Math.cos(angle)*Math.cos(pitch)];
  const eye=center.map((value,axis)=>value-d*forward[axis]);
  const right=[Math.cos(angle),0,-Math.sin(angle)];
  const up=[-Math.sin(angle)*Math.sin(pitch),Math.cos(pitch),-Math.cos(angle)*Math.sin(pitch)];
  const camera={eye,forward,right,up,aspect,time,tanHalfFov:Math.tan(Math.PI/5)};
  gl.viewport(0,0,width,height);
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(.34,.44,.48,1);
  gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  const renderStart=performance.now();
  const visible=resident?citizens:[];
  const stats=renderer.draw(visible,camera);
  const creatures=mobRenderer.render(resident?engine.all():[],{...camera,light:[1,1,1],fog:[.34,.44,.48]});
  const drawMs=performance.now()-renderStart;
  samples.push({frameMs:elapsed,aiMs,drawMs,nav:resident?simulation.navigationWork:0});
  if (samples.length>180) samples.shift();
  const occupations=citizens.filter(row=>row.state==='perform-job').length;
  const counts={citizens:citizens.length,visible:visible.length,moving:resident?citizens.filter(row=>moving.has(row.state)).length:0,
    professions:occupations,fleeing:citizens.filter(row=>row.state==='flee').length,
    defending:citizens.filter(row=>row.state==='defend').length,hostiles:creatures.actors};
  const mobHealth=resident?engine.all().map(mob=>mob.health):[];
  Object.assign(canvas.dataset,counts,{frame:++frame,draws:stats.drawCalls+creatures.draws+1,
    cachedBytes:stats.gpuBytes+creatures.bytes,terrainBytes:stats.terrainBytes,vertices:stats.vertices,mobHealth:mobHealth.join(','),
    health:citizens.map(row=>row.health).join(',')});
  if (now-lastReport>=260) {
    lastReport=now;
    const quantile=(field,p)=>{
      const times=samples.map(sample=>sample[field]).sort((a,b)=>a-b);
      return times[Math.max(0,Math.floor((times.length-1)*p))]??0;
    };
    const report={
      samples:samples.length,frameP50Ms:quantile('frameMs',.5),frameP95Ms:quantile('frameMs',.95),
      aiP95Ms:quantile('aiMs',.95),drawCpuP95Ms:quantile('drawMs',.95),navigationP95:quantile('nav',.95),
      fixtureSetupMs:assetLoadMs,populationSetupMs:modelLoadMs,
      ...(performance.memory?{approximateJsHeapBytes:performance.memory.usedJSHeapSize}:{}),
    };
    canvas.dataset.profile=JSON.stringify(report);
    field('report').textContent=`${counts.citizens} citizens · ${counts.moving} moving · ${canvas.dataset.draws} draws · ${report.frameP95Ms.toFixed(1)} ms frame p95`;
  }
  frameRequest=requestAnimationFrame(render);
}

function action(id,handler) {
  field(id).addEventListener('click',()=>{
    try { handler(); }
    catch(error) { tell(error.message); }
  });
}

if (!gl) tell('This test settlement requires WebGL2.');
else {
  resetFixture();
  action('spawn',spawn);
  action('spawnHostile',spawnHostile);
  action('clear',()=>{resetFixture();tell('Fixture cleared.');});
  action('residency',()=>{
    resident=!resident;
    field('residency').textContent=resident?'Unload settlement':'Reload settlement';
    tell(resident?'Settlement reloaded.':'Settlement unloaded. Citizens are paused.');
  });
  action('save',()=>{saveCitizenState(localStorage,scope,simulation.snapshots());tell('Citizen sidecar saved.');});
  action('reload',()=>{
    const saved=loadCitizenState(localStorage,scope);
    resetFixture();
    for(const row of saved.citizens) simulation.add(row.citizen,row.position,{health:row.health});
    citizens=simulation.snapshots();
    slots=Math.max(0,...citizens.map(row=>row.citizen.slot+1));
    refreshCitizenOptions();
    tell(`Loaded ${citizens.length} saved citizens.`);
  });
  action('assign',()=>{
    const id=field('citizen').value;
    const available=fixture.settlement.workplaces.find(workplace=>workplace.id===field('workplace').value);
    if (!available) throw Error('Choose a compatible workplace.');
    simulation.assign(id,available.id);
    citizens=simulation.snapshots();
    refreshWorkplaceOptions();
    tell(`Assigned ${available.label}.`);
  });
  action('talk',()=>{
    const selected=citizens.find(row=>row.citizen.id===field('citizen').value);
    if (!selected) return;
    const approach=[[0,.95],[.95,0],[0,-.95],[-.95,0]].map(([x,z])=>
      [selected.position[0]+x,selected.position[1],selected.position[2]+z])
      .find(position=>query.grounded(position,playerBody));
    if (!approach) {
      field('citizenDetails').textContent='There is no safe approach to this citizen.';
      return;
    }
    const player={position:approach};
    const description=simulation.interact(selected.citizen.id,{player,sky:{
      time:formatSkyTime(SKY_DAY_TARGET_MS+(performance.now()-started)),phase:'day',
    }});
    field('citizenDetails').textContent=description
      ? `${description.name} · ${description.profession??'Ordinary citizen'}. ${description.message}`
      : 'This citizen is unavailable nearby.';
  });
  field('citizen').addEventListener('change',refreshWorkplaceOptions);
  for(const id of ['style','biome']) field(id).addEventListener('change',resetFixture);
  canvas.addEventListener('webglcontextlost',event=>{
    event.preventDefault();
    cancelAnimationFrame(frameRequest);
    tell('WebGL paused.');
  });
  canvas.addEventListener('webglcontextrestored',()=>{
    renderer=createCitizenRenderer(gl,{staticMesh:combinedTerrain(fixture.terrain,fixture.side),lodDistance:14});
    mobRenderer=createLiveMobRenderer(gl);
    previous=performance.now();
    frameRequest=requestAnimationFrame(render);
  });
  frameRequest=requestAnimationFrame(render);
}
