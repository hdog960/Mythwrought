// SNOW S4 DETACHED physical edge candidate review. READ ONLY, NOT A GENERATOR.
// No set(), save changes, terrain tint, edit deltas, or current M7 integration.
// These are possible physical-source REVIEW sites for a future NEW world profile,
// never authorizations to replace legacy grass or old source content.
const M7='mythwrought-five-surface-regions-v7';
const AIR=0,GRASS=1,DIRT=2,STONE=3,MAX_Y=19;
const SNOW_CAPS=new Set([272,276,279]);
const SOURCE_SOIL=new Set([GRASS,DIRT,STONE]);
const DIR=Object.freeze([[1,0],[-1,0],[0,1],[0,-1]].map(Object.freeze));
const key=(x,y,z)=>x+','+y+','+z;
const freeze=Object.freeze;
const valid=n=>Number.isSafeInteger(n)&&Math.abs(n)<=100000;
const reject=(row,reason)=>freeze({x:row.x,z:row.z,reason});
const smooth=t=>t*t*(3-2*t);
const clamp=n=>Math.max(0,Math.min(1,n));

/** Preview a bounded set of low-blend grass cells against actual original
 * M7 physical source. Caller supplies a previously reviewed S4 transition
 * report plus genuine terrainHeight, biomeAt, legacyNatural for original use.
 * The stand-alone mock tests only establish adapter properties.
 */
export function previewSnowS4PhysicalEdge(world,transition,{biomeAt,terrainHeight,
  legacyNatural}={}){
  if(world?.generationProfile?.generator!==M7||!(world.edits instanceof Map)||
    typeof world.get!=='function'||typeof world.save!=='function'||
    typeof world._columnPlan!=='function'||
    typeof world._environmentBaseline!=='function'||
    typeof world.environmentCaves?.get!=='function'||
    ![biomeAt,terrainHeight,legacyNatural].every(fn=>typeof fn==='function')||
    transition?.kind!=='detached-S4-original-M7-transition-hold-review'||
    transition.writerEnabled!==false||!Array.isArray(transition.cells)||
    !Number.isSafeInteger(transition.sampled)||transition.sampled<1||
    transition.sampled>128||transition.cells.length>transition.sampled)
    throw new TypeError('S4 exact original source and read-only transition proof required');
  let before;
  try{before=JSON.stringify(world.save());}
  catch{throw new TypeError('S4 schema-1 save reader unavailable')}
  const entries=transition.cells,requested=new Set();
  const footprint=new Map(),proposed=[],rejected=[];
  // Collect all relevant original column/voxel witnesses *before* callbacks.
  const column=(x,z)=>{
    const k=x+','+z;
    if(footprint.has(k))return footprint.get(k);
    if(!valid(x)||!valid(z))throw new RangeError('S4 source coordinate bounds');
    const plan=world._columnPlan(x,z);
    const old=terrainHeight(x,z,world.seed);
    if(!(plan instanceof Map)||plan.size>21||!Number.isSafeInteger(old)||
      old<2||old>12)throw new TypeError('S4 invalid original physical column');
    const top=plan.size?Math.max(...plan.keys()):old;
    if(!Number.isSafeInteger(top)||top>MAX_Y||top<2)
      throw new TypeError('S4 invalid original physical top');
    const rows=[];
    for(let y=Math.max(-3,old-2);y<=MAX_Y;y++){
      const cave=world.environmentCaves.get(x,y,z);
      rows.push([y,world.get(x,y,z),world._environmentBaseline(x,y,z),
        legacyNatural(x,y,z),cave===undefined?null:cave,
        world.edits.has(key(x,y,z))]);
    }
    const v=freeze({x,z,old,top,plan:freeze([...plan.entries()].sort((a,b)=>a[0]-b[0])
      .map(p=>freeze([...p]))),rows:freeze(rows.map(r=>freeze(r)))});
    footprint.set(k,v);return v;
  };
  const getRow=(col,y)=>col.rows.find(row=>row[0]===y);
  for(const row of entries){
    if(!valid(row?.x)||!valid(row?.z)||!Number.isSafeInteger(row.old)||
      requested.has(row.x+','+row.z)||row.authorizingTerrainWrites!==false)
      throw new TypeError('S4 forged or repeated transition input');
    requested.add(row.x+','+row.z);
    for(const [dx,dz] of [[0,0],...DIR])column(row.x+dx,row.z+dz);
  }
  const stable=()=>{
    for(const old of footprint.values()){
      const plan=world._columnPlan(old.x,old.z);
      const currentPlan=[...plan.entries()].sort((a,b)=>a[0]-b[0]);
      if(JSON.stringify(currentPlan)!==JSON.stringify(old.plan)||
        terrainHeight(old.x,old.z,world.seed)!==old.old)return false;
      for(const [y,block,baseline,legacy,cave,edit] of old.rows){
        const now=world.environmentCaves.get(old.x,y,old.z);
        if(world.get(old.x,y,old.z)!==block||
          world._environmentBaseline(old.x,y,old.z)!==baseline||
          legacyNatural(old.x,y,old.z)!==legacy||
          (now===undefined?null:now)!==cave||
          world.edits.has(key(old.x,y,old.z))!==edit)return false;
      }
    }
    return JSON.stringify(world.save())===before;
  };
  for(const row of entries){
    const climate=biomeAt(row.x,row.z,world.seed);
    if(climate?.name!=='snow'||!Number.isFinite(climate.weight)||
      climate.weight<0||climate.weight>1)
      throw new TypeError('S4 candidate no longer in a valid snow climate');
    const blend=smooth(clamp((climate.weight-.35)/.65));
    if(row.diagnosis!=='original-low-blend-without-shoulder'||
      !(blend<.065)||row.shoulder!==null||row.old!==column(row.x,row.z).old){
      rejected.push(reject(row,'not-original-low-blend-grass'));continue;
    }
    const center=column(row.x,row.z);
    const surface=getRow(center,center.old);
    if(center.plan.length||!surface||surface[1]!==GRASS||surface[5]||
      getRow(center,center.old-1)?.[1]===AIR){
      rejected.push(reject(row,'modified-or-unsupported-original-center'));continue;
    }
    let protectedCenter=false;
    for(const [y,,baseline,legacy,cave,edit] of center.rows){
      if(edit||cave!==null||y>center.old&&(baseline!==AIR||legacy!==AIR)||
        y<=center.old&&!SOURCE_SOIL.has(baseline)){
        protectedCenter=true;break;
      }
    }
    if(protectedCenter){rejected.push(reject(row,'protected-original-center'));continue;}
    let snowContacts=0,stopping=null;
    for(const [dx,dz] of DIR){
      const nx=row.x+dx,nz=row.z+dz;
      const climate=biomeAt(nx,nz,world.seed);
      if(climate?.name!=='snow'){stopping='other-biome-neighbor';break;}
      const n=column(nx,nz),top=getRow(n,n.top);
      if(!top||!n.plan.length||!SNOW_CAPS.has(top[1])||
        n.plan.find(([y])=>y===n.top)?.[1]!==top[1]){
        stopping='not-fully-authored-snow-neighbor';break;
      }
      if(Math.abs(n.top-center.old)>1){stopping='steep-natural-edge';break;}
      if(getRow(n,n.top-1)?.[1]===AIR||top[4]!==null||top[5]||
        getRow(n,n.top-1)?.[4]!==null||getRow(n,n.top-1)?.[5]){
        stopping='protected-or-unsupported-neighbor';break;
      }
      // Old trees and landmarks around this edge must not be hidden by any
      // proposed visual/physical snow surface. All source above top stays AIR.
      if(n.rows.some(([y,,baseline,legacy,cave,edit])=>
        y>n.top&&(baseline!==AIR||legacy!==AIR||cave!==null||edit))){
        stopping='historical-overhead-neighbor';break;
      }
      snowContacts++;
    }
    if(stopping){rejected.push(reject(row,stopping));continue;}
    if(snowContacts!==4){rejected.push(reject(row,'incomplete-snow-surround'));continue;}
    // This certificate can be used for source review ONLY; no world.set,
    // output mutation, or absolute permission to replace old grass is given.
    proposed.push(freeze({x:row.x,z:row.z,oldTop:center.old,
      surroundingAuthoredSnow:4,proposedCapReference:272,
      originalLowBlend:true,sourceProtected:false,
      futureProfileReviewOnly:true,authorizingTerrainWrites:false}));
  }
  if(!stable())throw new Error('S4 original source or schema-1 save changed during review');
  return freeze({kind:'detached-S4-physical-snow-edge-source-preview',
    examined:entries.length,proposed:freeze(proposed),rejected:freeze(rejected),
    sourceFootprintColumns:footprint.size,originalSourceUnchanged:true,
    notCurrentM7:true,writerEnabled:false,
    originalWorldAndIPhoneAccepted:false});
}
