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
  'pack1:007': ['candidate','partial','fixed','floor',['half-height landing surface and AABB body-fit','shape-aware selection/collision','candidate ID registration in live world']],
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
      if(!interior(x,z)||z===doorZ||z===entranceZ+3||z===entranceZ+6)continue;
      for(let h=0;h<=2;h++)set(x,ly+h,z,'partition',l%2?'base:wood':'base:stone');
    }
    for(const x of [left,right])if(interior(x,doorZ))openings.push({kind:'door',at:[x,ly,doorZ],facing:x===left?'west':'east'});
  }
  // Each locale's pitched roof is genuinely physical, not a shader-only tint.
  // Raise original asymmetrical skyline while keeping an entire protective top roof deck.
  // Calculate *surface heights* first, without solid-filling the attic.
  // Longitudinal timber purlins carry stepped roof tiles. Each level strip
  // has timber riser piers at its ends and at most four cells apart.
  const raised=new Map(),strips=new Map(),roofSupportRows=new Set();
  for(let z=entranceZ;z<d-2;z++){
    const widthAtRow=footprint.filter(([x,zz])=>zz===z).map(([x])=>x).sort((a,b)=>a-b);
    if(!widthAtRow.length)continue;
    const lo=widthAtRow[0],hi=widthAtRow.at(-1);
    for(let x=lo;x<=hi;x++){
      if(!has(x,z)||!occupied.has(pos(x,roofY,z)))continue;
      let rise=0;
      if(bi===0)rise=Math.max(0,pitch-Math.floor(Math.abs(x-mid)/(si+2)));
      if(bi===1)rise=(x===lo||x===hi||z===entranceZ||z===d-3)?pitch:0;
      if(bi===2)rise=Math.max(0,pitch-Math.floor(Math.abs(x-mid)/(si+1)));
      if(bi===3)rise=Math.max(0,pitch-Math.floor(Math.abs((x-mid)+(Math.floor((z-entranceZ)/5)%3-1))/(si+2)));
      if(bi===4)rise=z>d-8?pitch:(z<entranceZ+5?Math.ceil(pitch/2):1);
      if(!rise)continue;
      raised.set(pos(x,z),rise);
      if(!strips.has(x))strips.set(x,[]);
      strips.get(x).push([z,rise]);
    }
  }
  const supports=new Set();
  for(const [x,entries] of strips){
    entries.sort((a,b)=>a[0]-b[0]);
    let start=0;
    while(start<entries.length){
      let end=start+1;
      while(end<entries.length&&entries[end][0]===entries[end-1][0]+1&&entries[end][1]===entries[start][1])end++;
      for(let i=start;i<end;i++){
        if(i===start||i===end-1||(i-start)%4===0){
          const z=entries[i][0];supports.add(pos(x,z));roofSupportRows.add(z);
        }
      }
      start=end;
    }
  }
  for(const [key,rise] of raised){
    const [x,z]=key.split(',').map(Number),top=roofY+rise;
    if(supports.has(key)){
      del(x,roofY,z);set(x,roofY,z,'column','base:wood');
    }else if(rise===1){
      // A thin candidate roof tile must not carry another roof tile; the
      // lower single-rise layer is a structural, longitudinal purlin.
      del(x,roofY,z);set(x,roofY,z,'beam','base:wood','north');
    }
    for(let y=roofY+1;y<top;y++){
      if(supports.has(key))set(x,y,z,'column','base:wood');
      else if(y===top-1)set(x,y,z,'beam','base:wood','north');
    }
    set(x,top,z,'roof',roofAsset);
  }
  // Vertical seam/fascia cells close the exposed height difference between
  // adjacent sloped roof strips. Interior attic sections stay hollow rather
  // than being a solid stone mountain; no cells enter the open courtyard.
  for(const [key,rise] of raised){
    const [x,z]=key.split(',').map(Number),top=roofY+rise;
    for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
      const nx=x+dx,nz=z+dz;
      const neighborTop=roofY+(raised.get(pos(nx,nz))||0);
      if(neighborTop>=top-1)continue;
      for(let y=neighborTop+1;y<top;y++){
        if(!occupied.has(pos(x,y,z)))set(x,y,z,'wall',wallAsset);
      }
    }
  }
  // Window sockets must expose an ACTUAL exterior face and look through the
  // full wall thickness. The old fixed x=3/w-4 pane often sat behind another
  // wall cell, and a few panes faced a second internal masonry layer.
  // Preserve the original sparse facade rhythm but find the true outer wall.
  for(let z=entranceZ+3;z<d-4;z+=bi===3?5:4){
    for(const [sourceX,outward] of [[3,-1],[w-4,1]]){
      if(!has(sourceX,z)||interior(sourceX,z))continue;
      const source=occupied.get(pos(sourceX,2,z));
      if(source?.role!=='wall')continue;
      const behind=occupied.get(pos(sourceX+outward,2,z));
      const faceX=behind?.role==='wall'?sourceX+outward:sourceX;
      if(occupied.has(pos(faceX+outward,2,z)))continue; // outside must be sky
      if(occupied.get(pos(faceX,1,z))?.role!=='wall'||
         occupied.get(pos(faceX,3,z))?.role!=='wall')continue; // supported socket
      const tunnel=[];let x=faceX-outward,valid=false;
      for(let depth=0;depth<4;depth++,x-=outward){
        const block=occupied.get(pos(x,2,z));
        if(!block){valid=true;break;}
        if(block.role!=='wall'||tunnel.length===2)break;
        tunnel.push(x);
      }
      if(!valid)continue; // never leave a pane with opaque masonry behind it
      del(faceX,2,z);
      for(const ix of tunnel)del(ix,2,z);
      set(faceX,2,z,'window',SYMBOLS.glass,outward<0?'west':'east');
      openings.push({kind:'window',at:[faceX,2,z],facing:outward<0?'west':'east'});
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
    // Castle tower caps are thin candidate roof tiles, not full load-bearing
    // cubes. A flat tower cap over an open shaft needs an actual crosswise
    // beam that joins parapet walls on BOTH sides. Do not suspend roof pieces
    // in space at jagged biome corners when no supported span exists.
    const crownY=roofY+pitch+3+si;
    const anchors=new Set(['parapet','wall','column','beam']);
    const bearingDistance=(x,z,dx,dz)=>{
      for(let n=1;n<=9;n++){
        const nx=x+dx*n,nz=z+dz*n;
        if(!occupied.has(pos(nx,crownY,nz)))return 0;
        if(anchors.has(occupied.get(pos(nx,crownY-1,nz))?.role))return n;
      }
      return 0;
    };
    for(const cap of [...cells].filter(c=>c.role==='roof'&&c.at[1]===crownY)){
      const [x,,z]=cap.at;
      if(occupied.has(pos(x,crownY-1,z)))continue;
      const spanX=bearingDistance(x,z,-1,0)>0&&bearingDistance(x,z,1,0)>0;
      const spanZ=bearingDistance(x,z,0,-1)>0&&bearingDistance(x,z,0,1)>0;
      if(!spanX&&!spanZ){del(x,crownY,z);continue;}
      set(x,crownY-1,z,'beam','base:wood',spanX?'east':'north');
    }
  }
  // Deliberately reserved symbolic rotated partial stairs, directly alongside their rising tread path.
  const stairXs=[mid-2,mid-1,mid,mid+1,mid+2],stairZ=entranceZ+3;
  // Adjacent storeys need separate shafts so raised supporting piers cannot
  // block circulation on the intermediate landing. This is a two-flight core.
  const flightZ=l=>stairZ+(l%2)*3;
  for(let l=0;l<storeys-1;l++){
    const yy=l*4,flightDepth=flightZ(l);
    for(let i=0;i<4;i++){
      const x=stairXs[i],y=yy+i;
      del(x,y,flightDepth);
      if(i>0)del(x,yy+4,flightDepth); // open stair shaft in upper floor
      // A walkable route must also be a real buildable structure. Fill the
      // vertical riser pier beneath each lifted tread, never the walking cell.
      // The ground-level riser rests on the authored pad and future site grade.
      for(let supportY=1;supportY<y;supportY++){
        if(!occupied.has(pos(x,supportY,flightDepth)))
          set(x,supportY,flightDepth,'column','base:stone');
      }
      set(x,y,flightDepth,'stair',SYMBOLS.stair,'east');
    }
    // Upper-floor landing is physically pier-supported rather than floating.
    del(stairXs[4],yy+4,flightDepth);
    for(let supportY=1;supportY<yy+4;supportY++){
      if(!occupied.has(pos(stairXs[4],supportY,flightDepth)))
        set(stairXs[4],supportY,flightDepth,'column','base:stone');
    }
    // Pack 1 lower half-slab bridges the 0.5-block height between the last
    // raised stair surface and the full-height upper floor. Full STONE made
    // this final rise a physically discontinuous 1.0-block lip.
    set(stairXs[4],yy+4,flightDepth,'landing','pack1:007');
  }
  // Real overhead joists below the roof deck prevent unsupported wide roof spans.
  // A joist has full height clearance above the last usable 2-block room envelope;
  // it is only placed across spans anchored by walls at BOTH ends of its run.
  // Desert courts retain an open central sky; no beam crosses a courtyard aperture.
  const joistRows=new Set(roofSupportRows);
  for(let z=front;z<=d-3;z+=3)joistRows.add(z);
  for(const z of [...joistRows].sort((a,b)=>a-b)){
    const row=footprint.filter(([x,zz])=>zz===z&&occupied.has(pos(x,roofY,z))).map(([x])=>x).sort((a,b)=>a-b);
    const spans=[];
    let group=[];
    for(const x of row){
      if(group.length&&x!==group[group.length-1]+1){spans.push(group);group=[];}
      group.push(x);
    }
    if(group.length)spans.push(group);
    for(const span of spans){
      if(span.length<4)continue;
      const [lo,hi]=[span[0],span.at(-1)];
      const left=occupied.get(pos(lo,roofY-1,z));
      const right=occupied.get(pos(hi,roofY-1,z));
      if(left?.role!=='wall'||right?.role!=='wall')continue;
      for(let x=lo+1;x<hi;x++){
        if(!occupied.has(pos(x,roofY,z))||occupied.has(pos(x,roofY-1,z)))continue;
        set(x,roofY-1,z,'beam','base:wood','east');
      }
    }
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
    const [x,y,z]=[stairXs[i],l*4+i+1,flightZ(l)];
    addNav(x,y,z,'stair');
  }
  // Avoid missing a landing when it belongs to a second storey rather than ground-level nav.
  for(let l=1;l<storeys;l++)addNav(stairXs[4],l*4+1,flightZ(l-1),'landing');
  // Utility: make the exact floorplan for each true room, rather than only labeling the outer shell.
  function room(id,kind,level,filter){
    const y=1+4*level;
    const tiles=footprint.filter(([x,z])=>interior(x,z)&&filter(x,z)&&
      occupied.has(pos(x,y-1,z))&&!occupied.has(pos(x,y,z))&&!occupied.has(pos(x,y+1,z)));
    const foot=tiles.filter(([x,z])=>navigation.has(pos(x,y,z)));
    // Room labels must describe ONE coherent floor area: an inner court or
    // irregular biome facade can split a simple rectangular room mask into
    // islands. Choose the largest cardinally connected authored region.
    const candidates=new Map(foot.map(tile=>[tile.join(','),tile]));
    const groups=[];
    while(candidates.size){
      const first=candidates.values().next().value,queue=[first],component=[];
      candidates.delete(first.join(','));
      while(queue.length){
        const tile=queue.pop();component.push(tile);
        for(const [dx,dz] of [[-1,0],[0,-1],[0,1],[1,0]]){
          const key=[tile[0]+dx,tile[1]+dz].join(','),next=candidates.get(key);
          if(next){candidates.delete(key);queue.push(next);}
        }
      }
      groups.push(component);
    }
    groups.sort((a,b)=>b.length-a.length||a[0][0]-b[0][0]||a[0][1]-b[0][1]);
    const contiguous=groups[0]||[];
    if(contiguous.length<2)throw Error('room too small '+[id,type,biome,size]);
    const center=contiguous[Math.floor(contiguous.length/2)];
    spaces.push({id,kind,level:y,access:[center[0],y,center[1]],footprint:contiguous});
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
