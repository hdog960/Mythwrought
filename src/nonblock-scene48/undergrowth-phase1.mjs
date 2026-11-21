// :48 original ground-cover silhouettes; visual-only, no block IDs or world placement.
export const UNDERGROWTH_FAMILIES=Object.freeze({
 'scene48:clover-patch':Object.freeze({attachment:'ground',collision:'pass-through',footprint:[0.85,0.18,0.85],tier:'dense',biome:['meadow','temperate'],status:'IN_PROGRESS'}),
 'scene48:bracken-fern':Object.freeze({attachment:'ground',collision:'pass-through',footprint:[1.25,1.05,1.25],tier:'medium',biome:['forest','enchanted-forest'],status:'IN_PROGRESS'}),
 'scene48:moss-cushion':Object.freeze({attachment:'ground',collision:'pass-through',footprint:[0.95,0.22,0.95],tier:'dense',biome:['forest','cave'],status:'IN_PROGRESS'}),
 'scene48:clustered-toadstools':Object.freeze({attachment:'ground',collision:'pass-through',footprint:[0.9,0.68,0.9],tier:'medium',biome:['forest','enchanted-forest'],status:'IN_PROGRESS'})
});
const pi=Math.PI;
function meshBuilder(){const positions=[],materials=[];return {tri(a,b,c,m){positions.push(...a,...b,...c);materials.push(m);},quad(a,b,c,d,m){this.tri(a,b,c,m);this.tri(a,c,d,m);},finish(){return {positions:new Float32Array(positions),materials:new Uint8Array(materials),triangleCount:materials.length};}};}
function clover(b,variant){
 const count=6+variant,turn=2*pi;
 for(let cluster=0;cluster<count;cluster++){
  const a=cluster*2.399963+variant*.19,r=.042+.052*(cluster%4);
  const x=Math.cos(a)*r,z=Math.sin(a)*r,h=.044+.005*(cluster%3)+variant*.003;
  b.quad([x-.008,0,z],[x+.008,0,z],[x+.005,h,z],[x-.005,h,z],0);
  for(let leaf=0;leaf<3;leaf++){
   const angle=a+leaf*turn/3,dx=Math.cos(angle),dz=Math.sin(angle);
   const reach=.083+variant*.007+(cluster%2)*.012,width=.031+(cluster%3)*.005;
   const root=[x,h,z],rib=[x+dx*reach*.54,h+.024,z+dz*reach*.54];
   const left=[rib[0]-dz*width,h+.012,rib[2]+dx*width];
   const right=[rib[0]+dz*width,h+.013,rib[2]-dx*width];
   const tip=[x+dx*reach,h+.009,z+dz*reach];
   b.tri(root,left,rib,1);
   b.tri(root,rib,right,2);
   b.tri(left,tip,rib,cluster%3===0?3:1);
   b.tri(rib,tip,right,2);
  }
 }
}
function bracken(b,variant,distant){
 const turn=2*pi,fronds=4+variant%2;
 for(let f=0;f<fronds;f++){
  const angle=turn*f/fronds+variant*.18,dx=Math.cos(angle),dz=Math.sin(angle);
  const height=.78+.035*variant+.052*(f%2),reach=.37+.043*(f%3);
  const center=t=>[dx*reach*t,height*(1-(1-t)**2),dz*reach*t];
  const side=([x,y,z],width)=>[x-dz*width,y,z+dx*width];
  for(let step=0;step<4;step++){
   const from=center(step/4),to=center((step+1)/4),width=.016-step*.002;
   b.quad(side(from,-width),side(from,width),side(to,width*.66),side(to,-width*.66),0);
  }
  for(let pair=0;pair<5;pair++){
   const t=.19+pair*.149,[x,y,z]=center(t),width=.227-pair*.028;
   const root=[x,y,z],join=center(t+.072);
   for(const direction of [-1,1]){
    const tip=[x-dz*width*direction+dx*.075,y+.047,z+dx*width*direction+dz*.075];
    if(distant){
     b.tri(root,[tip[0],tip[1]+.014,tip[2]],join,2);
     continue;
    }
    const ridge=[x-dz*width*.46*direction+dx*.037,y+.075,z+dx*width*.46*direction+dz*.037];
    b.tri(root,tip,ridge,1);
    b.tri(root,ridge,join,2);
    b.tri(ridge,tip,join,3);
   }
  }
 }
}
function moss(b,variant,distant){
 const pads=[[0,0,.19],[-.22,-.07,.14],[.21,.08,.155],[-.10,.20,.11],[.11,-.20,.12],[.21,.19,.096]];
 const phase=variant*.19,sides=7;
 for(let pad=0;pad<5+variant%2;pad++){
  const [px,pz,radius]=pads[pad],x=px*Math.cos(phase)-pz*Math.sin(phase),z=pz*Math.cos(phase)+px*Math.sin(phase);
  const r=radius*(.90+.05*variant),height=.048+r*.29+.006*variant;
  const ring=(ratio,y)=>Array.from({length:sides},(_,i)=>{
   const a=(i+pad*.23)*2*pi/sides+phase;
   const span=r*ratio*(.95+.07*Math.sin(i*2.63+pad));
   return [x+Math.cos(a)*span,y,z+Math.sin(a)*span];
  });
  const foot=ring(.82,.006),skirt=ring(1,height*.30),shoulder=ring(.75,height*.72);
  for(let i=0;i<sides;i++){
   const j=(i+1)%sides;
   b.quad(foot[i],foot[j],skirt[j],skirt[i],0);
   if(!distant)b.quad(skirt[i],skirt[j],shoulder[j],shoulder[i],i%3===0?2:1);
   const crown=distant?skirt:shoulder;
   b.tri(crown[i],crown[j],[x+.018,height,z-.014],(i+pad)%3===0?3:2);
  }
 }
}
function toadstools(b,variant){
 const turn=2*pi,patch=[[-.17,-.10,.37,.14],[.16,.08,.50,.17],
  [.015,.21,.27,.111],[-.21,.15,.26,.107]];
 const angle=variant*.23,cos=Math.cos(angle),sin=Math.sin(angle);
 for(let cap=0;cap<(variant===3?4:3);cap++){
  const [px,pz,baseHeight,radius]=patch[cap];
  const x=px*cos-pz*sin,z=pz*cos+px*sin;
  const height=baseHeight+variant*.021+(cap%2)*variant*.014,r=radius*(.95+.025*variant);
  const sides=6;
  const ring=(y,radius,phase)=>Array.from({length:sides},(_,i)=>{
   const a=phase+i*turn/sides;
   return [x+Math.cos(a)*radius,y,z+Math.sin(a)*radius];
  });
  const phase=angle+cap*.36;
  const base=ring(0,r*.22,phase),collar=ring(height*.71,r*.19,phase);
  const rim=ring(height*.70,r,phase),top=ring(height*.95,r*.58,phase+.07);
  for(let i=0;i<sides;i++){
   const j=(i+1)%sides;
   b.quad(base[i],base[j],collar[j],collar[i],4);
   b.quad(collar[i],rim[i],rim[j],collar[j],6);
   b.quad(rim[i],rim[j],top[j],top[i],i%3===cap%3?7:5);
   b.tri(top[i],top[j],[x,height,z],cap%2===0?7:5);
  }
 }
}
const makers={'scene48:clover-patch':clover,'scene48:bracken-fern':bracken,'scene48:moss-cushion':moss,'scene48:clustered-toadstools':toadstools};
function undergrowthVariant(id,seed,x,y,z){
 const salt=[...id].reduce((value,char)=>Math.imul(value,31)+char.charCodeAt(0)|0,17);
 const h=(Math.imul(seed^salt,73856093)^Math.imul(x,19349663)^Math.imul(z,83492791)^Math.imul(y,2654435761))>>>0;
 return {yaw:(h&7)*pi/4,scale:.86+((h>>>8)&15)*.012,variant:(h>>>16)&3};
}
export function makeUndergrowthMesh(id,seed,x,y,z,requestedVariant,{distant=false}={}){
 if(!Object.hasOwn(UNDERGROWTH_FAMILIES,id))throw new RangeError('unknown undergrowth family');
 if(![seed,x,y,z].every(Number.isSafeInteger))throw new TypeError('integer anchor required');
 const variant=requestedVariant??undergrowthVariant(id,seed,x,y,z).variant;
 if(!Number.isInteger(variant)||variant<0||variant>3)throw new RangeError('invalid undergrowth variant');
 const b=meshBuilder();
 makers[id](b,variant,distant);
 return {id,anchor:[x,y,z],mesh:b.finish(),attachment:'ground',collision:'pass-through'};
}
export function makeUndergrowthBatch(instances){
 if(!Array.isArray(instances))throw new TypeError('instances required');
 const batches=new Map();
 for(const item of instances){
  if(!item||!Object.hasOwn(UNDERGROWTH_FAMILIES,item.id)||
     ![item.seed,item.x,item.y,item.z].every(Number.isSafeInteger))throw new TypeError('invalid anchor');
  const {id,seed,x,y,z}=item;
  let batch=batches.get(id);
  if(!batch){
   batch={id,mesh:makeUndergrowthMesh(id,0,0,0,0).mesh,instances:[]};
   batches.set(id,batch);
  }
  batch.instances.push({anchor:[x,y,z],...undergrowthVariant(id,seed,x,y,z)});
 }
 return [...batches.values()];
}
