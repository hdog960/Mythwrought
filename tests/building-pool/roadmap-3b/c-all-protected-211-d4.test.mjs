// Roadmap C independently compares C fortification/barracks source geometry
// against ALL 211 protected Builder 3B authored sources. No weaker shortcuts.
import test from 'node:test';
import assert from 'node:assert/strict';
import {createLegacyWatchtowerPool} from '../../../src/building-pool/roadmap-3b/legacy-watchtowers.mjs';
import {createRoadmapCFirstGatehouseBlueprint} from '../../../src/building-pool/roadmap-3b/c1-twinstone-pass-gatehouse.mjs';
import {createRoadmapCFirstCityWallBlueprint} from '../../../src/building-pool/roadmap-3b/c3-fourwatch-closed-city-wall.mjs';
import {createCRoadmapCDesertBarracks} from '../../../src/building-pool/roadmap-3b/c4-sandglass-fork-desert-barracks.mjs';
import {createCSunbarrowCaravanGatehouse} from '../../../src/building-pool/roadmap-3b/c5-sunbarrow-desert-gatehouse.mjs';
import {readFile} from 'node:fs/promises';

// 26 nonlegacy historical files from the explicitly accepted #271 parent.
// Pin this list; do not accept a future auto-discovered unreviewed pool as baseline.
const priorModules=[
 'm2-frontier','m2-hinterland','m2-industry','m2-missing-sizes','m2-regional',
 'm2-variant2-completion','m2-variant2-expansion','m2-variant2',
 'm2-variant3-final','m2-variant3-first','m2-variant3-second',
 'm2-variant4-completion','m2-variant4-first',
 'm2-watchtower-variant2-first','m2-watchtower-variant2-medium-large',
 'm2-watchtower-variant3-first','m2-watchtower-variant4-first',
 'm2-watchtower-variant5-final',
 'm3-barracks-medium-roadmap-c','m3-barracks-small-first',
 'm3-barracks-small-second','m3-boughgate-large-barracks-roadmap-c',
 'm3-cragpass-medium-barracks-roadmap-c','m3-glimmerroot-medium-barracks-roadmap-c',
 'm3-sandglass-medium-barracks-roadmap-c','m3-whitegale-medium-barracks-roadmap-c'
];
const srcDir=new URL('../../../src/building-pool/roadmap-3b/',import.meta.url);
const sourceFiles=['legacy-watchtowers',...priorModules];
const witnessUrl=new URL('../../../docs/building-pool/roadmap-3b/C_PROTECTED_ACCEPTED211_SOURCE_BLOBS.json',import.meta.url);
async function originalPool(){
 const blobs=JSON.parse(await readFile(witnessUrl,'utf8'));
 const {createHash}=await import('node:crypto');
 const hash=bytes=>createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
 assert.equal(blobs.acceptedParentHead,'b6de730a017f54db115db0741b9ec0b8e358ee66');
 assert.deepEqual(Object.keys(blobs.sources).sort(),sourceFiles.map(n=>n+'.mjs').sort(),
  'protected historical 3B module inventory drifted; do not silently add new sources');
 const all=[];
 for(const name of sourceFiles){
  const path=name+'.mjs';
  const bytes=await readFile(new URL(path,srcDir));
  assert.equal(hash(bytes),blobs.sources[path],path+' differs from accepted original Git blob');
  if(name==='legacy-watchtowers'){
   all.push(...createLegacyWatchtowerPool());
   continue;
  }
  const module=await import(new URL(path,srcDir));
  const poolFactories=Object.entries(module)
   .filter(([name,value])=>name.endsWith('Pool')&&name.startsWith('create')&&typeof value==='function');
  assert.equal(poolFactories.length,1,path+' expected one original accepted pool factory');
  const items=poolFactories[0][1]();
  assert.ok(Array.isArray(items)&&items.length>0,path+' source returned no real designs');
  all.push(...items);
 }
 assert.equal(all.length,211,'protected 211-source inventory has changed');
 assert.equal(new Set(all.map(x=>x.id)).size,211,'protected original IDs collided');
 return all;
}
const foundation=b=>{
 const data=b.modules.find(m=>m.role==='foundation');
 assert.ok(data?.cells?.length>=50,'missing actual physical foundation of '+b.id);
 return data.cells.map(c=>[c[0],c[2]]);
};
const norm=points=>{
 const minX=Math.min(...points.map(p=>p[0])),minZ=Math.min(...points.map(p=>p[1]));
 return new Set(points.map(([x,z])=>(x-minX)+','+(z-minZ)));
};
const d4max=(a,b)=>{
 const B=norm(b);let max=0;
 for(let mirror=0;mirror<2;mirror++)for(let turn=0;turn<4;turn++){
  const A=norm(a.map(([x,z])=>{
   x=mirror?-x:x;
   for(let i=0;i<turn;i++){const t=x;x=-z;z=t;}
   return [x,z];
  }));
  let overlap=0;
  for(const cell of A)if(B.has(cell))overlap++;
  max=Math.max(max,overlap/(A.size+B.size-overlap));
 }
 return max;
};
test('Roadmap C protected accepted 3B parent contains 211 unique byte-for-byte unchanged original source designs',async()=>{
 const all=await originalPool();
 assert.equal(all.length,211);
 assert.equal(all.filter(x=>x.type==='barracks').length>=20,true,
  'historic barracks category improperly omitted');
 for(const x of all){
  assert.ok(x.id.startsWith('r3:')&&x.status==='theoretical');
  assert.ok(foundation(x).length>=50);
 }
});
test('All four new original C 3B architectures are D4-distinct from every protected historical 3B blueprint, eight symmetries, strict <0.89',async()=>{
 const all=await originalPool();
 const fresh=[createRoadmapCFirstGatehouseBlueprint(),createRoadmapCFirstCityWallBlueprint(),createCRoadmapCDesertBarracks(),createCSunbarrowCaravanGatehouse()];
 assert.equal(new Set(fresh.map(x=>x.id)).size,4);
 for(const candidate of fresh){
  assert.ok(!all.some(x=>x.id===candidate.id),'original C building reused accepted 3B ID '+candidate.id);
  let score=0,closest='',checked=0;
  const ca=foundation(candidate);
  for(const old of all){
   const s=d4max(ca,foundation(old));
   if(s>score){score=s;closest=old.id;}
   assert.ok(s<0.89,candidate.id+' D4 copied protected original '+old.id+' floor IoU '+s.toFixed(8));
   checked++;
  }
  assert.equal(checked,211);
  console.log('MYTHWROUGHT_C_3B_ALL_211_STRICT_D4='+JSON.stringify({
   id:candidate.id,compared:checked,maxD4IoU:score,nearest:closest,sourceOnly:true}));
 }
});

test('All four newly authored C-only 3B sources reject mirrored/recolored geometry clones of one another',()=>{
 const fresh=[createRoadmapCFirstGatehouseBlueprint(),createRoadmapCFirstCityWallBlueprint(),
  createCRoadmapCDesertBarracks(),createCSunbarrowCaravanGatehouse()];
 let comparisons=0;
 for(let i=0;i<fresh.length;i++)for(let j=i+1;j<fresh.length;j++){
  const score=d4max(foundation(fresh[i]),foundation(fresh[j]));
  assert.ok(score<0.89,'NEW ROADMAP C source clone '+fresh[i].id+' vs '+fresh[j].id+' D4 '+score.toFixed(8));
  comparisons++;
 }
 assert.equal(comparisons,6);
});
