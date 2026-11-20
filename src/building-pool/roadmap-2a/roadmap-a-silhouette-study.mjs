/**
 * ROADMAP A visual-art revision STUDY — 19 Wave01/02 candidates, reversible.
 * Deliberately preserves every original source voxel. Alternative roof-only
 * silhouettes built on actual authored roofing columns, not cosmetic tinting.
 * NO source acceptance, final Pack meshes, real heat/load-bearing certification,
 * world placement, gameplay effects, PWA save migrations or production writes.
 */
import {validateBlueprint} from './schema.mjs';
import {ROADMAP_A_WAVE01_SHOPS,ROADMAP_A_WAVE01_SPECS} from './roadmap-a-wave01.mjs';
import {ROADMAP_A_WAVE02_SHOPS,ROADMAP_A_WAVE02_SPECS} from './roadmap-a-wave02.mjs';
const input=[...ROADMAP_A_WAVE01_SHOPS,...ROADMAP_A_WAVE02_SHOPS];
const specs=[...ROADMAP_A_WAVE01_SPECS,...ROADMAP_A_WAVE02_SPECS];
export const ROADMAP_A_SKYLINE_STYLES=Object.freeze([
 'needle-observation-spire',
 'paired-step-belvederes',
 'courtyard-crown-merlons',
 'diagonal-clerestory-ridge',
 'offset-two-level-belfry',
 'sawtooth-conservatory-skyline'
]);
const k=(x,y,z)=>x+','+y+','+z;
const at=(x,z)=>x+','+z;
function height(style,dx,dz){
 const ax=Math.abs(dx),az=Math.abs(dz),max=Math.max(ax,az);
 if(style===0)return Math.max(0,17-3*max); // slender pyramidal spire
 if(style===1)return Math.max(0,15-3*Math.max(Math.abs(dx-3),az),
                                12-3*Math.max(Math.abs(dx+3),az)); // two separate turrets
 if(style===2)return (max<=4?(max>=3?14:8):0); // castellated ring around lower center
 if(style===3)return Math.max(0,15-2*Math.abs(dx+dz)-Math.max(0,ax-4)); // diagonal clerestory
 if(style===4)return Math.max(0,19-3*Math.max(Math.abs(dx+2),az),
                                11-2*Math.max(Math.abs(dx-4),az)); // asymmetric tall/short
 return Math.max(0,(Math.floor((dx+7)/3)%2===0?14:7)-Math.max(0,az-3)*2); // real roof sawtooth
}
function sculptRoof(base,spec,index){
 const style=index%ROADMAP_A_SKYLINE_STYLES.length;
 const center=spec.anchors[2]; // actually authored wing roof, never invented terrain cells
 const cx=center[0],cz=center[1];
 const radius=[6,7,5,6,7,7][style],roofMaterial=base.voxels.find(v=>v.kind==='roof')?.material;
 if(!roofMaterial)throw Error('missing authored roof material '+base.id);
 const occupied=new Map(base.voxels.map(v=>[k(v.x,v.y,v.z),v]));
 const originalVoxelCount=occupied.size,rooftops=new Map();
 for(const v of base.voxels){
  if(v.kind!=='roof'||Math.abs(v.x-cx)>radius||Math.abs(v.z-cz)>radius)continue;
  const key=at(v.x,v.z);
  rooftops.set(key,Math.max(rooftops.get(key)??-1,v.y));
 }
 if(rooftops.size<32)throw Error('skyline must have >=32 genuinely covered source roof columns: '+base.id);
 const basePeak=Math.max(...rooftops.values());
 const additions=[],plinths=[];
 for(const [key,top] of rooftops){
  const [x,z]=key.split(',').map(Number),dx=x-cx,dz=z-cz,rise=height(style,dx,dz);
  if(rise<=0)continue; // no attempt to cover empty original courtyard or sky void
  const target=Math.max(top,basePeak+rise);
  if(target<=top)continue;
  for(let y=top+1;y<=target;y++){
   const pos=k(x,y,z);
   if(occupied.has(pos))throw Error('skyline overlap: '+base.id+' '+pos);
   const voxel={x,y,z,kind:'roof',material:roofMaterial,
    architecturalRole:'reversible-source-only-skyline-study',
    skylineFamily:ROADMAP_A_SKYLINE_STYLES[style],
    roofBearing:'vertically chained atop ORIGINAL genuine roof-column; lateral structural capacity UNPROVEN'};
   if(y===top+1)plinths.push({x,y,z,rootRoofY:top});
   occupied.set(pos,voxel);additions.push(voxel);
  }
 }
 if(additions.length<64)throw Error('no meaningful roof silhouette change '+base.id);
 if(additions.length>6000)throw Error('unbounded cosmetic roof cells '+base.id);
 const peak=Math.max(...occupied.values().map(v=>v.y));
 const out={...base,
  extents:{...base.extents,y:Math.max(base.extents.y,peak+1)},
  voxels:[...occupied.values()].sort((a,b)=>a.y-b.y||a.z-b.z||a.x-b.x),
  roof:{...base.roof,sourceSkylineFamily:ROADMAP_A_SKYLINE_STYLES[style],
   genuineRaisedRoofCells:additions.length,
   baseRoofMaterial:roofMaterial,sourceRoofColumnAnchors:plinths.length,
   engineeringLoadBearingAccepted:false,realPartialMeshAccepted:false},
  features:[...base.features,
   'visual candidate ONLY — original source architecture fully preserved',
   'alternative tiered roof skyline '+ROADMAP_A_SKYLINE_STYLES[style]],
  architecturalSignature:base.architecturalSignature+
   ' | original-wave roof extension '+ROADMAP_A_SKYLINE_STYLES[style],
  sourceVisualRevision:{
   status:'provisional-alternative-not-integrated',
   originalSourceId:base.id,originalSourceVoxelCount:originalVoxelCount,
   additiveRoofCells:additions.length,
   genuineRoofColumns:plinths.length,
   roofStyle:ROADMAP_A_SKYLINE_STYLES[style],
   originalSourceGeometryPreserved:true,
   physicalPackMeshAccepted:false,
   originalRoofSpanAndWeatherCertificationStillOpen:true,
   creatorVisualApproval:false},
 };
 validateBlueprint(out);
 return Object.freeze(out);
}
export const ROADMAP_A_VISUAL19_ALTERNATIVES=Object.freeze(input.map((b,i)=>sculptRoof(b,specs[i],i)));
export const ROADMAP_A_VISUAL19_BASES=Object.freeze(input);
