// Acid B: provisional presentation only, no chemistry or world mutations.
export const ACID_MATERIAL=Object.freeze({id:'acid',surface:'#92c83e',body:'#487e24',edge:'#c0df65',vapor:'#a6ba76',opacity:0.86});
const validPoint=c=>Number.isSafeInteger(c.x)&&Number.isSafeInteger(c.z)&&Number.isInteger(c.y)&&c.y>=-210&&c.y<=256;
const validCell=c=>c?.id==='acid'&&validPoint(c)&&Number.isInteger(c.units)&&c.units>=1&&c.units<=8;
// Host owns visibility, loaded/open checks and surface occlusion.
export function describeAcidSurface(cell,{exposed=false}={}){
  if(!validCell(cell))return null;
  return Object.freeze({material:ACID_MATERIAL,fill:cell.units/8,surfaceY:cell.y+cell.units/8,
    hazardCue:'acid',surfaceEffects:exposed===true});
}
function hash(x,y,z,step){
  let h=2166136261;
  for(const ch of `${x},${y},${z},${step}`)h=Math.imul(h^ch.charCodeAt(0),16777619);
  return h>>>0;
}
// Caller supplies a bounded visible-cell batch, in stable priority order.
// One particle descriptor per accepted cell per step; no persistent simulation.
export function sampleAcidEffects(cells,{step=0,maxVisits=128,maxParticles=12,isExposed}={}){
  if(!Array.isArray(cells)||!Number.isSafeInteger(step)||step<0||
    !Number.isInteger(maxVisits)||maxVisits<1||maxVisits>1024||
    !Number.isInteger(maxParticles)||maxParticles<0||maxParticles>64||
    typeof isExposed!=='function')throw new TypeError('Invalid acid effect budget');
  const effects=[],seen=new Set();let visited=0;
  for(let i=0;i<Math.min(cells.length,maxVisits)&&effects.length<maxParticles;i++){
    visited++;const c=cells[i];if(!validCell(c))continue;
    const k=`${c.x},${c.y},${c.z}`;if(seen.has(k))continue;seen.add(k);
    if(isExposed(c)!==true)continue;
    const h=hash(c.x,c.y,c.z,step);if(h%5!==0)continue;
    const vapor=(h>>>8)%4===0;
    effects.push(Object.freeze({kind:vapor?'acid-vapor':'acid-bubble',
      x:c.x+0.2+((h>>>12)%61)/100,y:c.y+c.units/8,z:c.z+0.2+((h>>>19)%61)/100,
      lifetime:vapor?0.7:0.35,scale:vapor?0.16:0.055,opacity:vapor?0.16:0.48}));
  }
  return Object.freeze({visited,effects:Object.freeze(effects)});
}
