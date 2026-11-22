// MYTHWROUGHT Roadmap 9 M7: pure, detached, READ-ONLY blueprint browser.
// No builder imports, runtime registration, world edits, external fetch or saves.
export const BLUEPRINT_ABI = 'mythwrought.creative.blueprint-browser.v1';
export const MAX_BLUEPRINT_RECORDS = 4096;
export const MAX_PREVIEW_VOXELS = 96;
export const MAX_VISIBLE_ROWS = 20;
const BIOMES = Object.freeze(['temperate','desert','snow','enchanted','mountain']);
const SIZES = Object.freeze(['small','medium','large']);
const KINDS = Object.freeze(['home','civic','commerce','industry','culture','fortification','arcane']);
const CELL_TYPES = Object.freeze(['foundation','wall','roof','detail']);
const safeId = x => typeof x === 'string' && /^[A-Za-z][\w.:-]{1,95}$/.test(x);
const nonempty = x => typeof x === 'string' && x.trim().length>0 && x.trim().length<=100;
const hexFingerprint = x => typeof x === 'string' && /^[0-9a-f]{64}$/i.test(x);
const copy = x => Object.freeze({...x});
const frozen = a => Object.freeze(a);

// An adapter's shape/provenance can be inspected without invoking it. Passing
// this guard is NOT evidence of creator approval or runtime attachment.
export function inspectBlueprintAdapter(adapter){
 const missing=[];
 if(typeof adapter?.listReadyBlueprints!=='function')missing.push('listReadyBlueprints');
 if(adapter?.provenance!=='accepted-blueprint-registry')missing.push('provenance');
 if(adapter?.worldSchema!==1)missing.push('worldSchema=1');
 return Object.freeze({abi:BLUEPRINT_ABI,shapeValid:missing.length===0,missing:frozen(missing),runtimeIntegrated:false,readOnly:true});
}
function exclusion(row){
 if(!row||typeof row!=='object'||Array.isArray(row))return 'invalid-record';
 if(!safeId(row.id)||!nonempty(row.name)||!KINDS.includes(row.kind)||!BIOMES.includes(row.biome)||!SIZES.includes(row.size))return 'invalid-metadata';
 if(row.draft===true||row.status==='draft'||row.sourceState==='unmerged')return 'draft-excluded';
 const approval=row.approval;
 if(row.status!=='accepted'||approval?.status!=='accepted'||approval?.authority!=='creator'||!safeId(approval?.decisionId))return 'creator-approval-missing';
 const deps=row.dependencies;
 if(!deps||!Array.isArray(deps.required)||!Array.isArray(deps.resolved)||!Array.isArray(deps.missing))return 'dependency-manifest-missing';
 if([...deps.required,...deps.resolved,...deps.missing].some(x=>!safeId(x)))return 'invalid-dependency-id';
 const unique=a=>new Set(a).size===a.length;
 if(!unique(deps.required)||!unique(deps.resolved)||!unique(deps.missing))return 'duplicate-dependency';
 if(deps.status!=='resolved'||deps.missing.length||deps.required.some(x=>!deps.resolved.includes(x)))return 'missing-dependency';
 const geometry=row.geometry;
 if(geometry?.coordinateAuthored!==true||!hexFingerprint(geometry?.fingerprint))return 'geometry-not-verified';
 const preview=geometry.previewCells;
 if(!Array.isArray(preview)||!preview.length||preview.length>MAX_PREVIEW_VOXELS)return 'preview-limit';
 const coords=new Set();
 for(const cell of preview){
  if(!cell||!['x','y','z'].every(k=>Number.isSafeInteger(cell[k])&&cell[k]>=0&&cell[k]<=63)||!CELL_TYPES.includes(cell.type))return 'unsafe-preview';
  const key=`${cell.x},${cell.y},${cell.z}`;
  if(coords.has(key))return 'duplicate-preview-cell';
  coords.add(key);
 }
 return null;
}
// A detached snapshot is structurally checked; its self-declared provenance
// cannot prove the actual registry/approvals. The returned records are NEVER
// considered live/integrated. A future trusted bridge must separately attest.
export function screenBlueprintSnapshot(snapshot){
 if(!snapshot||snapshot.abi!==BLUEPRINT_ABI||snapshot.provenance!=='accepted-blueprint-registry'||
    !Number.isSafeInteger(snapshot.registryRevision)||snapshot.registryRevision<1||
    !Array.isArray(snapshot.records)||snapshot.records.length>MAX_BLUEPRINT_RECORDS)
  throw TypeError('Untrusted or oversized blueprint registry snapshot');
 const seen=new Set(),allowed=[],excluded=[];
 for(let i=0;i<snapshot.records.length;i++){
  const row=snapshot.records[i],id=row?.id;
  // Invalid IDs never enter the accepted catalog. Duplicate well-formed IDs
  // invalidate the entire snapshot, avoiding ambiguous selections.
  if(safeId(id)){
   if(seen.has(id))throw Error('Duplicate blueprint identity: '+id);
   seen.add(id);
  }
  const reason=exclusion(row);
  if(reason){excluded.push(Object.freeze({id:safeId(id)?id:null,reason}));continue;}
  const cells=frozen(row.geometry.previewCells.map(copy));
  const entry=Object.freeze({id:row.id,name:row.name.trim(),kind:row.kind,biome:row.biome,size:row.size,
    approval:Object.freeze({...row.approval}),fingerprint:row.geometry.fingerprint.toLowerCase(),
    dependencyCount:row.dependencies.required.length,previewCells:cells});
  allowed.push(entry);
 }
 allowed.sort((a,b)=>a.name.localeCompare(b.name)||a.id.localeCompare(b.id));
 return Object.freeze({abi:BLUEPRINT_ABI,registryRevision:snapshot.registryRevision,
  records:frozen(allowed),excluded:frozen(excluded),acceptedCount:allowed.length,excludedCount:excluded.length,
  runtimeIntegrated:false,readOnly:true,fixture:snapshot.fixture===true});
}
export function filterBlueprints(catalog,{query='',biome='all',kind='all',size='all',offset=0,limit=12}={}){
 if(catalog?.abi!==BLUEPRINT_ABI||!Array.isArray(catalog.records))throw TypeError('Invalid curated blueprint catalog');
 if(typeof query!=='string'||query.length>200)throw TypeError('Invalid search text');
 if(!['all',...BIOMES].includes(biome)||!['all',...KINDS].includes(kind)||!['all',...SIZES].includes(size))throw TypeError('Invalid filter');
 if(!Number.isSafeInteger(offset)||offset<0||!Number.isSafeInteger(limit)||limit<1||limit>MAX_VISIBLE_ROWS)throw RangeError('Virtualized page bounds');
 const needle=query.trim().toLocaleLowerCase();
 const filtered=catalog.records.filter(r=>(biome==='all'||r.biome===biome)&&(kind==='all'||r.kind===kind)&&(size==='all'||r.size===size)&&
  (!needle||[r.name,r.id,r.kind,r.biome,r.size].some(s=>s.toLocaleLowerCase().includes(needle))));
 return Object.freeze({total:filtered.length,offset,limit,items:frozen(filtered.slice(offset,offset+limit)),
  hasMore:offset+limit<filtered.length});
}
export function virtualBlueprintWindow(catalog,filters,scrollTop,rowHeight=42,viewportHeight=170){
 if(!Number.isFinite(scrollTop)||scrollTop<0||!Number.isSafeInteger(rowHeight)||rowHeight<20||rowHeight>120||
    !Number.isFinite(viewportHeight)||viewportHeight<=0||viewportHeight>4000)throw RangeError('Invalid viewport geometry');
 const offset=Math.max(0,Math.floor(scrollTop/rowHeight)-1);
 const limit=Math.min(MAX_VISIBLE_ROWS,Math.ceil(viewportHeight/rowHeight)+3);
 const view=filterBlueprints(catalog,{...filters,offset,limit});
 return Object.freeze({...view,topSpacer:offset*rowHeight,bottomSpacer:Math.max(0,view.total-offset-view.items.length)*rowHeight});
}
export const BLUEPRINT_FILTERS=Object.freeze({biomes:BIOMES,kinds:KINDS,sizes:SIZES});
