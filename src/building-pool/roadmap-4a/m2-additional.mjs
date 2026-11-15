// Builder 4A M2 additional original coordinates, independently authored public plans.
// No biome seed, random massing, mirror/color reuse, runtime writer, persistent IDs or saves.
// Desert civic: courtyard with two court offices and flared roofed entry; mountain guild:
// cruciform meeting hall with north ledger arm, broad west wing and east shared workshop.
import {SCHEMA,validateBlueprint} from './schema.mjs';
const keyed=(x,y,z)=>x+','+y+','+z;
const spot=(x,z)=>x+','+z;
const REF={
 'pack1:002':{state:'candidate',intendedShape:'single-cell',orientation:'fixed',attachment:'none',
   unresolved:['real masonry ABI, load-bearing capacity, damage-state save compatibility']},
 'pack2:015':{state:'candidate',intendedShape:'partial',orientation:'rotatable',attachment:'floor',
   unresolved:['furniture source-collision, footprint and floor-support attachment']},
 'pack3:024':{state:'candidate',intendedShape:'partial',orientation:'rotatable',attachment:'adjacent',
   unresolved:['desert roof/water seam, ridge orientation, exposed tiles and wind load']},
 'pack3:025':{state:'candidate',intendedShape:'partial',orientation:'rotatable',attachment:'adjacent',
   unresolved:['mountain roof snow-load, ridge orientation and retained height limit']},
 'pack4:030':{state:'candidate',intendedShape:'partial',orientation:'rotatable',attachment:'wall',
   unresolved:['pane thickness and wall-mount clearance, source transparency order']}
};
const inside=(rect,x,z)=>x>=rect[0]&&x<=rect[2]&&z>=rect[1]&&z<=rect[3];
const within=(rects,x,z)=>rects.some(r=>inside(r,x,z));

function paint(spec){
 const [w,h,d]=spec.bounds;
 const tiles=new Set();
 for(let z=0;z<d;z++)for(let x=0;x<w;x++)
  if(within(spec.wings,x,z)&&!within(spec.notches,x,z))tiles.add(spot(x,z));
 const has=(x,z)=>tiles.has(spot(x,z));
 const volume=new Map(),openings=[];
 function put(x,y,z,role,asset='base:stone',facing='north',overwrite=false){
  if(![x,y,z].every(Number.isSafeInteger)||x<0||x>=w||y<0||y>=h||z<0||z>=d)
   throw Error('outside explicitly authored M2 occupied 3D coordinate '+keyed(x,y,z));
  const k=keyed(x,y,z);
  if(volume.has(k)&&!overwrite)throw Error('M2 occupied-cell collision '+k);
  volume.set(k,{at:[x,y,z],role,asset,facing});
 }
 const erase=(x,y,z)=>volume.delete(keyed(x,y,z));
 for(const key of tiles){
  const [x,z]=key.split(',').map(Number);
  put(x,0,z,'floor',spec.floor);
  if(!within(spec.court,x,z))put(x,5,z,'roof',spec.roof);
  if([[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dz])=>!has(x+dx,z+dz)))
   for(let y=1;y<=4;y++)put(x,y,z,'wall',spec.wall);
 }
 // Public ground-level stone approach and real column-supported portico, free at y=1..2.
 for(let x=spec.porch[0];x<=spec.porch[2];x++)
  for(let z=spec.porch[1];z<=spec.porch[3];z++){
   if(has(x,z))throw Error('Portico overlaps main authored wing footprint');
   put(x,0,z,'floor',spec.floor);
   put(x,5,z,'roof',spec.roof);
   if(x===spec.porch[0]||x===spec.porch[2]||z===spec.porch[1]||z===spec.porch[3])
    put(x,4,z,'beam','base:wood');
  }
 for(const x of [spec.porch[0],spec.porch[2]])for(const z of [spec.porch[1],spec.porch[3]])
  for(let y=1;y<=3;y++)put(x,y,z,'column','base:wood');
 // Actual rafters and roof-spanning timber, never walls filling entire attics.
 for(const key of tiles){
  const [x,z]=key.split(',').map(Number);
  if(within(spec.court,x,z))continue;
  if(!volume.has(keyed(x,4,z))&&(x%3===0||z%4===0))
   put(x,4,z,'beam','base:wood');
 }
 // Variant-specific upper silhouettes use genuine beam below every raised tile.
 for(const rect of spec.ridges)for(let x=rect[0];x<=rect[2];x++)
  for(let z=rect[1];z<=rect[3];z++){
   if(!has(x,z)||within(spec.court,x,z))
    throw Error('M2 ridge not source-supported above footprint '+spot(x,z));
   const here=volume.get(keyed(x,5,z));
   if(!here||here.role!=='roof')throw Error('Raised ridge had no starting regional tile');
   put(x,5,z,'beam','base:wood','north',true);
   if(!volume.has(keyed(x,4,z)))put(x,4,z,'beam','base:wood');
   put(x,6,z,'roof',spec.roof);
  }
 // Inner walls and properly open, two-high office/work doors.
 for(const part of spec.partitions){
  for(let i=part.from;i<=part.to;i++){
   const x=part.axis==='x'?part.fixed:i,z=part.axis==='z'?part.fixed:i;
   if(!has(x,z))throw Error('Partition unsupported by the authored floor');
   if(!volume.has(keyed(x,1,z)))
    for(let y=1;y<=3;y++)
     if(!(i===part.door&&y<=2))put(x,y,z,'partition',spec.wall,part.facing);
   else if(i!==part.door)throw Error('Unexpected exterior wall in interior partition');
  }
  const door=part.axis==='x'?[part.fixed,1,part.door]:[part.door,1,part.fixed];
  openings.push({at:door,kind:'door',facing:part.facing});
 }
 // The formal doorway must genuinely exist in an exterior perimeter wall.
 for(let x=spec.entry.x-1;x<=spec.entry.x+1;x++)for(let y=1;y<=2;y++){
  if(volume.get(keyed(x,y,spec.entry.z))?.role!=='wall')
   throw Error('Front doorway is not properly cut out of the exterior wall');
  erase(x,y,spec.entry.z);
 }
 openings.push({at:[spec.entry.x,1,spec.entry.z],kind:'entrance',facing:'south'});
 for(const [x,z,facing] of spec.windows){
  const wall=volume.get(keyed(x,2,z));
  if(wall?.role!=='wall')throw Error('Window is not mounted on an actual exterior wall '+spot(x,z));
  put(x,2,z,'window','pack4:030',facing,true);
  openings.push({at:[x,2,z],kind:'window',facing});
 }
 for(const [x,z] of spec.furniture){
  if(!has(x,z)||volume.has(keyed(x,1,z)))throw Error('Explicit fixture lacks supported floor/walk-clearance '+spot(x,z));
  put(x,1,z,'fixture','pack2:015');
 }
 // Authored coordinates define the navigation graph; no fictional teleport path.
 const route=new Map();
 for(const c of volume.values()){
  if(c.role!=='floor'||c.at[1]!==0)continue;
  const [x,,z]=c.at;
  if(!volume.has(keyed(x,1,z))&&!volume.has(keyed(x,2,z)))
   route.set(keyed(x,1,z),{at:[x,1,z],mode:'walk'});
 }
 const rooms=[];
 for(const r of spec.rooms){
  const cells=[...route.values()].filter(n=>inside(r.rect,n.at[0],n.at[2])).map(n=>[n.at[0],n.at[2]]);
  if(cells.length<12)throw Error('Authored functional room is too small '+r.name);
  const positions=new Set(cells.map(a=>spot(...a)));
  const seen=new Set([spot(...cells[0])]),stack=[cells[0]];
  while(stack.length){
   const [x,z]=stack.pop();
   for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
    const k=spot(x+dx,z+dz);
    if(positions.has(k)&&!seen.has(k)){seen.add(k);stack.push([x+dx,z+dz]);}
   }
  }
  if(seen.size!==positions.size)throw Error('Authored room footprint has disconnected islands '+r.name);
  const chosen=cells[Math.floor(cells.length/2)];
  rooms.push({id:r.name,kind:r.kind,level:1,access:[chosen[0],1,chosen[1]],footprint:cells});
 }
 const materialIds=[...new Set([...volume.values()].map(c=>c.asset).filter(a=>a.startsWith('pack')))].sort();
 const dependencies=materialIds.map(ref=>{
  if(!REF[ref])throw Error('Unrecorded original authored family '+ref);
  return {ref,...REF[ref]};
 });
 const result={
  schema:SCHEMA,id:spec.id,type:spec.type,biome:spec.biome,size:spec.size,variant:spec.variant,
  bounds:spec.bounds,cells:[...volume.values()],openings,spaces:rooms,
  navigation:[...route.values()],dependencies,
  architecturalNotes:{storyCount:1,style:spec.style,structuralSignature:spec.signature,
   courtyard:spec.court.length>0,roofBearing:'light purlins + exterior masonry + direct upper beam under every raised roof',
   twoHighWalks:true,creatorAccepted:false,productionIntegration:false,worldPlacement:false}
 };
 validateBlueprint(result);
 return result;
}
function desertCouncil(){
 // Three-sided shaded civic forum with an open sky-lit court and two formal office wings.
 return paint({
  id:'r4:civic-hall:desert:medium:02',type:'civic-hall',biome:'desert',size:'medium',variant:2,
  bounds:[36,9,31],style:'desert-court-council-with-covered-flared-entry-and-two-record-wings',
  signature:['courtyard',36,31,'desert-two-sided-office-wings','split-north-gallery','double-raised-eaves'],
  wings:[[5,5,29,25]],
  notches:[[5,5,8,8],[26,5,29,8],[5,23,7,25],[27,23,29,25]],
  court:[[14,13,21,20]],
  porch:[14,2,20,4],entry:{x:17,z:5},floor:'base:stone',wall:'pack1:002',roof:'pack3:024',
  ridges:[[16,6,18,10],[16,22,18,24]],
  partitions:[
   {axis:'x',fixed:13,from:14,to:20,door:17,facing:'east'},
   {axis:'x',fixed:22,from:14,to:20,door:17,facing:'west'}
  ],
  windows:[[5,17,'west'],[29,16,'east'],[10,25,'north'],[25,25,'north'],[18,25,'north']],
  furniture:[[8,17],[10,20],[25,16],[27,19],[18,9]],
  rooms:[
   {name:'desert-public-hearing-chamber',kind:'meeting',rect:[6,12,12,22]},
   {name:'civic-clerks-and-sealed-records',kind:'administration',rect:[23,12,28,22]}
  ]
 });
}
function mountainGuild(){
 // Four-armed stone and timber seat: separate north records tower, west
 // members' chamber, eastern working shop and a sheltered southern entry nave.
 return paint({
  id:'r4:guildhall:mountain:small:01',type:'guildhall',biome:'mountain',size:'small',variant:1,
  bounds:[31,9,28],style:'mountain-cross-axial-guild-with-true-four-arm-structure',
  signature:['cruciform',31,28,'west-guild-meeting','east-tools-shop','north-ledger-belfry'],
  wings:[[10,9,19,18],[12,3,18,9],[3,11,10,20],[19,10,27,19],[12,18,17,25]],
  notches:[],court:[],
  porch:[13,1,17,2],entry:{x:15,z:3},floor:'base:stone',wall:'pack1:002',roof:'pack3:025',
  ridges:[[14,9,15,15],[13,20,16,24]],
  partitions:[{axis:'x',fixed:20,from:11,to:18,door:14,facing:'east'}],
  windows:[[3,14,'west'],[27,14,'east'],[14,25,'north'],[13,3,'south'],[17,3,'south']],
  furniture:[[6,16],[14,12],[23,13],[23,17]],
  rooms:[
   {name:'mountain-members-assembly',kind:'gathering-hall',rect:[12,6,17,13]},
   {name:'mountain-shared-artisan-workroom',kind:'shared-facility',rect:[21,11,26,17]}
  ]
 });
}
export function buildM2Additional(type){
 if(type==='civic-hall')return desertCouncil();
 if(type==='guildhall')return mountainGuild();
 throw RangeError('No authored 4A M2 expansion for '+type);
}
export function allM2Additional(){return [desertCouncil(),mountainGuild()];}
