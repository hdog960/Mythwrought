// Detached S12 physical conifer silhouettes, compatible with exact S3
// source admission and canonical 8x8 sites. Never imported by production.
// All IDs, 19-high roof, trunk heights, 3-cell radius and 119-cell budget
// remain those of S3. No old grove or terrain replacement.
const H=Object.freeze({'compact-fir':5,'layered-spruce':7,
 'highland-pine':9,'windswept-alpine':6});
const T=Object.freeze({
 'compact-fir':[0,0,0,2,1,1,0],
 'layered-spruce':[0,0,0,2,3,1,2,1,0],
 'highland-pine':[0,0,0,0,0,1,2,2,1,1,0],
 'windswept-alpine':[0,0,0,1,2,2,1,0]});
const key=(x,y,z)=>x+','+y+','+z;
const dirs=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
function noise(x,y,z){
 let h=Math.imul(x,73856093)^Math.imul(y,19349663)^Math.imul(z,83492791);
 h=Math.imul(h^(h>>>16),0x45d9f3b);return ((h^(h>>>16))>>>0)/4294967296;
}
export function proposeSnowS12Conifer(style,x,floor,z,{wind=1}={}){
 const height=Object.hasOwn(H,style)?H[style]:undefined;
 if(!height||![x,floor,z].every(Number.isSafeInteger)||floor<0||
   Math.abs(x)>2000000||Math.abs(z)>2000000||![1,-1].includes(wind))
   throw new RangeError('Invalid detached original S12 conifer');
 if(floor+height+1>19)return null;
 const raw=new Map();
 const put=(dx,dy,dz,id)=>{
   const k=key(dx,dy,dz);
   if(!raw.has(k))raw.set(k,[dx,dy,dz,id]);
 };
 for(let dy=1;dy<=height;dy++)put(0,dy,0,4);
 // Expose more trunk at walking height, tapered branch whorls, uneven
 // branch endpoints. Deterministic absolute-world variation, never per chunk.
 for(let dy=3;dy<=height;dy++){
   const r=T[style][dy]??0;
   const shift=style==='windswept-alpine'&&dy>=4?wind:0;
   for(let dz=-r;dz<=r;dz++)for(let dx=-r;dx<=r;dx++){
     const a=dx+shift,d= Math.abs(dx)+Math.abs(dz);
     if(Math.abs(a)>3||Math.abs(dz)>3||d>r+1)continue;
     // Keep inner arms attached; vary only outer branch tips.
     if(d>r&&noise(x+a,floor+dy,z+dz)<.57)continue;
     if(d===r&&r>=2&&dx!==0&&dz!==0&&noise(x+a,floor+dy,z+dz)<.30)continue;
     put(a,dy,dz,406);
   }
 }
 put(0,height+1,0,406);
 // Retain only the actual face-connected component rooted in solid wood.
 // No floating needle voxels even when a sparse branch tip was omitted.
 const reached=new Set([key(0,1,0)]),queue=[[0,1,0]];
 for(let i=0;i<queue.length;i++){
   const [a,b,c]=queue[i];
   for(const [dx,dy,dz] of dirs){
     const q=[a+dx,b+dy,c+dz],k=key(...q);
     if(raw.has(k)&&!reached.has(k)){reached.add(k);queue.push(q);}
   }
 }
 const cells=[];
 for(const [k,[dx,dy,dz,id]] of raw){
   if(!reached.has(k))continue;
   // Snow rests on the exposed upper face of a branch. Densely shaded
   // needles below it remain dark; irregular lee-side deposition rather
   // than the old dy%2 horizontal striping. Tip always snow-laden.
   const exposed=!reached.has(key(dx,dy+1,dz));
   const snowfall=noise(x+dx,floor+dy+71,z+dz);
   const snowy=id!==4&&exposed&&(dy===height+1||
     snowfall<.70+.09*wind*Math.sign(dx));
   cells.push(Object.freeze([x+dx,floor+dy,z+dz,snowy?407:id]));
 }
 if(cells.length<16||cells.length>119)return null;
 return Object.freeze({style,height,cells:Object.freeze(cells),
  bounds:Object.freeze([Math.min(...cells.map(c=>c[0])),floor+1,
    Math.min(...cells.map(c=>c[2])),Math.max(...cells.map(c=>c[0])),
    floor+height+1,Math.max(...cells.map(c=>c[2]))])});
}
// Restrict all occupied horizontal footprint columns to genuine snow climate.
// The existing S3 source and collision admission still applies afterward.
// No new terrain, no painting hardpan/scree, no modification of old trees.
export function createSnowS12ClimateBoundTreeFactory(seed,biomeAt){
 if(!Number.isSafeInteger(seed)||seed!==(seed|0)||typeof biomeAt!=='function')
   throw new TypeError('Exact original snow climate required');
 return (style,x,floor,z,options)=>{
   const tree=proposeSnowS12Conifer(style,x,floor,z,options);
   if(!tree)return null;
   const checked=new Set();
   for(const [a,,c] of tree.cells){
     const k=a+','+c;
     if(checked.has(k))continue;
     checked.add(k);
     const climate=biomeAt(a,c,seed);
     if(climate?.name!=='snow'||!Number.isFinite(climate.weight)||
       climate.weight<.65||climate.weight>1)return null;
   }
   return tree;
 };
}
