import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
import {join} from 'node:path';
import {M1_GENERAL_STORES} from '../../../src/building-pool/roadmap-2a/m1-general-stores.mjs';
import {M1_SPECIALIST_EXEMPLARS} from '../../../src/building-pool/roadmap-2a/m1-specialist-exemplars.mjs';
import {M1_NEW_MERCHANTS} from '../../../src/building-pool/roadmap-2a/m1-additional-shops.mjs';
import {M1_REGIONAL_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-regional-shops.mjs';
import {M1_BIOME_EXPANSION} from '../../../src/building-pool/roadmap-2a/m1-biome-expansion.mjs';
import {M1_CATEGORY_ARCADES} from '../../../src/building-pool/roadmap-2a/m1-category-arcades.mjs';
import {M1_MARKET_FRONTS} from '../../../src/building-pool/roadmap-2a/m1-market-fronts.mjs';
import {M1_COURTYARD_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-courtyard-shops.mjs';
import {M1_U_COURT_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-u-court-shops.mjs';
import {M1_LATERAL_MARKETS} from '../../../src/building-pool/roadmap-2a/m1-lateral-markets.mjs';
import {M1_LANDMARK_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-landmark-shops.mjs';
import {M1_DISTINCT_WING_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-distinct-wing-shops.mjs';
import {M1_FIVE_COURT_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-five-court-shops.mjs';
import {M1_TWIN_SIDE_TERRACE_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-twin-side-terraces.mjs';
import {M1_STEPPED_COURT_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-stepped-court-shops.mjs';
const designs=[...M1_GENERAL_STORES,...M1_SPECIALIST_EXEMPLARS,...M1_NEW_MERCHANTS,...M1_REGIONAL_SHOPS,...M1_BIOME_EXPANSION,...M1_CATEGORY_ARCADES,...M1_MARKET_FRONTS,...M1_COURTYARD_SHOPS,...M1_U_COURT_SHOPS,...M1_STEPPED_COURT_SHOPS,...M1_LATERAL_MARKETS,...M1_TWIN_SIDE_TERRACE_SHOPS,...M1_FIVE_COURT_SHOPS,...M1_DISTINCT_WING_SHOPS,...M1_LANDMARK_SHOPS];
const KINDS=Object.freeze({foundation:'0',floor:'1',wall:'2',roof:'3',window:'4',fixture:'5',decor:'6'});
const alphabet=/^[0-9a-z]{9}$/;
function encode(source){
 const coords=source.voxels.map(v=>({x:v.x,y:v.y,z:v.z,k:KINDS[v.kind]}))
  .sort((a,b)=>a.k.localeCompare(b.k)||a.y-b.y||a.z-b.z||a.x-b.x);
 const runs=[];let last=null;
 for(const v of coords){
  if(last&&last.k===v.k&&last.y===v.y&&last.z===v.z&&last.end+1===v.x){last.end=v.x;}
  else{last={k:v.k,y:v.y,z:v.z,start:v.x,end:v.x};runs.push(last);}
 }
 const tokens=runs.map(r=>[r.k,r.y,r.z,r.start,r.end].map((n,i)=>i===0?n:n.toString(36).padStart(2,'0')).join(''));
 for(const token of tokens)assert.match(token,alphabet);
 const reconstructed=tokens.reduce((n,t)=>n+parseInt(t.slice(7,9),36)-parseInt(t.slice(5,7),36)+1,0);
 assert.equal(reconstructed,source.voxels.length,source.id+' lossless occupied coordinate count');
 return {id:source.id,extent:source.extents,cells:source.voxels.length,rooms:source.rooms.length,
  windowCells:source.voxels.filter(v=>v.kind==='window').length,
  categories:source.category,biome:source.biome,size:source.size,
  runs:tokens.join('')};
}
test('all 98 source-exact blueprint geometry previews are exported only as ephemeral, fully lossless CI artifact data',()=>{
 assert.equal(designs.length,98);
 assert.equal(new Set(designs.map(b=>b.id)).size,98);
 const records=designs.map(encode);
 const destination=join(process.cwd(),'artifacts','roadmap-2a-source-coordinates');
 mkdirSync(destination,{recursive:true});
 const file=join(destination,'all98-blueprint-cube-proxies.json');
 writeFileSync(file,JSON.stringify({format:'mythwrought-roadmap-2a-authored-integer-cell-rle-v2',
  renderedWith:'real WebGL2 cube proxies; NOT real Pack mesh, mounted windows or final roof art',
  explicitSourceOnly:true,physicalFamilyRenderingApproved:false,creatorApproved:false,
  sourceCheckoutSha:process.env.GITHUB_SHA??null,designs:records},null,2)+'\n');
 const actual=JSON.parse(readFileSync(file,'utf8'));
 assert.equal(actual.designs.length,98);
 assert.equal(new Set(actual.designs.map(x=>x.id)).size,98);
 assert(actual.designs.every(x=>x.runs.length%9===0&&x.cells>200&&x.windowCells>=0));
 assert.equal(actual.physicalFamilyRenderingApproved,false);
});