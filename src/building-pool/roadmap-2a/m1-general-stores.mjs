// Builder 2A ONLY: store-only selective extraction from #124 at 07c45d27bd36f4f3aa3197bba0e4f49ce2a58c68.
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
export const M1_FIXTURE_ROSTER=Object.freeze({store:'pack5:087',counter:'pack5:086',light:'pack4:037',glass:'pack4:030',frame:'pack4:032',crate:'pack4:057'});
const FIXTURE=M1_FIXTURE_ROSTER;
const DIM={small:[12,12,6],medium:[16,16,7],large:[21,21,9]};
const COORD=(x,y,z)=>`${x},${y},${z}`;
function build({biome,size}){
  const category='general-store';
  const [baseW,baseD,baseWall]=DIM[size];
  const index=BIOMES.indexOf(biome);
  const width=baseW+(index===3?2:0);
  const depth=baseD+(index===1?2:0);
  const top=baseWall;
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
    if(biome==='temperate')return !(x===0&&z===depth-1);
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
  // The original three-high stockroom aisle and partition.
  const openingX=Math.min(width-3,center+2);
  for(let x=1;x<width-1;x++)if(footprint(x,partition))for(let y=2;y<=top-1;y++){
    if(x===openingX)continue;
    put(x,y,partition,m.trim,'wall');
  }
  const supplementalRooms=[];
  const supplementalCirculation=[];
  const supplementalOpenings=[];
  // Category-specific fixtures, arranged around a central traversable aisle.
    for(const z of [3,5,Math.min(partition-2,8)])for(const x of [2,width-3]){
      if(x===center)continue;
      for(let y=2;y<=3;y++)if(footprint(x,z)&&!bounds(x,z))put(x,y,z,FIXTURE.store,'fixture');
    }
    for(let x=center+2;x<=Math.min(center+4,width-3);x++)if(footprint(x,3))put(x,2,3,FIXTURE.counter,'fixture');
    for(const [x,z] of [[3,depth-3],[width-4,depth-3],[3,depth-2],[width-4,depth-2]])
      if(footprint(x,z)&&!bounds(x,z))put(x,2,z,FIXTURE.crate,'decor');
  // Size-specific offices and loading bays, excluding unrelated architectures.
  if(size==='medium'){
    const screenX=width-5,doorZ=6,screenEnd=Math.min(partition-2,9);
    for(let z=4;z<=screenEnd;z++)if(z!==doorZ)
      for(let y=2;y<=4;y++)put(screenX,y,z,m.trim,'wall');
    // Enclose both exposed ends. Without these end caps the room is
    // approachable around the screen even if its intended door is blocked.
    // Only the registered z6 opening enters the office/meditation chapel.
    for(const capZ of [3,screenEnd+1])for(let x=screenX+1;x<=width-2;x++)
      for(let y=2;y<=4;y++)put(x,y,capZ,m.trim,'wall');
    const roomUse='counting-office';
    supplementalRooms.push({name:'Merchant counting office',
      bounds:{x0:screenX+1,x1:width-2,z0:4,z1:screenEnd},uses:[roomUse]});
    supplementalCirculation.push({from:'sales-floor',to:roomUse,
      via:`three-high east side opening x${screenX},z${doorZ}`});
    supplementalOpenings.push({type:'internal-doorway',role:'auxiliary-room',roomUse,
      x:screenX,y:2,z:doorZ,clearHeightCells:3});
    put(width-3,2,7,FIXTURE.counter,'fixture');
  }else if(size==='large'){
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
  // General-store storefront lintel, roof and sign.
    // Stores have a lower storefront lintel and hanging sign, but no sanctuary towers.
    for(let x=center-2;x<=center+2;x++)put(x,top+1,0,m.trim,'roof');
    if(size!=='small')put(center,top+2,0,'pack4:060','decor');
    if(size==='large')for(let z=depth-4;z<depth-1;z++)if(footprint(2,z)){
      put(2,top+1,z,m.trim,'roof');put(2,top+2,z,m.roof,'roof');
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
  const rooms=[
   {name:'Customer hall',bounds:{x0:1,x1:width-2,z0:1,z1:partition-1},uses:['sales-floor','service-counter','display-shelves']},
   {name:'Rear stockroom',bounds:{x0:1,x1:width-2,z0:partition+1,z1:depth-2},uses:['storage']}
  ];
  const circulation=[
   {from:'exterior',to:'sales-floor',via:`front x${center} triple-head clearance`},
   {from:'sales-floor',to:'storage',via:`offset doorway x${openingX} at z${partition}`}
  ];
  const refs=[...new Set(voxels.map(v=>v.material).concat([entry.doorSymbol]))];
  const roofNames={temperate:'cross-beam timber gable',desert:'open courtyard shaded flat terraces',snow:'steep double-insulated ridge', 'enchanted-forest':'grown stepped livingwood spires', mountain:'cliff-terrace stone roof progression'};
  const blueprint={schema:SCHEMA,
   id:`r2:${category}:${biome}:${size}:01`,category,biome,size,variation:1,
    title:`${({temperate:'Hearth',desert:'Sunveil',snow:'Frostward','enchanted-forest':'Whisperbloom',mountain:'Highcrag'})[biome]} Exchange — ${size}`,
   status:'authored-candidate',isolated:true,worldPlaced:false,numericIdsAssigned:false,
   extents,units:'conceptual occupied voxels; shape/rotation ABI unresolved',
   architecturalSignature:`${roofNames[biome]}, ${category}, ${size}, x${width} z${depth}, partition ${partition}, distinct footprint`,
   roof:{form:roofNames[biome],biomeSpecific:true},
    rooms:[...rooms,...supplementalRooms],features:['counter','display shelves','stockroom crates','real storeroom wall'],
   openings:[entry,...windowOpenings,
    {type:'internal-doorway',x:openingX,y:2,z:partition,clearHeightCells:3},...supplementalOpenings],
   circulation:[...circulation,...supplementalCirculation],
   unresolvedDependencies:refs.map(ref=>({ref,issue:'The physical shape, orientation, collision, support, appearance and save integration of this symbolic roster asset require central ABI verification'})),
   voxels
  };
  validateBlueprint(blueprint);
  return Object.freeze(blueprint);
}
export const M1_GENERAL_STORES=Object.freeze([
  TEMPERATE_SMALL_GENERAL_STORE,
  ...BIOMES.flatMap(biome=>SIZES.flatMap(size=>
    biome==='temperate'&&size==='small'?[]:[build({biome,size})]
  ))
]);
export const M1_COUNTS=Object.freeze({total:M1_GENERAL_STORES.length,stores:M1_GENERAL_STORES.length});
export function checkM1Architectures(){return assertDistinctArchitecture(M1_GENERAL_STORES);}
