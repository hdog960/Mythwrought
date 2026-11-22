// Fully coordinate-authored standalone building representations compiled from 45 independently specified designs.
// No randomness, worldgen, engine modification, block-ID allocation or external imports.
import {BIOMES,SIZES,SCHEMA,blueprintId,validateBlueprint,validatePool} from './schema.mjs';
import {DESIGN_MATRIX} from './m1-designs.mjs';
import {extraCandidateCells} from './m1-candidate-footprints.mjs';

const FULL=Object.freeze({kind:'full-cell',bounds:[0,0,0,1,1,1]});
const FUTURE=(asset)=>({kind:'unresolved',bounds:null,reason:asset+' remains a separate physical candidate; orientation, exact bounds and support are not integrated'});
const region={
  temperate:{wall:'pack2:013',roof:'pack3:023',floor:'live:wood',trim:'pack1:002',window:'pack4:030'},
  desert:{wall:'pack5:080',roof:'pack3:024',floor:'live:stone',trim:'pack5:080',window:'pack4:031'},
  snow:{wall:'live:wood',roof:'pack3:025',floor:'live:wood',trim:'pack1:005',window:'pack4:030'},
  'enchanted-forest':{wall:'pack2:013',roof:'pack3:023',floor:'live:wood',trim:'pack1:003',window:'pack4:031'},
  mountain:{wall:'pack1:006',roof:'pack3:025',floor:'live:stone',trim:'pack1:004',window:'pack4:030'}
};
const at=(x,y,z)=>[x,y,z].join(',');
function compile(category,biome,size,index,row){
  const [name,w,d,plan,roof,feature,offset]=row;
  const wallTop=4+SIZES.indexOf(size),h=wallTop+7;
  const midX=Math.floor(w/2),midZ=Math.floor(d/2),entry=category==='stable'?midX:Math.min(w-4,Math.max(3,midX+offset));
  const theme=region[biome],occupied=new Map(),reserved=new Set(),doors=[],footprintReservations=[],fixtureReserved=new Set();
  const place=(x,y,z,role,asset,orientation='none',extra={})=>{
    if(x<0||x>=w||y<0||y>=h||z<0||z>=d)throw new Error(name+': location out of bounds '+at(x,y,z));
    const pos=at(x,y,z);if(occupied.has(pos)||fixtureReserved.has(pos))throw new Error(name+': duplicate or multi-cell fixture conflict '+pos);
    occupied.set(pos,{at:[x,y,z],role,asset,orientation,occupancy:asset.startsWith('live:')?FULL:FUTURE(asset),...extra});
  };
  const remove=(x,y,z)=>occupied.delete(at(x,y,z));
  const free=(x,y,z)=>!occupied.has(at(x,y,z))&&!fixtureReserved.has(at(x,y,z));
  const wall=(x,y,z,role='wall')=>place(x,y,z,role,role==='partition'?'live:wood':theme.wall);
  const gap=(x,z,dir='north')=>{for(const y of [1,2])remove(x,y,z);doors.push([x,z,dir]);reserved.add(at(x,1,z));};
  // Entire continuous slab is authored as real walk-on voxel coordinates.
  for(let x=0;x<w;x++)for(let z=0;z<d;z++)place(x,0,z,'foundation',biome==='mountain'?'live:stone':biome==='snow'?'live:wood':theme.floor);
  // Exterior envelope, 3+ clear head-height levels, with independent regional material references.
  for(let y=1;y<=wallTop;y++)for(let x=1;x<w-1;x++)for(const z of [1,d-2])if(free(x,y,z))wall(x,y,z);
  for(let y=1;y<=wallTop;y++)for(let z=2;z<d-2;z++)for(const x of [1,w-2])if(free(x,y,z))wall(x,y,z);
  gap(entry,1,'south');
  // Windows remain real placeholder objects at fixed wall coordinates, never empty painted facade triangles.
  for(const [x,z] of [[3,1],[w-4,1],[1,Math.floor(d/3)],[w-2,Math.floor(2*d/3)]]){
    if(x===entry&&z===1)continue;
    // Pack4 pane candidate is an XY glazing plane. Yaw to the east/west
    // when inset into a longitudinal side wall, rather than facing north.
    const face=x===1?'west':x===w-2?'east':z===d-2?'south':'north';
    remove(x,2,z);place(x,2,z,'window',theme.window,face,{mount:'opening',glazingApproved:false});
  }
  const rooms=[],portals=[];
  const room=(id,min,max)=>rooms.push({id,min:[min[0],1,min[1]],max:[max[0],wallTop,max[1]]});
  const link=(from,to,x,z)=>portals.push({
    from,to,at:[x,1,z],passable:true,
    // Stable bay entries are genuinely open slots between physical stall rails,
    // not false claims that a stowed hinged leaf exists at every bay.
    opening:category==='stable'&&['west-front','east-front','west-rear','east-rear'].includes(to)
      ?'open-stall-bay':'hinged-leaf'
  });
  const label={house:['hearth','sleeping','pantry','study'],tavern:['taproom','kitchen','storeroom','alcove']};
  if(plan==='stable'){
    // Regional functional zoning is structural: snow retains a warm rear tack
    // room, desert shifts the tack partition forward to widen its shaded rear
    // service area, and mountain shortens the rear zone for cliff-side storage.
    const tackZ=d-5-(biome==='desert'?1:biome==='mountain'?2:0);
    const penZ=midZ-2+(biome==='mountain'?-1:biome==='snow'?1:biome==='desert'&&size!=='small'?-2:0);
    // True physical stall fences/partitions on either side of the accessible longitudinal aisle.
    for(let y=1;y<=2;y++)for(let x=2;x<w-2;x++)if(x!==midX)wall(x,y,tackZ,'partition');
    gap(midX,tackZ);
    for(let y=1;y<=1;y++)for(const x of [...Array(midX-3).keys()].map(i=>i+2).concat([...Array(w-midX-4).keys()].map(i=>midX+2+i))){
      if(x>1&&x<w-2)wall(x,y,penZ,'partition');
    }
    room('aisle',[midX-1,2],[midX+2,tackZ]);
    room('west-front',[2,2],[midX-1,penZ]);room('east-front',[midX+2,2],[w-2,penZ]);
    room('west-rear',[2,penZ+1],[midX-1,tackZ]);room('east-rear',[midX+2,penZ+1],[w-2,tackZ]);
    room('tack-room',[2,tackZ+1],[w-2,d-2]);
    // Four real empty stall bays: fence/partition rails along both aisle edges;
    // each bay keeps its own one-cell-wide open entrance, not a virtual room label.
    // Use physical Pack 5 stall partitions as unresolved occupancy candidates.
    // Pack5:096 is not yet physically authored (latest independent Pack5 manifest).
    // Use LIVE wooden blocks at each open bay's immediate flanks, preserving
    // four symbolic Pack5 furnishing anchors for future stable specialization.
    const bayFlanks=new Set([2,4,penZ+1,penZ+3]);
    for(const x of [midX-2,midX+2])for(let z=2;z<tackZ;z++){
      if(z===3||z===penZ+2||!free(x,1,z))continue;
      place(x,1,z,'partition',bayFlanks.has(z)?'live:wood':'pack5:096','north');
    }
    link('outside','aisle',entry,1);link('aisle','tack-room',midX,tackZ);
    for(const [name,x,z] of [['west-front',midX-2,3],['east-front',midX+2,3],['west-rear',midX-2,penZ+2],['east-rear',midX+2,penZ+2]])link('aisle',name,x,z);
  }else if(plan==='rear'){
    for(let y=1;y<wallTop;y++)for(let x=2;x<w-2;x++)wall(x,y,midZ,'partition');
    gap(entry,midZ);
    room(label[category][0],[2,2],[w-2,midZ]);room(label[category][1],[2,midZ+1],[w-2,d-2]);
    link('outside',label[category][0],entry,1);link(label[category][0],label[category][1],entry,midZ);
  }else if(plan==='side'){
    for(let y=1;y<wallTop;y++)for(let z=2;z<d-2;z++)wall(midX,y,z,'partition');
    gap(midX,midZ);
    room(label[category][0],[2,2],[midX, d-2]);room(label[category][1],[midX+1,2],[w-2,d-2]);
    link('outside',entry<midX?label[category][0]:label[category][1],entry,1);
    link(label[category][0],label[category][1],midX,midZ);
  }else if(plan==='gallery'){
    // Physically distinct three-aisle hall: central circulation and two side wings.
    const leftWall=Math.floor(w/3),rightWall=Math.floor(2*w/3);
    for(let y=1;y<wallTop;y++)for(let z=2;z<d-2;z++){
      wall(leftWall,y,z,'partition');wall(rightWall,y,z,'partition');
    }
    gap(leftWall,midZ);gap(rightWall,midZ);
    room(label[category][0],[leftWall+1,2],[rightWall,d-2]);
    room(label[category][1],[2,2],[leftWall,d-2]);
    room(label[category][2],[rightWall+1,2],[w-2,d-2]);
    link('outside',label[category][0],entry,1);
    link(label[category][0],label[category][1],leftWall,midZ);
    link(label[category][0],label[category][2],rightWall,midZ);
  }else if(plan==='split'){
    for(let y=1;y<wallTop;y++){
      for(let x=2;x<w-2;x++)wall(x,y,midZ,'partition');
      for(let z=midZ+1;z<d-2;z++)wall(midX,y,z,'partition');
    }
    gap(midX-2,midZ);gap(midX+2,midZ);gap(midX,midZ+2);
    room(label[category][0],[2,2],[w-2,midZ]);
    room(label[category][1],[2,midZ+1],[midX,d-2]);room(label[category][2],[midX+1,midZ+1],[w-2,d-2]);
    link('outside',label[category][0],entry,1);link(label[category][0],label[category][1],midX-2,midZ);
    link(label[category][0],label[category][2],midX+2,midZ);link(label[category][1],label[category][2],midX,midZ+2);
  }else if(plan==='cross'){
    for(let y=1;y<wallTop;y++){
      for(let x=2;x<w-2;x++)wall(x,y,midZ,'partition');
      for(let z=2;z<d-2;z++)if(free(midX,y,z))wall(midX,y,z,'partition');
    }
    for(const [x,z] of [[midX-2,midZ],[midX+2,midZ],[midX,midZ-2],[midX,midZ+2]])gap(x,z);
    room(label[category][0],[2,2],[midX,midZ]);room(label[category][1],[midX+1,2],[w-2,midZ]);
    room(label[category][2],[2,midZ+1],[midX,d-2]);room(label[category][3],[midX+1,midZ+1],[w-2,d-2]);
    link('outside',entry<midX?label[category][0]:label[category][1],entry,1);
    link(label[category][0],label[category][1],midX,midZ-2);
    link(label[category][0],label[category][2],midX-2,midZ);
    link(label[category][1],label[category][3],midX+2,midZ);
    link(label[category][2],label[category][3],midX,midZ+2);
  }else throw new Error('unknown authored plan');
  // Door leaves are physically represented as stowed hinge placeholders next to FREE openings.
  // The future interactive closed/open state, collision and swept leaf clearance stay unresolved.
  for(const [x,z,orientation] of doors){
    const candidates=[[x-1,z],[x+1,z],[x,z-1],[x,z+1]];
    for(const [dx,dz] of candidates){const p=occupied.get(at(dx,1,dz));if(p&&p.role==='wall'||p&&p.role==='partition'){
      occupied.set(at(dx,1,dz),{at:[dx,1,dz],role:'door',asset:'pack2:020',orientation,occupancy:FUTURE('pack2:020'),doorState:'open-stowed',mount:[x,z]});break;
    }}
  }
  // Actual regional roof voxels. Stepped profiles and courtyards are not mere texture variants.
  const roofY=(x,z)=>{
    const nx=Math.min(x,w-1-x),nz=Math.min(z,d-1-z);
    switch(roof){
      case 'gable':return wallTop+1+Math.min(2,Math.floor(nx/3));
      case 'steep':return wallTop+1+Math.min(3,Math.floor(nx/2));
      case 'hip':return wallTop+1+Math.min(2,Math.floor(Math.min(nx,nz)/3));
      case 'shed':return wallTop+1+Math.floor(x*3/w);
      case 'monitor':return wallTop+1+(x>Math.floor(w*.28)&&x<Math.floor(w*.72)?2:0);
      case 'butterfly':return wallTop+1+Math.min(2,Math.floor(Math.abs(x-midX)/3));
      case 'dome':return wallTop+1+Math.min(3,Math.floor(Math.min(nx,nz)/2));
      case 'courtyard':case 'terrace':return wallTop+1;
      default:throw new Error('unknown authored roof');
    }
  };
  for(let x=0;x<w;x++)for(let z=0;z<d;z++){
    if(roof==='courtyard'&&Math.abs(x-midX)<=1&&Math.abs(z-midZ)<=1)continue;
    const y=roofY(x,z);
    if(roof==='terrace'&&(x===0||x===w-1||z===0||z===d-1))place(x,y+1,z,'roof','pack3:070');
    place(x,y,z,'roof',theme.roof);
  }
  // Pick a genuine unobstructed roof daylight shaft BEFORE beams, risers and
  // roofing joins are authored. The previous raised lantern had an unbroken
  // roof tile directly underneath its pane: no daylight could enter.
  let daylightOpening=null;
  if(feature==='skylight'){
    const candidates=[];
    for(let x=3;x<w-3;x++)for(let z=3;z<d-3;z++){
      // Frame beam rows are at z=3+4n. Do not cut a load-bearing member.
      if((z-3)%4===0)continue;
      const y=roofY(x,z),tile=occupied.get(at(x,y,z));
      if(tile?.role!=='roof'||y+2>=h)continue;
      if(!free(x-1,y+1,z)||!free(x+1,y+1,z)||!free(x,y+1,z)||!free(x,y+2,z))continue;
      if(Array.from({length:y-1},(_,i)=>i+1).some(level=>!free(x,level,z)))continue;
      candidates.push({x,y,z,distance:Math.abs(x-midX)+Math.abs(z-midZ)});
    }
    candidates.sort((a,b)=>a.distance-b.distance||a.z-b.z||a.x-b.x);
    if(!candidates.length)throw Error(name+': no physically clear roof daylight aperture');
    daylightOpening=candidates[0];
    remove(daylightOpening.x,daylightOpening.y,daylightOpening.z);
  }
  // Authored physical roof frame: longitudinal beams every fourth interior z
  // section, with occasional upward tie posts immediately under taller roof
  // profiles. This is a *theoretical* timber structural frame, not proof that
  // unresolved future roof assets can safely span the gaps or carry loads.
  let frameCells=0,frameSections=0;
  for(let z=3;z<d-3;z+=4){
    frameSections++;
    for(let x=2;x<w-2;x++){
      if(free(x,wallTop,z)){
        place(x,wallTop,z,'support','pack2:015','east',{roofFrame:'crossbeam'});
        frameCells++;
      }
      if(x%3!==0)continue;
      const roofBottom=roofY(x,z)-1;
      for(let y=wallTop+1;y<=roofBottom;y++)if(free(x,y,z)){
        place(x,y,z,'support','pack2:022','none',{roofFrame:'tie-post'});
        frameCells++;
      }
    }
  }
  if(frameCells===0)throw new Error(name+': no actual roof frame voxels');
  // Pack3 tile underlays are only 0.125 cell high. A raised roof tile next to
  // a lower one needs a solid riser BELOW its own tile: the thin tile cannot
  // physically seal a 1-cell cliff between courses. We fill demonstrably open
  // step risers with registered live wood/stone; a few intersecting candidate
  // beam/post cells are left EXPLICITLY UNRESOLVED rather than overwriting
  // their future physical geometry. This is not full roof load/seal approval.
  const roofColumns=new Map();
  for(const p of occupied.values())if(p.role==='roof'){
    const col=at(p.at[0],0,p.at[2]);
    if(!roofColumns.has(col)||roofColumns.get(col).at[1]>p.at[1])roofColumns.set(col,p);
  }
  const riserTargets=new Set();
  for(const p of roofColumns.values()){
    const [x,y,z]=p.at;
    for(const [dx,dz] of [[-1,0],[1,0],[0,-1],[0,1]]){
      const q=roofColumns.get(at(x+dx,0,z+dz));
      if(q&&q.at[1]<y)for(let level=q.at[1];level<y;level++)riserTargets.add(at(x,level,z));
    }
  }
  let roofStepFilled=0;
  const roofStepPending=[],roofStepSolidPostSubstitutions=[];
  for(const k of [...riserTargets].sort()){
    const [x,y,z]=k.split(',').map(Number);
    if(free(x,y,z)){
      place(x,y,z,'support',biome==='mountain'||biome==='desert'?'live:stone':'live:wood','none',{roofRiser:'live-solid-step-backing'});
      roofStepFilled++;
    }else{
      const occupant=occupied.get(k);
      // Pack2 022 is a slender POST, not a sealed vertical wall/riser. At a
      // raised roof step, retain an actual supporting tie-post position but
      // substitute currently live SOLID timber, sealing the whole voxel cell.
      // Future decorative posts can be reviewed separately; no claim that
      // candidate Pack2 timber span or roof waterproofing is certified.
      if(occupant?.roofFrame==='tie-post'&&occupant.asset==='pack2:022'){
        occupied.set(k,{...occupant,asset:'live:wood',orientation:'none',occupancy:FULL,
          roofRiser:'live-solid-step-backing',postSubstitution:{from:'pack2:022',strengthApproval:'unresolved'}});
        roofStepFilled++;
        roofStepSolidPostSubstitutions.push([x,y,z]);
      }else if(!occupant?.asset.startsWith('live:')){
        roofStepPending.push({cell:[x,y,z],asset:occupant?.asset??'untracked'});
      }
    }
  }
  const roofStepAudit={needed:riserTargets.size,filled:roofStepFilled,unresolved:roofStepPending,
    solidPostSubstitutions:roofStepSolidPostSubstitutions,weatherSealApproved:false};
  if(feature==='porch'||feature==='arcade'){
    for(const x of feature==='porch'?[entry-2,entry+2]:[3,entry,w-4])for(let y=1;y<=wallTop;y++)if(x!==entry&&free(x,y,0))place(x,y,0,'support','pack2:022');
  }else if(feature==='buttress'){
    for(const x of [0,w-1])for(const z of [3,d-4])for(let y=1;y<=2;y++)if(free(x,y,z))place(x,y,z,'support','pack1:010');
  }else if(feature==='chimney'){
    const x=w-4,z=d-4;for(let y=roofY(x,z)+1;y<Math.min(h,roofY(x,z)+4);y++)place(x,y,z,'decoration','pack4:063');
  }else if(feature==='tower'){
    for(const [x,z] of [[2,3],[3,2],[3,3]]){
      const y=roofY(x,z);for(let u=y+1;u<Math.min(h,y+4);u++)if(free(x,u,z))place(x,u,z,'decoration','pack3:077');
    }
  }else if(feature==='skylight'){
    // Future roof daylight feature: Pack4 windows rotate only around Y (0..3).
    // Do NOT put a vertical glass pane horizontally in a roof with 'up'.
    // Instead author a three-cell-wide *raised vertical-glass dormer*.
    // Its one-cell roof aperture now reaches the room; pane sealing and all
    // candidate glazing/roof junctions remain explicitly unapproved.
    if(!daylightOpening)throw Error(name+': missing real daylight opening');
    const {x,z}=daylightOpening,y=daylightOpening.y+1;
    if(y+1>=h)throw Error(name+': raised roof lantern exceeds footprint');
    for(const px of [x-1,x+1]){
      if(!free(px,y,z))throw Error(name+': raised roof lantern support blocked');
      place(px,y,z,'support','pack2:022','none',{roofLantern:'side-post'});
    }
    if(!free(x,y,z)||!free(x,y+1,z))throw Error(name+': raised roof lantern aperture blocked');
    place(x,y,z,'window','pack4:030','north',{mount:'opening',roofLantern:'vertical-glazing',glazingApproved:false});
    place(x,y+1,z,'roof',theme.roof,'none',{roofLantern:'cap',weatherSealApproved:false});
  }
  // Regionally specific, *physical* external profiles. They change the authored
  // outline and supports, not merely the coloration of shared templates.
  // These cells are outside the interior circulation and outside the clear gate.
  const regionalDetail={
    temperate:{asset:'pack2:022',label:'lane-front colonnade',xs:[-3,-1,1,3],zs:[0],maxHeight:wallTop-1},
    desert:{asset:'pack5:080',label:'sand-shade front arcade',xs:[-4,-2,2,4],zs:[0],maxHeight:wallTop},
    snow:{asset:'pack2:014',label:'windward insulated snowbreak',xs:[-3,-2,2,3],zs:[0],maxHeight:2},
    'enchanted-forest':{asset:'pack1:010',label:'living-root threshold columns',xs:[-4,-3,3,4],zs:[0],maxHeight:3},
    mountain:{asset:'pack1:010',label:'cliffside retaining piers',xs:[-4,-2,2,4],zs:[0],maxHeight:wallTop-1}
  }[biome];
  let profileCount=0;
  for(const delta of regionalDetail.xs){
    const x=entry+delta;if(x<=1||x>=w-2||x===entry)continue;
    for(const z of regionalDetail.zs)for(let y=1;y<=regionalDetail.maxHeight;y++){
      if(free(x,y,z)){
        place(x,y,z,'support',regionalDetail.asset,'north');profileCount++;
      }
    }
  }
  // Physical corner-braces / flank piers make the weather-side massing and rear
  // approach differ between biome families. They never overlap entrances.
  const flankZ=category==='stable'?[3,d-4]:[Math.max(3,midZ-3),Math.min(d-4,midZ+2)];
  for(const x of [0,w-1])for(const z of flankZ)for(let y=1;y<=(biome==='snow'?2:3);y++){
    if(free(x,y,z)){
      place(x,y,z,'support',biome==='desert'?'pack5:080':biome==='mountain'?'pack1:010':'pack2:022','north');profileCount++;
    }
  }
  if(profileCount<4)throw new Error(name+': missing meaningful physical regional building profile');
  // Place different intended physical furnishings *inside the relevant room*.
  // Keep central access and door thresholds clear; materials remain unresolved
  // until their real mesh occupancy/support properties are approved.
  const roomProgram={
    house:{hearth:['pack4:064','pack4:059'],sleeping:['pack5:082','pack5:085'],pantry:['pack5:085','pack4:057'],study:['pack5:084','pack5:091']},
    tavern:{taproom:['pack5:086','pack4:059','pack4:058'],kitchen:['pack5:090','pack4:056'],storeroom:['pack4:057','pack4:056'],alcove:['pack4:058','pack5:083']},
    stable:{'west-front':['pack5:096'],'east-front':['pack5:096'],'west-rear':['pack5:096'],'east-rear':['pack5:096'],'tack-room':['pack5:085','pack4:057']}
  }[category];
  const foyer=new Set(portals.flatMap(p=>[at(p.at[0],1,p.at[2]),at(p.at[0]+1,1,p.at[2]),at(p.at[0]-1,1,p.at[2]),at(p.at[0],1,p.at[2]+1),at(p.at[0],1,p.at[2]-1)]));
  const placedByRoom={};
  for(const r of rooms){
    const refs=roomProgram[r.id]??[];
    const candidates=[];
    for(let x=r.min[0];x<r.max[0];x++)for(let z=r.min[2];z<r.max[2];z++){
      if(!free(x,1,z)||!free(x,2,z)||reserved.has(at(x,1,z))||foyer.has(at(x,1,z)))continue;
      // Perimeter-first placement leaves the center of each room walkable.
      const edge=Math.min(x-r.min[0],r.max[0]-1-x,z-r.min[2],r.max[2]-1-z);
      candidates.push({x,z,edge});
    }
    candidates.sort((a,b)=>a.edge-b.edge||a.z-b.z||a.x-b.x);
    let placed=0;
    for(const [i,ref] of refs.entries()){
      const c=candidates.find(({x,z})=>free(x,1,z)&&!foyer.has(at(x,1,z))&&Math.abs(x-midX)+Math.abs(z-midZ)>1);
      if(!c)break;
      const orientation=i%2?'east':'north';
      const extras=extraCandidateCells(ref,[c.x,1,c.z],orientation);
      if(extras.some(pos=>!pos.every((v,k)=>v>=0&&v<[w,h,d][k])||!free(...pos)||!free(pos[0],pos[1]+1,pos[2])||!pos.every((v,k)=>v>=r.min[k]&&v<r.max[k])))continue;
      place(c.x,1,c.z,'furnishing',ref,orientation,{room:r.id});placed++;
      if(extras.length){
        footprintReservations.push({asset:ref,anchor:[c.x,1,c.z],extraCells:extras.map(pos=>[...pos]),source:'pack5:082-candidate-cell-offset',approval:'unresolved'});
        for(const pos of extras)fixtureReserved.add(at(...pos));
      }
      candidates.splice(candidates.indexOf(c),1);
    }
    placedByRoom[r.id]=placed;
  }
  // A counter, service zone and independent seating make every tavern an
  // inhabitable interior, not merely a roofed hall labeled 'tavern'.
  if(category==='tavern'&&!Object.keys(placedByRoom).some(k=>k==='taproom'&&placedByRoom[k]>=2))
    throw new Error(name+': tavern taproom lacks distinct counter and seating');
  // Accessible coordinates are actual empty 3D cells; no furnishing, wall or pen can occupy them.
  const walkable=[];
  for(let x=2;x<w-2;x++)for(let z=2;z<d-2;z++)if(free(x,1,z)&&free(x,2,z))walkable.push([x,1,z]);
  walkable.push([entry,1,0],[entry,1,1]);
  // Walkable portal thresholds must remain empty at standing/head level.
  for(const portal of portals){const [x,y,z]=portal.at;if(!free(x,y,z)||!free(x,y+1,z))throw new Error(name+': portal blocked '+at(x,y,z));}
  const deps=[...new Set([...occupied.values()].map(p=>p.asset).filter(a=>!a.startsWith('live:')))].sort().map(asset=>({asset,status:'unresolved',requires:['exact physical dimensions and orientation','support/mount and selection/collision bounds','schema-1 safe asset substitution and load-time dependency resolution']}));
  const b={schema:SCHEMA,id:blueprintId(category,biome,size,index),index,category,biome,size,status:'candidate',title:name,architecturalIdentity:{plan,roof,feature,regionalDetail:regionalDetail.label,physicalProfileCells:profileCount,roofFrame:{cellCount:frameCells,sections:frameSections,asset:'pack2:015',postAsset:'pack2:022',spanApproval:'unresolved'},roofStepAudit,daylightOpening:daylightOpening?{cell:[daylightOpening.x,daylightOpening.y,daylightOpening.z],daylightApproved:false,weatherSealApproved:false}:null,roomFurniture:placedByRoom,localEntrance:[entry,1,1]},frame:'local-x-east-y-up-z-south',footprint:{width:w,height:h,depth:d},worldPlacement:false,liveIntegration:false,placements:[...occupied.values()],footprintReservations,rooms,walkable,portals,dependencies:deps,animals:category==='stable'?[]:undefined};
  validateBlueprint(b);return b;
}
export function getM1Blueprints(){
  const result=[];
  for(const category of ['house','tavern','stable'])for(const biome of BIOMES)for(const [i,size] of SIZES.entries()){
    result.push(compile(category,biome,size,i+1,DESIGN_MATRIX[category][biome][i]));
  }
  validatePool(result);return result;
}
export function getM1Blueprint(id){return getM1Blueprints().find(b=>b.id===id)??null;}
