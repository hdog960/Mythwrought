// Isolated Lava A behavior for shared liquid contract v1. No world edits.
export const LAVA_DEFINITION=Object.freeze({id:"lava",gravityLimit:2,lateralLimit:1});
export const LAVA_HEAT_KEY="lava-heat";
export const LAVA_HEAT_MAX_PER_UNIT=100;
const CAP=8;
const integer=(v,min,max)=>Number.isSafeInteger(v)&&v>=min&&v<=max;
const requireInt=(v,min,max,label)=>{if(!integer(v,min,max))throw new RangeError(label);return v;};
const validPoint=(x,y,z)=>Number.isSafeInteger(x)&&integer(y,-210,256)&&Number.isSafeInteger(z);
const quantitiesOnly=(q,allowed)=>q!==null&&typeof q==="object"&&!Array.isArray(q)&&Object.entries(q).every(([k,v])=>allowed.includes(k)&&Number.isSafeInteger(v)&&v>=0);
export function lavaQuantities(units,heatPerUnit=80){
  requireInt(units,1,CAP,"lava volume");
  requireInt(heatPerUnit,0,LAVA_HEAT_MAX_PER_UNIT,"lava heat density");
  return Object.freeze(heatPerUnit?{[LAVA_HEAT_KEY]:units*heatPerUnit}:{});
}
export function readLavaHeat(cell){
  if(!cell||cell.id!=="lava"||!integer(cell.units,1,CAP)||!quantitiesOnly(cell.quantities,[LAVA_HEAT_KEY]))return null;
  const heat=cell.quantities[LAVA_HEAT_KEY]??0;
  return integer(heat,0,cell.units*LAVA_HEAT_MAX_PER_UNIT)?heat:null;
}
// A vent is an explicitly authorized source. Default finite; null budget requires opt-in.
export function createLavaVent({x,y,z,rate=1,heatPerUnit=80,remaining=8,renewable=false,emitted=0,version=1}={}){
  if(version!==1||!validPoint(x,y,z)||typeof renewable!=="boolean")throw new RangeError("vent state");
  requireInt(rate,1,CAP,"vent rate");
  requireInt(heatPerUnit,0,LAVA_HEAT_MAX_PER_UNIT,"vent heat density");
  requireInt(emitted,0,Number.MAX_SAFE_INTEGER,"vent emitted");
  if(renewable?remaining!==null:!integer(remaining,0,Number.MAX_SAFE_INTEGER))throw new RangeError("vent budget");
  return Object.freeze({version:1,x,y,z,rate,heatPerUnit,remaining,renewable,emitted});
}
// Host calls at most once per scheduled vent visit; persist returned state with engine snapshot.
// No source scan, no offline catch-up, no implicit creation on a failed insert.
export function visitLavaVent(engine,vent){
  const s=createLavaVent(vent);
  if(!engine||typeof engine.getCell!=="function"||typeof engine.insert!=="function")throw new TypeError("liquid engine required");
  const c=engine.getCell(s.x,s.y,s.z);
  if(c&&(c.id!=="lava"||readLavaHeat(c)===null))return Object.freeze({state:s,inserted:0});
  const n=Math.min(s.rate,CAP-(c?.units??0),s.renewable?s.rate:s.remaining,Number.MAX_SAFE_INTEGER-s.emitted);
  if(n<=0||engine.insert(s.x,s.y,s.z,"lava",n,lavaQuantities(n,s.heatPerUnit))!==true)return Object.freeze({state:s,inserted:0});
  return Object.freeze({state:createLavaVent({...s,remaining:s.renewable?null:s.remaining-n,emitted:s.emitted+n}),inserted:n});
}
// Signal only: movement/damage and renderer owners decide how to consume it.
export function lavaExposure(sample){
  const heat=readLavaHeat(sample?.cell);
  if(heat===null||!Number.isFinite(sample.fill)||sample.fill!==sample.cell.units/CAP)return null;
  return Object.freeze({id:"lava",fill:sample.fill,heat,heatPerUnit:heat/sample.cell.units});
}
// Cooling is a pure proposal, never an extract/insert workaround or a terrain write.
// At zero thermal quantity all remaining lava mass is eligible for a solid product ledger.
export function proposeLavaCooling(cell,{lossPerUnit=4}={}){
  requireInt(lossPerUnit,0,LAVA_HEAT_MAX_PER_UNIT,"cooling rate");
  const heat=readLavaHeat(cell);
  if(heat===null)return null;
  const releasedHeat=Math.min(heat,cell.units*lossPerUnit),nextHeat=heat-releasedHeat;
  if(nextHeat===0)return Object.freeze({expected:cell,consumeLava:cell.units,solidUnits:cell.units,releasedHeat,nextHeat:0,product:"cooled-lava",fullVoxelCandidate:cell.units===CAP});
  if(releasedHeat===0)return null;
  return Object.freeze({expected:cell,consumeLava:0,solidUnits:0,releasedHeat,nextHeat,product:null,fullVoxelCandidate:false});
}
// A = water, B = lava. Refuse unknown extensive quantities, because v1 has no product ledger.
export function proposeWaterLava(water,lava){
  if(water?.id!=="water"||!integer(water.units,1,CAP)||!quantitiesOnly(water.quantities,[])||readLavaHeat(lava)===null)return null;
  const n=Math.min(water.units,lava.units);
  return Object.freeze({consumeA:n,consumeB:n,product:"lava-quench"});
}
export const WATER_LAVA_REACTION=Object.freeze({a:"water",b:"lava",propose:proposeWaterLava});
// Derive a conserved output ledger from a v1 proposal. Still read-only.
// Steam and cooled mass are abstract accounted units, not registered blocks or items.
export function describeLavaQuench(proposal){
  const a=proposal?.a,b=proposal?.b,expected=proposeWaterLava(a,b);
  if(!expected||proposal.product!==expected.product||proposal.consumeA!==expected.consumeA||proposal.consumeB!==expected.consumeB)return null;
  const n=expected.consumeB,heat=readLavaHeat(b),releasedHeat=Math.floor(heat*n/b.units);
  return Object.freeze({waterUnits:n,steamUnits:n,lavaUnits:n,solidUnits:n,releasedHeat,remainingLavaHeat:heat-releasedHeat,fullVoxelCandidate:n===CAP});
}
