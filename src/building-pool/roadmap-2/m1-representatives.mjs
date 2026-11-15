import {BIOMES,SIZES} from './catalog.mjs';
import {SCHEMA,validateBlueprint,assertDistinctArchitecture} from './schema.mjs';
import {TEMPERATE_SMALL_GENERAL_STORE} from './temperate-store.mjs';

// 29 additional complete coordinate-authored architectural concepts, plus the M0 store.
// All materials refer to symbolic ROSTER positions, not numeric block IDs.
const REFS=Object.freeze({
  temperate:{foundation:'pack1:001',floor:'pack2:013',wall:'pack2:013',roof:'pack3:023',trim:'pack2:015'},
  desert:{foundation:'biome130:006',floor:'pack5:081',wall:'pack5:079',roof:'pack5:080',trim:'biome130:091'},
  snow:{foundation:'pack1:004',floor:'pack2:013',wall:'biome130:094',roof:'pack3:025',trim:'pack2:015'},
  'enchanted-forest':{foundation:'biome130:038',floor:'pack2:013',wall:'biome130:096',roof:'pack3:026',trim:'pack2:015'},
  mountain:{foundation:'biome130:047',floor:'pack1:005',wall:'pack1:002',roof:'pack3:025',trim:'pack1:005'}
});
// Issue #117's authoritative 130 roster calls biome130:044 *woven magical
// branch lattices* and biome130:098 *mountain cliff-anchor fittings*. Neither
// describes a full structural wall, roof beam, or load-bearing column. Earlier
// plans wrongly used those shapes for thousands of full-cell supports.
// Use manufactured Pack 2 timber beams and full Pack 1 polished masonry as
// physical-support candidates; regional foundations, wall ribs and roof
// families remain biome-specific. All producer shape/collision ABI remains
// unresolved until separate integration/creator approval.
// Verified symbolic roster positions from manual Pack 1–5 manifests. These are
// future dependencies, NOT runtime numeric IDs, shape/rotation approval or saves.
export const M1_FIXTURE_ROSTER=Object.freeze({store:'pack5:087',counter:'pack5:086',altar:'pack5:093',seat:'pack4:058',light:'pack4:037',glass:'pack4:030',frame:'pack4:032',crate:'pack4:057',banner:'pack4:061',column:'pack3:072',garden:'pack1:047'});
const FIXTURE=M1_FIXTURE_ROSTER;
const DIM={small:[12,12,6],medium:[16,16,7],large:[21,21,9]};
const COORD=(x,y,z)=>`${x},${y},${z}`;
function build({biome,size,category}){
  const isTemple=category==='temple';
  const [baseW,baseD,baseWall]=DIM[size];
  const index=BIOMES.indexOf(biome);
  const width=baseW+(index===3?2:0)+(isTemple?2:0);
  const depth=baseD+(index===1?2:0)+(isTemple?3:0);
  const top=baseWall+(isTemple?1:0);
  const center=Math.floor(width/2);
  const partition=depth-(size==='large'?7:5);
  const m=REFS[biome];
  const cells=new Map();
  const put=(x,y,z,material,kind,overwrite=true)=>{
    if([x,y,z].some(a=>!Number.isInteger(a)||a<0))throw Error('negative coordinate');
    const key=COORD(x,y,z);
    if(!overwrite&&cells.has(key))throw Error('duplicate '+key);
    cells.set(key,{x,y,z,material,kind});
  };
  const remove=(x,y,z)=>cells.delete(COORD(x,y,z));
  // These area outlines are biome-specific, not recolors of the same rectangle.
  const footprint=(x,z)=>{
    if(x<0||x>=width||z<0||z>=depth)return false;
    if(biome==='temperate')return !(x===0&&z===depth-1)||(isTemple&&z===depth-1);
    if(biome==='desert')return !(z===0&&(x<2||x>=width-2)) && !(x===0&&z>=depth-3);
    if(biome==='snow')return !(x===width-1&&z<2)&&!(x===0&&z===0);
    if(biome==='enchanted-forest')return !((x<=1&&z<=1)||(x>=width-2&&z>=depth-2)|| (x===0&&z>=depth-3));
    // mountainside has a terraced diagonal southwest face and rear spur.
    return !(x<3&&z<4-x)&&!(x===width-1&&z>=depth-3);
  };
  // Primary foundation and interior walking level.
  for(let x=0;x<width;x++)for(let z=0;z<depth;z++)if(footprint(x,z)){
    put(x,0,z,m.foundation,'foundation');put(x,1,z,m.floor,'floor');
  }
  const bounds=(x,z)=>footprint(x,z)&&(!footprint(x-1,z)||!footprint(x+1,z)||!footprint(x,z-1)||!footprint(x,z+1));
  for(let x=0;x<width;x++)for(let z=0;z<depth;z++)if(bounds(x,z))for(let y=2;y<=top;y++)put(x,y,z,m.wall,'wall');
  // Explicit, walkable three-high street entrance.
  const entranceX=center;
  for(let y=2;y<=4;y++)remove(entranceX,y,0);
  // Exterior glazing stays real occupied window cells, not text metadata.
  for(const x of [3,width-4])for(let y=3;y<=4;y++)if(footprint(x,0))put(x,y,0,y===3?FIXTURE.glass:FIXTURE.frame,'window');
  for(const z of [4,Math.min(depth-3,7)])for(let y=3;y<=4;y++)for(const x of [0,width-1])if(footprint(x,z)&&bounds(x,z))put(x,y,z,FIXTURE.glass,'window');
  // Room separation: shops have a real rear stockroom; temples have an elevated sanctuary.
  const openingX=isTemple?center:Math.min(width-3,center+2);
  for(let x=1;x<width-1;x++)if(footprint(x,partition))for(let y=2;y<=top-1;y++){
    if(x===openingX || (isTemple&&Math.abs(x-openingX)<=1))continue;
    put(x,y,partition,m.trim,'wall');
  }
  const supplementalRooms=[];
  const supplementalCirculation=[];
  const supplementalOpenings=[];
  // Category-specific fixtures, arranged around a central traversable aisle.
  if(!isTemple){
    for(const z of [3,5,Math.min(partition-2,8)])for(const x of [2,width-3]){
      if(x===center)continue;
      for(let y=2;y<=3;y++)if(footprint(x,z)&&!bounds(x,z))put(x,y,z,FIXTURE.store,'fixture');
    }
    for(let x=center+2;x<=Math.min(center+4,width-3);x++)if(footprint(x,3))put(x,2,3,FIXTURE.counter,'fixture');
    for(const [x,z] of [[3,depth-3],[width-4,depth-3],[3,depth-2],[width-4,depth-2]])
      if(footprint(x,z)&&!bounds(x,z))put(x,2,z,FIXTURE.crate,'decor');
  }else{
    // Distinct nave, colonnade/pews, symbolic altar and physically projecting dais.
    for(const z of [4,6,Math.min(partition-2,10)])for(const x of [center-3,center+3]){
      if(x>=2&&x<width-2&&z<partition&&footprint(x,z)){
        // The medium east-side chapel doorway at x(width-5),z6 needs a clear
        // approach from the nave. The old pew at center+3,z6 blocked it;
        // before end-wall sealing, a back-door bypass concealed that failure.
        const seatZ=size==='medium'&&z===6&&x===center+3?7:z;
        put(x,2,seatZ,FIXTURE.seat,'fixture');
      }
    }
    for(const x of [2,width-3])for(const z of [4,Math.min(partition-2,9)])if(footprint(x,z)&&!bounds(x,z)){
      for(let y=2;y<top;y++)put(x,y,z,FIXTURE.column,'fixture');
    }
    for(let x=center-2;x<=center+2;x++)if(footprint(x,depth-3)){
      put(x,2,depth-3,m.trim,'fixture');
    }
    // A raised two-row ceremonial dais, distinct from the level public nave.
    // The rest of the sanctuary floor remains approachable at y=1.
    for(const z of [depth-3,depth-2])for(let x=center-2;x<=center+2;x++)
      if(footprint(x,z))put(x,2,z,m.trim,'fixture');
    if(footprint(center,depth-3))put(center,3,depth-3,FIXTURE.altar,'fixture');
    // Raised platforms need planned physical access, not an imaginary 1-block jump.
    // These are SYMBOLIC stair candidates; slope, facing, physical collision and
    // multi-cell connectivity remain unapproved until Pack 1/central ABI handoff.
    for(const x of [center-2,center+2])if(footprint(x,depth-4)){
      put(x,2,depth-4,'pack1:008','fixture');
      // Intent for manual physical-shape handoff, NOT a runtime rotation/save ABI.
      const symbolicStair=cells.get(COORD(x,2,depth-4));
      symbolicStair.intendedFacing='+z';
      symbolicStair.lowerLanding={x,y:1,z:depth-5};
      symbolicStair.upperLanding={x,y:2,z:depth-3};
      symbolicStair.shapeRotationStatus='unresolved-symbolic';
    }
  }
  // M1 size-specific spatial planning, not a stretched copy of one two-room
  // plan. Medium buildings have a SIDE clerk/meditation cell enclosed by a
  // 3-high screen and a genuinely open crossing at z6. Large shops have a
  // separately enclosed unloading bay in rear storage; large sanctuaries get
  // two physically partitioned side chapels with open nave-facing doors.
  // These are rooms with actual independent access and dedicated fixtures.
  if(size==='medium'){
    const screenX=width-5,doorZ=6,screenEnd=Math.min(partition-2,9);
    for(let z=4;z<=screenEnd;z++)if(z!==doorZ)
      for(let y=2;y<=4;y++)put(screenX,y,z,m.trim,'wall');
    // Enclose both exposed ends. Without these end caps the room is
    // approachable around the screen even if its intended door is blocked.
    // Only the registered z6 opening enters the office/meditation chapel.
    for(const capZ of [3,screenEnd+1])for(let x=screenX+1;x<=width-2;x++)
      for(let y=2;y<=4;y++)put(x,y,capZ,m.trim,'wall');
    const roomUse=isTemple?'meditation-chapel':'counting-office';
    supplementalRooms.push({name:isTemple?'Side meditation chapel':'Merchant counting office',
      bounds:{x0:screenX+1,x1:width-2,z0:4,z1:screenEnd},uses:[roomUse]});
    supplementalCirculation.push({from:isTemple?'ceremonial-space':'sales-floor',to:roomUse,
      via:`three-high east side opening x${screenX},z${doorZ}`});
    supplementalOpenings.push({type:'internal-doorway',role:'auxiliary-room',roomUse,
      x:screenX,y:2,z:doorZ,clearHeightCells:3});
    put(width-3,2,7,isTemple?FIXTURE.altar:FIXTURE.counter,'fixture');
  }else if(size==='large'&&!isTemple){
    const screenX=4,doorZ=partition+2;
    for(let z=partition+1;z<=depth-2;z++)if(z!==doorZ)
      for(let y=2;y<=4;y++)put(screenX,y,z,m.trim,'wall');
    supplementalRooms.push({name:'Separated supply loading bay',
      bounds:{x0:1,x1:screenX-1,z0:partition+1,z1:depth-2},uses:['loading-bay']});
    supplementalCirculation.push({from:'storage',to:'loading-bay',
      via:`three-high rear stockroom passage x${screenX},z${doorZ}`});
    supplementalOpenings.push({type:'internal-doorway',role:'auxiliary-room',roomUse:'loading-bay',
      x:screenX,y:2,z:doorZ,clearHeightCells:3});
    put(2,2,partition+4,FIXTURE.crate,'fixture');
  }else if(size==='large'&&isTemple){
    for(const screenX of [4,width-5]){
      for(let z=4;z<=11;z++)if(z!==6)
        for(let y=2;y<=4;y++)put(screenX,y,z,m.trim,'wall');
    }
    // Two formerly open-ended screen partitions did not separate chapels:
    // the nave could enter each side around z3 and z12. Give both chapels
    // actual side-to-exterior end caps while preserving one 3-high door.
    for(const [x0,x1] of [[1,3],[width-4,width-2]])
      for(const capZ of [3,12])for(let x=x0;x<=x1;x++)
        for(let y=2;y<=4;y++)put(x,y,capZ,m.trim,'wall');
    for(const [use,x0,x1,altarX] of [
      ['west-chapel',1,3,2],['east-chapel',width-4,width-2,width-3]]){
      supplementalRooms.push({name:use==='west-chapel'?'West votive chapel':'East votive chapel',
        bounds:{x0,x1,z0:4,z1:11},uses:[use]});
      supplementalCirculation.push({from:'ceremonial-space',to:use,
        via:`three-high side-chapel opening z6, x${use==='west-chapel'?4:width-5}`});
      supplementalOpenings.push({type:'internal-doorway',role:'auxiliary-room',roomUse:use,
        x:use==='west-chapel'?4:width-5,y:2,z:6,clearHeightCells:3});
      put(altarX,2,8,FIXTURE.altar,'fixture');
    }
  }
  for(const [x,z] of [[2,3],[width-3,3],[2,depth-3],[width-3,depth-3]])
    if(footprint(x,z)&&!bounds(x,z)&&!cells.has(COORD(x,top-1,z)))put(x,top-1,z,FIXTURE.light,'decor');
  // Facade and regional structural identities; not purely aesthetic variants.
  if(biome==='temperate'){
    // Cross-porch timber structure and cantilevered corner bays.
    for(const x of [1,width-2])for(let y=2;y<=4;y++)put(x,y,1,m.trim,'wall');
    for(let x=1;x<width-1;x++)put(x,5,1,m.trim,'roof');
    for(let z=depth-4;z<depth-1;z++)if(footprint(width-1,z))put(width-1,top+1,z,m.roof,'roof');
  }else if(biome==='desert'){
    // Real open-roof courtyard pocket inside a split flat roof, shade lintels, crenellated rim.
    for(let x=2;x<width-2;x++)for(const z of [1,2])put(x,top+2,z,m.trim,'roof');
    for(let z=0;z<depth;z+=3)for(const x of [1,width-2])if(footprint(x,z))put(x,top+2,z,m.trim,'roof');
  }else if(biome==='snow'){
    // Insulated snow-shed vestibule and north-oriented steep ridge.
    for(let x=center-2;x<=center+2;x++)for(let z=1;z<=2;z++)if(footprint(x,z))put(x,top+1,z,m.roof,'roof');
    for(const x of [center-2,center+2])for(let y=2;y<=4;y++)if(footprint(x,2))put(x,y,2,m.trim,'wall');
  }else if(biome==='enchanted-forest'){
    // Root-woven buttresses and two unequal livingwood spire-shafts.
    for(const [x,z] of [[1,depth-4],[width-3,2]])for(let y=2;y<=top+3;y++)if(footprint(x,z))put(x,y,z,m.trim,y<=top?'wall':'roof');
    for(let x=2;x<width-2;x+=3)if(footprint(x,depth-1))put(x,top+2,depth-1,m.trim,'roof');
  }else{
    // High cliff-side terraces anchored at distinct elevations, with stone landing spurs.
    for(let z=3;z<depth;z+=4)for(let y=2;y<=3+(z%3);y++)if(footprint(1,z))put(1,y,z,m.trim,'wall');
    for(let x=width-4;x<width-1;x++)for(let z=depth-5;z<depth-2;z++)if(footprint(x,z))put(x,top+2,z,m.trim,'roof');
  }
  // Roof is composed of coordinate blocks, with true shape/mass differences.
  const roofAt=(x,z)=>{
    if(biome==='desert')return top+1; // shade courtyard exposed below
    if(biome==='snow')return top+1+Math.max(0,Math.floor((Math.min(x,width-1-x))*0.85));
    if(biome==='mountain')return top+1+Math.floor(z/(size==='small'?5:6));
    if(biome==='enchanted-forest')return top+1+Math.min(4,Math.floor(Math.min(x,width-1-x)/2))+(z>depth/2?1:0);
    return top+1+Math.floor(Math.min(x,width-1-x)/2);
  };
  for(let x=0;x<width;x++)for(let z=0;z<depth;z++)if(footprint(x,z)){
    if(biome==='desert' && x>=center-2&&x<=center+2&&z>=3&&z<=Math.min(depth-6,8))continue; // courtyard skylight
    put(x,roofAt(x,z),z,m.roof,'roof');
  }
  // Physical high-level truss ribs: pitched/stepped roof layers otherwise span
  // open air with no authored support. A wall-to-wall tie beam is laid at y=top,
  // above the guaranteed 3-high interior walking clearance (y=2..4), then
  // raised purlin posts fill the air gap up to the actual roof layer.
  // The open Desert courtyard intentionally retains its unbridged skylight.
  if(biome!=='desert')for(let z=3;z<depth-2;z+=4){
    for(let x=0;x<width;x++)if(footprint(x,z)){
      if(!cells.has(COORD(x,top,z)))put(x,top,z,m.trim,'wall');
      for(let y=top+1;y<roofAt(x,z);y++)
        if(!cells.has(COORD(x,y,z)))put(x,y,z,m.trim,'wall');
    }
  }
  // Decorated gable ends have physical material filling the gap to roof.
  if(biome==='snow'||biome==='temperate'||biome==='enchanted-forest')for(const z of [0,depth-1])for(let x=1;x<width-1;x++)if(footprint(x,z)){
    for(let y=top+1;y<roofAt(x,z);y++)put(x,y,z,m.wall,'wall');
  }
  // Mountain terrace roofs rise in discrete levels toward the rear.
  // The final roof tier previously floated above the back wall in multiple
  // footprints because recurring trusses ended before the rear boundary.
  // Fill the actual rear gable UNDER the last roof tier so every plate is
  // load-path connected without covering the walkable interior below y=5.
  if(biome==='mountain')for(let x=0;x<width;x++)if(footprint(x,depth-1)){
    for(let y=top+1;y<roofAt(x,depth-1);y++)
      if(!cells.has(COORD(x,y,depth-1)))put(x,y,depth-1,m.trim,'wall');
  }
  // Weather-seal exposed mountain and livingwood exterior edges below roofs.
  // Earlier roof ribs connected to foundations, but left 248 upper-wall gaps
  // distributed along irregular side perimeters in 12 models. Solidify only
  // perimeter cells strictly below the roof, never glazing, doors, skylights,
  // or the open Desert courtyards; all are authored symbolic material voxels.
  if(biome==='mountain'||biome==='enchanted-forest')for(let x=0;x<width;x++)for(let z=0;z<depth;z++){
    if(!footprint(x,z)||!bounds(x,z))continue;
    for(let y=top+1;y<roofAt(x,z);y++)
      if(!cells.has(COORD(x,y,z)))put(x,y,z,m.wall,'wall');
  }
  // Category-defining exterior monumentality: actual paired belfry volumes,
  // a three-wide processional entrance, and a visible roof-crossing lantern tower.
  // A single antenna-shaped post is NOT a belfry. These occupy a 2x2 footprint
  // each and tower ABOVE the highest roof ridge, even in the Snow region.
  if(isTemple){
    const highestRoof=Math.max(...Array.from({length:width},(_,x)=>
      Array.from({length:depth},(_,z)=>footprint(x,z)?roofAt(x,z):0)).flat());
    for(let x=center-1;x<=center+1;x++)for(let y=2;y<=4;y++)remove(x,y,0);
    // Physical portal shoulders and the spanning arch, not a metadata-only entrance.
    for(const x of [center-2,center+2])for(let y=2;y<=5;y++)put(x,y,0,m.trim,'wall');
    for(let x=center-1;x<=center+1;x++)put(x,5,0,m.trim,'wall');
    // Pair of complete 2x2 belfries with actual foundations at *every* cell.
    // Mountain/clipped footprints previously left the left tower unsupported
    // (0/4 foundation cells), while desert/enchanted corners were incomplete.
    // New footings are temple-only piers, not changes to landscape/worldgen.
    // High apertures are conceptual: true light/collision requires asset ABI.
    for(const sx of [1,width-3])for(let dx=0;dx<2;dx++)for(const z of [0,1]){
      const x=sx+dx;
      if(!cells.has(COORD(x,0,z)))put(x,0,z,m.foundation,'foundation');
      if(!cells.has(COORD(x,1,z)))put(x,1,z,m.floor,'floor');
      for(let y=2;y<=highestRoof+4;y++){
        const upperWindow=y===highestRoof+2&&z===0&&dx===0;
        put(x,y,z,upperWindow?FIXTURE.glass:m.trim,upperWindow?'window':'wall');
      }
      put(x,highestRoof+5,z,m.roof,'roof');
    }
    // Desert temples have a genuine open-air central courtyard. Their
    // original roof lantern was suspended within that skylight with no
    // supporting cell beneath it. Place the lantern over the actual covered
    // processional porch (z=2), retaining the courtyard fully open to sky.
    const naveZ=biome==='desert'?2:Math.max(4,Math.floor(partition/2));
    const lanternFoot=roofAt(center,naveZ);
    // Lantern crosses over the regular roof height: avoids a hidden spire.
    for(let y=lanternFoot+1;y<=highestRoof+5;y++){
      put(center,y,naveZ,m.trim,'roof');
      if(y>=highestRoof+1&&y<=highestRoof+3)
        for(const x of [center-1,center+1])put(x,y,naveZ,m.trim,'roof');
    }
    put(center,highestRoof+6,naveZ,m.roof,'decor');
    if(size==='large')for(const z of [5,partition-2])for(const x of [4,width-5]){
      if(!footprint(x,z))continue;
      // Short lantern dormers on the flanking nave, below the belfry caps.
      for(let y=roofAt(x,z)+1;y<=Math.min(highestRoof+1,roofAt(x,z)+3);y++)
        put(x,y,z,m.trim,'roof');
      put(x,Math.min(highestRoof+2,roofAt(x,z)+4),z,m.roof,'decor');
    }
  }else{
    // Stores have a lower storefront lintel and hanging sign, but no sanctuary towers.
    for(let x=center-2;x<=center+2;x++)put(x,top+1,0,m.trim,'roof');
    if(size!=='small')put(center,top+2,0,'pack4:060','decor');
    if(size==='large')for(let z=depth-4;z<depth-1;z++)if(footprint(2,z)){
      put(2,top+1,z,m.trim,'roof');put(2,top+2,z,m.roof,'roof');
    }
  }
  const voxels=[...cells.values()].sort((a,b)=>a.y-b.y||a.z-b.z||a.x-b.x);
  const extents={x:width,y:Math.max(...voxels.map(v=>v.y))+1,z:depth};
  // Every actual window voxel (front, sides and high belfry glazing)
  // requires its own material-specific window opening record for the later
  // shape/glazing ABI. Two sample street metadata entries previously failed
  // to describe 334 physically placed windows across the complete 30 models.
  const windowOpenings=voxels.filter(v=>v.kind==='window')
    .map(({x,y,z,material})=>({type:'window',x,y,z,material}));
  const entry={type:'entrance',x:center,y:2,z:0,clearHeightCells:3,doorSymbol:'pack2:020',doorOpenState:'unverified'};
  const rooms=isTemple?[
   {name:'Ceremonial nave',bounds:{x0:1,x1:width-2,z0:1,z1:partition-1},uses:['ceremonial-space','public-circulation']},
   {name:'Altar sanctuary with raised ceremonial dais',bounds:{x0:1,x1:width-2,z0:partition+1,z1:depth-2},uses:['altar']}
  ]:[
   {name:'Customer hall',bounds:{x0:1,x1:width-2,z0:1,z1:partition-1},uses:['sales-floor','service-counter','display-shelves']},
   {name:'Rear stockroom',bounds:{x0:1,x1:width-2,z0:partition+1,z1:depth-2},uses:['storage']}
  ];
  const circulation=isTemple?[
   {from:'exterior',to:'ceremonial-space',via:`front x${center} triple-head clearance`},
   {from:'ceremonial-space',to:'altar',via:`three-aisle sanctuary partition at z${partition}`}
  ]:[
   {from:'exterior',to:'sales-floor',via:`front x${center} triple-head clearance`},
   {from:'sales-floor',to:'storage',via:`offset doorway x${openingX} at z${partition}`}
  ];
  const refs=[...new Set(voxels.map(v=>v.material).concat([entry.doorSymbol]))];
  const roofNames={temperate:'cross-beam timber gable',desert:'open courtyard shaded flat terraces',snow:'steep double-insulated ridge', 'enchanted-forest':'grown stepped livingwood spires', mountain:'cliff-terrace stone roof progression'};
  const blueprint={schema:SCHEMA,
   id:`r2:${category}:${biome}:${size}:01`,category,biome,size,variation:1,
   title:`${({temperate:'Hearth',desert:'Sunveil',snow:'Frostward','enchanted-forest':'Whisperbloom',mountain:'Highcrag'})[biome]} ${isTemple?'Sanctuary':'Exchange'} — ${size}`,
   status:'authored-candidate',isolated:true,worldPlaced:false,numericIdsAssigned:false,
   extents,units:'conceptual occupied voxels; shape/rotation ABI unresolved',
   architecturalSignature:`${roofNames[biome]}, ${category}, ${size}, x${width} z${depth}, partition ${partition}, distinct footprint`,
   roof:{form:roofNames[biome],biomeSpecific:true},
   rooms:[...rooms,...supplementalRooms],features:isTemple?['physically separated sanctuary','raised altar dais','paired symbolic stair approaches pending slope ABI','paired fully founded belfries','triple-wide processional entrance','roof lantern tower','structural columns','ceremonial rows']:['counter','display shelves','stockroom crates','real storeroom wall'],
   openings:[entry,...windowOpenings,
    {type:'internal-doorway',x:openingX,y:2,z:partition,clearHeightCells:3},...supplementalOpenings],
   circulation:[...circulation,...supplementalCirculation],
   unresolvedDependencies:refs.map(ref=>({ref,issue:'The physical shape, orientation, collision, support, appearance and save integration of this symbolic roster asset require central ABI verification'})),
   voxels
  };
  validateBlueprint(blueprint);
  return Object.freeze(blueprint);
}
export const M1_REPRESENTATIVES=Object.freeze([
  TEMPERATE_SMALL_GENERAL_STORE,
  ...['general-store','temple'].flatMap(category=>BIOMES.flatMap(biome=>SIZES.flatMap(size=>
    category==='general-store'&&biome==='temperate'&&size==='small'?[]:[build({category,biome,size})]
  )))
]);
export const M1_COUNTS=Object.freeze({total:M1_REPRESENTATIVES.length,stores:M1_REPRESENTATIVES.filter(b=>b.category==='general-store').length,temples:M1_REPRESENTATIVES.filter(b=>b.category==='temple').length});
export function checkM1Architectures(){return assertDistinctArchitecture(M1_REPRESENTATIVES);}
