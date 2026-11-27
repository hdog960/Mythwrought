// SP2 research: prove physical connected ranges without changing source identities,
// protected admission, heights, saves or the renderer's ownership budget.
import {ShatteredPeaksTerraceWorld} from './shattered-peaks-terrace.mjs';
import {mountainV8Material} from './mountain-v8-materials.mjs';
const levels=Object.freeze([140,180,200,220,240]);
export function inspectPhysicalMountainRange(world,{x,z,radius=24}={}){
 if(!(world instanceof ShatteredPeaksTerraceWorld)||![x,z,radius].every(Number.isSafeInteger)||
  radius<1||radius>24||Math.abs(x)>2147482900||Math.abs(z)>2147482900||world.edits.size)
  throw Error('Expected pristine bounded SP2 physical range');
 const width=2*radius+1,ox=x-radius,oz=z-radius,heights=new Uint16Array(width*width);
 let admitted=0,vetoed=0,peak=null,physicalCells=0,protectedChecks=0;
 const groundViews=[];
 for(let j=0;j<width;j++)for(let i=0;i<width;i++){
  const wx=ox+i,wz=oz+j,p=world.terraceColumn(wx,wz);
  if(!p){
   vetoed++;
   // A vetoed column must have no research upper terrain; compare the
   // original lower envelope as well, not only the proposed height.
   for(let y=3;y<=19;y++){
    if(world.get(wx,y,wz)!==world.originalNatural(wx,y,wz))throw Error('Protected lower cell changed');
    protectedChecks++;
   }
   if(world.get(wx,20,wz)!==0)throw Error('Protected upper cell filled');
   protectedChecks++;continue;
  }
  admitted++;
  if(world.get(wx,p.cap,wz)!==world.originalNatural(wx,p.cap,wz))throw Error('Original cap changed');
  if(world.get(wx,p.topY+1,wz)!==0)throw Error('Physical summit not exposed');
  // Establish a continuous real block interval down to the existing cap.
  // Never count a proposal as range terrain without this proof.
  for(let y=p.cap+1;y<=p.topY;y++){
   if(!mountainV8Material(world.get(wx,y,wz))?.terrain)throw Error('Unsupported physical range column');
   physicalCells++;
  }
  heights[j*width+i]=p.topY;
  if(!peak||p.topY>peak.y)peak={x:wx,y:p.topY,z:wz,clearance:p.clearance};
  if(p.topY<80)groundViews.push({x:wx,y:p.topY,z:wz});
 }
 const components=levels.map(level=>{
  const seen=new Uint8Array(heights.length),groups=[];
  for(let k=0;k<heights.length;k++){
   if(seen[k]||heights[k]<level)continue;
   const q=[k];seen[k]=1;
   let minX=width,maxX=0,minZ=width,maxZ=0,maxY=0,touchesBoundary=false;
   for(let n=0;n<q.length;n++){
    const p=q[n],i=p%width,j=Math.floor(p/width);
    minX=Math.min(i,minX);maxX=Math.max(i,maxX);minZ=Math.min(j,minZ);maxZ=Math.max(j,maxZ);
    maxY=Math.max(maxY,heights[p]);
    touchesBoundary||=i===0||j===0||i===width-1||j===width-1;
    for(const [dx,dz] of [[-1,0],[1,0],[0,-1],[0,1]]){
     const xx=i+dx,zz=j+dz;if(xx<0||zz<0||xx>=width||zz>=width)continue;
     const v=zz*width+xx;if(!seen[v]&&heights[v]>=level){seen[v]=1;q.push(v);}
    }
   }
   groups.push({cells:q.length,extent:[maxX-minX+1,maxZ-minZ+1],maxY,
    bounds:[ox+minX,oz+minZ,ox+maxX,oz+maxZ],touchesBoundary});
  }
  groups.sort((a,b)=>b.cells-a.cells||b.maxY-a.maxY);
  return {level,total:groups.reduce((n,g)=>n+g.cells,0),count:groups.length,largest:groups[0]??null};
 });
 // A view candidate is evidence only; no special world seeds or generation.
 const approach=peak?groundViews.filter(p=>Math.hypot(p.x-peak.x,p.z-peak.z)>=12)
  .sort((a,b)=>Math.abs(Math.hypot(a.x-peak.x,a.z-peak.z)-20)-Math.abs(Math.hypot(b.x-peak.x,b.z-peak.z)-20)||a.y-b.y)[0]??null:null;
 return {seed:world.seed,center:[x,z],width,admitted,vetoed,peak,physicalCells,protectedChecks,components,approach};
}
