// M4 mountain geology: independent symbolic physical candidates; never registered live.
const raw = [
 {ordinal:46,name:'Angular talus scree',kind:'talus',palette:['#353d4a','#58616a','#82847d','#b2aa91'],boxes:[[.08,.02,.12,.56,.37,.64],[.44,.02,.28,.93,.26,.91],[.24,.27,.22,.68,.54,.65]],hardness:2},
 {ordinal:47,name:'Fractured cliffstone',kind:'cliff',palette:['#343c48','#616875','#9ca3a4','#c9c0a9'],boxes:[[0,0,0,1,.91,1],[.06,.91,.09,.44,1,.46],[.55,.91,.48,.92,1,.94]],hardness:4},
 {ordinal:48,name:'Layered sedimentary rock',kind:'strata',palette:['#514c46','#796c5c','#b19b7e','#d2bea0'],boxes:[[0,0,0,1,.22,1],[.05,.22,.02,.97,.46,.98],[0,.46,.04,1,.69,.96],[.03,.69,0,.98,.93,1]],hardness:3}
];
export const MOUNTAIN_FOUNDATIONS=Object.freeze(raw.map(s=>Object.freeze({...s,id:'biome130:'+String(s.ordinal).padStart(3,'0'),prospectiveId:255+s.ordinal,selectable:true,replaceable:true,solid:true,collision:'occupied',attachment:'ground',opacity:'opaque',rotationCount:4,boxes:Object.freeze(s.boxes.map(b=>Object.freeze(b))),palette:Object.freeze(s.palette)})));
export function mountainBoxes(asset,rotation=0){
 if(!MOUNTAIN_FOUNDATIONS.includes(asset)||!Number.isInteger(rotation)||rotation<0||rotation>3)throw new RangeError('invalid candidate/rotation');
 return asset.boxes.map(b=>{let [x0,y0,z0,x1,y1,z1]=b;for(let i=0;i<rotation;i++)[x0,z0,x1,z1]=[1-z1,x0,1-z0,x1];return [x0,y0,z0,x1,y1,z1].map(n=>+n.toFixed(6));});
}
export function mountainSurface(asset,x,y,z,face=0){
 if(!MOUNTAIN_FOUNDATIONS.includes(asset)||![x,y,z,face].every(Number.isInteger))throw new TypeError('invalid sample');
 const h=(Math.imul(x^asset.ordinal,73856093)^Math.imul(y,19349663)^Math.imul(z,83492791)^Math.imul(face,2654435761))>>>0;
 return asset.palette[h%asset.palette.length];
}
export function mountainMesh(asset,rotation=0){
 const vertices=[],indices=[];
 const faces=[[[0,0,0],[0,0,1],[0,1,1],[0,1,0]],[[1,0,1],[1,0,0],[1,1,0],[1,1,1]],[[0,0,1],[1,0,1],[1,1,1],[0,1,1]],[[1,0,0],[0,0,0],[0,1,0],[1,1,0]],[[0,1,1],[1,1,1],[1,1,0],[0,1,0]],[[0,0,0],[1,0,0],[1,0,1],[0,0,1]]];
 for(const b of mountainBoxes(asset,rotation))for(const f of faces){const start=vertices.length/3;for(const p of f)vertices.push(b[0]+p[0]*(b[3]-b[0]),b[1]+p[1]*(b[4]-b[1]),b[2]+p[2]*(b[5]-b[2]));indices.push(start,start+1,start+2,start,start+2,start+3);}
 return {vertices,indices}; // Isolated geometry prototype; internal faces not culled.
}
export function mountainEditFixture(asset,rotation=0){
 mountainBoxes(asset,rotation);
 const cells=new Map([['0,0,0',{symbolicId:asset.id,rotation}]]);
 const snapshot=JSON.stringify([...cells]);const restored=new Map(JSON.parse(snapshot));
 const selected=restored.get('0,0,0');restored.delete('0,0,0');
 return {snapshot,selected,removed:!restored.has('0,0,0')};
}
