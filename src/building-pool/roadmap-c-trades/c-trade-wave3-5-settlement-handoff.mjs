// C7 original C-only source data for future village/town/city handoff.
// No game registry, no citizens, no shop economics or schema/save mutation.
import {createHash} from 'node:crypto';
import {structuralFingerprint} from '../roadmap-2b/schema.mjs';
import {createCCopperfordButcher} from './wave3-copperford-butcher.mjs';
import {createCSilverfinchJeweler} from './wave4-silverfinch-jeweler.mjs';
import {createCWrenfieldBookshop} from './wave5-wrenfield-bookshop.mjs';
const f=x=>Object.freeze(x),K=(x,y,z)=>[x,y,z].join(',');
const sources=[createCCopperfordButcher,createCSilverfinchJeweler,createCWrenfieldBookshop];
export function createCTradeWaves3to5Handoffs(){
 return f(sources.map(build=>{
  const b=build(),solid=new Set(b.voxels.map(c=>K(c.x,c.y,c.z)));
  const foundations=b.voxels.filter(c=>c.kind==='foundation'),
        windows=b.voxels.filter(c=>c.kind==='window');
  const entrances=b.openings.filter(o=>o.type==='entrance'||o.type==='internal-doorway');
  const sourceCourt=b.drainageCourt||b.daylightShaft||b.openStoryCourt;
  if(!sourceCourt||foundations.length<600||windows.length<16)
   throw Error('Missing real architecture data at C7 trade handoff '+b.id);
  let absent=0;
  for(let x=sourceCourt.x0;x<=sourceCourt.x1;x++)for(let z=sourceCourt.z0;z<=sourceCourt.z1;z++){
   for(let y=0;y<b.extents.y;y++)if(solid.has(K(x,y,z)))
    throw Error('C7 source courtyard false empty metadata '+K(x,y,z));
   absent++;
  }
  for(const e of entrances)for(let y=e.y;y<e.y+3;y++)
   if(solid.has(K(e.x,y,e.z)))throw Error('C7 source door cannot pass '+K(e.x,y,e.z));
  const fp=foundations.map(p=>[p.x,p.z]),
    minX=Math.min(...fp.map(p=>p[0])),maxX=Math.max(...fp.map(p=>p[0])),
    minZ=Math.min(...fp.map(p=>p[1])),maxZ=Math.max(...fp.map(p=>p[1]));
  return f({
   schema:'mythwrought.roadmap-c.trade-wave3-5-handoff.v1',
   id:b.id,category:b.category,biome:b.biome,size:b.size,
   sourceOnly:true,productionApproved:false,worldRegistered:false,
   settlementPlaced:false,merchantAIEnabled:false,
   sourceWitness:f({sha256:createHash('sha256').update(structuralFingerprint(b)).digest('hex'),
    occupiedXYZVoxels:b.voxels.length}),
   envelope:f({...b.extents}),
   actualFoundation:f({x:minX,z:minZ,width:maxX-minX+1,depth:maxZ-minZ+1,occupiedColumns:foundations.length}),
   physicalWindows:windows.length,
   trueSourceCourtyard:f({...sourceCourt,sourceAbsentColumns:absent}),
   roadAndRoomEntrances:f(entrances.map(o=>f({x:o.x,y:o.y,z:o.z,clearHeight:o.clearHeightCells,type:o.type,width:2}))),
   program:f(b.rooms.map(room=>f({name:room.name,uses:f([...room.uses])}))),
   unresolvedAssets:f([...new Set(b.voxels.map(c=>c.material))].sort()),
   technicalRelease:f({nativeExactHeadGreen:false,allProtectedD4Accepted:false,
    sourceChrome6ViewAudited:false,producerPackPhysicalFit:false,
    liveGameplayTested:false,creatorArtAccepted:false}),
   knownGaps:f(['Manual Pack1–5 real producer variant/AABB and rotation not audited',
    'No actual products, inventory, currency, merchant AI or trade UI',
    'No live placement or save-schema changes'])
  });
 }));
}
