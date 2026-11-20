// Builder B 1B ownership reservation only. Never registers buildings in the game.
// Anchors: canonical #184 -> repair #233; accepted 1B staging #241 6ab800a9cc16...
import {ROADMAP_B_WAVE1_B1_IDS} from './wave1-community-b1.mjs';
import {ROADMAP_B_WAVE2_B1_IDS} from './wave2-community-b1.mjs';
import {ROADMAP_B_WAVE3_B1_IDS} from './wave3-community-b1.mjs';
import {ROADMAP_B_WAVE4_B1_IDS} from './wave4-community-b1.mjs';
import {ROADMAP_B_WAVE5_B1_IDS} from './wave5-community-b1.mjs';
import {ROADMAP_B_WAVE6_B1_IDS} from './wave6-community-b1.mjs';
import {ROADMAP_B_WAVE7_B1_IDS} from './wave7-community-b1.mjs';
import {ROADMAP_B_WAVE8_B1_IDS} from './wave8-community-b1.mjs';
import {ROADMAP_B_WAVE9_B1_IDS} from './wave9-community-b1.mjs';
import {ROADMAP_B_WAVE10_B1_IDS} from './wave10-community-b1.mjs';
import {ROADMAP_B_WAVE11_B1_IDS} from './wave11-community-b1.mjs';
import {ROADMAP_B_WAVE12_B1_IDS} from './wave12-community-b1.mjs';
import {ROADMAP_B_WAVE13_B1_IDS} from './wave13-community-b1.mjs';
import {ROADMAP_B_WAVE14_B1_IDS} from './wave14-community-b1.mjs';
import {ROADMAP_B_WAVE15_B1_IDS} from './wave15-community-b1.mjs';
import {get1BCandidates} from '../roadmap-1b/candidates.mjs';
import {BIOMES,SIZES,QUOTAS,blueprintId,TARGET} from '../roadmap-1b/schema.mjs';
export const SOURCE_HEADS=Object.freeze({
  canonical1B:'7f9f826b3bd872dba419e5d56ca88507fe19c592',
  acceptedStaging:'6ab800a9cc16f31fdc5655f119979390992effcf'
});
export const RESERVATION_COUNTS=Object.freeze({"farm-barn":20,"greenhouse":18,"stable":17,"fishing-lodge":16,"harbor-office":16,"lighthouse":14,"bathhouse":14});
const acceptedStagingIds=Object.freeze([
 'r1:bathhouse:mountain:medium:004',
 ...ROADMAP_B_WAVE1_B1_IDS,
 ...ROADMAP_B_WAVE2_B1_IDS,
 ...ROADMAP_B_WAVE3_B1_IDS,
 ...ROADMAP_B_WAVE4_B1_IDS,
 ...ROADMAP_B_WAVE5_B1_IDS,
 ...ROADMAP_B_WAVE6_B1_IDS,
 ...ROADMAP_B_WAVE7_B1_IDS,
 ...ROADMAP_B_WAVE8_B1_IDS,
 ...ROADMAP_B_WAVE9_B1_IDS,
 ...ROADMAP_B_WAVE10_B1_IDS,
 ...ROADMAP_B_WAVE11_B1_IDS,
 ...ROADMAP_B_WAVE12_B1_IDS,
 ...ROADMAP_B_WAVE13_B1_IDS,
 ...ROADMAP_B_WAVE14_B1_IDS,
 ...ROADMAP_B_WAVE15_B1_IDS
]);
const FNV_OFFSET=0xcbf29ce484222325n, FNV_PRIME=0x100000001b3n, MASK=(1n<<64n)-1n;
export function fnv64(s) {
 let h=FNV_OFFSET;
 for(let i=0;i<s.length;i++) { h^=BigInt(s.charCodeAt(i)); h=(h*FNV_PRIME)&MASK; }
 return h.toString(16).padStart(16,'0');
}
export function getBuilderBServiceOwnership(){
 const canonical=get1BCandidates().map(x=>x.id);
 if(canonical.length!==169||acceptedStagingIds.length!==59)throw Error('1B accepted source census drift: '+canonical.length+'/'+acceptedStagingIds.length);
 const existing=[...canonical,...acceptedStagingIds],occupied=new Set(existing);
 if(occupied.size!==228)throw Error('1B accepted source ID overlap: '+occupied.size);
 const reserved=[],dAvailable=[],inventory=[],byCategory={};
 for(const [category,wanted] of Object.entries(RESERVATION_COUNTS)){
  const free=[];
  for(const biome of BIOMES)for(const size of SIZES)for(let index=1;index<=QUOTAS[category];index++){
   const id=blueprintId(category,biome,size,index);
   if(!occupied.has(id))free.push(id);
  }
  if(free.length<wanted)throw Error('Insufficient genuinely vacant 1B '+category+' slots: '+free.length+' < '+wanted);
  byCategory[category]={occupied:15*QUOTAS[category]-free.length,free:free.length,b: wanted,d:free.length-wanted};
  for(const id of free.slice(0,wanted))reserved.push(id);
  for(const id of free.slice(wanted))dAvailable.push(id);
  inventory.push(...free);
 }
 if(reserved.length!==115||dAvailable.length!==92||inventory.length!==207||existing.length+inventory.length!==TARGET)
  throw Error('1B B/D totals wrong');
 if(new Set([...existing,...reserved,...dAvailable]).size!==435)throw Error('1B owned/different/canonical ID collision');
 return Object.freeze({
  schema:'mythwrought.builder-bd.1b-ownership.v1',
  frozenSources:SOURCE_HEADS,
  existing:existing.length,unfilled:inventory.length,forBuilderB:reserved.length,forBuilderD:dAvailable.length,
  categoryQuotas:byCategory,
  builderBIds:Object.freeze(reserved),
  builderDAvailableIds:Object.freeze(dAvailable),
  allocationChecksumFNV64:fnv64(reserved.join('\n')),
  unassignedForBChecksumFNV64:fnv64(dAvailable.join('\n')),
  sourceAcceptance:'SOURCE ONLY',runtimeRegistered:false,creatorArtApproved:false,productionMerged:false
 });
}
