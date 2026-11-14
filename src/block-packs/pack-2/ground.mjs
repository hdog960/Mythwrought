// Mythwrought Pack 2 Milestone 3 — physical ground/path component candidates.
// All occupancy, colors and meshes are isolated. No generated placements, gravity
// simulation or gameplay edits; falling gravel requires a shared-engine contract.
const B=(x,y,z,X,Y,Z,role)=>Object.freeze({box:Object.freeze([x,y,z,X,Y,Z]),role});
const freezeAsset=a=>Object.freeze({...a,
  palette:Object.freeze(a.palette),surface:Object.freeze(a.surface),
  orientation:Object.freeze(a.orientation),physics:Object.freeze(a.physics)});
export const PACK_2_GROUND=Object.freeze([
  freezeAsset({id:69,roster:39,key:'shingle-gravel',name:'Loose river-shingle gravel',
    family:'gravel',orientation:{turns:1,default:0},
    palette:{subsoil:[.41,.35,.30],stoneA:[.64,.57,.48],
      stoneB:[.48,.47,.43],stoneC:[.76,.65,.50],grain:[.26,.23,.20]},
    surface:{pattern:'eight raised uneven pea-shingle stones over compact aggregate',
      finish:'river-sorted-tan-grey',bands:2},
    physics:{material:'granular',fallsWhenSupported:false,
      requires:'central gravity/falling voxel support owned by :00',simulateLocally:false}}),
  freezeAsset({id:70,roster:40,key:'trampered-path',name:'Trampled umber path',
    family:'packed-dirt-path',orientation:{turns:4,default:0},
    palette:{subsoil:[.45,.30,.20],shoulder:[.55,.35,.22],
      tread:[.62,.43,.26],grain:[.30,.21,.14]},
    surface:{pattern:'shallow broad top with pair of lower worn ruts and raised margins',
      finish:'dried clay and gravel dust',bands:3},
    physics:{material:'compacted-earth',fallsWhenSupported:false,
      requires:'shape-aware surface collision and save state',simulateLocally:false}}),
  freezeAsset({id:71,roster:41,key:'limestone-cobbled-walk',name:'Limestone walking cobbles',
    family:'cobblestone-paving',orientation:{turns:4,default:0},
    palette:{mortar:[.34,.35,.35],stoneA:[.66,.66,.62],
      stoneB:[.53,.56,.55],stoneC:[.72,.68,.60],grain:[.39,.41,.40]},
    surface:{pattern:'shallow hand-laid offset flat walking stones with real mortar gaps',
      finish:'worn silver limestone',bands:2},
    physics:{material:'stone-paving',fallsWhenSupported:false,
      requires:'shape-aware collision and neighboring tile meshing',simulateLocally:false}}),
  freezeAsset({id:72,roster:42,key:'suncompass-inlay',name:'Suncompass inlaid paving',
    family:'decorative-paving',orientation:{turns:4,default:0},
    palette:{mortar:[.36,.36,.42],stoneA:[.77,.70,.55],
      stoneB:[.55,.57,.61],inlay:[.34,.56,.63],grain:[.36,.36,.39]},
    surface:{pattern:'physical inset cardinal stones framing raised blue suncompass tile',
      finish:'chiseled ivory and weathered blue inlay',bands:2},
    physics:{material:'decorative-stone-paving',fallsWhenSupported:false,
      requires:'shape-aware collision and material mesh support',simulateLocally:false}})
]);
export const PACK_2_GROUND_IDS=Object.freeze(PACK_2_GROUND.map(a=>a.id));
const byId=new Map(PACK_2_GROUND.map(a=>[a.id,a]));
export const groundAsset=id=>byId.get(id)??null;
const layers={
  69:()=>[
    B(0,0,0,1,.79,1,'subsoil'),
    B(.05,.79,.06,.24,.94,.39,'stoneA'),
    B(.30,.79,.04,.50,.87,.42,'stoneB'),
    B(.56,.79,.08,.75,.985,.43,'stoneC'),
    B(.81,.79,.05,.95,.89,.40,'stoneB'),
    B(.08,.79,.58,.30,.91,.94,'stoneB'),
    B(.36,.79,.57,.53,.98,.91,'stoneC'),
    B(.59,.79,.56,.77,.90,.94,'stoneA'),
    B(.82,.79,.61,.97,.97,.93,'stoneA')
  ],
  70:()=>[
    B(0,0,0,1,.78,1,'subsoil'),
    B(0,.78,0,.20,.86,1,'shoulder'),
    B(.80,.78,0,1,.85,1,'shoulder'),
    B(.30,.78,0,.70,.81,1,'tread'),
    B(.21,.78,.06,.25,.79,.94,'grain'),
    B(.75,.78,.08,.79,.79,.92,'grain')
  ],
  71:()=>[
    B(0,0,0,1,.73,1,'mortar'),
    // Cut walkway stones sit above a mortar tray, not a full-cube wall block.
    B(.03,.73,.03,.45,.91,.30,'stoneA'),
    B(.49,.73,.02,.95,.88,.31,'stoneB'),
    B(.04,.73,.37,.30,.93,.66,'stoneB'),
    B(.34,.73,.36,.71,.89,.66,'stoneC'),
    B(.76,.73,.37,.96,.92,.65,'stoneA'),
    B(.04,.73,.72,.50,.90,.96,'stoneC'),
    B(.55,.73,.72,.97,.91,.97,'stoneA')
  ],
  72:()=>[
    B(0,0,0,1,.74,1,'mortar'),
    B(.05,.74,.05,.39,.86,.38,'stoneA'),
    B(.61,.74,.05,.96,.88,.38,'stoneB'),
    B(.05,.74,.62,.40,.88,.95,'stoneB'),
    B(.60,.74,.62,.96,.86,.95,'stoneA'),
    B(.42,.74,.05,.59,.87,.27,'stoneB'),
    B(.42,.74,.74,.59,.90,.95,'stoneA'),
    B(.05,.74,.40,.27,.86,.60,'stoneA'),
    B(.74,.74,.40,.96,.87,.60,'stoneB'),
    B(.39,.74,.38,.61,.96,.62,'inlay'),
    B(.45,.74,.26,.56,.91,.37,'inlay')
  ]
};
const rotate=(box,turns)=>{
  let [x,y,z,X,Y,Z]=box;
  for(let k=0;k<turns;k++)[x,z,X,Z]=[1-Z,x,1-z,X];
  return Object.freeze([x,y,z,X,Y,Z]);
};
export function groundCell(id,rotation=0){
  const a=groundAsset(id);
  if(!a)throw new RangeError('Unknown Pack 2 ground candidate');
  if(!Number.isInteger(rotation)||rotation<0||rotation>=a.orientation.turns)
    throw new RangeError('Invalid ground rotation');
  return Object.freeze({id,rotation});
}
export function parseGroundCell(row){
  if(!row||typeof row!=='object'||Array.isArray(row)||
    Object.keys(row).sort().join(',')!=='id,rotation')throw new TypeError('Bad ground record');
  return groundCell(row.id,row.rotation);
}
export function groundShape(id,rotation=0){
  const cell=groundCell(id,rotation);
  const parts=Object.freeze(layers[id]().map(p=>Object.freeze({
    box:rotate(p.box,rotation),role:p.role})));
  if(parts.length>32)throw new Error('Too many ground collision boxes');
  for(const p of parts)for(let i=0;i<3;i++)
    if(p.box[i]<0||p.box[i]>=p.box[i+3]||p.box[i+3]>1)
      throw new RangeError('Invalid ground local occupancy');
  return Object.freeze({...cell,boxes:Object.freeze(parts.map(x=>x.box)),
    parts,collision:'union-of-boxes',selection:'union-of-boxes',
    coordinateSystem:'voxel-local',candidateOnly:true,
    groundProfile:'walkable-top-surface',noWorldPlacement:true});
}
export function groundOccupies(id,rotation,point){
  if(!Array.isArray(point)||point.length!==3||!point.every(Number.isFinite))
    throw new TypeError('Expected finite local point');
  return groundShape(id,rotation).boxes.some(b=>point.every((v,i)=>v>=b[i]&&v<b[i+3]));
}
const inside=(b,x,y,z)=>x>=b[0]&&x<b[3]&&y>=b[1]&&y<b[4]&&z>=b[2]&&z<b[5];
const corner=(c,u,v)=>[0,1,2].map(i=>
  c[0][i]*(1-u)*(1-v)+c[1][i]*u*(1-v)+c[2][i]*u*v+c[3][i]*(1-u)*v);
export function groundPreviewMesh(id,rotation=0){
  const spec=groundAsset(id),parts=groundShape(id,rotation).parts;
  const cuts=[0,1,2].map(a=>[...new Set(parts.flatMap(p=>[p.box[a],p.box[a+3]]))]
    .sort((a,b)=>a-b));
  const occupied=(x,y,z)=>parts.some(p=>inside(p.box,x,y,z));
  const positions=[],colors=[],normals=[],indices=[];
  let physicalQuads=0,decorationQuads=0;
  const push=(vertices,normal,color,offset=0)=>{
    const start=positions.length/3;
    for(const p of vertices){
      positions.push(...p.map((v,i)=>v+normal[i]*offset));
      colors.push(...color);
      normals.push(...normal);
    }
    indices.push(start,start+1,start+2,start,start+2,start+3);
  };
  const face=(v,n,material)=>{
    const light=n[1]===1?1.06:n[1]===-1?.65:n[0]===0?.92:.81;
    push(v,n,material.map(x=>Math.min(1,x*light)));physicalQuads++;
    const width=Math.hypot(...v[1].map((x,i)=>x-v[0][i]));
    const height=Math.hypot(...v[3].map((x,i)=>x-v[0][i]));
    if(width<.115||height<.115)return;
    // Etched short scratch/grit strokes are anchored on the real top/edge faces.
    const bands=n[1]===1?spec.surface.bands:1;
    for(let k=1;k<=bands;k++){
      const w=.006;
      const t=k/(bands+1);
      const decal=[corner(v,.12,t-w),corner(v,.88,t-w),
        corner(v,.88,t+w),corner(v,.12,t+w)];
      push(decal,n,spec.palette.grain,.0015);decorationQuads++;
    }
  };
  const [xs,ys,zs]=cuts,e=1e-7;
  for(let i=0;i<xs.length-1;i++)for(let j=0;j<ys.length-1;j++)
    for(let k=0;k<zs.length-1;k++){
      const x=xs[i],X=xs[i+1],y=ys[j],Y=ys[j+1],z=zs[k],Z=zs[k+1];
      const mid=[(x+X)/2,(y+Y)/2,(z+Z)/2];
      if(!occupied(...mid))continue;
      const p=parts.find(p=>inside(p.box,...mid));
      const color=spec.palette[p.role];
      if(!occupied(x-e,mid[1],mid[2]))
        face([[x,y,Z],[x,y,z],[x,Y,z],[x,Y,Z]],[-1,0,0],color);
      if(!occupied(X+e,mid[1],mid[2]))
        face([[X,y,z],[X,y,Z],[X,Y,Z],[X,Y,z]],[1,0,0],color);
      if(!occupied(mid[0],y-e,mid[2]))
        face([[x,y,z],[x,y,Z],[X,y,Z],[X,y,z]],[0,-1,0],color);
      if(!occupied(mid[0],Y+e,mid[2]))
        face([[x,Y,Z],[x,Y,z],[X,Y,z],[X,Y,Z]],[0,1,0],color);
      if(!occupied(mid[0],mid[1],z-e))
        face([[x,y,z],[X,y,z],[X,Y,z],[x,Y,z]],[0,0,-1],color);
      if(!occupied(mid[0],mid[1],Z+e))
        face([[X,y,Z],[x,y,Z],[x,Y,Z],[X,Y,Z]],[0,0,1],color);
    }
  return Object.freeze({positions:new Float32Array(positions),
    colors:new Float32Array(colors),normals:new Float32Array(normals),
    indices:new Uint16Array(indices),triangles:indices.length/3,
    physicalQuads,decorationQuads,candidateOnly:true,
    allGeometryBackedByPhysicalShape:true});
}
