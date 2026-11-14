// MYTHWROUGHT Pack 2 — isolated candidate assets. NOT installed in the live registry.
// IDs 59–62 are provisional; no generated-world placement or shared-file edits.
// The physical selection/collision source of truth is each union of AABBs.
const box=(...v)=>Object.freeze(v);
const asset=(x)=>Object.freeze({...x,boxes:Object.freeze(x.boxes),palette:Object.freeze(x.palette),
  surface:Object.freeze(x.surface),integration:Object.freeze(x.integration)});
export const PACK_2_ASSETS=Object.freeze([
  asset({id:59,roster:13,key:'planed-oak-planks',name:'Planed oak plank block',family:'wooden-planks',
    profile:'solid dressed board courses',axis:'y',rotatable:true,
    boxes:[box(0,0,0,1,1,1)],palette:{base:[.69,.44,.24],grain:[.37,.22,.12],edge:[.86,.61,.34]},
    surface:{grain:'staggered-planed-boards',bands:4,finish:'honey-oak',visibleJoint:'dark shallow board seams'},
    integration:{collision:'solid-box-union',selection:'shape-aware',save:'candidate-rotation-sidecar'} }),
  asset({id:60,roster:14,key:'peeled-ash-log',name:'Peeled ash log',family:'stripped-logs',
    profile:'faceted rounded horizontal trunk',axis:'x',rotatable:true,
    boxes:[box(0,.22,.13,1,.78,.87),box(0,.13,.22,1,.87,.78)],
    palette:{base:[.79,.64,.40],grain:[.43,.32,.18],edge:[.93,.78,.53]},
    surface:{grain:'long-fibred-ash-with-end-rings',bands:3,finish:'pale-peeled-wood',visibleJoint:'no-plank-seams'},
    integration:{collision:'solid-box-union',selection:'shape-aware',save:'candidate-rotation-sidecar'} }),
  asset({id:61,roster:15,key:'ironbound-heartwood-beam',name:'Ironbound heartwood beam',family:'timber-beams',
    profile:'square horizontal beam with reinforced shoulders',axis:'x',rotatable:true,
    boxes:[box(0,.26,.26,1,.74,.74),box(0,.20,.20,.14,.80,.80),
      box(.86,.20,.20,1,.80,.80)],
    palette:{base:[.40,.24,.17],grain:[.22,.13,.11],edge:[.65,.40,.26]},
    surface:{grain:'dark-directional-sawn-fibre',bands:2,finish:'smoked-heartwood',visibleJoint:'shoulder collars'},
    integration:{collision:'solid-box-union',selection:'shape-aware',save:'candidate-rotation-sidecar'} }),
  asset({id:62,roster:22,key:'dovetailed-support-post',name:'Dovetailed support post',family:'wooden-support-posts',
    profile:'vertical square shaft, socket and flared foot',axis:'y',rotatable:false,
    boxes:[box(.33,0,.33,.67,1,.67),box(.23,0,.23,.77,.14,.77),
      box(.27,.86,.27,.73,1,.73)],
    palette:{base:[.58,.32,.20],grain:[.28,.17,.11],edge:[.77,.48,.29]},
    surface:{grain:'vertical-cut-with-socket-detail',bands:2,finish:'seasoned-chestnut',visibleJoint:'raised-collar-and-foot'},
    integration:{collision:'solid-box-union',selection:'shape-aware',save:'candidate-rotation-sidecar'} })
]);
export const PACK_2_IDS=Object.freeze(PACK_2_ASSETS.map(a=>a.id));
const byId=new Map(PACK_2_ASSETS.map(a=>[a.id,a]));
export function pack2Asset(id){return byId.get(id)??null;}
export function normalizeRotation(rotation){
  if(!Number.isInteger(rotation)||rotation<0||rotation>3)throw new RangeError('rotation must be 0..3');
  return rotation;
}
function rotatedBox(b,n){
  let [x,y,z,X,Y,Z]=b;
  for(let i=0;i<n;i++) [x,z,X,Z]=[1-Z,x,1-z,X];
  return box(x,y,z,X,Y,Z);
}
export function pack2Shape(id,rotation=0){
  const a=pack2Asset(id);
  if(!a)throw new RangeError('Unknown Pack 2 candidate ID');
  normalizeRotation(rotation);
  if(!a.rotatable&&rotation!==0)throw new RangeError('This post is not rotatable');
  const boxes=Object.freeze(a.boxes.map(b=>rotatedBox(b,rotation)));
  // Compatible with :00 opt-in shape-aware targeting contract, NOT live world.get.
  return Object.freeze({id,rotation,boxes,units:'cell',occupancy:'union-of-boxes',
    selection:'all-exposed-faces',collision:'boxes',candidateOnly:true});
}
export function pack2Cell(id,rotation=0){
  const shape=pack2Shape(id,rotation);
  return Object.freeze({id,rotation:shape.rotation});
}
export function parsePack2Cell(row){
  if(!row||typeof row!=='object'||Array.isArray(row)||
      Object.keys(row).sort().join(',')!=='id,rotation')throw new TypeError('Bad candidate cell record');
  return pack2Cell(row.id,row.rotation);
}
export function pack2Occupies(id,rotation,point){
  if(!Array.isArray(point)||point.length!==3||!point.every(Number.isFinite))throw new TypeError('Bad point');
  return pack2Shape(id,rotation).boxes.some(b=>point.every((v,i)=>v>=b[i]&&v<b[i+3]));
}
function occupied(boxes,x,y,z){
  return boxes.some(b=>x>=b[0]&&x<b[3]&&y>=b[1]&&y<b[4]&&z>=b[2]&&z<b[5]);
}
function bilinear(c,u,v){
  const p=c[0],q=c[1],r=c[2],s=c[3];
  return [0,1,2].map(i=>p[i]*(1-u)*(1-v)+q[i]*u*(1-v)+r[i]*u*v+s[i]*(1-u)*v);
}
export function pack2PreviewMesh(id,rotation=0){
  // Actual renderable geometry for an isolated browser inspector. Not in a chunk mesh.
  // Surface partitions remove hidden overlapping-box faces, unlike naive box concatenation.
  const a=pack2Asset(id),boxes=pack2Shape(id,rotation).boxes;
  const axes=[0,1,2].map(j=>[...new Set(boxes.flatMap(b=>[b[j],b[j+3]]))].sort((u,v)=>u-v));
  const [xs,ys,zs]=axes,pos=[],rgb=[],normal=[],indices=[];
  let physicalQuads=0,decorationQuads=0;
  function emit(c,n,color,offset=0){
    const start=pos.length/3;
    for(const p of c){
      pos.push(p[0]+n[0]*offset,p[1]+n[1]*offset,p[2]+n[2]*offset);
      rgb.push(...color);normal.push(...n);
    }
    indices.push(start,start+1,start+2,start,start+2,start+3);
  }
  function addFace(c,n){
    const shade=n[1]>0?1.07:n[1]<0?.69:n[0]!==0?.86:.94;
    const base=a.palette.base.map(v=>Math.min(1,v*shade));
    emit(c,n,base);physicalQuads++;
    const u=Math.hypot(...c[1].map((v,i)=>v-c[0][i]));
    const v=Math.hypot(...c[3].map((w,i)=>w-c[0][i]));
    if(u<.18||v<.18)return;
    const longitudinal=(a.axis==='y'&&n[1]===0)||(a.axis==='x'&&n[0]===0);
    // Actual embedded linework: tiny mesh ribbons mark handmade saw/grain seams.
    // Lines are overlays on the SAME physically registered volume, never faux blocks.
    const bands=longitudinal?a.surface.bands:Math.max(1,a.surface.bands-1);
    for(let i=1;i<=bands;i++){
      const t=i/(bands+1),w=Math.min(.018,Math.max(.004,.012/v));
      const q=[bilinear(c,.06,t-w),bilinear(c,.94,t-w),
        bilinear(c,.94,t+w),bilinear(c,.06,t+w)];
      emit(q,n,a.palette.grain,.0015);decorationQuads++;
    }
    if(id===59 && n[1]!==-1 && u>.35 && v>.35){
      // Interlocking short staggered joints keep a plank block distinct from raw Wood 4.
      const t=n[1]>0?.35:.63;
      emit([bilinear(c,t,.05),bilinear(c,t+.014,.05),
        bilinear(c,t+.014,.34),bilinear(c,t,.34)],n,a.palette.grain,.0017);decorationQuads++;
    }
    if(id===61 && u>.3 && v>.3){
      const t=.12;
      emit([bilinear(c,t,t),bilinear(c,t+.035,t),
        bilinear(c,t+.035,t+.035),bilinear(c,t,t+.035)],n,a.palette.edge,.0019);decorationQuads++;
    }
    if(id===60 && Math.abs(n[0])+Math.abs(n[2])===1 && !longitudinal && u>.3 && v>.3){
      for(const f of [.22,.32]){
        const q=[bilinear(c,f,f),bilinear(c,1-f,f),
          bilinear(c,1-f,f+.014),bilinear(c,f,f+.014)];
        emit(q,n,a.palette.grain,.0018);decorationQuads++;
      }
    }
  }
  const e=1e-7;
  for(let i=0;i<xs.length-1;i++)for(let j=0;j<ys.length-1;j++)for(let k=0;k<zs.length-1;k++){
    const x=xs[i],X=xs[i+1],y=ys[j],Y=ys[j+1],z=zs[k],Z=zs[k+1];
    if(!occupied(boxes,(x+X)/2,(y+Y)/2,(z+Z)/2))continue;
    const at=(xx,yy,zz)=>occupied(boxes,xx,yy,zz);
    if(!at(x-e,(y+Y)/2,(z+Z)/2))addFace([[x,y,Z],[x,y,z],[x,Y,z],[x,Y,Z]],[-1,0,0]);
    if(!at(X+e,(y+Y)/2,(z+Z)/2))addFace([[X,y,z],[X,y,Z],[X,Y,Z],[X,Y,z]],[1,0,0]);
    if(!at((x+X)/2,y-e,(z+Z)/2))addFace([[x,y,z],[x,y,Z],[X,y,Z],[X,y,z]],[0,-1,0]);
    if(!at((x+X)/2,Y+e,(z+Z)/2))addFace([[x,Y,Z],[x,Y,z],[X,Y,z],[X,Y,Z]],[0,1,0]);
    if(!at((x+X)/2,(y+Y)/2,z-e))addFace([[x,y,z],[X,y,z],[X,Y,z],[x,Y,z]],[0,0,-1]);
    if(!at((x+X)/2,(y+Y)/2,Z+e))addFace([[X,y,Z],[x,y,Z],[x,Y,Z],[X,Y,Z]],[0,0,1]);
  }
  return Object.freeze({positions:new Float32Array(pos),colors:new Float32Array(rgb),
    normals:new Float32Array(normal),indices:new Uint16Array(indices),
    triangles:indices.length/3,physicalQuads,decorationQuads,
    candidateOnly:true,allGeometryBackedByPhysicalShape:true});
}
