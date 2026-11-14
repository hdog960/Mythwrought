/** Pack 5 M3 commercial fixtures. Isolated physical candidates, not gameplay shops. */
import {validatePhysicalDescriptor,rotateCellOffset,rotateLocalBox} from './fixture.mjs';
const piece=(x0,y0,z0,x1,y1,z1,material)=>({box:[x0,y0,z0,x1,y1,z1],material});
export const SHOP_MATERIALS=Object.freeze({
  walnut:[.39,.23,.15,1], cedar:[.58,.34,.21,1],gold:[.82,.65,.30,1],linen:[.90,.82,.63,1],
  indigo:[.28,.37,.60,1],terra:[.68,.37,.24,1],oak:[.72,.52,.31,1],bronze:[.71,.51,.26,1],
  ash:[.72,.70,.62,1],shadow:[.25,.16,.13,1],sage:[.41,.60,.46,1],marble:[.85,.81,.69,1]
});
function define(id,name,variant,art){
 if(art.length<9||art.length>64)throw Error('Physical fixture exceeds authored box budget');
 const boxArr=art.map(p=>[...p.box]);
 const d={symbolicId:id,name,variant,attachment:'floor',numericId:undefined,integrated:false,
    parts:[{cell:[0,0,0],boxes:boxArr,collisionBoxes:boxArr.map(b=>[...b])}],
    art:[{cell:[0,0,0],details:art.map(p=>({box:[...p.box],material:p.material}))}],
    sourceOnly:true,inventory:false,trade:false,crafting:false};
 validatePhysicalDescriptor(d);return d;
}
const LEG=[.08,.80];
function legs(art,wood='walnut',height=.76){
 for(const x of LEG)for(const z of LEG){
   art.push(piece(x,.04,z,x+.115,height,z+.115,wood));
   art.push(piece(x-.01,.07,z-.01,x+.125,.13,z+.125,'bronze'));
 }
}
function counter(variant){
 if(!['ledger-service','festival-fascia'].includes(variant))throw Error('Unknown shop counter variant');
 const festival=variant==='festival-fascia',art=[];
 const top=festival?.80:.75;
 legs(art,festival?'cedar':'walnut',top);
 // Worktop over a usable void on the vendor-facing -Z side, NOT a solid tabletop cube.
 art.push(piece(.045,top-.05,.045,.955,top+.04,.955,festival?'oak':'marble'));
 art.push(piece(.09,.21,.16,.91,.275,.72,'cedar'));
 for(const y of [.30,.52])art.push(piece(.09,y,.16,.91,y+.04,.27,'walnut'));
 // Full shopfront fascia on +Z, carefully split into physical planks.
 for(let row=0;row<3;row++){
   const y=.19+row*.17;
   art.push(piece(.10,y,.85,.90,y+.15,.925,festival?'terra':'walnut'));
   art.push(piece(.13,y+.034,.927,.87,y+.049,.952,festival?'gold':'cedar'));
 }
 for(const x of [.09,.86]){
   art.push(piece(x,.19,.83,x+.055,top,.96,'bronze'));
   art.push(piece(x,.20,.11,x+.050,top-.03,.17,'cedar'));
 }
 if(festival){
   // Original heraldic counter: hanging scallops and colored facing panels.
   for(let n=0;n<4;n++){
     const x=.15+n*.18;
     art.push(piece(x,.45,.952,x+.14,.61,.982,n%2?'indigo':'sage'));
     art.push(piece(x+.05,.41,.97,x+.085,.46,.99,'linen'));
   }
   art.push(piece(.20,top+.04,.12,.80,top+.085,.26,'gold'));
 }else{
   // Ledger desk: raised brass receipt rail and two inset accounts ledges.
   art.push(piece(.19,top+.04,.18,.81,top+.095,.235,'bronze'));
   for(const z of [.30,.46])art.push(piece(.21,top+.04,z,.79,top+.065,z+.075,'cedar'));
   art.push(piece(.42,.28,.10,.58,.45,.18,'ash'));
 }
 return define('pack5:086','Shop Counters',variant,art);
}
function display(variant){
 if(!['stepped-market-tray','curio-arcade'].includes(variant))throw Error('Unknown commercial display fixture');
 const arcade=variant==='curio-arcade',art=[];
 // Slender freestanding rack: front open slots, physically separate shelves/trays.
 for(const x of [.09,.83])for(const z of [.10,.82]){
   art.push(piece(x,.025,z,x+.075,.95,z+.075,arcade?'walnut':'cedar'));
   art.push(piece(x-.01,.065,z-.01,x+.085,.115,z+.085,'bronze'));
 }
 art.push(piece(.10,.05,.10,.91,.115,.90,'walnut'));
 if(!arcade){
   // Three tiered empty product trays ascend to the back, each with a raised retaining lip.
   for(let row=0;row<3;row++){
     const y=.23+row*.23,z=.15+row*.22;
     art.push(piece(.14,y,z,.86,y+.055,Math.min(.95,z+.26),'oak'));
     art.push(piece(.14,y+.055,Math.min(.95,z+.215),.86,y+.096,Math.min(.97,z+.255),'bronze'));
     for(const x of [.16,.81])art.push(piece(x,y+.055,z,x+.035,y+.092,Math.min(.95,z+.23),'cedar'));
   }
   for(const x of [.21,.73])art.push(piece(x,.16,.12,x+.058,.87,.18,'cedar'));
 }else{
   // Three open curio bays with physically distinct plinths, back splines and arch-like lintels.
   for(let row=0;row<3;row++){
     const y=.22+row*.22;
     art.push(piece(.12,y,.12,.90,y+.052,.88,row%2?'marble':'oak'));
     art.push(piece(.15,y+.052,.83,.87,y+.085,.89,'gold'));
     for(const x of [.17,.48,.79]){
       art.push(piece(x,y+.07,.46,x+.055,y+.117,.59,'bronze'));
     }
   }
   art.push(piece(.13,.87,.10,.88,.94,.87,'walnut'));
   art.push(piece(.23,.94,.16,.77,.98,.82,'gold'));
 }
 // Deliberately open front: not a storage/bookshelf, no merchandise objects.
 return define('pack5:087','Display Shelves',variant,art);
}
export const SHOP_VARIANTS=Object.freeze({
 'pack5:086':['ledger-service','festival-fascia'],
 'pack5:087':['stepped-market-tray','curio-arcade']
});
const factories={'pack5:086':counter,'pack5:087':display};
export function getShopFixture(symbolicId,variant){
 if(!Object.hasOwn(factories,symbolicId)||!SHOP_VARIANTS[symbolicId].includes(variant))throw Error('Unknown M3 shop fixture');
 return factories[symbolicId](variant);
}
export const SHOP_FIXTURES=Object.freeze(Object.entries(SHOP_VARIANTS).flatMap(([id,v])=>v.map(x=>getShopFixture(id,x))));
export const SHOP_FAMILIES=Object.freeze(Object.keys(SHOP_VARIANTS).map(id=>{
 const variants=SHOP_VARIANTS[id].map(v=>getShopFixture(id,v));
 return {...variants[0],variants:variants.slice(1).map(v=>({variant:v.variant,parts:v.parts,art:v.art}))};
}));
const FACES=[
 [[1,0,0],[1,1,0],[1,1,1],[1,0,1]],[[0,0,1],[0,1,1],[0,1,0],[0,0,0]],
 [[0,1,1],[1,1,1],[1,1,0],[0,1,0]],[[0,0,0],[1,0,0],[1,0,1],[0,0,1]],
 [[1,0,1],[1,1,1],[0,1,1],[0,0,1]],[[0,0,0],[0,1,0],[1,1,0],[1,0,0]]
];
/** Preview-only triangle data from the actual authored collision volumes. */
export function shopBoxMesh(d,{rotation=0}={}){
 validatePhysicalDescriptor(d);
 if(!Number.isInteger(rotation)||rotation<0||rotation>3||!Array.isArray(d.art)||d.art.length!==d.parts.length)throw Error('Invalid shop mesh request');
 const positions=[],colors=[],indices=[];let n=0;
 for(const record of d.art){const cell=rotateCellOffset(record.cell,rotation);
  for(const detail of record.details){const box=rotateLocalBox(detail.box,rotation),rgba=SHOP_MATERIALS[detail.material];
   if(!rgba)throw Error('Unknown shop material');
   for(const quad of FACES){for(const v of quad){positions.push((v[0]?box[3]:box[0])+cell[0],(v[1]?box[4]:box[1])+cell[1],(v[2]?box[5]:box[2])+cell[2]);colors.push(...rgba)}
    indices.push(n,n+1,n+2,n,n+2,n+3);n+=4;}
  }
 }
 if(n>1536)throw Error('Mobile preview mesh budget exceeded');
 return {positions:new Float32Array(positions),colors:new Float32Array(colors),indices:new Uint16Array(indices),vertexCount:n,triangles:indices.length/3};
}
