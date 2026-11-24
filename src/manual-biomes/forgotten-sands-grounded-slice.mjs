// Isolated Phase 0 proposed-geometry extraction. No mesh queue, no edits,
// no live world adapter. An accepted quiet survey is NOT placement authority.
import {sectionBounds} from '../depth.mjs';
import {p0UpperSectionBounds,P0_MAX_UPPER_SECTIONS} from './forgotten-sands-upper-probe.mjs';
export function sliceP0SurveySection(report,cx,cz,section){
  if(!report?.accepted||typeof report.proposedBlock!=='function'||
    ![cx,cz,section].every(Number.isSafeInteger)||section<0||section>P0_MAX_UPPER_SECTIONS)
    throw Error('Expected accepted quiet footprint survey and valid section');
  const s=report.site,b=section===0?sectionBounds(0):p0UpperSectionBounds(section);
  const x0=Math.max(s.minX,cx*16),x1=Math.min(s.maxX,cx*16+15);
  const z0=Math.max(s.minZ,cz*16),z1=Math.min(s.maxZ,cz*16+15);
  const y1=Math.min(b.maxY,report.maxY);
  const cells=[];
  if(x0>x1||z0>z1||b.minY>y1)return cells;
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
    const cap=report.capAt(x,z);
    if(!Number.isInteger(cap))throw Error('Incomplete surveyed column');
    for(let y=Math.max(cap+1,b.minY);y<=y1;y++){
      const id=report.proposedBlock(x,y,z);
      if(id!==null)cells.push([x,y,z,id]);
    }
  }
  if(cells.length>256*(b.maxY-b.minY+1))throw Error('Section extraction exceeded bound');
  return cells;
}
