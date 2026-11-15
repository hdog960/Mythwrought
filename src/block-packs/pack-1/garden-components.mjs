// MYTHWROUGHT — Pack 1, Milestone 3: independent physical garden components.
// Pure, opt-in assets. DO NOT import into the live world/registry until creator integration.
// The generic :00/:12 contract is {boxes:[[x0,y0,z0,x1,y1,z1],...]}, one local cell.
export const GARDEN_IDS=Object.freeze({TILLED_FARMLAND:21,PLANTER_BOX:22,FLOWER_POT:23});
const ENTRIES=[
  [21,47,'tilled-farmland','Tilled farmland soil',
    'Rich dark soil with four raised furrows and actual recessed planting grooves',
    'tilled-soil',['earth','ridge']],
  [22,48,'cedar-planter','Garden planter box',
    'Recessed warm cedar planter with four separate rims and a physical unplanted soil bed',
    'open-planter',['cedar','loam','rim']],
  [23,49,'terracotta-pot','Flower pot',
    'Small hollow terracotta vessel with separate base, tapered walls and glazed rim',
    'hollow-vessel',['terracotta','glaze']]
];
export const GARDEN_COMPONENTS=Object.freeze(ENTRIES.map(([id,roster,slug,name,appearance,profile,roles])=>
  Object.freeze({id,roster,slug,name,appearance,profile,roles:Object.freeze(roles),
    selectable:true,removable:true,placeable:true,individualCell:true,
    cropGrowth:false,planting:false,harvesting:false,
    integration:'CANDIDATE — NOT MERGED / NOT DEPLOYED',
    save:Object.freeze({schema:1,defaultRotation:0,
      otherRotations:'BLOCKED BY ENGINE: schema-1 edit row cannot encode orientation'})
  })));
const BY_ID=new Map(GARDEN_COMPONENTS.map(a=>[a.id,a]));
export function gardenDefinition(id){return BY_ID.get(id)??null;}
const B=(role,x0,y0,z0,x1,y1,z1)=>Object.freeze({role,box:Object.freeze([x0,y0,z0,x1,y1,z1])});
function originalParts(id){
  if(id===21)return [
    B('earth',0,0,0,1,.67,1),
    B('ridge',.04,.67,0,.20,.84,1),
    B('ridge',.29,.67,0,.45,.84,1),
    B('ridge',.54,.67,0,.70,.84,1),
    B('ridge',.79,.67,0,.95,.84,1)
  ];
  if(id===22)return [
    B('cedar',.08,0,.10,.92,.13,.90),
    B('cedar',.08,.13,.10,.92,.57,.20),
    B('cedar',.08,.13,.80,.92,.57,.90),
    B('cedar',.08,.13,.20,.20,.57,.80),
    B('cedar',.80,.13,.20,.92,.57,.80),
    B('loam',.20,.13,.20,.80,.42,.80),
    B('rim',.06,.53,.07,.94,.65,.17),
    B('rim',.06,.53,.83,.94,.65,.93),
    B('rim',.06,.53,.17,.17,.65,.83),
    B('rim',.83,.53,.17,.94,.65,.83)
  ];
  if(id===23)return [
    B('terracotta',.31,0,.31,.69,.12,.69),
    B('terracotta',.27,.12,.27,.73,.20,.73),
    B('terracotta',.27,.20,.27,.35,.65,.73),
    B('terracotta',.65,.20,.27,.73,.65,.73),
    B('terracotta',.35,.20,.27,.65,.65,.35),
    B('terracotta',.35,.20,.65,.65,.65,.73),
    B('glaze',.23,.61,.23,.35,.74,.77),
    B('glaze',.65,.61,.23,.77,.74,.77),
    B('glaze',.35,.61,.23,.65,.74,.35),
    B('glaze',.35,.61,.65,.65,.74,.77)
  ];
  throw new RangeError('Unknown garden component candidate');
}
const round=n=>Math.round(n*1e6)/1e6;
function rotateBox(b,rotation){
  const corners=[[b[0],b[2]],[b[0],b[5]],[b[3],b[2]],[b[3],b[5]]].map(([x0,z0])=>{
    let x=x0,z=z0;
    for(let i=0;i<rotation;i++){const a=x;x=1-z;z=a;}
    return [round(x),round(z)];
  });
  return Object.freeze([
    Math.min(...corners.map(c=>c[0])),b[1],Math.min(...corners.map(c=>c[1])),
    Math.max(...corners.map(c=>c[0])),b[4],Math.max(...corners.map(c=>c[1]))
  ]);
}
export function gardenDescriptor(id,{rotation=0}={}){
  const item=gardenDefinition(id);
  if(!item)throw new RangeError('Unknown garden candidate ID');
  if(!Number.isInteger(rotation)||rotation<0||rotation>3)
    throw new RangeError('Rotation must be integer 0–3');
  const parts=Object.freeze(originalParts(id).map(p=>
    Object.freeze({role:p.role,box:rotateBox(p.box,rotation)})));
  const boxes=Object.freeze(parts.map(p=>p.box));
  return Object.freeze({
    id,kind:item.profile,rotation,prototypeOnly:true,placeable:false,
    bounds:Object.freeze([0,0,0,1,1,1]),
    units:'voxel',orientation:'quarter-turn-y',
    occupancy:'union-of-axis-aligned-boxes',boxes,parts,
    // Per-part role is optional renderer metadata; boxes remain :00/:12 authoritative.
    saveState:null,orientationRequiresEngineSave:rotation!==0
  });
}
export function gardenOccupies(id,point,options={}){
  if(!Array.isArray(point)||point.length!==3||!point.every(Number.isFinite))
    throw new TypeError('Expected finite local point [x,y,z]');
  return gardenDescriptor(id,options).boxes.some(b=>
    point.every((v,i)=>v>=b[i]&&v<b[i+3]));
}
const FACES=Object.freeze(['north','south','east','west','top','bottom']);
const clamp=(v)=>Math.max(0,Math.min(255,Math.round(v)));
function hash(x,y,s){
  let h=Math.imul((x|0)+s*31,374761393)^Math.imul((y|0)-s*17,668265263);
  h=Math.imul(h^(h>>>13),1274126177);
  return ((h^(h>>>16))>>>0)/4294967295;
}
function tint(base,mul,shift=0){return base.map((v,i)=>clamp(v*mul+shift*(1-i*.16)));}
function pixelArt(id,role,face,u,v,size){
  const seed=id*29+FACES.indexOf(face)*43;
  const grain=hash(Math.floor(u*size),Math.floor(v*size),seed);
  if(id===21 || role==='loam' || role==='earth'||role==='ridge'){
    const base=id===21?[83,57,37]:[81,59,41];
    const rough=hash(Math.floor(u*17),Math.floor(v*18),seed+7);
    let rgb=tint(base,.78+.40*rough,grain*10-5);
    if(role==='ridge'||(id===21&&face==='top')){
      const bands=Math.sin(u*Math.PI*8);
      if(bands<-.56)rgb=tint([41,31,25],.78+.28*grain);
      else if(bands>.82)rgb=tint([150,107,67],.88+.16*grain);
    }
    // Recessed earth is intentionally darker than raised farmland ridge faces.
    // Keeping them distinct avoids a misleading flat-looking tilled surface.
    if(id===21&&role==='earth'&&face==='top')rgb=tint(rgb,.76,-3);
    // Light straw fibers, dark loam speckles, and occasional mineral chips.
    const cellX=Math.floor(u*24),cellY=Math.floor(v*24);
    if(hash(cellX,cellY,seed+11)>.971)rgb=[204,164,97];
    if(hash(cellX,cellY,seed+19)>.967)rgb=[37,33,29];
    return rgb;
  }
  if(role==='cedar'||role==='rim'){
    const base=role==='rim'?[157,103,55]:[139,87,48];
    const grainWave=Math.sin(u*49+Math.sin(v*13)*1.5);
    const knot=Math.abs(Math.sin(u*16+Math.sin(v*21)*.7));
    let rgb=tint(base,.81+.17*grain+.085*grainWave,.4*knot*12);
    const bands=(Math.abs(Math.sin(v*Math.PI*8))<.09);
    if(bands)rgb=tint(rgb,.57);
    if(role==='rim'&&(u<.065||u>.935))rgb=tint(rgb,.66);
    return rgb;
  }
  if(role==='terracotta'||role==='glaze'){
    const base=role==='glaze'?[204,131,84]:[172,91,57];
    let rgb=tint(base,.82+.23*grain);
    const band=Math.abs(Math.sin(v*Math.PI*9));
    if(face!=='top'&&band<.10)rgb=tint([102,63,50],.9+.14*grain);
    // Incised diamond-and-leaf border, contrasted with gold glaze detailing.
    const diamond=Math.abs(Math.abs((u-.5)*4)-Math.abs((v-.5)*4));
    if(role==='glaze'&&diamond<.14)rgb=[241,191,109];
    if(role==='terracotta'&&face!=='bottom'){
      const leaf=Math.abs(Math.sin(u*Math.PI*8+v*Math.PI*5));
      if(leaf<.065&&v>.26&&v<.76)rgb=[73,126,112];
    }
    if(face==='top'&&role==='terracotta'){
      const distance=Math.hypot((u-.5)*1.04,(v-.5)*1.04);
      if(distance<.29)rgb=[63,47,38];
      else if(distance>.39)rgb=tint(base,1.09);
    }
    return rgb;
  }
  throw new RangeError('Unknown garden material role');
}
// Original deterministic opaque RGBA material image. This is source art, not proof
// of production shader, physical WebGL rendering or saved world integration.
export function gardenTexture(id,face='top',size=24,role=null){
  const item=gardenDefinition(id);
  if(!item)throw new RangeError('Unknown garden component');
  if(!FACES.includes(face))throw new RangeError('Unknown garden face');
  if(!Number.isInteger(size)||size<8||size>128)throw new RangeError('Invalid texture size');
  const resolvedRole=role??item.roles[0];
  if(!item.roles.includes(resolvedRole))throw new RangeError('Role is not owned by this garden component');
  const pixels=new Uint8Array(size*size*4);
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
    const u=(x+.5)/size,v=(y+.5)/size;
    const rgb=pixelArt(id,resolvedRole,face,u,v,size);
    const i=(y*size+x)*4;
    pixels[i]=rgb[0];pixels[i+1]=rgb[1];pixels[i+2]=rgb[2];pixels[i+3]=255;
  }
  return Object.freeze({id,face,role:resolvedRole,width:size,height:size,pixels});
}
