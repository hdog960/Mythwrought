// Pack 1 / Milestone 1. Pure, opt-in physical definitions + original pixel artwork.
// CANDIDATE ONLY: IDs 9..14 are NOT registered in the live VoxelWorld.
export const MASONRY_IDS = Object.freeze({
  COBBLESTONE: 9,
  STONE_BRICKS: 10,
  MOSSY_STONE_BRICKS: 11,
  CRACKED_STONE_BRICKS: 12,
  POLISHED_STONE: 13,
  CARVED_STONE: 14,
});
export const MASONRY_FACES = Object.freeze(['north','south','east','west','top','bottom']);
const CUBE = Object.freeze([0,0,0,1,1,1]);
const CUBE_BOXES = Object.freeze([CUBE]);
const SPECS = [
  [9,1,'cobblestone','Cobblestone','Irregular raised riverstones with charcoal joints','rough', [111,120,123]],
  [10,2,'stone-bricks','Stone bricks','Dressed warm limestone in staggered mortar courses','dressed', [168,150,125]],
  [11,3,'mossy-stone-bricks','Mossy stone bricks','Weathered staggered limestone with real green growth patterns','mossy', [150,144,116]],
  [12,4,'cracked-stone-bricks','Cracked stone bricks','Split and chipped ash-grey dressed masonry','cracked', [139,138,136]],
  [13,5,'polished-stone','Polished stone','Deep blue-green honed stone with fine mineral veining','polished', [77,113,120]],
  [14,6,'carved-stone','Carved decorative stone','Honey-colored cut stone with incised four-point rosette','carved', [183,157,110]],
];
export const CORE_MASONRY = Object.freeze(SPECS.map(([id,roster,slug,name,appearance,finish,color])=>
  Object.freeze({
    id, roster, slug, name, appearance, finish,
    color: Object.freeze(color),
    profile:'unit-cube',
    shape:Object.freeze({kind:'full_cube',rotation:0,boxes:CUBE_BOXES}),
    selection:Object.freeze({boxes:CUBE_BOXES,individual:true}),
    collision:Object.freeze({kind:'solid',boxes:CUBE_BOXES}),
    removable:true, placeable:true,
    save:Object.freeze({schema:1,editFormat:'[x,y,z,id]',orientation:'not-required'}),
    integration:'candidate-only',
  })));
const BY_ID = new Map(CORE_MASONRY.map(item=>[item.id,item]));
export function masonryDefinition(id) { return BY_ID.get(id) ?? null; }

const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const fract=n=>n-Math.floor(n);
function hash(x,y,s) {
  let h=Math.imul(x+239*s,374761393)^Math.imul(y+913*s,668265263);
  h=Math.imul(h^(h>>>13),1274126177);
  return ((h^(h>>>16))>>>0)/4294967295;
}
function palette(rgb,bright,shift=0) {
  return [
    clamp(Math.round(rgb[0]*bright+shift),0,255),
    clamp(Math.round(rgb[1]*bright+shift*.7),0,255),
    clamp(Math.round(rgb[2]*bright+shift*.4),0,255),
  ];
}
function nearLine(v,at,width) { return Math.abs(v-at)<width; }
function roughStone(u,v,side,faceSeed) {
  const scale=3.15;
  let best=1e9, next=1e9, stone=0;
  for(let yy=-1;yy<=4;yy++)for(let xx=-1;xx<=4;xx++){
    const jitterX=(hash(xx,yy,faceSeed)-.5)*.58;
    const jitterY=(hash(yy,xx,faceSeed+7)-.5)*.5;
    const dx=u*scale-(xx+.48+jitterX),dy=v*scale-(yy+.48+jitterY);
    const d=dx*dx+dy*dy;
    if(d<best){next=best;best=d;stone=hash(xx,yy,faceSeed+19);}
    else if(d<next)next=d;
  }
  const grout=next-best<.17;
  const grain=hash(Math.floor(u*28),Math.floor(v*28),faceSeed+41);
  const edge=clamp((next-best-.17)*2.7,0,1);
  return palette(side.color,grout?.43:(.74+.39*stone+.12*edge),grain*12-6);
}
function brickSurface(u,v,side,seed,kind){
  const courses=5;
  const row=Math.floor(v*courses),offset=(row&1)*.5;
  const xu=u*2.8+offset;
  const x=fract(xu),y=fract(v*courses);
  const mortar=x<.058||x>.952||y<.075||y>.94;
  const brick=Math.floor(xu);
  const variation=hash(brick,row,seed+3);
  const grain=hash(Math.floor(u*30),Math.floor(v*30),seed+27);
  let color=palette(side.color,mortar?.45:.82+.31*variation,grain*16-8);
  // The moss is organic clusters, rooted mainly in the cracks, not just green tint.
  if(kind==='mossy'){
    const patch=Math.sin(u*24+Math.sin(v*11)*3)*Math.cos(v*19-u*9);
    const damp=hash(Math.floor(u*13),Math.floor(v*13),seed+61);
    const moss=patch+damp*.75+(mortar?.65:0)>.86;
    if(moss)color=palette([64,112,65],.67+.46*damp,variation*10);
  }
  if(kind==='cracked'){
    // Continuous angled branching fissures, with chips at fracture margins.
    const fracture=u-(.24+.45*v+.028*Math.sin(v*37+seed));
    const fracture2=u-(.85-.48*v+.025*Math.sin(v*29));
    const crack=Math.min(Math.abs(fracture),Math.abs(fracture2));
    if(crack<.014 || (crack<.036 && grain>.68)) color=[47,51,55];
    else if(crack<.052)color=palette(side.color,.62,0);
    if(grain>.89 && (x<.15||y>.81))color=palette(side.color,.62,6);
  }
  return color;
}
function polished(u,v,side,seed){
  const grain=hash(Math.floor(u*32),Math.floor(v*32),seed+97);
  const vein=Math.abs(Math.sin((u*.65+v*1.25)*15+Math.sin(v*9+seed)*1.1));
  const vein2=Math.abs(Math.sin((u*.9-v*.31)*28+Math.cos(u*7)*1.2));
  let col=palette(side.color,.83+.20*grain,8*Math.sin((u+v)*3));
  if(vein<.068||vein2<.045)col=palette([138,172,167],.78+.24*grain,0);
  if(u<.035||v<.035)col=palette(col,1.13,0);
  if(u>.96||v>.96)col=palette(col,.77,0);
  return col;
}
function carved(u,v,side,seed){
  const grain=hash(Math.floor(u*30),Math.floor(v*30),seed+53);
  const edge=Math.min(u,v,1-u,1-v);
  let col=palette(side.color,.9+.16*grain,0);
  // Inlaid border / inset moulding and an angular four-petal rosette.
  const border=Math.abs(edge-.105)<.022||Math.abs(edge-.155)<.012;
  const dx=u-.5,dy=v-.5;
  const ring=Math.abs(Math.abs(dx)+Math.abs(dy)-.27)<.026;
  const cross=(Math.abs(dx)<.024&&Math.abs(dy)<.38)||
              (Math.abs(dy)<.024&&Math.abs(dx)<.38);
  const center=Math.abs(dx)+Math.abs(dy)<.084;
  const corners=Math.abs(dx)>.30&&Math.abs(dy)>.30 &&
    Math.abs(Math.abs(dx)-Math.abs(dy))<.045;
  if(border||ring||cross||corners)col=palette(side.color,.59,-8);
  if(center)col=palette([215,180,111],1,0);
  if(edge<.03)col=palette(side.color,.65,0);
  return col;
}
// Deterministic, handcrafted procedural pixel artwork. No shared shader changes.
// A returned texture is raw RGBA, compatible with a later atlas upload.
export function masonryTexture(id,face='north',size=24) {
  const spec=masonryDefinition(id);
  if(!spec)throw new RangeError('Unknown Pack 1 masonry candidate ID');
  if(!MASONRY_FACES.includes(face))throw new RangeError('Unknown face');
  if(!Number.isInteger(size)||size<8||size>128)throw new RangeError('Invalid texture resolution');
  const seed=(MASONRY_FACES.indexOf(face)+1)*31+id*7;
  const pixels=new Uint8Array(size*size*4);
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
    let u=(x+.5)/size,v=(y+.5)/size;
    // Top/bottom textures remain related to side material, but not identical.
    if(face==='top'){u=fract(u+.04);v=fract(v+.11);}
    let rgb;
    if(id===9)rgb=roughStone(u,v,spec,seed);
    else if(id===10)rgb=brickSurface(u,v,spec,seed,'dressed');
    else if(id===11)rgb=brickSurface(u,v,spec,seed,'mossy');
    else if(id===12)rgb=brickSurface(u,v,spec,seed,'cracked');
    else if(id===13)rgb=polished(u,v,spec,seed);
    else rgb=carved(u,v,spec,seed);
    const p=(y*size+x)*4;
    pixels[p]=rgb[0];pixels[p+1]=rgb[1];pixels[p+2]=rgb[2];pixels[p+3]=255;
  }
  return Object.freeze({id,face,width:size,height:size,pixels});
}
export function masonryTextureSet(id,size=24) {
  return Object.freeze(Object.fromEntries(MASONRY_FACES.map(face=>[face,masonryTexture(id,face,size)])));
}
