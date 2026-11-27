import {buildDesertModel} from './desert-models.mjs';
import {inspectBeastMesh} from './mesh-contract.mjs';
export function desertModelEnvelope(id){const m=buildDesertModel(id);return m?{info:inspectBeastMesh(m)}:undefined;}
