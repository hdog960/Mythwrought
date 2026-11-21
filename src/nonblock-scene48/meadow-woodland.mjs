// Original meadow and woodland additions. Positions are local to the mount.
const palette=Object.freeze([
  [.24,.40,.22],[.35,.55,.27],[.57,.68,.34],[.67,.52,.24],
  [.92,.75,.42],[.98,.75,.20],[.96,.55,.12],[.40,.26,.14],
  [.70,.41,.20],[.75,.54,.26],[.38,.53,.30],[.54,.65,.39]
].map(color=>Object.freeze(color)));
const turn=2*Math.PI;
const goldenAngle=Math.PI*(3-Math.sqrt(5));

function randomFor(sceneId,seed,anchor,variant) {
  let state=2166136261;
  for(const char of [sceneId,seed,...anchor,variant].join(':'))state=Math.imul(state^char.charCodeAt(0),16777619);
  return ()=>{
    state=Math.imul(state,1664525)+1013904223|0;
    return (state>>>0)/4294967296;
  };
}

function meshBuilder() {
  const positions=[],materials=[];
  const triangle=(a,b,c,material)=>{
    positions.push(...a,...b,...c);
    materials.push(material);
  };
  return {
    triangle,
    quad(a,b,c,d,material){
      triangle(a,b,c,material);
      triangle(a,c,d,material);
    },
    finish(){
      return {positions:new Float32Array(positions),materials:new Uint8Array(materials),
        triangleCount:materials.length};
    }
  };
}

function pointsBetween(a,b,t) {
  return a.map((value,i)=>value+(b[i]-value)*t);
}

function radial(center,angle,rise,distance) {
  return [center[0]+Math.cos(angle)*distance,center[1]+rise,center[2]+Math.sin(angle)*distance];
}

function stem(mesh,a,b,width,material) {
  // Two intersecting strips keep stems readable with few triangles.
  const tangent=b.map((value,i)=>value-a[i]);
  const length=Math.hypot(...tangent);
  const [x,y,z]=tangent.map(value=>value/length);
  const first=Math.abs(y)<.9?[-z,0,x]:[1,0,0];
  const second=[y*first[2]-z*first[1],z*first[0]-x*first[2],x*first[1]-y*first[0]];
  for(const side of [first,second]){
    const norm=Math.hypot(...side);
    const point=(p,sign,scale)=>p.map((value,i)=>{
      const offset=value+sign*side[i]*width*scale/norm;
      return i===1?Math.max(0,offset):offset;
    });
    mesh.quad(point(a,-1,1),point(a,1,1),point(b,1,.64),point(b,-1,.64),material);
  }
}

function blade(mesh,base,angle,reach,height,width,material) {
  const mid=radial(base,angle,height*.67,reach*.38);
  const tip=radial(base,angle,height,reach);
  const left=radial(mid,angle-Math.PI/2,-width*.17,width);
  const right=radial(mid,angle+Math.PI/2,-width*.17,width);
  mesh.triangle(base,left,mid,material);
  mesh.triangle(base,mid,right,material+1);
  mesh.triangle(mid,left,tip,material);
  mesh.triangle(mid,tip,right,material+1);
}

function seedHead(mesh,center,angle,radius,length) {
  const top=radial(center,angle,length,.028);
  const bottom=radial(center,angle,-length*.72,-.020);
  const points=Array.from({length:5},(_,i)=>radial(center,angle+i*turn/5,0,radius));
  for(let i=0;i<points.length;i++){
    const next=(i+1)%points.length;
    mesh.triangle(bottom,points[i],points[next],3+i%2);
    mesh.triangle(top,points[next],points[i],4);
  }
}

function plume(mesh,random,variant) {
  const phase=random()*turn;
  for(let i=0;i<5+variant%2;i++){
    const angle=phase+i*goldenAngle;
    blade(mesh,radial([0,0,0],angle,0,.06),angle,.22+random()*.11,.32+random()*.24,.026,1);
  }
  for(let i=0;i<3;i++){
    const angle=phase+i*turn/3, base=radial([0,0,0],angle,0,.06+i*.025);
    const joint=radial(base,angle,.31+i*.055,.035), tip=radial(joint,angle,.33+random()*.15,.07);
    stem(mesh,base,joint,.012,0);
    stem(mesh,joint,tip,.009,1);
    seedHead(mesh,tip,angle,.042+random()*.009,.108+variant*.010);
    seedHead(mesh,pointsBetween(joint,tip,.88),angle,.035,.062);
  }
}

function fescue(mesh,random,variant) {
  const phase=random()*turn;
  for(let i=0;i<10+variant;i++){
    const angle=phase+i*goldenAngle;
    const base=radial([0,0,0],angle,0,.055+(i%3)*.017);
    const elbow=radial(base,angle,.30+random()*.18,.09);
    const tip=radial(elbow,angle,-.13-random()*.08,.18+random()*.10);
    const left=radial(elbow,angle-Math.PI/2,-.025,.027);
    const right=radial(elbow,angle+Math.PI/2,-.025,.027);
    mesh.triangle(base,left,elbow,0);
    mesh.triangle(base,elbow,right,1);
    mesh.triangle(elbow,left,tip,1);
    mesh.triangle(elbow,tip,right,2);
  }
}

function buttercup(mesh,random,variant) {
  const phase=random()*turn;
  for(let i=0;i<3+variant%2;i++){
    const angle=phase+i*goldenAngle;
    const base=radial([0,0,0],angle,0,.050);
    const top=radial(base,angle,.30+random()*.24,.11+random()*.045);
    stem(mesh,base,top,.012,0);
    blade(mesh,pointsBetween(base,top,.38),angle+.72,.14,.052,.040,1);
    blade(mesh,pointsBetween(base,top,.54),angle-1.05,.12,.046,.034,0);
    for(let p=0;p<5;p++){
      const direction=angle+p*turn/5;
      const root=radial(top,direction,.004,.012);
      const left=radial(top,direction-.30,.022,.074);
      const tip=radial(top,direction,.033,.108);
      const right=radial(top,direction+.30,.022,.074);
      mesh.triangle(root,left,tip,6);
      mesh.triangle(root,tip,right,5);
      mesh.triangle(top,radial(top,direction,-.004,.027),radial(top,direction+turn/5,-.004,.027),4);
    }
  }
}

function seedheadMix(mesh,random,variant) {
  const phase=random()*turn;
  for(let i=0;i<5+variant%2;i++){
    const angle=phase+i*goldenAngle;
    const base=radial([0,0,0],angle,0,.04+random()*.10);
    const head=radial(base,angle,.27+random()*.39,.055+random()*.13);
    stem(mesh,base,head,.010,0);
    const joint=pointsBetween(base,head,.58);
    for(const side of [-1,1]){
      const sub=radial(joint,angle+side*1.1,.15+random()*.07,.083);
      stem(mesh,joint,sub,.004,1);
      seedHead(mesh,sub,angle,.020,.031);
    }
    seedHead(mesh,head,angle,.025,.045+random()*.02);
  }
}

function ivyLeaf(mesh,base,mirror,material) {
  const mid=[base[0]+mirror*.068,base[1]+.035,base[2]+.012];
  const points=[
    base,[base[0]+mirror*.028,base[1]-.024,base[2]],
    [base[0]+mirror*.063,base[1]-.016,base[2]+.011],
    [base[0]+mirror*.119,base[1]-.023,base[2]+.009],
    [base[0]+mirror*.154,base[1]+.023,base[2]+.005],
    [base[0]+mirror*.108,base[1]+.052,base[2]+.012],
    [base[0]+mirror*.077,base[1]+.091,base[2]+.006],
    [base[0]+mirror*.047,base[1]+.067,base[2]+.005]
  ];
  points.forEach((point,index)=>mesh.triangle(mid,point,points[(index+1)%points.length],
    index%3===1?material+1:material));
}

function climbingIvy(mesh,random,variant) {
  let from=[-.14,.08,.015];
  for(let i=0;i<8;i++){
    const y=.15+i*.16;
    const next=[Math.sin(i*.75+variant*.25)*.19,y,.030+random()*.025];
    stem(mesh,from,next,.009,7);
    const side=i%2?1:-1;
    ivyLeaf(mesh,next,side,10);
    if(i%3!==1)ivyLeaf(mesh,pointsBetween(from,next,.55),-side,1);
    from=next;
  }
}

function trailVine(mesh,random,variant) {
  for(let strand=0;strand<3;strand++){
    let from=[-.25+strand*.24,1.31+strand*.11,.023];
    for(let i=0;i<6;i++){
      const direction=(i+strand)%2===0?1:-1;
      const next=[from[0]+direction*(.026+random()*.027),from[1]-.15-.018*variant,.037+i*.011];
      stem(mesh,from,next,.008,0);
      const tip=[next[0]+direction*.088,next[1]-.064,next[2]+.022];
      const center=pointsBetween(next,tip,.53);
      mesh.triangle(next,[center[0],center[1]+.032,center[2]+.018],tip,1);
      mesh.triangle(next,tip,[center[0],center[1]-.034,center[2]-.008],2);
      from=next;
    }
  }
}

function leafLitter(mesh,random,variant) {
  const phase=random()*turn;
  for(let i=0;i<9+variant;i++){
    const angle=phase+i*goldenAngle, spread=.09+(i%5)*.064;
    const a=radial([0,0,0],angle,.015+(i%3)*.009,spread);
    const tip=radial(a,angle+.30,.027,.12+random()*.08);
    const ridge=pointsBetween(a,tip,.52).map((value,i)=>i===1?value+.019:value);
    const left=radial(ridge,angle-.96,-.025,.055);
    const right=radial(ridge,angle+1.20,-.025,.043);
    mesh.triangle(a,left,ridge,8);
    mesh.triangle(left,tip,ridge,9);
    mesh.triangle(a,ridge,right,7);
    mesh.triangle(ridge,tip,right,8);
  }
}

function horsetail(mesh,random,variant) {
  const phase=random()*turn;
  for(let stalk=0;stalk<3;stalk++){
    const angle=phase+stalk*turn/3;
    const a=radial([0,0,0],angle,0,.13);
    const top=radial(a,angle,.57+random()*.30,.048+variant*.015);
    stem(mesh,a,top,.015,0);
    for(let level=1;level<=4;level++){
      const section=pointsBetween(a,top,level/5);
      for(let twig=0;twig<4;twig++){
        const direction=angle+twig*turn/4+level*.25;
        blade(mesh,section,direction,.19-level*.019,.042,.012,1);
      }
    }
    seedHead(mesh,top,angle,.025,.037);
  }
}

const families=new Map([
  ['scene48:grass-plume',plume],
  ['scene48:meadow-fescue',fescue],
  ['scene48:buttercup-bunch',buttercup],
  ['scene48:seedhead-meadow-mix',seedheadMix],
  ['scene48:crawling-ivy',climbingIvy],
  ['scene48:trail-vine',trailVine],
  ['scene48:forest-leaf-litter',leafLitter],
  ['scene48:woodland-horsetail',horsetail]
]);

export const MEADOW_WOODLAND_IDS=Object.freeze([...families.keys()]);

export function createMeadowWoodland(sceneId,{seed,anchor,variant=0}={}) {
  const make=families.get(sceneId);
  if(!make||!Number.isSafeInteger(seed)||!Array.isArray(anchor)||anchor.length!==3||
    !anchor.every(Number.isSafeInteger)||!Number.isInteger(variant)||variant<0||variant>3)
    throw new TypeError('Invalid meadow or woodland identity');
  const mesh=meshBuilder();
  make(mesh,randomFor(sceneId,seed,anchor,variant),variant);
  const attachment=make===climbingIvy||make===trailVine?'wall':'ground';
  return {sceneId,variant,attachment,mesh:mesh.finish(),palette};
}
