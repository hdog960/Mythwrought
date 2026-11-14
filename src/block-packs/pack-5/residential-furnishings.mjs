/** Pack 5 M2 isolated authored physical furniture. Not a live registry or RPG furnishing system. */
import {validatePhysicalDescriptor,rotateCellOffset,rotateLocalBox} from './fixture.mjs';
const b=(x0,y0,z0,x1,y1,z1,material)=>({box:[x0,y0,z0,x1,y1,z1],material});
export const RESIDENTIAL_PALETTE=Object.freeze({
  oak:[.51,.30,.17,1],oakLight:[.72,.48,.26,1],shadow:[.26,.15,.12,1],ash:[.78,.66,.45,1],
  bronze:[.79,.59,.26,1],iron:[.35,.38,.40,1],linen:[.93,.83,.65,1],quilt:[.29,.52,.63,1],
  rose:[.66,.36,.39,1],sage:[.39,.59,.40,1],tapestry:[.38,.28,.61,1],cream:[.95,.88,.72,1],
  bookRed:[.72,.30,.22,1],bookBlue:[.22,.40,.64,1],bookGreen:[.30,.56,.40,1],bookGold:[.85,.67,.33,1]
});
function part(cell,art,collision){return {cell,boxes:art.map(x=>x.box),collisionBoxes:collision};}
function family(symbolicId,name,variant,attachment,records){
  const descriptor={symbolicId,name,variant,attachment,integrated:false,parts:records.map(x=>part(x.cell,x.art,x.collision)),
    art:records.map(x=>({cell:[...x.cell],details:x.art.map(a=>({box:[...a.box],material:a.material}))})),
    prototypeOnly:true,placeableInProduction:false,inventory:false,interaction:false};
  validatePhysicalDescriptor(descriptor);
  if(descriptor.parts.some(p=>p.boxes.length>64))throw Error('Excessive per-cell authored geometry');
  return descriptor;
}
function bed(variant){
  if(!['wanderer-quilt','moonwatch-canopy'].includes(variant))throw Error('Unknown bed');
  const canopy=variant==='moonwatch-canopy', head=[],foot=[];
  // One head cell + independent foot cell. Local +Z is bed length; no sleeping mechanics.
  const legs=(array)=>{for(const x of [.09,.78])for(const z of [.09,.78]){
    array.push(b(x,.04,z,x+.13,.38,z+.13,'oak'));
    array.push(b(x-.015,.06,z-.015,x+.145,.10,z+.145,'bronze'));
  }};
  legs(head);legs(foot);
  for(const [arr,isHead] of [[head,true],[foot,false]]){
    arr.push(b(.08,.28,.07,.92,.40,.93,'shadow'));
    arr.push(b(.11,.40,.09,.89,.51,.91,'linen'));
    arr.push(b(.10,.51,.10,.90,.57,.90,isHead?'linen':canopy?'tapestry':'quilt'));
    for(let k=0;k<3;k++)arr.push(b(.13+k*.25,.57,.75,.28+k*.25,.598,.83,'ash'));
  }
  head.push(b(.08,.34,.035,.92,.90,.16,canopy?'oak':'oakLight'));
  head.push(b(.19,.72,.16,.81,.81,.21,canopy?'bronze':'sage'));
  head.push(b(.19,.57,.26,.81,.64,.53,'cream'));
  foot.push(b(.08,.31,.83,.92,.66,.94,'oak'));
  foot.push(b(.18,.52,.79,.82,.57,.85,'bronze'));
  if(canopy){
    for(const arr of [head,foot]){
      for(const x of [.055,.835])for(const z of [.055,.835]){
        arr.push(b(x,.30,z,x+.10,.99,z+.10,'oak'));
        arr.push(b(x-.015,.93,z-.015,x+.115,.99,z+.115,'bronze'));
      }
      arr.push(b(.065,.91,.05,.935,.97,.145,'oakLight'));
      arr.push(b(.07,.91,.84,.93,.97,.94,'oakLight'));
    }
  }else{
    foot.push(b(.16,.57,.62,.84,.60,.68,'rose'));
  }
  const occ=(arr)=>arr.map(piece=>piece.box); // exact occupied source volumes, including headboard/canopy posts
  return family('pack5:082','Beds',variant,'floor',[
    {cell:[0,0,0],art:head,collision:occ(head)},
    {cell:[0,0,1],art:foot,collision:occ(foot)}]);
}
function seat(variant){
  if(!['hearthside-highback','riveted-round-stool'].includes(variant))throw Error('Unknown chair/stool');
  const stool=variant==='riveted-round-stool',art=[];
  for(const x of [.16,.74])for(const z of [.17,.73]){
    art.push(b(x,.045,z,x+.10,.51,z+.10,stool?'iron':'oak'));
    art.push(b(x-.017,.06,z-.017,x+.117,.12,z+.117,'bronze'));
  }
  if(stool){
    art.push(b(.19,.49,.19,.81,.62,.81,'oakLight'));
    art.push(b(.12,.53,.27,.88,.62,.73,'ash'));
    art.push(b(.27,.53,.12,.73,.62,.88,'ash'));
    for(const y of [.27,.32])art.push(b(.17,y,.2,.83,y+.035,.28,'iron'));
    art.push(b(.22,.28,.19,.28,.34,.81,'iron'));
    art.push(b(.72,.28,.19,.78,.34,.81,'iron'));
  }else{
    art.push(b(.11,.47,.11,.89,.60,.86,'ash'));
    art.push(b(.11,.60,.11,.24,.97,.24,'oak'));
    art.push(b(.76,.60,.11,.89,.97,.24,'oak'));
    art.push(b(.23,.74,.13,.77,.91,.235,'sage'));
    art.push(b(.27,.65,.165,.73,.74,.23,'bronze'));
    art.push(b(.14,.42,.16,.86,.48,.24,'shadow'));
  }
  return family('pack5:083','Chairs & Stools',variant,'floor',[
    {cell:[0,0,0],art,collision:art.map(piece=>piece.box)}]);
}
function bookshelf(variant){
  if(!['scholar-oak-stack','starbound-scrollcase'].includes(variant))throw Error('Unknown bookshelf');
  const star=variant==='starbound-scrollcase',art=[];
  art.push(b(.075,.035,.075,.925,.12,.93,'oak'));
  for(const x of [.065,.85])art.push(b(x,.09,.10,x+.085,.96,.91,star?'shadow':'oak'));
  art.push(b(.14,.13,.07,.86,.94,.17,'shadow'));
  for(let n=0;n<3;n++){
    let y=.13+n*.27;
    art.push(b(.11,y,.12,.89,y+.075,.91,n===2?'bronze':'oakLight'));
    if(star){
      for(let i=0;i<4;i++){
        const x=.18+i*.155;
        art.push(b(x,y+.09,.26,x+.10,y+.23,.74,i%2?'bookGold':'bookBlue'));
        art.push(b(x+.03,y+.12,.23,x+.075,y+.17,.27,'bronze'));
      }
    }else{
      for(let i=0;i<6;i++){
        const x=.16+i*.11;
        art.push(b(x,y+.075,.15,x+.072,y+.235+(i%3)*.008,.76,
          ['bookBlue','bookRed','bookGreen','bookGold'][i%4]));
        art.push(b(x+.012,y+.19,.76,x+.06,y+.204,.782,'bronze'));
      }
    }
  }
  art.push(b(.08,.91,.08,.92,.98,.93,star?'bronze':'oakLight'));
  if(star){for(const x of [.25,.45,.65])art.push(b(x,.947,.055,x+.075,.985,.12,'bookGold'));}
  // Functional timber joinery is modeled on the reverse and exposed side; these
  // are real small AABB parts, not painter-only colored stripes.
  for(const y of [.20,.48,.76]){
    art.push(b(.15,y,.045,.85,y+.045,.087,star?'bronze':'oakLight'));
    art.push(b(.925,y,.19,.965,y+.047,.83,star?'bronze':'ash'));
  }
  art.push(b(.46,.11,.032,.54,.89,.077,star?'bookGold':'oakLight'));
  return family('pack5:084','Bookshelves',variant,'floor',[
    {cell:[0,0,0],art,collision:art.map(piece=>piece.box)}]);
}
function cabinet(variant){
  if(!['pantry-cupboard','heritage-wardrobe'].includes(variant))throw Error('Unknown cabinetry');
  const tall=variant==='heritage-wardrobe',art=[];
  const top=tall?.96:.70;
  art.push(b(.08,.09,.10,.92,top,.91,'oak'));
  art.push(b(.07,.08,.08,.93,.15,.92,'shadow'));
  for(const x of [.095,.84])for(const z of [.12,.80])art.push(b(x,.025,z,x+.07,.15,z+.07,'oakLight'));
  art.push(b(.075,top-.06,.07,.925,top+.025,.92,tall?'bronze':'oakLight'));
  for(const [x0,x1] of [[.105,.483],[.515,.895]]){
    art.push(b(x0,.18,.905,x1,top-.10,.965,'oakLight'));
    art.push(b(x0+.03,.215,.966,x1-.03,top-.135,.982,tall?'shadow':'ash'));
    art.push(b(x0+.06,.25,.982,x1-.06,top-.17,.99,tall?'oak':'cream'));
  }
  for(const x of [.43,.56]){
    art.push(b(x,.41,.988,x+.035,.49,1,'bronze'));
    art.push(b(x-.025,.42,.974,x+.07,.44,.989,'iron'));
  }
  if(tall){
    for(const y of [.27,.70])art.push(b(.13,y,.981,.89,y+.025,.994,'bronze'));
    art.push(b(.11,.88,.04,.89,.92,.13,'ash'));
  }else{
    art.push(b(.12,.61,.04,.88,.65,.13,'sage'));
    for(const x of [.29,.68])art.push(b(x,.66,.06,x+.07,.73,.12,'bronze'));
  }
  // Articulated timber joinery on the previously bare cabinet rear and sides.
  for(const x of [.10,.855]){
    art.push(b(x,.18,.075,x+.038,top-.095,.107,'oakLight'));
    art.push(b(x,.19,.90,x+.025,top-.10,.942,'bronze'));
  }
  for(const y of [top*.25,top*.50,top*.75]){
    art.push(b(.105,y,.072,.895,y+.045,.112,tall?'bronze':'sage'));
    art.push(b(.895,y,.16,.938,y+.045,.84,'ash'));
  }
  return family('pack5:085','Cabinets & Wardrobes',variant,'floor',[
    {cell:[0,0,0],art,collision:[[.08,.09,.10,.92,top,.99]]}]);
}
export const RESIDENTIAL_VARIANTS=Object.freeze({
 'pack5:082':['wanderer-quilt','moonwatch-canopy'],
 'pack5:083':['hearthside-highback','riveted-round-stool'],
 'pack5:084':['scholar-oak-stack','starbound-scrollcase'],
 'pack5:085':['pantry-cupboard','heritage-wardrobe']
});
const build={'pack5:082':bed,'pack5:083':seat,'pack5:084':bookshelf,'pack5:085':cabinet};
export function getResidentialFurniture(id,variant){
  if(!Object.hasOwn(build,id)||!RESIDENTIAL_VARIANTS[id].includes(variant))throw Error('Unknown residential identity or variant');
  return build[id](variant);
}
export const RESIDENTIAL_FURNITURE=Object.freeze(Object.entries(RESIDENTIAL_VARIANTS).flatMap(([id,variants])=>variants.map(v=>getResidentialFurniture(id,v))));
export const RESIDENTIAL_FAMILIES=Object.freeze(Object.keys(RESIDENTIAL_VARIANTS).map(id=>{
  const variants=RESIDENTIAL_VARIANTS[id].map(v=>getResidentialFurniture(id,v));
  return {...variants[0],variants:variants.slice(1).map(v=>({variant:v.variant,parts:v.parts,art:v.art}))};
}));
const faceVerts=[
 [[1,0,0],[1,1,0],[1,1,1],[1,0,1]],[[0,0,1],[0,1,1],[0,1,0],[0,0,0]],
 [[0,1,1],[1,1,1],[1,1,0],[0,1,0]],[[0,0,0],[1,0,0],[1,0,1],[0,0,1]],
 [[1,0,1],[1,1,1],[0,1,1],[0,0,1]],[[0,0,0],[0,1,0],[1,1,0],[1,0,0]]
];
/** Preview mesh for actual multi-cell authored parts: not the production mesher. */
export function furnitureBoxMesh(descriptor,{rotation=0}={}){
  validatePhysicalDescriptor(descriptor);
  if(!Number.isInteger(rotation)||rotation<0||rotation>3||!Array.isArray(descriptor.art)||descriptor.art.length!==descriptor.parts.length)throw Error('Invalid furniture preview');
  let vertex=0;const positions=[],colors=[],indices=[];
  for(const record of descriptor.art){
    const cell=rotateCellOffset(record.cell,rotation);
    for(const detail of record.details){
      const box=rotateLocalBox(detail.box,rotation),color=RESIDENTIAL_PALETTE[detail.material];
      if(!color)throw Error('Missing furniture material');
      for(const quad of faceVerts){
        for(const v of quad){positions.push((v[0]?box[3]:box[0])+cell[0],(v[1]?box[4]:box[1])+cell[1],(v[2]?box[5]:box[2])+cell[2]);colors.push(...color);}
        indices.push(vertex,vertex+1,vertex+2,vertex,vertex+2,vertex+3);vertex+=4;
      }
    }
  }
  if(vertex>6144)throw Error('Preview mesh exceeds candidate budget');
  return {positions:new Float32Array(positions),colors:new Float32Array(colors),indices:new Uint16Array(indices),vertexCount:vertex,triangles:indices.length/3};
}
