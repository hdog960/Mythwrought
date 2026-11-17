// Builder 4A M2 regional architecture — four individually authored 3D government/guild designs.
// Separate authored coordinate envelopes; shared deterministic compilation is NOT a random
// world generator. All source materials remain symbolic until physical family acceptance.
import {SCHEMA,validateBlueprint} from './schema.mjs';
const cell=(x,y,z)=>[x,y,z].join(',');
const tile=(x,z)=>x+','+z;
const pointIn=([x0,z0,x1,z1],x,z)=>x>=x0&&x<=x1&&z>=z0&&z<=z1;
const ROOF={'snow':'pack3:025','enchanted-forest':'pack3:026','desert':'pack3:024','mountain':'pack3:025'};
const FAMILY=Object.freeze({
 'pack1:002':{state:'candidate',intendedShape:'single-cell',orientation:'fixed',attachment:'none',
   unresolved:['physical masonry load/neighbor-face joinery','real candidate collision/selection in game']},
 'pack2:015':{state:'candidate',intendedShape:'partial',orientation:'rotatable',attachment:'floor',
   unresolved:['real furniture occupied volume and mounting','schema-1 saved orientation compatibility']},
 'pack3:024':{state:'candidate',intendedShape:'partial',orientation:'rotatable',attachment:'adjacent',
   unresolved:['wind/debris roof tile attachment and pitch/joinery']},
 'pack3:025':{state:'candidate',intendedShape:'partial',orientation:'rotatable',attachment:'adjacent',
   unresolved:['snow/drift loading, ridge joints and roof pitch orientation']},
 'pack3:026':{state:'candidate',intendedShape:'partial',orientation:'rotatable',attachment:'adjacent',
   unresolved:['forest canopy moisture/weather seal and architectural timber mounting']},
 'pack4:030':{state:'candidate',intendedShape:'partial',orientation:'rotatable',attachment:'wall',
   unresolved:['real glass pane wall offset, translucency sorting and yaw save']},
});
const PLANS=[
 {
  id:'r4:civic-hall:snow:medium:02',type:'civic-hall',biome:'snow',size:'medium',variant:2,
  bounds:[38,10,33],profile:'snow-triple-apsed-records-house',
  wings:[[6,7,30,27],[2,12,7,21],[30,13,35,22]],
  notches:[[6,7,9,10],[27,7,30,10],[6,25,8,27],[28,25,30,27]],
  entry:[17,7],porch:[15,3,20,6],
  partitions:[{axis:'x',fixed:23,from:12,to:23,door:18,facing:'east'},
              {axis:'x',fixed:10,from:12,to:22,door:18,facing:'west'}],
  windows:[[11,7,'south'],[26,7,'south'],[2,16,'west'],[35,17,'east'],
           [12,27,'north'],[25,27,'north']],
  fixtures:[[14,16],[18,20],[28,17],[32,19],[7,18]],
  ridges:[[15,12,19,23],[5,15,7,19]],
  rooms:[{id:'winter-council-hearth',kind:'meeting',rect:[12,12,21,22]},
         {id:'snow-sealed-records-office',kind:'administration',rect:[25,14,33,21]},
         {id:'civil-petition-side-nave',kind:'petition-aisle',rect:[3,14,9,20]}],
  signature:['T-apse-three-wing',38,33,'side-apses','covered-northern-records','double-spine-ridge']
 },
 {
  id:'r4:guildhall:enchanted-forest:medium:01',type:'guildhall',biome:'enchanted-forest',size:'medium',variant:1,
  bounds:[40,10,34],profile:'forest-twin-octagonal-lodges-glass-link',
  wings:[],notches:[],entry:[12,6],porch:[9,3,15,5],
  // The two unequal cut-corner rotundas and slender bridge are original coordinate conditions.
  octagons:[[12,16,10,15],[29,17,8,12]],
  bridge:[19,14,23,20],
  partitions:[{axis:'x',fixed:21,from:14,to:20,door:17,facing:'east'}],
  windows:[[2,16,'west'],[37,17,'east'],[29,25,'north'],[29,9,'south'],
           [12,26,'north'],[3,10,'west']],
  fixtures:[[9,15],[15,20],[29,18],[33,22],[12,10]],
  ridges:[[10,13,14,20],[27,14,31,21]],
  rooms:[{id:'woodland-members-roundtable',kind:'gathering-hall',rect:[7,12,16,21]},
         {id:'enchanted-shared-workrooms',kind:'shared-facility',rect:[25,12,34,22]},
         {id:'glass-link-ledger-bay',kind:'records-bridge',rect:[19,15,23,19]}],
  signature:['twin-unequal-octagon',40,34,'narrow-link','roundtable','faceted-work-rotunda']
 },
 {
  id:'r4:guildhall:desert:small:01',type:'guildhall',biome:'desert',size:'small',variant:1,
  bounds:[29,9,26],profile:'desert-stepped-caravan-artisan-complex',
  wings:[[3,5,15,18],[14,10,25,22],[9,19,17,24]],notches:[],
  entry:[9,5],porch:[7,2,12,4],
  partitions:[{axis:'x',fixed:16,from:11,to:18,door:15,facing:'east'},
              {axis:'z',fixed:19,from:10,to:17,door:14,facing:'north'}],
  windows:[[3,12,'west'],[5,5,'south'],[13,5,'south'],
           [25,16,'east'],[14,24,'north'],[23,22,'north']],
  fixtures:[[8,11],[11,15],[21,15],[23,20],[12,22]],
  ridges:[[7,9,10,14],[19,14,22,19]],
  rooms:[{id:'caravan-guild-reception',kind:'gathering-hall',rect:[6,10,13,17]},
         {id:'dune-artisan-sheltered-workshop',kind:'shared-facility',rect:[19,12,24,20]},
         {id:'caravan-work-ledger-recess',kind:'guild-ledger',rect:[10,20,16,23]}],
  signature:['offset-stepped-three-bars',29,26,'travel-nave','east-craft-terrace','rear-ledger-fin']
 },
 {
  id:'r4:civic-hall:mountain:medium:02',type:'civic-hall',biome:'mountain',size:'medium',variant:2,
  bounds:[41,10,36],profile:'mountain-long-spine-two-terrace-offices',
  wings:[[16,5,25,31],[5,13,16,27],[25,10,36,21],[11,27,30,33]],notches:[],
  entry:[20,5],porch:[17,2,23,4],
  partitions:[{axis:'x',fixed:16,from:13,to:26,door:19,facing:'west'},
              {axis:'x',fixed:25,from:10,to:21,door:15,facing:'east'},
              {axis:'z',fixed:27,from:17,to:24,door:20,facing:'north'}],
  windows:[[5,20,'west'],[36,15,'east'],[20,33,'north'],
           [18,5,'south'],[23,5,'south'],[12,33,'north']],
  fixtures:[[10,19],[30,16],[20,20],[20,30],[22,11]],
  ridges:[[19,13,22,23],[30,13,31,17]],
  rooms:[{id:'ridge-council-long-chamber',kind:'meeting',rect:[17,10,24,24]},
         {id:'west-records-clerks-office',kind:'administration',rect:[7,16,14,25]},
         {id:'east-public-tally-gallery',kind:'public-ledger-hall',rect:[27,12,34,20]},
         {id:'upper-seal-archive-aisle',kind:'sealed-archive-aisle',rect:[13,28,27,32]}],
  signature:['spine-with-two-offset-terraces',41,36,'crossbar-archive','separate-wing-offices','ridge-purlins']
 }
];
const VALID_IDS=new Set(PLANS.map(p=>p.id));
function author(spec){
 const [width,height,depth]=spec.bounds;
 const ground=new Set();
 const within=(r,x,z)=>pointIn(r,x,z);
 for(let z=0;z<depth;z++)for(let x=0;x<width;x++){
  const regular=spec.wings.some(r=>within(r,x,z));
  const faceted=(spec.octagons??[]).some(([cx,cz,radius,diagonal])=>
   Math.abs(x-cx)<=radius&&Math.abs(z-cz)<=radius&&Math.abs(x-cx)+Math.abs(z-cz)<=diagonal);
  if((regular||faceted||(spec.bridge&&within(spec.bridge,x,z)))&&
     !spec.notches.some(r=>within(r,x,z)))ground.add(tile(x,z));
 }
 const occupied=new Map(),openings=[];
 const has=(x,z)=>ground.has(tile(x,z));
 function set(x,y,z,role,asset='base:stone',facing='north',replace=false){
  if(![x,y,z].every(Number.isSafeInteger)||x<0||x>=width||y<0||y>=height||z<0||z>=depth)
   throw Error('Invalid authored '+spec.id+' coordinate '+cell(x,y,z));
  const k=cell(x,y,z);
  if(occupied.has(k)&&!replace)throw Error('M2 overlapping occupied source cell '+spec.id+' '+k);
  occupied.set(k,{at:[x,y,z],role,asset,facing});
 }
 const erase=(x,y,z)=>occupied.delete(cell(x,y,z));
 const baseMaterial=spec.type==='guildhall'?'base:wood':'base:stone';
 const regionalRoof=ROOF[spec.biome];
 for(const key of ground){
  const [x,z]=key.split(',').map(Number);
  set(x,0,z,'floor',baseMaterial);
  set(x,5,z,'roof',regionalRoof);
  const edge=[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dz])=>!has(x+dx,z+dz));
  if(edge)for(let y=1;y<=4;y++)set(x,y,z,'wall',spec.type==='guildhall'?'base:wood':'pack1:002');
 }
 // Distinct, reserved exterior approach: no duplicate wing/porch occupation.
 const [left,front,right,back]=spec.porch;
 for(let z=front;z<=back;z++)for(let x=left;x<=right;x++){
  if(has(x,z))throw Error('Authored porch intersects existing building '+spec.id+' '+tile(x,z));
  set(x,0,z,'floor','base:stone');
  set(x,5,z,'roof',regionalRoof);
  if(x===left||x===right||z===front||z===back)set(x,4,z,'beam','base:wood');
 }
 for(const x of [left,right])for(const z of [front,back])
  for(let y=1;y<=3;y++)set(x,y,z,'column','base:wood');
 // Face-integral purlin lattice: open 2-high rooms, all normal roof tiles
 // within at most 1 orthogonal step of an actual timber beam / wall below.
 for(const key of ground){
  const [x,z]=key.split(',').map(Number);
  if(!occupied.has(cell(x,4,z))&&(x%3===0||z%3===0))set(x,4,z,'beam','base:wood');
 }
 for(const [x0,z0,x1,z1] of spec.ridges)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  if(!has(x,z))throw Error('Raised authored regional ridge extends outside floor '+spec.id+' '+tile(x,z));
  if(occupied.get(cell(x,5,z))?.role!=='roof')throw Error('Raised ridge missing base roof');
  set(x,5,z,'beam','base:wood','north',true);
  if(!occupied.has(cell(x,4,z)))set(x,4,z,'beam','base:wood');
  set(x,6,z,'roof',regionalRoof);
 }
 for(const wall of spec.partitions){
  for(let i=wall.from;i<=wall.to;i++){
   const x=wall.axis==='x'?wall.fixed:i,z=wall.axis==='z'?wall.fixed:i;
   if(!has(x,z))throw Error('Source partition outside occupancy '+spec.id+' '+tile(x,z));
   const edge=occupied.get(cell(x,1,z));
   if(edge)throw Error('Source partition overlaps external masonry '+spec.id+' '+tile(x,z));
   if(i===wall.door){set(x,3,z,'beam','base:wood');continue;}
   for(let y=1;y<=3;y++)set(x,y,z,'partition',spec.type==='guildhall'?'base:wood':'pack1:002',wall.facing);
  }
  openings.push({at:wall.axis==='x'?[wall.fixed,1,wall.door]:[wall.door,1,wall.fixed],
    kind:'door',facing:wall.facing});
 }
 const [entryX,entryZ]=spec.entry;
 if(entryZ!==back+1)throw Error('Portico does not directly connect to actual entrance');
 for(let x=entryX-1;x<=entryX+1;x++)for(let y=1;y<=2;y++){
  if(occupied.get(cell(x,y,entryZ))?.role!=='wall')
   throw Error('Formal entry does not pierce a real exterior wall '+spec.id+' '+tile(x,entryZ));
  erase(x,y,entryZ);
 }
 openings.push({at:[entryX,1,entryZ],kind:'entrance',facing:'south'});
 for(const [x,z,facing] of spec.windows){
  if(occupied.get(cell(x,2,z))?.role!=='wall')
   throw Error('Window not in exterior load-bearing wall '+spec.id+' '+tile(x,z));
  set(x,2,z,'window','pack4:030',facing,true);
  openings.push({at:[x,2,z],kind:'window',facing});
 }
 for(const [x,z] of spec.fixtures){
  if(!has(x,z)||occupied.has(cell(x,1,z)))throw Error('Authored fixture lacks usable floor '+spec.id+' '+tile(x,z));
  set(x,1,z,'fixture','pack2:015');
 }
 const navigation=new Map();
 for(const c of occupied.values())if(c.role==='floor'&&c.at[1]===0){
  const [x,,z]=c.at;
  if(!occupied.has(cell(x,1,z))&&!occupied.has(cell(x,2,z)))
   navigation.set(cell(x,1,z),{at:[x,1,z],mode:'walk'});
 }
 const spaces=[];const seenSpaceTiles=new Set();
 for(const r of spec.rooms){
  const floor=[...navigation.values()].filter(n=>within(r.rect,n.at[0],n.at[2])).map(n=>[n.at[0],n.at[2]]);
  if(floor.length<12)throw Error('Under-authored room '+spec.id+' '+r.id);
  const present=new Set(floor.map(([x,z])=>tile(x,z))),visited=new Set([tile(...floor[0])]),q=[floor[0]];
  for(let i=0;i<q.length;i++){
   const [x,z]=q[i];
   for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
    const k=tile(x+dx,z+dz);
    if(present.has(k)&&!visited.has(k)){visited.add(k);q.push([x+dx,z+dz]);}
   }
  }
  if(visited.size!==present.size)throw Error('Authored room has disconnected floor islands '+spec.id+' '+r.id);
  for(const point of floor){
   const k=tile(...point);
   if(seenSpaceTiles.has(k))throw Error('Two authored public rooms overlap '+spec.id+' '+k);
   seenSpaceTiles.add(k);
  }
  const [accessX,accessZ]=floor[Math.floor(floor.length/2)];
  spaces.push({id:r.id,kind:r.kind,level:1,access:[accessX,1,accessZ],footprint:floor});
 }
 const cells=[...occupied.values()];
 const references=[...new Set(cells.map(c=>c.asset).filter(s=>s.startsWith('pack')))].sort();
 const dependencies=references.map(ref=>{
  if(!FAMILY[ref])throw Error('Unknown material family '+ref);
  return {ref,...FAMILY[ref]};
 });
 const result={schema:SCHEMA,id:spec.id,type:spec.type,biome:spec.biome,size:spec.size,
  variant:spec.variant,bounds:spec.bounds,cells,navigation:[...navigation.values()],spaces,openings,dependencies,
  architecturalNotes:{style:spec.profile,storyCount:1,structuralSignature:spec.signature,
   roof:'actual exposed partial-family roof candidate with direct raised-ridge beams and timber purlin lattice',
   circulation:'source occupied-cell navigation graph, not path tags',
   creatorAccepted:false,liveIntegrated:false,worldPlacement:false,physicalIphoneTested:false}
 };
 validateBlueprint(result);
 return result;
}
export function buildM2Regional(id){
 if(!VALID_IDS.has(id))throw RangeError('Unknown distinctly authored 4A regional plan '+id);
 return author(PLANS.find(p=>p.id===id));
}
export function allM2Regional(){return PLANS.map(author);}
export const M2_REGIONAL_IDS=Object.freeze(PLANS.map(p=>p.id));
