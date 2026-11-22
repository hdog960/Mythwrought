// MYTHWROUGHT — source-authorized physical sky vegetation proposals.
// Turns the isolated sky-vegetation-plan descriptors into actual voxel-cell
// proposals WITHOUT writing to any world, save, PWA cache, or GPU stream.
// Asset IDs come from a real existing physical registry host; no fake IDs or
// render-only flora are introduced here. Call only with a complete island plan.
import {SKY_ISLAND_MIN_Y,SKY_ISLAND_MAX_Y} from './sky-runtime-adapter.mjs';
export const SKY_PHYSICAL_MAX_CELLS=512;
export const SKY_PHYSICAL_MAX_CANDIDATES=64;
const safe=n=>Number.isSafeInteger(n);
const fail=s=>{throw new TypeError('Sky physical vegetation: '+s);};
const key=(x,y,z)=>x+','+y+','+z;
const sort=(a,b)=>a.x-b.x||a.z-b.z||a.y-b.y||a.id-b.id;
function hash(seed,x,y,z,salt){
  let h=Math.imul(seed^salt,0x9e3779b1);
  for(const c of [x,y,z]){h^=Math.imul(c|0,0x85ebca6b);h=Math.imul(h^(h>>>16),0xc2b2ae35);}
  h^=h>>>15;return(h>>>0)/4294967296;
}
function makeTree(p,seed){
  const trunk=[];const leaves=[];const h=4+Math.floor(hash(seed,p.x,p.y,p.z,8)*3);
  const bend=hash(seed,p.x,p.y,p.z,17)>.5?1:-1;
  const style=p.kind;
  for(let dy=0;dy<h;dy++)trunk.push([0,dy,0]);
  if(style==='windbent-pine'){
    for(let dy=h-3;dy<=h+1;dy++){
      const ring=dy===h+1?0:dy===h-3?2:dy===h-2?2:1;
      for(let dx=-ring;dx<=ring;dx++)for(let dz=-ring;dz<=ring;dz++){
        if(Math.max(Math.abs(dx),Math.abs(dz))>ring||
          Math.abs(dx)+Math.abs(dz)>ring*2-1)continue;
        const shiftedX=dx+(dy>h-2?bend:0);
        if(hash(seed,p.x+shiftedX,p.y+dy,p.z+dz,78)>.93)continue;
        leaves.push([shiftedX,dy,dz]);
      }
    }
  }else if(style==='cloudleaf-tree'){
    for(let dy=h-1;dy<=h+2;dy++){
      const ring=dy===h+2?1:dy===h-1?2:3;
      for(let dx=-ring;dx<=ring;dx++)for(let dz=-ring;dz<=ring;dz++){
        if(dx*dx+dz*dz>ring*ring+1||
          hash(seed,p.x+dx,p.y+dy,p.z+dz,81)>.83)continue;
        leaves.push([dx,dy,dz]);
      }
    }
  }else{
    for(let dy=h-1;dy<=h+2;dy++)for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++){
      const radial=Math.abs(dx)+Math.abs(dz);
      if(radial>3||hash(seed,p.x+dx,p.y+dy,p.z+dz,89)>.72)continue;
      leaves.push([dx+(dy>h?bend:0),dy,dz]);
    }
  }
  return {trunk,leaves};
}
const treeKinds=new Set(['windbent-pine','cloudleaf-tree','starbloom-tree']);
const groundKinds=new Set(['fern-thicket','blossom-shrub','glowmoss','skybell-flowers','windgrass-tuft']);
// Source get must already include authentic sky edits; a zero read is AIR.
// No attempt to trust a visual mesh as ground truth for support or clearance.
export function planPhysicalSkyVegetation({seed,plan,sourceGet,assetFor,isPhysicalAsset,
  isProtectedCell=()=>false,maxCells=SKY_PHYSICAL_MAX_CELLS}={}){
  if(!safe(seed)||!plan||!Array.isArray(plan.placements)||
    plan.placements.length>SKY_PHYSICAL_MAX_CANDIDATES||typeof sourceGet!=='function'||
    typeof assetFor!=='function'||typeof isPhysicalAsset!=='function'||
    typeof isProtectedCell!=='function'||!safe(maxCells)||maxCells<0||
    maxCells>SKY_PHYSICAL_MAX_CELLS)fail('bounded source-certified foliage inputs required');
  const trees=[],covers=[],inputs=new Set();
  for(const p of plan.placements){
    if(!p||![p.x,p.y,p.z].every(safe)||p.y<SKY_ISLAND_MIN_Y||
      p.y>SKY_ISLAND_MAX_Y||typeof p.kind!=='string'||
      !['canopy','ground-cover'].includes(p.group)||
      !((p.group==='canopy'&&treeKinds.has(p.kind))||
        (p.group==='ground-cover'&&groundKinds.has(p.kind))))
      fail('unsupported/unsafe physical flora descriptor');
    const k=key(p.x,p.y,p.z);if(inputs.has(k))fail('duplicate sky vegetation anchor');
    inputs.add(k);(p.group==='canopy'?trees:covers).push(p);
  }
  const proposed=new Map();let rejected=0,treesPlaced=0;
  const originalGet=(x,y,z)=>{
    const value=sourceGet(x,y,z);
    if(!safe(value)||value<0||value>65534)fail('invalid original voxel cell');
    return value;
  };
  const physicalId=(kind,role)=>{
    const id=assetFor(kind,role);
    if(!safe(id)||id<1||id>65534||!isPhysicalAsset(id))
      fail('unregistered physical foliage asset');
    return id;
  };
  const attempt=(p,cells)=>{
    // All-or-none: if a single trunk/leaf cell is obstructed, do not create a
    // floating tree fragment or erase any cave, authored structure or sky edit.
    if(originalGet(p.x,p.y-1,p.z)===0){rejected++;return false;}
    const local=new Map();
    for(const [dx,dy,dz,id] of cells){
      const x=p.x+dx,y=p.y+dy,z=p.z+dz,k=key(x,y,z);
      if(y<SKY_ISLAND_MIN_Y||y>SKY_ISLAND_MAX_Y||isProtectedCell(x,y,z)||
         proposed.has(k)||originalGet(x,y,z)!==0){rejected++;return false;}
      if(local.has(k)){
        if(local.get(k).id!==id){rejected++;return false;}
        continue;
      }
      local.set(k,Object.freeze({x,y,z,id,from:p.kind}));
    }
    if(proposed.size+local.size>maxCells){rejected++;return false;}
    for(const [k,v] of local)proposed.set(k,v);
    return true;
  };
  trees.sort(sort);covers.sort(sort);
  for(const p of trees){
    const trunk=physicalId(p.kind,'trunk'),leaf=physicalId(p.kind,'leaves');
    const shape=makeTree(p,seed),cells=[...shape.trunk.map(([x,y,z])=>[x,y,z,trunk]),
      ...shape.leaves.map(([x,y,z])=>[x,y,z,leaf])];
    // The trunk owns the center column even when crown leaves overlap it.
    const trunkPositions=new Set(shape.trunk.map(([x,y,z])=>key(x,y,z)));
    const cleaned=cells.filter((c,i)=>i<shape.trunk.length||
      !trunkPositions.has(key(c[0],c[1],c[2])));
    if(attempt(p,cleaned))treesPlaced++;
  }
  for(const p of covers){
    const block=physicalId(p.kind,'ground-cover');
    attempt(p,[[0,0,0,block]]);
  }
  return Object.freeze({edits:Object.freeze([...proposed.values()].sort(sort)),
    treeCount:treesPlaced,rejected,sourceAnchors:plan.placements.length,
    worldWrites:0,saveWrites:0,renderOnlyMeshes:0});
}
