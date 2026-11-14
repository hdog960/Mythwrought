/** Pack 5 M4 physical civic/interior fixtures only. Not gameplay, buildings or magic. */
import {validatePhysicalDescriptor,rotateLocalBox,rotateCellOffset} from './fixture.mjs';
const B=(x0,y0,z0,x1,y1,z1,m)=>({box:[x0,y0,z0,x1,y1,z1],material:m});
export const CIVIC_PALETTE=Object.freeze({
 oak:[.59,.39,.22,1],walnut:[.37,.23,.18,1],parchment:[.88,.80,.62,1],brass:[.83,.65,.34,1],
 slate:[.42,.46,.50,1],stone:[.68,.66,.57,1],marble:[.86,.82,.72,1],shadow:[.21,.20,.25,1],
 indigo:[.27,.29,.57,1],azure:[.24,.53,.68,1],red:[.67,.29,.28,1],gold:[.86,.69,.29,1],
 cream:[.94,.84,.65,1],sage:[.38,.60,.45,1],amethyst:[.54,.37,.68,1]
});
function define(symbolicId,name,variant,attachment,records){
 const parts=records.map(rec=>({cell:[...rec.cell],boxes:rec.art.map(x=>[...x.box]),collisionBoxes:rec.art.map(x=>[...x.box])}));
 const descriptor={symbolicId,name,variant,attachment,parts,art:records.map(rec=>({cell:[...rec.cell],details:rec.art.map(x=>({box:[...x.box],material:x.material}))})),
   integrated:false,numericId:undefined,sourceOnly:true,inventory:false,magic:false,trade:false,interaction:false};
 validatePhysicalDescriptor(descriptor);
 if(parts.some(x=>x.boxes.length>64))throw Error('M4 physical candidate exceeds 64 per-cell boxes');
 return descriptor;
}
function desk(variant){
 if(!['cartographers-oak-desk','moonstone-lectern'].includes(variant))throw Error('Unknown civic desk variant');
 const lectern=variant==='moonstone-lectern',a=[];
 if(!lectern){
  for(const x of [.09,.80])for(const z of [.11,.79])a.push(B(x,.04,z,x+.11,.74,z+.11,'walnut'));
  a.push(B(.065,.71,.06,.945,.80,.945,'oak'));
  a.push(B(.09,.80,.09,.91,.835,.91,'brass'));
  // Physical raised folded cartographer's map, ink guides and wooden instrument rail.
  a.push(B(.18,.838,.22,.74,.857,.66,'parchment'));
  for(const z of [.31,.43,.55])a.push(B(.22,.858,z,.69,.866,z+.021,'azure'));
  for(const x of [.30,.49,.64])a.push(B(x,.858,.27,x+.022,.865,.63,'red'));
  a.push(B(.13,.825,.76,.87,.858,.83,'walnut'));
  // Drawers are behind a side fascia; front knee space remains completely open.
  for(const y of [.33,.50]){
   a.push(B(.76,y,.72,.915,y+.13,.89,'oak'));
   a.push(B(.846,y+.065,.894,.88,y+.094,.935,'brass'));
  }
  a.push(B(.10,.63,.12,.19,.69,.90,'oak'));
 }else{
  // Tall lectern: cross-footed plinth, pillar, tiered angled manuscript support.
  a.push(B(.18,.04,.18,.82,.17,.82,'slate'));
  a.push(B(.30,.17,.30,.70,.55,.70,'marble'));
  for(const y of [.25,.40])a.push(B(.28,y,.28,.72,y+.044,.72,'gold'));
  a.push(B(.21,.55,.26,.79,.62,.83,'marble'));
  for(let i=0;i<3;i++){
   const y=.60+i*.075,z=.22+i*.07;
   a.push(B(.17,y,z,.83,y+.055,.90,'slate'));
  }
  a.push(B(.13,.785,.70,.87,.91,.87,'marble'));
  a.push(B(.21,.84,.31,.79,.868,.66,'parchment'));
  for(const x of [.31,.45,.59])a.push(B(x,.869,.34,x+.028,.879,.62,'indigo'));
  for(const x of [.17,.76])a.push(B(x,.90,.72,x+.065,.96,.83,'gold'));
 }
 return define('pack5:091','Desks & Lecterns',variant,'floor',[{cell:[0,0,0],art:a}]);
}
function rug(variant){
 if(!['hearthwoven-runner','starlace-sigil-rug'].includes(variant))throw Error('Unknown floor textile variant');
 const runner=variant==='hearthwoven-runner';
 const panels=[];
 for(let segment=0;segment<(runner?2:1);segment++){
  const a=[],base=runner?'red':'indigo',edge=runner?'cream':'gold';
  a.push(B(.085,.025,.035,.915,.057,.965,base));
  for(const x of [.085,.845])a.push(B(x,.058,.05,x+.07,.078,.95,edge));
  a.push(B(.14,.058,.07,.86,.077,.13,edge));a.push(B(.14,.058,.87,.86,.077,.93,edge));
  // Actual low-relief woven geometry: thin knots, diamond motif and fringe.
  for(let i=0;i<5;i++){
   const x=.19+i*.125;
   a.push(B(x,.058,.34,x+.055,.085,.42,i%2?'gold':'cream'));
   a.push(B(x+.032,.058,.57,x+.082,.084,.65,runner?'sage':'azure'));
  }
  for(const z of [.22,.76])for(const x of [.22,.72])a.push(B(x,.058,z,x+.065,.081,z+.065,runner?'walnut':'amethyst'));
  if(runner){
   // Two distinct, properly occupied connected floor cells; fringe on far outside.
   if(segment===0)for(const x of [.16,.29,.42,.55,.68,.81])a.push(B(x,.024,.015,x+.047,.066,.045,'cream'));
   else for(const x of [.16,.29,.42,.55,.68,.81])a.push(B(x,.024,.955,x+.047,.066,.99,'cream'));
  }else{
   a.push(B(.385,.059,.39,.615,.094,.61,'gold'));
   a.push(B(.44,.095,.44,.56,.105,.56,'azure'));
   for(const x of [.17,.77])for(const z of [.18,.75])a.push(B(x,.059,z,x+.055,.084,z+.065,'cream'));
  }
  panels.push({cell:[0,0,segment],art:a});
 }
 return define('pack5:092','Carpets & Rugs',variant,'floor',panels);
}
function altar(variant){
 if(!['runesworn-stone-altar','sunspire-reliquary-plinth'].includes(variant))throw Error('Unknown altar variant');
 const plinth=variant==='sunspire-reliquary-plinth',a=[];
 if(!plinth){
  a.push(B(.07,.04,.08,.93,.16,.92,'slate'));
  for(const x of [.11,.76])for(const z of [.13,.75])a.push(B(x,.15,z,x+.13,.70,z+.13,'stone'));
  a.push(B(.075,.68,.075,.925,.82,.925,'marble'));
  a.push(B(.15,.82,.15,.85,.87,.85,'gold'));
  for(const x of [.24,.43,.62])a.push(B(x,.871,.22,x+.09,.881,.78,'amethyst'));
  for(const z of [.26,.47,.68])a.push(B(.25,.871,z,.75,.879,z+.034,'indigo'));
  a.push(B(.30,.87,.34,.70,.89,.66,'shadow'));
  for(const x of [.17,.75])a.push(B(x,.46,.06,x+.075,.55,.12,'gold'));
 }else{
  a.push(B(.13,.04,.13,.87,.16,.87,'slate'));
  a.push(B(.23,.16,.23,.77,.26,.77,'gold'));
  a.push(B(.32,.26,.32,.68,.77,.68,'marble'));
  for(const y of [.32,.47,.62])a.push(B(.29,y,.29,.71,y+.046,.71,'gold'));
  a.push(B(.23,.77,.23,.77,.88,.77,'marble'));
  a.push(B(.17,.88,.17,.83,.94,.83,'slate'));
  // Physical unoccupied recess inside the top rim; empty reliquary, no spells.
  for(const x of [.17,.75])a.push(B(x,.945,.18,x+.08,.99,.82,'brass'));
  for(const z of [.17,.75])a.push(B(.25,.945,z,.75,.99,z+.08,'brass'));
  for(const x of [.38,.53])a.push(B(x,.26,.26,x+.035,.68,.30,'amethyst'));
 }
 return define('pack5:093','Altars & Pedestals',variant,'floor',[{cell:[0,0,0],art:a}]);
}
export const CIVIC_VARIANTS=Object.freeze({'pack5:091':['cartographers-oak-desk','moonstone-lectern'],'pack5:092':['hearthwoven-runner','starlace-sigil-rug'],'pack5:093':['runesworn-stone-altar','sunspire-reliquary-plinth']});
const factories={'pack5:091':desk,'pack5:092':rug,'pack5:093':altar};
export function getCivicInterior(id,v){if(!Object.hasOwn(factories,id)||!CIVIC_VARIANTS[id].includes(v))throw Error('Unknown M4 candidate');return factories[id](v)}
export const CIVIC_INTERIORS=Object.freeze(Object.entries(CIVIC_VARIANTS).flatMap(([id,vs])=>vs.map(v=>getCivicInterior(id,v))));
export const CIVIC_FAMILIES=Object.freeze(Object.keys(CIVIC_VARIANTS).map(id=>{const vs=CIVIC_VARIANTS[id].map(v=>getCivicInterior(id,v));return {...vs[0],variants:vs.slice(1).map(v=>({variant:v.variant,parts:v.parts,art:v.art}))}}));
const faces=[[[1,0,0],[1,1,0],[1,1,1],[1,0,1]],[[0,0,1],[0,1,1],[0,1,0],[0,0,0]],[[0,1,1],[1,1,1],[1,1,0],[0,1,0]],[[0,0,0],[1,0,0],[1,0,1],[0,0,1]],[[1,0,1],[1,1,1],[0,1,1],[0,0,1]],[[0,0,0],[0,1,0],[1,1,0],[1,0,0]]];
export function civicBoxMesh(d,{rotation=0}={}){
 validatePhysicalDescriptor(d);if(!Number.isInteger(rotation)||rotation<0||rotation>3)throw Error('Bad orientation');
 const positions=[],colors=[],indices=[];let v=0;
 for(const record of d.art){const cell=rotateCellOffset(record.cell,rotation);
  for(const item of record.details){const b=rotateLocalBox(item.box,rotation),c=CIVIC_PALETTE[item.material];if(!c)throw Error('Unknown textile/stone/timber material');
   for(const quad of faces){for(const xyz of quad){positions.push((xyz[0]?b[3]:b[0])+cell[0],(xyz[1]?b[4]:b[1])+cell[1],(xyz[2]?b[5]:b[2])+cell[2]);colors.push(...c)}
    indices.push(v,v+1,v+2,v,v+2,v+3);v+=4;}
  }
 }
 if(v>6144)throw Error('Candidate geometry preview budget exceeded');
 return {positions:new Float32Array(positions),colors:new Float32Array(colors),indices:new Uint16Array(indices),vertexCount:v,triangles:indices.length/3};
}
