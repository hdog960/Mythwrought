// Detached S14 sparse physical forest lookup. Consumes ONLY a certified S13
// manifest, never modifies the original world. Per-voxel string creation is
// avoided; the original get path remains authoritative outside staged cells.
export function createSnowS14IndexedForest(world,certificate){
 const {manifest,overlay:reference}=certificate??{};
 if(!manifest||!reference||manifest.seed!==world.seed||
   manifest.profile!==world.generationProfile?.generator||
   !Object.isFrozen(manifest)||!Object.isFrozen(manifest.cells)||
   manifest.cells.length<1||manifest.cells.length>1536)
  throw Error('Exact frozen S13 certificate required');
 let x0=Infinity,z0=Infinity,x1=-Infinity,z1=-Infinity;
 for(const [x,y,z,id] of manifest.cells){
  if(![x,y,z,id].every(Number.isSafeInteger)||y<1||y>19||
   ![4,406,407].includes(id))throw Error('Invalid certified forest cell');
  x0=Math.min(x0,x);x1=Math.max(x1,x);z0=Math.min(z0,z);z1=Math.max(z1,z);
 }
 const width=x1-x0+1,depth=z1-z0+1;
 if(width>80||depth>80)throw Error('S14 bounded forest window exceeded');
 // Y=0 is unused. 0 means no overlay; existing original voxels are never
 // overwritten. Private typed array cannot be changed by callers.
 const grid=new Uint16Array(width*depth*20);
 const index=(x,y,z)=>((x-x0)*depth+z-z0)*20+y;
 for(const [x,y,z,id] of manifest.cells){
  const i=index(x,y,z),k=x+','+y+','+z;
  if(grid[i]||reference.get(x,y,z)!==id||world.get(x,y,z)!==0||
    world.edits.has(k)||world.environmentCaves.get(x,y,z)!==undefined)
   throw Error('Original certificate changed before index construction');
  grid[i]=id;
 }
 const get=(x,y,z)=>{
  if(x>=x0&&x<=x1&&z>=z0&&z<=z1&&y>=1&&y<=19&&
     Number.isInteger(x)&&Number.isInteger(y)&&Number.isInteger(z)){
   const id=grid[index(x,y,z)];
   if(id){
    // The manifest is a snapshot, not authority to overwrite a later edit
    // or newly protected cave. Recheck source only on occupied overlay cells.
    const k=x+','+y+','+z;
    if(!world.edits.has(k)&&world.environmentCaves.get(x,y,z)===undefined&&
       world.get(x,y,z)===0)return id;
   }
  }
  return world.get(x,y,z);
 };
 const overlay=Object.create(world);
 Object.defineProperties(overlay,{get:{value:get},save:{value:()=>world.save()},
  set:{value:()=>{throw Error('Detached indexed forest is read-only')}}});
 return Object.freeze({overlay,allocatedBytes:grid.byteLength,
  cells:manifest.cells.length,bounds:Object.freeze([x0,z0,x1,z1])});
}
