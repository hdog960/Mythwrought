// Isolated, deterministic island ecology admission. Does NOT write block voxels.
// Caller must supply a COMPLETE connected island's authenticated surface cells.
// World sampling, structural support, real physical clearance and biome assets
// remain owned by the future Codex generator / world runtime.
export const SKY_FLORA_MAX_SURFACE_CELLS=1024;
export const SKY_FLORA_MAX_PLACEMENTS=64;
const valid=n=>typeof n==='number'&&Number.isFinite(n);
const safe=n=>Number.isSafeInteger(n);
const fail=s=>{throw new TypeError('Sky flora: '+s);};
const roll=(seed,x,y,z,salt)=>{
  let h=Math.imul((seed|0)^salt,0x9e3779b1);
  for(const n of [x,y,z]){
    h^=Math.imul(n|0,0x85ebca6b);
    h^=Math.imul((Math.trunc(n/4294967296)|0),0xc2b2ae35);
    h=Math.imul(h^(h>>>16),0x27d4eb2d);
  }
  h^=h>>>15;h=Math.imul(h,0x85ebca6b);h^=h>>>13;
  return (h>>>0)/4294967296;
};
const sortXYZ=(a,b)=>a.x-b.x||a.z-b.z||a.y-b.y;
const rowKey=p=>p.x+','+p.y+','+p.z;
export function planSkyIslandVegetation({seed,surface,maxDecor=64,maxTrees=8}={}){
  if(!safe(seed)||!Array.isArray(surface)||surface.length>SKY_FLORA_MAX_SURFACE_CELLS||
     !safe(maxDecor)||maxDecor<0||maxDecor>SKY_FLORA_MAX_PLACEMENTS||
     !safe(maxTrees)||maxTrees<0||maxTrees>8)fail('bounded seed, island surface and quotas required');
  const seen=new Set(),eligible=[];
  for(const p of surface){
    if(!p||![p.x,p.y,p.z,p.clearance,p.slope].every(safe)||
       !valid(p.moisture)||p.moisture<0||p.moisture>1||
       !valid(p.fertility)||p.fertility<0||p.fertility>1||
       p.clearance<0||p.clearance>32||p.slope<0||p.slope>8||
       typeof p.supported!=='boolean'||typeof p.exposed!=='boolean')fail('invalid certified surface cell');
    const key=rowKey(p);
    if(seen.has(key))fail('duplicate surface cell');
    seen.add(key);
    if(!p.supported||!p.exposed||p.clearance<1)continue;
    eligible.push(p);
  }
  // Stable in every discovery/loading order as long as the authoritative
  // COMPLETE island surface is supplied. No RNG state or iteration side effects.
  eligible.sort(sortXYZ);
  const trees=[],placements=[],occupied=new Set();
  const treeCandidates=eligible.filter(p=>p.fertility>=.45&&p.moisture>=.20&&
      p.clearance>=7&&p.slope<=1&&roll(seed,p.x,p.y,p.z,101)<.24)
    .map(p=>({p,rank:roll(seed,p.x,p.y,p.z,102)}))
    .sort((a,b)=>a.rank-b.rank||sortXYZ(a.p,b.p));
  for(const {p} of treeCandidates){
    if(trees.length>=Math.min(maxTrees,maxDecor))break;
    if(trees.some(t=>(p.x-t.x)**2+(p.z-t.z)**2<36))continue;
    const kind=['windbent-pine','cloudleaf-tree','starbloom-tree'][
      Math.floor(roll(seed,p.x,p.y,p.z,103)*3)];
    trees.push(p);
    placements.push(Object.freeze({x:p.x,y:p.y+1,z:p.z,kind,group:'canopy'}));
    occupied.add(rowKey(p));
  }
  const lower=[];
  for(const p of eligible){
    if(occupied.has(rowKey(p)))continue;
    const r=roll(seed,p.x,p.y,p.z,201);
    let kind=null;
    if(p.slope<=1&&p.clearance>=3&&p.fertility>=.34&&r<.18)
      kind=p.moisture>.65?'fern-thicket':'blossom-shrub';
    else if(p.slope<=2&&p.clearance>=2&&p.moisture>.55&&r<.38)
      kind='glowmoss';
    else if(p.slope<=2&&p.fertility>=.25&&r<.53)
      kind=r<.28?'skybell-flowers':'windgrass-tuft';
    else if(p.slope<=2&&p.moisture>.22&&r<.68)
      kind='windgrass-tuft';
    if(kind)lower.push({p,kind,rank:roll(seed,p.x,p.y,p.z,202)});
  }
  lower.sort((a,b)=>a.rank-b.rank||sortXYZ(a.p,b.p));
  for(const {p,kind} of lower){
    if(placements.length>=maxDecor)break;
    placements.push(Object.freeze({x:p.x,y:p.y+1,z:p.z,kind,group:'ground-cover'}));
  }
  // Tiny fertile islands should not be naked rock solely from RNG bad luck.
  if(!placements.length&&maxDecor>0){
    const p=eligible.find(p=>p.fertility>=.25&&p.slope<=2);
    if(p)placements.push(Object.freeze({x:p.x,y:p.y+1,z:p.z,
      kind:'windgrass-tuft',group:'ground-cover'}));
  }
  placements.sort(sortXYZ);
  return Object.freeze({placements:Object.freeze(placements),treeCount:trees.length,
    candidateCount:eligible.length,sourceCells:surface.length,worldWrites:0});
}
