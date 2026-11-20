// Roadmap C7 settlement handoff: measured source-only architectural data.
// This does not place buildings, generate settlements, assign IDs, or touch saves.
import {createHash} from 'node:crypto';
import {geometryFingerprint} from './contract.mjs';
import {createRoadmapCFirstGatehouseBlueprint} from './c1-twinstone-pass-gatehouse.mjs';
import {createRoadmapCFirstCityWallBlueprint} from './c3-fourwatch-closed-city-wall.mjs';

const sha=text=>createHash('sha256').update(text).digest('hex');
const freeze=(obj)=>Object.freeze(obj);
function bboxOf(blueprint){
 const points=blueprint.modules.filter(m=>m.role==='foundation')
  .flatMap(m=>m.cells.map(([x,y,z])=>[x,z]));
 if(!points.length)throw Error('Roadmap C handoff source lacks foundation');
 const minX=Math.min(...points.map(p=>p[0])),maxX=Math.max(...points.map(p=>p[0]));
 const minZ=Math.min(...points.map(p=>p[1])),maxZ=Math.max(...points.map(p=>p[1]));
 return freeze({x:minX,z:minZ,width:maxX-minX+1,depth:maxZ-minZ+1,
  occupiedFootprintColumns:new Set(points.map(p=>p.join(','))).size});
}
function fingerprint(b){
 return freeze({algorithm:'sha256',kind:'real-voxel-geometryFingerprint',
  value:sha(geometryFingerprint(b)),sourceVoxelCount:b.modules.reduce((n,m)=>n+m.cells.length,0)});
}
export function createRoadmapCFortificationHandoff(b){
 if(!b||!['gatehouse','city-wall'].includes(b.type))throw Error('C7 needs a source-backed fortified blueprint');
 const finger=fingerprint(b),bbox=bboxOf(b);
 const meta=b.fortification;
 if(!meta)throw Error('C7 missing actual fortification interface geometry');
 const openings=b.openings.map(o=>freeze({x:o.x,y:o.y,z:o.z,width:o.width,height:o.height,facing:o.facing}));
 const type=b.type;
 const gateway=type==='gatehouse'?meta.gateRoute:meta.gatePassages?.[0];
 if(!gateway||gateway.height<3||gateway.width<2||!Array.isArray(gateway.points))throw Error('C7 missing physically authored clear gateway');
 const joins=type==='city-wall'?meta.junctionSockets:(meta.rampartSockets||[]);
 const route=type==='city-wall'?meta.rampartRoute:null;
 if(type==='city-wall'&&(!Array.isArray(route)||!Array.isArray(meta.wallPath)))throw Error('C7 wall has no closed ring witness');
 const refs=[...new Set(b.modules.flatMap(m=>m.cells.map(c=>c[3])))].sort();
 return freeze({
  schema:'mythwrought.roadmap-c.settlement-handoff.v1',
  id:b.id,category:b.type,biome:b.biome,size:b.size,variant:b.variant,
  sourceOnly:true,approvedForProduction:false,registeredInGame:false,
  sourceFingerprint:finger,
  envelope:freeze({...b.envelope}),
  occupiedFoundationFootprint:bbox,
  terrainRequirements:type==='city-wall'?freeze({...meta.terrainConstraints}):freeze({...meta.terrainFoundation}),
  roadSockets:type==='city-wall'?freeze(meta.roadwaySockets.map(s=>freeze({...s}))):freeze(openings),
  entranceOpenings:freeze(openings),
  gateway:freeze({width:gateway.width,height:gateway.height,axis:gateway.axis,
   floorY:gateway.floorY,sourceRouteLength:gateway.points.length,
   clearRoute:freeze(gateway.points.map(p=>freeze([...p])))}),
  wallJoinSockets:freeze(joins.map(p=>freeze({...p}))),
  closedPerimeter:type==='city-wall'?freeze(meta.wallPath.map(p=>freeze([...p]))):null,
  defendedRampart:type==='city-wall'?freeze(route.map(p=>freeze([...p]))):null,
  supportAudit:freeze({foundationVoxels:b.modules.find(m=>m.role==='foundation')?.cells.length||0,
   actualPhysicalStairVoxels:b.modules.find(m=>m.role==='stair')?.cells.length||0,
   topologicalValidation:'source-backed-at-blueprint-creation'}),
  dependencies:freeze(refs),
  producerFit:freeze({variantYawOffset:false,collisionAABB:false,selectionAABB:false,
   manualFivePackPhysicalApproval:false,gateHingeInstalled:false}),
  renderingAndCollision:freeze({sourceVoxelCount:finger.sourceVoxelCount,
   runtimeTriangleBudgetVerified:false,liveCollisionTested:false,playerWalkTested:false}),
  webgl2Evidence:freeze({requiredPhoneLandscapes:freeze([[667,375],[844,390],[932,430]]),
   views:freeze(['exterior','cutaway']),verifiedCaptures:0,
   galleryAcceptancePending:true,creatorArtApproved:false}),
  unresolvedLimitations:freeze([
   'Producer physical assets, yaw, occupiedOffsets and mounting not certified',
   'Source-cube browser screenshots are not final producer mesh evidence',
   'No automated settlement placement, working powered gate, NPC guard, saves or world registration'
  ])
 });
}
export function createRoadmapCFirstFortificationHandoffs(){
 return freeze([
  createRoadmapCFortificationHandoff(createRoadmapCFirstGatehouseBlueprint()),
  createRoadmapCFortificationHandoff(createRoadmapCFirstCityWallBlueprint())
 ]);
}
