// Mythwrought Builder 4B M1 — five original coordinate-authored theoretical buildings.
// Explicit source-authored footprints, openings, functional room grids, partitions,
// furnishings, and roof profiles. No runtime/world/save writes or random generation.
import {SCHEMA,validateBlueprint,validateCollection,geometrySignature} from './schema.mjs';

const F = Object.freeze({
  healer: {
    type:'healers-house',biome:'temperate',size:'small',variant:1,
    bounds:[19,10,18], roof:'cross-gable-clinic', palette:['live:stone','live:wood'],
    bands:[[1,11,1,17],[12,16,5,13]],
    entrance:[9,2,1], windows:[[3,1],[15,1],[1,6],[17,6],[7,16],[11,16]],
    passages:[{axis:'x',fixed:9,from:4,to:9,gaps:[6]},{axis:'z',fixed:11,from:5,to:13,gaps:[9]}],
    rooms:[
      {id:'treatment-bay',kind:'treatment',box:[2,7,3,8]},
      {id:'patient-recovery',kind:'recovery',box:[11,16,3,9]},
      {id:'front-waiting',kind:'waiting',box:[8,10,2,3]},
      {id:'apothecary-annex',kind:'herb-storage',box:[6,12,13,15]}
    ],
    fixtures:[{at:[3,2,10],asset:'pack4:058',name:'waiting-bench'},
      {at:[14,2,10],asset:'pack4:059',name:'mixing-table'}],
    roofRidges:[{axis:'z',fixed:9,from:2,to:10},{axis:'z',fixed:9,from:12,to:15}]
  },
  library: {
    type:'library',biome:'snow',size:'medium',variant:1,
    bounds:[22,10,20],roof:'asymmetric-clerestory',palette:['live:deepstone','live:wood'],
    bands:[[1,10,1,20],[11,18,1,11]],
    entrance:[10,2,1],windows:[[4,1],[17,1],[20,5],[1,6],[4,18],[8,18]],
    passages:[{axis:'x',fixed:10,from:4,to:9,gaps:[7]},{axis:'z',fixed:11,from:2,to:10,gaps:[7]}],
    rooms:[
      {id:'reading-gallery',kind:'reading-room',box:[12,19,3,9]},
      {id:'west-stacks',kind:'collections',box:[2,9,4,10]},
      {id:'catalogue-room',kind:'catalogue',box:[3,9,13,17]}
    ],
    fixtures:[{at:[18,2,2],asset:'pack4:059',name:'reading-table'},
      {at:[2,2,12],asset:'pack4:058',name:'reading-bench'}],
    roofRidges:[{axis:'z',fixed:7,from:3,to:17},{axis:'x',fixed:6,from:11,to:18}]
  },
  school: {
    type:'schoolhouse',biome:'desert',size:'small',variant:1,
    bounds:[24,10,20],roof:'transverse-schoolhouse',palette:['live:stone','live:wood'],
    bands:[[1,9,1,22],[10,18,5,18]],
    entrance:[11,2,1],windows:[[4,1],[19,1],[1,6],[22,6],[7,18],[16,18]],
    passages:[{axis:'x',fixed:11,from:3,to:8,gaps:[6]},{axis:'z',fixed:9,from:5,to:18,gaps:[10]}],
    rooms:[
      {id:'first-class',kind:'classroom',box:[2,10,3,8]},
      {id:'second-class',kind:'teacher-area',box:[13,21,3,8]},
      {id:'rear-study',kind:'shared-study',box:[7,17,11,17]}
    ],
    fixtures:[{at:[2,2,2],asset:'pack4:058',name:'student-bench'},
      {at:[21,2,2],asset:'pack4:059',name:'teacher-table'}],
    roofRidges:[{axis:'x',fixed:5,from:3,to:20},{axis:'z',fixed:11,from:11,to:17}]
  },
  institute: {
    type:'magical-research-institute',biome:'enchanted-forest',size:'medium',variant:1,
    bounds:[24,12,23],roof:'cruciform-laboratory',palette:['live:deepstone','live:crystal'],
    bands:[[1,7,7,16],[8,15,1,22],[16,21,7,16]],
    entrance:[11,2,1],windows:[[9,1],[14,1],[1,11],[22,11],[9,21],[14,21]],
    passages:[{axis:'x',fixed:11,from:8,to:14,gaps:[11]},{axis:'z',fixed:15,from:7,to:16,gaps:[12]}],
    rooms:[
      {id:'western-workroom',kind:'research-hall',box:[2,10,9,14]},
      {id:'sealed-east-cell',kind:'secure-repository',box:[14,21,9,14]},
      {id:'northern-observation',kind:'instrument-bay',box:[9,15,17,20]}
    ],
    fixtures:[{at:[12,2,8],asset:'pack4:037',name:'unpowered-crystal-lamp'},
      {at:[13,2,8],asset:'pack4:059',name:'lab-workbench'}],
    roofRidges:[{axis:'z',fixed:11,from:2,to:20},{axis:'x',fixed:10,from:3,to:20}]
  },
  academy: {
    type:'arcane-academy',biome:'mountain',size:'large',variant:1,
    bounds:[28,14,26],roof:'open-court-and-paired-wings',palette:['live:stone','live:wood'],
    bands:[[1,7,2,25],[8,19,2,10],[8,19,17,25],[20,24,2,25]],
    entrance:[13,2,1],windows:[[5,1],[21,1],[2,12],[25,12],[7,24],[20,24]],
    passages:[{axis:'x',fixed:10,from:2,to:6,gaps:[4]},
      {axis:'x',fixed:17,from:2,to:6,gaps:[4]},
      {axis:'z',fixed:20,from:3,to:24,gaps:[7,13,20]}],
    rooms:[
      {id:'front-lecture',kind:'lecture-hall',box:[11,16,2,6]},
      {id:'west-study',kind:'study-chamber',box:[3,9,9,16]},
      {id:'east-practice',kind:'practice-gallery',box:[18,24,9,16]},
      {id:'rear-archive',kind:'records-reading',box:[11,17,21,23]}
    ],
    fixtures:[{at:[4,2,7],asset:'pack4:058',name:'lecture-bench'},
      {at:[23,2,7],asset:'pack3:078',name:'symbolic-spire-statue'}],
    roofRidges:[{axis:'x',fixed:4,from:4,to:23},{axis:'z',fixed:6,from:9,to:18},
      {axis:'z',fixed:21,from:9,to:18},{axis:'x',fixed:22,from:4,to:23}]
  }
});

const key=(x,y,z)=>x+','+y+','+z;
const inRect=(x,z,box)=>x>=box[0]&&x<=box[1]&&z>=box[2]&&z<=box[3];

function construct(p){
  const cells=new Map(),floor=new Set(),openings=[],deps=new Map(),features=[];
  const [primary,secondary]=p.palette;
  const add=(x,y,z,role,asset,facing='north',feature=null)=>{
    const k=key(x,y,z);
    if(cells.has(k))throw Error('M1 double coordinate '+p.type+' '+k);
    const c={at:[x,y,z],role,asset,facing};
    if(feature)c.feature=feature;
    cells.set(k,c);
    return c;
  };
  const replace=(x,y,z,role,asset,feature)=>{
    const k=key(x,y,z);
    if(!cells.has(k))throw Error('M1 replacement absent '+p.type+' '+k);
    const old=cells.get(k);
    cells.set(k,{at:[x,y,z],role,asset,facing:old.facing,feature});
  };
  const symbolic=(ref)=>{
    if(!/^pack[1-5]:[0-9]{3}$/.test(ref))return;
    if(!deps.has(ref))deps.set(ref,{
      ref,source:'manual-five-pack',status:'catalog-provisional',shape:'unknown',
      orientation:'unknown',unresolved:[
        'Resolve exact integrated family variant geometry and occupied footprint',
        'Confirm support/mount profile, source texture, collision and picking',
        'Confirm orientation and persistence through central integrator before live placement'
      ]
    });
  };
  // Fixed hand-authored plan bands are expanded into real integer positions, never
  // into seed-only or runtime placement instructions.
  for(const [z0,z1,x0,x1] of p.bands)for(let z=z0;z<=z1;z++)for(let x=x0;x<=x1;x++)floor.add(key(x,1,z));
  const isFloor=(x,z)=>floor.has(key(x,1,z));
  const isEdge=(x,z)=>[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dz])=>!isFloor(x+dx,z+dz));
  const front=key(...p.entrance);
  const frontX=p.entrance[0],frontZ=p.entrance[2];
  if(!isFloor(frontX,frontZ)||!isEdge(frontX,frontZ))throw Error('M1 front entry is not a perimeter');
  // No implicit oversized terrain: only individually placed footprint cells.
  for(const k of floor){
    const [x,,z]=k.split(',').map(Number);
    add(x,0,z,'foundation',primary);
    add(x,1,z,'floor',secondary);
    if(isEdge(x,z)){
      for(let y=2;y<=5;y++){
        if(x===frontX&&z===frontZ&&(y===2||y===3))continue;
        add(x,y,z,'wall',primary);
      }
    }
    add(x,6,z,'roof',secondary);
  }
  openings.push({kind:'entrance',at:p.entrance,facing:'north',plannedClosure:'pack2:020'});
  // Handpicked window coordinates replace actual exterior wall cells.
  for(const [x,z] of p.windows){
    if(!isEdge(x,z)||!cells.has(key(x,3,z)))throw Error('M1 invalid perimeter window '+p.type+' '+x+','+z);
    replace(x,3,z,'window','pack4:030','physical-glazing-candidate');
    symbolic('pack4:030');
    openings.push({kind:'window',at:[x,3,z],facing:z===1?'north':x<=2?'west':x>=p.bounds[0]-3?'east':'south'});
    // A beam at level 4 bridges this glass rather than treating the pane
    // as an approved load-bearing column. Side anchors remain to be audited.
    replace(x,4,z,'beam',secondary,'window-header');
  }
  // Authored interior walls: physically empty 2-high apertures with a lintel.
  for(const line of p.passages){
    for(let v=line.from;v<=line.to;v++){
      const x=line.axis==='x'?line.fixed:v,z=line.axis==='z'?line.fixed:v;
      if(!isFloor(x,z)||isEdge(x,z))continue;
      const gap=line.gaps.includes(v);
      for(let y=2;y<=4;y++){
        if(gap&&y<=3)continue;
        if(!cells.has(key(x,y,z)))add(x,y,z,gap?'beam':'partition',secondary,'north',
          gap?'door-lintel':'room-division');
      }
      if(gap)openings.push({kind:'door',at:[x,2,z],facing:line.axis==='x'?'east':'north',
        plannedClosure:'pack2:020'});
    }
  }
  // Under-roof purlins are physical timber/crystal beams; exterior walls
  // bound each span. Aesthetic ridge rows are above a full weather roof.
  for(const k of floor){
    const [x,,z]=k.split(',').map(Number);
    if(!isEdge(x,z)&&(z%4===0)&&!cells.has(key(x,5,z)))
      add(x,5,z,'beam',secondary,'north','transverse-roof-purlin');
  }
  for(const stripe of p.roofRidges){
    for(let v=stripe.from;v<=stripe.to;v++){
      const x=stripe.axis==='x'?v:stripe.fixed, z=stripe.axis==='z'?v:stripe.fixed;
      if(isFloor(x,z)&&!cells.has(key(x,7,z)))
        add(x,7,z,'roof',primary,'north','raised-weather-ridge');
    }
  }
  // Physical fixture placements are marked not yet mounted/registered. These
  // positions must not obstruct any defined functional room footprint.
  for(const prop of p.fixtures){
    const [x,y,z]=prop.at;
    if(!isFloor(x,z)||isEdge(x,z)||p.rooms.some(r=>inRect(x,z,r.box)))
      throw Error('M1 fixture in room or perimeter '+p.type+' '+prop.name);
    add(x,y,z,'fixture',prop.asset,'north',prop.name);
    symbolic(prop.asset);
    features.push({kind:prop.name,at:prop.at,dependency:prop.asset,active:false});
  }
  const occupied=at=>cells.has(key(...at));
  // Walkable tiles are physically supported floor cells with two clear air cells.
  // Nothing written to a live engine, and no hypothetical door leaf is traversed.
  const navigation=[];
  for(const k of floor){
    const [x,,z]=k.split(',').map(Number);
    if(!occupied([x,2,z])&&!occupied([x,3,z]))
      navigation.push({at:[x,2,z],mode:'walk'});
  }
  const spaces=p.rooms.map(r=>{
    const footprint=[];
    for(let z=r.box[2];z<=r.box[3];z++)for(let x=r.box[0];x<=r.box[1];x++){
      if(!isFloor(x,z)||occupied([x,2,z])||occupied([x,3,z]))
        throw Error('M1 room rectangle intersects solid architecture '+p.type+' '+r.id+' '+x+','+z);
      footprint.push([x,z]);
    }
    const [x,z]=footprint[Math.floor(footprint.length/2)];
    return {id:r.id,kind:r.kind,level:2,footprint,access:[x,2,z]};
  });
  const blueprint={
    schema:SCHEMA,id:'r4:'+p.type+':'+p.biome+':'+p.size+':'+String(p.variant).padStart(2,'0'),
    type:p.type,biome:p.biome,size:p.size,variant:p.variant,bounds:p.bounds,
    provenance:{lane:'roadmap-4b',milestone:'M1',method:'hand-authored bands, partitions, room grids and roof ridges',
      originalFromLegacyPR123:false,roofProfile:p.roof,liveIntegration:false},
    cells:[...cells.values()],openings,navigation,spaces,dependencies:[...deps.values()],features,
    worldPlaced:false,creatorApproved:false,integrated:false
  };
  validateBlueprint(blueprint);
  return blueprint;
}
export const M1_EXEMPLARS=Object.freeze(Object.values(F).map(construct));
export const M1_REPORT=Object.freeze({
  authored:M1_EXEMPLARS.length,
  original:M1_EXEMPLARS.length,
  inherited:0,
  ids:Object.freeze(M1_EXEMPLARS.map(x=>x.id)),
  remaining:285-M1_EXEMPLARS.length,
  creatorApproved:0,integrated:0,productionRegistered:false,
  distinctShapeFingerprints:new Set(M1_EXEMPLARS.map(geometrySignature)).size
});
validateCollection(M1_EXEMPLARS);
if(M1_REPORT.distinctShapeFingerprints!==M1_REPORT.authored)throw Error('M1 architecture collision');
export function getM1Exemplar(id){return M1_EXEMPLARS.find(x=>x.id===id)||null;}
