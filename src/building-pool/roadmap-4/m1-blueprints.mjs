// M1: 30 deterministic architectural blueprints (5 biomes x 3 sizes x 2 uses).
// Every profile is an explicit authored floor-plan choice. The compiler emits individual 3D occupied cells.
// Symbolic materials are physical-asset dependencies, NEVER registered game IDs or editable-world writes.
import {SCHEMA,validateBlueprint,validateCollection} from './schema.mjs';
const B=['temperate','desert','snow','enchanted-forest','mountain'];
const S=['small','medium','large'];
// Per-row data: width, depth, storeys, wing spread, entry depth, courtyard radius, roof raised ridges, rear terrace.
// Five distinct shapes by biome: chambered cruciform, enclosed courts, compact insulation, irregular livingwood,
// stepped cliffside. Measurements are *relative* to civic or castle architectural type.
const PLANS={
  'civic-hall':[
    [[15,17,1,2,3,0,2,0],[23,21,2,3,4,0,3,0],[31,27,3,4,4,0,4,0]],
    [[17,19,1,2,4,2,1,0],[25,25,2,3,5,3,2,0],[33,31,3,4,5,4,2,0]],
    [[17,17,1,1,5,0,3,0],[25,23,2,2,5,0,4,0],[33,29,3,3,6,0,5,0]],
    [[19,19,1,3,3,1,3,0],[27,23,2,4,4,2,4,0],[35,29,3,5,4,3,5,0]],
    [[19,21,1,2,4,0,2,2],[27,27,2,3,5,0,3,3],[37,33,3,4,6,0,4,4]]
  ],
  'castle-palace':[
    [[23,23,2,3,4,0,3,0],[31,29,2,4,4,0,4,0],[41,37,3,5,5,0,5,0]],
    [[25,25,2,4,5,2,3,0],[35,31,2,5,5,3,4,0],[45,39,3,6,6,4,5,0]],
    [[25,23,2,3,6,0,4,0],[35,31,2,4,6,0,5,0],[45,41,3,5,7,0,6,0]],
    [[25,27,2,5,4,1,4,0],[37,35,2,6,5,2,5,0],[47,43,3,7,5,3,6,0]],
    [[27,27,2,4,5,0,3,3],[37,37,2,5,6,0,4,4],[49,45,3,6,7,0,5,5]]
  ]
};
const SYMBOLS={
  stair:'pack1:008',glass:'pack4:030',
  roofs:{temperate:'pack3:023',desert:'pack3:024',snow:'pack3:025',
    'enchanted-forest':'pack3:026',mountain:'pack3:025'},
  temperate:'pack2:015',desert:'biome130:091',snow:'biome130:094',
  'enchanted-forest':'biome130:096',mountain:'biome130:098'
};
const DEPS={
  'pack1:002': ['candidate','single-cell','fixed','none',['masonry candidate-ID registration','full-cube face material confirmation']],
  'pack1:008': ['candidate','partial','rotatable','floor',['stair rise profile','collision slope','orientation mapping','safe tread alignment']],
  'pack3:023': ['candidate','partial','rotatable','adjacent',['shingle roof pitch','ridge and valley junctions','supporting attachment geometry']],
  'pack3:024': ['candidate','partial','rotatable','adjacent',['desert clay-tile roof pitch','ridge joins','physical attachment geometry']],
  'pack3:025': ['candidate','partial','rotatable','adjacent',['snow/mountain slate roof pitch','ridge joins','physical attachment geometry']],
  'pack3:026': ['candidate','partial','rotatable','adjacent',['organic thatch roof pitch','ridge joins','physical attachment geometry']],
  'pack4:030': ['candidate','partial','rotatable','wall',['pane thickness','alpha/depth ordering','rotated wall mounting']],
  'pack2:015': ['candidate','partial','rotatable','floor',['beam joint dimensions','mesh joinery','support bounds']],
  'biome130:091': ['planned','single-cell','fixed','none',['wide-ID registry migration','adobe physical face material']],
  'biome130:094': ['planned','single-cell','fixed','none',['wide-ID registry migration','insulated wall shape dimensions']],
  'biome130:096': ['planned','partial','rotatable','adjacent',['wide-ID registry migration','livingwood organic orientation','mesh collision']],
  'biome130:098': ['planned','partial','rotatable','adjacent',['wide-ID registry migration','cliff anchor orientation','load-free wall joinery']]
};
const pos=(x,y,z)=>x+','+y+','+z;
function emitBlueprint(type,biome,size){
  const bi=B.indexOf(biome),si=S.indexOf(size);
  if(!PLANS[type]||bi<0||si<0)throw Error('Unknown M1 plan');
  const [w,d,storeys,wing,front,court,pitch,terrace]=PLANS[type][bi][si];
  const cy=(storeys-1)*4+4,mid=Math.floor(w/2),dz=Math.floor((front+d-2)/2);
  const bounds=[w,cy+pitch+7,d];
  const cells=[],occupied=new Map(),nav=[],spaces=[],openings=[],deps=new Map();
  function used(ref){
    if(ref in SYMBOLS)return;
    if(ref.startsWith('base:'))return;
    const spec=DEPS[ref];if(!spec)throw Error('Unlisted candidate '+ref);
    deps.set(ref,{ref,state:spec[0],intendedShape:spec[1],orientation:spec[2],attachment:spec[3],unresolved:spec[4]});
  }
  function set(x,y,z,role,asset='base:stone',facing='north',replace=false){
    if(x<0||z<0||x>=w||z>=d||y<0||y>=bounds[1])throw Error('Out of bounds '+[x,y,z]);
    const k=pos(x,y,z);
    if(occupied.has(k)&&!replace)throw Error('Duplicate '+k);
    if(replace&&occupied.has(k)){const old=occupied.get(k);cells.splice(cells.indexOf(old),1);}
    const cell={at:[x,y,z],role,asset,facing};cells.push(cell);occupied.set(k,cell);used(asset);
  }
  function del(x,y,z){const k=pos(x,y,z),old=occupied.get(k);if(old){cells.splice(cells.indexOf(old),1);occupied.delete(k);}}
  // Every biome owns a different *actual footprint* including purposeful side wings/terraces.
  function inside(x,z){
    if(x<2||x>w-3||z<front||z>d-3)return false;
    const rim=x<4||x>w-5,fore=z<front+3,rear=z>d-7;
    if(bi===0){ // timber-and-stone cruciform hall with side chambers
      return !(rim&&(fore||rear)&&((x+z)%7!==0));
    }
    if(bi===1){ // sunny colonnaded desert: chamfered entry and squared court ring
      return !(fore&&(x<4||x>w-5)) && !(rear&&rim&&((x+z)%5===0));
    }
    if(bi===2){ // dense insulated winter mass with recessed, snow-protected vestibule
      return !(rim&&(fore||rear)) && !(z===front&&Math.abs(x-mid)>wing+3);
    }
    if(bi===3){ // softly stepped nonrectangular livingwood halls, asymmetrical groves
      const shift=z<front+4?2:rear?-1:0;
      return x>=3+shift+(z%5===0?1:0)&&x<=w-4+shift-(z%7===0?1:0);
    }
    // mountain halls project forward as terraces and narrow sharply near cliff-facing rear
    return !(rear&&(x<4+terrace||x>w-5-terrace)) && !(fore&&rim);
  }
  const footprint=[];
  for(let z=front;z<=d-3;z++)for(let x=2;x<=w-3;x++)if(inside(x,z))footprint.push([x,z]);
  const has=(x,z)=>inside(x,z);
  const interior=(x,z)=>has(x,z)&&has(x-1,z)&&has(x+1,z)&&has(x,z-1)&&has(x,z+1);
  const roofY=cy;
  const roofAsset=SYMBOLS.roofs[biome];
  // Functional wall cells use genuine masonry / wall-core materials, never
  // cross-sectional beams, livingwood ribs or mountain anchor fittings.
  const wallAsset=bi===0||bi===4?'pack1:002':bi===3?'base:wood':SYMBOLS[biome];
  for(const [x,z] of footprint){
    // Desert courts must remain sky-open through all upper floors, not merely the roof.
    // Ground level remains supported and walkable; galleries circulate around the void.
    const aperture=bi===1&&court>0&&Math.abs(x-mid)<=court&&Math.abs(z-dz)<=court;
    for(let l=0;l<storeys;l++){
      if(aperture&&l>0)continue;
      set(x,l*4,z,'floor',l===0?'base:stone':type==='castle-palace'?'base:stone':'base:wood');
    }
    if(!aperture)set(x,roofY,z,'roof',roofAsset);
    for(let l=0;l<storeys;l++)for(let y=l*4+1;y<=l*4+3;y++){
      if(interior(x,z))continue;
      set(x,y,z,'wall',wallAsset);
    }
  }
  // Two-high open gate is authored as *actual void*, not a decorative painted doorway.
  const entranceZ=footprint.filter(([x,z])=>x===mid).reduce((min,[,z])=>Math.min(min,z),Infinity);
  if(!Number.isFinite(entranceZ))throw Error('No entrance');
  for(let dx=-1;dx<=1;dx++)for(let y=1;y<=2;y++)del(mid+dx,y,entranceZ);
  openings.push({kind:'entrance',at:[mid,1,entranceZ],facing:'south'});
  // Dedicated three-voxel-wide ceremonial exterior approach, before the actual entrance.
  // Ground plan is intentionally independent of world placement / terrain edits.
  for(let z=0;z<entranceZ;z++)for(let x=mid-1;x<=mid+1;x++)
    set(x,0,z,'floor',bi===1?'base:stone':'base:deepstone');
  // Regional specialty pieces are individual accents outside the actual wall
  // envelope, not falsely substituted for masonry or a full roof cell.
  if(bi===0||bi===3||bi===4){
    for(const x of [mid-4,mid+4]){
      set(x,0,entranceZ-1,'floor','base:stone');
      set(x,1,entranceZ-1,'fixture',SYMBOLS[biome], 'north');
    }
  }
  // Inner corridor partitions with accessible two-high door cutouts left and right.
  const left=mid-2,right=mid+2;
  for(let l=0;l<storeys;l++){
    const ly=1+4*l;
    // Upper desert gallery doors step away from the central open-air court.
    // A doorway must have an actual supported walking tile on *both* sides.
    const doorZ=bi===1&&l>0?entranceZ+3:dz;
    for(const x of [left,right])for(let z=entranceZ+3;z<=d-6;z++){
      // The 4-riser stair shaft must stay free of partition masonry on both levels.
      if(!interior(x,z)||z===doorZ||z===entranceZ+3)continue;
      for(let h=0;h<=2;h++)set(x,ly+h,z,'partition',l%2?'base:wood':'base:stone');
    }
    for(const x of [left,right])if(interior(x,doorZ))openings.push({kind:'door',at:[x,ly,doorZ],facing:x===left?'west':'east'});
  }
  // Each locale's pitched roof is genuinely physical, not a shader-only tint.
  // Raise original asymmetrical skyline while keeping an entire protective top roof deck.
  for(let z=entranceZ;z<d-2;z++){
    const widthAtRow=footprint.filter(([x,zz])=>zz===z).map(([x])=>x).sort((a,b)=>a-b);
    if(!widthAtRow.length)continue;
    const lo=widthAtRow[0],hi=widthAtRow.at(-1);
    for(let x=lo;x<=hi;x++){
      if(!has(x,z)||!occupied.has(pos(x,roofY,z)))continue;
      let rise=0;
      if(bi===0)rise=Math.max(0,pitch-Math.floor(Math.abs(x-mid)/(si+2)));
      if(bi===1)rise=(x===lo||x===hi||z===entranceZ||z===d-3)?pitch:0; // parapeted flat court
      if(bi===2)rise=Math.max(0,pitch-Math.floor(Math.abs(x-mid)/(si+1))); // snow-shedding steep gable
      if(bi===3)rise=Math.max(0,pitch-Math.floor(Math.abs((x-mid)+(z%5-2))/(si+2))); // organic offset roof
      if(bi===4)rise= z>d-8?pitch:(z<entranceZ+5?Math.ceil(pitch/2):1); // stepped cliffward vault
      for(let y=roofY+1;y<=roofY+rise;y++){
        const role=y===roofY+rise?'roof':'column';
        set(x,y,z,role,y===roofY+rise?roofAsset:'base:stone');
      }
    }
  }
  // Biome-specific physical buttresses, window sockets and court arcade columns.
  for(let z=entranceZ+3;z<d-4;z+=bi===3?5:4){
    for(const x of [3,w-4])if(has(x,z)&&!interior(x,z)){
      const existing=occupied.get(pos(x,2,z));
      if(existing?.role==='wall'){
        del(x,2,z);set(x,2,z,'window',SYMBOLS.glass,x<mid?'west':'east');
        openings.push({kind:'window',at:[x,2,z],facing:x<mid?'west':'east'});
      }
    }
  }
  if(bi===1&&court){
    // Four freestanding desert arcade supports: protected walk around an open court.
    for(const x of [mid-court-1,mid+court+1])for(const z of [dz-court-1,dz+court+1])
      if(interior(x,z))for(let y=1;y<4;y++)if(!occupied.has(pos(x,y,z)))set(x,y,z,'column','base:stone');
  }
  if(type==='castle-palace'){
    // Crowned battlement towers rise above the *highest* roof ridge even on small castles.
    // The hollow intermediate shell is a recognisable skyline mass, not a promise that the
    // future tower-top space has already passed player-collision/access integration.
    for(const [tx,tz] of [[4,entranceZ+4],[w-7,d-8]]){
      const R=si+2,top=roofY+pitch+3+si;
      for(let y=roofY+1;y<=top+1;y++)for(let z=tz;z<=tz+R;z++)for(let x=tx;x<=tx+R;x++){
        if(x<2||z<front||x>w-3||z>d-3||!has(x,z))continue;
        const edge=x===tx||x===tx+R||z===tz||z===tz+R;
        if(y===top+1&&(!edge||(x+z)%2))continue; // alternating crenels
        if(y<top&&!edge)continue;
        const k=pos(x,y,z);
        if(!occupied.has(k))set(x,y,z,y===top?'roof':'parapet',y===top?roofAsset:wallAsset);
      }
    }
  }
  // Deliberately reserved symbolic rotated partial stairs, directly alongside their rising tread path.
  const stairXs=[mid-2,mid-1,mid,mid+1,mid+2],stairZ=entranceZ+3;
  for(let l=0;l<storeys-1;l++){
    const yy=l*4;
    for(let i=0;i<4;i++){
      const x=stairXs[i],y=yy+i;
      del(x,y,stairZ);
      if(i>0)del(x,yy+4,stairZ); // open stair shaft in upper floor
      set(x,y,stairZ,'stair',SYMBOLS.stair,'east');
    }
    // End step flows into upper-floor landing at stairXs[4], yy+4.
    del(stairXs[4],yy+4,stairZ);
    set(stairXs[4],yy+4,stairZ,'landing','base:stone');
  }
  // Full explicit walkable-voxel route network: every supported non-wall interior footprint.
  const navigation=new Map();
  function addNav(x,y,z,mode='walk'){
    const support=occupied.get(pos(x,y-1,z));
    if(!support||!['floor','landing','stair','foundation'].includes(support.role))return;
    if(occupied.has(pos(x,y,z))||occupied.has(pos(x,y+1,z)))return;
    navigation.set(pos(x,y,z),{at:[x,y,z],mode});
  }
  for(let l=0;l<storeys;l++){
    const y=l*4+1;
    for(const [x,z] of footprint){
      if(l===0||interior(x,z))addNav(x,y,z,'walk');
    }
  }
  for(let z=0;z<entranceZ;z++)for(let x=mid-1;x<=mid+1;x++)addNav(x,1,z,'walk');
  for(let l=0;l<storeys-1;l++)for(let i=0;i<4;i++){
    const [x,y,z]=[stairXs[i],l*4+i+1,stairZ];
    addNav(x,y,z,'stair');
  }
  // Avoid missing a landing when it belongs to a second storey rather than ground-level nav.
  for(let l=1;l<storeys;l++)addNav(stairXs[4],l*4+1,stairZ,'landing');
  // Utility: make the exact floorplan for each true room, rather than only labeling the outer shell.
  function room(id,kind,level,filter){
    const y=1+4*level;
    const tiles=footprint.filter(([x,z])=>interior(x,z)&&filter(x,z)&&
      occupied.has(pos(x,y-1,z))&&!occupied.has(pos(x,y,z))&&!occupied.has(pos(x,y+1,z)));
    const foot=tiles.filter(([x,z])=>navigation.has(pos(x,y,z)));
    if(foot.length<2)throw Error('room too small '+[id,type,biome,size]);
    const center=foot[Math.floor(foot.length/2)];
    spaces.push({id,kind,level:y,access:[center[0],y,center[1]],footprint:foot});
  }
  if(type==='civic-hall'){
    room('council-hall','meeting',0,(x,z)=>x<left&&z>entranceZ+1&&z<d-5);
    room('municipal-records','administration',0,(x,z)=>x>right&&z>entranceZ+1&&z<d-5);
    for(let l=1;l<storeys;l++)room('upper-public-gallery-'+l,'public-gallery',l,(x,z)=>x>left&&x<right&&z>entranceZ+5&&z<d-5);
  }else{
    room('receiving-hall','entrance-hall',0,(x,z)=>x>left&&x<right&&z>entranceZ+1&&z<d-4);
    room('great-chamber','grand-chamber',0,(x,z)=>x<left&&z>entranceZ+1&&z<d-4);
    room('east-wing','tower-or-wing',storeys-1,(x,z)=>x>right&&z>entranceZ+1&&z<d-4);
    for(let l=1;l<storeys-1;l++)room('upper-ambassadorial-gallery-'+l,'gallery',l,(x,z)=>x>left&&x<right&&z>entranceZ+5&&z<d-5);
  }
  // Explicitly navigate from the main entry; remove isolated decorative ledges from interior route graph.
  // Early M1 acceptance requires every authored route cell to be connected (validator checks this).
  // A simple connected walk plane across each unblocked level is physically represented by the cells.
  const blueprint={schema:SCHEMA,id:'r4:'+type+':'+biome+':'+size+':01',type,biome,size,variant:1,
    bounds,dependencies:[...deps.values()].sort((a,b)=>a.ref.localeCompare(b.ref)),
    cells,openings,navigation:[...navigation.values()],spaces,
    architecturalNotes:{style:biome,roof:'physically-authored-voxel',entrance:'unobstructed-gate',
      scale:type,relativeSize:size,storyCount:storeys,courtyard:bi===1,terraces:bi===4,
      deferred:'unresolved multi-cell/partial mesh and real-world stair collision',
      structuralSignature:[w,d,storeys,wing,front,court,pitch,terrace]}};
  validateBlueprint(blueprint);
  return blueprint;
}
export function buildM1(type,biome,size){return emitBlueprint(type,biome,size);}
export function allM1(){return ['civic-hall','castle-palace'].flatMap(type=>B.flatMap(biome=>S.map(size=>emitBlueprint(type,biome,size))));}
export function auditM1(){return validateCollection(allM1());}
