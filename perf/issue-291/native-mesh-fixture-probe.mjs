import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {performance} from 'node:perf_hooks';
import assert from 'node:assert/strict';
const src = new URL('./src/',import.meta.url);
// Real exact source ESM; controlled stand-ins for UNAVAILABLE registry/voxel/shape imports.
const mods = new Map();
const fixture = {
 'voxel.mjs':{BLOCK:Object.freeze({AIR:0,GRASS:1,DIRT:2,STONE:3,WOOD:4,CRYSTAL:5,ORE:6,LEAVES:7,DEEPSTONE:8}),CHUNK_SIZE:16},
 'pack2-integration.mjs':{isPack2LiveId:id=>Number.isInteger(id)&&id>=59&&id<=76,pack2WorldVertices:()=>new Float32Array([1,2,3,.1,.2,.3,0,1,60])},
 'biome130-registry.mjs':{isBiome130BlockId:id=>Number.isInteger(id)&&id>=256&&id<=385,biome130Block:()=>({boxes:[]}),biome130Color:()=>[.4,.5,.6]},
 'shape-prototypes.mjs':{prototypeSurfaceMesh:()=>({indices:[0,1,2],positions:[1,0,0,1,1,0,1,1,1],normals:[1,0,0,1,0,0,1,0,0]})}
};
function moduleFor(name){
 if(mods.has(name))return mods.get(name);
 const v=fixture[name];
 const m=v?new vm.SyntheticModule(Object.keys(v),function(){for(const [k,val] of Object.entries(v))this.setExport(k,val)},{identifier:name}):new vm.SourceTextModule(readFileSync(new URL(name,src),'utf8'),{identifier:name});
 mods.set(name,m);return m;
}
async function load(name,key){const m=moduleFor(name);if(m.status==='unlinked')await m.link(spec=>moduleFor(spec.replace(/^\.\//,'')));if(m.status==='linked')await m.evaluate();return m.namespace[key]}
const original=await load('depth-mesh.mjs','meshDepthSection');
const parent=await load('depth-mesh-291.mjs','meshDepthSection291');
const candidate=await load('depth-mesh-next.mjs','meshDepthSection291');
const {sectionBounds}=moduleFor('depth.mjs').namespace;
const cases=[];
for(const [cx,cz,s] of [[0,0,-1],[-2,3,-2],[-1,-2,-13]]){
 const {minY,maxY}=sectionBounds(s);
 for(const kind of ['solid','tunnel','cavern','checker','mixed','shapes']){
  const get=(x,y,z)=>{
   const q=Math.abs((x*73856093^y*19349663^z*83492791)|0);
   if(kind==='solid')return 8;
   if(kind==='tunnel')return (x-cx*16===7||x-cx*16===8)&&(y===minY+3||y===minY+4||y===minY+5)?0:3;
   if(kind==='cavern')return (x-cx*16-8)**2+(y-(minY+maxY)/2)**2+(z-cz*16-8)**2<42?0:8;
   if(kind==='checker')return (x+y+z)%2===0?0:3;
   if(kind==='shapes')return [0,3,8,60,76,256,400][q%7];
   return [0,0,1,2,3,3,8,8,76,400,410][q%11];
  };
  cases.push({cx,cz,s,kind,world:{get,getPack2State:()=>({id:60}),rotationAt:()=>0}});
 }
}
let bytes=0,reads=0;
for(const c of cases){const out=[];const traces=[];for(const f of [original,parent,candidate]){const trace=[];let world={...c.world,get:(...xyz)=>{trace.push(xyz);return c.world.get(...xyz)}};const v=f(world,c.cx,c.cz,c.s);out.push(Buffer.from(v.buffer,v.byteOffset,v.byteLength));traces.push(trace)};assert.deepEqual(out[0],out[1]);assert.deepEqual(out[0],out[2]);assert.deepEqual(traces[0],traces[1]);assert.deepEqual(traces[0],traces[2]);bytes+=out[0].length;reads+=traces[0].length;}
const stats=a=>{const v=a.slice().sort((a,b)=>a-b);return {median:+v[Math.floor(v.length/2)].toFixed(4),p95:+v[Math.ceil(v.length*.95)-1].toFixed(4)}};
let sink=0;
const run=(f,c)=>{const t=performance.now();const m=f(c.world,c.cx,c.cz,c.s);sink+=m.length;return performance.now()-t};
const report={node:process.version,fixtureScope:'exact source ESM via vm, four controlled collaborator modules, real depth/environment; not VoxelWorld or game',parity:{cases:cases.length,bytes,reads},rows:[]};
for(const kind of ['solid','tunnel','cavern','checker','mixed','shapes']){
 const subset=cases.filter(c=>c.kind===kind);for(let j=0;j<90;j++)for(const f of [original,parent,candidate])run(f,subset[j%3]);
 const times=[[],[],[]],fs=[original,parent,candidate];
 for(let j=0;j<180;j++){const c=subset[j%3];for(let i=0;i<3;i++){const k=(j+i)%3;times[k].push(run(fs[k],c));}}
 report.rows.push({kind,samplesPerVariant:180,original:stats(times[0]),parent:stats(times[1]),candidate:stats(times[2])});
}
report.sink=sink;console.log(JSON.stringify(report,null,2));
