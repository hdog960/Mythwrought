// Acid B: finite, read-only world content proposals; no generator or physics.
const int=(n,a,b)=>Number.isSafeInteger(n)&&n>=a&&n<=b;
const valid=(x,y,z)=>Number.isSafeInteger(x)&&int(y,-210,256)&&Number.isSafeInteger(z);
const key=(x,y,z)=>`${x},${y},${z}`;
const freezeOffsets=rows=>Object.freeze(rows.map(p=>Object.freeze(p)));
export const ACID_POOL_SHAPES=Object.freeze({
  seep:freezeOffsets([[0,0],[1,0],[-1,0],[0,1],[0,-1]]),
  basin:freezeOffsets([[-1,-1],[0,-1],[1,-1],[-1,0],[0,0],[1,0],[-1,1],[0,1],[1,1]])
});
const faces=[[1,0],[-1,0],[0,1],[0,-1]];
// Every cell is an explicit finite allocation, not a replenishing source.
// Host must atomically revalidate and apply the entire plan with its supply debit.
export function planAcidPool({anchor,shape='seep',unitsPerCell=4,availableUnits,
  strength,acidQuantities,engine,isLoaded,isOpen,isSolid,canPlace}={}){
  if(!Array.isArray(anchor)||anchor.length!==3||!valid(...anchor)||
    !Object.hasOwn(ACID_POOL_SHAPES,shape)||!int(unitsPerCell,1,8)||
    !int(availableUnits,0,Number.MAX_SAFE_INTEGER)||typeof engine?.getCell!=='function'||
    [acidQuantities,isLoaded,isOpen,isSolid,canPlace].some(f=>typeof f!=='function'))
    throw new TypeError('Invalid acid pool proposal input');
  const [x,y,z]=anchor,offsets=ACID_POOL_SHAPES[shape],totalUnits=offsets.length*unitsPerCell;
  if(totalUnits>availableUnits)return null;
  const points=offsets.map(([dx,dz])=>[x+dx,y,z+dz]);
  if(points.some(p=>!valid(...p)))return null;
  const footprint=new Set(points.map(p=>key(...p))),walls=new Map();
  for(const [px,py,pz] of points){
    for(const p of [[px,py-1,pz],...faces.map(([dx,dz])=>[px+dx,py,pz+dz])]){
      const k=key(...p);if(!footprint.has(k))walls.set(k,p);
    }
  }
  for(const p of walls.values())if(!valid(...p)||isLoaded(...p)!==true||isSolid(...p)!==true)return null;
  for(const p of points)if(isLoaded(...p)!==true||isOpen(...p)!==true||canPlace(...p)!==true||engine.getCell(...p)!==null)return null;
  // Acid A owns concentration and supplies the extensive quantity factory.
  const raw=acidQuantities(unitsPerCell,strength);
  if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new TypeError('Invalid acid quantity payload');
  const entries=Object.entries(raw);
  if(entries.length>8||entries.some(([k,v])=>!/^[a-z][a-z0-9-]{0,31}$/.test(k)||!int(v,0,2**40)))
    throw new RangeError('Invalid shared quantity payload');
  const quantities=Object.freeze(Object.fromEntries(entries.filter(([,v])=>v!==0)));
  const placements=points.map(([x,y,z])=>Object.freeze({x,y,z,id:'acid',units:unitsPerCell,quantities,expected:null}));
  const totalQuantities=Object.freeze(Object.fromEntries(Object.entries(quantities).map(([k,v])=>[k,v*points.length])));
  return Object.freeze({version:1,shape,anchor:Object.freeze([...anchor]),totalUnits,totalQuantities,
    remainingUnits:availableUnits-totalUnits,placements:Object.freeze(placements),
    requiredSolid:Object.freeze([...walls.values()].map(p=>Object.freeze(p)))});
}
