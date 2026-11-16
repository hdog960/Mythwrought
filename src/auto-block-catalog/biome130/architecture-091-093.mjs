// M8 physical biome architecture candidates 091–093. Isolated, opt-in; no live registration.
const definitions=[
 {ordinal:91,name:'Desert adobe masonry',kind:'straw-reinforced-sunbaked-adobe',palette:['#a86c45','#c18a58','#d7a46c','#e2bc86','#785440'],hardness:3,attachment:'ground',boxes:[[.02,.02,.02,.98,.94,.98],[.08,.94,.09,.91,.99,.9],[.03,.39,.02,.97,.45,.12],[.03,.39,.88,.97,.45,.98],[.46,.02,.02,.53,.35,.08],[.46,.48,.92,.53,.88,.98]]},
 {ordinal:92,name:'Sandstone windcatcher grilles',kind:'directional-open-air-sandstone-lattice',palette:['#8c6146','#c19165','#e3bb84','#f0d7a3','#685344'],hardness:4,attachment:'wall',boxes:[[.03,.03,.04,.19,.97,.96],[.81,.03,.04,.97,.97,.96],[.19,.03,.04,.81,.18,.96],[.19,.82,.04,.81,.97,.96],[.3,.18,.43,.4,.82,.58],[.6,.18,.43,.7,.82,.58],[.19,.43,.43,.81,.54,.58]]},
 {ordinal:93,name:'Sandstone sunshade louvers',kind:'angled-solar-baffle-array',palette:['#936848','#c49b6d','#e4c397','#f3dfb5','#6f5947'],hardness:4,attachment:'wall',boxes:[[.04,.05,.04,.16,.95,.96],[.84,.05,.04,.96,.95,.96],[.16,.12,.17,.84,.23,.83],[.16,.35,.12,.84,.46,.79],[.16,.58,.07,.84,.69,.74],[.16,.81,.02,.84,.92,.69]]}
];
export const BIOME_ARCHITECTURE_091_093=Object.freeze(definitions.map(d=>Object.freeze({...d,symbolicId:'biome130:'+String(d.ordinal).padStart(3,'0'),futureOnlyId:255+d.ordinal,selectable:true,replaceable:true,solid:true,collision:'occupied',rotationCount:4,opacity:1,boxes:Object.freeze(d.boxes.map(b=>Object.freeze(b))),palette:Object.freeze(d.palette)})));
export function architectureBoxes(asset,rotation=0){
 if(!BIOME_ARCHITECTURE_091_093.includes(asset)||!Number.isInteger(rotation)||rotation<0||rotation>3)throw new RangeError('unknown architecture candidate or rotation');
 return asset.boxes.map(box=>{let [x0,y0,z0,x1,y1,z1]=box;for(let i=0;i<rotation;i++)[x0,z0,x1,z1]=[1-z1,x0,1-z0,x1];return [x0,y0,z0,x1,y1,z1].map(n=>+n.toFixed(6));});
}
export function architectureSample(asset,x,y,z,face=0){
 if(!BIOME_ARCHITECTURE_091_093.includes(asset)||![x,y,z,face].every(Number.isInteger))throw new TypeError('invalid material sample');
 const h=(Math.imul((x|0)^asset.ordinal,73856093)^Math.imul(y|0,19349663)^Math.imul(z|0,83492791)^Math.imul(face+asset.ordinal,2654435761))>>>0;
 return asset.palette[h%asset.palette.length];
}
export function architectureMesh(asset,rotation=0){
 const vertices=[],indices=[];
 for(const b of architectureBoxes(asset,rotation)){
  const corners=[[b[0],b[1],b[2]],[b[3],b[1],b[2]],[b[3],b[4],b[2]],[b[0],b[4],b[2]],[b[0],b[1],b[5]],[b[3],b[1],b[5]],[b[3],b[4],b[5]],[b[0],b[4],b[5]]];
  for(const face of [[0,3,2,1],[5,6,7,4],[4,7,3,0],[1,2,6,5],[3,7,6,2],[4,0,1,5]]){
   const start=vertices.length/3;for(const i of face)vertices.push(...corners[i]);
   indices.push(start,start+1,start+2,start,start+2,start+3);
  }
 }
 return {vertices,indices};
}
export function architectureEditFixture(asset,rotation=0){
 architectureBoxes(asset,rotation);
 const cell={symbolicId:asset.symbolicId,rotation},placed=new Map([['2,3,4',cell]]);
 const saved=JSON.stringify([...placed]),restored=new Map(JSON.parse(saved));
 const selected=restored.get('2,3,4');restored.delete('2,3,4');
 return {saved,selected,removed:!restored.has('2,3,4')};
}
