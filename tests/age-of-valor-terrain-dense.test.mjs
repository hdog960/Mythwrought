import {test} from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK} from '../src/voxel.mjs';
import {createProjectile,createProjectileTargetFrame} from '../src/age-of-valor/projectile.mjs';
import {createProjectilePool} from '../src/age-of-valor/projectile-pool.mjs';
import {denseCombatStress} from '../src/age-of-valor/dense-stress.mjs';
import * as terrain from '../src/age-of-valor/terrain-trace.mjs';
function cases(check,api,makeProjectile,makePool,makeFrame,dense,oldFrame,oldProjectile){
 const {sweptSphereBox,createVoxelProjectileTrace,resolveLegacyVoxelShape}=api;
 const box=[1,0,0,2,1,1];
 check(Math.abs(sweptSphereBox([0,.5,.5],[2,.5,.5],.2,box)-.4)<1e-8,'sphere face');
 check(sweptSphereBox([0,1.19,1.19],[2,1.19,1.19],.2,box)===null,'rounded corner not expanded cube');
 check(Math.abs(sweptSphereBox([0,1.12,1.16],[2,1.12,1.16],.2,box)-.5)<2e-6,'corner tangency');
 check(sweptSphereBox([1.5,.5,.5],[1.5,.5,.5],0,box)===0,'initial overlap');
 const identity={worldId:'w',profileId:'p',sourceId:'s',fixture:true},q={...identity,from:[0,.5,.5],to:[2,.5,.5],radius:.2};
 let revision=1,available=true,unknown=false,overlay=[],changed=false;
 const world={get:(x,y,z)=>unknown?999:x===1&&y===0&&z===0?3:0};
 const adapter=createVoxelProjectileTrace({world,identity,readRevision:()=>revision,residentCell:()=>available,resolveShape:resolveLegacyVoxelShape,readOverlays:()=>{if(changed)revision++;return{complete:true,revision,boxes:overlay}}});
 check(Math.abs(adapter.trace(q).fraction-.4)<1e-8,'actual reader wall');overlay=[[.4,0,0,.5,1,1]];check(Math.abs(adapter.trace(q).fraction-.1)<1e-8,'overlay earlier');
 available=false;check(!adapter.trace(q).complete,'unresident');available=true;unknown=true;check(!adapter.trace(q).complete,'unknown id');unknown=false;changed=true;check(!adapter.trace(q).complete,'revision race');changed=false;
 check(!adapter.trace({...q,profileId:'wrong'}).complete,'wrong scope');
 const shapeAdapter=createVoxelProjectileTrace({world:{get:()=>99},identity,readRevision:()=>1,residentCell:()=>true,resolveShape:({cell})=>({complete:true,boxes:cell.join(',')==='1,0,0'?[[0,0,0,1,.25,1]]:[]}),readOverlays:()=>({complete:true,revision:1,boxes:[]})});
 check(shapeAdapter.trace({...q,radius:.1}).fraction===null,'partial shape clear');check(shapeAdapter.trace({...q,from:[0,.2,.5],to:[2,.2,.5],radius:.1}).fraction!==null,'partial shape hit');
 const opts={identity:{...identity,actionId:'a',projectileId:'p1',definitionId:'fixture:bolt'},origin:[0,.5,.5],velocity:[100,0,0],radius:.1,range:10,lifeMs:10};
 overlay=[];const projectile=makeProjectile({...opts,readAuthority:()=>({...opts.identity,active:true}),traceTerrain:adapter.trace,readTargets:()=>[]});check(projectile.step(10).impact.type==='terrain-impact','actual projectile reads wall');
 const target=(id,from,to,radius)=>({id,from,to,radius,alive:true,friendly:false,attackable:true,resident:true});
 let seed=719;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 for(let i=0;i<250;i++){
  const targets=Array.from({length:20},(_,j)=>{const a=[rand()*5-2,rand()*4-1,rand()*4-1.5];return target('t:'+j,a,a.map(x=>x+(rand()-.5)*.9),.01+rand()*1.2);});
  const make=(P,F)=>P({...opts,readAuthority:()=>({...opts.identity,active:true}),traceTerrain:()=>({complete:true,fraction:null}),readTargets:()=>F({identity,fromMs:0,targets,complete:true})}).step(10);
  check(JSON.stringify(make(makeProjectile,makeFrame))===JSON.stringify(make(oldProjectile,oldFrame)),'frame filter parity '+i);
 }
 const baseline={parity:true,indexed:{candidates:737280}},optimized=dense({projectile:makeProjectile,pool:makePool,frame:makeFrame});
 check(baseline.parity&&optimized.parity&&optimized.indexed.impacts===640&&optimized.indexed.candidates<baseline.indexed.candidates,'dense optimization and impact parity');
 return {baseline,optimized};
}
test('AV16 swept terrain and dense candidate filter',()=>{const direct=({targets})=>targets;const m=cases((ok,name)=>assert.ok(ok,name),terrain,createProjectile,createProjectilePool,createProjectileTargetFrame,denseCombatStress,direct,createProjectile);console.log(JSON.stringify(m))});
test('AV11 original VoxelWorld edited upper terrain and unchanged save',()=>{const world=new VoxelWorld(179);assert.equal(world.set(1,200,0,BLOCK.STONE),true);const before=JSON.stringify(world.save());const identity={worldId:'fixture:w',profileId:'fixture:p',sourceId:'fixture:s',fixture:true};const adapter=terrain.createVoxelProjectileTrace({world,identity,readRevision:()=>1,residentCell:()=>true,resolveShape:terrain.resolveLegacyVoxelShape,readOverlays:()=>({complete:true,revision:1,boxes:[]})});const hit=adapter.trace({...identity,from:[0,200.5,.5],to:[2,200.5,.5],radius:.2});assert.equal(hit.complete,true);assert.ok(Math.abs(hit.fraction-.4)<1e-8);assert.equal(JSON.stringify(world.save()),before)});
