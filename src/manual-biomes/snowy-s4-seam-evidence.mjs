// DETACHED S4 READ-ONLY snow cap/rock/ice seam survey.
// Describes physical world-cell discontinuities; never changes an old cave,
// material, player edit, world profile or schema-1 saved payload. Uses the
// accepted S4 original-column reader rather than inventing a terrain model.
import {inspectSnowS4Transect} from './snowy-s4-source-transect.mjs';

const MAX_COLUMNS=128;
const NATURAL=new Set([272,276,279]);
const freeze=o=>Object.freeze(o);
const isCoord=n=>Number.isSafeInteger(n)&&Math.abs(n)<=100000;

export function surveySnowS4ChunkSeams(world,{x,z,width=8,height=8}={},deps={}){
  if(![x,z].every(isCoord)||!Number.isInteger(width)||
    !Number.isInteger(height)||width<2||height<2||
    width*height>MAX_COLUMNS||width>16||height>16)
    throw new RangeError('S4 source seam survey requires a bounded 2–128-column rectangle');
  const columns=[];
  for(let dz=0;dz<height;dz++)for(let dx=0;dx<width;dx++)
    columns.push([x+dx,z+dz]);
  const evidence=inspectSnowS4Transect(world,columns,deps);
  const byKey=new Map(evidence.rows.map(r=>[r.x+','+r.z,r]));
  const pairs=[],counts={adjacencies:0,bothAuthoredSnow:0,
    materialChanges:0,notableHeightChanges:0,materialAndHeightChanges:0,
    originalChunkBoundaries:0,chunkBoundaryHeightChanges:0,
    protectedOrUnchangedBoundaries:0,caveOrEditedBoundaries:0};
  for(const row of evidence.rows){
    for(const [dx,dz] of [[1,0],[0,1]]){
      const next=byKey.get((row.x+dx)+','+(row.z+dz));
      if(!next)continue;
      counts.adjacencies++;
      const boundary=dx!==0?Math.floor(row.x/16)!==Math.floor(next.x/16):
        Math.floor(row.z/16)!==Math.floor(next.z/16);
      const both=row.status==='authored-snow'&&next.status==='authored-snow'&&
        NATURAL.has(row.material)&&NATURAL.has(next.material);
      const heightDelta=next.floor-row.floor, materialChange=row.material!==next.material;
      const notable=both&&Math.abs(heightDelta)>=2;
      const contrast=both&&materialChange;
      counts.originalChunkBoundaries+=Number(boundary);
      counts.bothAuthoredSnow+=Number(both);
      counts.materialChanges+=Number(contrast);
      counts.notableHeightChanges+=Number(notable);
      counts.materialAndHeightChanges+=Number(notable&&contrast);
      counts.chunkBoundaryHeightChanges+=Number(boundary&&notable);
      counts.protectedOrUnchangedBoundaries+=Number(!both);
      counts.caveOrEditedBoundaries+=Number(
        ['protected-cave','edited-surface'].includes(row.status)||
        ['protected-cave','edited-surface'].includes(next.status));
      if(notable||contrast||boundary||!both){
        pairs.push(freeze({from:freeze([row.x,row.z]),
          to:freeze([next.x,next.z]),heightDelta,
          materialFrom:row.material,materialTo:next.material,
          originalChunkBoundary:boundary,materialChange:contrast,
          notableHeightChange:notable,protectedUnchanged:!both,
          sourceStatuses:freeze([row.status,next.status])}));
      }
    }
  }
  return freeze({kind:'detached-original-M7-S4-snow-seam-survey',
    sampled:evidence.sampled,counts:freeze(counts),
    authoredSampleCount:evidence.summary['authored-snow']??0,
    evidence:freeze(pairs),state:'read-only-no-generator-activation',
    warning:'2-block rises are review targets, not automatic terrain defects'});
}
