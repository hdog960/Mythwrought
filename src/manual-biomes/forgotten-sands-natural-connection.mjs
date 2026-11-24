// Research-only natural walking connections. No path blocks, gap filling,
// terrain subtraction, settlement/road ownership or live placement.
import {defineP0Footprint,inspectP0GroundColumn} from './forgotten-sands-grounded-probe.mjs';
import {WORLD_MIN_Y,WORLD_MAX_Y} from '../depth.mjs';
import {worldKey,collides} from '../voxel.mjs';
import {stepPlayer} from '../physics.mjs';
const int=Number.isSafeInteger,dirs=[[1,0],[-1,0],[0,1],[0,-1]];
export function beginP0NaturalConnection(world,from,to,{reserved,excluded=()=>false,padding=5}={}){
  if(![from.x,from.z,to.x,to.z,padding].every(int)||padding<0||padding>8||
    typeof reserved!=='function'||typeof excluded!=='function'||
    Math.abs(from.x-to.x)+Math.abs(from.z-to.z)>128)throw Error('Invalid connection envelope');
  const minX=Math.min(from.x,to.x)-padding,maxX=Math.max(from.x,to.x)+padding,
    minZ=Math.min(from.z,to.z)-padding,maxZ=Math.max(from.z,to.z)+padding;
  const width=maxX-minX+1,height=maxZ-minZ+1,total=width*height;
  if(total>4096)throw Error('Connection survey too large');
  const caps=new Uint8Array(total),seen=new Uint8Array(total),prev=new Int32Array(total);
  prev.fill(-1);
  const index=(x,z)=>(z-minZ)*width+x-minX,coord=i=>[minX+i%width,minZ+Math.floor(i/width)];
  const start=index(from.x,from.z),end=index(to.x,to.z),queue=[];
  let scanned=0,head=0,visited=0,done=null;
  const counts={};
  const deny=reason=>done=Object.freeze({accepted:false,reason,scanned,visited,counts:Object.freeze({...counts})});
  return Object.freeze({step(limit=16){
    if(!int(limit)||limit<1||limit>32)throw Error('Invalid connection step budget');
    if(done)return done;
    if(scanned<total){
      const stop=Math.min(total,scanned+limit);
      for(;scanned<stop;scanned++){
        const [x,z]=coord(scanned);
        if(excluded(x,z)){counts.excluded=(counts.excluded??0)+1;continue;}
        const r=inspectP0GroundColumn(world,defineP0Footprint({seed:world.seed,x,z}),x,z,reserved);
        if(!r.ok){counts[r.reason]=(counts[r.reason]??0)+1;continue;}
        let edited=false;
        for(let y=WORLD_MIN_Y;y<=WORLD_MAX_Y;y++)if(world.edits.has(worldKey(x,y,z))){edited=true;break;}
        if(edited){counts['player-edit']=(counts['player-edit']??0)+1;continue;}
        caps[scanned]=r.cap;counts.clear=(counts.clear??0)+1;
      }
      if(scanned===total){
        if(!caps[start]||!caps[end])return deny('endpoint-protected');
        queue.push(start);seen[start]=1;
      }
    }else{
      const stop=head+limit;
      while(head<queue.length&&head<stop){
        const i=queue[head++];visited++;
        if(i===end){
          const nodes=[];let k=end;
          while(k!==-1){const [x,z]=coord(k);nodes.push(Object.freeze({x,z,feet:caps[k]+1}));k=prev[k];}
          nodes.reverse();
          return done=Object.freeze({accepted:true,reason:'quiet original natural corridor; physics still required',
            nodes:Object.freeze(nodes),scanned,visited,counts:Object.freeze({...counts}),placementAuthority:false,addedCells:0});
        }
        const [x,z]=coord(i);
        for(const [dx,dz] of dirs){
          const a=x+dx,b=z+dz;if(a<minX||a>maxX||b<minZ||b>maxZ)continue;
          const j=index(a,b);if(seen[j]||!caps[j]||Math.abs(caps[j]-caps[i])>1)continue;
          seen[j]=1;prev[j]=i;queue.push(j);
        }
      }
      if(head===queue.length)return deny('no-original-walkable-corridor');
    }
    return Object.freeze({accepted:null,scanned,visited});
  }});
}
// Original player integration; no teleporting or synthetic support. Stop at
// each corner using ordinary input and keep continuous actual physics state.
export function walkP0NaturalConnection(world,nodes){
  if(!Array.isArray(nodes)||!nodes.length||nodes.length>4096)throw Error('Invalid connection nodes');
  const a=nodes[0],p={x:a.x+.5,z:a.z+.5,feet:a.feet,yaw:0,vX:0,vZ:0,vY:0,onGround:true,coyote:.09,jumpBuffer:0};
  let frames=0;
  if(collides(world,p.x,p.feet,p.z)||!collides(world,p.x,p.feet-.065,p.z))return {ok:false,reason:'invalid-start'};
  for(let i=1;i<nodes.length;i++){
    const n=nodes[i],tx=n.x+.5,tz=n.z+.5;
    let count=0;
    while(Math.hypot(tx-p.x,tz-p.z)>.12&&count++<120){
      const dist=Math.hypot(tx-p.x,tz-p.z);p.yaw=Math.atan2(tx-p.x,tz-p.z);
      stepPlayer(world,p,{forward:Math.min(1,dist*2)},1/60);frames++;
      if(collides(world,p.x,p.feet,p.z))return {ok:false,reason:'body-collision',i,frames};
    }
    // A one-block natural descent needs more than 0.2 seconds to fall
    // and settle. Allow up to one second of genuine zero-input physics;
    // never snap the body to the expected height.
    let settled=0;
    for(let j=0;j<60;j++){
      stepPlayer(world,p,{forward:0},1/60);frames++;
      if(collides(world,p.x,p.feet,p.z))return {ok:false,reason:'settling-collision',i,frames};
      if(p.onGround&&Math.abs(p.vY)<.001&&Math.hypot(p.vX,p.vZ)<.025){if(++settled>=3)break;}
      else settled=0;
    }
    if(Math.hypot(tx-p.x,tz-p.z)>.2||Math.abs(p.feet-n.feet)>.1||collides(world,p.x,p.feet,p.z))
      return {ok:false,reason:'physical-node-mismatch',i,frames,actual:{x:p.x,z:p.z,feet:p.feet},expected:n};
  }
  return {ok:true,frames,nodes:nodes.length};
}
