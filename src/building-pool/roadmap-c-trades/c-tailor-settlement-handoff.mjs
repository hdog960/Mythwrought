// C7 immutable original Riverbend tailor interfaces for later settlement work.
// Read-only blueprint witness, not actual world placement, shop NPCs, or saves.
import {createHash} from 'node:crypto';
import {structuralFingerprint} from '../roadmap-2b/schema.mjs';
import {createCRiverbendTailor} from './wave2-riverbend-tailor.mjs';
const frozen=x=>Object.freeze(x),k=(x,y,z)=>[x,y,z].join(',');
export function createCRiverbendTailorHandoff(){
 const b=createCRiverbendTailor(),solids=new Set(b.voxels.map(v=>k(v.x,v.y,v.z)));
 const cols=b.voxels.filter(v=>v.kind==='foundation'),glass=b.voxels.filter(v=>v.kind==='window');
 if(b.id!=='r2:tailor:temperate:small:03'||cols.length!==652||glass.length!==24)
  throw Error('Roadmap C tailor physical source witness drift');
 let absent=0;
 for(let x=15;x<=17;x++)for(let z=18;z<=20;z++){
  if(Array.from({length:b.extents.y},(_,y)=>y).some(y=>solids.has(k(x,y,z))))
   throw Error('Fake dye court in C tailor handoff '+[x,z]);
  absent++;
 }
 const routes=b.openings.filter(o=>o.type==='entrance'||o.type==='internal-doorway')
  .map(o=>frozen({x:o.x,y:o.y,z:o.z,clearHeight:o.clearHeightCells,kind:o.type}));
 for(const gate of routes)
  for(let y=gate.y;y<gate.y+gate.clearHeight;y++)
   if(solids.has(k(gate.x,y,gate.z)))throw Error('Tailor doorway occupied in handoff');
 const digest=createHash('sha256').update(structuralFingerprint(b)).digest('hex');
 return frozen({
  schema:'mythwrought.roadmap-c.tailor-settlement-handoff.v1',id:b.id,
  sourceOnly:true,gameRegistered:false,settlementPlaced:false,villagerCommerceEnabled:false,
  sourceFingerprint:frozen({sha256:digest,authoredVoxels:b.voxels.length}),
  extents:frozen({...b.extents}),
  actualFoundationColumns:cols.length,realGlazedWindows:glass.length,
  dyeSunCourt:frozen({x0:15,x1:17,z0:18,z1:20,absentGroundColumns:absent}),
  streetSocket:frozen({...routes.find(r=>r.kind==='entrance'),width:2}),
  internalPassages:frozen(routes.filter(r=>r.kind==='internal-doorway')),
  program:frozen(b.rooms.map(r=>frozen({name:r.name,uses:frozen([...r.uses]),bounds:frozen({...r.bounds})}))),
  physicalFamilySymbols:frozen([...new Set(b.voxels.map(v=>v.material))].sort()),
  producerApproval:frozen({realWebGL2Images:false,variantRotation:false,
   packCollisionAABBs:false,creatorArt:false,iPhoneWalk:false}),
  unresolved:frozen(['Window/door physical ABI not independently certified',
   'No NPC tailors, market economy or inventory',
   'No village builder registration or old save changes'])
 });
}
