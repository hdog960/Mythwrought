/** Pack 5 M3 physical workshop candidates, standalone test-only shapes, NOT gameplay. */
import {validatePhysicalDescriptor, rotateLocalBox} from './fixture.mjs';
const B=(x0,y0,z0,x1,y1,z1,m)=>({box:[x0,y0,z0,x1,y1,z1],material:m});
export const WORKSHOP_PALETTE=Object.freeze({
  iron:[.28,.32,.36,1], steel:[.48,.55,.60,1], charcoal:[.13,.14,.18,1], rivet:[.78,.66,.36,1],
  granite:[.47,.48,.47,1], slate:[.32,.37,.44,1], copper:[.63,.35,.22,1], brass:[.79,.61,.29,1],
  wood:[.50,.31,.19,1], ash:[.75,.69,.58,1], porcelain:[.83,.84,.77,1], enamel:[.20,.49,.48,1],
  amethyst:[.46,.30,.60,1], copperBright:[.83,.54,.33,1], soot:[.24,.23,.23,1]
});
function make(symbolicId,name,variant,art){
  if(art.length<9||art.length>64)throw Error('Invalid authored workshop box budget');
  const boxes=art.map(x=>[...x.box]);
  const d={symbolicId,name,variant,attachment:'floor',numericId:undefined,integrated:false,
    craft:false,heat:false,liquid:false,inventory:false,sourceOnly:true,
    parts:[{cell:[0,0,0],boxes,collisionBoxes:boxes.map(b=>[...b])}],
    art:[{cell:[0,0,0],details:art.map(x=>({box:[...x.box],material:x.material}))}]};
  validatePhysicalDescriptor(d);return d;
}
function anvil(v){
  if(!['blackiron-horn','moonsteel-stake'].includes(v))throw Error('Unknown anvil variant');
  const moon=v==='moonsteel-stake',a=[];
  // Distinct heavy forged workpiece, not a forge which emits heat or a stone block.
  a.push(B(.20,.07,.19,.80,.19,.81,moon?'granite':'wood'));
  for(const x of [.23,.68])for(const z of [.23,.68])a.push(B(x,.015,z,x+.09,.09,z+.09,'iron'));
  a.push(B(.28,.19,.27,.72,.30,.73,moon?'steel':'charcoal'));
  a.push(B(.35,.30,.34,.66,.63,.67,moon?'steel':'iron'));
  a.push(B(.40,.63,.24,.78,.73,.77,moon?'steel':'iron'));
  a.push(B(.40,.73,.23,.78,.81,.78,moon?'steel':'steel'));
  // Five physical tapered horn tiers deliberately extend well beyond the table's left end.
  // Wide root and narrow elevated tip read as an anvil even at phone-landscape scale.
  for(let i=0;i<5;i++){
    const left=.395-i*.077, halfWidth=.16-i*.028;
    const lower=.66+i*.015, upper=.79-i*.008;
    a.push(B(left-.075,lower,.50-halfWidth,left+.055,upper,.50+halfWidth,'steel'));
  }
  a.push(B(.01,.725,.477,.086,.77,.523,moon?'brass':'steel'));
  // Flat square peen projects right of the rectangular face.
  a.push(B(.78,.64,.35,.94,.76,.66,moon?'steel':'charcoal'));
  a.push(B(.85,.69,.40,.985,.73,.61,moon?'rivet':'steel'));
  for(const x of [.26,.68])for(const z of [.27,.69])a.push(B(x,.17,z,x+.04,.205,z+.04,'rivet'));
  if(moon){
    for(const x of [.38,.51,.64])a.push(B(x,.811,.38,x+.035,.833,.64,'brass'));
    a.push(B(.42,.42,.294,.59,.51,.325,'amethyst'));
  }else{
    for(const z of [.32,.48,.64])a.push(B(.32,.38,z,.36,.43,z+.05,'rivet'));
  }
  return make('pack5:088','Anvils & Forge Fixtures',v,a);
}
function cauldron(v){
  if(!['iron-tripod-cauldron','alchemists-spiral-stand'].includes(v))throw Error('Unknown cauldron variant');
  const alchemy=v==='alchemists-spiral-stand',a=[];
  if(!alchemy){
    // Genuine hollow, stepped octagonal pot: three differently sized 8-piece rings.
    // Corner blocks join but do not fill the basin. Smaller lower footprint forms a bowl,
    // not a straight-walled rectangular trough. No liquid simulation or render-only shell.
    const rings=[{lo:.275,hi:.725,y:.20},{lo:.125,hi:.875,y:.35},{lo:.185,hi:.815,y:.50}];
    const ring=(lo,hi,y,height,material)=>{
      const h=hi-lo;
      a.push(B(lo+.135,y,lo,hi-.135,y+height,lo+.085,material));
      a.push(B(lo+.135,y,hi-.085,hi-.135,y+height,hi,material));
      a.push(B(lo,y,lo+.135,lo+.085,y+height,hi-.135,material));
      a.push(B(hi-.085,y,lo+.135,hi,y+height,hi-.135,material));
      for(const x of [lo+.04,hi-.17])for(const z of [lo+.04,hi-.17])
        a.push(B(x,y,z,x+.13,y+height,z+.13,material));
    };
    for(const row of rings)ring(row.lo,row.hi,row.y,.14,'iron');
    // Continuous bright physical lip frames the opening without capping it.
    ring(.14,.86,.64,.055,'steel');
    a.push(B(.30,.18,.30,.70,.26,.70,'charcoal'));
    for(const x of [.275,.655])for(const z of [.275,.655])
      a.push(B(x,.035,z,x+.07,.25,z+.07,'iron'));
    // Physical front/rear hanging lugs preserve a rounded silhouette even at screen scale.
    for(const z of [.11,.85])a.push(B(.34,.70,z,.66,.754,z+.04,'rivet'));
    // Handles extend left and right, not a painted rim illusion.
    for(const x of [.04,.86]){
      a.push(B(x,.625,.36,x+.10,.705,.64,'rivet'));
      a.push(B(x+.03,.705,.39,x+.07,.765,.61,'steel'));
    }
  }else{
    a.push(B(.12,.05,.12,.88,.13,.88,'wood'));
    for(const x of [.16,.77])for(const z of [.16,.77])a.push(B(x,.12,z,x+.07,.78,z+.07,'copper'));
    for(const y of [.25,.48,.72])a.push(B(.18,y,.17,.82,y+.038,.84,'wood'));
    // Three distinct small empty ceramic glassware holders, raised retaining lips.
    for(const x of [.22,.46,.70]){
      a.push(B(x,.75,.36,x+.08,.86,.45,'porcelain'));
      a.push(B(x-.025,.84,.335,x+.105,.875,.475,'brass'));
      a.push(B(x+.018,.875,.375,x+.06,.94,.41,'amethyst'));
    }
    a.push(B(.17,.90,.16,.83,.96,.25,'copperBright'));
    a.push(B(.17,.90,.75,.83,.96,.84,'copperBright'));
  }
  return make('pack5:089','Cauldrons & Alchemy Stations',v,a);
}
function oven(v){
  if(!['ashstone-bake-oven','copper-range-top'].includes(v))throw Error('Unknown oven variant');
  const range=v==='copper-range-top',a=[];
  // Structural four corner piers and full bottom deck, *not* an emitting fireplace.
  a.push(B(.08,.04,.08,.92,.14,.92,range?'copper':'granite'));
  for(const x of [.085,.80])for(const z of [.085,.80])a.push(B(x,.13,z,x+.115,.78,z+.115,range?'copper':'granite'));
  a.push(B(.08,.73,.08,.92,.83,.92,range?'copperBright':'slate'));
  if(!range){
    // Arch-like open oven mouth on +Z: low lip, two jambs and staggered lintel, no fire.
    a.push(B(.14,.16,.76,.86,.22,.89,'soot'));
    for(const x of [.14,.73])a.push(B(x,.22,.79,x+.12,.63,.93,'granite'));
    for(let n=0;n<4;n++){
      const x=.24+n*.13;
      a.push(B(x,.63,.79,x+.115,.73,.93,n%2?'ash':'granite'));
    }
    a.push(B(.25,.22,.77,.75,.35,.80,'charcoal'));
    for(const y of [.29,.45])a.push(B(.20,y,.12,.80,y+.037,.20,'ash'));
    for(const x of [.14,.79])a.push(B(x,.14,.24,x+.06,.73,.30,'slate'));
  }else{
    // Two independent polygonal cook rings on flat copper slab; no cooking/heating state.
    for(const x of [.23,.62])for(const z of [.26,.62]){
      a.push(B(x,.83,z,x+.14,.87,z+.14,'charcoal'));
      a.push(B(x+.025,.87,z+.025,x+.115,.89,z+.115,'steel'));
    }
    a.push(B(.16,.35,.88,.84,.61,.958,'copperBright'));
    for(const x of [.22,.46,.70])a.push(B(x,.53,.959,x+.085,.59,.99,'brass'));
    for(const y of [.25,.42,.60])a.push(B(.13,y,.09,.87,y+.035,.16,'steel'));
  }
  return make('pack5:090','Ovens & Cooking Ranges',v,a);
}
export const WORKSHOP_VARIANTS=Object.freeze({
  'pack5:088':['blackiron-horn','moonsteel-stake'],
  'pack5:089':['iron-tripod-cauldron','alchemists-spiral-stand'],
  'pack5:090':['ashstone-bake-oven','copper-range-top']
});
const factories={'pack5:088':anvil,'pack5:089':cauldron,'pack5:090':oven};
export const WORKSHOP_FIXTURES=Object.freeze(Object.entries(WORKSHOP_VARIANTS).flatMap(([id,vs])=>vs.map(v=>factories[id](v))));
export const WORKSHOP_FAMILIES=Object.freeze(Object.keys(WORKSHOP_VARIANTS).map(id=>{
 const vs=WORKSHOP_VARIANTS[id].map(v=>factories[id](v));
 return {...vs[0],variants:vs.slice(1).map(v=>({variant:v.variant,parts:v.parts,art:v.art}))};
}));
export function getWorkshopFixture(id,variant){
 if(!Object.hasOwn(factories,id)||!WORKSHOP_VARIANTS[id].includes(variant))throw Error('Unknown workshop candidate');
 return factories[id](variant);
}
const FACES=[
 [[1,0,0],[1,1,0],[1,1,1],[1,0,1]], [[0,0,1],[0,1,1],[0,1,0],[0,0,0]],
 [[0,1,1],[1,1,1],[1,1,0],[0,1,0]], [[0,0,0],[1,0,0],[1,0,1],[0,0,1]],
 [[1,0,1],[1,1,1],[0,1,1],[0,0,1]], [[0,0,0],[0,1,0],[1,1,0],[1,0,0]]
];
/** Color-indexed source part meshes; per-cell budget is a separate physical check. */
export function workshopBoxMesh(d,{rotation=0}={}){
 validatePhysicalDescriptor(d);
 if(!Number.isInteger(rotation)||rotation<0||rotation>3||!Array.isArray(d.art)||d.art.length!==d.parts.length)throw Error('Invalid workshop mesh request');
 const positions=[],colors=[],indices=[];let v=0;
 for(const rec of d.art)for(const detail of rec.details){
  const b=rotateLocalBox(detail.box,rotation),c=WORKSHOP_PALETTE[detail.material];if(!c)throw Error('Unknown workshop palette');
  for(const face of FACES){for(const vert of face){positions.push(vert[0]?b[3]:b[0],vert[1]?b[4]:b[1],vert[2]?b[5]:b[2]);colors.push(...c)}
   indices.push(v,v+1,v+2,v,v+2,v+3);v+=4;}
 }
 if(v>1536)throw Error('Per-cell candidate preview budget exceeded');
 return {positions:new Float32Array(positions),colors:new Float32Array(colors),indices:new Uint16Array(indices),vertexCount:v,triangles:indices.length/3};
}
