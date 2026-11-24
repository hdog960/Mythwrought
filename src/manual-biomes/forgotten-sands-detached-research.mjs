// Detached original-world research snapshot. Never provides a live write API.
import {FourRegionWorld,M7_ENVIRONMENT_GENERATOR,restoreFourRegionWorld} from './profile-world.mjs';
import {beginP0GroundSurvey} from './forgotten-sands-grounded-probe.mjs';
import {planP0NorthApproach} from './forgotten-sands-approach-probe.mjs';
import {BLOCK,worldKey} from '../voxel.mjs';

// This is a strict RESEARCH boundary, not a production reservation protocol.
// Capture actual schema-1 state once, restore to independent original reader,
// and survey that clone. Live owner authority remains intentionally absent.
export function beginP0DetachedResearch(world,site,{reserved}={}){
  if(!(world instanceof FourRegionWorld)||world.generationProfile.generator!==M7_ENVIRONMENT_GENERATOR||
     typeof reserved!=='function')throw Error('Expected original M7 source and explicit research reservation');
  const snapshot=JSON.stringify(world.save());
  const profile=world.generationProfile,base=restoreFourRegionWorld(JSON.parse(snapshot),profile);
  const job=beginP0GroundSurvey(base,site,{reserved});
  let report=null;
  return Object.freeze({
    step(options){
      report=job.step(options);return Object.freeze({accepted:report.accepted,reason:report.reason,
        scannedColumns:report.scannedColumns,scannedEdits:report.scannedEdits});
    },
    researchView({approach=false}={}){
      if(report?.accepted!==true)throw Error('Complete detached survey required');
      const a=approach?planP0NorthApproach(base,report,{reserved}):null;
      if(a&&!a.accepted)return Object.freeze({accepted:false,reason:a.reason,detail:a.detail});
      const get=(x,y,z)=>{
        // Canonical edits on the captured original snapshot always win.
        if(base.edits.has(worldKey(x,y,z)))return base.get(x,y,z);
        const candidate=a?.proposedBlock(x,y,z)??report.proposedBlock(x,y,z);
        const original=base.get(x,y,z);
        if(candidate!==null&&original!==BLOCK.AIR)throw Error('Detached source occupancy conflict');
        return candidate??original;
      };
      const view=Object.freeze({seed:base.seed,get,generationProfile:base.generationProfile,
        _columnPlan:(x,z)=>new Map(base._columnPlan(x,z)),
        rotationAt:(x,y,z)=>base.rotationAt(x,y,z)});
      return Object.freeze({accepted:true,view,site:report.site,floor:report.floor,maxY:report.maxY,
        approach:a?Object.freeze({start:a.start,rows:a.rows,addedCells:a.addedCells}):null,
        placementAuthority:false,sourceSnapshotUnchanged:()=>JSON.stringify(world.save())===snapshot});
    }
  });
}
