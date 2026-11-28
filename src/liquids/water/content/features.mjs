// Isolated Water B content proposals; no simulation, injection or terrain writes.
import {WATER_MATERIAL} from './material.mjs';
const integer=(n,min,max)=>Number.isSafeInteger(n)&&n>=min&&n<=max;
const point=p=>Array.isArray(p)&&p.length===3&&Number.isSafeInteger(p[0])&&integer(p[1],-210,256)&&Number.isSafeInteger(p[2]);
const sides=[[1,0,0],[0,0,1],[-1,0,0],[0,0,-1]];
const add=(a,b)=>a.map((v,i)=>v+b[i]);
const key=p=>p.join(',');
const unit=n=>integer(n,1,8);

// Explicit bounded fixture/host candidate layout. Never creates a source or
// grants placement authority; caller must budget and stage the entire volume.
export function planWaterFeature({kind,origin,width=1,length=1,path,units=8,maxCells=256}={}){
  if(!unit(units)||!integer(maxCells,1,4096))throw new RangeError('Invalid water feature budget');
  let points=[];
  if(kind==='pool'){
    if(!point(origin)||!integer(width,1,maxCells)||!integer(length,1,maxCells)||width*length>maxCells||path!==undefined)
      throw new RangeError('Invalid bounded pool');
    for(let z=0;z<length;z++)for(let x=0;x<width;x++)points.push(add(origin,[x,0,z]));
  }else if(kind==='river'||kind==='waterfall'){
    if(origin!==undefined||width!==1||length!==1||!Array.isArray(path)||path.length<2||path.length>maxCells)
      throw new RangeError('Invalid bounded water path');
    points=path;
  }else throw new TypeError('Unknown water feature');
  const seen=new Set(),cells=[];
  for(let i=0;i<points.length;i++){
    const p=points[i];
    if(!point(p)||seen.has(key(p)))throw new RangeError('Invalid or repeated physical cell');
    if(i&&kind!=='pool'){
      const [dx,dy,dz]=p.map((v,j)=>v-points[i-1][j]);
      const horizontal=Math.abs(dx)+Math.abs(dz);
      if(kind==='waterfall'?horizontal!==0||dy!==-1:horizontal!==1||dy!==0)
        throw new RangeError('Invalid path step; use separate waterfall for vertical drops');
    }
    seen.add(key(p));cells.push(Object.freeze({x:p[0],y:p[1],z:p[2],id:'water',units}));
  }
  return Object.freeze({kind,cells:Object.freeze(cells),requiredUnits:cells.length*units});
}

// Geometry-only water shading signals. A falling-looking edge is NOT measured
// velocity. Unknown/unloaded cells suppress hints, and other liquids never
// count as water or empty space. Bits follow +X,+Z,-X,-Z.
export function describeWaterSurface({engine,isLoaded,isOpen,x,y,z,foamStrength=0.45}={}){
  if(typeof engine?.getCell!=='function'||typeof isLoaded!=='function'||typeof isOpen!=='function'||
    !Number.isFinite(foamStrength)||foamStrength<0||foamStrength>1||!point([x,y,z]))
    throw new TypeError('Invalid water surface inputs');
  const p=[x,y,z];
  function read(q){
    if(!point(q)||isLoaded(...q)!==true)return {kind:'unknown'};
    const open=isOpen(...q);
    if(open!==true)return {kind:open===false?'solid':'unknown'};
    const c=engine.getCell(...q);
    if(c===null)return {kind:'empty'};
    if(!c||c.x!==q[0]||c.y!==q[1]||c.z!==q[2]||!unit(c.units)||
       !['water','lava','acid','amber-sap','liquid-resonance'].includes(c.id))throw new TypeError('Invalid liquid sample');
    return {kind:c.id,units:c.units};
  }
  const here=read(p);
  if(here.kind!=='water')return null;
  const above=read(add(p,[0,1,0])),below=read(add(p,[0,-1,0]));
  let shoreMask=0,fallMask=0;
  for(let i=0;i<sides.length;i++){
    const q=add(p,sides[i]),neighbor=read(q);
    if(neighbor.kind==='solid')shoreMask|=1<<i;
    if(neighbor.kind==='empty'&&(above.kind==='water'||below.kind==='water')&&
      read(add(q,[0,-1,0])).kind==='empty')fallMask|=1<<i;
  }
  // Only an exposed air top can receive foam; no foam under other liquids.
  const exposedTop=above.kind==='empty';
  const foamMask=exposedTop?(shoreMask|fallMask):0;
  return Object.freeze({fill:here.units/8,exposedTop,shoreMask,fallMask,foamMask,
    foamStrength:foamMask?foamStrength:0,material:WATER_MATERIAL});
}
