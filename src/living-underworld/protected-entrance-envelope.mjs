// Living Underworld P2: READ-ONLY protected-surface carve-envelope inspection.
// Reject unsupported terrain, original authored cave solids and player edits.
// These checks certify a proposed *cuttable envelope*, not completed stairs,
// player traversal, settlement placement, or a deployed M7 cave entrance.
const integer=Number.isSafeInteger;
const GEOLOGY=new Set([0,1,2,3,8,256,257,258,259,260,261,
  272,276,277,278,279,400,401,402,403,404,405]);
export function isCandidateGeologyMaterial(id){
 return integer(id)&&GEOLOGY.has(id);
}
export function auditProtectedEntranceEnvelope(proposal,{
 naturalAt,authoredAt=()=>undefined,editedAt=()=>false,
 protectedAt=()=>false,materialAllowed=isCandidateGeologyMaterial,
 legacyFloorY=-3,worldMaxY=19,maxChecks=30000
}={}){
 if(!proposal||proposal.ok!==true||!Array.isArray(proposal.segments)||
  typeof naturalAt!=='function'||typeof authoredAt!=='function'||
  typeof editedAt!=='function'||typeof protectedAt!=='function'||
  typeof materialAllowed!=='function'||!integer(legacyFloorY)||!integer(worldMaxY)||
  legacyFloorY>=worldMaxY||!integer(maxChecks)||maxChecks<1||maxChecks>100000)
  throw new TypeError('Invalid protected entrance envelope audit');
 let checks=0,sourceOwned=0,edits=0,protectedOriginal=0,unsafeMaterials=0;
 let index=0,hardFailure=null;
 const examples=[];
 const visited=new Set();
 for(const {a,b} of proposal.segments){
  const samples=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.y-a.y,b.z-a.z)));
  for(let i=0;i<=samples;i++){
   const t=i/samples;
   const px=Math.round(a.x+(b.x-a.x)*t),
    py=Math.round(a.y+(b.y-a.y)*t),
    pz=Math.round(a.z+(b.z-a.z)*t);
   if(py+3<legacyFloorY)continue;
   // A bounded 7x7 cross-section protects any existing surface source
   // the radius-3.8 candidate tunnel could cut or overwrite.
   for(let dz=-3;dz<=3;dz++)for(let dx=-3;dx<=3;dx++)
    for(let dy=-3;dy<=3;dy++){
     const x=px+dx,y=py+dy,z=pz+dz;
     if(y<legacyFloorY||y>worldMaxY||dx*dx+dy*dy+dz*dz>16)continue;
     const k=x+','+y+','+z;
     if(visited.has(k))continue;
     visited.add(k);
     if(++checks>maxChecks){
      hardFailure='CHECK_BUDGET_EXCEEDED';break;
     }
     const source=authoredAt(x,y,z);
     if(source!==undefined&&source!==0) {
      sourceOwned++;if(examples.length<8)examples.push({kind:'AUTHORED_SOURCE_CONFLICT',x,y,z});
     }else if(editedAt(x,y,z)){
      edits++;if(examples.length<8)examples.push({kind:'PLAYER_EDIT',x,y,z});
     }else if(protectedAt(x,y,z)){
      protectedOriginal++;if(examples.length<8)examples.push({kind:'ORIGINAL_LANDMARK',x,y,z});
     }else{
      const material=naturalAt(x,y,z);
      if(!materialAllowed(material,x,y,z)){
       unsafeMaterials++;if(examples.length<8)examples.push({kind:'UNSAFE_MATERIAL',x,y,z,material});
      }
     }
    }
   if(hardFailure)break;
  }
  if(hardFailure)break;
 }
 return Object.freeze({ok:!hardFailure&&sourceOwned===0&&edits===0&&
  protectedOriginal===0&&unsafeMaterials===0,
  checkedCells:checks,sourceOwned,edits,protectedOriginal,unsafeMaterials,
  reason:hardFailure??(sourceOwned||edits||protectedOriginal||unsafeMaterials?
   'UNSAFE_REAL_TERRAIN_ENVELOPE':null),
  examples:Object.freeze(examples),
  scope:'read-only candidate tunnel voxel envelope at legacy surface layer',
  authorizedToCarve:false,supportBlocksVerified:false,
  physicalPlayerTravelVerified:false,environmentM7Modified:false});
}
