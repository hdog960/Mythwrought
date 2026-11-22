// Isolated source-faithful AABB preview adapters. These MUST NOT be used for
// live placement, gameplay collision, save serialization, or numeric ID allocation.
// External unmerged candidate source reference blobs (read-only):
// Pack 1 stone-shapes.mjs: f5feaaf2e4e18892b5bc3b5466d2808ebeee63e3
// Pack 3 roofing-materials.mjs: a19d5103bd19c58d311288147f8f27536194df55
// Pack 4 windows.mjs: e7d203147015fc3a14e89ae4da33a37f45e4717e
// Namespaced symbolic roster keys are NOT equivalent to live numeric block IDs.
const FULL=[0,0,0,1,1,1];
const SHINGLE_BASE=[0,0,0,1,.125,1];
const lowerStair=[[0,0,0,1,.5,1],[0,.5,.5,1,1,1]];
const rotateBox=(box,turn)=>{
  let [x,y,z,X,Y,Z]=box;
  for(let n=0;n<turn;n++) [x,z,X,Z]=[1-Z,x,1-z,X];
  return [x,y,z,X,Y,Z];
};
const facingTurn={north:0,west:1,south:2,east:3};
function roofPieces(ref){
  const pieces=[SHINGLE_BASE];
  if(ref==='pack3:023')for(let row=0;row<2;row++)for(let col=0;col<4;col++){
    const x=col*.25+.015625;
    pieces.push([x,.125,row*.5+.015625,x+.21875,row===0?.21875:.25,row*.5+.484375]);
  }
  if(ref==='pack3:024')for(let col=0;col<6;col++){
    const x=col/6+.020833;
    pieces.push([x,.125,.03125,x+.125,.28125,.96875]);
  }
  if(ref==='pack3:025')for(let row=0;row<2;row++)for(let col=0;col<3;col++){
    const x=col/3+.015625;
    pieces.push([x,.125,row*.5+.015625,x+.296875,.1875+row*.03125,row*.5+.484375]);
  }
  if(ref==='pack3:026')for(let col=0;col<9;col++){
    const x=col/9+.012;
    pieces.push([x,.125,.015625,(col+1)/9-.012,.21875+(col%3)*.03125,.984375]);
  }
  return pieces;
}
const clearGlass=[
  [.045,.045,.479,.955,.955,.521],
  [.045,.045,.477,.072,.955,.523],
  [.928,.045,.477,.955,.955,.523],
  [.072,.928,.477,.928,.955,.523],
  [.072,.045,.477,.928,.072,.523]
];
export function candidatePreviewShape(cell){
  const ref=cell.asset;
  if(ref==='pack1:007')return {boxes:[[0,0,0,1,.5,1]],fidelity:'source-boxes',orientationStateNeeded:false};
  if(ref==='pack1:008')return {boxes:lowerStair.map(box=>rotateBox(box,facingTurn[cell.facing])),
    fidelity:'source-boxes',orientationStateNeeded:cell.facing!=='north'};
  if(['pack3:023','pack3:024','pack3:025','pack3:026'].includes(ref))
    return {boxes:roofPieces(ref),fidelity:'source-boxes',orientationStateNeeded:cell.facing!=='north'};
  if(ref==='pack4:030')return {boxes:clearGlass.map(box=>rotateBox(box,facingTurn[cell.facing])),
    fidelity:'source-boxes',orientationStateNeeded:cell.facing!=='north'};
  return {boxes:[FULL],fidelity:ref.startsWith('base:')||ref==='pack1:002'?'full-cell':'unresolved-full-cell-proxy',
    orientationStateNeeded:false};
}
export function candidatePreviewShapeCensus(blueprint){
  const counts={'source-boxes':0,'full-cell':0,'unresolved-full-cell-proxy':0};
  let boxes=0,noncanonical=0;
  for(const cell of blueprint.cells){const shape=candidatePreviewShape(cell);
    counts[shape.fidelity]++;
    boxes+=shape.boxes.length;
    if(shape.orientationStateNeeded)noncanonical++;
  }
  return Object.freeze({cells:blueprint.cells.length,boxes,counts,orientationSaveBlockedCells:noncanonical,
    liveCollisionCertified:false,actualWebGL2PerfMeasured:false});
}
// Conservative *upper bound* for a naive box-union WebGL2 fallback. It may
// include hidden intra-shape faces; never label it measured GPU memory/FPS.
// Full-cell mutual neighbors are culled, but all source partial-box faces are
// counted to expose why an unbatched mesh is not adequate on iPhone.
export function candidatePreviewUpperBound(blueprint){
  const coords=new Map(blueprint.cells.map(c=>[c.at.join(','),c]));
  const dirs=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
  const fullBox=box=>box.length===6&&box[0]===0&&box[1]===0&&box[2]===0&&box[3]===1&&box[4]===1&&box[5]===1;
  let quads=0,boxes=0;
  for(const c of blueprint.cells){
    const shape=candidatePreviewShape(c);boxes+=shape.boxes.length;
    for(const box of shape.boxes){
      for(const [dx,dy,dz] of dirs){
        const neighbor=coords.get([c.at[0]+dx,c.at[1]+dy,c.at[2]+dz].join(','));
        if(fullBox(box)&&neighbor){
          const shape2=candidatePreviewShape(neighbor);
          if(shape2.boxes.length===1&&fullBox(shape2.boxes[0]))continue;
        }
        quads++;
      }
    }
  }
  return Object.freeze({cells:blueprint.cells.length,primitiveBoxes:boxes,unindexedQuadUpperBound:quads,
    unindexedTriangleUpperBound:quads*2,unindexedPositionColorBufferUpperBoundBytes:quads*144,
    // Deterministic storage estimate. GPU allocation and raster times remain unknown.
    previewOnly:true,actualGPUByteAllocation:null,actualWebGL2FrameTimeMs:null});
}
// Design-stage batched preview budget, NOT an existing GPU implementation.
// A one-off unit-box template per symbolic asset/orientation plus 16-byte
// placement instances avoids reuploading nine roofing boxes for every cell.
export function candidateBatchedPreviewBudget(blueprint){
  const full=box=>box[0]===0&&box[1]===0&&box[2]===0&&box[3]===1&&box[4]===1&&box[5]===1;
  const positions=new Map(blueprint.cells.map(c=>[c.at.join(','),c]));
  const dirs=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
  const templates=new Map();let fullFaces=0,partialInstances=0;
  for(const c of blueprint.cells){
    const shape=candidatePreviewShape(c);
    const singleFull=shape.boxes.length===1&&full(shape.boxes[0]);
    if(!singleFull){
      const id=c.asset+':'+c.facing;
      if(!templates.has(id))templates.set(id,shape.boxes.length);
      partialInstances++;
      continue;
    }
    for(const [dx,dy,dz] of dirs){
      const neighbor=positions.get([c.at[0]+dx,c.at[1]+dy,c.at[2]+dz].join(','));
      if(neighbor){const ns=candidatePreviewShape(neighbor);
        if(ns.boxes.length===1&&full(ns.boxes[0]))continue;
      }
      fullFaces++;
    }
  }
  // Unit-cell face mesh: 6 vertices of xyz+rgb floats per quad = 144 bytes.
  // Template faces: 6 faces per candidate AABB, one shared mesh per orientation.
  const fullCellBytes=fullFaces*144;
  const templatesBytes=[...templates.values()].reduce((n,boxes)=>n+boxes*6*144,0);
  const instanceBytes=partialInstances*16;
  return Object.freeze({fullCellFaces:fullFaces,partialInstances,sharedShapeTemplates:templates.size,
    estimatedUploadBytes:fullCellBytes+templatesBytes+instanceBytes,
    templateBytes:templatesBytes,instanceBytes,fullCellBytes,
    implementationStatus:'budget-model-only',gpuMemoryMeasured:false,frameTimeMeasuredMs:null});
}
