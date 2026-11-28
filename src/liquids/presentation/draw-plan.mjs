// Water B: bounded read-only draw planning; no GPU allocation or renderer mount.
const ids=['water','lava','acid','amber-sap','liquid-resonance'];
const int=(n,a,b)=>Number.isSafeInteger(n)&&n>=a&&n<=b;
const vec=v=>Array.isArray(v)&&v.length===3&&v.every(Number.isFinite);
export function planLiquidDraws({batches,materials,camera,forward,maxBatches=128,maxFaces=8192}={}){
  if(!int(maxBatches,1,512)||!int(maxFaces,1,32768)||!Array.isArray(batches)||batches.length>maxBatches||!vec(camera)||!vec(forward)||!materials)throw RangeError('Invalid draw inputs or budget');
  const length=Math.hypot(...forward);
  if(!Number.isFinite(length)||length===0)throw RangeError('Invalid view direction');
  const dir=forward.map(n=>n/length),seen=new Set(),opaque=[],transparent=[];
  let count=0;
  for(const batch of batches){
    const {id,revision,mesh}=batch??{};
    if(typeof id!=='string'||!id.length||id.length>128||seen.has(id)||!int(revision,0,Number.MAX_SAFE_INTEGER)||mesh?.version!==1||!vec(mesh.origin)||!mesh.origin.every(Number.isSafeInteger)||!Array.isArray(mesh.groups)||mesh.groups.length>5||!int(mesh.faceCount,0,maxFaces-count))throw RangeError('Invalid draw batch');
    seen.add(id);let faces=0;const groupIds=new Set();
    for(const group of mesh.groups){
      const {id:liquid,positions,normals,indices}=group??{};
      const m=Object.hasOwn(materials,liquid)?materials[liquid]:null;
      if(!ids.includes(liquid)||groupIds.has(liquid)||!m||m.id!==liquid||!['opaque','transparent'].includes(m.pass)||m.depthTest!==true||m.depthWrite!==(m.pass==='opaque')||m.cull!==false||(m.pass==='transparent'&&m.blend!=='straight-alpha'))throw TypeError('Invalid liquid draw material');
      groupIds.add(liquid);
      if(!(positions instanceof Float32Array)||!(normals instanceof Float32Array)||!(indices instanceof Uint32Array)||positions.length!==normals.length||positions.length%12||indices.length!==positions.length/2)throw TypeError('Invalid quad buffers');
      const n=indices.length/6;faces+=n;
      if(faces>mesh.faceCount)throw RangeError('Draw face budget');
      for(let q=0;q<n;q++){
        const v=q*4,i=q*6;
        if([0,1,2,0,2,3].some((k,j)=>indices[i+j]!==v+k))throw TypeError('Invalid quad indices');
        let depth=0;
        for(let axis=0;axis<3;axis++){
          let center=0;for(let j=0;j<4;j++){const p=positions[(v+j)*3+axis];if(!Number.isFinite(p)||Math.abs(p)>4097)throw RangeError('Invalid local vertex');center+=p/4;}
          depth+=((mesh.origin[axis]-camera[axis])+center)*dir[axis];
        }
        if(!Number.isFinite(depth))throw RangeError('Invalid projected depth');
        const cmd=Object.freeze({batchId:id,revision,liquid,firstIndex:i,indexCount:6,depth});
        (m.pass==='opaque'?opaque:transparent).push(cmd);
      }
    }
    if(faces!==mesh.faceCount)throw RangeError('Inconsistent face count');count+=faces;
  }
  const tie=(a,b)=>a.batchId<b.batchId?-1:a.batchId>b.batchId?1:ids.indexOf(a.liquid)-ids.indexOf(b.liquid)||a.firstIndex-b.firstIndex;
  opaque.sort((a,b)=>a.depth-b.depth||tie(a,b));transparent.sort((a,b)=>b.depth-a.depth||tie(a,b));
  // Coalesce contiguous index runs without disturbing the sorted sequence.
  const pack=commands=>{const out=[];for(const c of commands){const p=out.at(-1);if(p&&p.batchId===c.batchId&&p.revision===c.revision&&p.liquid===c.liquid&&p.firstIndex+p.indexCount===c.firstIndex) p.indexCount+=6;else {const {depth,...range}=c;out.push(range);}}return Object.freeze(out.map(Object.freeze));};
  return Object.freeze({faces:count,opaque:pack(opaque),transparent:pack(transparent)});
}
