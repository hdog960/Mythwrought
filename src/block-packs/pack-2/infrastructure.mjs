// MYTHWROUGHT Pack 2 M4: individual infrastructure building PIECES only.
// Not a generated bridge, road, parapet assembly, house or deployed game module.
// Local AABB unions are authoritative for targeting + collision in the opt-in fixture.
const box=(x,y,z,X,Y,Z,role)=>Object.freeze({box:Object.freeze([x,y,z,X,Y,Z]),role});
const freeze=o=>Object.freeze(o);
export const PACK_2_INFRASTRUCTURE=freeze([
  freeze({id:73,roster:43,key:'riveted-crossbrace-bridge-guard',family:'bridge-railing',
    name:'Riveted bridge guardrail',
    profile:'load-braced double stanchions with deep handrail and iron cross-strapping',
    rotations:4,variants:freeze(['through','terminal']),
    palette:freeze({oak:freeze([.43,.28,.19]),grain:freeze([.25,.16,.12]),
      iron:freeze([.32,.37,.39]),ironHighlight:freeze([.60,.66,.65]),
      cap:freeze([.70,.46,.28])}),
    finish:'pitch-blackened structural oak and hand-hammered iron',
    integration:freeze({physical:'union-of-boxes',target:'shape-aware',
      storage:'opt-in orientation+variant metadata',worldPlaced:false})}),
  freeze({id:74,roster:44,key:'coping-stone-protective-parapet',family:'stone-parapet',
    name:'Limestone parapet with broad coping',
    profile:'thick full stone protective ledge under overhanging moulded cap',
    rotations:4,variants:freeze(['solid','drain-slot']),
    palette:freeze({stone:freeze([.58,.62,.61]),shadow:freeze([.33,.39,.41]),
      cap:freeze([.75,.74,.68]),carving:freeze([.46,.51,.53]),
      grain:freeze([.40,.45,.46])}),
    finish:'dressed mist-grey limestone and weathered broad coping',
    integration:freeze({physical:'union-of-boxes',target:'shape-aware',
      storage:'opt-in orientation+variant metadata',worldPlaced:false})}),
  freeze({id:75,roster:46,key:'raised-larch-boardwalk-tile',family:'wooden-boardwalk',
    name:'Raised larch boardwalk module',
    profile:'open-gapped deck boards on two elevated joists and paired bearing shoes',
    rotations:2,variants:freeze(['open-deck','edge-trim']),
    palette:freeze({joist:freeze([.37,.24,.16]),plank:freeze([.63,.42,.25]),
      alternate:freeze([.75,.54,.31]),grain:freeze([.30,.20,.13]),
      iron:freeze([.33,.38,.38]),trim:freeze([.80,.61,.37])}),
    finish:'honey-gold larch decking with darkened structural underbeams',
    integration:freeze({physical:'union-of-boxes',target:'shape-aware',
      storage:'opt-in orientation+variant metadata',worldPlaced:false})})
]);
export const PACK_2_INFRASTRUCTURE_IDS=freeze(PACK_2_INFRASTRUCTURE.map(a=>a.id));
const catalog=new Map(PACK_2_INFRASTRUCTURE.map(a=>[a.id,a]));
export function infrastructureAsset(id){return catalog.get(id)??null;}
const rail=variant=>{
  const p=[
    box(.05,0,.30,.20,1,.70,'oak'),box(.80,0,.30,.95,1,.70,'oak'),
    box(.02,.82,.22,.98,.98,.78,'cap'),
    box(.07,.17,.32,.93,.28,.68,'oak'),
    box(.17,.49,.38,.83,.61,.62,'oak'),
    box(.21,.30,.39,.38,.47,.61,'iron'),
    box(.36,.42,.39,.53,.61,.61,'iron'),
    box(.52,.55,.39,.70,.72,.61,'iron'),
    box(.72,.69,.39,.80,.81,.61,'iron'),
    box(.05,.84,.21,.20,.96,.79,'iron'),
    box(.80,.84,.21,.95,.96,.79,'iron'),
    box(.08,.09,.28,.21,.19,.72,'iron'),
    box(.79,.09,.28,.92,.19,.72,'iron')
  ];
  if(variant==='terminal'){
    // Short reinforced end plate, not a second independent ID.
    p.push(box(0,.33,.26,.085,.81,.74,'iron'));
    p.push(box(0,.66,.27,.14,.79,.73,'ironHighlight'));
  }
  return p;
};
const parapet=variant=>{
  // The scupper is a truly empty transverse channel through the *thick*
  // protective wall, rather than a cosmetic dark square painted on a cube.
  const p=[
    box(0,0,.17,1,.18,.83,'shadow'),
    box(0,.68,.16,1,.77,.84,'carving'),
    box(0,.77,.09,1,.91,.91,'cap'),
    box(.02,.91,.15,.98,.95,.85,'stone')
  ];
  if(variant==='solid')p.push(box(0,.18,.23,1,.68,.77,'stone'));
  else p.push(
    box(0,.18,.23,.42,.68,.77,'stone'),
    box(.58,.18,.23,1,.68,.77,'stone'),
    box(.42,.18,.23,.58,.30,.77,'stone'),
    box(.42,.48,.23,.58,.68,.77,'stone'),
    box(.41,.28,.24,.44,.49,.76,'carving'),
    box(.56,.28,.24,.59,.49,.76,'carving')
  );
  return p;
};
const deck=variant=>{
  const p=[
    box(.095,.18,0,.235,.53,1,'joist'),
    box(.765,.18,0,.905,.53,1,'joist'),
    box(.10,.21,.075,.90,.30,.20,'joist'),
    box(.10,.21,.80,.90,.30,.925,'joist'),
    box(.08,.19,.04,.27,.31,.16,'iron'),
    box(.73,.19,.84,.92,.31,.96,'iron')
  ];
  for(let i=0;i<5;i++){
    const z=.024+i*.20,up=i%2===0?.72:.70;
    p.push(box(.025,.53,z,.975,up,z+.165,i%2?'alternate':'plank'));
  }
  if(variant==='edge-trim')p.push(
    box(.02,.66,.02,.08,.79,.98,'trim'),
    box(.92,.66,.02,.98,.79,.98,'trim')
  );
  return p;
};
const baseShapes={73:rail,74:parapet,75:deck};
function turn(b,r){
  let [x,y,z,X,Y,Z]=b;
  for(let i=0;i<r;i++)[x,z,X,Z]=[1-Z,x,1-z,X];
  return freeze([x,y,z,X,Y,Z]);
}
export function infrastructureCell(id,{rotation,variant}={}){
  const a=infrastructureAsset(id);
  if(!a)throw new RangeError('Unknown Pack 2 infrastructure ID');
  rotation??=0;variant??=a.variants[0];
  if(!Number.isInteger(rotation)||rotation<0||rotation>=a.rotations)
    throw new RangeError('Invalid infrastructure orientation');
  if(typeof variant!=='string'||!a.variants.includes(variant))
    throw new RangeError('Invalid infrastructure component variant');
  return freeze({id,rotation,variant});
}
export function parseInfrastructureCell(data){
  if(!data||typeof data!=='object'||Array.isArray(data)||
      Object.keys(data).sort().join(',')!=='id,rotation,variant')
    throw new TypeError('Invalid infrastructure cell record');
  return infrastructureCell(data.id,data);
}
export function infrastructureShape(id,state={}){
  const c=infrastructureCell(id,state);
  const parts=freeze(baseShapes[id](c.variant).map(p=>freeze({
    role:p.role,box:turn(p.box,c.rotation)
  })));
  if(!parts.length||parts.length>32)throw new RangeError('Physical box limit');
  for(const p of parts){
    if(!infrastructureAsset(id).palette[p.role])throw new TypeError('Unpainted occupancy volume');
    for(let j=0;j<3;j++)if(!Number.isFinite(p.box[j])||
      p.box[j]<0||p.box[j]>=p.box[j+3]||p.box[j+3]>1)
      throw new RangeError('Physical occupancy outside local voxel cell');
  }
  return freeze({...c,parts,boxes:freeze(parts.map(p=>p.box)),
    units:'voxel-local',collision:'union-of-boxes',selection:'union-of-boxes',
    candidateOnly:true,allGeometryPhysical:true});
}
export function infrastructureOccupies(id,state,point){
  if(!Array.isArray(point)||point.length!==3||!point.every(Number.isFinite))
    throw new TypeError('Expected finite local point');
  return infrastructureShape(id,state).boxes.some(b=>
    point.every((v,i)=>v>=b[i]&&v<b[i+3]));
}
const inside=(b,x,y,z)=>x>=b[0]&&x<b[3]&&y>=b[1]&&y<b[4]&&z>=b[2]&&z<b[5];
const lerp=(a,b,t)=>a+(b-a)*t;
const between=(c,u,v)=>[0,1,2].map(i=>
  lerp(lerp(c[0][i],c[1][i],u),lerp(c[3][i],c[2][i],u),v));
export function infrastructurePreviewMesh(id,state={}){
  // Authentic physical-box triangle inspector mesh, NOT live WebGL2 integration.
  // Split only exposed faces at relevant neighbor footprints, not global 3-D cuts.
  const asset=infrastructureAsset(id),parts=infrastructureShape(id,state).parts;
  const pos=[],colors=[],normals=[],indices=[];
  let physicalQuads=0,decorationQuads=0;
  const emit=(corners,n,rgb,offset=0)=>{
    const st=pos.length/3;
    for(const v of corners){
      pos.push(v[0]+n[0]*offset,v[1]+n[1]*offset,v[2]+n[2]*offset);
      colors.push(...rgb);normals.push(...n);
    }
    indices.push(st,st+1,st+2,st,st+2,st+3);
  };
  const paint=(corners,n,role)=>{
    const shade=n[1]===1?1.06:n[1]===-1?.68:n[0]===0?.94:.84;
    emit(corners,n,asset.palette[role].map(x=>Math.min(1,x*shade)));
    physicalQuads++;
    if(role==='iron'||role==='ironHighlight'||role==='shadow')return;
    const w=Math.hypot(...corners[1].map((v,j)=>v-corners[0][j]));
    const h=Math.hypot(...corners[3].map((v,j)=>v-corners[0][j]));
    if(w<.17||h<.13)return;
    // Grain/stone course marks are on the actual box union, never free props.
    const detailRole=id===74?'carving':'grain';
    for(const t of [.33,.66]){
      const corners2=[between(corners,.07,t-.009),between(corners,.93,t-.009),
        between(corners,.93,t+.009),between(corners,.07,t+.009)];
      emit(corners2,n,asset.palette[detailRole],.0015);
      decorationQuads++;
    }
  };
  const axes=[0,1,2],EPS=1e-7;
  for(const part of parts){
    const b=part.box;
    for(let axis=0;axis<3;axis++)for(const sign of [-1,1]){
      const n=[0,0,0];n[axis]=sign;
      const plane=b[axis+(sign===1?3:0)];
      const u=axes[(axis+1)%3],v=axes[(axis+2)%3];
      const U=[b[u],b[u+3]],V=[b[v],b[v+3]];
      const outside=plane+sign*EPS;
      const neighbors=parts.filter(p=>p!==part&&
        p.box[axis]<=outside&&outside<p.box[axis+3]&&
        p.box[u]<U[1]&&p.box[u+3]>U[0]&&
        p.box[v]<V[1]&&p.box[v+3]>V[0]);
      for(const p of neighbors){
        U.push(Math.max(b[u],p.box[u]),Math.min(b[u+3],p.box[u+3]));
        V.push(Math.max(b[v],p.box[v]),Math.min(b[v+3],p.box[v+3]));
      }
      const us=[...new Set(U)].sort((a,b)=>a-b),vs=[...new Set(V)].sort((a,b)=>a-b);
      for(let i=0;i<us.length-1;i++)for(let j=0;j<vs.length-1;j++){
        const lo=us[i],hi=us[i+1],bottom=vs[j],top=vs[j+1];
        if(hi-lo<=EPS||top-bottom<=EPS)continue;
        const sample=[0,0,0];sample[axis]=outside;
        sample[u]=(lo+hi)/2;sample[v]=(bottom+top)/2;
        if(neighbors.some(p=>inside(p.box,...sample)))continue;
        const pt=(U,V)=>{const out=[0,0,0];out[axis]=plane;out[u]=U;out[v]=V;return out};
        let corners=[pt(lo,bottom),pt(hi,bottom),pt(hi,top),pt(lo,top)];
        const e1=corners[1].map((x,k)=>x-corners[0][k]);
        const e2=corners[3].map((x,k)=>x-corners[0][k]);
        const normal=[e1[1]*e2[2]-e1[2]*e2[1],
          e1[2]*e2[0]-e1[0]*e2[2],e1[0]*e2[1]-e1[1]*e2[0]];
        if(normal[axis]*sign<0)corners=[corners[0],corners[3],corners[2],corners[1]];
        paint(corners,n,part.role);
      }
    }
  }
  return freeze({positions:new Float32Array(pos),colors:new Float32Array(colors),
    normals:new Float32Array(normals),indices:new Uint16Array(indices),
    triangles:indices.length/3,physicalQuads,decorationQuads,candidateOnly:true,
    allGeometryBackedByPhysicalShape:true});
}
