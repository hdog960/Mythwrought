// :12 opt-in, source-authenticated coordinator drift gate. Never imports producer branches.
import {createHash} from 'node:crypto';
const sha1 = bytes => createHash('sha1').update(Buffer.concat([Buffer.from('blob '+bytes.length+'\0'),bytes])).digest('hex');
export function auditCoordinatorDrift({coordinator,environment,fittings,expectedHeads}={}){
 const errors=[];
 for(const [name,file] of Object.entries({coordinator,environment,fittings})){
  if(!file||typeof file.text!=='string'||!/^([a-f0-9]{40})$/.test(file.blob||'')||!/^([a-f0-9]{40})$/.test(file.head||'')){errors.push(name+': missing source proof');continue;}
  if(sha1(Buffer.from(file.text))!==file.blob)errors.push(name+': blob bytes mismatch');
  if(expectedHeads?.[name]!==file.head)errors.push(name+': stale producer HEAD');
 }
 if(errors.length)return {ok:false,live:false,errors};
 const coordinatorVersion=coordinator.text.match(/NONBLOCK_OBJECT_VERSION\\s*=\\s*['"]([^'"]+)/)?.[1];
 const target=environment.text.match(/TARGET_CONTRACT\\s*=\\s*['"]([^'"]+)/)?.[1];
 const pinnedCoordinator=environment.text.match(/COORDINATOR_SHA\\s*=\\s*['"]([a-f0-9]{40})/)?.[1];
 const fittingVersion=fittings.text.match(/CONTRACT\\s*=\\s*['"]([^'"]+)/)?.[1];
 const fittingBlob=fittings.text.match(/CONTRACT_SOURCE_SHA\\s*=\\s*['"]([a-f0-9]{40})/)?.[1];
 if(!coordinatorVersion||coordinatorVersion!==target||target!==fittingVersion)errors.push('contract version mismatch');
 if(pinnedCoordinator!==coordinator.head)errors.push('environment coordinator HEAD drift');
 if(fittingBlob!==coordinator.blob)errors.push('fittings coordinator blob drift');
 return {ok:errors.length===0,live:false,errors,sourceHeads:expectedHeads,coordinatorVersion};
}
