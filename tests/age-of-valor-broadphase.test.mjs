import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createProjectile,createProjectileTargetFrame} from '../src/age-of-valor/projectile.mjs';
import {createProjectilePool} from '../src/age-of-valor/projectile-pool.mjs';
import {compareBroadphase} from '../src/age-of-valor/broadphase-stress.mjs';
function cases(check,makeProjectile,makePool,makeFrame,compare){
 const scope={worldId:'w',profileId:'p',sourceId:'s',fixture:true},identity={...scope,actionId:'a',projectileId:'p1',definitionId:'fixture:bolt'};
 const target=(id,from,to=from,radius=.1)=>({id,from,to,radius,alive:true,friendly:false,attackable:true,resident:true});
 const opts={identity,origin:[0,1,0],velocity:[100,0,0],radius:.05,range:10,lifeMs:100,readAuthority:()=>({...identity,active:true}),traceTerrain:()=>({complete:true,fraction:null})};
 const run=(targets,wall=null,indexed=false,extra={})=>makeProjectile({...opts,...extra,traceTerrain:()=>({complete:true,fraction:wall}),readTargets:()=>indexed?makeFrame({identity:scope,fromMs:0,targets,complete:true}):targets}).step(10);
 const equal=(t,w=null,extra={})=>JSON.stringify(run(t,w,false,extra))===JSON.stringify(run(t,w,true,extra));
 check(equal([target('moving',[.5,0,0],[.5,2,0])]),'moving sweep');check(equal([target('a',[.4,1,0])],.25),'terrain tie');
 check(equal([target('a',[.4,1,0]),target('b',[.4,1,0])]),'stable tie');
 check(equal([target('a',[8,1,0])],null,{origin:[7.5,1,0]}),'positive cell boundary');
 check(equal([target('a',[-8,1,0])],null,{origin:[-8.5,1,0]}),'negative cell boundary');
 check(equal([target('a',[.4,1,4], [.4,1,4],4)]),'large radius');
 check(equal([target('a',[.4,1,0])],null,{range:.25}),'range clip');
 check(equal([target('a',[.4,-209,0])],null,{origin:[0,-209,0]}),'deep');
 check(!run([{...target('a',[100,1,0]),resident:false}],null,true).ok,'unresolved far target fails');
 check(!run([target('a',[100,1,0]),target('a',[.4,1,0])],null,true).ok,'duplicate fails');
 check(!makeProjectile({...opts,readTargets:()=>makeFrame({identity:scope,fromMs:10,targets:[],complete:true})}).step(10).ok,'stale frame fails');
 let seed=137;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
 for(let i=0;i<250;i++){const t=Array.from({length:16},(_,j)=>{const a=[rand()*4-1,rand()*3,rand()*4-2];return target('t:'+j,a,a.map(x=>x+(rand()-.5)*.8),.01+rand()*.9)});check(equal(t,i%3===0?rand():null),'seeded parity '+i);}
 const p=makePool({capacity:3,makeProjectile,authorizeLaunch:()=>true});
 for(const [i,x] of [[1,.7],[2,.2],[3,.2]]){const ident={...identity,projectileId:'p'+i};check(p.launch({sequence:i,options:{...opts,identity:ident,readAuthority:()=>({...ident,active:true}),readTargets:()=>[target('t',[x,1,0])]}}),'pool launch');}
 const e=p.advance(10).events;check(e.map(x=>x.id).join(',')==='p2,p3,p1','chronological stable impact order');
 const stress=compare({makeProjectile,makePool,makeFrame,cycles:20});check(stress.baseline.candidates===819200&&stress.indexed.candidates===0&&stress.indexed.validated===25600&&stress.indexed.terrain===6400&&stress.indexed.launches===640,'stress operation parity');return stress;
}
test('AV16 shared spatial frame, swept parity and chronological impacts',()=>{const r=cases((ok,name)=>assert.ok(ok,name),createProjectile,createProjectilePool,createProjectileTargetFrame,compareBroadphase);console.log(JSON.stringify(r))});
