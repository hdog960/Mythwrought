// FD0/FD1 read-only observations, not a reservation or save authority.
const MAX_EDITS=300000, MAX_READS=1024, MARGIN=4;
const isCell=(p)=>Array.isArray(p)&&p.length===3&&p.every(Number.isSafeInteger);
function contains(b,x,y,z,pad=0){return x>=b.minX-pad&&x<=b.maxX+pad&&y>=b.minY-pad&&y<=b.maxY+pad&&z>=b.minZ-pad&&z<=b.maxZ+pad;}

export function scanEdits(bounds,edits){
 if(!(edits instanceof Map)||edits.size>MAX_EDITS)return {status:"hold",reason:"unknown-edit-inventory",scanned:0};
 let scanned=0;
 for(const [key,id] of edits){
  scanned++;
  if(typeof key!=="string"||!Number.isSafeInteger(id)||id<0||id>65534)return {status:"hold",reason:"invalid-edit",scanned};
  const p=key.split(",").map(Number);
  if(!isCell(p)||p.join(",")!==key||p[1]<-210||p[1]>256)return {status:"hold",reason:"invalid-edit",scanned};
  if(contains(bounds,...p,MARGIN))return {status:"reject",reason:"existing-player-edit",cell:p,scanned};
 }
 return {status:"observed-clear",scanned};
}

export function surveyVolume(candidate,world,{profile,revision,newWorldEligible,sockets=[]}={}){
 const out={status:"hold",reason:"incomplete-authority",reads:0,solid:0,air:0,other:0,sockets:[],editsScanned:0};
 if(!candidate||!world||world.seed!==candidate.seed||typeof profile!=="string"||!profile||world.generationProfile?.generator!==profile||typeof revision!=="function"||typeof world.naturalAndLandmarkBlock!=="function")return {...out,reason:"source-identity"};
 if(newWorldEligible!==true)return {...out,reason:"historical-or-unknown-world"};
 const bounds=candidate.bounds;
 if(!bounds||!Object.values(bounds).every(Number.isSafeInteger)||bounds.minY<-210||bounds.maxY>-4||bounds.maxY<bounds.minY||bounds.maxX<bounds.minX||bounds.maxZ<bounds.minZ||bounds.maxX-bounds.minX>255||bounds.maxZ-bounds.minZ>255||bounds.maxY-bounds.minY>83)return {...out,reason:"invalid-bounds"};
 const begin=revision();if(typeof begin!=="string"||!begin)return {...out,reason:"unknown-revision"};
 const edits=scanEdits(bounds,world.edits);out.editsScanned=edits.scanned;
 if(edits.status!=="observed-clear")return {...out,status:edits.status,reason:edits.reason,cell:edits.cell};
 if(!Array.isArray(sockets)||sockets.length>16)return {...out,reason:"socket-budget"};
 function read(x,y,z){
  if(out.reads>=MAX_READS||![x,y,z].every(Number.isSafeInteger)||y<-210||y>256)throw Error("read-budget-or-bounds");
  out.reads++;
  const id=world.naturalAndLandmarkBlock(x,y,z);
  if(!Number.isSafeInteger(id)||id<0||id>65534)throw Error("unknown-cell");
  return id;
 }
 function axis(lo,hi){const a=[];for(let p=lo;p<=hi;p+=32)a.push(p);if(a.at(-1)!==hi)a.push(hi);return a;}
 try{
  for(const x of axis(bounds.minX,bounds.maxX))for(const z of axis(bounds.minZ,bounds.maxZ))for(const y of [bounds.minY,Math.floor((bounds.minY+bounds.maxY)/2),bounds.maxY]){
   const id=read(x,y,z);if(id===0)out.air++;else if(id===3||id===8)out.solid++;else out.other++;
  }
  const seen=new Set();
  for(const socket of sockets){
   const p=socket?.cell,face=socket?.face,dirs={west:[-1,0],east:[1,0],north:[0,-1],south:[0,1]};
   if(!isCell(p)||!Object.hasOwn(dirs,face))throw Error("invalid-socket");
   const [x,y,z]=p,[dx,dz]=dirs[face],k=p.join(",");
   if(seen.has(k)||!contains(bounds,x,y,z)||y<=bounds.minY||y>=bounds.maxY|| (dx!==0?(x!==(dx<0?bounds.minX:bounds.maxX)||z<=bounds.minZ||z>=bounds.maxZ):(z!==(dz<0?bounds.minZ:bounds.maxZ)||x<=bounds.minX||x>=bounds.maxX)))throw Error("invalid-socket");
   seen.add(k);
   let clear=true;
   for(let i=1;i<=3;i++){
    const xx=x+dx*i,zz=z+dz*i;
    const ids=[read(xx,y-1,zz),read(xx,y,zz),read(xx,y+1,zz)];
    if(![3,8].includes(ids[0])||ids[1]!==0||ids[2]!==0)clear=false;
   }
   const aperture=[read(x,y,z),read(x,y+1,z)];
   out.sockets.push({cell:[...p],face,localApproachClear:clear,solidAperture:aperture.every(id=>id===3||id===8)});
  }
 }catch(e){return {...out,reason:"source-observation-incomplete",detail:String(e)};}
 if(revision()!==begin||world.generationProfile?.generator!==profile||world.seed!==candidate.seed)return {...out,reason:"stale-source"};
 return {...out,revision:begin,profile,reason:"samples-only-no-reservation-authority"};
}
