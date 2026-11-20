// Tiny procedural isometric previews derived from the *installed physical*
// shape readers. Not stock art, raster screenshots or fabricated mesh fixtures.
import {biome130Block} from '../biome130-registry.mjs';
import {pack2ShapeOf,pack2NormalizeState} from '../pack2-integration.mjs';
import {resolveManualFivePackAsset} from '../builder-assets/manual-five-pack.mjs';
const CUBE=Object.freeze([[0,0,0,1,1,1]]);
const palette=Object.freeze({
  terrain:['#cdbd9b','#978f86','#5a6a65'],
  wood:['#e0ba7a','#977a4f','#5b6849'],
  construction:['#e1b691','#a38a79','#58686d'],
  doors:['#d8bd85','#87704b','#425964'],
  furniture:['#d4a97e','#876749','#495b5c'],
  decorations:['#dbcaa0','#968374','#636177'],
  magical:['#c3a8f1','#8277bd','#476c8c'],
  water:['#b8ecf7','#5fbed1','#3b7b9b'],
  creatures:['#d9b3eb','#9363ab','#526c7c']
});
export function creativePhysicalBoxes(item){
  if(item.owner==='core')return CUBE;
  if(item.owner==='biome130')return biome130Block(item.id,0).boxes;
  if(item.owner==='pack2'){
    const shape=pack2ShapeOf(item.id,pack2NormalizeState(item.id));
    return shape.boxes?.length?shape.boxes:shape.broadPhaseBox?[shape.broadPhaseBox]:CUBE;
  }
  const shape=resolveManualFivePackAsset(item.symbol,{numericId:item.id,
    orientation:0,...(item.owner==='pack1'?{variant:'lower'}:{}),
    ...(item.owner==='pack5'?{variant:item.variants[0]}:{})});
  return shape.visibleBoxes;
}
export function makeCreativeThumbnail(item){
  if(!item||!['block','spawn'].includes(item.kind))
    throw TypeError('Unknown Creative thumbnail request');
  const c=document.createElement('canvas');c.width=c.height=48;
  c.className='mw-item-thumbnail';c.setAttribute('aria-hidden','true');
  const ctx=c.getContext('2d');
  if(!ctx)return c;
  const colors=palette[item.category]||palette.terrain;
  if(item.kind==='spawn'){
    // Each live species receives a recognizable original sigil motif.
    const text=String(item.id);
    let hash=2166136261;
    for(const char of text)hash=Math.imul(hash^char.charCodeAt(0),16777619);
    ctx.fillStyle=colors[2];ctx.beginPath();ctx.ellipse(24,24,14,19,0,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle=colors[0];ctx.lineWidth=2.4;ctx.stroke();
    ctx.fillStyle=colors[1];
    for(let i=0;i<5;i++){
      const angle=i*Math.PI*2/5+(hash%17)*.08,r=6+(hash>>i&3);
      ctx.beginPath();ctx.arc(24+Math.cos(angle)*r,24+Math.sin(angle)*r,2.5,0,Math.PI*2);ctx.fill();
    }
    ctx.fillStyle=colors[0];ctx.font='bold 15px system-ui';ctx.textAlign='center';
    ctx.fillText(item.name[0].toUpperCase(),24,30);
    return c;
  }
  let boxes;
  try{boxes=creativePhysicalBoxes(item);}
  catch(_){boxes=CUBE;c.dataset.fallback='true';}
  if(!Array.isArray(boxes)||!boxes.length)boxes=CUBE;
  const proj=(x,y,z)=>[(x-z)*.866,(x+z)*.35-y*.8];
  const all=[];
  for(const b of boxes.slice(0,120)){
    if(!Array.isArray(b)||b.length!==6||!b.every(Number.isFinite))continue;
    for(const x of [b[0],b[3]])for(const y of [b[1],b[4]])
      for(const z of [b[2],b[5]])all.push(proj(x,y,z));
  }
  if(!all.length)return c;
  const loX=Math.min(...all.map(p=>p[0])),hiX=Math.max(...all.map(p=>p[0]));
  const loY=Math.min(...all.map(p=>p[1])),hiY=Math.max(...all.map(p=>p[1]));
  const scale=Math.min(35/Math.max(.3,hiX-loX),35/Math.max(.3,hiY-loY),32);
  const at=(x,y,z)=>{const [px,py]=proj(x,y,z);
    return [24+(px-(loX+hiX)/2)*scale,24+(py-(loY+hiY)/2)*scale];};
  const face=(points,color)=>{
    ctx.beginPath();
    points.forEach(([x,y,z],i)=>{
      const p=at(x,y,z);if(i===0)ctx.moveTo(...p);else ctx.lineTo(...p);
    });
    ctx.closePath();ctx.fillStyle=color;ctx.fill();
    ctx.strokeStyle='#17242b99';ctx.lineWidth=.55;ctx.stroke();
  };
  const sorted=boxes.slice(0,120).sort((a,b)=>
    (a[0]+a[2]+a[1])-(b[0]+b[2]+b[1]));
  for(const b of sorted){
    const [x0,y0,z0,x1,y1,z1]=b;
    face([[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]],colors[1]);
    face([[x1,y0,z0],[x1,y0,z1],[x1,y1,z1],[x1,y1,z0]],colors[2]);
    face([[x0,y1,z0],[x1,y1,z0],[x1,y1,z1],[x0,y1,z1]],colors[0]);
  }
  return c;
}
