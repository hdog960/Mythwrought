// MYTHWROUGHT Floating Islands: immutable, source-attested natural-vegetation overlay.
// It keeps generated tree voxels OUT of provisional PLAYER edit saves.
// Precedence: player AIR/placement > certified natural flora > Codex generator.
// Detached research only: no original world writes, no GPU work or shadow pass.
import {skyIslandMeshKey,skyIslandSectionForY,SKY_ISLAND_MIN_Y,
  SKY_ISLAND_MAX_Y,SKY_ISLAND_SECTION_COUNT,SKY_ISLAND_LIGHTING_POLICY} from './sky-runtime-adapter.mjs';

export const SKY_ECOLOGY_OVERLAY_MAX_CELLS=512;
export const SKY_ECOLOGY_PLAYER_EDIT_LIMIT=8192;
export const SKY_ECOLOGY_MAX_REBUILD_KEYS=1024;
const safe=Number.isSafeInteger;
const token=s=>typeof s==='string'&&s.length>0&&s.length<=128;
const fail=s=>{throw new TypeError('Sky ecology overlay: '+s);};
const valid=(x,y,z)=>[x,y,z].every(safe)&&Math.abs(x)<=10000000&&
  Math.abs(z)<=10000000&&y>=SKY_ISLAND_MIN_Y&&y<=SKY_ISLAND_MAX_Y;
const key=(x,y,z)=>`${x},${y},${z}`;
const originalKey=s=>typeof s==='string'&&/^(?:0|-?[1-9]\d*),(?:0|[1-9]\d*),(?:0|-?[1-9]\d*)$/.test(s)&&
  (()=>{const c=s.split(',').map(Number);return valid(...c)&&key(...c)===s;})();
const snapshotId=source=>{
  const s=source.readIdentity();
  if(!s||!token(s.worldToken)||!token(s.generatorFingerprint)||
    !safe(s.epoch)||s.epoch<0||!safe(s.seed)||s.seed!==(s.seed|0))
    fail('genuine generator/world identity required');
  return Object.freeze({worldToken:s.worldToken,generatorFingerprint:s.generatorFingerprint,
    epoch:s.epoch,seed:s.seed});
};
const equals=(a,b)=>a.worldToken===b.worldToken&&a.generatorFingerprint===b.generatorFingerprint&&
  a.epoch===b.epoch&&a.seed===b.seed;
function readRevision(source){
  const n=source.readWorldRevision();
  if(!safe(n)||n<0)fail('genuine world edit revision required');
  return n;
}
const sectionKey=(x,y,z)=>skyIslandMeshKey(Math.floor(x/16),Math.floor(z/16),skyIslandSectionForY(y));
function proofRows(proof){
  if(!Array.isArray(proof.sectionRevisions)||proof.sectionRevisions.length>512)
    fail('bounded certified section proof required');
  const map=new Map();
  for(const row of proof.sectionRevisions){
    if(!Array.isArray(row)||row.length!==2||typeof row[0]!=='string'||
      !/^sky:-?\d+,-?\d+,\d+$/.test(row[0])||!safe(row[1])||row[1]<0||map.has(row[0]))
      fail('duplicate, unbounded or invalid certified section proof');
    const [cx,cz,section]=row[0].slice(4).split(',').map(Number);
    if(!safe(cx)||!safe(cz)||!safe(section)||section<0||section>=SKY_ISLAND_SECTION_COUNT||
      skyIslandMeshKey(cx,cz,section)!==row[0])fail('noncanonical section revision key');
    map.set(row[0],row[1]);
  }
  return map;
}
function inputEdits(edits,rotations,source){
  if(!(edits instanceof Map)||!(rotations instanceof Map)||
    edits.size>SKY_ECOLOGY_PLAYER_EDIT_LIMIT||rotations.size>edits.size)
    fail('bounded, separate real player edit maps required');
  const own=new Map(),ownRotations=new Map();
  for(const [loc,id] of edits){
    if(!originalKey(loc)||!safe(id)||id<0||id>65534||source.validateId(id)!==id)
      fail('noncanonical or unregistered player edit');
    own.set(loc,id);
  }
  for(const [loc,rotation] of rotations){
    if(!own.has(loc)||!safe(rotation)||rotation<1||rotation>3||
      typeof source.rotationAllowed!=='function'||!source.rotationAllowed(own.get(loc)))
      fail('unapproved player rotation or missing underlying edit');
    ownRotations.set(loc,rotation);
  }
  return [own,ownRotations];
}
function invalidationKeys(cells){
  const result=new Set();
  for(const row of cells){
    const {x,y,z}=row;
    const cx=Math.floor(x/16),cz=Math.floor(z/16),section=skyIslandSectionForY(y);
    result.add(skyIslandMeshKey(cx,cz,section));
    const localX=x-cx*16,localZ=z-cz*16;
    if(localX===0)result.add(skyIslandMeshKey(cx-1,cz,section));
    if(localX===15)result.add(skyIslandMeshKey(cx+1,cz,section));
    if(localZ===0)result.add(skyIslandMeshKey(cx,cz-1,section));
    if(localZ===15)result.add(skyIslandMeshKey(cx,cz+1,section));
    if(y>SKY_ISLAND_MIN_Y&&skyIslandSectionForY(y-1)!==section)
      result.add(skyIslandMeshKey(cx,cz,skyIslandSectionForY(y-1)));
    if(y<SKY_ISLAND_MAX_Y&&skyIslandSectionForY(y+1)!==section)
      result.add(skyIslandMeshKey(cx,cz,skyIslandSectionForY(y+1)));
  }
  return Object.freeze([...result].sort());
}
function groundInvalidationKeys(cells){
  const result=new Set();
  for(const {x,y,z} of cells){
    if(y!==SKY_ISLAND_MIN_Y)continue;
    const cx=Math.floor(x/16),cz=Math.floor(z/16);
    const lx=x-cx*16,lz=z-cz*16;
    result.add(`${cx},${cz}`);
    if(lx===0)result.add(`${cx-1},${cz}`);
    if(lx===15)result.add(`${cx+1},${cz}`);
    if(lz===0)result.add(`${cx},${cz-1}`);
    if(lz===15)result.add(`${cx},${cz+1}`);
  }
  return Object.freeze([...result].sort());
}
export function createCertifiedSkyEcologyOverlay({certificate,source,
  playerEdits=new Map(),playerRotations=new Map()}={}){
  if(!certificate||!certificate.sourceProof||!certificate.candidate||
     !Array.isArray(certificate.candidate.edits)||
     certificate.candidate.edits.length>SKY_ECOLOGY_OVERLAY_MAX_CELLS||
     !source||['readIdentity','readWorldRevision','sectionRevision',
       'naturalGet','validateId','isProtectedCell'].some(k=>typeof source[k]!=='function'))
    fail('certified physical ecology and original source authority required');
  const proof=certificate.sourceProof,identity=snapshotId(source),beforeRev=readRevision(source);
  if(!equals(identity,proof)||proof.worldRevision!==beforeRev||
     certificate.worldWrites!==0||certificate.saveWrites!==0||
     certificate.renderOnlyMeshes!==0||certificate.shadowPasses!==0)
    fail('stale source proof or nonphysical vegetation side effects');
  const sections=proofRows(proof),revisions=new Map();
  for(const [k,expected] of sections){
    const actual=source.sectionRevision(k);
    if(!safe(actual)||actual!==expected)fail('certified source section revision changed');
    revisions.set(k,actual);
  }
  // Every scene-neighbor mesh affected by a canopy/cell occlusion change
  // needs an exact revision fence, not just the tree's authored cells.
  const dirtyKeys=invalidationKeys(certificate.candidate.edits);
  if(dirtyKeys.length>SKY_ECOLOGY_MAX_REBUILD_KEYS)
    fail('original sky invalidation footprint exceeds iPhone budget');
  for(const k of dirtyKeys){
    if(revisions.has(k))continue;
    const revision=source.sectionRevision(k);
    if(!safe(revision)||revision<0)fail('adjacent original source revision unavailable');
    revisions.set(k,revision);
  }
  const [authored,orientations]=inputEdits(playerEdits,playerRotations,source),natural=new Map();
  for(const r of certificate.candidate.edits){
    if(!r||!valid(r.x,r.y,r.z)||!safe(r.id)||r.id<1||r.id>65534||
       !token(r.from)||source.validateId(r.id)!==r.id)
      fail('unsupported original physical vegetation placement');
    const k=key(r.x,r.y,r.z);
    if(natural.has(k))fail('duplicate natural vegetation cell');
    if(!sections.has(sectionKey(r.x,r.y,r.z)))
      fail('ecology cell outside certified generator-section footprint');
    if(source.isProtectedCell(r.x,r.y,r.z)&&!authored.has(k))
      fail('protected unedited source cell in flora proposal');
    const sourceId=source.naturalGet(r.x,r.y,r.z);
    if(!safe(sourceId)||sourceId<0||sourceId>65534||
      source.validateId(sourceId)!==sourceId||sourceId!==0)
      fail('generated island world changed beneath natural vegetation');
    natural.set(k,r.id);
  }
  if(!equals(identity,snapshotId(source))||readRevision(source)!==beforeRev)
    fail('source mutated during ecology-overlay construction');
  for(const [k,expected] of revisions)
    if(source.sectionRevision(k)!==expected)
      fail('source section changed during ecology-overlay construction');
  const certifiedKeys=Object.freeze([...sections.keys()].sort());
  const naturalCells=Object.freeze([...certificate.candidate.edits].map(r=>Object.freeze({...r})));
  const groundKeys=groundInvalidationKeys(naturalCells);
  const getNatural=(x,y,z)=>{
    if(!valid(x,y,z))fail('unsafe upper natural-source read');
    const k=key(x,y,z);
    if(natural.has(k))return natural.get(k);
    const value=source.naturalGet(x,y,z);
    if(!safe(value)||value<0||value>65534||source.validateId(value)!==value)
      fail('invalid original natural island material');
    return value;
  };
  const get=(x,y,z)=>{
    if(!valid(x,y,z))fail('unsafe upper physical read');
    const k=key(x,y,z);
    return authored.has(k)?authored.get(k):getNatural(x,y,z);
  };
  const rotationAt=(x,y,z)=>{
    if(!valid(x,y,z))fail('unsafe upper rotation read');
    const loc=key(x,y,z);
    if(authored.has(loc)||natural.has(loc))return orientations.get(loc)??0;
    const rotation=source.naturalRotationAt?.(x,y,z)??0;
    if(!safe(rotation)||rotation<0||rotation>3||
       (rotation!==0&&(!source.rotationAllowed||!source.rotationAllowed(getNatural(x,y,z)))))
      fail('unapproved original generated shape rotation');
    return rotation;
  };
  const assertFresh=()=>{
    if(!equals(identity,snapshotId(source))||readRevision(source)!==beforeRev)
      fail('ecology overlay stale after original world edit or generator switch');
    for(const [k,expected] of revisions)
      if(source.sectionRevision(k)!==expected)
        fail('ecology overlay stale after section mesh revision');
    return true;
  };
  return Object.freeze({naturalAt:getNatural,get,rotationAt,assertFresh,
    readCell:(x,y,z)=>Object.freeze({id:get(x,y,z),rotation:rotationAt(x,y,z),
      layer:authored.has(key(x,y,z))?'player':natural.has(key(x,y,z))?'ecology':'generator'}),
    copyPlayerEdits:()=>new Map(authored),copyPlayerRotations:()=>new Map(orientations),
    naturalCells,affectedSkyKeys:dirtyKeys,affectedGroundKeys:groundKeys,
    certifiedSkyKeys:certifiedKeys,
    identity,worldRevision:beforeRev,sourceOnly:true,
    metrics:Object.freeze({certifiedCells:natural.size,playerOverrides:authored.size,
      meshInvalidations:dirtyKeys.length,groundMeshInvalidations:groundKeys.length,
      worldWrites:0,groundSaveWrites:0,
      skySaveWrites:0,gpuUploads:0}),
    lightingPolicy:SKY_ISLAND_LIGHTING_POLICY});
}
