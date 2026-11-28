import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createProjectile,createProjectileTargetFrame} from '../src/age-of-valor/projectile.mjs';
import {createProjectilePool} from '../src/age-of-valor/projectile-pool.mjs';
import {createOwnerCollisionFrames} from '../src/age-of-valor/collision-owner.mjs';
import {denseCombatStress} from '../src/age-of-valor/dense-stress.mjs';
function cases(check,projectile,pool,frame,owner,dense){
 const scope={worldId:'w',profileId:'p',sourceId:'s',fixture:true},identity={...scope,actionId:'a',projectileId:'p1',definitionId:'fixture:bolt'};
 const opts={identity,origin:[0,1,0],velocity:[100,0,0],radius:.05,range:10,lifeMs:10,readAuthority:()=>({...identity,active:true}),traceTerrain:()=>({complete:true,fraction:null}),readTargets:()=>[]};
 const t={id:'t',from:[.25,2,0],to:[.25,1,0],radius:.1,alive:true,friendly:false,attackable:true,resident:true};
 const a=projectile({...opts,range:.25,readTargets:()=>frame({identity:scope,fromMs:0,targets:[t],complete:true})}).step(10);
 check(a.impact===null&&a.reason==='range-expired','clipped target not falsely moved full interval');
 const b=projectile({...opts,range:.25,readTargets:()=>[{...t,to:[.25,1.75,0]}]}).step(10);check(JSON.stringify(a)===JSON.stringify(b),'direct clipped parity');
 let p; p=projectile({...opts,traceTerrain:()=>{p.close();return{complete:true,fraction:0}}});check(!p.step(10).ok&&p.snapshot().terminal.type==='retired','reentrant terrain retirement');
 let active=true;p=projectile({...opts,readAuthority:()=>({...identity,active}),readTargets:()=>{active=false;return[t]}});check(!p.step(10).ok,'revoked during targets');
 let x;x=pool({capacity:1,makeProjectile:projectile,authorizeLaunch:()=>{x.close();return true}});check(!x.launch({sequence:1,options:opts})&&x.snapshot().count===0,'reentrant launch');
 x=pool({capacity:1,makeProjectile:projectile,authorizeLaunch:()=>true,readSharedFrame:()=>{x.close();return frame({identity:scope,fromMs:0,targets:[],complete:true})}});x.launch({sequence:1,options:opts});check(!x.advance(10).ok&&x.snapshot().closed,'reentrant frame close');
 x=pool({capacity:1,makeProjectile:projectile,authorizeLaunch:()=>true});x.launch({sequence:1,options:opts});x.advance(10);check(!x.launch({sequence:2,options:opts}),'legacy ID cannot repeat');
 x=pool({capacity:1,makeProjectile:projectile,authorizeLaunch:()=>true,launchNamespace:'session:1'});const launch=(p,n)=>p.launch({sequence:n,options:{...opts,identity:{...identity,projectileId:'session:1:'+n},readAuthority:()=>({...identity,projectileId:'session:1:'+n,active:true})}});
 check(launch(x,1)&&x.advance(10).ok,'canonical launch');const cp=x.checkpoint();x=pool({capacity:1,makeProjectile:projectile,authorizeLaunch:()=>true,launchNamespace:'session:1',restored:cp});check(!launch(x,1)&&launch(x,2),'restored launch sequence');
 const o=owner({identity:scope,makeFrame:frame,readOwnerFrame:q=>({version:1,verified:true,complete:true,identity:scope,fromMs:q.fromMs,toMs:q.toMs,revision:2,targets:[]})});
 check(o.read({identity:scope,fromMs:0,toMs:10}).fromMs===0,'owner scoped frame');check(o.read({identity:scope,fromMs:10,toMs:20}).fromMs===10,'next frame');
 let rejected=false;try{o.read({identity:scope,fromMs:10,toMs:20})}catch{rejected=true}check(rejected,'owner replay denied');
 const bad=owner({identity:scope,makeFrame:frame,readOwnerFrame:q=>({version:1,verified:true,complete:false,identity:scope,fromMs:q.fromMs,toMs:q.toMs,revision:0,targets:[]})});rejected=false;try{bad.read({identity:scope,fromMs:0,toMs:10})}catch{rejected=true}check(rejected&&bad.snapshot().closed,'incomplete owner frame retires');
 const s=dense({projectile,pool,frame});check(s.parity&&s.direct.impacts===640&&s.indexed.impacts===640&&s.indexed.validated<s.direct.validated,'dense impact parity');return s;
}
test('AV16 dense impacts, lifetime replay, owner frame and reentrant retirement',()=>{const metrics=cases((ok,name)=>assert.ok(ok,name),createProjectile,createProjectilePool,createProjectileTargetFrame,createOwnerCollisionFrames,denseCombatStress);console.log(JSON.stringify(metrics))});
