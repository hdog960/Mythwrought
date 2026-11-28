// Amber Sap B: optional surface-edge sheen, not extra liquid geometry or physics.
const int=(n,a,b)=>Number.isSafeInteger(n)&&n>=a&&n<=b;
const point=(x,y,z)=>Number.isSafeInteger(x)&&int(y,-210,256)&&Number.isSafeInteger(z);
const sides=['east','south','west','north'];
const faces=['bottom',...sides,'top'];
const inset=1/32;
const corners={east:[[1-inset,inset],[1-inset,1-inset]],south:[[inset,1-inset],[1-inset,1-inset]],
  west:[[inset,inset],[inset,1-inset]],north:[[inset,inset],[1-inset,inset]]};

// Consume the physics owner's current describe(cell) signal, not a second
// retention calculation. Output is local to the cell and bounded to four edges.
// Host uses the existing amber material, depth test and surface shader; no
// separate transparent volume, GPU allocation or additional liquid inventory.
export function sampleAmberAdhesionVisual({engine,retention,isLoaded,isOpen,x,y,z}={}){
  if([engine?.getCell,retention?.describe,isLoaded,isOpen].some(f=>typeof f!=='function'))
    throw TypeError('Explicit adhesion visual host required');
  if(!point(x,y,z))throw RangeError('Invalid adhesion visual coordinate');
  if(isLoaded(x,y,z)!==true||isOpen(x,y,z)!==true)return null;
  const c=engine.getCell(x,y,z);
  if(c?.id!=='amber-sap')return null;
  if(c.x!==x||c.y!==y||c.z!==z||!int(c.units,1,8))throw TypeError('Invalid sap cell');
  const signal=retention.describe(c);
  if(signal===null)return null;
  if(!signal||!Array.isArray(signal.faces)||signal.faces.length>6||
    new Set(signal.faces).size!==signal.faces.length||signal.faces.some(f=>!faces.includes(f))||
    !int(signal.reservedUnits,0,c.units)||signal.movableUnits!==c.units-signal.reservedUnits||
    (signal.reservedUnits>0&&!signal.faces.length)|| (c.units<8&&signal.faces.includes('top')))
    throw TypeError('Invalid retention presentation signal');
  if(!signal.reservedUnits)return null;
  // Full cells have no visible top sheen when the above cell is unknown,
  // solid, occupied, or outside physical bounds. Partial fill has an air gap.
  if(c.units===8&&(!point(x,y+1,z)||isLoaded(x,y+1,z)!==true||
    isOpen(x,y+1,z)!==true||engine.getCell(x,y+1,z)!==null))return null;
  const h=c.units/8;
  const edges=sides.filter(f=>signal.faces.includes(f)).map(face=>Object.freeze({face,
    points:Object.freeze(corners[face].map(([u,v])=>Object.freeze([u,h,v])))}));
  if(!edges.length)return null;
  return Object.freeze({id:'amber-sap',origin:Object.freeze([x,y,z]),fill:h,
    strength:signal.reservedUnits/c.units,edges:Object.freeze(edges)});
}
