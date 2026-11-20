// Source geometry for ten enchanted and fungal scenery families.
const TURN=2*Math.PI;
const colors=Object.freeze([
  [.46,.29,.18],[.76,.54,.34],[.92,.73,.52],[.65,.43,.32],[.87,.75,.62],
  [.39,.48,.60],[.73,.81,.84],[.79,.34,.48],[.53,.23,.43],[.95,.49,.65],
  [.20,.34,.37],[.22,.61,.56],[.44,.84,.73],[.46,.49,.77],[.50,.68,.92],
  [.90,.75,.43],[.96,.60,.24],[.54,.36,.24],[.22,.17,.25],[.40,.26,.37],
  [.53,.32,.46],[.64,.38,.30],[.87,.50,.31],[.31,.44,.25]
].map(color=>Object.freeze(color)));

function createMesh() {
  const positions=[],materials=[];
  const tri=(a,b,c,material)=>{
    positions.push(...a,...b,...c);
    materials.push(material);
  };
  return {tri,quad(a,b,c,d,material){
    tri(a,b,c,material);
    tri(a,c,d,material);
  },finish(){
    return {positions:new Float32Array(positions),materials:new Uint8Array(materials),
      triangleCount:materials.length};
  }};
}

function randomFrom(id,seed,anchor,variant) {
  let state=2166136261;
  for(const char of [id,seed,...anchor,variant].join(':'))state=Math.imul(state^char.charCodeAt(0),16777619);
  return ()=>{
    state=Math.imul(state,1664525)+1013904223|0;
    return (state>>>0)/4294967296;
  };
}

function around([x,y,z],radius,angle,rise=0) {
  return [x+Math.cos(angle)*radius,y+rise,z+Math.sin(angle)*radius];
}

function ring(center,radius,sides,phase) {
  return Array.from({length:sides},(_,i)=>around(center,radius,phase+i*TURN/sides));
}

function ringSegment(mesh,lower,upper,material) {
  for(let i=0;i<lower.length;i++){
    const next=(i+1)%lower.length;
    mesh.quad(lower[i],lower[next],upper[next],upper[i],typeof material==='number'?material:material(i));
  }
}

function radialCap(mesh,x,z,profile,sides,phase) {
  const rings=profile.map(([y,r])=>ring([x,y,z],r,sides,phase));
  for(let i=1;i<rings.length;i++)
    ringSegment(mesh,rings[i-1],rings[i],profile[i][2]);
  for(const index of [0,rings.length-1]){
    const [y,,material]=profile[index];
    const circle=rings[index];
    for(let side=0;side<sides;side++)
      mesh.tri([x,y,z],circle[side],circle[(side+1)%sides],material);
  }
}

function shelf(mesh,random,variant) {
  for(let bracket=0;bracket<3; bracket++){
    const x=(bracket%2===0?1:-1)*(.115+random()*.065), y=.38+bracket*.42;
    const width=.25-.028*bracket+variant*.012, depth=.21+random()*.08;
    const band=(i,scale,dy)=>{
      const angle=i*Math.PI/7;
      return [x+Math.cos(angle)*width*scale,y+dy,.025+Math.sin(angle)*depth*scale];
    };
    for(let i=0;i<7;i++){
      const outer=band(i,1,0), next=band(i+1,1,0);
      mesh.quad(band(i,.63,.05),outer,next,band(i+1,.63,.05),1);
      mesh.tri([x,y+.073,.028],band(i,.63,.05),band(i+1,.63,.05),0);
      mesh.quad(outer,band(i,.83,-.065),band(i+1,.83,-.065),next,2);
      mesh.tri([x,y-.083,.025],band(i+.12,.83,-.065),band(i+1,.83,-.065),3);
    }
  }
}

function cavecap(mesh,random,variant) {
  const x=(random()-.5)*.16, z=(random()-.5)*.14, h=.49+variant*.058+random()*.11;
  radialCap(mesh,0,0,[[0,.06,5],[h*.32,.041,6],[h*.76,.05,6]],6,random()*TURN);
  radialCap(mesh,x,z,[[h*.55,.19,5],[h*.72,.24,6],[h*.88,.195,6],[h,.058,4]],9,random()*TURN);
}

function sporePod(mesh,random,variant) {
  const phase=random()*TURN;
  for(let i=0;i<3;i++){
    const angle=phase+i*TURN/3,r=.11+random()*.055;
    const x=Math.cos(angle)*r,z=Math.sin(angle)*r;
    const y=.31+random()*.23+variant*.025, width=.063+random()*.034;
    radialCap(mesh,x,z,[[0,.027,0],[y*.74,.021,23]],5,angle);
    radialCap(mesh,x,z,[[y*.72,width*.38,1],[y*.93,width,17],[y*1.22,width*.9,15],
      [y*1.40,width*.36,16]],6,angle);
  }
}

function arcaneFlower(mesh,random,variant) {
  const phase=random()*TURN, y=.55+variant*.042, x=(random()-.5)*.13,z=(random()-.5)*.13;
  radialCap(mesh,x,z,[[0,.028,23],[y*.45,.024,11],[y,.032,11]],5,phase);
  const center=[x,y,z];
  for(let i=0;i<6;i++){
    const angle=phase+i*TURN/6;
    const tip=around(center,.27+random()*.051,angle,.05+random()*.02);
    const left=around(center,.123,angle-.35,.031),right=around(center,.123,angle+.35,.029);
    const split=around(center,.15,angle,.097);
    mesh.tri(center,left,split,8);
    mesh.tri(left,tip,split,7);
    mesh.tri(center,split,right,9);
    mesh.tri(split,tip,right,7);
  }
  radialCap(mesh,x,z,[[y,.065,8],[y+.10,.027,9]],7,phase);
}

function lightVine(mesh,random,variant) {
  let prev=[-.25,1.48,.022];
  for(let i=1;i<=11;i++){
    const next=[Math.sin(i*.64+variant*.23)*.24,1.56-i*.119,.025+i*.004];
    const offset=(p,dx)=>[p[0]+dx,p[1],p[2]];
    mesh.quad(offset(prev,-.018),offset(prev,.018),offset(next,.013),offset(next,-.013),10);
    const side=i%2===0?1:-1;
    const tip=[next[0]+side*(.07+random()*.04),next[1]-.085,next[2]+.054];
    const left=[next[0]+side*.042,next[1]-.027,next[2]+.027];
    const right=[next[0]+side*.031,next[1]-.068,next[2]+.040];
    mesh.tri(next,left,tip,11);
    mesh.tri(next,tip,right,12);
    if(i%3===0)
      radialCap(mesh,tip[0],tip[2],[[tip[1]-.031,.015,11],[tip[1]+.036,.040,12],
        [tip[1]+.068,.012,6]],5,random()*TURN);
    prev=next;
  }
}

function lantern(mesh,random,variant) {
  const phase=random()*TURN, h=.52+variant*.045+random()*.13, r=.22+random()*.045;
  radialCap(mesh,0,0,[[0,.075,0],[h*.24,.043,1],[h*.78,.06,1]],7,phase);
  const segments=8;
  const rim=ring([0,h*.72,0],r,segments,phase);
  const crown=ring([0,h,0],r*.54,segments,phase+.05);
  for(let i=0;i<segments;i++){
    const next=(i+1)%segments;
    const lip=around([0,h*.68,0],r*.77,phase+(i+.5)*TURN/segments,-.077-(i%2)*.022);
    mesh.quad(rim[i],rim[next],crown[next],crown[i],i%2===0?1:16);
    mesh.tri(rim[next],rim[i],lip,15);
    mesh.tri(lip,rim[i],[0,h*.78,0],16);
    mesh.tri([0,h+.066,0],crown[i],crown[next],1);
  }
}

function morel(mesh,random,variant) {
  const phase=random()*TURN, lower=.29+random()*.10, h=.40+variant*.058;
  radialCap(mesh,0,0,[[0,.064,17],[lower*.6,.05,1],[lower,.077,2]],5,phase);
  const bands=[.095,.148,.12,.038], sides=6;
  const grid=bands.map((radius,i)=>ring([0,lower+i*h/3,0],radius,sides,phase+i*.14));
  for(let j=0;j<grid.length-1;j++){
    for(let i=0;i<sides;i++){
      const next=(i+1)%sides;
      const panel=[grid[j][i],grid[j][next],grid[j+1][next],grid[j+1][i]];
      const center=[0,1,2].map(k=>panel.reduce((sum,p)=>sum+p[k],0)/4);
      const inner=panel.map(p=>p.map((n,k)=>center[k]+(n-center[k])*.57));
      for(let edge=0;edge<4;edge++)
        mesh.quad(panel[edge],panel[(edge+1)%4],inner[(edge+1)%4],inner[edge],edge===0?2:1);
      const recessed=[center[0]*.73,center[1],center[2]*.73];
      for(let edge=0;edge<4;edge++)mesh.tri(inner[edge],inner[(edge+1)%4],recessed,17);
    }
  }
  const crown=grid.at(-1);
  for(let i=0;i<sides;i++)mesh.tri(crown[i],crown[(i+1)%sides],[0,lower+h,0],1);
}

function starpetal(mesh,random,variant) {
  const phase=random()*TURN, height=.15+variant*.020;
  const core=[0,height,0];
  for(let i=0;i<8;i++){
    const angle=phase+i*TURN/8;
    const tip=around(core,.25+random()*.06,angle,-height*.43);
    const left=around(core,.103,angle-.31,-.038);
    const right=around(core,.103,angle+.31,-.046);
    const ridge=around(core,.132,angle,.025);
    mesh.tri(core,left,ridge,13);
    mesh.tri(left,tip,ridge,14);
    mesh.tri(core,ridge,right,14);
    mesh.tri(ridge,tip,right,13);
    mesh.tri(core,right,[0,.017,0],23);
  }
  radialCap(mesh,0,0,[[height,.065,5],[height+.06,.036,6]],7,phase);
}

function inkcap(mesh,random,variant) {
  const phase=random()*TURN;
  for(let stalk=0;stalk<3;stalk++){
    const angle=phase+stalk*TURN/3, x=Math.cos(angle)*.18,z=Math.sin(angle)*.18;
    const h=.27+random()*.30+variant*.03;
    radialCap(mesh,x,z,[[0,.025,17],[h*.72,.019,4]],5,angle);
    const apex=[x,h+.11,z], ringlet=ring([x,h, z],.082+random()*.023,7,angle);
    for(let i=0;i<7;i++){
      const edge=around([x,h*.74,z],.122,i*TURN/7+angle,(i%3)*-.027);
      const next=around([x,h*.74,z],.122,(i+1)*TURN/7+angle,((i+1)%3)*-.027);
      mesh.tri(apex,ringlet[i],ringlet[(i+1)%7],19);
      mesh.quad(ringlet[i],edge,next,ringlet[(i+1)%7],i%2===0?18:20);
      mesh.tri([x,h*.75,z],next,edge,18);
    }
  }
}

function velvetCup(mesh,random,variant) {
  const phase=random()*TURN;
  for(let cup=0;cup<3;cup++){
    const angle=phase+cup*TURN/3,x=Math.cos(angle)*.15,z=Math.sin(angle)*.15;
    const h=.09+random()*.12+variant*.018, r=h*.54+.033;
    const bottom=ring([x,.025,z],r*.28,7,angle);
    const rim=ring([x,h,z],r,7,angle+.05);
    const inner=ring([x,h*.88,z],r*.78,7,angle+.05);
    ringSegment(mesh,bottom,rim,21);
    ringSegment(mesh,rim,inner,22);
    for(let side=0;side<7;side++)
      mesh.tri(inner[side],inner[(side+1)%7],[x,h*.32,z],side%2===0?0:21);
  }
}

const makers=new Map([
  ['scene48:shelf-fungus',shelf],['scene48:cavecap',cavecap],['scene48:spore-pod',sporePod],
  ['scene48:enchanted-flower',arcaneFlower],['scene48:glowing-vine',lightVine],
  ['scene48:lantern-mushroom',lantern],['scene48:ringed-morel',morel],
  ['scene48:starpetal',starpetal],['scene48:inkcap-cluster',inkcap],['scene48:velvet-cup',velvetCup]
]);
const luminousPigments=new Map([
  ['scene48:glowing-vine',Object.freeze([6,12])],
  ['scene48:lantern-mushroom',Object.freeze([15,16])]
]);

export const ENCHANTED_FUNGI_IDS=Object.freeze([...makers.keys()]);

export function createEnchantedFungus(sceneId,{seed,anchor,variant=0}={}) {
  const maker=makers.get(sceneId);
  if(!maker||!Number.isSafeInteger(seed)||!Array.isArray(anchor)||anchor.length!==3||
      !anchor.every(Number.isSafeInteger)||!Number.isInteger(variant)||variant<0||variant>3)
    throw new TypeError('Invalid enchanted or fungal identity');
  const mesh=createMesh();
  maker(mesh,randomFrom(sceneId,seed,anchor,variant),variant);
  return {sceneId,variant,mesh:mesh.finish(),palette:colors,
    luminousMaterials:luminousPigments.get(sceneId),
    attachment:maker===shelf||maker===lightVine?'wall':'ground'};
}
