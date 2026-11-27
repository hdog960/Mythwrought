// New interlayer route family: a drifting, higher-pitch helix following
// the original sloped upper-to-middle capsule, with independent approaches.
// Never creates supports or fills existing AIR. Detached native research.
import {createPeakGalleryProjection} from './peak-gallery-acceptance-renderer.mjs';
import {planUnderworldRegion,networkAirAt} from './worldwide-network.mjs';
import {compileGalleryConstructionFootprint} from './combined-stair-footprints.mjs';
import {auditProtectedSubsurfaceStairs} from './protected-subsurface-stairs.mjs';
import {exactQualifiedSocket} from './exact-qualified-socket.mjs';
import {traverseRetainedDescent} from './retained-switchback-descent-route.mjs';
import {VoxelWorld,BLOCK,baseBlock} from '../voxel.mjs';
const key=(x,y,z)=>[x,y,z].join(','),xyz=k=>k.split(',').map(Number),pk=p=>key(p.x,p.y,p.z);
const dirs=[[1,0],[-1,0],[0,1],[0,-1]];
const ring=[];for(let x=-2;x<=2;x++)ring.push([x,-2]);
for(let z=-1;z<=2;z++)ring.push([2,z]);
for(let x=1;x>=-2;x--)ring.push([x,2]);
for(let z=1;z>=-1;z--)ring.push([-2,z]);
// Fixed new shape candidates from geometry-only offline enumeration.
// [lift, topGap, direction, rotation, stepIndices, ox, oz, driftBefore, delay]
const SPECS=[
 [4,3,1,14,[2,7,10,14,15],0,1,false,0],
 [5,3,1,11,[1,2,3,5,10,11,15],0,1,true,2],
 [4,2,-1,3,[1,2,5,6,10,14],1,1,true,-2],
 [3,4,-1,12,[5,6,10,11,13,14,15],0,0,true,2],
 [5,2,1,9,[3,6,10,14,15],0,1,true,2],
 [5,3,-1,12,[1,2,5,9,13,14],1,1,true,-2],
 [4,4,-1,11,[2,5,9,11,13,14],0,0,true,1],
 [5,4,1,11,[3,6,7,10,14],0,0,true,0],
 [4,4,1,6,[2,3,7,10,14,15],0,1,false,-1],
 [4,4,-1,7,[2,5,6,11,13,14],1,-1,true,1],
 [4,4,-1,7,[1,5,6,11,13,15],1,0,true,2],
 [4,2,-1,5,[1,5,9,10,14],0,0,false,-2]
];
function body(lo,hi,spec){
 const [lift,top,dir,rot,raises,ox,oz,before,delay]=spec;
 let y=lo.y+lift,terminal=hi.y-top,firstTop=-1,route=[];
 const center=y=>{const t=(y-lo.y)/(hi.y-lo.y);return [Math.round(lo.x+(hi.x-lo.x)*t)+ox,Math.round(lo.z+(hi.z-lo.z)*t)+oz];};
 let [cx,cz]=center(y);
 for(let i=0;i<300;i++){
  const j=(rot+dir*i+16000)%16,nextY=y+Number(i>0&&raises.includes(j));
  if(nextY>terminal)break;
  const [x,z]=ring[j];
  if(i){
   const [px,pz]=ring[(j-dir+16)%16],dx=x-px,dz=z-pz,[tx,tz]=center(nextY+delay);
   if(dx&&(tx-cx)*dx>0||dz&&(tz-cz)*dz>0){
    if(before){cx+=dx;cz+=dz;route.push({x:cx+px,y,z:cz+pz});}
    else{route.push({x:cx+x,y:nextY,z:cz+z});cx+=dx;cz+=dz;}
   }
  }
  y=nextY;route.push({x:cx+x,y,z:cz+z});
  if(y===terminal){if(firstTop<0)firstTop=i;if(i-firstTop>=2)break;}
 }
 return route;
}
const proposal=route=>({ok:true,segments:route.slice(1).map((b,i)=>({a:route[i],b}))});
function cells(p,dx){
 const s=[],a=[];for(let w=-1;w<=1;w++){
  const x=p.x+(dx?0:w),z=p.z+(dx?w:0);
  s.push(key(x,p.y-1,z));for(let h=0;h<3;h++)a.push(key(x,p.y+h,z));
 }return {s,a};
}
function footprint(route,skipFirst=false){
 const s=new Set(),a=new Set();
 for(let i=skipFirst?1:0;i<route.length;i++){
  const p=route[i],q=route[i?i-1:1];
  const c=cells(p,p.x-q.x);for(const k of c.s)s.add(k);for(const k of c.a)a.add(k);
 }
 return {s,a};
}
function joinApproach(route,hub,prepend,clearance,support,seed){
 const goals=new Set();
 for(const k of support){
  const [x,sy,z]=xyz(k),y=sy+1;
  if(Math.abs(x-hub.x)<=12&&Math.abs(z-hub.z)<=12&&y>=hub.y-2&&y<=hub.y+1&&clearance.has(key(x,y,z))&&clearance.has(key(x,y+1,z)))goals.add(key(x,y,z));
 }
 const base=footprint(route,prepend),start=prepend?route[0]:route.at(-1);
 const q=[{path:[start],s:new Set(),a:new Set()}],visits=new Map();
 let nodes=0,pruned=0;
 const safe=(c,st)=>c.s.every(k=>!clearance.has(k)&&!base.a.has(k)&&!st.a.has(k))&&c.a.every(k=>!support.has(k)&&!base.s.has(k)&&!st.s.has(k)&&networkAirAt(seed,...xyz(k)));
 for(let i=0;i<q.length&&i<4200;i++){
  const st=q[i],p=prepend?st.path[0]:st.path.at(-1);nodes++;
  if(st.path.length>=25)continue;
  for(const [dx,dz] of dirs)for(const dy of prepend?[0,-1]:[0,1]){
   const n={x:p.x+dx,y:p.y+dy,z:p.z+dz},k=pk(n);
   if(Math.abs(n.x-hub.x)>12||Math.abs(n.z-hub.z)>12||n.y<(prepend?hub.y-2:Math.min(start.y,hub.y-2))||n.y>hub.y+8||st.path.some(v=>pk(v)===k))continue;
   const arriving=cells(prepend?p:n,dx);
   if(!safe(arriving,st)){pruned++;continue;}
   const next={path:prepend?[n,...st.path]:[...st.path,n],s:new Set([...st.s,...arriving.s]),a:new Set([...st.a,...arriving.a])};
   if(goals.has(k)&&next.path.length>=3&&(!prepend||safe(cells(n,dx),next))){
    const combined=prepend?[...next.path,...route.slice(1)]:[...route,...next.path.slice(1)],f=compileGalleryConstructionFootprint(proposal(combined));
    if(f.ok&&![...f.support].some(k=>clearance.has(k))&&![...f.clearance].some(k=>support.has(k)||!networkAirAt(seed,...xyz(k))))return {route:combined,footprint:f,nodes,pruned,stations:next.path.length};
   }
   const id=k+':'+dx+','+dz,seen=visits.get(id)??0;
   if(seen>=3||q.length>=4200)continue;
   visits.set(id,seen+1);q.push(next);
  }
 }
 return {route:null,nodes,pruned,goals:goals.size};
}
export function inspectDriftingInterlayer({indices=SPECS.map((_,i)=>i)}={}){
 if(!Array.isArray(indices)||!indices.length||new Set(indices).size!==indices.length||indices.some(i=>!Number.isInteger(i)||i<0||i>=SPECS.length))throw Error('INVALID_INTERLAYER_COHORT');
 const p=createPeakGalleryProjection(),{original,cuts,floors}=p,legacy=new VoxelWorld(original.seed),socket=exactQualifiedSocket();
 const clearance=new Set([...cuts,...socket.air]),support=new Set([...floors,...socket.support]);
 const plan=planUnderworldRegion(original.seed,-3,-9),lo=plan.layers[1].hub,hi=plan.layers[0].hub;
 const memo=new Map();let directCalls=0;
 const read=(role,k,fn)=>{const id=role+':'+k;if(memo.has(id))return memo.get(id);if(directCalls>=40000)throw Error('INTERLAYER_SOURCE_LIMIT');directCalls++;const value=fn();memo.set(id,value);return value;};
 const source={
  naturalAt:(...v)=>read('natural',key(...v),()=>original.naturalAndLandmarkBlock(...v)),
  authoredAt:(...v)=>read('authored',key(...v),()=>original.environmentCaves.get(...v)),
  editedAt:(...v)=>read('edit',key(...v),()=>original.edits.has(key(...v))),
  protectedAt:(...v)=>read('legacy',key(...v),()=>legacy.naturalAndLandmarkBlock(...v))!==read('base',key(...v),()=>baseBlock(...v,original.seed))
 };
 const get=(...v)=>read('get',key(...v),()=>original.get(...v));
 const candidates=[],qualified=[];let sourceTrials=0;
 for(const index of indices){const spec=SPECS[index];
  const r=body(lo,hi,spec),f=compileGalleryConstructionFootprint(proposal(r));
  if(!f.ok){candidates.push({index,reason:'STRICT_BODY_GEOMETRY',detail:f.reason});continue;}
  // First station width is provisional for the eventual lower approach.
  const b=footprint(r,true),airConflict=[...b.s].filter(k=>clearance.has(k)),floorConflict=[...b.a].filter(k=>support.has(k)),outside=[...b.a].filter(k=>!networkAirAt(original.seed,...xyz(k)));
  if(airConflict.length||floorConflict.length||outside.length){candidates.push({index,reason:'BODY_SOURCE_GEOMETRY',airConflict:airConflict.length,floorConflict:floorConflict.length,outside:outside.length});continue;}
  const lower=joinApproach(r,lo,true,clearance,support,original.seed);
  if(!lower.route){candidates.push({index,reason:'LOWER_APPROACH_HOLD',nodes:lower.nodes,goals:lower.goals,pruned:lower.pruned});continue;}
  const upper=joinApproach(lower.route,hi,false,clearance,support,original.seed);
  if(!upper.route){candidates.push({index,reason:'UPPER_APPROACH_HOLD',nodes:upper.nodes,goals:upper.goals,pruned:upper.pruned});continue;}
  sourceTrials++;
  try{
   const audit=auditProtectedSubsurfaceStairs(proposal(upper.route),{...source,minY:-210,maxY:-4,stopOnFirstUnsafe:true});
   if(!audit.ok){candidates.push({index,reason:'SOURCE_VETO',firstRefusal:audit.firstRefusal,examples:audit.examples});continue;}
   const f=upper.footprint,added=new Set([...f.clearance].filter(k=>!clearance.has(k)&&get(...xyz(k))!==BLOCK.AIR));
   const view={get(x,y,z){const k=key(x,y,z);return clearance.has(k)||added.has(k)?BLOCK.AIR:get(x,y,z);}};
   const supportParity=[...f.support].every(k=>view.get(...xyz(k))===get(...xyz(k))&&get(...xyz(k))!==BLOCK.AIR);
   if(!supportParity){candidates.push({index,reason:'SUPPORT_READBACK'});continue;}
   const points=upper.route.map(({x,y,z})=>({x,feet:y,z})),forward=traverseRetainedDescent(view,points),reverse=traverseRetainedDescent(view,[...points].reverse()),ok=forward.ok&&reverse.ok;
   const result={index,reason:ok?null:'NATIVE_CONTROLLER_HOLD',ok,stations:points.length,start:points[0],end:points.at(-1),lowerApproach:lower.stations,upperApproach:upper.stations,support:f.support.size,clearance:f.clearance.size,addedCuts:added.size,forward,reverse,supportParity};
   candidates.push(result);if(ok)qualified.push({...result,route:upper.route,supportCells:[...f.support],airCells:[...f.clearance]});
  }catch(e){if(e.message!=='INTERLAYER_SOURCE_LIMIT')throw e;candidates.push({index,reason:e.message});break;}
 }
 if(JSON.stringify(original.save())!==p.initial)throw Error('INTERLAYER_SOURCE_SAVE_MUTATED');
 return {seed:original.seed,lower:lo,upper:hi,attempted:candidates.length,sourceTrials,directCalls,qualified:qualified.length,best:qualified.sort((a,b)=>a.addedCuts-b.addedCuts)[0]??null,candidates,sourceSaveUnchanged:true,originalSocketPreserved:true,worldWrites:0,combinedCavernBudgetQualified:false,constructionAdmission:false};
}
