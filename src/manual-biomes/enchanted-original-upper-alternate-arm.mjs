// Isolated alternate loop witness, using only the exact ORIGINAL upper
// author's 38..94 arm envelope (not a new cave generator). Monotone
// cardinal graph search, bounded by 57 columns, 3 lateral lanes, 3 floors.
// Each node requires literal owner floor, three owner AIR cells, real
// M7 body clearance/ground, and adjacent one-block elevation. Only actual
// unchanged stepPlayer can certify the full outside-to-branch-to-main walk.
import {UPPER_SITES} from '../cave-approaches/upper-network.mjs';
import {auditOriginalM7UpperAnchorWalk,originalM7UpperOwnedPhysicalFloor}
 from './enchanted-original-upper-owner-walk-audit.mjs';
import {replayFullOriginalM7CaveAnchorWalk} from './enchanted-original-full-anchor-continuity.mjs';
const names=['upper24-windcut','upper24-hollowbend'];
export const LOOP_LIMIT=Object.freeze({first:38,last:94,maxNodes:513,maxPath:200});
const coords=p=>[p.x,p.surface,p.z];
const key=p=>coords(p).join(',');
const fail=(reason,extra={})=>Object.freeze({ok:false,reason,...extra});
export function planOriginalM7UpperAlternateArm(world,name,sign){
 if(!names.includes(name)||![1,-1].includes(sign))throw Error('Unknown original arm');
 const m=auditOriginalM7UpperAnchorWalk(world,name,{ownerSteps:120,sourceOnly:true});
 if(!m.ok)return fail('main-source-rejected',{detail:m.reason});
 const main=m.originalOwnerSourcePlan;
 const i=main.path.findIndex(p=>p.upperRouteStep===38&&p.corner===false);
 const j=main.path.findIndex(p=>p.upperRouteStep===94&&p.corner===false);
 if(i<0||j<=i)throw Error('Original main junctions absent');
 const start=main.path[i],end=main.path[j],site=UPPER_SITES[names.indexOf(name)];
 const nodes=new Map(),counts=[];
 const center=d=>site.z+Math.round(3*Math.sin(d/13))+
   sign*Math.round(10*Math.sin(Math.PI*(d-38)/56));
 for(let d=38;d<=94;d++){
  const nominal=-8-Math.floor(d/6);let count=0;
  for(let dz=-1;dz<=1;dz++)for(let dy=0;dy<=2;dy++){
   const cap=originalM7UpperOwnedPhysicalFloor(world,name,site.x+d,nominal+dy,center(d)+dz);
   if(cap){nodes.set(key(cap),cap);count++;}
  }
  counts.push({step:d,nodes:count});
 }
 if(nodes.size>LOOP_LIMIT.maxNodes)throw Error('Original arm node cap exceeded');
 if(!nodes.has(key(start))||!nodes.has(key(end)))return fail('arm-junction-source-absent',{sign,counts});
 const q=[nodes.get(key(start))],prev=new Map([[key(start),null]]);
 for(let k=0;k<q.length;k++){
  const p=q[k];
  if(key(p)===key(end))break;
  // Same column lateral movement or forward x, no virtual diagonals.
  for(const [dx,dz] of [[1,0],[0,1],[0,-1]])for(const dy of [0,1,-1]){
   const nk=[p.x+dx,p.surface+dy,p.z+dz].join(',');
   const n=nodes.get(nk);
   if(n&&!prev.has(nk)&&Math.abs(n.feet-p.feet)<=1.00001){
    prev.set(nk,key(p));q.push(n);
   }
  }
 }
 if(!prev.has(key(end)))return fail('no-cardinal-source-arm-connection',{
  name,sign,counts,reachableNodes:q.length,
  furthestOriginalArmStep:Math.max(...q.map(p=>p.x-site.x))});
 const arm=[];
 for(let k=key(end);k!==null;k=prev.get(k))arm.push(nodes.get(k));
 arm.reverse();
 if(arm.length>LOOP_LIMIT.maxPath)throw Error('Original arm path bound exceeded');
 const mid=arm.find(p=>p.x===site.x+66);
 if(!mid||Math.abs(mid.z-(site.z+Math.round(3*Math.sin(66/13))))<9)
  throw Error('Arm path did not leave main nave at original midpoint');
 const path=[...main.path.slice(0,i+1),...arm.slice(1),...main.path.slice(j+1)];
 return Object.freeze({ok:true,name,sign,sourceNodes:nodes.size,counts,
  junctions:[coords(start),coords(end)],midpoint:coords(mid),
  arm:Object.freeze(arm),originalMainLegsReplaced:j-i,
  plan:Object.freeze({...main,path:Object.freeze(path)}),
  physicallyWalked:false});
}
export function walkOriginalM7UpperAlternateArm(world,name,sign){
 const p=planOriginalM7UpperAlternateArm(world,name,sign);
 if(!p.ok)return p;
 const r=replayFullOriginalM7CaveAnchorWalk(world,p.plan);
 return Object.freeze({ok:r.ok,sourceAccepted:true,name,sign,
  reason:r.ok?null:r.reason,sourceNodes:p.sourceNodes,
  junctions:p.junctions,midpoint:p.midpoint,armLegs:p.arm.length-1,
  originalMainLegsReplaced:p.originalMainLegsReplaced,
  ticks:r.ticks,legs:r.walkedLegs,blocked:r.failedSourceCell??null,
  finishedOriginalMain:r.ok,wholeNetworkAccepted:false});
}
