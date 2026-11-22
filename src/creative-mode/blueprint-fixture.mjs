// ONLY synthetic fixture data for M7 UI/browser tests. NOT actual approvals.
import {BLUEPRINT_ABI} from './blueprint-browser.mjs';
const BIOMES=['temperate','desert','snow','enchanted','mountain'];
const KINDS=['home','civic','commerce','industry','culture','fortification','arcane'];
const SIZES=['small','medium','large'];
function preview(seed){
 const footprint=3+(seed%3),cells=[];
 for(let x=0;x<footprint;x++)for(let z=0;z<footprint;z++){
  cells.push({x,y:0,z,type:'foundation'});
  if(x===0||z===0||x===footprint-1||z===footprint-1)cells.push({x,y:1,z,type:'wall'});
  if((x+z+seed)%3===0)cells.push({x,y:2,z,type:'roof'});
 }
 return cells.slice(0,MAX_PREVIEW_TEST);
}
const MAX_PREVIEW_TEST=92;
function sample(i){
 const category=KINDS[i%KINDS.length],biome=BIOMES[i%BIOMES.length],size=SIZES[Math.floor(i/5)%SIZES.length];
 const id=`fixture:structure-${String(i).padStart(4,'0')}`;
 const required=[`fixture:material-${i%11}`,`fixture:material-${(i+1)%11}`];
 return {id,name:`Synthetic ${biome} ${category} ${String(i).padStart(3,'0')}`,kind:category,biome,size,
  status:'accepted',draft:false,sourceState:'accepted-fixture',
  approval:{status:'accepted',authority:'creator',decisionId:`fixture:approval-${i}`},
  dependencies:{status:'resolved',required,resolved:[...required],missing:[]},
  geometry:{coordinateAuthored:true,fingerprint:i.toString(16).padStart(64,'0'),previewCells:preview(i)}};
}
export function syntheticBlueprintSnapshot(count=210){
 if(!Number.isSafeInteger(count)||count<0||count>4000)throw RangeError('Test fixture size');
 const records=Array.from({length:count},(_,i)=>sample(i));
 if(count>=4){records[1]={...records[1],status:'draft',draft:true};records[2]={...records[2],approval:{...records[2].approval,status:'pending'}};records[3]={...records[3],dependencies:{status:'unresolved',required:['fixture:missing'],resolved:[],missing:['fixture:missing']}};}
 return {abi:BLUEPRINT_ABI,provenance:'accepted-blueprint-registry',registryRevision:1,fixture:true,records};
}
