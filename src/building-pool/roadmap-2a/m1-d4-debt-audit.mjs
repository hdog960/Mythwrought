// Source-only D4 normalised occupied-floor comparison for Builder 2A.
// A ledger of inherited architectural uniqueness DEBT, not acceptance of clones.
import {M1_GENERAL_STORES} from './m1-general-stores.mjs';
import {M1_SPECIALIST_EXEMPLARS} from './m1-specialist-exemplars.mjs';
import {M1_NEW_MERCHANTS} from './m1-additional-shops.mjs';
import {M1_REGIONAL_SHOPS} from './m1-regional-shops.mjs';
import {M1_BIOME_EXPANSION} from './m1-biome-expansion.mjs';
import {M1_CATEGORY_ARCADES} from './m1-category-arcades.mjs';
import {M1_MARKET_FRONTS} from './m1-market-fronts.mjs';
import {M1_COURTYARD_SHOPS} from './m1-courtyard-shops.mjs';
import {M1_U_COURT_SHOPS} from './m1-u-court-shops.mjs';
import {M1_STEPPED_COURT_SHOPS} from './m1-stepped-court-shops.mjs';
import {M1_LATERAL_MARKETS} from './m1-lateral-markets.mjs';
import {M1_TWIN_SIDE_TERRACE_SHOPS} from './m1-twin-side-terraces.mjs';
import {M1_ARCADED_FRONT_SHOPS} from './m1-arcaded-front-shops.mjs';
import {M1_TOWER_COURT_SHOPS} from './m1-tower-court-shops.mjs';
import {M1_SCULPTED_MARKETS} from './m1-sculpted-markets.mjs';
import {M1_SIGNATURE_SKYLINE_SHOPS} from './m1-signature-skyline.mjs';
import {M1_LANDMARK_SHOPS} from './m1-landmark-shops.mjs';
import {M1_DISTINCT_WING_SHOPS} from './m1-distinct-wing-shops.mjs';
import {M1_FIVE_COURT_SHOPS} from './m1-five-court-shops.mjs';
export const M1_D4_AUDIT_ALL=Object.freeze([...M1_GENERAL_STORES,...M1_SPECIALIST_EXEMPLARS,...M1_NEW_MERCHANTS,
 ...M1_REGIONAL_SHOPS,...M1_BIOME_EXPANSION,...M1_CATEGORY_ARCADES,...M1_MARKET_FRONTS,
 ...M1_COURTYARD_SHOPS,...M1_U_COURT_SHOPS,...M1_STEPPED_COURT_SHOPS,
 ...M1_LATERAL_MARKETS,...M1_TWIN_SIDE_TERRACE_SHOPS,...M1_FIVE_COURT_SHOPS,...M1_DISTINCT_WING_SHOPS,...M1_LANDMARK_SHOPS,...M1_SIGNATURE_SKYLINE_SHOPS,...M1_SCULPTED_MARKETS,...M1_TOWER_COURT_SHOPS,...M1_ARCADED_FRONT_SHOPS]);
const normalize=p=>{
 const minx=Math.min(...p.map(v=>v[0])),minz=Math.min(...p.map(v=>v[1]));
 return new Set(p.map(([x,z])=>(x-minx)+','+(z-minz)));
};
function variants(bp){
 const floor=bp.voxels.filter(v=>v.kind==='floor'&&v.y===1).map(v=>[v.x,v.z]);
 if(!floor.length)throw Error('physical source has no walkable floor: '+bp.id);
 const all=[];for(let mirror=0;mirror<2;mirror++)for(let rotation=0;rotation<4;rotation++){
  const pts=floor.map(([a,b])=>{let x=mirror?-a:a,z=b;for(let r=0;r<rotation;r++){const t=x;x=-z;z=t;}return[x,z]});
  all.push(normalize(pts));
 }return all;
}
function iou(a,b){let shared=0;for(const v of a)if(b.has(v))shared++;return shared/(a.size+b.size-shared);}
export function inspect2AD4FloorDebt(books=M1_D4_AUDIT_ALL){
 if(!Array.isArray(books)||books.length<80)throw Error('full protected source roster required');
 const forms=books.map(b=>({id:b.id,biome:b.biome,category:b.category,v:variants(b)}));
 if(new Set(forms.map(b=>b.id)).size!==books.length)throw Error('duplicate blueprint identities in D4 audit');
 const highOverlap=[],introduced=[],affected=new Set();let exact=0;
 for(let i=0;i<forms.length;i++)for(let j=i+1;j<forms.length;j++){
  const a=forms[i],b=forms[j],score=Math.max(...a.v.map(p=>iou(p,b.v[0])));
  if(score<.89)continue;
  const entry={first:a.id,second:b.id,IoU:+score.toFixed(9),baseline:i<74&&j<74};
  highOverlap.push(entry);affected.add(a.id);affected.add(b.id);
  if(i>=74||j>=74)introduced.push(entry);
  if(score===1)exact++;
 }
 return Object.freeze({sources:books.length,protectedOriginals:74,
  grandfatheredHighOverlapPairs:highOverlap.length-introduced.length,
  exactMatchingFloorPairs:exact,
  allHighOverlapPairs:highOverlap.length,
  newHighOverlapPairs:introduced.length,
  affectedBuildings:affected.size,
  collisions:Object.freeze(highOverlap),newCollisions:Object.freeze(introduced),
  artisticallyDistinct:false,productionIntegrated:false});
}
