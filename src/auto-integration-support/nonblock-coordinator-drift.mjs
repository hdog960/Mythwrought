// :12 opt-in source-byte coordinator drift gate. No producer imports or runtime writes.
import {createHash} from 'node:crypto';
const sha1 = bytes => createHash('sha1').update(Buffer.concat([Buffer.from('blob '+bytes.length+'\0'),bytes])).digest('hex');

// Accept only one explicitly exported string constant. Never interpret a comment,
// string containing code, or duplicate declaration as an authenticated pin.
// This is deliberately a restricted declaration reader, NOT a JS parser.
function exportedLiteral(source,name){
 const lines=source.split(/\r?\n/);
 const matches=[];
 const pattern=new RegExp('^\\s*export\\s+const\\s+'+name+'\\s*=\\s*[\\x27\\x22]([^\\x27\\x22\\r\\n]+)[\\x27\\x22]\\s*;?\\s*(?://.*)?$');
 for(let i=0;i<lines.length;i++){
  if(/^\s*(?:\/\/|\*|\/\*)/.test(lines[i]))continue;
  const line=lines[i].trim();
  // Multiline declaration support, but never cross a comment or unrelated statement.
  if(/^export\s+const\s+/.test(line)){
   const candidate=[lines[i]];
   for(let j=i+1;j<Math.min(i+5,lines.length)&&!candidate.join(' ').includes(';');j++){
    if(/^\s*(?:\/\/|\/\*|\*)/.test(lines[j]))break;
    candidate.push(lines[j]);
   }
   const match=pattern.exec(candidate.join(' ').replace(/\s+/g,' '));
   if(match)matches.push({name:match[1],line:i+1});
  }
 }
 return matches.length===1?matches[0].name:null;
}
export function auditCoordinatorDrift({coordinator,environment,fittings,expectedHeads}={}){
 const errors=[];
 for(const [name,file] of Object.entries({coordinator,environment,fittings})){
  if(!file||typeof file.text!=='string'||!/^([a-f0-9]{40})$/.test(file.blob||'')||!/^([a-f0-9]{40})$/.test(file.head||'')){errors.push(name+': missing source proof');continue;}
  if(sha1(Buffer.from(file.text))!==file.blob)errors.push(name+': blob bytes mismatch');
  if(expectedHeads?.[name]!==file.head)errors.push(name+': stale producer HEAD');
 }
 if(errors.length)return {ok:false,live:false,errors};
 const coordinatorVersion=exportedLiteral(coordinator.text,'NONBLOCK_OBJECT_VERSION');
 const target=exportedLiteral(environment.text,'TARGET_CONTRACT');
 const pinnedCoordinator=exportedLiteral(environment.text,'COORDINATOR_SHA');
 const fittingVersion=exportedLiteral(fittings.text,'CONTRACT');
 const fittingBlob=exportedLiteral(fittings.text,'CONTRACT_SOURCE_SHA');
 if(!coordinatorVersion||coordinatorVersion!==target||target!==fittingVersion)errors.push('contract version mismatch or ambiguous declaration');
 if(pinnedCoordinator!==coordinator.head)errors.push('environment coordinator HEAD drift');
 if(fittingBlob!==coordinator.blob)errors.push('fittings coordinator blob drift');
 return {ok:errors.length===0,live:false,errors,sourceHeads:expectedHeads,coordinatorVersion};
}
