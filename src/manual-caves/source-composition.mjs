// C3: source-authenticated, opt-in cave-source collision auditor (#240).
// Does not register in production, mutate a saved world or create entrances.
import {BLOCK,worldKey} from '../voxel.mjs';
import {WORLD_MIN_Y,LEGACY_WORLD_MIN_Y} from '../depth.mjs';
import {deepCaveCells,DEEP_CAVE_ORIGIN} from '../deep-cave-network.mjs';
import {deepVaultCells} from '../deep-vault-galleries.mjs';
import {descentCells,DESCENT_ORIGIN} from '../underground-switchback-descent.mjs';
import {upperCaveCells,UPPER_SITES} from '../cave-approaches/upper-network.mjs';

export const CAVE_SOURCE_CELL_LIMIT=600000;
export const CAVE_SOURCE_LABELS=Object.freeze([
  'old-deep24','four-vaults36','switchback36',
  'upper24-windcut','upper24-hollowbend'
]);
function validateSourceMap(map,name){
  if(!(map instanceof Map))throw Error('Cave source '+name+' did not produce real physical cells');
  if(map.size>CAVE_SOURCE_CELL_LIMIT)throw Error('Cave source '+name+' exceeded cell cap');
  for(const [key,id] of map){
    if(typeof key!=='string'||!/^[-]?\d+,[-]?\d+,[-]?\d+$/.test(key)||
       (id!==BLOCK.AIR&&id!==BLOCK.DEEPSTONE&&id!==BLOCK.STONE))
      throw Error('Invalid cave source cell '+name+': '+key);
    const y=Number(key.split(',')[1]);
    if(!Number.isSafeInteger(y)||y<WORLD_MIN_Y||y>=LEGACY_WORLD_MIN_Y)
      throw Error('Protected legacy surface cell '+name+': '+key);
  }
}
export function auditCaveSourceCells(seed=179){
  if(!Number.isSafeInteger(seed)||seed!==(seed|0))throw Error('Invalid cave world seed');
  const originals=[
    ['old-deep24',deepCaveCells(DEEP_CAVE_ORIGIN)],
    ['four-vaults36',deepVaultCells(seed)],
    ['switchback36',descentCells(DESCENT_ORIGIN)]
  ];
  for(const [name,cells] of originals)validateSourceMap(cells,name);
  const occupied=new Set(originals.flatMap(([,cells])=>[...cells.keys()]));
  const reservation=originals[2][1];
  const reasons=[];
  for(let i=0;i<UPPER_SITES.length;i++){
    const site=UPPER_SITES[i];
    const result=upperCaveCells({seed,site,descentReservation:reservation,
      protectedCells:occupied,editedCells:new Set(),legacyCells:()=>null});
    const name=i?'upper24-hollowbend':'upper24-windcut';
    if(!result.ok){reasons.push(name+': '+result.reason+' ('+(result.conflictCount??0)+')');continue;}
    validateSourceMap(result.cells,name);
    originals.push([name,result.cells]);
    for(const key of result.cells.keys())occupied.add(key);
  }
  // A different solid/AIR answer at one voxel is a genuine authored cave
  // conflict. Never silently pick a winning owner or seal the earlier route.
  const cells=new Map(),ownerByCell=new Map(),sampleConflicts=[];
  let collisions=0;
  for(const [name,source] of originals){
    for(const [key,id] of source){
      if(cells.has(key)&&cells.get(key)!==id){
        collisions++;
        if(sampleConflicts.length<24)sampleConflicts.push(Object.freeze({
          key,priorOwner:ownerByCell.get(key),newOwner:name,
          priorId:cells.get(key),newId:id
        }));
      }else if(!cells.has(key)){cells.set(key,id);ownerByCell.set(key,name);}
      if(cells.size>CAVE_SOURCE_CELL_LIMIT){
        reasons.push('CAVE_SOURCE_CELL_LIMIT_EXCEEDED');break;
      }
    }
  }
  if(collisions)reasons.push('AUTHORED_CAVE_AIR_SOLID_CONFLICTS: '+collisions);
  const reports=originals.map(([name,source])=>Object.freeze({
    name,cells:source.size,air:[...source.values()].filter(id=>id===BLOCK.AIR).length
  }));
  return Object.freeze({
    ok:reasons.length===0,reasons:Object.freeze(reasons),
    seed,sourceCount:originals.length,sourceReports:Object.freeze(reports),
    overlapCount:collisions,conflicts:Object.freeze(sampleConflicts),
    cells,worldRange:Object.freeze({minY:WORLD_MIN_Y,legacyFloor:LEGACY_WORLD_MIN_Y}),
    entranceConnected:false,runtimeRegistered:false
  });
}
