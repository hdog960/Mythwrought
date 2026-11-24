// Isolated original-source second monument benchmark. No game startup,
// persistent writes or production integration.
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR} from './profile-world.mjs';
import {beginP0DetachedResearch} from './forgotten-sands-detached-research.mjs';
import {meshChunk,collides} from '../voxel.mjs';
import {meshDepthSection} from '../depth-mesh.mjs';
import {stepPlayer} from '../physics.mjs';
import {meshP0UpperSection,planP0VerticalResidence} from './forgotten-sands-upper-probe.mjs';
export const P0_SECOND_SITE=Object.freeze({seed:2026,x:-928,z:-2053,size:63,height:54});
export function prepareP0SecondSite(){
  const site=P0_SECOND_SITE,world=new FourRegionWorld(site.seed,fourRegionProfile(site.seed,M7_ENVIRONMENT_GENERATOR));
  const before=JSON.stringify(world.save()),job=beginP0DetachedResearch(world,site,{reserved:()=>false});
  let result;do{result=job.step();}while(result.accepted===null);
  if(!result.accepted)throw Error('Second site refused: '+result.reason);
  const routes=[],walks=[];
  for(let turn=0;turn<4;turn++){
    const d=job.researchView({approach:true,turn});
    if(!d.accepted){walks.push({turn,accepted:false,reason:d.reason,detail:d.detail});continue;}
    const a=d.approach,view=d.view,tx=site.x+.5,tz=site.z+.5,ux=tx-a.start.x,uz=tz-a.start.z;
    const dist=Math.hypot(ux,uz),p={...a.start,yaw:Math.atan2(ux,uz),vX:0,vZ:0,vY:0,onGround:true,coyote:.09,jumpBuffer:0};
    if(collides(world,p.x,p.feet,p.z)||!collides(world,p.x,p.feet-.065,p.z))throw Error('Not natural start');
    const progress=()=>((p.x-a.start.x)*ux+(p.z-a.start.z)*uz)/dist;
    let forward=0,back=0,blocked=false;
    while(progress()<dist&&forward++<900){stepPlayer(view,p,{forward:1},1/60);if(collides(view,p.x,p.feet,p.z)){blocked=true;break;}}
    if(progress()<dist||blocked){walks.push({turn,accepted:false,reason:'native-entry-blocked',forward});continue;}
    p.vX=0;p.vZ=0;
    while(progress()>.1&&back++<900){stepPlayer(view,p,{forward:-1},1/60);if(collides(view,p.x,p.feet,p.z)){blocked=true;break;}}
    if(progress()>.1||blocked){walks.push({turn,accepted:false,reason:'native-return-blocked',forward,back});continue;}
    walks.push({turn,accepted:true,forward,back,addedCells:a.addedCells,start:a.start});
    routes.push(d);
  }
  routes.sort((a,b)=>a.approach.addedCells-b.approach.addedCells||a.approach.turn-b.approach.turn);
  const selected=routes[0]??job.researchView();
  if(JSON.stringify(world.save())!==before)throw Error('Original world changed');
  return Object.freeze({world,selected,walks:Object.freeze(walks),walkCertified:routes.length>0});
}
export function p0BenchmarkMesh(view,cx,cz,s){
  return s===0?meshChunk(view,cx,cz):s>0?meshP0UpperSection(view,cx,cz,s):meshDepthSection(view,cx,cz,s);
}
export function p0BenchmarkWindow(cx,cz,feet,{nearUpperSite=true,openShaft=false}={}){
  const p=planP0VerticalResidence(feet,{nearUpperSite,openShaft}),keys=[];
  for(const {section,radius} of p.allocations)
    for(let z=cz-radius;z<=cz+radius;z++)for(let x=cx-radius;x<=cx+radius;x++)
      keys.push(Object.freeze({cx:x,cz:z,s:section,key:[x,z,section].join(','),distance:(x-cx)**2+(z-cz)**2}));
  if(keys.length!==p.residentBufferLimit||new Set(keys.map(k=>k.key)).size!==keys.length)throw Error('Invalid residency plan');
  return Object.freeze(keys);
}
