// Isolated original-source seed179 outer-ring large monument benchmark. No game startup,
// persistent writes or production integration.
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR} from './profile-world.mjs';
import {beginP0DetachedResearch} from './forgotten-sands-detached-research.mjs';
import {meshChunk,collides} from '../voxel.mjs';
import {meshDepthSection} from '../depth-mesh.mjs';
import {stepPlayer} from '../physics.mjs';
import {meshP0UpperSection,planP0VerticalResidence} from './forgotten-sands-upper-probe.mjs';
export const P0_SEED179_LARGE_SITE=Object.freeze({seed:179,x:-2076,z:3195,size:63,height:54});
export function prepareP0Seed179LargeSite(){
  const site=P0_SEED179_LARGE_SITE,world=new FourRegionWorld(site.seed,fourRegionProfile(site.seed,M7_ENVIRONMENT_GENERATOR));
  const before=JSON.stringify(world.save()),job=beginP0DetachedResearch(world,site,{reserved:()=>false});
  let result;do{result=job.step();}while(result.accepted===null);
  if(!result.accepted)throw Error('Seed179 site refused: '+result.reason);
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
