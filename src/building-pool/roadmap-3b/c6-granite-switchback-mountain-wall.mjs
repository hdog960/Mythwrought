// Roadmap C C6 original mountain escarpment polygonal closed wall.
// Source only: no placement, saves, AI, mechanized gate, runtime registration.
import {assertSlot} from './roster.mjs';
import {ASSET_CATALOG} from './assets.mjs';
import {validateBlueprint} from './contract.mjs';
import {validateCityWallTopology} from './fortification-topology.mjs';
const B=(x,y,z,width,height,depth)=>({x,y,z,width,height,depth});
const F=(x,z)=>x+','+z,K=(x,y,z)=>x+','+y+','+z;
export function createCGraniteSwitchbackCityWall(){
 const id=assertSlot('city-wall','mountain','small',1),W=54,D=53,H=18;
 const foot=new Set(),occupied=new Map(),modules=new Map();
 const addFoot=(x,z)=>{if(x<0||z<0||x>=W||z>=D)throw Error(id+' footprint outside bounds');foot.add(F(x,z));};
 const rect=(a,b,c,d,fn)=>{for(let x=a;x<=b;x++)for(let z=c;z<=d;z++)fn(x,z);};
 // Eight non-intersecting orthogonal escarpment segments, not Fourwatch square.
 const vertices=[[4,4],[44,4],[44,14],[49,14],[49,42],[36,42],[36,47],[4,47],[4,4]];
 const ring=[];
 for(let i=1;i<vertices.length;i++){
  const [x,z]=vertices[i-1],[xx,zz]=vertices[i],dx=Math.sign(xx-x),dz=Math.sign(zz-z);
  for(let t=0;t<Math.abs(xx-x)+Math.abs(zz-z);t++)ring.push([x+t*dx,z+t*dz]);
 }
 if(ring.length!==176||new Set(ring.map(([x,z])=>F(x,z))).size!==ring.length)throw Error('non-closed source wall');
 for(const [x,z] of ring)for(let xx=-1;xx<=1;xx++)for(let zz=-1;zz<=1;zz++)addFoot(x+xx,z+zz);
 // Four unlike casemates at different mountain ridge offsets.
 const towers=[[7,14,7,13,9],[37,42,7,12,11],[7,15,37,44,8],[40,46,30,39,10]];
 for(const p of towers)rect(...p.slice(0,4),addFoot);
 for(const p of [[7,7,6,7],[38,43,7,7],[7,7,43,46],[46,49,34,34]])rect(...p,addFoot);
 rect(23,24,1,14,addFoot); // real two-wide through-wall road
 rect(23,29,10,11,addFoot); // full two-wide side corridor at x28-29
 rect(28,29,4,10,addFoot); // five ascending mountain stair treads
 const clear=[B(23,2,1,2,3,14),B(23,2,10,7,3,1),
  ...Array.from({length:5},(_,i)=>B(28,3+i,9-i,2,3,1)),
  B(28,7,4,2,3,1)];
 const reserved=(x,y,z)=>clear.some(c=>x>=c.x&&x<c.x+c.width&&
  y>=c.y&&y<c.y+c.height&&z>=c.z&&z<c.z+c.depth);
 function put(role,x,y,z,asset){
  if(!foot.has(F(x,z))||y<0||y>=H)throw Error(id+' source not grounded '+K(x,y,z));
  if(!Object.hasOwn(ASSET_CATALOG,asset))throw Error(id+' unknown pack symbol '+asset);
  if(!['foundation','floor'].includes(role)&&reserved(x,y,z))return false;
  const k=K(x,y,z);if(occupied.has(k))throw Error(id+' duplicate source '+k);
  occupied.set(k,role);
  if(!modules.has(role))modules.set(role,[]);
  modules.get(role).push([x,y,z,asset]);return true;
 }
 for(const s of foot){const [x,z]=s.split(',').map(Number);
  put('foundation',x,0,z,'builtin:stone');
  put('floor',x,1,z,'pack1:007');
 }
 for(const [x,z] of ring){
  const gate=z===4&&(x===23||x===24);
  for(let y=2;y<=5;y++)if(!gate||y===5)put('wall',x,y,z,gate?'pack3:069':'pack1:002');
  put('rampart',x,6,z,'pack3:070');
 }
 towers.forEach(([a,b,c,d,h],i)=>rect(a,b,c,d,(x,z)=>{
  for(let y=2;y<=5;y++)put('bastion-bearing',x,y,z,'pack1:002');
  put('roof',x,6,z,i%2?'pack3:025':'pack3:069');
  if(x===a||x===b||z===c||z===d)
   for(let y=7;y<h;y++)put('tower-mass',x,y,z,'pack3:070');
 }));
 for(let i=0;i<5;i++)for(let x=28;x<=29;x++){
  const z=9-i,top=2+i;
  for(let y=2;y<top;y++)put('stair-support',x,y,z,'pack1:002');
  // Stairs themselves must be walkable supports below reserved three-high head.
  if(!put('stair',x,top,z,'pack1:008'))throw Error(id+' missing true mountain stair '+K(x,top,z));
 }
 const node=(id,x,y,z)=>({id,x,y,z,width:2,headroom:3});
 const nodes=[node('north-road',23,2,1),node('through-wall',23,2,4),
  node('staging',23,2,10),node('stair-foot',28,2,10),
  ...Array.from({length:5},(_,i)=>node('stair-'+(i+1),28,3+i,9-i)),
  node('northern-rampart',28,7,4)];
 const pairs=[['north-road','through-wall','level'],['through-wall','staging','level'],
  ['staging','stair-foot','level'],['stair-foot','stair-1','stair'],
  ...Array.from({length:4},(_,i)=>['stair-'+(i+1),'stair-'+(i+2),'stair']),
  ['stair-5','northern-rampart','level']];
 const bp={
  id,type:'city-wall',biome:'mountain',size:'small',variant:1,
  status:'theoretical',activated:false,envelope:B(0,0,0,W,H,D),
  modules:[...modules].map(([role,cells])=>({id:'granite-'+role,role,cells})),
  clearances:clear,
  openings:[{id:'north-gorge-road',facing:'north',x:23,y:2,z:1,width:2,height:3}],
  spaces:[
   {id:'actual-northern-gateway',kind:'gateway',accessNode:'north-road',bounds:B(23,2,1,2,3,14)},
   {id:'ridge-wall-run',kind:'wall-run',accessNode:'northern-rampart',bounds:B(28,7,4,2,3,1)},
   {id:'ridge-battlements',kind:'battlement',accessNode:'northern-rampart',bounds:B(28,7,4,2,3,1)},
   {id:'real-mountain-stairwell',kind:'stairwell',accessNode:'stair-foot',bounds:B(28,2,10,2,3,1)}
  ],
  navigation:{entry:'north-road',nodes,edges:pairs.map(([from,to,kind])=>({from,to,kind}))},
  fortification:{
   wallPath:vertices,rampartRoute:ring.map(([x,z])=>[x,7,z]),
   gatePassages:[{axis:'z',floorY:2,width:2,height:3,
    points:Array.from({length:14},(_,i)=>[23,i+1])}],
   roadwaySockets:[{x:23,z:1,width:2,facing:'north'},{x:23,z:14,width:2,facing:'south'}],
   junctionSockets:vertices.slice(0,-1).map(([x,z],i)=>({x,y:7,z,name:'ridge-break-'+(i+1)})),
   mountainTerrainSupportRequired:true,creatorApproved:false
  },
  features:[{name:'unpowered northern ridge gate',position:[23,2,4],assetRef:null,
   unresolvedDependency:'Physical gate, terrain cutbacks and road/gradient join pending'},
   {name:'four unequal cliff casemates',position:[39,6,10],assetRef:'pack3:069',unresolvedDependency:null}],
  architecture:{title:'Granite Switchback — closed eight-segment mountain escarpment',
   originalSource:true,perimeterCells:ring.length,unequalWatchTowers:4,
   worldRegistered:false,packFamilyAABBCertified:false},
  dependencies:['pack1:002','pack1:007','pack1:008','pack3:025','pack3:069','pack3:070',
   'Pack1–5 true producer yaw/AABB, mountain terrain bearing and iPhone collision unresolved'],
  implementation:'ROADMAP-C-MOUNTAIN-STEPPED-WALL-SOURCE-ONLY-NO-PLACEMENT'
 };
 validateBlueprint(bp,ASSET_CATALOG);
 validateCityWallTopology(bp);
 return bp;
}
export function createCGraniteSwitchbackCityWallPool(){return [createCGraniteSwitchbackCityWall()];}
