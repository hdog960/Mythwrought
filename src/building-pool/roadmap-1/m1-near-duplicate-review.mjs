// Reviewer aid only, not a substitute for creator-approved architectural identity.
// Material-agnostic and size-normalized spatial relationship fingerprints.
const cell=(n,extent)=>Math.max(0,Math.min(11,Math.floor((n+.5)*12/extent)));
export function normalizedArchitectureCells(b){
 const {width:w,height:h,depth:d}=b.footprint;
 const set=new Set();
 const roleType={wall:'envelope',partition:'partition',roof:'roof',door:'door',window:'window',support:'support',furnishing:'furnishing',decoration:'feature'};
 for(const p of b.placements){
  const role=roleType[p.role];if(!role)continue;
  const [x,y,z]=p.at;
  if(role==='roof')set.add(role+':'+cell(x,w)+':'+cell(z,d)+':'+Math.min(5,Math.floor(y*6/h)));
  else if(y<=2 || p.roofFrame)set.add(role+':'+cell(x,w)+':'+cell(z,d));
 }
 for(const r of b.rooms){
  const [xmin,,zmin]=r.min,[xmax,,zmax]=r.max;
  // Quantized room outlines add spatial-program distinctions without labels or colors.
  for(let ix=xmin;ix<xmax;ix++){
   set.add('room:'+cell(ix,w)+':'+cell(zmin,d));
   set.add('room:'+cell(ix,w)+':'+cell(zmax-1,d));
  }
 }
 return set;
}
export function nearDuplicatePairs(blueprints,{category=null,limit=12}={}){
 if(!Array.isArray(blueprints)||!Number.isInteger(limit)||limit<1||limit>1000)throw new Error('invalid review request');
 const bs=category?blueprints.filter(b=>b.category===category):blueprints;
 const points=bs.map(b=>({id:b.id,category:b.category,size:b.size,biome:b.biome,hash:normalizedArchitectureCells(b)}));
 const pairs=[];
 for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++){
  const a=points[i],b=points[j];
  if(a.category!==b.category)continue; // Avoid comparing stables with houses as a design duplication.
  const matched=[...a.hash].filter(x=>b.hash.has(x)).length;
  const union=a.hash.size+b.hash.size-matched;
  pairs.push({a:a.id,b:b.id,similarity:Number((matched/Math.max(1,union)).toFixed(4)),sameSize:a.size===b.size,sameBiome:a.biome===b.biome});
 }
 pairs.sort((a,b)=>b.similarity-a.similarity||a.a.localeCompare(b.a)||a.b.localeCompare(b.b));
 return pairs.slice(0,limit);
}
