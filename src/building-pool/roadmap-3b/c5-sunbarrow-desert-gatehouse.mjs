// C-owned original desert 3-wide caravan gatehouse, NOT a Twinstone copy.
// No runtime world placement, power mechanics, NPC AI or schema changes.
import {assertSlot} from './roster.mjs';
import {ASSET_CATALOG} from './assets.mjs';
import {validateBlueprint} from './contract.mjs';
import {validateGatehouseTopology} from './fortification-topology.mjs';

const B=(x,y,z,width,height,depth)=>({x,y,z,width,height,depth});
const K=(x,y,z)=>x+','+y+','+z,F=(x,z)=>x+','+z;
const fill=(set,a,b,c,d)=>{for(let x=a;x<=b;x++)for(let z=c;z<=d;z++)set.add(F(x,z));};
export function createCSunbarrowCaravanGatehouse(){
 const id=assertSlot('gatehouse','desert','small',1);
 const W=39,D=34,H=17,ground=new Set(),cells=new Map(),mods=new Map();
 // Triple-wide 34-cell-long wagon throat, unequal offset guard wings,
 // and two real missing-foundation desert cooling courts.
 for(const p of [[17,19,0,33],[2,16,3,22],[20,36,7,30],
  [9,16,23,29],[11,22,29,33],[14,22,9,10],[14,22,23,24]])fill(ground,...p);
 let absent=0;
 for(const [a,b,c,d] of [[5,7,13,15],[29,31,19,21]])
  for(let x=a;x<=b;x++)for(let z=c;z<=d;z++)
   if(ground.delete(F(x,z)))absent++;
 if(absent!==18)throw Error(id+' source-groundless cooling courts missing');
 const has=(x,z)=>ground.has(F(x,z));
 const corridor=[
  B(17,2,0,3,3,34),B(10,2,9,19,3,2),B(10,2,23,19,3,2),
  B(8,2,5,8,3,6),B(23,2,11,11,3,5),
  B(8,2,21,9,3,4),B(23,2,23,11,3,4),
  B(13,2,25,2,3,1),
  ...Array.from({length:5},(_,i)=>B(13,3+i,26+i,2,3,1)),
  B(13,7,31,2,3,1)
 ];
 const clear=(x,y,z)=>corridor.some(p=>x>=p.x&&x<p.x+p.width&&
  y>=p.y&&y<p.y+p.height&&z>=p.z&&z<p.z+p.depth);
 const stairFoot=(x,z)=>x>=13&&x<=14&&z>=26&&z<=30;
 function put(role,x,y,z,ref,force=false){
  if(!has(x,z)||x<0||z<0||y<0||x>=W||z>=D||y>=H)
   throw Error(id+' ungrounded source '+K(x,y,z));
  if(!Object.hasOwn(ASSET_CATALOG,ref))throw Error(id+' unknown source family '+ref);
  if(!force&&role!=='foundation'&&role!=='floor'&&clear(x,y,z))return false;
  const key=K(x,y,z);if(cells.has(key))throw Error(id+' overlapping source '+key);
  cells.set(key,role);
  if(!mods.has(role))mods.set(role,[]);
  mods.get(role).push([x,y,z,ref]);return true;
 }
 for(const p of ground){
  const [x,z]=p.split(',').map(Number);
  put('foundation',x,0,z,'builtin:stone');
  put('floor',x,1,z,'pack1:007');
 }
 for(const p of ground){
  const [x,z]=p.split(',').map(Number);
  if(stairFoot(x,z))continue;
  const boundary=[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dz])=>!has(x+dx,z+dz));
  if(boundary||(x===16||x===20)&&z>=3&&z<=30)
   for(let y=2;y<=5;y++)put('wall',x,y,z,'pack1:002');
 }
 // Authentic y=5 overhead masonry at the gate mid-span, supported by BOTH
 // four-high x16 and x20 source walls.
 for(const z of [10,17,24])for(let x=17;x<=19;x++)
  put('gate-arch',x,5,z,'pack3:069');
 for(const p of ground){
  const [x,z]=p.split(',').map(Number);
  if(stairFoot(x,z))continue;
  put('roof',x,6,z,x<=16&&z<=22?'pack3:025':'pack3:069');
 }
 // Unequal corner tower masses rising directly from actual source roof decks.
 for(const [a,b,c,d,lastY] of [[3,5,4,6,9],[32,34,8,11,10],
  [4,7,18,21,8],[33,35,26,28,11]]){
  for(let x=a;x<=b;x++)for(let z=c;z<=d;z++)
   if(has(x,z)&&(x===a||x===b||z===c||z===d))
    for(let y=7;y<=lastY;y++)put('bastion',x,y,z,'pack3:070');
 }
 // Five real 2-wide rising treads, with each higher step anchored to
 // literal stone undercolumns and a truly unobstructed head clearance.
 for(let i=0;i<5;i++)for(let x=13;x<=14;x++){
  const z=26+i,top=2+i;
  for(let y=2;y<top;y++)put('stair-support',x,y,z,'pack1:002',true);
  put('stair',x,top,z,'pack1:008',true);
 }
 for(const [x,z,ref] of [[6,8,'pack4:057'],[34,18,'pack4:057'],
  [6,19,'pack4:056'],[35,27,'pack4:056']])
  put('equipment',x,2,z,ref);
 const n=(id,x,y,z)=>({id,x,y,z,width:2,headroom:3});
 const nodes=[
  n('north-approach',17,2,0),n('north-gallery',17,2,9),
  n('west-census',10,2,9),n('east-sentry',24,2,9),
  n('south-gallery',17,2,23),n('west-supply',10,2,23),
  n('east-watch',24,2,23),n('southern-exit',17,2,33),
  n('stair-foot',13,2,25),
  ...Array.from({length:5},(_,i)=>n('stair-'+(i+1),13,3+i,26+i)),
  n('rampart-landing',13,7,31)
 ];
 const links=[
  ['north-approach','north-gallery','level'],
  ['north-gallery','west-census','level'],['north-gallery','east-sentry','level'],
  ['north-gallery','south-gallery','level'],['south-gallery','west-supply','level'],
  ['south-gallery','east-watch','level'],['south-gallery','southern-exit','level'],
  ['south-gallery','stair-foot','level'],['stair-foot','stair-1','stair'],
  ...Array.from({length:4},(_,i)=>['stair-'+(i+1),'stair-'+(i+2),'stair']),
  ['stair-5','rampart-landing','level']
 ].map(([from,to,kind])=>({from,to,kind}));
 const room=(id,kind,accessNode,x,y,z,width=2,depth=1)=>
  ({id,kind,accessNode,bounds:B(x,y,z,width,3,depth)});
 const b={
  id,type:'gatehouse',biome:'desert',size:'small',variant:1,
  status:'theoretical',activated:false,envelope:B(0,0,0,W,H,D),
  modules:[...mods].map(([role,cells])=>({id:'sunbarrow-'+role,role,cells})),
  clearances:corridor,
  openings:[
   {id:'north-wagon-road',facing:'north',x:17,y:2,z:0,width:3,height:3},
   {id:'south-wagon-road',facing:'south',x:17,y:2,z:33,width:3,height:3}
  ],
  spaces:[
   room('unobstructed-34-long-caravan-road','gateway','north-approach',17,2,0,3,34),
   room('west-census-guardroom','guardroom','west-census',10,2,9),
   room('east-arms-guardroom','guardroom','east-sentry',24,2,9),
   room('west-trade-supply','storage','west-supply',10,2,23),
   room('east-outpost','guardroom','east-watch',24,2,23),
   room('rising-guard-deck','battlement','rampart-landing',13,7,31),
   room('southern-exterior-exit','gateway','southern-exit',17,2,33,3,1)
  ],
  navigation:{entry:'north-approach',nodes,edges:links},
  fortification:{
   gateRoute:{axis:'z',floorY:2,width:3,height:3,
    points:Array.from({length:34},(_,z)=>[17,z])},
   rampartSockets:[{x:13,y:7,z:31,kind:'upper-defended-walk'},
    {x:17,y:7,z:17,kind:'triple-arch-top'}],
   roadSockets:[{x:17,z:0,facing:'north',width:3},{x:17,z:33,facing:'south',width:3}],
   coolingCourts:[{x0:5,x1:7,z0:13,z1:15},{x0:29,x1:31,z0:19,z1:21}],
   originalForm:'triple-wide long caravan corridor with two offset asymmetrical desert guard courts'
  },
  features:[
   {name:'unpowered three-wide caravan gate socket',position:[17,2,17],assetRef:null,
    unresolvedDependency:'Future Pack5 gate/portcullis producer, not yet installed'},
   {name:'real absence of cooled courtyard source',position:[6,2,14],assetRef:null,
    unresolvedDependency:'Terrain, support and collision must be reviewed before placement'},
   {name:'upper rampart guard',position:[13,7,31],assetRef:'pack3:069',unresolvedDependency:null}
  ],
  architecture:{title:'Sunbarrow Caravan Gate — sunshade bastions and triple-wide portal',
   originalSource:true,carriageWidth:3,carriageLength:34,trueCourtyardVoids:18,
   creatorAccepted:false,gameRegistered:false,physicalProducerCertified:false},
  dependencies:['pack1:002','pack1:007','pack1:008','pack3:025','pack3:069',
   'pack3:070','pack4:056','pack4:057','Manual Pack full producer physical AABB, support and yaw unresolved'],
  implementation:'ROADMAP-C-C5-DESERT-CARAVAN-GATE-SOURCE-ONLY-NO-PLACEMENT'
 };
 validateBlueprint(b,ASSET_CATALOG);
 validateGatehouseTopology(b);
 return b;
}
export function createCSunbarrowCaravanGatehousePool(){return [createCSunbarrowCaravanGatehouse()];}
