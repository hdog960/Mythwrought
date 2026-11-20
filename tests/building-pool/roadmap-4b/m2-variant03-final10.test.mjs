// Builder 4B -- ten original source-coordinate third-variant healer/library blueprints.
import test from 'node:test';
import assert from 'node:assert/strict';
import {M2_VARIANT03_FINAL10,M2_93_ALL,M2_93_CENSUS,M2_VARIANT03_FINAL_NAMES} from '../../../src/building-pool/roadmap-4b/m2-variant03-final10.mjs';
import {M2_83_ALL} from '../../../src/building-pool/roadmap-4b/m2-variant03-second10.mjs';
import {validateBlueprint,validateCollection,geometrySignature,expectedIds,BIOMES,SIZES} from '../../../src/building-pool/roadmap-4b/schema.mjs';
const k=a=>a.join(',');
const base=b=>b.cells.filter(c=>c.role==='floor').map(c=>[c.at[0],c.at[2]]);
const normalized=(points,t)=>{const transformed=points.map(([x,z])=>{let a=t&1?-x:x,b=z;if(t&2)[a,b]=[b,a];if(t&4)b=-b;return [a,b]});
 const minX=Math.min(...transformed.map(p=>p[0])),minZ=Math.min(...transformed.map(p=>p[1]));
 return new Set(transformed.map(([x,z])=>(x-minX)+','+(z-minZ)));
};
const maxD4FloorIoU=(a,b)=>{const B=normalized(base(b),0);let max=0;for(let i=0;i<8;i++){const A=normalized(base(a),i);let count=0;for(const x of A)if(B.has(x))count++;max=Math.max(max,count/(A.size+B.size-count));}return max};
test('final ten third variants extend immutable 83 source objects to 93 original candidate blueprints',()=>{
 assert.equal(M2_VARIANT03_FINAL10.length,10);assert.equal(M2_93_CENSUS.newModels,10);
 assert.equal(M2_93_CENSUS.authored,93);assert.equal(M2_93_CENSUS.remaining,192);
 assert.equal(M2_93_CENSUS.healers,45);assert.equal(M2_93_CENSUS.libraries,45);
 assert.equal(M2_93_CENSUS.fingerprints,93);
 assert.equal(M2_93_CENSUS.creatorApproved,0);assert.equal(M2_93_CENSUS.integrated,0);
 assert.equal(new Set(M2_VARIANT03_FINAL_NAMES).size,10);
 assert.deepEqual(validateCollection(M2_93_ALL),{authored:93,remaining:192,creatorApproved:0,integrated:0});
 assert.ok(M2_83_ALL.every((b,i)=>M2_93_ALL[i]===b),'no prior geometry may be changed');
});
test('five regions, three size classes and both medical/library categories have exactly one third-variant in each slot',()=>{
 for(const type of ['healers-house','library'])for(const biome of BIOMES)for(const size of SIZES)
  assert.equal(M2_93_ALL.filter(b=>b.type===type&&b.biome===biome&&b.size===size&&b.variant===3).length,1,type+' '+biome+' '+size);
 assert.equal(new Set(M2_93_ALL.map(b=>b.id)).size,93);
});
for(const b of M2_VARIANT03_FINAL10)test(b.id+' has real supported roofs, fully connected two-wide clear circulation and provisional producer dependencies',()=>{
 assert.equal(validateBlueprint(b).id,b.id);assert.equal(b.variant,3);assert.ok(expectedIds().includes(b.id));
 assert.ok(b.cells.length>1200&&b.navigation.length>120&&b.spaces.length>=4);
 assert.equal(b.worldPlaced,false);assert.equal(b.creatorApproved,false);assert.equal(b.integrated,false);
 const cells=new Map(b.cells.map(x=>[k(x.at),x])),walking=new Set(b.navigation.map(x=>k(x.at)));
 const floors=b.cells.filter(x=>x.role==='floor'),found=b.cells.filter(x=>x.role==='foundation');
 assert.equal(floors.length,found.length);
 assert.equal(floors.length,b.cells.filter(x=>x.role==='roof'&&x.at[1]===7).length);
 for(const x of floors)assert.equal(cells.get(k([x.at[0],7,x.at[2]]))?.role,'roof');
 const raised=b.cells.filter(x=>x.role==='roof'&&x.at[1]>7);assert.ok(raised.some(x=>x.at[1]===10));
 for(const x of raised)assert.ok(cells.has(k([x.at[0],x.at[1]-1,x.at[2]])),'unsupported roof tier');
 const openings=b.openings.filter(x=>x.kind!=='window');
 assert.ok(openings.some(x=>x.kind==='entrance')&&openings.some(x=>x.kind==='door'));
 for(const o of openings){assert.ok(walking.has(k(o.at)));assert.ok(!cells.has(k(o.at))&&!cells.has(k([o.at[0],o.at[1]+1,o.at[2]])),'obstructed real door');}
 for(const room of b.spaces){assert.ok(room.footprint.length>=4&&walking.has(k(room.access)));for(const [x,z] of room.footprint)assert.equal(cells.get(k([x,1,z]))?.role,'floor');}
 const entrance=b.openings.find(x=>x.kind==='entrance'),seen=new Set([k(entrance.at)]),q=[entrance.at];
 for(let i=0;i<q.length;i++){const [x,y,z]=q[i];for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const at=[x+dx,y,z+dz],id=k(at);if(walking.has(id)&&!seen.has(id)){seen.add(id);q.push(at);}}}
 assert.equal(seen.size,walking.size,'all walking cells must connect to front entrance');
 for(const room of b.spaces)assert.ok(seen.has(k(room.access)),'unreachable actual room');
 assert.deepEqual(new Set(b.dependencies.map(x=>x.ref)),new Set(['pack4:030','pack4:058','pack4:059']));
 assert.ok(b.dependencies.every(x=>x.status==='catalog-provisional'&&x.unresolved.length>=2&&!Object.hasOwn(x,'numericId')));
 assert.ok(b.features.every(x=>x.active===false));
});
test('875 normalized D4 floor comparisons reject new-to-prior and new-to-new near duplicates',()=>{
 let pairs=0,max=0;
 for(let i=83;i<M2_93_ALL.length;i++)for(let j=0;j<i;j++){
  const a=M2_93_ALL[i],b=M2_93_ALL[j],v=maxD4FloorIoU(a,b);pairs++;max=Math.max(v,max);
  assert.ok(v<0.89,'near-duplicate actual occupied floor '+a.id+' vs '+b.id+' IoU='+v);
 }
 assert.equal(pairs,875);assert.ok(max<0.89);
 assert.equal(new Set(M2_93_ALL.map(geometrySignature)).size,93);
});
