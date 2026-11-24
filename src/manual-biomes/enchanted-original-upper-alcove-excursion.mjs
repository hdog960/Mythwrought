// Read-only original upper high-roof alcove witness. The original author
// defines these three circular room envelopes; every candidate floor is
// independently authenticated by the unchanged upper owner map and real M7.
// Search is bounded and never fills missing cells, even to reach a room.
import {UPPER_SITES} from '../cave-approaches/upper-network.mjs';
import {auditOriginalM7UpperAnchorWalk,originalM7UpperOwnedPhysicalFloor} from './enchanted-original-upper-owner-walk-audit.mjs';
import {replayFullOriginalM7CaveAnchorWalk} from './enchanted-original-full-anchor-continuity.mjs';
const names=['upper24-windcut','upper24-hollowbend'];
export const ALCOVES=Object.freeze([
 Object.freeze({d:48,z:14,r:6,dx:0,dz:0}),
 Object.freeze({d:85,z:-13,r:8,dx:0,dz:0}),
 Object.freeze({d:110,z:3,r:9,dx:4,dz:4})
]);
const xyz=p=>[p.x,p.surface,p.z],key=p=>xyz(p).join(',');
const fail=(reason,extra={})=>Object.freeze({ok:false,reason,...extra});
export function planOriginalM7UpperAlcove(world,name,d){
 const room=ALCOVES.find(r=>r.d===d),site=UPPER_SITES[names.indexOf(name)];
 if(!room||!site)throw Error('Unknown original alcove');
 const mainResult=auditOriginalM7UpperAnchorWalk(world,name,{ownerSteps:120,sourceOnly:true});
 if(!mainResult.ok)return fail('original-main-source-rejected',{name,d,detail:mainResult.reason});
 const main=mainResult.originalOwnerSourcePlan;
 const nominal=-8-Math.floor(d/6),target=[site.x+d+room.dx,nominal,site.z+room.z+room.dz];
 const lo=Math.max(1,d-room.r-8),hi=Math.min(120,d+room.r+8);
 const nodes=new Map();let queries=0;
 for(let n=lo;n<=hi;n++)for(let z=-24;z<=24;z++){
  const floor=-8-Math.floor(n/6);
  for(let y=Math.min(floor,nominal);y<=Math.max(floor,nominal)+2;y++){
   if(++queries>16000)throw Error('Alcove source query budget exceeded');
   const p=originalM7UpperOwnedPhysicalFloor(world,name,site.x+n,y,site.z+z);
   if(p)nodes.set(key(p),p);
  }
 }
 // Goal must be in the actual original room, away from the nave. No
 // nearest-cell substitution if the specified original interior is absent.
 const goal=[0,1,2].map(y=>nodes.get([target[0],target[1]+y,target[2]].join(','))).find(Boolean);
 if(!goal)return fail('original-alcove-interior-floor-not-admitted',{name,d,target,queries,sourceNodes:nodes.size});
 const starts=new Map();
 for(let i=0;i<main.path.length;i++){
  const p=main.path[i];
  if(p.corner===false&&p.upperRouteStep>=lo&&p.upperRouteStep<=hi&&nodes.has(key(p)))starts.set(key(p),i);
 }
 // Search backward from the authentic interior to the nearest reachable
 // original main center. Graph edges are actual cardinal adjacent floors;
 // reverse traversal is subsequently tested by the real player.
 const queue=[goal],prev=new Map([[key(goal),null]]);
 let junction=null;
 for(let i=0;i<queue.length;i++){
  const p=queue[i],k=key(p);
  if(starts.has(k)){junction=k;break;}
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]])for(const dy of [0,1,-1]){
   const nk=[p.x+dx,p.surface+dy,p.z+dz].join(','),n=nodes.get(nk);
   if(n&&!prev.has(nk)&&Math.abs(n.feet-p.feet)<=1.00001){prev.set(nk,k);queue.push(n);}
  }
 }
 if(!junction)return fail('no-cardinal-source-connection-in-bounded-envelope',{
  name,d,target:xyz(goal),sourceNodes:nodes.size,reachableFromInterior:queue.length,
  eligibleMainCenters:starts.size,queries});
 const out=[];for(let k=prev.get(junction);k!==null;k=prev.get(k))out.push(nodes.get(k));
 if(out.length<2||out.length>160) return fail('alcove-detour-outside-witness-bound',{name,d,legs:out.length});
 const index=starts.get(junction),center=main.path[index];
 const path=[...main.path.slice(0,index+1),...out,...out.slice(0,-1).reverse(),center,...main.path.slice(index+1)];
 return Object.freeze({ok:true,name,d,queries,sourceNodes:nodes.size,junction:xyz(center),
  target:xyz(goal),out:Object.freeze(out),plan:Object.freeze({...main,path:Object.freeze(path)}),
  physicallyWalked:false});
}
export function walkOriginalM7UpperAlcove(world,name,d){
 const p=planOriginalM7UpperAlcove(world,name,d);
 if(!p.ok)return p;
 const r=replayFullOriginalM7CaveAnchorWalk(world,p.plan);
 return Object.freeze({ok:r.ok,reason:r.reason??null,name,d,sourceAccepted:true,
  queries:p.queries,sourceNodes:p.sourceNodes,junction:p.junction,target:p.target,
  excursionLegs:2*p.out.length,ticks:r.ticks,legs:r.walkedLegs,
  failedAt:r.failedSourceCell??null,finishedMain:r.ok,wholeRoomAccepted:false});
}
