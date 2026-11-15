// Mythwrought Pack 2 Milestone 2 — independently physical joinery candidates.
// No live-world registry, mesher, physics, UI, or save hooks are touched.
// Each box is local to one cell; "open" moves the actual occupancy/target geometry.
// Shape metadata is an integration proposal for :00 targeting and :12 meshing.
const b=(...v)=>Object.freeze(v);
const immutableSpec=(a)=>Object.freeze({...a,
  palette:Object.freeze(a.palette),surface:Object.freeze(a.surface),
  variants:Object.freeze(a.variants),defaultState:Object.freeze(a.defaultState)});
export const PACK_2_JOINERY=Object.freeze([
  immutableSpec({id:63,roster:16,key:'oak-half-slab',name:'Planed oak half-slab',
    kind:'slab',variants:['lower','upper'],rotatable:false,toggleable:false,
    palette:{wood:[.72,.49,.29],grain:[.36,.24,.14],trim:[.88,.63,.36],metal:[.30,.32,.32]},
    surface:{pattern:'three hand-planed broadwood plies',grainBands:3,feature:'half-height edge grain'},
    defaultState:{rotation:0,variant:'lower',open:false}}),
  immutableSpec({id:64,roster:17,key:'splayed-oak-stair',name:'Splayed oak stair',
    kind:'stairs',variants:['lower','upper'],rotatable:true,toggleable:false,
    palette:{wood:[.64,.40,.23],grain:[.33,.20,.12],trim:[.86,.57,.31],metal:[.30,.32,.32]},
    surface:{pattern:'double tread with riser shadow',grainBands:3,feature:'two-step physical silhouette'},
    defaultState:{rotation:0,variant:'lower',open:false}}),
  immutableSpec({id:65,roster:18,key:'split-rail-fence',name:'Split-rail timber fence',
    kind:'fence',variants:['standard'],rotatable:true,toggleable:false,
    palette:{wood:[.55,.35,.22],grain:[.28,.19,.12],trim:[.73,.49,.30],metal:[.30,.32,.32]},
    surface:{pattern:'two slim slatted rails and pegs',grainBands:2,feature:'open spaces between rails'},
    defaultState:{rotation:0,variant:'standard',open:false}}),
  immutableSpec({id:66,roster:19,key:'latticed-fence-gate',name:'Latticed fence gate',
    kind:'fence-gate',variants:['standard'],rotatable:true,toggleable:true,
    palette:{wood:[.62,.38,.24],grain:[.31,.19,.12],trim:[.85,.57,.31],metal:[.31,.34,.35]},
    surface:{pattern:'diagonal crossbar and iron hinge',grainBands:2,feature:'single-sided hinge swing'},
    defaultState:{rotation:0,variant:'standard',open:false}}),
  immutableSpec({id:67,roster:20,key:'carved-timber-door',name:'Carved timber door panel',
    kind:'door',variants:['standard'],rotatable:true,toggleable:true,
    palette:{wood:[.47,.29,.19],grain:[.24,.15,.11],trim:[.77,.51,.32],metal:[.36,.37,.35]},
    surface:{pattern:'three recessed upright door planks',grainBands:3,feature:'hinged vertical leaf and handle'},
    defaultState:{rotation:0,variant:'standard',open:false}}),
  immutableSpec({id:68,roster:21,key:'planked-hatch-trapdoor',name:'Planked oak trapdoor',
    kind:'trapdoor',variants:['lower','upper'],rotatable:true,toggleable:true,
    palette:{wood:[.60,.40,.23],grain:[.32,.22,.13],trim:[.79,.54,.30],metal:[.30,.35,.36]},
    surface:{pattern:'transverse hatch slats with iron latch',grainBands:3,feature:'physical horizontal-to-vertical swing'},
    defaultState:{rotation:0,variant:'upper',open:false}})
]);
export const PACK_2_JOINERY_IDS=Object.freeze(PACK_2_JOINERY.map(a=>a.id));
const registry=new Map(PACK_2_JOINERY.map(a=>[a.id,a]));
export function joineryAsset(id){return registry.get(id)??null;}
const B=(x,y,z,X,Y,Z,role='wood')=>({box:b(x,y,z,X,Y,Z),role});
const basePieces=(spec,variant,open)=>{
  switch(spec.kind){
    case 'slab':
      return [B(0,variant==='upper'?.5:0,0,1,variant==='upper'?1:.5,1)];
    case 'stairs':
      return variant==='upper'
        ?[B(0,.5,0,1,1,1),B(0,0,.5,1,.5,1)]
        :[B(0,0,0,1,.5,1),B(0,.5,.5,1,1,1)];
    case 'fence':
      return [
        B(.08,0,.36,.22,1,.64,'trim'),B(.78,0,.36,.92,1,.64,'trim'),
        B(0,.29,.40,1,.40,.60),B(0,.68,.40,1,.79,.60)];
    case 'fence-gate':
      return open
        ?[B(.08,0,.37,.22,1,.63,'trim'),B(.10,.27,.16,.24,.40,.88),
          B(.10,.66,.16,.24,.79,.88),B(.12,.37,.32,.23,.70,.48,'metal')]
        :[B(.08,0,.37,.22,1,.63,'trim'),B(0,.28,.43,1,.40,.57),
          B(0,.67,.43,1,.79,.57),B(.45,.34,.44,.57,.76,.56,'trim'),
          B(.74,.42,.41,.87,.56,.59,'metal')];
    case 'door':
      return open
        ?[B(.07,.04,.07,.23,.98,.93),B(.12,.46,.75,.27,.59,.85,'metal'),
          B(.09,.06,.09,.14,.98,.91,'trim')]
        :[B(.07,.04,.42,.94,.98,.58),B(.72,.46,.39,.83,.58,.61,'metal'),
          B(.09,.06,.41,.14,.98,.59,'trim')];
    case 'trapdoor': {
      const y=variant==='upper'?.80:.04;
      return open
        ?[B(.07,variant==='upper'?.10:.04,.06,.93,variant==='upper'?.96:.90,.22),
          B(.43,.45,.20,.57,.59,.27,'metal')]
        :[B(.07,y,.06,.93,y+.16,.94),
          B(.43,y+.15,.75,.57,y+.20,.87,'metal')];
    }
  }
  throw new RangeError('Unknown joinery profile');
};
const turn=(box,r)=>{
  let [x,y,z,X,Y,Z]=box;
  for(let i=0;i<r;i++) [x,z,X,Z]=[1-Z,x,1-z,X];
  return b(x,y,z,X,Y,Z);
};
export function joineryCell(id,{rotation,variant,open}={}){
  const spec=joineryAsset(id);
  if(!spec)throw new RangeError('Unregistered Pack 2 joinery ID');
  rotation??=spec.defaultState.rotation;
  variant??=spec.defaultState.variant;
  open??=spec.defaultState.open;
  if(!Number.isInteger(rotation)||rotation<0||rotation>3||
    (!spec.rotatable&&rotation!==0))throw new RangeError('Invalid joinery rotation');
  if(!spec.variants.includes(variant))throw new RangeError('Invalid joinery variant');
  if(typeof open!=='boolean'||(open&&!spec.toggleable))throw new RangeError('Invalid joinery open state');
  return Object.freeze({id,rotation,variant,open});
}
export function parseJoineryCell(row){
  if(!row||Array.isArray(row)||typeof row!=='object'||
      Object.keys(row).sort().join(',')!=='id,open,rotation,variant')
      throw new TypeError('Malformed joinery fixture state');
  return joineryCell(row.id,row);
}
export function joineryShape(id,state={}){
  const cell=joineryCell(id,state),spec=joineryAsset(id);
  const parts=basePieces(spec,cell.variant,cell.open)
    .map(piece=>Object.freeze({box:turn(piece.box,cell.rotation),role:piece.role}));
  if(parts.length>32)throw new Error('Too many shape boxes');
  for(const p of parts)for(let i=0;i<3;i++)
    if(p.box[i]<0||p.box[i]>=p.box[i+3]||p.box[i+3]>1)
      throw new Error('Invalid physical joinery occupancy');
  return Object.freeze({...cell,boxes:Object.freeze(parts.map(p=>p.box)),
    parts:Object.freeze(parts),units:'voxel',collision:'union-of-boxes',
    selection:'union-of-boxes',candidateOnly:true,
    stateAffectsPhysicalTargeting:true});
}
export function nextJoineryState(id,state={}){
  const spec=joineryAsset(id);
  if(!spec?.toggleable)throw new RangeError('This timber shape cannot be opened');
  const cell=joineryCell(id,state);
  return joineryCell(id,{...cell,open:!cell.open});
}
export function joineryOccupies(id,state,point){
  if(!Array.isArray(point)||point.length!==3||!point.every(Number.isFinite))
    throw new TypeError('Point must be finite [x,y,z]');
  return joineryShape(id,state).boxes.some(b=>
    point.every((v,i)=>v>=b[i]&&v<b[i+3]));
}
const within=(box,x,y,z)=>x>=box[0]&&x<box[3]&&y>=box[1]&&y<box[4]&&z>=box[2]&&z<box[5];
export function joineryPreviewMesh(id,state={}){
  // Independent authentic mesh, not hooked to main's chunk renderer.
  // Partition all parts at their AABB boundaries to omit occluded faces.
  const spec=joineryAsset(id),shape=joineryShape(id,state),parts=shape.parts;
  const cuts=[0,1,2].map(axis=>
    [...new Set(parts.flatMap(p=>[p.box[axis],p.box[axis+3]]))].sort((a,b)=>a-b));
  const pos=[],colors=[],normals=[],indices=[];
  let physicalQuads=0,decorationQuads=0;
  const push=(verts,n,color,offset=0)=>{
    const st=pos.length/3;
    for(const v of verts){
      pos.push(v[0]+n[0]*offset,v[1]+n[1]*offset,v[2]+n[2]*offset);
      colors.push(...color);normals.push(...n);
    }
    // Keep outward-facing triangle winding consistent with the AABB normals.
    indices.push(st,st+2,st+1,st,st+3,st+2);
  };
  const colorOf=(x,y,z)=>{
    const role=parts.find(p=>within(p.box,x,y,z))?.role??'wood';
    return spec.palette[role];
  };
  const occupied=(x,y,z)=>parts.some(p=>within(p.box,x,y,z));
  const point=(v,u,w)=>v[0]*(1-u)*(1-w)+v[1]*u*(1-w)+v[2]*u*w+v[3]*(1-u)*w;
  const lerp=(c,u,w)=>[0,1,2].map(i=>point(c.map(v=>v[i]),u,w));
  const add=(corners,n,faceColor)=>{
    const shade=n[1]===1?1.08:n[1]===-1?.72:n[0]===0?.96:.87;
    push(corners,n,faceColor.map(v=>Math.min(1,v*shade)));
    physicalQuads++;
    const edgeU=Math.hypot(...corners[1].map((v,i)=>v-corners[0][i]));
    const edgeV=Math.hypot(...corners[3].map((v,i)=>v-corners[0][i]));
    if(edgeU<.16||edgeV<.12)return;
    const grains=Math.min(3,spec.surface.grainBands);
    for(let q=1;q<=grains;q++){
      const t=q/(grains+1),w=Math.min(.022,.018/edgeV);
      push([lerp(corners,.08,t-w),lerp(corners,.92,t-w),
        lerp(corners,.92,t+w),lerp(corners,.08,t+w)],n,spec.palette.grain,.0015);
      decorationQuads++;
    }
  };
  const [xs,ys,zs]=cuts,e=1e-7;
  for(let i=0;i<xs.length-1;i++)for(let j=0;j<ys.length-1;j++)for(let k=0;k<zs.length-1;k++){
    const x=xs[i],X=xs[i+1],y=ys[j],Y=ys[j+1],z=zs[k],Z=zs[k+1];
    const mid=[(x+X)/2,(y+Y)/2,(z+Z)/2];
    if(!occupied(...mid))continue;
    const paint=colorOf(...mid);
    if(!occupied(x-e,mid[1],mid[2]))add([[x,y,Z],[x,y,z],[x,Y,z],[x,Y,Z]],[-1,0,0],paint);
    if(!occupied(X+e,mid[1],mid[2]))add([[X,y,z],[X,y,Z],[X,Y,Z],[X,Y,z]],[1,0,0],paint);
    if(!occupied(mid[0],y-e,mid[2]))add([[x,y,z],[x,y,Z],[X,y,Z],[X,y,z]],[0,-1,0],paint);
    if(!occupied(mid[0],Y+e,mid[2]))add([[x,Y,Z],[x,Y,z],[X,Y,z],[X,Y,Z]],[0,1,0],paint);
    if(!occupied(mid[0],mid[1],z-e))add([[x,y,z],[X,y,z],[X,Y,z],[x,Y,z]],[0,0,-1],paint);
    if(!occupied(mid[0],mid[1],Z+e))add([[X,y,Z],[x,y,Z],[x,Y,Z],[X,Y,Z]],[0,0,1],paint);
  }
  return Object.freeze({positions:new Float32Array(pos),colors:new Float32Array(colors),
    normals:new Float32Array(normals),indices:new Uint16Array(indices),
    triangles:indices.length/3,physicalQuads,decorationQuads,
    candidateOnly:true,allGeometryBackedByPhysicalShape:true});
}
