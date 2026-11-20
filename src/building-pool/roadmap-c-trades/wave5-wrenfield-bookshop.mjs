// Roadmap C original C-exclusive bookshop r2:bookshop:temperate:small:02.
// No actual NPC authors, quests, reading AI, inventory or saved-world mutation.
import {SCHEMA,validateBlueprint} from '../roadmap-2b/schema.mjs';
const E={x:38,y:19,z:39};
const M={foundation:'pack1:002',floor:'pack1:007',wood:'pack2:013',beam:'pack2:015',
 slate:'pack3:025',thatch:'pack3:026',crown:'pack3:069',glass:'pack4:030',
 shelves:'pack5:087',counter:'pack5:086',crate:'pack4:057',
 lantern:'pack4:035',sign:'pack4:061'};
const K=(x,y,z)=>x+','+y+','+z,F=(x,z)=>x+','+z;
export function createCWrenfieldBookshop(){
 const id='r2:bookshop:temperate:small:02',foundation=new Set(),cells=new Map();
 const patch=(a,b,c,d,fn)=>{for(let x=a;x<=b;x++)for(let z=c;z<=d;z++)fn(x,z);};
 // Central long nave has separate western scriptoria, eastern glazed reading
 // garden and raised northern archive, not a rectangle or another market clone.
 for(const [a,b,c,d] of [[10,25,0,32],[2,11,10,25],[25,35,12,30],[13,29,29,37]])
  patch(a,b,c,d,(x,z)=>foundation.add(F(x,z)));
 let open=0;
 patch(17,18,23,25,(x,z)=>{if(foundation.delete(F(x,z)))open++});
 if(open!==6)throw Error(id+' source-light story court missing');
 const has=(x,z)=>foundation.has(F(x,z));
 const door=new Set();
 function clearDoor(x,z,axis){for(let i=0;i<2;i++)for(let y=2;y<=4;y++)
  door.add(K(x+(axis==='x'?i:0),y,z+(axis==='z'?i:0)));}
 clearDoor(17,0,'x');clearDoor(10,14,'z');clearDoor(25,18,'z');
 clearDoor(19,29,'x');clearDoor(19,37,'x');
 const divider=new Set();
 for(let z=11;z<=24;z++)divider.add(F(10,z));
 for(let z=13;z<=29;z++)divider.add(F(25,z));
 for(let x=13;x<=25;x++)divider.add(F(x,29));
 const roofY=(x,z)=>z>=29&&x>=13&&x<=29?12:
  x<=9&&z>=10&&z<=25?8:
  x>=26&&z>=12&&z<=30?10:9;
 function put(x,y,z,material,kind,label){
  if(!has(x,z)||x<0||y<0||z<0||x>=E.x||y>=E.y||z>=E.z)
   throw Error(id+' floating original bookshelf material '+K(x,y,z));
  const key=K(x,y,z);if(cells.has(key))throw Error(id+' overlapping source '+key);
  cells.set(key,{x,y,z,material,kind,...label?{architectureRole:label}:{}});
 }
 function window(x,y,z){const k=K(x,y,z);
  if(!cells.has(k))throw Error(id+' source window not cut into a wall '+k);
  cells.set(k,{x,y,z,material:M.glass,kind:'window'});
 }
 for(const p of foundation){const [x,z]=p.split(',').map(Number);
  put(x,0,z,M.foundation,'foundation');
  put(x,1,z,M.floor,'floor');
 }
 for(const p of foundation){
  const [x,z]=p.split(',').map(Number);
  const exposed=[[x-1,z],[x+1,z],[x,z-1],[x,z+1]].some(([xx,zz])=>!has(xx,zz));
  if(!exposed&&!divider.has(p))continue;
  for(let y=2;y<=Math.min(roofY(x,z)-1,7);y++)
   if(!door.has(K(x,y,z)))put(x,y,z,exposed?M.wood:M.beam,'wall',exposed?'book-hall-bearing-wall':'quiet-reading-partition');
 }
 const windows=[];
 for(const [x,z] of [[12,0],[23,0],[10,5],[2,14],[2,22],[35,16],[35,26],
  [14,37],[27,37],[29,32]])
  for(let y=3;y<=4;y++){window(x,y,z);windows.push({type:'window',x,y,z,material:M.glass});}
 // Archival roof is deliberately taller than the public bookstore; separate
 // roof bands allow the physical public reading courtyard to remain sky-open.
 for(const p of foundation){const [x,z]=p.split(',').map(Number),h=roofY(x,z);
  put(x,h,z,h===12?M.crown:h===8?M.thatch:M.slate,'roof',
   h===12?'archive-north-high-hips':h===10?'glass-east-reading-conservatory':
    h===8?'west-copying-workshop':'book-gallery-main-ridge');
 }
 // Literal bookcases/bookshelf proxy cells, no text or book content is copied.
 for(const [x,y,z,material,role] of [
  [14,2,6,M.counter,'front-issue-desk'],[15,2,6,M.counter,'front-issue-desk'],
  [21,2,10,M.shelves,'real-front-bookstacks'],[22,2,10,M.shelves,'real-front-bookstacks'],
  [5,2,15,M.shelves,'western-scriptoria-books'],[6,2,15,M.shelves,'western-scriptoria-books'],
  [5,2,22,M.crate,'blank-paper-storage'],[6,2,22,M.counter,'copyist-stand'],
  [29,2,17,M.counter,'reading-table'],[30,2,17,M.counter,'reading-table'],
  [29,2,26,M.shelves,'public-reading-wall-books'],
  [19,2,34,M.shelves,'north-archival-stacks'],
  [23,2,35,M.crate,'sealed-manuscript-stock']
 ])put(x,y,z,material,'fixture',role);
 // Sign/lantern inert and supported at facade, not player-facing UI menu.
 put(17,10,0,M.sign,'decor','inert-bookshop-nameplate');
 const targets=[[17,0],[17,6],[17,14],[17,21],[15,26],
  [10,14],[8,14],[5,18],
  [25,18],[27,18],[32,20],
  [19,29],[19,32],[19,37]];
 for(const [x,z] of targets)for(let y=2;y<=4;y++)
  if(!has(x,z)||cells.has(K(x,y,z)))throw Error(id+' fake bookshop circulation '+K(x,y,z));
 const voxels=[...cells.values()].sort((a,b)=>a.y-b.y||a.z-b.z||a.x-b.x);
 const refs=[...new Set([...voxels.map(v=>v.material),'pack2:020'])].sort();
 const b={
  schema:SCHEMA,id,category:'bookshop',biome:'temperate',size:'small',variation:2,
  title:'Wrenfield Archive — four-wing readers’ haven with open light well',
  status:'authored-candidate',isolated:true,worldPlaced:false,numericIdsAssigned:false,
  blueprintVersion:'roadmap-c-original-bookshop-w5',extents:E,
  architecturalStyle:{form:'deep asymmetric library nave, west low copyist workshop, east public reading conservatory and high northern archive',biomeSpecific:true},
  rooms:[
   {name:'Long main book gallery',uses:['sales-floor'],bounds:{x0:10,x1:25,z0:0,z1:27}},
   {name:'Public book issue and register',uses:['service-counter'],bounds:{x0:12,x1:22,z0:4,z1:12}},
   {name:'Western manuscript scriptoria',uses:['bookshelves'],bounds:{x0:2,x1:11,z0:10,z1:25}},
   {name:'East reading conservatory',uses:['reading-area'],bounds:{x0:25,x1:35,z0:12,z1:30}},
   {name:'Raised north archive',uses:['archive'],bounds:{x0:13,x1:29,z0:29,z1:37}}
  ],
  circulation:[
   {from:'exterior',to:'sales-floor',via:'two-wide front book gallery threshold'},
   {from:'sales-floor',to:'service-counter',via:'open register alcove'},
   {from:'sales-floor',to:'bookshelves',via:'real west scriptoria door at x10 z14–15'},
   {from:'sales-floor',to:'reading-area',via:'two-wide east reading room at x25 z18–19'},
   {from:'sales-floor',to:'archive',via:'rear inner high archive door x19–20 z29'}
  ],
  openings:[
   {type:'entrance',x:17,y:2,z:0,clearHeightCells:3,doorSymbol:'pack2:020'},
   {type:'internal-doorway',x:10,y:2,z:14,clearHeightCells:3},
   {type:'internal-doorway',x:25,y:2,z:18,clearHeightCells:3},
   {type:'internal-doorway',x:19,y:2,z:29,clearHeightCells:3},
   {type:'internal-doorway',x:19,y:2,z:37,clearHeightCells:3},...windows],
  features:['sales-floor','service-counter','bookshelves','reading-area',
   'quiet scriptoria','real six-column open roof/ground court','physical bookstack source objects'],
  openStoryCourt:{x0:17,x1:18,z0:23,z1:25,groundAbsent:true},
  originalWalkTargets:targets.map(([x,z])=>({x,y:2,z})),
  bookReadFunctionality:false,
  unresolvedDependencies:refs.map(ref=>({ref,issue:'Producer physical bookshelf variant, glass/door, geometry AABB and save mapping not independently certified'})),
  voxels
 };
 validateBlueprint(b);return Object.freeze(b);
}
export function getRoadmapCTradeWave5(){return [createCWrenfieldBookshop()];}
