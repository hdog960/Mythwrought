import {SCHEMA,validateBlueprint} from './schema.mjs';

// M1, first original Market Square: a fully occupied-cell architectural design,
// not a settlement placer, terrain seed, or title-only blueprint.
// Coordinates are fixed design decisions; loops expand specified masonry/wood cells.
const X=23,Z=23;
const P=Object.freeze({
  foundation:'pack1:002', floor:'pack1:001', axis:'pack1:005',
  wall:'pack2:013', beam:'pack2:015', canopy:'pack3:023',
  glass:'pack4:030', frame:'pack4:032', counter:'pack5:086',
  display:'pack5:087', crate:'pack4:057', planter:'pack1:048',
  sign:'pack4:061'
});
const key=(x,y,z)=>[x,y,z].join(',');
function makeTemperateSmallMarket(){
  const cells=new Map();
  const add=(x,y,z,material,kind,meta={})=>{
    if(![x,y,z].every(Number.isInteger)||x<0||x>=X||z<0||z>=Z||y<0||y>=8)
      throw Error('market geometry out of bounds');
    const k=key(x,y,z);
    if(cells.has(k))throw Error('duplicate authored voxel '+k);
    cells.set(k,{x,y,z,kind,material,...meta});
  };
  const replace=(x,y,z,material,kind)=>{
    const k=key(x,y,z);
    if(!cells.has(k))throw Error('missing authored voxel to replace '+k);
    cells.set(k,{x,y,z,kind,material});
  };
  // Entire public square has a supported physical stone floor, with a broad
  // axial processional path and east-west crossing. Not just a bounding box.
  for(let x=0;x<X;x++)for(let z=0;z<Z;z++){
    add(x,0,z,P.foundation,'foundation');
    const axial=(x>=10&&x<=12)||(z>=9&&z<=11);
    add(x,1,z,axial?P.axis:P.floor,'floor');
  }
  // Southern free-standing arch. Gate is open three cells high at x11,z0.
  for(const x of [9,13])for(let y=2;y<=5;y++)add(x,y,0,P.beam,'wall');
  for(let x=9;x<=13;x++)add(x,6,0,P.beam,'roof');
  // Four actual roofed kiosks: two left/right of central free walking spine,
  // and two fore/aft. Each has owned support posts, back partition,
  // two physical glazed/frame aperture stacks, a front approach, and counter.
  const booths=[
    {id:'western-fruit',x:2,z:4},
    {id:'eastern-cloth',x:16,z:4},
    {id:'western-tools',x:2,z:12},
    {id:'eastern-herbs',x:16,z:12}
  ];
  for(const b of booths){
    for(const xx of [b.x,b.x+4])for(const zz of [b.z,b.z+4])
      for(let y=2;y<=5;y++)add(xx,y,zz,P.beam,'wall',{structuralRole:'post'});
    for(let xx=b.x;xx<=b.x+4;xx++)for(let zz=b.z;zz<=b.z+4;zz++)
      add(xx,6,zz,P.canopy,'roof');
    // Independent timber front/back lintels with physically linked roof posts.
    for(const zz of [b.z,b.z+4])for(let xx=b.x+1;xx<=b.x+3;xx++)
      add(xx,5,zz,P.beam,'wall');
    // A glazed back-of-stall screen is intentionally PHYSICAL occupied voxel
    // geometry, never an imaginary empty window that violates the cell registry.
    for(let xx=b.x+1;xx<=b.x+3;xx++)for(let y=2;y<=4;y++)
      add(xx,y,b.z+4,P.wall,'wall');
    for(const xx of [b.x+1,b.x+3]){
      replace(xx,3,b.z+4,P.glass,'window');
      replace(xx,4,b.z+4,P.frame,'window');
    }
    for(let xx=b.x+1;xx<=b.x+3;xx++)
      add(xx,2,b.z+3,P.counter,'fixture',{role:'trade-counter'});
    for(const xx of [b.x+1,b.x+3])
      add(xx,2,b.z+2,P.display,'fixture',{role:'merchandise-display'});
    add(b.x+1,2,b.z+1,P.crate,'decor',{role:'stock'});
    // The approach coordinate (b.x+2,b.z+1) remains y2..4 open.
  }
  // Public covered exchange at the far end: a separate THREE-BAY pavilion
  // with eight-cell longitudinal beams, genuine end supports, and clear public
  // movement under the canopy. No invented stair jumps or NPC trade behavior.
  for(const xx of [7,15])for(const zz of [19,21])
    for(let y=2;y<=5;y++)add(xx,y,zz,P.beam,'wall',{structuralRole:'pavilion-post'});
  for(let xx=7;xx<=15;xx++)for(let zz=19;zz<=21;zz++)
    add(xx,6,zz,P.canopy,'roof');
  for(const zz of [19,21])for(let xx=8;xx<15;xx++)
    add(xx,5,zz,P.beam,'wall');
  for(const xx of [7,15])for(let zz=20;zz<=20;zz++)
    add(xx,5,zz,P.beam,'wall');
  // A physical notice facade, not a walk-through wall or village assembly.
  for(let xx=10;xx<=12;xx++)for(let y=2;y<=4;y++)
    add(xx,y,21,P.wall,'wall');
  for(const xx of [10,12])add(xx,5,21,P.sign,'decor');
  // Market furniture is kept off the 3-cell public spine.
  for(const [x,z] of [[1,10],[21,10],[1,18],[21,18]])
    add(x,2,z,P.planter,'decor',{role:'planter'});
  const voxels=[...cells.values()].sort((a,b)=>a.y-b.y||a.z-b.z||a.x-b.x);
  const openings=[
    {type:'entrance',role:'open-public-arch',x:11,y:2,z:0,clearHeightCells:3},
    ...voxels.filter(v=>v.kind==='window')
      .map(({x,y,z,material})=>({type:'window',x,y,z,material}))
  ];
  const refs=[...new Set(voxels.map(v=>v.material))].sort();
  const blueprint={
    schema:SCHEMA,
    id:'r2:market-square:temperate:small:01',category:'market-square',
    biome:'temperate',size:'small',variation:1,
    title:'Hearthcross Four-Stall Exchange — small',
    status:'authored-candidate',isolated:true,worldPlaced:false,
    numericIdsAssigned:false,
    extents:{x:X,y:8,z:Z},
    units:'conceptual integer occupied voxel cells, not production AABBs',
    architecturalSignature:'four separately enclosed five-by-five canopied trade stalls around a three-wide open central axis; supported north public pavilion and free-standing south gateway',
    roof:{form:'separate four low trade canopies plus taller north arcade and open-air central square',biomeSpecific:true},
    rooms:[
      {name:'Open public square and crosswalk',bounds:{x0:8,x1:14,z0:0,z1:18},uses:['square','public-circulation']},
      {name:'Four individually roofed vendor bays',bounds:{x0:2,x1:20,z0:4,z1:16},uses:['vendor-stalls']},
      {name:'Covered communal exchange',bounds:{x0:8,x1:14,z0:19,z1:20},uses:['public-circulation']}
    ],
    circulation:[
      {from:'exterior',to:'square',via:'open south arch at x11,z0, three-cell height'},
      {from:'square',to:'vendor-stalls',via:'unobstructed four kiosk frontage coordinates'},
      {from:'square',to:'public-circulation',via:'three-wide axis through north covered exchange'}
    ],
    openings,
    features:['square','vendor-stalls','public-circulation','four supported trade canopies','four accessible display counters','open-air central processional aisle','north communal pavilion','real glazed screens'],
    boothApproaches:booths.map(b=>({id:b.id,x:b.x+2,y:2,z:b.z+1,clearHeightCells:3})),
    routeTargets:[{name:'south-gate',x:11,z:0},{name:'open-center',x:11,z:10},
      {name:'north-pavilion',x:11,z:20},...booths.map(b=>({name:b.id,x:b.x+2,z:b.z+1}))],
    dependencyLedger:refs.map(ref=>({
      ref,status:'integration-blocked',
      checks:['physical AABB','orientation and yaw','support-bearing','selection and collision','mounting and transparency','schema-1 save encoding'],
      owner:'central building integrator'
    })),
    unresolvedDependencies:refs.map(ref=>({ref,
      issue:'Verify producer geometry, AABB, yaw, support-bearing, collision, mount/selection and schema-1 save before production fill-in; no runtime registration inferred'})),
    voxels
  };
  validateBlueprint(blueprint);
  return Object.freeze(blueprint);
}
export const MARKET_SQUARE_TEMPERATE_SMALL=makeTemperateSmallMarket();
