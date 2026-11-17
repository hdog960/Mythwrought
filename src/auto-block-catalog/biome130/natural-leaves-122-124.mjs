// Issue #117 M11: isolated natural foliage cells, not assembled trees or decorative hedge blocks.
const species=[
 {ordinal:122,name:'Oak leaf clusters',profile:'lobed broadleaf crown with offset branch pockets',palette:['#244b2d','#3f7435','#619443','#8caa4b','#b6a75c'],alpha:'cutout',stem:[.43,.12,.43,.57,.77,.57],lobes:[[.12,.36,.19,.44,.76,.81],[.43,.53,.12,.82,.92,.43],[.57,.24,.46,.93,.71,.89],[.2,.49,.48,.62,.95,.92]],density:.78},
 {ordinal:123,name:'Birch leaf canopies',profile:'airy drooping fine leaf sprays',palette:['#426e36','#77a64d','#9dc66b','#c2d57d','#d4b868'],alpha:'cutout',stem:[.47,.1,.45,.54,.69,.55],lobes:[[.2,.45,.15,.37,.85,.36],[.57,.28,.19,.76,.79,.4],[.12,.19,.59,.39,.67,.84],[.6,.4,.62,.88,.9,.82],[.36,.65,.34,.65,.98,.63]],density:.48},
 {ordinal:124,name:'Pine needle clusters',profile:'radial conifer needle tufts around woody axis',palette:['#183f35','#255a44','#397157','#54846a','#927f4b'],alpha:'cutout',stem:[.46,.05,.45,.54,.94,.55],lobes:[[.12,.18,.37,.88,.33,.64],[.18,.36,.1,.81,.53,.9],[.12,.57,.32,.88,.73,.7],[.3,.75,.14,.7,.92,.86],[.36,.32,.12,.65,.69,.88]],density:.92}
];
const freezeBoxes=boxes=>Object.freeze(boxes.map(b=>Object.freeze(b)));
export const NATURAL_LEAVES_122_124=Object.freeze(species.map(s=>Object.freeze({...s,symbolicId:'biome130:'+s.ordinal,futureOnlyId:255+s.ordinal,selectable:true,replaceable:true,solid:false,collision:'none',selection:'occupied-boxes',attachment:'wood-face',rotationCount:4,transparent:true,stem:Object.freeze(s.stem),lobes:freezeBoxes(s.lobes),palette:Object.freeze(s.palette)})));
function validate(a){if(!NATURAL_LEAVES_122_124.includes(a))throw new TypeError('unknown natural leaf descriptor');}
function rotation(r){if(!Number.isInteger(r)||r<0||r>3)throw new RangeError('rotation 0..3 required');}
function turn(b,r){let [x,y,z,X,Y,Z]=b;for(let i=0;i<r;i++)[x,z,X,Z]=[1-Z,x,1-z,X];return [x,y,z,X,Y,Z];}
export function naturalLeafBoxes(a,r=0){validate(a);rotation(r);return [a.stem,...a.lobes].map(b=>turn(b,r));}
export function naturalLeafSample(a,x,y,z,face=0){validate(a);if(![x,y,z,face].every(Number.isInteger))throw new TypeError('integer coordinates required');const h=(Math.imul(x+a.ordinal,73856093)^Math.imul(y,19349663)^Math.imul(z,83492791)^Math.imul(face+13,2654435761))>>>0;return {color:a.palette[h%a.palette.length],visible:(h%1000)<Math.round(a.density*1000)};}
export function naturalLeafMesh(a,r=0){
 const vertices=[],indices=[];for(const [x,y,z,X,Y,Z] of naturalLeafBoxes(a,r)){
 const p=[[x,y,z],[X,y,z],[X,Y,z],[x,Y,z],[x,y,Z],[X,y,Z],[X,Y,Z],[x,Y,Z]];
 for(const f of [[0,3,2,1],[5,6,7,4],[4,7,3,0],[1,2,6,5],[3,7,6,2],[4,0,1,5]]){const n=vertices.length/3;for(const i of f)vertices.push(...p[i]);indices.push(n,n+1,n+2,n,n+2,n+3);}
 }return {vertices,indices,alphaMode:a.alpha,collision:a.collision};
}
// Symbolic fixture only; production save schema and world registry are untouched.
export function naturalLeafEditFixture(a,r=0){naturalLeafBoxes(a,r);const cells=new Map([['2,3,4',{symbolicId:a.symbolicId,rotation:r}]]);const saved=JSON.stringify([...cells]);const restored=new Map(JSON.parse(saved));const selected=restored.get('2,3,4');restored.delete('2,3,4');return {saved,selected,removed:!restored.has('2,3,4')};}
// Future-only numeric reservations 377-379. No production registration.
