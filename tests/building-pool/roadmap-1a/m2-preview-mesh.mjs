// Authored integer voxel CELL ENVELOPES for diagnostics. Not real Pack1–5 physical meshes.
// The true source metadata is in blueprint.placements and the independent 1A physical audit.
const faces=Object.freeze([
 {o:[1,0,0],k:.83,v:[[1,0,1],[1,1,0],[1,0,0],[1,0,1],[1,1,1],[1,1,0]]},
 {o:[-1,0,0],k:.65,v:[[0,0,0],[0,1,1],[0,0,1],[0,0,0],[0,1,0],[0,1,1]]},
 {o:[0,1,0],k:1,v:[[0,1,0],[1,1,1],[0,1,1],[0,1,0],[1,1,0],[1,1,1]]},
 {o:[0,-1,0],k:.54,v:[[0,0,1],[1,0,0],[0,0,0],[0,0,1],[1,0,1],[1,0,0]]},
 {o:[0,0,1],k:.91,v:[[0,0,1],[0,1,1],[1,1,1],[0,0,1],[1,1,1],[1,0,1]]},
 {o:[0,0,-1],k:.73,v:[[1,0,0],[1,1,0],[0,1,0],[1,0,0],[0,1,0],[0,0,0]]}
]);
const roleColor={foundation:[.35,.39,.43],wall:[.74,.70,.61],partition:[.56,.40,.29],
 support:[.51,.42,.31],roof:[.65,.33,.26],door:[.30,.57,.69],window:[.47,.82,.89],
 furnishing:[.88,.66,.32],decoration:[.71,.53,.29],floor:[.65,.55,.40],
 'terrain-interface':[.53,.56,.46],stair:[.83,.75,.61],lighting:[.98,.85,.48]};
const tint={'temperate':[1,1,1],desert:[1.12,.98,.77],snow:[.88,.94,1.12],
 'enchanted-forest':[.79,1.12,.91],mountain:[.84,.88,.99]};
const key=(x,y,z)=>[x,y,z].join(',');
export function getM2DiagnosticCells(b,{cutaway=false}={}){
 if(!b?.placements?.length||!b.footprint)throw Error('authored source building required');
 const w=b.footprint.width,d=b.footprint.depth;
 const p=b.placements.filter(c=>!cutaway || !(
  c.role==='roof'||
  (c.role==='support'&&c.at[1]>=4)||
  ((c.role==='wall'||c.role==='window'||c.role==='door')&&(c.at[2]===1||c.at[0]===w-2))
 ));
 const positions=new Set(p.map(c=>key(...c.at)));
 if(positions.size!==p.length)throw Error('overlapping original authored cells');
 return p;
}
export function makeM2DiagnosticMesh(b,{cutaway=false}={}){
 const cells=getM2DiagnosticCells(b,{cutaway}),present=new Set(cells.map(c=>key(...c.at)));
 const rgb=tint[b.biome]??[1,1,1],floats=[];
 let faceCount=0;
 for(const c of cells){
  const [x,y,z]=c.at,base=roleColor[c.role]??[.65,.55,.53];
  for(const f of faces){
   if(present.has(key(x+f.o[0],y+f.o[1],z+f.o[2])))continue;
   faceCount++;
   const color=base.map((v,j)=>Math.min(1,v*f.k*rgb[j]));
   for(let t=0;t<6;t+=3)for(const v of [f.v[t],f.v[t+2],f.v[t+1]])
    floats.push(x+v[0],y+v[1],z+v[2],...color);
  }
 }
 return Object.freeze({
  vertices:new Float32Array(floats),sourceCells:b.placements.length,displayedCells:cells.length,
  faceCount,triangles:faceCount*2,cutaway,
  renderer:'CHROMIUM_WEBGL2_AUTHORED_CELL_CUBE_DIAGNOSTIC',
  physicalFamilyMeshesRendered:false,liveGameWorld:false,creatorApproved:false
 });
}
