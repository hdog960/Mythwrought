// Seed-driven, per-desert-tile detached admission. No production generator
// registration, save write, settlement, or implicit reservation authority.
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR} from './profile-world.mjs';
import {v6BiomeAt} from './v6-balanced-biomes.mjs';
import {beginP0DetachedResearch} from './forgotten-sands-detached-research.mjs';
import {P0_MAX_COLUMNS_PER_STEP} from './forgotten-sands-grounded-probe.mjs';
export const P0_SITE_POLICY='forgotten-sands-tile-site-research-v1';
const hash=(x,z,seed)=>{let h=Math.imul(x,0x27d4eb2d)^Math.imul(z,0x165667b1)^Math.imul(seed,0x85ebca6b);h=Math.imul(h^(h>>>16),0x45d9f3b);return (h^(h>>>16))>>>0;};
const digest=async rows=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(rows)))),v=>v.toString(16).padStart(2,'0')).join('');
const key=(x,y,z)=>[x,y,z].join(',');
const WALK_FRAMES_PER_SLICE=120;
async function route(view,site,start,V,F,yieldControl,still){
 const dx=site.x+.5-start.x,dz=site.z+.5-start.z,dist=Math.hypot(dx,dz),p={...start,yaw:Math.atan2(dx,dz),vX:0,vZ:0,vY:0,onGround:true,coyote:.09,jumpBuffer:0};
 const progress=()=>((p.x-start.x)*dx+(p.z-start.z)*dz)/dist;
 if(V.collides(view,p.x,p.feet,p.z)||!V.collides(view,p.x,p.feet-.065,p.z))return null;
 let forward=0,back=0;
 while(progress()<dist&&forward++<900){
  F.stepPlayer(view,p,{forward:1},1/60);if(V.collides(view,p.x,p.feet,p.z))return null;
  if(yieldControl&&forward%WALK_FRAMES_PER_SLICE===0){await yieldControl({stage:'walk',frames:WALK_FRAMES_PER_SLICE});if(!still())return null;}
 }
 if(progress()<dist)return null;
 p.vX=0;p.vZ=0;
 while(progress()>.1&&back++<900){
  F.stepPlayer(view,p,{forward:-1},1/60);if(V.collides(view,p.x,p.feet,p.z))return null;
  if(yieldControl&&back%WALK_FRAMES_PER_SLICE===0){await yieldControl({stage:'walk',frames:WALK_FRAMES_PER_SLICE});if(!still())return null;}
 }
 return progress()<=.1?{forward,back}:null;
}
export async function researchP0TileSite(current,tx,tz,{P,V,F,H,reserved,revision,yieldControl}={}){
 if(!P||!V||!F||!H||!(current instanceof P.FourRegionWorld)||current.generationProfile.generator!==P.M8_MOUNTAIN_GENERATOR||![tx,tz].every(Number.isSafeInteger)||Math.max(Math.abs(tx),Math.abs(tz))>1900||typeof reserved!=='function'||typeof revision!=='function')throw Error('Invalid fresh M8 tile research');
 if(yieldControl!==undefined&&typeof yieldControl!=='function')throw TypeError('Expected a source scheduler callback');
 const epoch=revision(),snapshot=JSON.stringify(current.save()),seed=current.seed,cx=tx*512,cz=tz*512;
 const denied=(reason,attempts=[])=>Object.freeze({accepted:false,reason,attempts:Object.freeze(attempts),placementAuthority:false});
 if(typeof epoch!=='string'||!epoch||current.edits.size!==0)return denied('not-fresh-or-unversioned-source');
 if(v6BiomeAt(cx,cz,seed)?.name!=='desert')return denied('not-desert-macrotile');
 const original=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR)),attempts=[];
 const still=()=>revision()===epoch&&JSON.stringify(current.save())===snapshot;
 const veto=(x,z)=>revision()!==epoch||reserved(x,z)!==false;
 // Every centre and its full 8-cell apron are confined to the nominal
 // tile; deterministic candidate order is independent of stream/load order.
 const offsets=[];for(const dz of [-128,-64,0,64,128])for(const dx of [-128,-64,0,64,128])offsets.push({dx,dz,rank:hash(cx+dx,cz+dz,seed)});
 offsets.sort((a,b)=>a.rank-b.rank||a.dz-b.dz||a.dx-b.dx);
 for(const size of [31,15])for(const {dx,dz} of offsets){
  if(!still())return denied('stale-source',attempts);
  const site={seed,x:cx+dx,z:cz+dz,size,height:size===31?28:15};
  const job=beginP0DetachedResearch(original,site,{reserved:veto});let q;
  do{
   const prior=q?.scannedColumns??0;
   q=job.step();
   if(yieldControl){await yieldControl({stage:'survey',columns:q.scannedColumns-prior});if(!still())return denied('stale-source',attempts);}
  }while(q.accepted===null);
  if(!q.accepted){attempts.push({size,x:site.x,z:site.z,reason:q.reason});continue;}
  const views=[];
  for(let turn=0;turn<4;turn++){
   const d=job.researchView({approach:true,turn});if(d.accepted)views.push(d);
   if(yieldControl){await yieldControl({stage:'approach',turn});if(!still())return denied('stale-source',attempts);}
  }
  views.sort((a,b)=>a.approach.addedCells-b.approach.addedCells||a.approach.turn-b.approach.turn);
  for(const d of views){
   const r=(size-1)/2+8,rows=[],cells=new Map();let conflict=false,sourceReads=0,columns=0;
   // Current source checked independently over whole surface envelope,
   // plus every proposed upper cell. Never replace original solid/cave AIR.
   for(let x=site.x-r;x<=site.x+r&&!conflict;x++)for(let z=site.z-r;z<=site.z+r&&!conflict;z++){
    if(yieldControl&&columns===P0_MAX_COLUMNS_PER_STEP){
     await yieldControl({stage:'native-scan',columns});
     if(!still())return denied('stale-source',attempts);
     columns=0;
    }
    columns++;
    for(let y=-3;y<=19;y++){
     const a=original.get(x,y,z),b=current.get(x,y,z);sourceReads++;
     if(a!==b||original.environmentCaves.get(x,y,z)!==current.environmentCaves.get(x,y,z)){conflict=true;break;}
    }
    if(conflict)break;
    for(let y=0;y<=d.maxY;y++){
     const a=original.get(x,y,z),b=d.view.get(x,y,z);
     if(a===b)continue;
     if(a!==0||b===0||current.get(x,y,z)!==0||current.environmentCaves.get(x,y,z)!==undefined||veto(x,z)){conflict=true;break;}
     rows.push([x,y,z,b]);cells.set(key(x,y,z),b);
     if(rows.length>25000)throw Error('Site cell cap');
    }
   }
   if(conflict||!rows.length)continue;
   const view={seed,get:(x,y,z)=>cells.get(key(x,y,z))??current.get(x,y,z),rotationAt:(...a)=>current.rotationAt(...a),getPack2State:(...a)=>current.environmentWaterState?.(...a)??null};
   const walk=await route(view,site,d.approach.start,V,F,yieldControl,still);
   if(!still())return denied('stale-source',attempts);
   if(!walk)continue;
   const occupied=new Set(rows.filter(v=>v[1]>=20).map(([x,y,z])=>H.physicalRegionAt(x,y,z).key));
   const identity=Object.freeze({kind:P0_SITE_POLICY,version:1,seed,tx,tz,baseProfile:current.generationProfile,revision:epoch,site:Object.freeze(site),turn:d.approach.turn,geometrySha:await digest(rows),cells:rows.length});
   if(!still()||!d.sourceSnapshotUnchanged())return denied('stale-source',attempts);
   return Object.freeze({accepted:true,identity,walk:Object.freeze(walk),sourceReads,upperOwners:occupied.size,upperCells:rows.filter(v=>v[1]>=20).length,
    attempts:Object.freeze(attempts),placementAuthority:false,get:(x,y,z)=>{if(!still())throw Error('Stale research source');return view.get(x,y,z);}});
  }
  attempts.push({size,x:site.x,z:site.z,reason:'no-current-source-walkable-orientation'});
 }
 return denied('bounded-candidate-exhaustion',attempts);
}
