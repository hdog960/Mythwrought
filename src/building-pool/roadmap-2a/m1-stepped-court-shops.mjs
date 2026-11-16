// Builder 2A original M1 stepped-court tranche; conceptual source only.
// Six independent authored plan parameters and three physically cut exterior voids.
// Do not register, place, merge or alter any of the protected first 62 designs.
import {assembleSpecialistProfile} from './m1-specialist-exemplars.mjs';
import {author2AUProfile,carve2AUFootprint} from './m1-u-court-shops.mjs';
import {validateBlueprint} from './schema.mjs';

export const M1_STEPPED_COURT_SPECS=Object.freeze([
 {category:'general-store',biome:'snow',size:'large',variation:3,w:30,d:27,h:10,entry:14,left:9,right:19,depth:11,
  frontSide:'east',stepWidth:4,stepDepth:7,oppositeWidth:3,oppositeDepth:5,
  wall:'pack1:004',floor:'pack2:013',roof:'pack3:025',annex:'sled-inventory-wing',name:'Whitecap Three-Wing Exchange',
  masses:[[3,7,7,13,8,'snow-merchant-bell-tower'],[22,26,5,11,5,'raised-east-loggia'],[3,7,19,23,6,'rear-ledger-snow-hip']],
  gables:[['front',8,21,7],['rear',3,8,6]],
  furniture:[[23,4,'pack5:086','exchange-counter','ledger-service'],[19,9,'pack5:087','goods','curio-arcade'],[3,9,'pack5:091','tally','cartographers-oak-desk'],[25,24,'pack4:057','winter-stock',null]]},
 {category:'pet-shop',biome:'enchanted-forest',size:'medium',variation:2,w:24,d:25,h:8,entry:12,left:8,right:15,depth:10,
  frontSide:'west',stepWidth:4,stepDepth:6,oppositeWidth:3,oppositeDepth:4,
  wall:'pack5:079',floor:'pack2:013',roof:'pack3:026',annex:'empty-bedding-store',name:'Fernwhistle Twin-Court Supply',
  masses:[[4,7,8,13,7,'livingwood-open-display-shoulder'],[17,20,5,10,4,'forest-market-gallery'],[2,6,18,21,5,'tall-feed-hall']],
  gables:[['front',7,16,6]],
  furniture:[[18,4,'pack5:086','merchant-counter','ledger-service'],[17,9,'pack5:087','empty-display-goods','curio-arcade'],[2,10,'pack5:096','unoccupied-stall','oak-stall-divider','north'],[2,12,'pack5:096','unoccupied-stall','oak-stall-divider','north'],[21,22,'pack4:057','dry-tack',null]]},
 {category:'magic-shop',biome:'mountain',size:'large',variation:2,w:29,d:28,h:10,entry:14,left:10,right:20,depth:12,
  frontSide:'east',stepWidth:4,stepDepth:6,oppositeWidth:3,oppositeDepth:4,
  wall:'pack1:005',floor:'pack2:013',roof:'pack3:026',annex:'inert-scroll-vault',name:'Starfall Split-Cliff Curios',
  masses:[[3,8,6,13,8,'north-astrolabe-roof'],[21,25,7,12,5,'high-south-reliquary'],[3,8,19,23,7,'cliffside-stone-gable']],
  gables:[['front',9,20,7],['rear',2,8,5]],
  furniture:[[23,4,'pack5:086','sealed-curio-counter','ledger-service'],[21,9,'pack5:093','inert-display','sunspire-reliquary-plinth'],[3,9,'pack5:091','sealed-records-desk','cartographers-oak-desk'],[25,25,'pack4:057','sealed-trunk',null]]},
 {category:'potion-shop',biome:'temperate',size:'large',variation:2,w:28,d:27,h:9,entry:14,left:9,right:19,depth:11,
  frontSide:'west',stepWidth:4,stepDepth:6,oppositeWidth:3,oppositeDepth:4,
  wall:'pack5:079',floor:'pack2:013',roof:'pack3:023',annex:'dry-herb-records',name:'Willowfen Raised Herb Courts',
  masses:[[3,7,8,13,7,'tall-inert-herb-vent'],[20,24,6,12,5,'east-drying-hip'],[4,7,20,23,5,'closed-herb-attic']],
  gables:[['front',8,20,6],['rear',3,7,5]],
  furniture:[[22,4,'pack5:086','apothecary-counter','ledger-service'],[21,8,'pack5:087','sealed-bottles','curio-arcade'],[3,9,'pack5:089','cold-apparatus','iron-tripod-cauldron'],[3,12,'pack5:091','herb-ledger','cartographers-oak-desk'],[24,24,'pack4:057','dry-herbs',null]]},
 {category:'bakery',biome:'desert',size:'large',variation:3,w:29,d:29,h:10,entry:14,left:8,right:18,depth:13,
  frontSide:'east',stepWidth:4,stepDepth:7,oppositeWidth:3,oppositeDepth:4,
  wall:'pack5:079',floor:'pack5:081',roof:'pack5:080',annex:'cool-flour-archive',name:'Sunstep Two-Court Bread Bazaar',
  masses:[[3,7,7,13,8,'high-sand-cooling-tower'],[20,24,8,12,6,'ovenside-raised-block'],[2,6,20,24,5,'shaded-delivery-hip']],
  gables:[['front',8,21,5]],
  furniture:[[22,4,'pack5:086','bakers-counter','ledger-service'],[21,9,'pack5:090','unfired-oven','ashstone-bake-oven'],[3,9,'pack5:091','flour-schedule','cartographers-oak-desk'],[25,25,'pack4:057','grain-store',null]]},
 {category:'bank',biome:'snow',size:'large',variation:2,w:30,d:29,h:11,entry:15,left:9,right:20,depth:12,
  frontSide:'west',stepWidth:4,stepDepth:7,oppositeWidth:3,oppositeDepth:5,
  wall:'pack1:004',floor:'pack2:013',roof:'pack3:025',annex:'winter-bond-records',name:'Northglass Three-Wing Treasury',
  masses:[[3,7,7,13,8,'high-north-watch-roof'],[22,26,7,14,6,'teller-tower'],[3,7,21,25,7,'rear-vault-spire']],
  gables:[['front',9,21,7],['rear',3,8,6]],
  furniture:[[22,4,'pack5:086','bond-counter','ledger-service'],[23,8,'pack5:086','teller-counter','ledger-service'],[3,9,'pack5:091','bond-ledger','cartographers-oak-desk'],[25,26,'pack5:093','inert-seal','sunspire-reliquary-plinth'],[5,26,'pack4:057','bond-crate',null]]}
]);
const K=(x,y,z)=>[x,y,z].join(',');
export function carveOpposingForecourt(original,p){
 const west=p.frontSide==='east',width=p.oppositeWidth,depth=p.oppositeDepth;
 if(!Number.isInteger(width)||!Number.isInteger(depth)||width<2||width>4||depth<3||depth>5)
  throw Error('invalid independent forecourt profile');
 const cells=new Map(original.voxels.map(v=>[K(v.x,v.y,v.z),{...v}]));
 const x0=west?0:p.w-width,x1=west?width-1:p.w-1,inside=west?width:p.w-width-1;
 for(let x=x0;x<=x1;x++)for(let z=0;z<depth;z++)for(let y=0;y<original.extents.y;y++){
  const key=K(x,y,z),v=cells.get(key);
  if(v&&['window','fixture','decor'].includes(v.kind))throw Error('new opposing court cuts protected special coordinate '+key);
  cells.delete(key);
 }
 const weather=(x,z,role)=>{for(let y=2;y<=p.h;y++){
  const key=K(x,y,z),old=cells.get(key);
  if(old&&old.kind!=='wall')throw Error('forecourt weather wall collides '+key);
  cells.set(key,{x,y,z,material:p.wall,kind:'wall',architecturalRole:role});
 }};
 for(let z=0;z<depth;z++)weather(inside,z,'opposite-forecourt-weather-leg');
 for(let x=x0;x<=x1;x++)weather(x,depth,'opposite-forecourt-return');
 const op={kind:'opposite-front-forecourt',side:west?'west':'east',x0,x1,z0:0,z1:depth-1,removedColumns:width*depth};
 const b={...original,voxels:[...cells.values()].sort((a,b)=>a.y-b.y||a.z-b.z||a.x-b.x),
  architecturalSignature:original.architecturalSignature+' / separately carved opposite forecourt and varied stepped roof masses',
  courtyardGeometry:[...original.courtyardGeometry,op],
  features:[...original.features,'opposing second real open-air forecourt; three-sided stepped building silhouette']};
 validateBlueprint(b);return Object.freeze(b);
}
export const M1_STEPPED_COURT_PROFILES=Object.freeze(M1_STEPPED_COURT_SPECS.map(author2AUProfile));
export const M1_STEPPED_COURT_SHOPS=Object.freeze(M1_STEPPED_COURT_PROFILES.map((p,i)=>
 carveOpposingForecourt(carve2AUFootprint(assembleSpecialistProfile(p),p),M1_STEPPED_COURT_SPECS[i])));
