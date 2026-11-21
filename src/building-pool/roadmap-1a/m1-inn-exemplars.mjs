// Builder 1A: independently authored 3D Temperate small inn. Candidate only.
import {SCHEMA,blueprintId,validateBlueprint} from './legacy-schema.mjs';
const FULL=Object.freeze({kind:'full-cell',bounds:[0,0,0,1,1,1]});
const symbol=asset=>({kind:'unresolved',bounds:null,reason:asset+' shape/rotation/support/save ABI needs final production acceptance'});
const key=at=>at.join(',');
export function getM1InnExemplars(){
 const width=17,depth=18,height=12,category='inn',biome='temperate',size='small',index=1;
 const cells=new Map(),reserved=new Set(),footprintReservations=[];
 function place(x,y,z,role,asset,orientation='north',extra={}){
  const at=[x,y,z],k=key(at);
  if(x<0||x>=width||y<0||y>=height||z<0||z>=depth||cells.has(k)||reserved.has(k))
   throw Error('Inn placement overlaps/escapes footprint '+k);
  cells.set(k,{at,role,asset,orientation,occupancy:asset.startsWith('live:')?FULL:symbol(asset),...extra});
 }
 function gap(x,z){for(const y of [1,2])cells.delete(key([x,y,z]));}
 const wall=(x,y,z,role='wall')=>place(x,y,z,role,'pack2:013');
 for(let x=0;x<width;x++)for(let z=0;z<depth;z++)place(x,0,z,'foundation','live:stone');
 for(let y=1;y<=4;y++){
  for(let x=1;x<width-1;x++)for(const z of [1,depth-2])wall(x,y,z);
  for(let z=2;z<depth-2;z++)for(const x of [1,width-2])wall(x,y,z);
 }
 // True central corridor, with two separately accessed public rooms up front
 // and two independently entered guestrooms behind physical partitions.
 for(let y=1;y<=3;y++){
  for(let z=2;z<=15;z++)for(const x of [6,10])wall(x,y,z,'partition');
  for(let x=2;x<=5;x++)wall(x,y,8,'partition');
  for(let x=11;x<=14;x++)wall(x,y,8,'partition');
 }
 gap(8,1);
 for(const [x,z] of [[6,4],[10,4],[6,12],[10,12]])gap(x,z);
 for(const [x,z,facing] of [[3,1,'north'],[13,1,'north'],[1,6,'west'],[15,6,'east'],[1,12,'west'],[15,12,'east'],[4,16,'south'],[12,16,'south']]){
  cells.delete(key([x,2,z]));
  place(x,2,z,'window','pack4:030',facing,{mount:'perimeter-opening',paneSealed:false});
 }
 // Door leaves are explicitly stowed in physical side-jamb cells, never filling
 // their own two-high circulation portal. Actual hinge sweep remains unresolved.
 for(const [openingX,openingZ,x,z,yaw] of [[8,1,7,1,'north'],[6,4,6,3,'east'],[10,4,10,3,'west'],[6,12,6,11,'east'],[10,12,10,11,'west']]){
  const k=key([x,1,z]);if(!cells.has(k))throw Error('Missing side jamb '+k);
  cells.delete(k);place(x,1,z,'door','pack2:020',yaw,{doorState:'open-stowed',mount:[openingX,openingZ],sweptClearanceCertified:false});
 }
 const fixtures=[
  [3,1,3,'pack4:059','reception','north'],
  [4,1,5,'pack4:057','reception','east'],
  [13,1,3,'pack4:064','common-room','north'],
  [12,1,5,'pack4:058','common-room','west'],
  [13,1,6,'pack4:059','common-room','north'],
  [3,1,11,'pack5:082','guest-west','north'],
  [12,1,11,'pack5:082','guest-east','north'],
  [4,1,14,'pack4:059','guest-west','east'],
  [13,1,14,'pack4:059','guest-east','west']
 ];
 for(const [x,y,z,asset,room,orientation] of fixtures){
  place(x,y,z,'furnishing',asset,orientation,{room,variant:asset==='pack5:082'?'wanderer-quilt':null});
  if(asset==='pack5:082'){
   const foot=[x,y,z+1];
   if(cells.has(key(foot))||reserved.has(key(foot)))throw Error('Overlapping Inn two-cell bed');
   reserved.add(key(foot));
   footprintReservations.push({asset,anchor:[x,y,z],extraCells:[foot],source:'pack5:082-source-two-cell-footprint',approval:'unresolved'});
  }
 }
 // Authored full-voxel ceiling/weather backing; it is NOT roof load certification.
 for(let x=0;x<width;x++)for(let z=0;z<depth;z++)if(!cells.has(key([x,4,z])))
  place(x,4,z,'support','live:wood','north',{roofBacking:true});
 const roofY=x=>5+Math.min(2,Math.floor(Math.min(x,width-1-x)/3));
 for(let x=0;x<width;x++)for(let z=0;z<depth;z++){
  const y=roofY(x);
  for(let u=5;u<y;u++)place(x,u,z,'support','live:wood','north',{roofRiser:'full-cell'});
  place(x,y,z,'roof','pack3:023','north',{surface:'stepped-gable',weatherSealApproved:false});
 }
 for(const x of [5,11])for(let y=1;y<=3;y++)
  place(x,y,0,'support','pack2:022','north',{supportSpanApproved:false,porch:true});
 const rooms=[
  {id:'hallway',min:[7,1,2],max:[10,4,16]},
  {id:'reception',min:[2,1,2],max:[6,4,8]},
  {id:'common-room',min:[11,1,2],max:[15,4,8]},
  {id:'guest-west',min:[2,1,9],max:[6,4,16]},
  {id:'guest-east',min:[11,1,9],max:[15,4,16]}
 ];
 const portals=[
  {from:'outside',to:'hallway',at:[8,1,1],passable:true,opening:'hinged-leaf'},
  {from:'hallway',to:'reception',at:[6,1,4],passable:true,opening:'hinged-leaf'},
  {from:'hallway',to:'common-room',at:[10,1,4],passable:true,opening:'hinged-leaf'},
  {from:'hallway',to:'guest-west',at:[6,1,12],passable:true,opening:'hinged-leaf'},
  {from:'hallway',to:'guest-east',at:[10,1,12],passable:true,opening:'hinged-leaf'}
 ];
 const walkable=[];
 for(let x=2;x<=14;x++)for(let z=2;z<=15;z++)
  if(!cells.has(key([x,1,z]))&&!cells.has(key([x,2,z]))&&!reserved.has(key([x,1,z])))
   walkable.push([x,1,z]);
 walkable.push([8,1,0],[8,1,1]);
 const dependencies=[...new Set([...cells.values()].filter(p=>p.occupancy.kind==='unresolved').map(p=>p.asset))].sort()
  .map(asset=>({asset,status:'unresolved',requires:[
   'source-authentic physical AABBs, explicit variants and orientation',
   'floor/wall mounting, door swept-volume and span/bearing acceptance',
   'roof/glass weather seal, save-state rotation and later central integration'
  ]}));
 const blueprint={schema:SCHEMA,id:blueprintId(category,biome,size,index),category,biome,size,index,status:'candidate',
  title:"Wayfarer's Lantern Inn",frame:'local-x-east-y-up-z-south',
  footprint:{width,height,depth},architecturalIdentity:{
   plan:'central-hall-four-independent-side-rooms',entrance:[8,1,1],
   guestRooms:['guest-west','guest-east'],reception:'reception',commons:'common-room',
   roof:'backed-stepped-gable',roofWeatherSealApproved:false,verticalLevels:1,stairsRequired:false,
   bedAnchors:footprintReservations.map(r=>r.anchor),constructionLoadApproved:false
  },
  worldPlacement:false,liveIntegration:false,placements:[...cells.values()],rooms,portals,walkable,
  footprintReservations,dependencies};
 validateBlueprint(blueprint);
 return [blueprint];
}
