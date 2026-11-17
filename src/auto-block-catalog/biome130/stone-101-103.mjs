// :12 M9 raw geological stones #101-103. Symbolic, opt-in candidate assets only.
// Natural fracture/vein/ridge occupancy; not manufactured masonry or shader aliases.
const source=[
 {ordinal:101,name:'Granite',geology:'interlocking-feldspar-quartz-mica',hardness:7,fracture:'coarse-angular',palette:['#807c78','#c0ada2','#ded1c0','#58595e','#a58d87'],boxes:[[.03,.02,.06,.94,.77,.95],[.12,.77,.13,.83,.94,.82],[.03,.28,.02,.15,.66,.57],[.78,.25,.73,.98,.7,.93],[.24,.78,.19,.44,.99,.46],[.49,.76,.57,.72,.92,.9]],veins:[[.15,.31,.07,.25,.42,.09],[.58,.68,.89,.83,.74,.94]]},
 {ordinal:102,name:'Marble',geology:'metamorphic-calcite-folded-veins',hardness:5,fracture:'rounded-cleavage',palette:['#e6dfd0','#c3c5bb','#8b9994','#f5eee2','#acb6aa'],boxes:[[.05,.02,.04,.95,.85,.96],[.11,.85,.14,.9,.95,.87],[.02,.24,.19,.13,.71,.8],[.84,.15,.12,.98,.67,.71],[.24,.86,.1,.77,.99,.39]],veins:[[.13,.41,.03,.36,.49,.08],[.38,.49,.03,.64,.55,.08],[.65,.56,.03,.91,.63,.08],[.22,.29,.93,.61,.38,.98]]},
 {ordinal:103,name:'Limestone',geology:'fossiliferous-bedded-sediment',hardness:4,fracture:'bedded-undercut',palette:['#c8bf9d','#a49d80','#e0d5b5','#8c8974','#d4c9a8'],boxes:[[.04,.03,.08,.94,.31,.96],[.1,.31,.12,.9,.6,.91],[.03,.6,.05,.96,.83,.98],[.15,.83,.17,.85,.95,.81],[.02,.18,.22,.13,.49,.72],[.86,.36,.14,.98,.72,.82]],veins:[[.1,.3,.05,.82,.34,.09],[.08,.59,.12,.92,.63,.18],[.11,.82,.08,.89,.86,.15]]}
];
export const NATURAL_STONE_101_103=Object.freeze(source.map(d=>Object.freeze({...d,
 symbolicId:'biome130:'+String(d.ordinal).padStart(3,'0'),futureOnlyId:255+d.ordinal,
 selectable:true,replaceable:true,solid:true,collision:'occupied',attachment:'ground',
 rotationCount:4,opacity:1,transparent:false,
 boxes:Object.freeze(d.boxes.map(b=>Object.freeze(b))),veins:Object.freeze(d.veins.map(b=>Object.freeze(b))),palette:Object.freeze(d.palette)
})));
function requireAsset(asset){if(!NATURAL_STONE_101_103.includes(asset))throw new TypeError('unknown raw stone');}
export function stoneBoxes(asset,rotation=0){
 requireAsset(asset);if(!Number.isInteger(rotation)||rotation<0||rotation>3)throw new RangeError('rotation must be 0-3');
 return asset.boxes.map(b=>{let [x0,y0,z0,x1,y1,z1]=b;for(let i=0;i<rotation;i++)[x0,z0,x1,z1]=[1-z1,x0,1-z0,x1];return [x0,y0,z0,x1,y1,z1].map(v=>+v.toFixed(6));});
}
export function stoneSample(asset,x,y,z,face=0){
 requireAsset(asset);if(![x,y,z,face].every(Number.isInteger))throw new TypeError('integer sample coordinates required');
 const h=(Math.imul(x^asset.ordinal,73856093)^Math.imul(y,19349663)^Math.imul(z,83492791)^Math.imul(face+asset.ordinal,2654435761))>>>0;
 return asset.palette[h%asset.palette.length];
}
export function stoneMesh(asset,rotation=0){
 const vertices=[],indices=[];
 for(const b of stoneBoxes(asset,rotation)){
  const c=[[b[0],b[1],b[2]],[b[3],b[1],b[2]],[b[3],b[4],b[2]],[b[0],b[4],b[2]],[b[0],b[1],b[5]],[b[3],b[1],b[5]],[b[3],b[4],b[5]],[b[0],b[4],b[5]]];
  for(const f of [[0,3,2,1],[5,6,7,4],[4,7,3,0],[1,2,6,5],[3,7,6,2],[4,0,1,5]]){const s=vertices.length/3;for(const i of f)vertices.push(...c[i]);indices.push(s,s+1,s+2,s,s+2,s+3);}
 }
 return {vertices,indices};
}
// Deliberately NOT the production schema-1 save format.
export function stoneEditFixture(asset,rotation=0){
 stoneBoxes(asset,rotation);const cell={symbolicId:asset.symbolicId,rotation};
 const placed=new Map([['2,3,4',cell]]),saved=JSON.stringify([...placed]),restored=new Map(JSON.parse(saved));
 const selected=restored.get('2,3,4');restored.delete('2,3,4');
 return {saved,selected,removed:!restored.has('2,3,4')};
}
