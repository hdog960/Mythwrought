// Pack 1 only. Source-exact GPU preview bridge; never registers candidate IDs in VoxelWorld.
// Exposed face meshing uses the actual authored AABB unions and original per-role textures.
import {CORE_MASONRY,masonryTexture} from './core-masonry.mjs';
import {STONE_SHAPES,stoneShapeDescriptor,stoneShapeTexture} from './stone-shapes.mjs';
import {GARDEN_COMPONENTS,gardenDescriptor,gardenTexture} from './garden-components.mjs';
import {FOLIAGE_ASSETS,foliageDescriptor,foliageTexture} from './physical-foliage.mjs';
import {FLORAL_CANDIDATES,floralDescriptor,floralTexture} from './floral-forms.mjs';

export const PACK1_GPU_IDS=Object.freeze([
  ...CORE_MASONRY,...STONE_SHAPES,...GARDEN_COMPONENTS,
  ...FOLIAGE_ASSETS,...FLORAL_CANDIDATES
].map(x=>x.id));
export const PACK1_GPU_FACES=Object.freeze(['west','east','bottom','top','north','south']);

export function candidateParts(id,rotation=0){
  if(!Number.isInteger(id)||id<9||id>38)throw new RangeError('Pack 1 candidate ID must be 9..38');
  if(!Number.isInteger(rotation)||rotation<0||rotation>3)
    throw new RangeError('Rotation must be integer 0..3');
  let descriptor;
  if(id<=14){
    descriptor=CORE_MASONRY.find(x=>x.id===id).shape;
  }else if(id<=20)descriptor=stoneShapeDescriptor(id,{rotation});
  else if(id<=23)descriptor=gardenDescriptor(id,{rotation});
  else if(id<=31)descriptor=foliageDescriptor(id,{rotation});
  else descriptor=floralDescriptor(id,{rotation});
  const parts=(descriptor.parts||descriptor.boxes.map(box=>({role:'stone',box})))
    .map(({role,box})=>({role,box:[...box]}));
  if(!parts.length)throw new Error('Candidate has no physical geometry');
  for(const {box} of parts){
    if(box.length!==6||box.some(x=>!Number.isFinite(x))||
       box.some((v,i)=>v<0||v>1)||
       box.some((v,i)=>i<3&&v>=box[i+3]))
      throw new Error('Invalid real candidate AABB '+id);
  }
  return {id,rotation,parts};
}

export function candidateFaceTexture(id,role,face,size=24){
  if(!PACK1_GPU_FACES.includes(face))throw new RangeError('Unknown face');
  if(id<=14)return masonryTexture(id,face,size);
  if(id<=20)return stoneShapeTexture(id,face,size);
  if(id<=23)return gardenTexture(id,face,size,role);
  if(id<=31)return foliageTexture(id,face,size,role);
  return floralTexture(id,role,face,size);
}

const AXES=[
  {axis:0,u:2,v:1,cross:-1,negative:'west',positive:'east'},
  {axis:1,u:0,v:2,cross:-1,negative:'bottom',positive:'top'},
  {axis:2,u:0,v:1,cross:1,negative:'north',positive:'south'}
];
// A geometry/role-bearing quad from a true exposed boundary of the source's AABB union.
// Interior coplanar faces, overlapping parts and filled neighbors are deliberately culled.
// The local unit cell is subdivided at all ACTUAL authored physical box boundaries.
export function candidateSurface(id,rotation=0){
  const {parts}=candidateParts(id,rotation);
  const coords=[0,1,2].map(a=>[...new Set([0,1,...parts.flatMap(p=>[p.box[a],p.box[a+3]])])]
    .sort((a,b)=>a-b));
  const dims=coords.map(a=>a.length-1),volume=dims[0]*dims[1]*dims[2];
  if(volume>200000)throw new Error('Unbounded Pack 1 geometry partition');
  const owners=new Uint16Array(volume);
  const cell=(x,y,z)=>((x*dims[1])+y)*dims[2]+z;
  let occupied=0;
  for(let x=0;x<dims[0];x++)for(let y=0;y<dims[1];y++)for(let z=0;z<dims[2];z++){
    const mid=[(coords[0][x]+coords[0][x+1])/2,
      (coords[1][y]+coords[1][y+1])/2,(coords[2][z]+coords[2][z+1])/2];
    let owner=0;
    for(let i=0;i<parts.length;i++){
      const b=parts[i].box;
      if(mid.every((p,a)=>p>=b[a]&&p<b[a+3]))owner=i+1;
    }
    owners[cell(x,y,z)]=owner;
    if(owner)occupied++;
  }
  if(!occupied)throw new Error('Candidate has no occupied geometry '+id);
  const at=(idx)=>{
    if(idx.some((v,a)=>v<0||v>=dims[a]))return 0;
    return owners[cell(idx[0],idx[1],idx[2])];
  };
  const quads=[];
  for(const cfg of AXES){
    const {axis,u,v,cross,negative,positive}=cfg;
    const nu=dims[u],nv=dims[v];
    for(let plane=0;plane<=dims[axis];plane++){
      const mask=new Array(nu*nv).fill(null);
      for(let a=0;a<nu;a++)for(let b=0;b<nv;b++){
        const left=[0,0,0],right=[0,0,0];
        left[axis]=plane-1;right[axis]=plane;
        left[u]=right[u]=a;left[v]=right[v]=b;
        const oLeft=at(left),oRight=at(right);
        if(Boolean(oLeft)===Boolean(oRight))continue;
        const owner=oLeft||oRight,sign=oLeft?1:-1;
        mask[a*nv+b]={owner,sign};
      }
      const equal=(a,b)=>a&&b&&a.owner===b.owner&&a.sign===b.sign;
      for(let a=0;a<nu;a++)for(let b=0;b<nv;b++){
        const key=mask[a*nv+b];if(!key)continue;
        let width=1,height=1;
        while(a+width<nu&&equal(key,mask[(a+width)*nv+b]))width++;
        grow:while(b+height<nv){
          for(let d=0;d<width;d++)if(!equal(key,mask[(a+d)*nv+b+height]))break grow;
          height++;
        }
        for(let d=0;d<width;d++)for(let e=0;e<height;e++)
          mask[(a+d)*nv+b+e]=null;
        const vertex=(uu,vv)=>{
          const p=[0,0,0];p[axis]=coords[axis][plane];p[u]=uu;p[v]=vv;return p;
        };
        const loU=coords[u][a],hiU=coords[u][a+width];
        const loV=coords[v][b],hiV=coords[v][b+height];
        const p=[vertex(loU,loV),vertex(hiU,loV),
          vertex(hiU,hiV),vertex(loU,hiV)];
        const order=cross===key.sign?[0,1,2,0,2,3]:[0,2,1,0,3,2];
        const texUV=[[loU,loV],[hiU,loV],[hiU,hiV],[loU,hiV]];
        const face=key.sign<0?negative:positive,role=parts[key.owner-1].role;
        quads.push({face,role,normal:[0,1,2].map(i=>i===axis?key.sign:0),
          positions:order.map(i=>p[i]),uv:order.map(i=>texUV[i])});
      }
    }
  }
  if(!quads.length)throw new Error('Candidate has no exposed surface '+id);
  return {id,rotation,partsCount:parts.length,occupiedCells:occupied,
    triangles:quads.length*2,quads};
}
