// Builder 4A M2 — two original independently coordinate-authored civic/public exemplars.
// Architecture is designed here from occupied 3D cells. It does not modify source PR #123,
// install assets, place structures, touch saves or assert physical iPhone approval.
import {SCHEMA,validateBlueprint,validateCollection,geometrySignature} from './schema.mjs';

const MATERIALS={
 'pack1:002':{state:'candidate',intendedShape:'single-cell',orientation:'fixed',attachment:'none',
   unresolved:['whole-building masonry face support and source-authentic collision verification']},
 'pack2:015':{state:'candidate',intendedShape:'partial',orientation:'rotatable',attachment:'floor',
   unresolved:['timber-furniture support/joinery and complete physical orientation verification']},
 'pack3:023':{state:'candidate',intendedShape:'partial',orientation:'rotatable',attachment:'adjacent',
   unresolved:['pitch/ridge/junction weathering and real roof support plus source mesh orientation']},
 'pack4:030':{state:'candidate',intendedShape:'partial',orientation:'rotatable',attachment:'wall',
   unresolved:['pane wall-mount offset, actual collision and transparency-depth inspection']}
};
const cellKey=(x,y,z)=>[x,y,z].join(',');
const siteKey=(x,z)=>[x,z].join(',');

function author(type){
 if(!['civic-hall','guildhall'].includes(type))throw Error('M2 author only handles two approved exemplar programs');
 const civic=type==='civic-hall';
 const w=27,d=civic?24:25,h=9;
 const entryX=civic?12:10,partX=civic?16:14,partDoorZ=civic?13:12;
 const profile=civic
  ?(x,z)=>((x>=3&&x<=21&&z>=4&&z<=20&&!((x<=6||x>=19)&&(z<=7||z>=18)))||
              (x>=22&&x<=24&&z>=10&&z<=16))
  :(x,z)=>((x>=3&&x<=18&&z>=4&&z<=19)||
             (x>=19&&x<=24&&z>=10&&z<=17)||
             (x>=8&&x<=13&&z>=20&&z<=22));
 const footprint=new Set();
 for(let z=0;z<d;z++)for(let x=0;x<w;x++)if(profile(x,z))footprint.add(siteKey(x,z));
 const has=(x,z)=>footprint.has(siteKey(x,z));
 const cells=new Map(),openings=[];
 const put=(x,y,z,role,asset='base:stone',facing='north',replace=false)=>{
  if(!Number.isInteger(x)||!Number.isInteger(y)||!Number.isInteger(z)||
     x<0||x>=w||y<0||y>=h||z<0||z>=d)throw Error('Invalid M2 coordinate '+cellKey(x,y,z));
  const k=cellKey(x,y,z);
  if(cells.has(k)&&!replace)throw Error('Overlapping 3D M2 source cell '+k);
  cells.set(k,{at:[x,y,z],role,asset,facing});
 };
 const del=(x,y,z)=>cells.delete(cellKey(x,y,z));
 // Two materially and spatially distinct authored ground plans:
 // civic = chamfered/octagonal council mass with eastern records annex;
 // guild = L-shaped meeting/workshop hall with a rear archive projection.
 for(const key of footprint){
  const [x,z]=key.split(',').map(Number);
  put(x,0,z,'floor',civic?'base:stone':'base:wood');
  put(x,4,z,'roof','pack3:023');
  if(![[1,0],[-1,0],[0,1],[0,-1]].every(([dx,dz])=>has(x+dx,z+dz)))
   for(let y=1;y<=3;y++)put(x,y,z,'wall',civic?'pack1:002':'base:wood');
 }
 // Exterior public portico, structurally attached at the front wall without
 // invented world placement. Full three-wide approach is a real supported floor.
 const porchL=civic?9:8,porchR=civic?15:13;
 for(let z=1;z<=3;z++)for(let x=porchL;x<=porchR;x++){
  put(x,0,z,'floor',civic?'base:stone':'base:wood');
  put(x,4,z,'roof','pack3:023');
 }
 for(let x=entryX-1;x<=entryX+1;x++)put(x,0,0,'floor','base:stone');
 for(const x of [porchL,porchR])for(const z of [1,3])
  for(let y=1;y<=3;y++)put(x,y,z,'column','base:wood');
 // Actual continuous timber eave beam spans both portico corner columns.
 for(const z of [1,3])for(let x=porchL+1;x<porchR;x++)
  if(!cells.has(cellKey(x,3,z)))put(x,3,z,'beam','base:wood');
 // The L-plan guild rear extension also bridges between structural walls at
 // x=7 and x=14; do not leave two central roof cells without nearby bearing.
 if(!civic)for(let x=8;x<=13;x++)
  if(!cells.has(cellKey(x,3,19)))put(x,3,19,'beam','base:wood');
 // Explicit timber underpurlins clear the two-high headroom at y=1,2.
 for(const z of [8,12,16])for(let x=3;x<=24;x++)
  if(has(x,z)&&!cells.has(cellKey(x,3,z)))put(x,3,z,'beam','base:wood');
 // A physically elevated, timber-backed gable: never roof-on-roof stacking.
 for(let z=8;z<=16;z++)for(let x=entryX-1;x<=entryX+1;x++)if(has(x,z)){
  put(x,4,z,'beam','base:wood','north',true);
  put(x,5,z,'roof','pack3:023');
 }
 // True two-high main door and separate interior record/work door.
 for(const x of [entryX-1,entryX,entryX+1])
  for(let y=1;y<=2;y++)del(x,y,4);
 openings.push({kind:'entrance',at:[entryX,1,4],facing:'south'});
 for(let z=civic?8:7;z<=(civic?18:17);z++){
  if(!has(partX,z)||z===partDoorZ)continue;
  for(let y=1;y<=3;y++){
   if(cells.has(cellKey(partX,y,z)))continue;
   put(partX,y,z,'partition',civic?'pack1:002':'base:wood');
  }
 }
 openings.push({kind:'door',at:[partX,1,partDoorZ],facing:'east'});
 // Original outward-facing windows are open 3D masonry sockets (not decoration).
 const windows=civic?[
   [8,2,4,'south'],[18,2,4,'south'],[3,2,13,'west'],
   [24,2,13,'east'],[12,2,20,'north']
 ]:[
   [5,2,4,'south'],[16,2,4,'south'],[3,2,12,'west'],
   [24,2,14,'east'],[10,2,22,'north']
 ];
 for(const [x,y,z,facing] of windows){
  const old=cells.get(cellKey(x,y,z));
  if(!old||old.role!=='wall')throw Error('Window must replace real exterior wall socket '+cellKey(x,y,z));
  put(x,y,z,'window','pack4:030',facing,true);
  openings.push({kind:'window',at:[x,y,z],facing});
 }
 // Room-scale, physically occupied wood/beam furnishing cells: not title-only rooms.
 const fixtures=civic?[[9,1,12],[11,1,15],[19,1,12],[22,1,14]]
                     :[[7,1,9],[9,1,15],[17,1,13],[21,1,14]];
 for(const [x,y,z] of fixtures){
  if(cells.has(cellKey(x,y,z)))throw Error('Furnishing intersects supporting wall '+cellKey(x,y,z));
  put(x,y,z,'fixture','pack2:015');
 }
 // A physical route graph from the exterior approach to every supported room tile.
 const nav=new Map();
 for(const cell of cells.values())if(cell.role==='floor'&&cell.at[1]===0){
  const [x,,z]=cell.at;
  if(!cells.has(cellKey(x,1,z))&&!cells.has(cellKey(x,2,z))){
   const p=[x,1,z];nav.set(cellKey(...p),{at:p,mode:'walk'});
  }
 }
 const spaces=[];
 const room=(id,kind,within)=>{
  const choices=[...nav.values()].filter(n=>within(n.at[0],n.at[2])).map(n=>[n.at[0],n.at[2]]);
  const pending=new Map(choices.map(p=>[siteKey(...p),p])),components=[];
  while(pending.size){
   const start=pending.values().next().value,stack=[start],component=[];
   pending.delete(siteKey(...start));
   while(stack.length){
    const [x,z]=stack.pop();component.push([x,z]);
    for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
     const k=siteKey(x+dx,z+dz),n=pending.get(k);
     if(n){pending.delete(k);stack.push(n);}
    }
   }
   components.push(component);
  }
  components.sort((a,b)=>b.length-a.length);
  const floor=components[0]||[];
  if(floor.length<8)throw Error('Unusable authored M2 room '+id);
  const access=floor[Math.floor(floor.length/2)];
  spaces.push({id,kind,level:1,access:[access[0],1,access[1]],footprint:floor});
 };
 if(civic){
  room('round-council-assembly','meeting',(x,z)=>x>=7&&x<=14&&z>=8&&z<=17);
  room('eastern-records-office','administration',(x,z)=>x>=17&&x<=23&&z>=11&&z<=16);
 }else{
  room('guild-members-meeting-hall','gathering-hall',(x,z)=>x>=5&&x<=12&&z>=7&&z<=17);
  room('guild-shared-workshop','shared-facility',(x,z)=>x>=16&&x<=23&&z>=11&&z<=16);
 }
 const actualCells=[...cells.values()];
 const references=[...new Set(actualCells.map(c=>c.asset).filter(a=>a.startsWith('pack')))].sort();
 const dependencies=references.map(ref=>({ref,...MATERIALS[ref]}));
 if(dependencies.some(d=>!d.state))throw Error('Undocumented M2 material dependency');
 const blueprint={
  schema:SCHEMA,
  id:'r4:'+type+':temperate:small:'+(civic?'02':'01'),
  type,biome:'temperate',size:'small',variant:civic?2:1,bounds:[w,h,d],
  cells:actualCells,dependencies,openings,navigation:[...nav.values()],spaces,
  architecturalNotes:{
   style:civic?'octagonal-civic-assembly-east-records-annex':'l-plan-artisan-guild-rear-stack',
   entrance:'real supported three-wide public portico and two-high formal doorway',
   roof:'timber-backed raised gable plus actual regional partial roof candidate',
   relativeSize:'small',storyCount:1,
   fixtures:'real occupied 3D location; supports, full ABI and final appearances unresolved',
   theoreticalOnly:true,worldPlacement:false,
   structuralSignature:civic?['octagonal',27,24,'eastern-annex',5]:
                              ['l-plan',27,25,'rear-archive',5]
  }
 };
 validateBlueprint(blueprint);
 return blueprint;
}
export function buildM2Exemplar(type){return author(type);}
export function allM2Exemplars(){return ['civic-hall','guildhall'].map(author);}
export function auditM2Exemplars(){
 const all=allM2Exemplars();
 const result=validateCollection(all);
 return Object.freeze({authored:all.length,distinctGeometry:new Set(all.map(geometrySignature)).size,
  target:315,creatorAccepted:0,liveIntegrated:0,
  validated:result.verified});
}
