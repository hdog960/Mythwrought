/**
 * Roadmap A3: source-exact four-yaw physical risk matrix. READ-ONLY.
 * No new fixture mounting, bearing beam, flue solid, world placement or saved-state edits.
 * Producer collision boxes are real catalog geometry; ordinary source cube neighbors
 * are intentionally conservative proxies, NEVER accepted as production meshes.
 */
import {auditA3SourceSpecificBlockerLocations} from './a3-source-specific-physical-ledger.mjs';
import {createLegacyBlacksmithPool} from './legacy-blacksmiths.mjs';
import {createM2ThirdVariantPool} from './m2-metalwork-third-variants.mjs';
import {createM2FourthVariantPool} from './m2-metalwork-fourth-variants.mjs';
import {createM2FifthVariantPool} from './m2-metalwork-fifth-variants.mjs';
import {createM3CraftSecondPool} from './m3-craft-second-variants.mjs';
import {createM3CraftThirdPool} from './m3-craft-third-variants.mjs';
import {resolveManualFivePackAsset} from '../../builder-assets/manual-five-pack.mjs';
const yaws=['north','east','south','west'];
const key=x=>x.join(',');
const origin=c=>c.slice(0,3);
const wbox=(b,at)=>b.map((v,i)=>v+at[i%3]);
const overlaps=(a,b)=>a[0]<b[3]-1e-7&&b[0]<a[3]-1e-7&&a[1]<b[4]-1e-7&&b[1]<a[4]-1e-7&&a[2]<b[5]-1e-7&&b[2]<a[5]-1e-7;
const unit=at=>[...at,at[0]+1,at[1]+1,at[2]+1];
const flatten=b=>b.modules.flatMap(m=>m.cells.map(c=>({at:origin(c),asset:c[3],role:m.role})));
const layout=b=>new Map(flatten(b).map(c=>[key(c.at),c]));
const sourceCohorts={
 'm2-fourth':createM2FourthVariantPool,
 'm2-fifth':createM2FifthVariantPool,
 'm3-second':createM3CraftSecondPool,
 'm3-third':createM3CraftThirdPool
};
const memo=new Map();
function pack(ref,yaw){
 const k=ref+'|'+yaw;
 if(!memo.has(k))memo.set(k,resolveManualFivePackAsset(ref,{orientation:yaw}));
 return memo.get(k);
}
function maybeNeighborBoxes(entry){
 if(!/^pack[1-5]:\d{3}$/.test(entry.asset))return {boxes:[unit(entry.at)],proxy:true};
 try{
  const o=pack(entry.asset,'north');
  return {boxes:o.collisionBoxes.map(x=>wbox(x,entry.at)),proxy:false};
 }catch{return {boxes:[unit(entry.at)],proxy:true};}
}
function riskAt(model,at,shape,skip){
 const all=flatten(model);
 const occupiedOffsets=shape.occupiedOffsets.map(x=>x.map((v,i)=>v+at[i]));
 const reservedHits=occupiedOffsets.filter(p=>all.some(c=>key(c.at)===key(p)&&key(c.at)!==key(skip)));
 let collisionHits=0,neighborProxyChecks=0,neighborPhysicalChecks=0,nearbyCells=0;
 for(const c of all){
  if(key(c.at)===key(skip)||c.at.some((n,i)=>Math.abs(n-at[i])>3))continue;
  nearbyCells++;
  const candidate=maybeNeighborBoxes(c);
  candidate.proxy?neighborProxyChecks++:neighborPhysicalChecks++;
  if(shape.collisionBoxes.some(b=>candidate.boxes.some(n=>overlaps(wbox(b,at),n))))collisionHits++;
 }
 return {occupiedOffsetConflicts:reservedHits.map(key),nearbyCells,
  physicalCollisionNeighbors:neighborPhysicalChecks,proxyCollisionNeighbors:neighborProxyChecks,
  geometricCollisionIntersections:collisionHits,productionExactAssembly:false};
}
function flueBox(b){
 const f=b.architecture?.coldHollowFlue;
 const g=b.architecture?.flueVoid;
 if(f)return [f.x,f.openFromY??3,f.z,f.x+1,(f.openThroughY??22)+1,f.z+1];
 if(Array.isArray(g))return[g[0],3,g[1],g[0]+1,b.envelope.height,g[1]+1];
 return null;
}
const within=(a,b)=>overlaps(a,b);
function walkwayBoxes(b){
 return(b.clearances??[]).map(c=>[c.x,c.y,c.z,c.x+c.width,c.y+c.height,c.z+c.depth]);
}
export function auditA3FourYawPhysicalRisks(){
 memo.clear();
 const source=auditA3SourceSpecificBlockerLocations(),legacy=new Map(createLegacyBlacksmithPool().map(b=>[b.id,b])),
  third=new Map(createM2ThirdVariantPool().map(b=>[b.id,b]));
 const mounted=[];
 for(const x of [...source.legacyFireplaceMounts,...source.legacyChimneyMounts]){
  const b=legacy.get(x.id),filled=layout(b),flue=flueBox(b);
  if(!b)throw Error('Legacy source missing '+x.id);
  for(const yaw of yaws){
   const p=pack(x.family,yaw),supports=p.supportOffsets.map(o=>o.map((v,i)=>v+x.fixture[i]));
   const missing=supports.filter(at=>!filled.has(key(at)));
   const intersectsFlue=p.collisionBoxes.some(s=>flue&&within(wbox(s,x.fixture),flue));
   const risk=riskAt(b,x.fixture,p,x.fixture);
   mounted.push(Object.freeze({id:x.id,family:x.family,at:x.fixture,yaw,sourceRequiredSupport:x.requiredSupport,
    actualYawSupportOffsets:supports,missingAuthoredSourceSupports:missing,
    supportPolicy:p.supportPolicy,producerCollisionAABBs:p.collisionBoxes.length,
    intersectsReservedHollowFlue:!!intersectsFlue,...risk,
    physicalShapeResolved:true,thermalCertified:false,worldRepairApplied:false}));
  }
 }
 const beams=[];
 for(const x of source.unplacedBeamRecords){
  const b=third.get(x.id),flue=flueBox(b),aisles=walkwayBoxes(b);
  if(!b)throw Error('M2 third source missing '+x.id);
  for(const yaw of yaws){
   let result={id:x.id,proposedBeam:x.proposedBeam,yaw,sourceImmediateBearing:x.authoredBearingImmediatelyBelow,
     requiredStructuralLoadPathUnverified:true,installed:false,creatorApproved:false,
     thermalCertified:false,weatherCertified:false,worldRegistered:false};
   try{
    const p=pack(x.proposedFamily,yaw),risk=riskAt(b,x.proposedBeam,p,[-999,-999,-999]);
    const boxes=p.collisionBoxes.map(box=>wbox(box,x.proposedBeam));
    result={...result,producerResolved:true,producerNumericId:p.numericId,
      supportOffsets:p.supportOffsets.map(o=>o.map((v,i)=>v+x.proposedBeam[i])),
      producerCollisionAABBs:p.collisionBoxes.length,
      intersectsHollowFlue:!!flue&&boxes.some(box=>overlaps(box,flue)),
      intersectsReservedCirculation:aisles.some(a=>boxes.some(box=>overlaps(box,a))),
      ...risk};
   }catch(e){result={...result,producerResolved:false,resolutionFailure:String(e?.message??e),
    intersectsHollowFlue:null,intersectsReservedCirculation:null};}
   beams.push(Object.freeze(result));
  }
 }
 const roof=[];
 const allCohorts=new Map(Object.entries(sourceCohorts).map(([name,make])=>[name,new Map(make().map(b=>[b.id,b]))]));
 for(const witness of source.roofWitnessRecords){
  const b=allCohorts.get(witness.cohort).get(witness.id);
  const cells=b.modules.filter(m=>m.role==='roof').flatMap(m=>m.cells);
  const roofCell=cells.find(c=>key(origin(c))===key(witness.at));
  if(!roofCell)throw Error('Missing 3A roof source '+witness.id+':'+key(witness.at));
  const asset=roofCell[3], orientation=roofCell[4]?.orientation??'north';
  let producer=null,error=null;
  try{const p=pack(asset,orientation);
   producer={numericId:p.numericId,visibleBoxes:p.visibleBoxes.length,collisionBoxes:p.collisionBoxes.length,
     occupiedOffsets:p.occupiedOffsets.length,supportOffsets:p.supportOffsets.length};
  }catch(e){error=String(e?.message??e);}
  roof.push(Object.freeze({id:witness.id,cohort:witness.cohort,at:witness.at,asset,
    nearestStructuralSource:witness.closestStructuralSource,nearestHorizontalDistance:witness.nearestHorizontalDistance,
    producerShape:producer,producerResolutionFailure:error,
    structuralCapacityVerified:false,weatherCertified:false,sourceModified:false}));
 }
 if(mounted.length!==120||beams.length!==624||roof.length!==274)throw Error('A3 yaw audit census changed');
 const count=(arr,field)=>arr.filter(x=>x[field]).length;
 return Object.freeze({schema:'mythwrought.roadmap-a3.yaw-physical-risk-matrix.v1',
  sourceDesigns:345,originalLegacyFixtures:30,legacyYawWitnesses:120,unplacedBeamCandidates:156,
  unplacedBeamYawWitnesses:624,roofWitnessLocations:274,
  legacySourceMountStillMissing:count(mounted,'missingAuthoredSourceSupports'), // inspect arrays by individual row below
  legacyFlueCollisionYawCases:count(mounted,'intersectsReservedHollowFlue'),
  beamProducerUnresolved:beams.filter(x=>!x.producerResolved).length,
  beamFlueCollisionYawCases:count(beams,'intersectsHollowFlue'),
  beamWalkwayCollisionYawCases:count(beams,'intersectsReservedCirculation'),
  beamSourceCollisionYawCases:beams.filter(x=>(x.geometricCollisionIntersections??0)>0).length,
  beamPhysicalExactAssemblyCertified:false,roofProducerUnresolved:roof.filter(x=>!x.producerShape).length,
  worldSupportsPlaced:0,modifiedSourceBlueprints:0,physicalIphoneTested:false,
  fireplaceChimneyYaw: Object.freeze(mounted),beamYaw: Object.freeze(beams),roofWitnesses:Object.freeze(roof)});
}
