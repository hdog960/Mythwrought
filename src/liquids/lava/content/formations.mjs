// Lava B isolated voxel formation proposals. No world or liquid mutation.
const int=(v,lo,hi)=>Number.isSafeInteger(v)&&v>=lo&&v<=hi;
const point=(x,y,z)=>Number.isSafeInteger(x)&&int(y,-210,256)&&Number.isSafeInteger(z);
const key=(x,z)=>`${x},${z}`;
const sides=[[1,0],[0,1],[-1,0],[0,-1]];
const at=(x,y,z)=>Object.freeze({x,y,z});
export const LAVA_FORMATION_KINDS=Object.freeze(['vent','pool','channel']);

// Fixed bounded footprints; all quantities and material tags are provisional.
// Heat density is passed to Lava A's lavaQuantities, not simulated here.
export function describeLavaFormation({kind,x,y,z,initialUnits=4,heatPerUnit=80,ventStock=0,ventRate=1}={}){
  if(!LAVA_FORMATION_KINDS.includes(kind)||!point(x,y,z)||y===-210||
    !int(initialUnits,1,8)||!int(heatPerUnit,0,100)||!int(ventStock,0,4096)||!int(ventRate,1,8)||
    (kind!=='vent'&&ventStock!==0))throw new RangeError('Invalid lava formation options');
  const interior=new Map();
  const add=(dx,dz)=>interior.set(key(dx,dz),[dx,dz]);
  if(kind==='vent')add(0,0);
  if(kind==='pool')for(let dz=-2;dz<=2;dz++)for(let dx=-2;dx<=2;dx++)if(Math.abs(dx)+Math.abs(dz)<=2)add(dx,dz);
  if(kind==='channel')for(let dz=0;dz<7;dz++){add(0,dz);if(dz===0||dz===6){add(-1,dz);add(1,dz);}}
  const rim=new Map();
  for(const [dx,dz] of interior.values())for(const [sx,sz] of sides){
    const k=key(dx+sx,dz+sz);if(!interior.has(k))rim.set(k,[dx+sx,dz+sz]);
  }
  const solids=[],seeds=[];
  function absolute(dx,dy,dz){const p=at(x+dx,y+dy,z+dz);if(!point(p.x,p.y,p.z))throw new RangeError('Formation outside physical envelope');return p;}
  for(const [dx,dz] of interior.values()){
    solids.push(Object.freeze({...absolute(dx,-1,dz),role:'floor',material:'lava-basin-lining'}));
    seeds.push(Object.freeze({...absolute(dx,0,dz),id:'lava',units:initialUnits,heatPerUnit}));
  }
  for(const [dx,dz] of rim.values()){
    solids.push(Object.freeze({...absolute(dx,-1,dz),role:'rim-support',material:'lava-basin-lining'}));
    solids.push(Object.freeze({...absolute(dx,0,dz),role:'rim',material:'lava-basin-lining'}));
  }
  const vent=kind==='vent'&&ventStock>0?Object.freeze({x,y,z,rate:ventRate,heatPerUnit,remaining:ventStock,renewable:false}):null;
  return Object.freeze({kind,solids:Object.freeze(solids),seeds:Object.freeze(seeds),vent,
    initialVolume:seeds.length*initialUnits,finiteReserve:ventStock,totalVolume:seeds.length*initialUnits+ventStock});
}

// Host owns actual cave eligibility, edit/streaming leases, supply and atomic adoption.
// inspect returns a stable immutable cell observation with an opaque revision string.
// No carving, replacing terrain, displacing liquid, or editing protected cells.
export function createLavaFormationPlanner({inspect,canSeed,canPlaceLining,isSuitableLining}={}){
  if([inspect,canSeed,canPlaceLining,isSuitableLining].some(f=>typeof f!=='function'))throw new TypeError('Explicit formation host callbacks required');
  const plans=new WeakMap();
  function evaluate(geometry){
    const checks=[],terrainWrites=[];
    for(const [list,seed] of [[geometry.solids,false],[geometry.seeds,true]])for(const cell of list){
      const observed=inspect(cell.x,cell.y,cell.z);
      if(!observed||observed.loaded!==true||observed.protected!==false||observed.liquid!==null||
        !['air','solid'].includes(observed.terrain)||typeof observed.revision!=='string'||!observed.revision.length||observed.revision.length>128)return null;
      if(seed){if(observed.terrain!=='air'||canSeed(cell,observed)!==true)return null;}
      else if(observed.terrain==='solid'){if(isSuitableLining(cell,observed)!==true)return null;}
      else{if(canPlaceLining(cell,observed)!==true)return null;terrainWrites.push(cell);}
      checks.push(Object.freeze({x:cell.x,y:cell.y,z:cell.z,terrain:observed.terrain,revision:observed.revision}));
    }
    return Object.freeze({geometry,checks:Object.freeze(checks),terrainWrites:Object.freeze(terrainWrites)});
  }
  function plan(options){const geometry=describeLavaFormation(options),p=evaluate(geometry);if(p)plans.set(p,geometry);return p;}
  // Single validation attempt; never authorizes a later or asynchronous commit.
  function validate(p){const geometry=plans.get(p);if(!geometry)return false;plans.delete(p);
    const next=evaluate(geometry);return next!==null&&JSON.stringify(next.checks)===JSON.stringify(p.checks);}
  return Object.freeze({plan,validate});
}
