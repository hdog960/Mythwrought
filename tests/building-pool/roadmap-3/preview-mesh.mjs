// Isolated geometry QA visualization only. Cube ENVELOPES for unintegrated symbolic
// families, not fabricated implementations of their unknown physical shapes.
const FACE_DATA=Object.freeze([
  {offset:[1,0,0], shade:.84, vertices:[[1,0,1],[1,1,0],[1,0,0],[1,0,1],[1,1,1],[1,1,0]]}, // +x
  {offset:[-1,0,0],shade:.66, vertices:[[0,0,0],[0,1,1],[0,0,1],[0,0,0],[0,1,0],[0,1,1]]}, // -x
  {offset:[0,1,0], shade:1,vertices:[[0,1,0],[1,1,1],[0,1,1],[0,1,0],[1,1,0],[1,1,1]]}, // +y
  {offset:[0,-1,0],shade:.54,vertices:[[0,0,1],[1,0,0],[0,0,0],[0,0,1],[1,0,1],[1,0,0]]}, // -y
  {offset:[0,0,1], shade:.9, vertices:[[0,0,1],[0,1,1],[1,1,1],[0,0,1],[1,1,1],[1,0,1]]}, // +z
  {offset:[0,0,-1],shade:.73,vertices:[[1,0,0],[1,1,0],[0,1,0],[1,0,0],[0,1,0],[0,0,0]]} // -z
]);
const BASE=Object.freeze({foundation:[.32,.31,.36],floor:[.63,.55,.47],'forge-deck':[.64,.38,.32],'stock-deck':[.72,.63,.43],wall:[.73,.7,.64],roof:[.69,.32,.24],structure:[.47,.36,.26],rafter:[.51,.35,.23],fixture:[.85,.63,.30],'entry-frame':[.95,.76,.44],'window-trim':[.91,.77,.60],stair:[.7,.59,.42],'stair-support':[.47,.43,.39],battlement:[.76,.73,.70],'upper-support':[.46,.37,.26]});
const BIOMES=Object.freeze({'temperate':[1,1,1],desert:[1.12,.95,.74],snow:[.81,.92,1.15],'enchanted-forest':[.75,1.15,.91],mountain:[.79,.85,.94]});
const key=(x,y,z)=>`${x},${y},${z}`;
export function collectPreviewCells(blueprint,{cutaway=false}={}){
 if(!blueprint?.modules||!blueprint.envelope)throw new TypeError('real authored blueprint required');
 const {width,depth}=blueprint.envelope;
 let cells=[];
 for(const m of blueprint.modules)for(const c of m.cells){
  const [x,y,z]=c;
  // Remove the south facade for cutaways. Workshop roofs/rafters are removed
  // to examine furnished interior; tower upper decks remain to inspect stairs.
  if(cutaway && ((m.role==='wall'&&(z===depth-1||x===width-1))||
   // Removing the south wall but keeping the attached portal frame made
   // cutaway jambs and lintels float without their supporting facade.
   (m.role==='entry-frame'&&z===depth-1)||
   // A diagnostic east-wall removal must also hide its attached window surround.
   (m.role==='window-trim'&&x===width-1)||
   (blueprint.type==='blacksmith'&&['roof','rafter'].includes(m.role))||
   (blueprint.type==='watchtower'&&m.role==='roof'&&z>=Math.floor(depth/2))||
   (m.role==='battlement'&&(z===depth-1||x===width-1))))continue;
  cells.push({x,y,z,role:m.role});
 }
 // Hiding walls and roofs exposes orphaned chimney, parapet and overhead
 // ornament islands. Exclude those islands from a diagnostic cutaway instead
 // of depicting them as magically floating pieces. This NEVER changes the
 // underlying authored blueprint or its live/production placement rules.
 let removedUnsupportedCells=0;
 if(cutaway){
  const byKey=new Map(cells.map(c=>[key(c.x,c.y,c.z),c]));
  const connected=new Set(),queue=[];
  for(const c of cells)if(c.role==='foundation'){
   const k=key(c.x,c.y,c.z);
   if(!connected.has(k)){connected.add(k);queue.push(c);}
  }
  if(queue.length===0)throw new Error('cutaway has no foundation anchors');
  for(let i=0;i<queue.length;i++){
   const c=queue[i];
   for(const [dx,dy,dz] of [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]]){
    const k=key(c.x+dx,c.y+dy,c.z+dz),next=byKey.get(k);
    if(next&&!connected.has(k)){connected.add(k);queue.push(next);}
   }
  }
  removedUnsupportedCells=cells.length-connected.size;
  cells=cells.filter(c=>connected.has(key(c.x,c.y,c.z)));
 }
 return {cells,removedUnsupportedCells};
}
export function createPreviewMesh(blueprint,{cutaway=false}={}){
 const {cells,removedUnsupportedCells}=collectPreviewCells(blueprint,{cutaway});
 const occupied=new Set(cells.map(c=>key(c.x,c.y,c.z)));
 if(occupied.size!==cells.length)throw new Error('overlapping authored geometry in candidate');
 const floats=[],facesByRole={};let faceCount=0;
 const tint=BIOMES[blueprint.biome]||[1,1,1];
 for(const c of cells){
  const rgb=BASE[c.role]||[.65,.55,.55];
  for(const face of FACE_DATA){
   const [dx,dy,dz]=face.offset;
   if(occupied.has(key(c.x+dx,c.y+dy,c.z+dz)))continue;
   faceCount++;facesByRole[c.role]=(facesByRole[c.role]||0)+1;
   const color=rgb.map((v,i)=>Math.min(1,v*tint[i]*face.shade));
   // All six original templates are inward-wound; flip each triangle for CCW outward faces.
   for(let t=0;t<6;t+=3)for(const v of [face.vertices[t],face.vertices[t+2],face.vertices[t+1]])
    floats.push(c.x+v[0],c.y+v[1],c.z+v[2],...color);
  }
 }
 return {vertices:new Float32Array(floats),sourceCells:cells.length,faceCount,triangleCount:faceCount*2,facesByRole,
  isDiagnosticEnvelope:true,notAssetShapeProof:true,cutaway,removedUnsupportedCells};
}
