// Water B: read-only shared presentation v1, no runtime mount.
export const PRESENTATION_VERSION=1;
export const PRESENTATION_IDS=Object.freeze(['water','lava','acid','amber-sap','liquid-resonance']);
const ids=new Set(PRESENTATION_IDS);
const offsets=[[0,-1,0],[1,0,0],[0,0,1],[-1,0,0],[0,0,-1],[0,1,0]];
const valid=p=>Array.isArray(p)&&p.length===3&&p.every(Number.isSafeInteger)&&p[1]>=-210&&p[1]<=256;
const key=p=>p.join(',');
const int=(n,a,b)=>Number.isSafeInteger(n)&&n>=a&&n<=b;
const add=(p,d)=>p.map((n,i)=>n+d[i]);
// Reject excess input, never return a silently truncated update.
function points(input,cap){
  if(!Array.isArray(input)||input.length>cap)throw RangeError('Presentation input budget');
  const seen=new Map();
  for(const p of input){if(!valid(p))throw RangeError('Invalid physical cell');seen.set(key(p),[...p]);}
  return [...seen.values()];
}
export function expandLiquidDirty(changed,{maxChanged=256,maxDirty=1792}={}){
  if(!int(maxChanged,1,4096)||!int(maxDirty,1,28672))throw RangeError('Invalid dirty budget');
  const result=new Map();
  for(const p of points(changed,maxChanged))for(const d of [[0,0,0],...offsets]){
    const q=add(p,d);if(!valid(q))continue;
    result.set(key(q),q);if(result.size>maxDirty)throw RangeError('Dirty output budget');
  }
  return [...result.values()];
}
// read only loaded/passable cells; null engine cell means air, undefined means unknown/solid.
// A batch contains explicit owner cells only, while sampling may cross owner boundaries.
export function buildLiquidMesh({engine,isLoaded,isOpen,cells,origin,maxCells=256,maxFaces=2560}={}){
  if(typeof engine?.getCell!=='function'||typeof isLoaded!=='function'||typeof isOpen!=='function')throw TypeError('Explicit presentation host required');
  if(!valid(origin)||!int(maxCells,1,4096)||!int(maxFaces,1,40960))throw RangeError('Invalid mesh budget or origin');
  const selected=points(cells,maxCells),cache=new Map(),groups=new Map();
  let faceCount=0;
  function read(p){
    if(!valid(p))return undefined;
    const k=key(p);if(cache.has(k))return cache.get(k);
    let c;
    if(isLoaded(...p)===true&&isOpen(...p)===true){
      c=engine.getCell(...p);
      if(c!==null&&(!c||!ids.has(c.id)||!int(c.units,1,8)||c.x!==p[0]||c.y!==p[1]||c.z!==p[2]))throw TypeError('Invalid liquid cell');
    }
    cache.set(k,c);return c;
  }
  function emit(id,verts,normal){
    if(++faceCount>maxFaces)throw RangeError('Mesh face budget');
    let g=groups.get(id);if(!g){g={p:[],n:[],i:[]};groups.set(id,g);}
    const k=g.p.length/3;
    for(const v of verts){g.p.push(...v);g.n.push(...normal);}
    g.i.push(k,k+1,k+2,k,k+2,k+3);
  }
  for(const p of selected){
    const [x,y,z]=p.map((n,i)=>n-origin[i]);
    if([x,y,z].some(n=>!int(n,-4096,4096)))throw RangeError('Mesh local precision envelope');
    const c=read(p);if(!c)continue;
    const h=c.units/8,id=c.id;
    const owns=n=>id<n.id;
    const plane=(t,up)=>{
      const v=[[x,y+t,z],[x,y+t,z+1],[x+1,y+t,z+1],[x+1,y+t,z]];
      emit(id,up?v:v.reverse(),[0,up?1:-1,0]);
    };
    const above=read(add(p,offsets[5])),below=read(add(p,offsets[0]));
    if(h<1||above===null||(above&&above.id!==id&&owns(above)))plane(h,true);
    if(below===null||(below&&(below.units<8||(below.id!==id&&owns(below)))))plane(0,false);
    for(let i=1;i<=4;i++){
      const n=read(add(p,offsets[i]));if(n===undefined)continue;
      const nh=n?n.units/8:0;
      const side=(lo,hi)=>{
        if(hi<=lo)return;
        const b=y+lo,t=y+hi;
        const vertices=[
          [[x+1,b,z],[x+1,t,z],[x+1,t,z+1],[x+1,b,z+1]],
          [[x+1,b,z+1],[x+1,t,z+1],[x,t,z+1],[x,b,z+1]],
          [[x,b,z+1],[x,t,z+1],[x,t,z],[x,b,z]],
          [[x,b,z],[x,t,z],[x+1,t,z],[x+1,b,z]]
        ][i-1];
        emit(id,vertices,offsets[i]);
      };
      if(n&&n.id!==id&&owns(n))side(0,Math.min(h,nh));
      side(nh,h);
    }
  }
  return {version:PRESENTATION_VERSION,origin:[...origin],faceCount,groups:PRESENTATION_IDS.filter(id=>groups.has(id)).map(id=>{
    const g=groups.get(id);return {id,positions:new Float32Array(g.p),normals:new Float32Array(g.n),indices:new Uint32Array(g.i)};
  })};
}
