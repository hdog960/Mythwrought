// E7 monumental geometry authoring. Deliberately not mounted into the chunk
// source until multi-owner terrain, entrance and residency admission passes.
import {BLOCK} from '../voxel.mjs';
import {ENVIRONMENT_GROUND as G} from '../environment-ground.mjs';
import {PHYSICAL_MAX_Y} from '../world-height.mjs';
export const WILDS_MONUMENTS=Object.freeze([
 {id:12,name:'Amethyst Observatory',radius:8,height:12},
 {id:13,name:'Ancient Root Temple',radius:10,height:14},
 {id:14,name:'Sanctuary of the Three Moons',radius:10,height:13},
 {id:15,name:'Starfall Altar',radius:8,height:10},
 {id:16,name:'Overgrown Arcane Library',radius:10,height:12},
 {id:17,name:'Cathedral of the Ancientwood',radius:16,height:26},
 {id:18,name:'Great Titanveil Sanctuary',radius:14,height:30},
 {id:19,name:'The Celestial Heart',radius:15,height:27}
].map(Object.freeze));
const key=(...p)=>p.join(',');
export function buildWildsMonument(id,x,floor,z,turn=0){
 const spec=WILDS_MONUMENTS[id-12];if(!spec||![x,floor,z,turn].every(Number.isSafeInteger)||turn<0||turn>3)throw Error('Invalid Wilds monument');
 if(floor+spec.height>PHYSICAL_MAX_Y)return null;
 const cells=new Map(),feet=new Map(),reserved=new Map();
 const rot=(a,c)=>[[a,c],[-c,a],[-a,-c],[c,-a]][turn];
 const pos=(a,b,c)=>{const [u,v]=rot(a,c);return [x+u,floor+b,z+v];};
 const put=(a,b,c,m)=>{
  if(Math.abs(a)>spec.radius||Math.abs(c)>spec.radius||b<1||b>spec.height)throw Error('Monument outside own bounds');
  const p=pos(a,b,c);if(reserved.has(key(...p)))throw Error('Monument blocked approach');
  cells.set(key(...p),[...p,m]);if(b===1)feet.set(key(p[0],p[2]),[p[0],p[2]]);
 };
 // Actual traversable route: 3-wide, 3-high through the full entrance,
 // into a five-wide central chamber. Ground support is a future admission gate.
 for(let a=-1;a<=1;a++)for(let c=-spec.radius;c<=2;c++)for(let b=1;b<=3;b++){const p=pos(a,b,c);reserved.set(key(...p),p);}
 for(let a=-2;a<=2;a++)for(let c=-2;c<=2;c++)for(let b=1;b<=3;b++){const p=pos(a,b,c);reserved.set(key(...p),p);}
 const stone=G.slate,ivory=G.gneiss,bark=G.aetherBark,leaf=G.moonLeaves,violet=G.aetherLeaves,crystal=BLOCK.CRYSTAL;
 const col=(a,c,h,m=stone)=>{for(let b=1;b<=h;b++)put(a,b,c,m);};
 const beam=(a0,a1,b,c,m=stone)=>{for(let a=a0;a<=a1;a++)put(a,b,c,m);};
 const cross=(c0,c1,b,a,m=stone)=>{for(let c=c0;c<=c1;c++)put(a,b,c,m);};
 const disk=(a,c,b,r,m)=>{for(let u=-r;u<=r;u++)for(let v=-r;v<=r;v++)if(u*u+v*v<=r*r)put(a+u,b,c+v,m);};
 const arch=(r,c,h,m=stone)=>{col(-r,c,h,m);col(r,c,h,m);beam(-r,r,h,c,m);beam(-r+1,r-1,h+1,c,ivory);};
 if(id===12){for(const a of [-5,5])for(const c of [-4,4])col(a,c,7);for(let c=-4;c<=4;c++)beam(-5,5,7,c,stone);for(let b=8;b<=11;b++)disk(0,0,b,12-b,violet);put(0,12,0,crystal);}
 if(id===13){for(const a of [-7,7])for(const c of [-6,0,6]){col(a,c,8,bark);col(a-Math.sign(a),c,5,bark);beam(-7,7,8,c,bark);beam(-5,5,9,c,leaf);}for(const a of [-7,7])cross(-6,6,8,a,bark);disk(0,0,10,4,leaf);disk(0,0,11,3,violet);put(0,12,0,crystal);}
 if(id===14){for(const a of [-6,0,6]){const c=6;col(a,c,6,ivory);for(let b=7;b<=11;b++)for(let u=-2;u<=2;u++)if(u*u+(b-9)**2<=5)put(a+u,b,c,leaf);put(a,12,c,crystal);}arch(5,-4,5);for(const a of [-5,5])cross(-4,6,5,a,stone);}
 if(id===15){for(const [a,c] of [[-5,-4],[5,-4],[-5,4],[5,4]]){col(a,c,4);put(a,5,c,crystal);}for(let a=-2;a<=2;a++)for(let c=4;c<=6;c++)put(a,1,c,ivory);for(let b=2;b<=8;b++)put(0,b,5,crystal);beam(-2,2,3,5,stone);}
 if(id===16){for(const a of [-7,7])for(const c of [-6,0,6])col(a,c,7);for(const a of [-7,7]){for(let c=-5;c<=5;c++)for(let b=1;b<=4;b++)if((c+b)%3!==0)put(a,b,c,bark);cross(-6,6,7,a,stone);}for(const c of [-6,0,6])beam(-7,7,7,c,stone);for(let a=-5;a<=5;a++)if(a%2===0){put(a,8,6,leaf);put(a,9,6,violet);}}
 if(id===17){for(const c of [-12,-4,4,12]){arch(10,c,17,bark);for(const a of [-10,10]){col(a-Math.sign(a),c,12,bark);put(a,18,c,crystal);}beam(-8,8,19,c,leaf);beam(-5,5,20,c,violet);}for(const a of [-10,10]){cross(-12,12,17,a,bark);for(let c=-12;c<=12;c++)if(c%3===0){col(a,c,5,stone);put(a,6,c,leaf);}}cross(-12,12,20,0,bark);for(let c=-10;c<=10;c+=5)put(0,21,c,crystal);}
 if(id===18){for(const a of [-5,5])for(const c of [-5,5]){col(a,c,16,ivory);for(let b=14;b<=16;b++)beam(-5,5,b,c,ivory);}for(const a of [-5,5])cross(-5,5,16,a,ivory);for(let a=-1;a<=1;a++)for(let c=-1;c<=1;c++)for(let b=5;b<=23;b++)put(a,b,c,ivory);for(let b=17;b<=23;b++)beam(-5,5,b,5,ivory);for(let c=0;c<=5;c++)put(0,23,c,ivory);for(let b=24;b<=27;b++)disk(0,0,b,35-b,violet);for(let b=28;b<=29;b++)disk(0,0,b,32-b,leaf);put(0,30,0,crystal);for(const a of [-5,5])for(let c=-4;c<=4;c++)put(a,3,c,stone);}
 if(id===19){for(const a of [-8,8])for(const c of [-7,7]){col(a,c,19,bark);col(a-Math.sign(a),c,15,bark);beam(-8,8,19,c,bark);beam(-6,6,20,c,leaf);}for(const a of [-8,8])cross(-7,7,19,a,bark);for(let b=21;b<=24;b++)disk(0,0,b,30-b,leaf);for(let b=25;b<=26;b++)disk(0,0,b,28-b,violet);put(0,27,0,crystal);for(let b=1;b<=9;b++)put(0,b,5,crystal);for(let a=-3;a<=3;a++)put(a,1,6,ivory);}
 if(cells.size>2400)throw Error('Monument physical cell budget');
 return Object.freeze({id,name:spec.name,origin:Object.freeze([x,floor,z]),turn,radius:spec.radius,height:spec.height,cells:Object.freeze([...cells.values()].map(Object.freeze)),footprint:Object.freeze([...feet.values()].map(Object.freeze)),approach:Object.freeze([...reserved.values()].map(Object.freeze))});
}
