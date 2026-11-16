// Issue #117 M10: three independent RAW log cells; no tree assembly or production registry writes.
const species = [
 {ordinal:119,name:'Redwood logs',taxon:'sequoia',bark:'deep longitudinal furrows with buttressed bark plates',grain:'broad reddish heartwood rings',rings:48,palette:['#44271f','#713829','#a45137','#cb7851','#e0a071'],core:[.27,.24,.73,.76],ridges:[[.14,.02,.25,.96],[.34,.08,.41,.99],[.59,.01,.67,.93],[.77,.06,.89,.98]],knots:[[.12,.43,.29,.59]],buttresses:[[.08,.02,.3,.29],[.69,.71,.94,.96]]},
 {ordinal:120,name:'Blackwood logs',taxon:'umbra-lignum',bark:'angular interlocking dark armor scales',grain:'dense violet-black heartwood',rings:24,palette:['#171b23','#272735','#3d3446','#5d4660','#88738a'],core:[.31,.29,.69,.71],ridges:[[.16,.05,.34,.23],[.66,.12,.88,.33],[.11,.42,.32,.64],[.7,.55,.93,.78],[.22,.77,.43,.95],[.57,.81,.79,.98]],knots:[[.3,.35,.47,.51]],buttresses:[[.16,.16,.4,.37],[.6,.61,.88,.84]]},
 {ordinal:121,name:'Moonwillow logs',taxon:'salix-lunaris',bark:'spiraling silver bark and luminous sap scars',grain:'fine pale crescent growth rings',rings:13,palette:['#d6d6c9','#a9b8bb','#7d919c','#e6dfc7','#8194b0'],core:[.29,.25,.71,.75],ridges:[[.16,.04,.3,.32],[.68,.18,.87,.44],[.12,.55,.3,.84],[.65,.67,.83,.96]],knots:[[.17,.34,.38,.49],[.63,.53,.83,.7]],buttresses:[[.13,.06,.36,.27],[.64,.73,.89,.96]]}
];
const freezePairs = a => Object.freeze(a.map(p=>Object.freeze(p)));
export const RAW_LOGS_119_121=Object.freeze(species.map(s=>Object.freeze({...s,symbolicId:'biome130:'+s.ordinal,futureOnlyId:255+s.ordinal,selectable:true,replaceable:true,solid:true,attachment:'ground-or-face',collision:'occupied-boxes',rotationCount:4,transparent:false,core:Object.freeze(s.core),ridges:freezePairs(s.ridges),knots:freezePairs(s.knots),buttresses:freezePairs(s.buttresses),palette:Object.freeze(s.palette)})));
function check(a){if(!RAW_LOGS_119_121.includes(a))throw new TypeError('unknown raw log');}
function checkRotation(r){if(!Number.isInteger(r)||r<0||r>3)throw new RangeError('rotation must be 0..3');}
function rotate(box,r){let [x,y,z,X,Y,Z]=box;for(let i=0;i<r;i++)[x,z,X,Z]=[1-Z,x,1-z,X];return [x,y,z,X,Y,Z];}
export function rawLogBoxes119(a,rotation=0){
 check(a);checkRotation(rotation);
 const [x,z,X,Z]=a.core;
 const boxes=[[x,0,z,X,1,Z]];
 for(const [u,v,w,t] of a.ridges)boxes.push([u,.06,v,w,.94,t]);
 for(const [u,v,w,t] of a.knots)boxes.push([u,.33,v,w,.68,t]);
 for(const [u,v,w,t] of a.buttresses)boxes.push([u,0,v,w,.27,t]);
 return boxes.map(b=>rotate(b,rotation));
}
export function rawLogMaterial119(a,x,y,z,face=0){
 check(a);
 if(![x,y,z,face].every(Number.isInteger))throw new TypeError('integer material coordinates required');
 const hash=(Math.imul(x+a.ordinal,73856093)^Math.imul(y,19349663)^Math.imul(z,83492791)^Math.imul(face+11,2654435761))>>>0;
 return a.palette[hash%a.palette.length];
}
export function rawLogMesh119(a,rotation=0){
 const vertices=[],indices=[];
 for(const [x,y,z,X,Y,Z] of rawLogBoxes119(a,rotation)){
  const p=[[x,y,z],[X,y,z],[X,Y,z],[x,Y,z],[x,y,Z],[X,y,Z],[X,Y,Z],[x,Y,Z]];
  for(const face of [[0,3,2,1],[5,6,7,4],[4,7,3,0],[1,2,6,5],[3,7,6,2],[4,0,1,5]]){
   const n=vertices.length/3;for(const i of face)vertices.push(...p[i]);indices.push(n,n+1,n+2,n,n+2,n+3);
  }
 }
 return {vertices,indices};
}
// Deliberately isolated symbolic edit fixture; NOT production schema-1 serialization.
export function rawLogEditFixture119(a,rotation=0){
 rawLogBoxes119(a,rotation);
 const key='4,5,6',cells=new Map([[key,{symbolicId:a.symbolicId,rotation}]]);
 const saved=JSON.stringify([...cells]);const restored=new Map(JSON.parse(saved));
 const selected=restored.get(key);restored.delete(key);
 return {saved,selected,removed:!restored.has(key)};
}
// IDs 374-376 are prospective ONLY. No registry, world, terrain, or shared save changes.
