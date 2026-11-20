// :48 non-block visual-only scene geometry. No block IDs, world writes or automatic placement.
export const SCENE_FAMILIES = Object.freeze({
  'scene48:low-grass': Object.freeze({attachment:'ground', footprint:[0.75,0.42,0.75], collision:'pass-through', tier:'dense', biome:['temperate','meadow'], status:'SOURCE_READY'}),
  'scene48:short-fern': Object.freeze({attachment:'ground', footprint:[0.9,0.7,0.9], collision:'pass-through', tier:'medium', biome:['temperate','enchanted-forest'], status:'SOURCE_READY'}),
  'scene48:single-wildflower': Object.freeze({attachment:'ground', footprint:[0.42,0.82,0.42], collision:'pass-through', tier:'medium', biome:['temperate','meadow'], status:'SOURCE_READY'}),
  'scene48:lavender-spike': Object.freeze({attachment:'ground', footprint:[0.65,0.9,0.65], collision:'pass-through', tier:'medium', biome:['meadow','temperate'], status:'IN_PROGRESS'}),
  'scene48:heather-sprig': Object.freeze({attachment:'ground', footprint:[0.8,0.62,0.8], collision:'pass-through', tier:'medium', biome:['meadow','temperate'], status:'IN_PROGRESS'}),
  'scene48:clover-clump': Object.freeze({attachment:'ground', footprint:[0.62,0.3,0.62], collision:'pass-through', tier:'dense', biome:['meadow','temperate'], status:'IN_PROGRESS'}),
  'scene48:meadow-sedge': Object.freeze({attachment:'ground', footprint:[0.72,0.76,0.72], collision:'pass-through', tier:'dense', biome:['meadow','temperate'], status:'IN_PROGRESS'}),
  'scene48:button-mushroom': Object.freeze({attachment:'ground', footprint:[0.5,0.46,0.5], collision:'pass-through', tier:'medium', biome:['forest','enchanted-forest'], status:'SOURCE_READY'})
});
const mix = n => { n = Math.imul(n ^ n >>> 16, 0x7feb352d); n = Math.imul(n ^ n >>> 15, 0x846ca68b); return (n ^ n >>> 16) >>> 0; };
export function sceneVariant(seed, x, y, z, id) {
  if (!Object.hasOwn(SCENE_FAMILIES,id)) throw new RangeError('unknown scene family');
  if (![seed,x,y,z].every(Number.isSafeInteger)) throw new TypeError('integer seed and coordinates required');
  let h=mix(seed ^ Math.imul(x,73856093) ^ Math.imul(y,19349663) ^ Math.imul(z,83492791));
  for (let i=0;i<id.length;i++) h=mix(h ^ id.charCodeAt(i));
  return {yaw:(h&3)*Math.PI/2, scale:0.88+((h>>>4)&15)/100, bend:((h>>>8)&7)/70-0.05, variant:(h>>>12)&3};
}
// Each triangle has 3 positions (xyz) and a palette index; no textures, alpha sorting or draw-per-leaf.
function builder(){const positions=[],materials=[];return {positions,materials,tri(a,b,c,m){positions.push(...a,...b,...c);materials.push(m);},quad(a,b,c,d,m){this.tri(a,b,c,m);this.tri(a,c,d,m);},finish(){return {positions:new Float32Array(positions),materials:new Uint8Array(materials),triangleCount:materials.length};}};}
function leaf(b,x,y,z,dx,dy,dz,w,m){
  const p=[x,y,z], tip=[x+dx,y+dy,z+dz], side=[-dz*w,0,dx*w];
  b.tri(p,[x+dx*.48+side[0],y+dy*.46,z+dz*.48+side[2]],tip,m);
  b.tri(p,tip,[x+dx*.48-side[0],y+dy*.46,z+dz*.48-side[2]],m);
}
const TAU=2*Math.PI;
function blade(b,base,angle,reach,height,width,material) {
 const [x,y,z]=base, dx=Math.cos(angle), dz=Math.sin(angle);
 const center=[x+dx*reach*.48,y+height*.60,z+dz*reach*.48];
 const tip=[x+dx*reach,y+height,z+dz*reach];
 const left=[center[0]-dz*width,center[1]-width*.21,center[2]+dx*width];
 const right=[center[0]+dz*width,center[1]-width*.21,center[2]-dx*width];
 b.tri(base,left,center,material);
 b.tri(base,center,right,material+1);
 b.tri(center,left,tip,material);
 b.tri(center,tip,right,material+1);
}

function stalk(b,[x,y,z],[tx,ty,tz],width,material) {
 b.quad([x-width,y,z],[x+width,y,z],
  [tx+width*.65,ty,tz],[tx-width*.65,ty,tz],material);
 b.quad([x,y,z-width],[x,y,z+width],
  [tx,ty,tz+width*.65],[tx,ty,tz-width*.65],material);
}

function ring(b,center,levels,sides,angle) {
 const [x,z]=center;
 const circles=levels.map(([height,radius])=>Array.from({length:sides},(_,i)=>{
  const heading=angle+i*TAU/sides;
  return [x+Math.cos(heading)*radius,height,z+Math.sin(heading)*radius];
 }));
 for(let level=1;level<circles.length;level++){
  const from=circles[level-1],to=circles[level],material=levels[level][2];
  for(let side=0;side<sides;side++){
   const next=(side+1)%sides;
   b.quad(from[side],from[next],to[next],to[side],material);
  }
 }
}

function grass(b,v) {
 const count=6+v.variant;
 for(let i=0;i<count;i++){
  const angle=i*2.399963+v.bend+v.variant*.14;
  const r=.049+.026*(i%3);
  const base=[Math.cos(angle)*r,0,Math.sin(angle)*r];
  blade(b,base,angle,.16+(i%3)*.054,.18+(i%4)*.053+v.variant*.014,
   .027+.007*(i%2),i%3===0?1:0);
 }
}

function fern(b,v) {
 const count=3+v.variant%2;
 for(let f=0;f<count;f++){
  const angle=f*TAU/count+v.bend+v.variant*.19;
  const dx=Math.cos(angle), dz=Math.sin(angle);
  const reach=.31+.032*(f%3), height=.50+.044*v.variant;
  const point=t=>[dx*reach*t,height*(1-(1-t)**2),dz*reach*t];
  for(let j=0;j<4;j++){
   const a=point(j/4),c=point((j+1)/4);
   b.quad([a[0]-dz*.009,a[1],a[2]+dx*.009],
    [a[0]+dz*.009,a[1],a[2]-dx*.009],
    [c[0]+dz*.007,c[1],c[2]-dx*.007],
    [c[0]-dz*.007,c[1],c[2]+dx*.007],2);
   const attach=point((j+.60)/4);
   for(const side of [-1,1]){
    const width=.022+.008*(3-j);
    blade(b,attach,angle+side*.92,.18-j*.028,.036+j*.004,width,0);
   }
  }
 }
}

function flower(b,v) {
 const z=v.bend, base=[0,0,z], crown=[0,.58,z];
 // Keep the anchor and original reach around the central visible bloom.
 stalk(b,base,crown,.018,2);
 blade(b,[0,.25,z],.55,.14,.045,.041,0);
 blade(b,[0,.37,z],3.64,.12,.063,.037,1);
 const petals=5+v.variant;
 for(let i=0;i<petals;i++){
  const a=i*TAU/petals,dx=Math.cos(a),dz=Math.sin(a);
  const span=.17+((i+v.variant)%2)*.013;
  leaf(b,0,.58,z,dx*span,.09+v.variant*.009,dz*span,.15,3);
  b.tri([dx*.052,.593,z+dz*.052],
   [dx*.121-dz*.032,.623,z+dz*.121+dx*.032],
   [dx*.159,.646,z+dz*.159],4);
 }
 const ringCenter=[0,.634,z];
 for(let i=0;i<8;i++){
  const a=i*TAU/8,c=(i+1)*TAU/8;
  b.tri(ringCenter,[Math.cos(a)*.057,.613,z+Math.sin(a)*.057],
   [Math.cos(c)*.057,.613,z+Math.sin(c)*.057],4);
 }
 // Central calyx triangle retained from the inherited pickable source.
 b.tri([-.05,.59,z],[.05,.59,z],[0,.65,z],4);
}

function mushroom(b,v) {
 const height=.37+v.variant*.031, width=.174+v.variant*.017;
 const angle=v.bend+v.variant*.13;
 ring(b,[0,0],[[0,.042,5],[height*.32,.034,5],[height*.68,.047,7]],6,angle);
 ring(b,[0,0],[[height*.66,.049,7],[height*.67,width*.88,7],
  [height*.76,width,6],[height*.91,width*.74,6],[height,width*.32,10]],8,angle);
 for(let i=0;i<8;i++){
  const a=angle+i*TAU/8,c=angle+(i+1)*TAU/8;
  b.tri([0,height+.008,0],[Math.cos(a)*width*.32,height,Math.sin(a)*width*.32],
   [Math.cos(c)*width*.32,height,Math.sin(c)*width*.32],10);
 }
}

function lavender(b,v) {
 const count=3+v.variant%2;
 for(let i=0;i<count;i++){
  const a=i*TAU/count+v.bend+v.variant*.27;
  const x=Math.cos(a)*.11,z=Math.sin(a)*.11,h=.57+i*.068+v.variant*.012;
  stalk(b,[x,0,z],[x,h,z],.012,2);
  blade(b,[x,h*.32,z],a,.10,.05,.023,1);
  ring(b,[x,z],[[h-.17,.025,8],[h-.13,.052,8],
   [h-.05,.038,11],[h+.022,.019,8]],5,a+.27);
 }
}

function heather(b,v) {
 const count=5+v.variant%2;
 for(let i=0;i<count;i++){
  const angle=i*TAU/count+v.bend+v.variant*.16;
  const dx=Math.cos(angle),dz=Math.sin(angle),height=.33+(i%3)*.052+v.variant*.02;
  const root=[dx*.04,0,dz*.04], tip=[dx*.25,height,dz*.25];
  stalk(b,root,tip,.011,2);
  for(let j=1;j<=4;j++){
   const t=j/5,x=root[0]+(tip[0]-root[0])*t,y=height*t,z=root[2]+(tip[2]-root[2])*t;
   if(j<3)blade(b,[x,y,z],angle+(j%2===0?1:-1)*.86,.105,.038,.028,0);
   const r=.045+j*.003;
   for(const side of [-1,1]){
    const left=[x-dz*side*r,y+.03,z+dx*side*r];
    const right=[x+dx*.032,y+.058,z+dz*.032];
    const top=[left[0]+dx*.024,left[1]+.042,left[2]+dz*.024];
    b.tri([x,y,z],left,right,9);
    b.tri(left,top,right,12);
   }
  }
 }
}

function clover(b,v) {
 const count=4+v.variant%2;
 for(let i=0;i<count;i++){
  const a=i*TAU/count+v.bend+v.variant*.16,x=Math.cos(a)*.105,z=Math.sin(a)*.105;
  const h=.17+(i%2)*.034+v.variant*.025;
  stalk(b,[x*.6,0,z*.6],[x,h,z],.009,2);
  for(let p=0;p<3;p++){
   const heading=a+p*TAU/3,dx=Math.cos(heading),dz=Math.sin(heading);
   const reach=.112+(i%3)*.009;
   const base=[x,h,z], center=[x+dx*.064,h+.038,z+dz*.064];
   const tip=[x+dx*reach,h+.026,z+dz*reach];
   const left=[center[0]-dz*.035,h+.026,center[2]+dx*.035];
   const right=[center[0]+dz*.035,h+.026,center[2]-dx*.035];
   b.tri(base,left,center,1);
   b.tri(base,center,right,2);
   b.tri(center,left,tip,1);
   b.tri(center,tip,right,2);
  }
 }
}

function sedge(b,v) {
 const count=6+v.variant;
 for(let i=0;i<count;i++){
  const angle=i*TAU/count+v.bend+v.variant*.11;
  const root=[Math.cos(angle)*.044,0,Math.sin(angle)*.044];
  blade(b,root,angle,.19+(i%2)*.04,.33+(i%3)*.071,.032,0);
 }
 for(let i=0;i<2;i++){
  const a=v.bend+i*Math.PI,x=Math.cos(a)*.086,z=Math.sin(a)*.086;
  const height=.59+i*.07+v.variant*.032;
  stalk(b,[x,0,z],[x,height,z],.011,2);
  ring(b,[x,z],[[height-.083,.019,13],[height-.05,.037,13],
   [height+.021,.016,14]],5,a);
 }
}
const makers={'scene48:clover-clump':clover,'scene48:meadow-sedge':sedge,'scene48:lavender-spike':lavender,'scene48:heather-sprig':heather,'scene48:low-grass':grass,'scene48:short-fern':fern,'scene48:single-wildflower':flower,'scene48:button-mushroom':mushroom};
export function createSceneMesh(id,seed,x,y,z,requestedVariant){
 const v=sceneVariant(seed,x,y,z,id);
 if(requestedVariant!==undefined){
  if(!Number.isInteger(requestedVariant)||requestedVariant<0||requestedVariant>3)
   throw new RangeError('Invalid flora variant');
  v.variant=requestedVariant;
 }
 const b=builder();
 makers[id](b,v);
 return {id,anchor:[x,y,z],variant:v,mesh:b.finish(),attachment:SCENE_FAMILIES[id].attachment,collision:'pass-through'};
}
export function makeSceneBatch(instances){
 const batches=new Map();
 for(const item of instances){if(!item || !Object.hasOwn(SCENE_FAMILIES,item.id))throw new RangeError('invalid scene instance');const key=item.id;let batch=batches.get(key);if(!batch){batch={id:key,mesh:createSceneMesh(key,0,0,0,0).mesh,instances:[]};batches.set(key,batch);}const {seed,x,y,z}=item;batch.instances.push({anchor:[x,y,z],...sceneVariant(seed,x,y,z,key)});}
 return [...batches.values()];
}
