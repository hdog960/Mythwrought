// Builder 1A source-authentic dry-run review. No production registration or world writes.
import {MANUAL_FIVE_PACK_COUNTS,manualFivePackVariants,resolveManualFivePackAsset} from '../../builder-assets/manual-five-pack.mjs';
import {PACK5_BUILDER_CATALOG} from '../../pack5-integration/catalog.mjs';
const variants=new Map(PACK5_BUILDER_CATALOG.map(x=>[x.symbolicId,x.variants[0]]));
const dirs=new Set(['north','east','south','west']);
const key=at=>at.join(',');
const add=(a,b)=>a.map((n,i)=>n+b[i]);
export function auditM1PhysicalSources(b){
 if(!b||!Array.isArray(b.placements))throw TypeError('Expected 3D candidate');
 const at=new Map(b.placements.map(p=>[key(p.at),p]));
 const reserved=new Set((b.footprintReservations??[]).flatMap(r=>r.extraCells.map(key)));
 const resolved=new Map(),errors=[],unresolved=[],supports=[];
 let roofs=0,backed=0,beds=0,feet=0,windows=0,doors=0;
 for(const p of b.placements){
  if(p.asset.startsWith('live:'))continue;
  if(!/^pack[1-5]:\d{3}$/.test(p.asset)){
   unresolved.push({at:p.at,asset:p.asset,reason:'not in manual five-pack'});continue;
  }
  const yaw=dirs.has(p.orientation)?p.orientation:p.orientation==='none'?'north':null;
  if(!yaw){unresolved.push({at:p.at,asset:p.asset,reason:'non-cardinal facing'});continue;}
  const variant=p.asset.startsWith('pack5:')?(p.variant??variants.get(p.asset)):null;
  if(p.asset.startsWith('pack5:')&&!variant){errors.push({asset:p.asset,at:p.at,reason:'missing physical variant'});continue;}
  const signature=[p.asset,yaw,variant].join('/');
  let shape=resolved.get(signature);
  if(!shape){
   try{
    if(manualFivePackVariants(p.asset).length>1&&!Number.isInteger(p.numericId))
     unresolved.push({at:p.at,asset:p.asset,reason:'explicit numeric variant ID required'});
    shape=resolveManualFivePackAsset(p.asset,{orientation:yaw,variant,numericId:p.numericId??null});
    resolved.set(signature,shape);
   }catch(e){errors.push({asset:p.asset,at:p.at,reason:String(e.message)});continue;}
  }
  for(const offset of shape.occupiedOffsets){
   const cell=add(p.at,offset);
   if(key(cell)===key(p.at))continue;
   if(at.has(key(cell))||!reserved.has(key(cell)))
    errors.push({asset:p.asset,at:p.at,reason:'unreserved or blocked physical extra cell '+key(cell)});
   else feet++;
  }
  for(const offset of shape.supportOffsets){
   const cell=add(p.at,offset),support=at.get(key(cell));
   supports.push({asset:p.asset,cell,authorSolid:!!support&&(support.occupancy.kind==='full-cell'||support.asset==='pack2:013')});
  }
  if(p.role==='roof'){
   roofs++;const below=at.get(key([p.at[0],p.at[1]-1,p.at[2]]));
   if(below&&['live:wood','pack2:013'].includes(below.asset))backed++;
  }
  if(p.asset==='pack5:082')beds++;
  if(p.role==='window')windows++;
  if(p.role==='door')doors++;
 }
 return Object.freeze({
  id:b.id,catalog:MANUAL_FIVE_PACK_COUNTS,resolvedDescriptors:resolved.size,
  descriptors:Object.freeze([...resolved.keys()].sort()),
  errors:Object.freeze(errors),unresolved:Object.freeze(unresolved),
  provisionalSupports:Object.freeze(supports),
  roofTiles:roofs,roofBackingCells:backed,bedHeads:beds,bedFeet:feet,windowCells:windows,doorCells:doors,
  productionReady:false,worldPlaced:false,physicalIPhoneTested:false,
  pending:Object.freeze([
   'roof tile seams and structural span/load',
   'glass/weather seal and hinged-door swept-clearance',
   'Pack5 actual bed collision and schema-1 orientation/variant restore',
   'live-game physical WebGL2 candidate render and creator art approval'
  ])
 });
}
