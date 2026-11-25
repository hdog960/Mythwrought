// Portable research descriptor ONLY. Not a registered generator, world save,
// owner lock, storage journal or placement capability. Rebuild on import.
import {FourRegionWorld,M7_ENVIRONMENT_GENERATOR} from './profile-world.mjs';
import {researchP0JointGroup} from './forgotten-sands-joint-group.mjs';
import {BLOCK} from '../voxel.mjs';
export const P0_RESEARCH_ID='mythwrought-forgotten-sands-proposal-v1';
export const P0_SOURCE_BASE='db4bbcc32156e5df311f733bcaa53d559c17313b';
const encoder=new TextEncoder(),hex=/^[0-9a-f]{64}$/;
async function digest(s){
  const a=new Uint8Array(await crypto.subtle.digest('SHA-256',encoder.encode(s)));
  return Array.from(a,v=>v.toString(16).padStart(2,'0')).join('');
}
const canonicalSpec=(input)=>{
  if(!input||!Number.isSafeInteger(input.seed)||!['x','z'].includes(input.axis)||!Array.isArray(input.modules)||input.modules.length!==3)throw Error('Invalid research descriptor spec');
  return {seed:input.seed,axis:input.axis,modules:input.modules.map(m=>({seed:m.seed,x:m.x,z:m.z,size:m.size,height:m.height}))};
};
const denied=reason=>Object.freeze({accepted:false,reason,placementAuthority:false});
export async function exportP0ResearchProposal(source,input,{reserved,ownerRevision}={}){
  if(!(source instanceof FourRegionWorld)||source.generationProfile.generator!==M7_ENVIRONMENT_GENERATOR)return denied('unsupported-historical-source');
  if(typeof reserved!=='function'||typeof ownerRevision!=='function')return denied('missing-reservation-authority');
  const revision=ownerRevision(),profile=source.generationProfile,save=JSON.stringify(source.save());
  if(typeof revision!=='string'||!revision.length||revision.length>256)return denied('invalid-reservation-revision');
  const spec=canonicalSpec(input),group=researchP0JointGroup(source,spec,{reserved,ownerRevision});
  if(!group.accepted)return denied(group.reason);
  // Digest actual differing physical cells including approaches. Count each
  // once in a canonical x,z,y traversal. No edits written to either world.
  const minX=Math.min(...spec.modules.map(m=>m.x-(m.size-1)/2))-8,maxX=Math.max(...spec.modules.map(m=>m.x+(m.size-1)/2))+8;
  const minZ=Math.min(...spec.modules.map(m=>m.z-(m.size-1)/2))-8,maxZ=Math.max(...spec.modules.map(m=>m.z+(m.size-1)/2))+8;
  const rows=[];
  for(let x=minX;x<=maxX;x++)for(let z=minZ;z<=maxZ;z++)for(let y=0;y<=46;y++){
    const original=source.get(x,y,z),id=group.view.get(x,y,z);
    if(original===id)continue;
    if(original!==BLOCK.AIR||id===BLOCK.AIR||reserved(x,z)!==false)return denied('source-or-reservation-veto');
    rows.push([x,y,z,id]);
  }
  if(rows.length!==group.proposedCells)return denied('proposal-count-mismatch');
  const payload={kind:P0_RESEARCH_ID,version:1,sourceBase:P0_SOURCE_BASE,profile:{kind:profile.kind,version:profile.version,generator:profile.generator,seed:profile.seed},
    spec,revision,saveSha:await digest(save),geometrySha:await digest(JSON.stringify(rows)),proposedCells:rows.length,turns:[...group.turns]};
  const raw=JSON.stringify(payload),checksum=await digest(raw);
  if(ownerRevision()!==revision||JSON.stringify(source.save())!==save||!group.snapshotCurrent())return denied('stale-research-source');
  return Object.freeze({accepted:true,placementAuthority:false,raw:JSON.stringify({payload,checksum}),checksum,proposedCells:rows.length});
}
export async function inspectP0ResearchProposal(raw,source,authority){
  if(typeof raw!=='string'||raw.length>16384)return denied('invalid-descriptor-envelope');
  let item;try{item=JSON.parse(raw);}catch{return denied('invalid-descriptor-json');}
  const p=item?.payload;
  if(!p||!hex.test(item.checksum??'')||Object.keys(item).sort().join(',')!=='checksum,payload'||
    p.kind!==P0_RESEARCH_ID||p.version!==1||p.sourceBase!==P0_SOURCE_BASE||!hex.test(p.saveSha??'')||!hex.test(p.geometrySha??''))return denied('invalid-descriptor-identity');
  if(await digest(JSON.stringify(p))!==item.checksum)return denied('descriptor-checksum-mismatch');
  if(!(source instanceof FourRegionWorld)||source.generationProfile.generator!==M7_ENVIRONMENT_GENERATOR||source.seed!==p.spec?.seed)return denied('source-profile-mismatch');
  if(typeof authority?.ownerRevision!=='function'||typeof authority?.reserved!=='function')return denied('missing-reservation-authority');
  if(authority.ownerRevision()!==p.revision||await digest(JSON.stringify(source.save()))!==p.saveSha)return denied('stale-research-source');
  let rebuilt;try{rebuilt=await exportP0ResearchProposal(source,p.spec,authority);}catch{return denied('invalid-or-vetoed-proposal');}
  if(!rebuilt.accepted)return rebuilt;
  if(rebuilt.raw!==raw)return denied('noncanonical-or-different-proposal');
  return Object.freeze({accepted:true,placementAuthority:false,reason:'research-descriptor-revalidated; canonical live writer not installed',checksum:rebuilt.checksum,proposedCells:rebuilt.proposedCells});
}
