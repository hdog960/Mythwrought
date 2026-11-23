// Exact original :24 upper-gallery center floor provenance at the
// observed both-site step114 blocker. Read-only, no caves, AIR, support,
// player movement or save edits. Inspect actual ORIGINAL upperCaveCells
// column and the final real M7 physical author for neighboring heights.
import {BLOCK,worldKey,collides} from '../voxel.mjs';
import {GROUND_PROBE} from '../physics.mjs';
import {M7_ENVIRONMENT_GENERATOR} from '../environment-ground.mjs';
import {deepCaveCells,DEEP_CAVE_ORIGIN} from '../deep-cave-network.mjs';
import {deepVaultCells} from '../deep-vault-galleries.mjs';
import {descentCells,DESCENT_ORIGIN} from '../underground-switchback-descent.mjs';
import {upperCaveCells,UPPER_SITES} from '../cave-approaches/upper-network.mjs';
import {originalM7AuthoredCaveFloorCap}
 from './enchanted-original-cave-descent-evidence.mjs';
const names=Object.freeze({'upper24-windcut':0,'upper24-hollowbend':1});
function own(world,index){
 const reservations=descentCells(DESCENT_ORIGIN);
 const occupied=new Set([
   ...deepCaveCells(DEEP_CAVE_ORIGIN).keys(),
   ...deepVaultCells(world.seed).keys(),...reservations.keys()
 ]);
 const p=upperCaveCells({seed:world.seed,site:UPPER_SITES[index],
  descentReservation:reservations,protectedCells:occupied,
  editedCells:new Set(),legacyCells:()=>null});
 if(!p.ok)throw Error('Original upper authored source composition unavailable');
 return p;
}
export function examineOriginalM7UpperOverlappedFloor(world,name,{step=114}={}){
 if(world?.profile?.generator!==M7_ENVIRONMENT_GENERATOR||
   !Object.hasOwn(names,name)||
   !Number.isInteger(step)||step<100||step>120)
  throw Error('Invalid original source upper overlap research');
 const src=own(world,names[name]);
 const p=src.route[step],prior=src.route[step-1],next=src.route[step+1];
 if(!p||!prior||!next)throw Error('Original upper author route index absent');
 const columns=[];
 for(const y of [p.floor+2,p.floor+1,p.floor,p.floor-1]){
  const xyz=(yy)=>worldKey(p.x,yy,p.z);
  const ownFloor=src.cells.get(xyz(y));
  const head=[1,2,3].map(h=>src.cells.get(xyz(y+h)));
  const worldFloor=world.get(p.x,y,p.z);
  const caveFloor=world.environmentCaves.get(p.x,y,p.z);
  const trueCap=originalM7AuthoredCaveFloorCap(world,p.x,y,p.z);
  columns.push(Object.freeze({y,ownerFloor:ownFloor??null,
   ownerThreeHead:Object.freeze(head.map(v=>v??null)),
   combinedCaveFloor:caveFloor??null,originalWorldFloor:worldFloor,
   originalSourcePhysicalCap:!!trueCap,
   actualBodyClear:!collides(world,p.x+.5,y+1,p.z+.5),
   genuineSupportProbe:collides(world,p.x+.5,y+1-GROUND_PROBE,p.z+.5),
   ownerAuthoredSolidFloor:ownFloor!==undefined&&ownFloor!==BLOCK.AIR,
   ownerAuthoredThreeHeadAIR:head.every(id=>id===BLOCK.AIR)
  }));
 }
 return Object.freeze({name,originalOwnerRouteStep:step,
  canonicalExpected:[p.x,p.floor,p.z],
  originalPrior:[prior.x,prior.floor,prior.z],
  originalNext:[next.x,next.floor,next.z],
  actualOriginalFloorCandidates:Object.freeze(columns),
  originalSourceOnly:true,authorGeometryModified:false,
  physicalBridgeClaimed:false});
}
