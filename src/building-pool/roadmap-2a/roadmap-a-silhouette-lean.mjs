/**
 * Roadmap A source-only, reversible alternative to the overweight Visual19 roof study.
 * Architectural edits are a strict SUBSET of the first experiment's new roof cells.
 * Every original Wave01/02 source voxel remains identical and immutable.
 */
import {validateBlueprint} from './schema.mjs';
import {ROADMAP_A_VISUAL19_ALTERNATIVES,ROADMAP_A_VISUAL19_BASES} from './roadmap-a-silhouette-study.mjs';
import {ROADMAP_A_WAVE01_SPECS} from './roadmap-a-wave01.mjs';
import {ROADMAP_A_WAVE02_SPECS} from './roadmap-a-wave02.mjs';
const specs=[...ROADMAP_A_WAVE01_SPECS,...ROADMAP_A_WAVE02_SPECS];
const original=ROADMAP_A_VISUAL19_BASES,heavy=ROADMAP_A_VISUAL19_ALTERNATIVES;
const pos=v=>v.x+','+v.y+','+v.z;
const isCandidate=v=>v.architecturalRole==='reversible-source-only-skyline-study';
// Select sparse but continuous vertical roof columns, never remove individual strata.
function keepColumn(style,dx,dz){
 const ax=Math.abs(dx),az=Math.abs(dz),m=Math.max(ax,az);
 if(style===0)return m===3||(m<=2&&(m===0||m===2||dx===0||dz===0)); // ringed needle observation spire
 if(style===1)return Math.max(Math.abs(dx-3),az)<=2||Math.max(Math.abs(dx+3),az)<=2; // paired turrets
 if(style===2)return m>=3&&m<=4&&(m===3||((dx+dz)&1)===0); // open crown ring
 if(style===3)return ax<=5&&az<=5&&Math.abs(dx+dz)<=2; // diagonal clerestory ridge
 if(style===4)return Math.max(Math.abs(dx+2),az)<=2||Math.max(Math.abs(dx-4),az)<=2; // offset belfries
 return ax<=6&&az<=4&&(dx%3===0||((dx+7)%4===0&&az<=1)); // thin non-solid sawtooth
}
function leanAlternative(base,fat,spec,i){
 if(fat.id!==base.id)throw Error('original-provenance mismatch: '+base.id);
 const style=i%6,[cx,cz]=spec.anchors[2];
 const originalPositions=new Set(base.voxels.map(pos));
 const selected=fat.voxels.filter(v=>!isCandidate(v)||keepColumn(style,v.x-cx,v.z-cz));
 const variants=selected.filter(isCandidate);
 const addedPositions=new Set(variants.map(pos));
 const originalRoof=new Set(base.voxels.filter(v=>v.kind==='roof').map(v=>v.x+','+v.z));
 const columns=new Set(variants.map(v=>v.x+','+v.z));
 const heavyAdd=fat.sourceVisualRevision.additiveRoofCells,leanAdd=variants.length;
 if(columns.size<32||leanAdd<64||leanAdd>heavyAdd*.72)throw Error('lean roof source budget or anchor failure: '+base.id);
 if(selected.length!==base.voxels.length+leanAdd)throw Error('source voxel preservation failed '+base.id);
 const all=new Set(selected.map(pos));
 if(all.size!==selected.length)throw Error('overlapping roof voxel '+base.id);
 for(const v of variants){
  if(!originalRoof.has(v.x+','+v.z))throw Error('sky-open courtyard re-roofed '+base.id);
  if(!all.has(v.x+','+(v.y-1)+','+v.z))throw Error('unsupported vertical roof study column '+base.id);
  if(!originalPositions.has(pos(v))&&v.kind!=='roof')throw Error('new nonroof source voxel '+base.id);
 }
 const maxY=Math.max(...selected.map(v=>v.y));
 const out={
  ...fat,extents:{...fat.extents,y:maxY+1},
  voxels:selected,
  roof:{...fat.roof,genuineRaisedRoofCells:leanAdd,sourceRoofColumnAnchors:columns.size,
   studyComparedToPriorFatRoof:heavyAdd,engineeringLoadBearingAccepted:false,realPartialMeshAccepted:false},
  architecturalSignature:fat.architecturalSignature+' | sparse-subset budget-study',
  features:[...fat.features,'lean rooftop study only, 100% original voxel cells retained'],
  sourceVisualRevision:{...fat.sourceVisualRevision,
   status:'reversible-lean-roof-budget-study-not-integrated',
   additiveRoofCells:leanAdd,genuineRoofColumns:columns.size,
   fatAlternativeAddedRoofCells:heavyAdd,
   savedSourceRoofCells:heavyAdd-leanAdd,
   geometryReductionRatio:+((heavyAdd-leanAdd)/heavyAdd).toFixed(6),
   retainedExistingOriginalVoxels:base.voxels.length,
   originalSourceGeometryPreserved:true,physicalPackMeshAccepted:false,
   creatorVisualApproval:false,actualGPUCostAccepted:false},
 };
 validateBlueprint(out);
 return Object.freeze(out);
}
export const ROADMAP_A_VISUAL19_LEAN_BASES=original;
export const ROADMAP_A_VISUAL19_HEAVY_ALTERNATIVES=heavy;
export const ROADMAP_A_VISUAL19_LEAN_ALTERNATIVES=Object.freeze(original.map((b,i)=>leanAlternative(b,heavy[i],specs[i],i)));
