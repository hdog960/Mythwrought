// Scene36 growth beyond the inherited props. Pack-owned doors, railings,
// wall lights and furnishings use their existing source through an adapter.
const TAU=2*Math.PI;
const palette=Object.freeze([
  [.37,.24,.15],[.55,.36,.22],[.69,.50,.29],[.80,.61,.37],
  [.27,.28,.30],[.49,.46,.44],[.67,.48,.24],[.88,.68,.33],
  [.73,.38,.21],[.52,.25,.17],[.89,.54,.29],[.36,.33,.30]
].map(color=>Object.freeze(color)));

function builder() {
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

function noiseFrom(id,seed,anchor,variant){
  let state=2166136261;
  for(const char of [id,seed,...anchor,variant].join(':'))state=Math.imul(state^char.charCodeAt(0),16777619);
  return ()=>{
    state=Math.imul(state,1664525)+1013904223|0;
    return (state>>>0)/4294967296;
  };
}

function box(mesh,[x,y,z],[r,t,f],material){
  const a=[x,y,z],b=[r,y,z],c=[r,t,z],d=[x,t,z];
  const e=[x,y,f],g=[r,y,f],h=[r,t,f],i=[x,t,f];
  mesh.quad(a,d,c,b,material);
  mesh.quad(e,g,h,i,material);
  mesh.quad(a,e,i,d,material);
  mesh.quad(b,c,h,g,material);
  mesh.quad(a,b,g,e,material);
  mesh.quad(d,i,h,c,material);
}

function tube(mesh,a,b,ra,rb,sides,material,end=material){
  const axis=b.map((n,i)=>n-a[i]);
  const unit=axis.map(n=>n/Math.hypot(...axis));
  const [x,y,z]=unit;
  const edge=Math.abs(y)<.9?[-z,0,x]:[1,0,0];
  const u=edge.map(n=>n/Math.hypot(...edge));
  const v=[y*u[2]-z*u[1],z*u[0]-x*u[2],x*u[1]-y*u[0]];
  const point=(center,r,angle)=>center.map((n,i)=>n+r*(u[i]*Math.cos(angle)+v[i]*Math.sin(angle)));
  for(let i=0;i<sides;i++){
    const t=TAU*i/sides,next=TAU*(i+1)/sides;
    const la=point(a,ra,t),lb=point(a,ra,next),ha=point(b,rb,t),hb=point(b,rb,next);
    mesh.quad(la,lb,hb,ha,material);
    mesh.tri(a,lb,la,end);
    mesh.tri(b,ha,hb,end);
  }
}

function ladder(mesh,random,variant){
  const width=.27+variant*.023,height=1.52+variant*.12;
  for(const x of [-width,width]){
    box(mesh,[x-.052,0,.057],[x+.052,height,.136],0);
    for(const y of [.12,height-.20])box(mesh,[x-.046,y,.006],[x+.046,y+.075,.066],4);
  }
  for(let rung=0;rung<6;rung++){
    const y=.17+rung*(height-.31)/6, d=.083+random()*.023;
    box(mesh,[-width,y,d],[width,y+.061,d+.066],1+rung%2);
  }
  return [];
}

function ropeLadder(mesh,random,variant){
  const span=.285+variant*.022, length=1.57+variant*.13;
  const ropePoint=(side,t)=>[side*span+Math.sin(t*3.6+variant)*.033,-t*length,
    .04*Math.sin(t*7.2+variant+side)];
  for(const side of [-1,1]){
    for(let i=0;i<6;i++)
      tube(mesh,ropePoint(side,i/6),ropePoint(side,(i+1)/6),.023,.021,3,3);
  }
  for(let rung=1;rung<=6;rung++){
    const t=(rung-.15)/6, a=ropePoint(-1,t),b=ropePoint(1,t);
    b[1]+=.02*(random()-.5);
    tube(mesh,a,b,.034,.032,4,1,2);
  }
  return [];
}

function torch(mesh,random,variant){
  const height=.92+variant*.094, radius=.22+variant*.022;
  tube(mesh,[0,0,0],[0,.11,0],radius,radius*.76,6,4,5);
  tube(mesh,[0,.11,0],[.015,height,0],.056,.039,6,0,2);
  tube(mesh,[.015,height,0],[.015,height+.12,0],.082,.116,7,4,5);
  for(let i=0;i<3;i++){
    const angle=i*TAU/3+random()*.31;
    const a=[Math.cos(angle)*.10,height+.033,Math.sin(angle)*.10];
    const b=[a[0]*1.44,height+.19,a[2]*1.44];
    tube(mesh,a,b,.026,.019,4,4,5);
  }
  return [[-.13,0,-.13,.13,.11,.13],[-.04,.11,-.04,.05,height+.12,.04]];
}

function firewood(mesh,random,variant){
  for(let layer=0;layer<3;layer++){
    const count=3;
    for(let i=0;i<count;i++){
      const y=.059+layer*.097+i%2*.014;
      const span=.25+random()*.09+variant*.009,offset=(i-1)*.14;
      const a=layer%2?[offset,y,-span]:[-span,y,offset];
      const b=layer%2?[offset+.015,y,span]:[span,y+.01,offset-.018];
      tube(mesh,a,b,.056,.047,5,i%2,2+i%2);
    }
  }
  return [[-.27,0,-.27,.27,.27,.27]];
}

function circularBowl(mesh,[x,z],levels,sides,phase){
  const rings=levels.map(([radius,y])=>Array.from({length:sides},(_,i)=>{
    const angle=phase+i*TAU/sides;
    return [x+Math.cos(angle)*radius,y,z+Math.sin(angle)*radius];
  }));
  for(let i=1;i<rings.length;i++)
    for(let side=0;side<sides;side++){
      const next=(side+1)%sides;
      mesh.quad(rings[i-1][side],rings[i-1][next],rings[i][next],rings[i][side],levels[i][2]);
    }
}

function brazier(mesh,random,variant){
  const phase=random()*TAU, rim=.29+variant*.025;
  for(let i=0;i<3;i++){
    const angle=phase+i*TAU/3,dx=Math.cos(angle),dz=Math.sin(angle);
    tube(mesh,[dx*.24,.017,dz*.24],[dx*.13,.32,dz*.13],.035,.047,4,4,5);
  }
  circularBowl(mesh,[0,0],[
    [.13,.31,4],[rim,.52,4],[rim+.019,.55,6],[rim-.049,.546,5],[.11,.36,11]
  ],9,phase);
  return [[-.19,0,-.19,.19,.31,.19],[-rim*.79,.31,-rim*.79,rim*.79,.55,rim*.79]];
}

function bell(mesh,random,variant){
  const phase=random()*TAU, length=.43+variant*.059, radius=.19+variant*.021;
  tube(mesh,[0,0,0],[0,-.15,0],.028,.021,5,4,5);
  circularBowl(mesh,[0,0],[
    [.044,-.15,6],[radius*.58,-.22,7],[radius*.74,-length*.74,6],
    [radius,-length,7],[radius*.83,-length-.012,6],[radius*.56,-length*.70,5]
  ],11,phase);
  tube(mesh,[0,-.29,0],[.025,-length-.083,0],.023,.041,5,5,4);
  return [];
}

function pottery(mesh,random,variant){
  const phase=random()*TAU;
  for(let fragment=0;fragment<5+variant%2;fragment++){
    const angle=phase+fragment*2.399963, d=.12+(fragment%3)*.12;
    const x=Math.cos(angle)*d,z=Math.sin(angle)*d,w=.085+random()*.054;
    const h=.045+random()*.085;
    const local=(dx,y,dz)=>[x+Math.cos(angle)*dx-Math.sin(angle)*dz,y,
      z+Math.sin(angle)*dx+Math.cos(angle)*dz];
    const a=local(-w,.025,-w*.22),b=local(w*.86,.016,-w*.33);
    const c=local(w*.53,h,w*.35),d1=local(-w*.37,h*.72,w*.46);
    const a2=[a[0],a[1]-.012,a[2]],b2=[b[0],b[1]-.012,b[2]];
    const c2=[c[0],c[1]-.012,c[2]],d2=[d1[0],d1[1]-.012,d1[2]];
    mesh.quad(a,b,c,d1,8+fragment%3);
    mesh.quad(a2,d2,c2,b2,9);
    mesh.quad(a,a2,b2,b,8);
    mesh.quad(c,c2,d2,d1,10);
  }
  return [];
}

const families=new Map([
  ['scene36:ladder-assembly',{make:ladder,attachment:'wall',climbable:true}],
  ['scene36:rope-ladder',{make:ropeLadder,attachment:'ceiling',climbable:true}],
  ['scene36:freestanding-torch',{make:torch,attachment:'ground'}],
  ['scene36:campfire-fuel-stack',{make:firewood,attachment:'ground'}],
  ['scene36:brazier',{make:brazier,attachment:'ground'}],
  ['scene36:hanging-bell',{make:bell,attachment:'ceiling'}],
  ['scene36:broken-pottery-scatter',{make:pottery,attachment:'ground'}]
]);
export const WORLD_PROP_IDS=Object.freeze([...families.keys()]);

export function createWorldProp(sceneId,{seed,anchor,variant=0}={}) {
  const family=families.get(sceneId);
  if(!family||!Number.isSafeInteger(seed)||!Array.isArray(anchor)||anchor.length!==3||
    !anchor.every(Number.isSafeInteger)||!Number.isInteger(variant)||variant<0||variant>3)
    throw new TypeError('Invalid fitting or prop identity');
  const mesh=builder();
  const colliders=family.make(mesh,noiseFrom(sceneId,seed,anchor,variant),variant);
  return {sceneId,variant,attachment:family.attachment,climbable:Boolean(family.climbable),
    mesh:mesh.finish(),colliders,palette};
}
