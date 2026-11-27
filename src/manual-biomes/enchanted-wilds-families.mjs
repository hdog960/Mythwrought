// Original block-built Wilds silhouettes. No shared engine modifications.
import {BLOCK} from '../voxel.mjs';
import {ENVIRONMENT_GROUND as G} from '../environment-ground.mjs';
import {PHYSICAL_MAX_Y} from '../world-height.mjs';
import {wildsFamilyPalette} from './enchanted-wilds-materials.mjs';
const names=['Starspire','Moonwillow','Ancient Heartwood','Amethyst Crown','Dawnheart','Lumenspire','Velvet Umbrella','Sporecrown','Ivory Spiral','Titanveil'];
const ranges=[[24,34],[20,30],[40,50],[24,34],[30,40],[18,26],[16,24],[20,30],[22,32],[32,42]];
export const WILDS_FAMILIES=Object.freeze(names.map((name,i)=>Object.freeze({id:i,name,kind:i<5?'tree':'fungus',height:Object.freeze(ranges[i])})));
export const WILDS_RADIUS=7;
export const WILDS_MAX_CELLS=1600;
const hash=(a,b,c)=>{let n=Math.imul(a,0x7feb352d)^Math.imul(b,0x846ca68b)^Math.imul(c,0x9e3779b1);n=Math.imul(n^(n>>>16),0x45d9f3b);return (n^(n>>>16))>>>0;};
const key=(x,y,z)=>[x,y,z].join(',');
export function buildWildsFamily(id,x,floor,z,seed,variant=0){
 const f=WILDS_FAMILIES[id];
 if(!f||![x,floor,z,seed,variant].every(Number.isSafeInteger)||variant<0||variant>3)throw Error('Invalid Wilds family');
 const h=f.height[0]+hash(x,z,seed+variant*31)%(f.height[1]-f.height[0]+1);
 if(floor+h+3>PHYSICAL_MAX_Y)return null;
 const rows=new Map(),struct=new Set(),footprint=new Set(),roles=new Map();
 const palette=wildsFamilyPalette(id);
 const leafRole=mat=>[1,2,4].includes(id)?(mat===G.moonLeaves?'crown':'secondary'):(mat===G.moonLeaves?'secondary':'crown');
 const put=(a,b,c,mat,solid=false,role=null)=>{
   if(Math.abs(a)>WILDS_RADIUS||Math.abs(c)>WILDS_RADIUS||b<1||b>h+3)throw Error('Wilds geometry exceeded envelope');
   const k=key(a,b,c);if(struct.has(k)&&!solid)return;
   rows.set(k,[x+a,floor+b,z+c,mat]);roles.set(k,role??(solid?'stem':mat===BLOCK.CRYSTAL?'accent':leafRole(mat)));if(solid){struct.add(k);if(b===1)footprint.add(key(a,0,c));}
 };
 // Restrained existing full-cube palette. Pale fungal stalk uses existing
 // gneiss as a temporary ivory material; no registry IDs or shader claims.
 const bark=id===6||id===8||id===9?G.gneiss:G.aetherBark,moon=G.moonLeaves,amethyst=G.aetherLeaves;
 const accentRate=id===4?23:id>=5?53:67;
 const trunk=(a,b,c)=>put(a,b,c,bark,true);
 const disk=(cx,y,cz,r,mat,shape=0)=>{
   for(let a=-r;a<=r;a++)for(let c=-r;c<=r;c++){
     if(a*a+c*c>r*r+r)continue;
     if(shape===1&&Math.abs(a)+Math.abs(c)>r+2)continue;
     const roll=hash(a+x,c+z,y+seed);
     const tint=roll%accentRate===0?BLOCK.CRYSTAL:mat;
     put(cx+a,y,cz+c,tint,false,tint===BLOCK.CRYSTAL?'accent':id>=5?'crown':leafRole(mat));
   }
 };
 const dirs=[[1,0],[0,1],[-1,0],[0,-1]];
 const arm=(dx,dz,y,len,rise=0)=>{
   for(let d=1;d<=len;d++){trunk(dx*d,y,dz*d);if(rise&&d===len)trunk(dx*d,y+1,dz*d);}
 };
 const wide=id===2||id===9;
 // Widen shafts above a supported taper; ordinary stems stay below the crown.
 // Root-bearing base cells remain subject to the original whole-plan veto.
 for(let y=1;y<=h;y++){
   trunk(0,y,0);
   if(wide&&y<h-5){trunk(1,y,0);trunk(0,y,1);trunk(1,y,1);}
   if(id<5&&y>=2&&y<h-8&&(wide||id===0||id===4))trunk(-1,y,0);
   if(id>=5&&y>=2&&y<h-5){trunk(1,y,0);if(id===6||id===9)trunk(0,y,1);}
   if(wide&&y>=2&&y<h-12){trunk(0,y,-1);trunk(-1,y,0);}
 }
 if(id<5){
   for(const [dx,dz] of dirs){trunk(dx,1,dz);if(wide)trunk(dx*2,1,dz);trunk(dx,2,dz);}
   if(id===0){for(const [i,r] of [[-9,4],[-5,5],[-1,4],[1,3],[2,2]]){for(const [dx,dz] of dirs)arm(dx,dz,h+i,Math.min(2,r));disk(0,h+i,0,r,i<0?amethyst:moon,1);if(i<0)disk(0,h+i+1,0,Math.max(1,r-1),moon,1);}}
   if(id===1){for(const [dx,dz] of dirs){arm(dx,dz,h-3,3,1);disk(dx*3,h-2,dz*3,2,moon);for(let y=h-5;y<h-2;y++)put(dx*4,y,dz*4,moon);}disk(0,h-1,0,5,moon);disk(0,h,0,5,moon);disk(0,h+1,0,3,amethyst);}
   if(id===2){for(const [i,[dx,dz]] of dirs.entries()){const level=h-15+(i%2)*3;arm(dx,dz,level,4,1);disk(dx*4,level+1,dz*4,3,moon);disk(dx*4,level+2,dz*4,2,amethyst);}
     for(const [dx,dz] of dirs){arm(dx,dz,h-6,4,1);disk(dx*4,h-5,dz*4,3,moon);disk(dx*4,h-4,dz*4,2,amethyst);}disk(0,h-3,0,5,moon);disk(0,h-2,0,6,moon);disk(0,h-1,0,6,moon);disk(0,h,0,5,amethyst);disk(0,h+1,0,4,moon);disk(0,h+2,0,2,moon);}
   if(id===3){for(let i=0;i<4;i++){const [dx,dz]=dirs[(i+variant)%4];const y=h-7+i*2;arm(dx,dz,y,3,1);disk(dx*3,y+1,dz*3,3,amethyst,1);disk(dx*3,y+2,dz*3,2,amethyst);}disk(0,h+1,0,2,moon);}
   if(id===4){for(const [dx,dz] of dirs){arm(dx,dz,h-4,3,1);disk(dx*3,h-3,dz*3,2,moon);put(dx*3,h-2,dz*3,BLOCK.CRYSTAL);}disk(0,h-2,0,5,moon,1);disk(0,h-1,0,5,moon,1);disk(0,h,0,4,moon);disk(0,h+1,0,3,moon);put(0,h+2,0,BLOCK.CRYSTAL);}
 }else{
   // Fungal forms: physical block shelves and gills, not ordinary red spotted caps.
   const cap=(cx,y,cz,r,mat)=>{
     disk(cx,y,cz,r,mat);disk(cx,y+1,cz,Math.max(1,r-1),mat);
     // Connected radial ribs distinguish a fungal underside from leaf plates.
     const rib=id===6||id===8||id===9?G.gneiss:moon;
     for(const [dx,dz] of dirs)for(let d=1;d<r;d++)put(cx+dx*d,y-1,cz+dz*d,rib,false,'secondary');
     if(r>=5)for(const [dx,dz] of dirs)for(let d=2;d<r-1;d++)put(cx+dx*d,y-2,cz+dz*d,rib,false,'secondary');
   };
   if(id===5){for(let i=0;i<3;i++){const [dx,dz]=dirs[(i+variant)%4],y=h-9+i*4;arm(dx,dz,y,2);cap(dx*2,y,dz*2,3,i===1?moon:amethyst);}cap(0,h,0,4,moon);}
   if(id===6){cap(0,h-1,0,7,amethyst);disk(0,h+1,0,5,amethyst);disk(0,h+2,0,3,moon);}
   if(id===7){for(const [i,[dx,dz]] of dirs.entries()){const y=h-6+(i%2)*2;arm(dx,dz,y,3,1);for(let b=y+1;b<=y+2;b++)trunk(dx*3,b,dz*3);cap(dx*3,y+2,dz*3,3,moon);}cap(0,h,0,4,amethyst);}
   if(id===8){for(let i=0;i<5;i++){const [dx,dz]=dirs[(i+variant)%4],y=h-16+i*4;arm(dx,dz,y,2);cap(dx*2,y,dz*2,3,moon);}cap(0,h,0,4,amethyst);}
   if(id===9){cap(0,h-2,0,7,amethyst);disk(0,h-1,0,7,amethyst);disk(0,h,0,6,amethyst);disk(0,h+1,0,4,moon);disk(0,h+2,0,2,moon);for(const [dx,dz] of dirs)for(let d=3;d<=6;d++)put(dx*d,h-4,dz*d,BLOCK.CRYSTAL);}
 }
 if(rows.size>WILDS_MAX_CELLS)throw Error('Wilds cell budget exceeded');
 return Object.freeze({family:f.name,id,height:h,origin:Object.freeze([x,floor,z]),footprint:Object.freeze([...footprint].map(k=>{const [a,,c]=k.split(',').map(Number);return Object.freeze([x+a,z+c]);})),cells:Object.freeze([...rows.values()].map(Object.freeze)),materialSymbols:Object.freeze([...rows.keys()].map(k=>palette[roles.get(k)].symbol))});
}
