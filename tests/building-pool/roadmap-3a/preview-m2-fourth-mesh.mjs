// Diagnostic-only section: hide authored roof/purlin from section render,
// NEVER from stored blueprint, collision, saved worlds, or construction source.
import {createPreviewMesh} from './preview-mesh.mjs';
export function createM2FourthPreviewMesh(blueprint,{cutaway=false}={}){
 if(!cutaway)return createPreviewMesh(blueprint,{cutaway:false});
 const roofRemoved={...blueprint,modules:blueprint.modules.filter(m=>!['roof','purlin'].includes(m.role))};
 return createPreviewMesh(roofRemoved,{cutaway:true});
}
