// Staged cave formations. Meshes, support intent and collision profiles share
// anchor-relative units. There is no native voxel ID or world mutation here.
const palette = Object.freeze([
  Object.freeze([.45,.39,.34]), Object.freeze([.57,.49,.39]),
  Object.freeze([.69,.61,.49]), Object.freeze([.77,.70,.57])
]);

function builder() {
  const positions=[], materials=[];
  function triangle(a,b,c,material) {
    positions.push(...a,...b,...c);
    materials.push(material);
  }
  return {
    triangle,
    quad(a,b,c,d,material) {
      triangle(a,b,c,material);
      triangle(a,c,d,material);
    },
    finish() {
      return {positions:new Float32Array(positions),materials:new Uint8Array(materials),
        triangleCount:materials.length};
    }
  };
}

function noiseFor(seed,anchor,variant) {
  let hash=2166136261;
  for(const character of [seed,...anchor,variant].join(':'))
    hash=Math.imul(hash^character.charCodeAt(0),16777619);
  return ()=>{
    hash^=hash<<13; hash^=hash>>>17; hash^=hash<<5;
    return (hash>>>0)/4294967296;
  };
}

// Closed, irregular rings follow the measured changes in apparent width.
// Spread and angle are reused across layers, giving each facet a coherent edge.
function sectionedRock(mesh,levels,sides,phase,noise) {
  const ripples=Array.from({length:sides},()=>.82+noise()*.29);
  const rings=levels.map(([x,y,z,width,depth])=>ripples.map((r,i)=>{
    const angle=phase+2*Math.PI*i/sides;
    return [x+Math.cos(angle)*width*r,y,z+Math.sin(angle)*depth*r];
  }));
  for(let layer=0;layer<rings.length-1;layer++) {
    const a=rings[layer], b=rings[layer+1];
    for(let side=0;side<sides;side++){
      const next=(side+1)%sides;
      const color=(layer+side%3)%4;
      mesh.quad(a[side],a[next],b[next],b[side],color);
    }
  }
  for(const index of [0,rings.length-1]){
    const ring=rings[index], center=levels[index].slice(0,3);
    for(let side=0;side<sides;side++)
      mesh.triangle(center,ring[side],ring[(side+1)%sides],index===0?0:3);
  }
}

function solidSections(levels) {
  return levels.slice(0,-1).map((lower,index)=>{
    const [ax,ay,az,aw,ad]=lower;
    const [bx,by,bz,bw,bd]=levels[index+1];
    const inset=.68;
    return [Math.min(ax-aw*inset,bx-bw*inset),ay,Math.min(az-ad*inset,bz-bd*inset),
      Math.max(ax+aw*inset,bx+bw*inset),by,Math.max(az+ad*inset,bz+bd*inset)];
  });
}

function giantSpire(mesh,noise,variant) {
  const h=1.78+.095*variant+noise()*.12, lean=(noise()-.5)*.25;
  const levels=[
    [0,0,0,.44,.36],[.01,.26,-.03,.38,.32],
    [-.035,h*.37,.01,.27,.22],[.02,h*.64,.032,.16,.15],
    [lean,h*.85,.04,.075,.063],[lean+.035,h,.052,.013,.012]
  ];
  sectionedRock(mesh,levels,7,noise(),noise);
  return solidSections(levels);
}

function dripstone(mesh,noise,variant) {
  const count=3+variant%3, phase=noise()*Math.PI*2;
  for(let i=0;i<count;i++){
    const angle=phase+2*Math.PI*i/count, distance=.19+noise()*.11;
    const x=Math.cos(angle)*distance, z=Math.sin(angle)*distance;
    const length=(i===0?.92:.36)+noise()*.39+variant*.025;
    const radius=.083+noise()*.052;
    sectionedRock(mesh,[
      [x,0,z,radius*1.28,radius],
      [x+.02,-length*.23,z,radius*.91,radius*.83],
      [x+.04,-length*.68,z-.025,radius*.43,radius*.54],
      [x+.05,-length,z-.045,.012,.013]
    ],5,angle,noise);
  }
  return [];
}

function limestoneColumn(mesh,noise,variant) {
  const x=(noise()-.5)*.24,z=(noise()-.5)*.19;
  const rim=.33+variant*.014;
  const levels=[
    [0,0,0,rim+.1,rim],[x*.28,.29,z*.34,rim,.29],
    [x,1.07,z,.18+noise()*.035,.17],[x-.04,1.75,z+.045,.15,.18],
    [x*.45,2.34,z*.35,.27+noise()*.06,.24],[0,3,0,rim+.055,rim+.02]
  ];
  sectionedRock(mesh,levels,8,noise(),noise);
  return solidSections(levels);
}

function flowstoneCurtain(mesh,noise,variant) {
  const panels=9;
  const height=.85+variant*.065;
  const crossSection=Array.from({length:panels+1},(_,i)=>{
    const along=i/panels, x=(along-.5)*.88;
    return {x,z:Math.sin(along*Math.PI*4+variant*.35)*.10,
      end:-height*(.62+Math.sin(along*Math.PI)*.31+noise()*.23)};
  });
  const point=({x,z,end},tier,side)=>[
    x*(1-.09*tier),end*tier,z+.075*tier+side*(.037-.019*tier)
  ];
  const tiers=[0,.27,.63,1];
  for(let i=0;i<panels;i++){
    const a=crossSection[i],b=crossSection[i+1];
    for(let k=0;k<tiers.length-1;k++){
      const top=tiers[k], bottom=tiers[k+1];
      for(const side of [-1,1])
        mesh.quad(point(a,top,side),point(b,top,side),point(b,bottom,side),point(a,bottom,side),
          side===1?(k+i%2)+1:k);
    }
    for(const tier of [0,1])
      mesh.quad(point(a,tier,-1),point(b,tier,-1),point(b,tier,1),point(a,tier,1),1);
  }
  for(const edge of [crossSection[0],crossSection.at(-1)])
    for(let k=0;k<tiers.length-1;k++)
      mesh.quad(point(edge,tiers[k],-1),point(edge,tiers[k+1],-1),
        point(edge,tiers[k+1],1),point(edge,tiers[k],1),0);
  return [];
}

// Rebuild the four inherited taper-only forms around their original IDs.
function smallStalagmite(mesh,noise,variant) {
  const height=.62+variant*.046+noise()*.12;
  const levels=[
    [0,0,0,.29,.235],[-.021,.14,.025,.25,.215],
    [.018,height*.48,.014,.16,.148],[.078,height*.78,-.036,.092,.078],
    [.087,height,-.052,.028,.022]
  ];
  const phase=noise()*Math.PI*2;
  sectionedRock(mesh,levels,8,phase,noise);
  for(let i=0;i<2;i++){
    const angle=phase+(i+.7)*Math.PI, x=Math.cos(angle)*.18,z=Math.sin(angle)*.18;
    sectionedRock(mesh,[
      [x,0,z,.101,.083],[x*.91,height*(.35+i*.12),z*.90,.053,.051],
      [x*.86,height*(.53+i*.13),z*.87,.013,.011]
    ],5,angle,noise);
  }
  return solidSections(levels);
}

function hangingStalactite(mesh,noise,variant) {
  const height=.76+variant*.085+noise()*.21, bend=(noise()-.5)*.24;
  const levels=[
    [0,0,0,.29,.24],[.014,-height*.19,-.025,.22,.19],
    [.051,-height*.42,.034,.18,.14],[.071,-height*.65,.024,.09,.092],
    [bend,-height*.82,-.013,.041,.055],[bend-.015,-height,.008,.012,.014]
  ];
  sectionedRock(mesh,levels,8,noise()*Math.PI*2,noise);
  return solidSections([...levels].reverse());
}

function icicleSpear(mesh,noise,variant) {
  const height=.83+variant*.095+noise()*.14, z=(noise()-.5)*.14;
  const levels=[
    [0,0,0,.20,.16],[.017,-height*.12,.012,.175,.14],
    [-.034,-height*.39,z*.17,.123,.11],[-.071,-height*.71,z*.55,.073,.053],
    [-.091,-height*.94,z,.027,.032],[-.13,-height,z+.026,.008,.009]
  ];
  sectionedRock(mesh,levels,5,noise(),noise);
  return solidSections([...levels].reverse());
}

function facetedCrystal(mesh,noise,variant) {
  const height=.72+variant*.064+noise()*.17, lean=(noise()-.5)*.21;
  const levels=[
    [0,0,0,.208,.165],[.006,height*.15,.021,.193,.158],
    [lean,height*.78,.10,.169,.145],[lean+.063,height,.136,.083,.071],
    [lean+.068,height*1.06,.176,.030,.022]
  ];
  const phase=noise()*Math.PI*2;
  sectionedRock(mesh,levels,6,phase,noise);
  sectionedRock(mesh,[
    [-.16,0,-.12,.105,.071],[-.20,height*.37,-.10,.077,.067],
    [-.23,height*.56,-.044,.025,.021]
  ],5,phase+.22,noise);
  return solidSections(levels);
}

const icePalette=Object.freeze([
  [.30,.55,.67],[.46,.73,.85],[.65,.86,.92],[.84,.94,.98]
].map(color=>Object.freeze(color)));
const crystalPalette=Object.freeze([
  [.22,.39,.45],[.30,.63,.70],[.49,.81,.82],[.63,.89,.85]
].map(color=>Object.freeze(color)));

const definitions = new Map([
  ['nonblock:e:giant-stalagmite-spire',{build:giantSpire,attachment:'ground',collision:'solid'}],
  ['nonblock:e:clustered-dripstone',{build:dripstone,attachment:'ceiling',collision:'pass-through'}],
  ['nonblock:e:limestone-cave-column',{build:limestoneColumn,attachment:'span',collision:'solid'}],
  ['nonblock:e:flowstone-curtain',{build:flowstoneCurtain,attachment:'ceiling',collision:'pass-through'}],
  ['nonblock:e:small-stalagmite',{build:smallStalagmite,attachment:'ground',collision:'solid'}],
  ['nonblock:e:hanging-stalactite',{build:hangingStalactite,attachment:'ceiling',collision:'solid'}],
  ['nonblock:d:icicle-spear',{build:icicleSpear,attachment:'ceiling',collision:'solid',palette:icePalette}],
  ['nonblock:e:crystal-shard',{build:facetedCrystal,attachment:'ground',collision:'solid',palette:crystalPalette}]
]);

export function createCaveFormation(sceneId,{seed,anchor,variant=0}={}) {
  const family=definitions.get(sceneId);
  if(!family||!Number.isSafeInteger(seed)||!Array.isArray(anchor)||anchor.length!==3||
     !anchor.every(Number.isSafeInteger)||!Number.isInteger(variant)||variant<0||variant>7)
    throw new TypeError('Invalid cave formation identity');
  const mesh=builder();
  const colliders=family.build(mesh,noiseFor(seed,anchor,variant),variant);
  return {sceneId,variant,attachment:family.attachment,collision:family.collision,
    mesh:mesh.finish(),colliders,palette:family.palette??palette};
}
