// MYTHWROUGHT Floating Islands: read-only physical world and material bridge.
// The production facade supplies original biome130Block/biome130Color,
// prototypeSurfaceMesh, environmentGround, collides and raycast. The source
// generator and its saved sky sidecar are authoritative; never edit either.
const AIR=0;
const safe=n=>Number.isSafeInteger(n);
const fail=message=>{throw new TypeError('Sky original bridge: '+message);};
const key=(x,y,z)=>x+','+y+','+z;
const LEGACY_COLORS=Object.freeze({
  1:[.35,.64,.32],2:[.48,.34,.24],3:[.48,.51,.55],
  4:[.60,.39,.23],5:[.36,.79,.92],6:[.70,.58,.33],
  7:[.27,.57,.31],8:[.32,.39,.48]
});
const TREE_IDS=Object.freeze({
  'windbent-pine':Object.freeze({trunk:370,leaves:379}),
  'cloudleaf-tree':Object.freeze({trunk:376,leaves:385}),
  'starbloom-tree':Object.freeze({trunk:375,leaves:384}),
  glowmoss:Object.freeze({'ground-cover':287})
});
// Explicit names from original main's biome130 registry and M10/M11 assets.
const EXPECTED_NAMES=Object.freeze({
  370:'Pine logs',379:'Pine needle clusters',
  376:'Moonwillow logs',385:'Moonwillow silverleaf curtains',
  375:'Blackwood logs',384:'Blackwood thornleaf canopies',
  287:'Star-moss ground'
});
const fullCube=boxes=>Array.isArray(boxes)&&boxes.length===1&&
  Array.isArray(boxes[0])&&boxes[0].length===6&&boxes[0].every((v,i)=>v===(i<3?0:1));
const checkRegistry=({biome130Block,isBiome130BlockId,biome130Color,environmentGround,prototypeSurfaceMesh})=>{
  if([biome130Block,isBiome130BlockId,biome130Color,environmentGround,
      prototypeSurfaceMesh].some(f=>typeof f!=='function'))fail('authentic physical source APIs required');
};
export function createSkyOriginalMaterials(source){
  checkRegistry(source);
  const {biome130Block,isBiome130BlockId,biome130Color,environmentGround,prototypeSurfaceMesh}=source;
  const shapeCache=new Map();
  const authoredAsset=id=>isBiome130BlockId(id)?biome130Block(id):null;
  function validateId(id){
    if(!safe(id)||id<0||id>65534)fail('nonphysical voxel ID');
    if(id===AIR||LEGACY_COLORS[id]||authoredAsset(id)||environmentGround(id))return id;
    fail('sky voxel missing original physical registry');
  }
  function shapeFor(id){
    validateId(id);if(id===AIR)return Object.freeze({cube:false,opaque:false});
    const b=authoredAsset(id);
    if(b)return Object.freeze({cube:fullCube(b.boxes),
      opaque:Boolean(b.solid&&!b.transparent&&b.opacity===1&&b.alphaMode==='opaque')});
    return Object.freeze({cube:true,opaque:true});
  }
  function surfaceMeshFor(id,rotation=0){
    if(!safe(rotation)||rotation<0||rotation>3)fail('invalid original rotation');
    const b=authoredAsset(validateId(id));
    if(!b)fail('original multi-box geometry must be biome130');
    const cacheKey=id+','+rotation;
    if(shapeCache.has(cacheKey))return shapeCache.get(cacheKey);
    const rotated=biome130Block(id,rotation);
    const result=prototypeSurfaceMesh({prototypeOnly:true,boxes:rotated.boxes});
    if(result.indices?.length>12000)fail('original shape budget exceeded');
    if(shapeCache.size>=64)shapeCache.delete(shapeCache.keys().next().value);
    shapeCache.set(cacheKey,result);return result;
  }
  function appearanceFor(id,x,y,z,face){
    validateId(id);
    if(![x,y,z,face].every(safe)||face<0||face>5)fail('invalid source face sample');
    if(isBiome130BlockId(id))return Object.freeze({color:[...biome130Color(id,x,y,z,face)],mat:0});
    const ground=environmentGround(id);
    if(ground)return Object.freeze({color:[...ground.color],
      mat:id>=400&&id<=402?42:id===408?4:id>=409?18:43});
    return Object.freeze({color:[...LEGACY_COLORS[id]],mat:id===7?18:id===8?19:id});
  }
  // Reject proxies and fabricated flora. Supported names must match real
  // original physical assets, including non-solid leaf collision authority.
  function assetFor(kind,role){
    const id=TREE_IDS[kind]?.[role];
    if(!id)return null;
    const b=authoredAsset(id);
    if(!b||b.name!==EXPECTED_NAMES[id]||
       (role==='trunk'&&!b.solid)||(role==='leaves'&&b.solid)||
       (role==='ground-cover'&&b.solid))return null;
    return id;
  }
  const isPhysicalAsset=id=>{try{return validateId(id)!==0;}catch(_){return false;}};
  function filterSupportedVegetation(plan){
    if(!plan||!Array.isArray(plan.placements))fail('source foliage plan required');
    const placements=plan.placements.filter(p=>{
      if(!p||typeof p.kind!=='string')fail('bad foliage placement');
      const roles=p.group==='canopy'?['trunk','leaves']:p.group==='ground-cover'?['ground-cover']:[];
      return roles.length>0&&roles.every(role=>assetFor(p.kind,role));
    });
    return Object.freeze({placements:Object.freeze(placements),
      omitted:plan.placements.length-placements.length});
  }
  return Object.freeze({validateId,shapeFor,surfaceMeshFor,appearanceFor,
    assetFor,isPhysicalAsset,filterSupportedVegetation,
    // For introspection only; does not allocate any real GPU resources.
    stats:()=>Object.freeze({cachedShapes:shapeCache.size})});
}

export function createSkyOriginalWorldView({groundWorld,skyGet,skyRotationAt=()=>0,
  skyEdits=new Map(),skyRotations=new Map(),validateSkyId}={}){
  if(!groundWorld||typeof groundWorld.get!=='function'||
     typeof skyGet!=='function'||typeof skyRotationAt!=='function'||
     typeof validateSkyId!=='function'||!(skyEdits instanceof Map)||
     !(skyRotations instanceof Map))fail('ground and genuine upper voxel sources required');
  function get(x,y,z){
    if(![x,y,z].every(safe))fail('unsafe voxel coordinates');
    if(y<20)return groundWorld.get(x,y,z);
    if(y>256)return AIR;
    const k=key(x,y,z);
    return validateSkyId(skyEdits.has(k)?skyEdits.get(k):skyGet(x,y,z));
  }
  function rotationAt(x,y,z){
    if(![x,y,z].every(safe))fail('unsafe rotation coordinates');
    if(y<20)return groundWorld.rotationAt?.(x,y,z)??0;
    if(y>256)return 0;
    const k=key(x,y,z),r=skyRotations.has(k)?skyRotations.get(k):skyRotationAt(x,y,z);
    if(!safe(r)||r<0||r>3)fail('invalid physical upper rotation');
    return r;
  }
  const view={get,rotationAt,
    getPack2State:(...coords)=>groundWorld.getPack2State?.(...coords),
    // Source raycast chooses legacy full-cube traversal when biomeCellCount
    // is zero. Force its SOURCE shape-aware raycast for possible sky flora.
    get biomeCellCount(){return Math.max(1,groundWorld.biomeCellCount??0);},
    get pack2Cells(){return groundWorld.pack2Cells;},
    get pack3Runtime(){return groundWorld.pack3Runtime;},
    get manual14Layer(){return groundWorld.manual14Layer;},
    get manual14Collision(){return groundWorld.manual14Collision;},
    get pack5Collision(){return groundWorld.pack5Collision;},
    get stagedNonblockCollision(){return groundWorld.stagedNonblockCollision;}
  };
  return Object.freeze(view);
}
export function createSkyOriginalPhysicalQueries(world,{collides,raycast}={}){
  if(!world||typeof world.get!=='function'||typeof collides!=='function'||
     typeof raycast!=='function')fail('original collides and raycast sources required');
  return Object.freeze({
    isBodyClear:(p)=>Boolean(p&&[p.x,p.y,p.z].every(Number.isFinite)&&
      !collides(world,p.x,p.y,p.z)),
    raycast:(eye,direction,range=7)=>raycast(world,eye,direction,range)
  });
}
