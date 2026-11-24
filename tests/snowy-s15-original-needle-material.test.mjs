import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,cp,readFile,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {VoxelWorld,terrainHeight,collides,meshChunk} from '../production-readonly/src/voxel.mjs';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR,restoreFourRegionWorld} from '../production-readonly/src/manual-biomes/profile-world.mjs';
import {v6BiomeAt} from '../production-readonly/src/manual-biomes/v6-balanced-biomes.mjs';
import {planEnvironmentalScenery} from '../production-readonly/src/nonblock/staged-habitats.mjs';
import {describeCandidateObject} from '../production-readonly/src/nonblock/candidate-scene.mjs';
import {createSnowS12ClimateBoundTreeFactory} from '../src/manual-biomes/snowy-s12-natural-conifer-prototypes.mjs';
import {createSnowS13CertifiedForest,S13_WINDOW} from '../src/manual-biomes/snowy-s13-certified-forest-overlay.mjs';
import {createSnowS14IndexedForest} from '../src/manual-biomes/snowy-s14-indexed-forest.mjs';
import {composeSnowS15CertifiedNeedleMesh,createSnowS15NeedleReader} from '../src/manual-biomes/snowy-s15-certified-needle-material.mjs';
const sha=s=>createHash('sha256').update(s).digest('hex');
const bits=m=>new Uint32Array(m.buffer,m.byteOffset,m.length);
const bytes=m=>Buffer.from(m.buffer,m.byteOffset,m.byteLength);
test('S15 actual original source mesher with only certified 407 tag changes, both seeds and late edit protection',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'snow-s15-'));
 try{
  await cp('production-readonly/src',join(dir,'src'),{recursive:true});
  const path=join(dir,'src','voxel.mjs'),source=await readFile(path,'utf8');
  assert.equal(sha(source),'3632db528a42d4fd9349f8cb78b0193dcd4b9c0b3112a0857f1532552e0f1dd3');
  const changed=composeSnowS15CertifiedNeedleMesh(source);
  await writeFile(path,changed);
  const alternate=(await import(pathToFileURL(path).href)).meshChunk;
  let total=0;
  for(const seed of [179,2026]){
   const p=fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR),w=new FourRegionWorld(seed,p),save=JSON.stringify(w.save());
   const deps={biomeAt:v6BiomeAt,terrainHeight,collides,
    proposedSnowTree:createSnowS12ClimateBoundTreeFactory(seed,v6BiomeAt),
    legacyNatural:(x,y,z)=>VoxelWorld.prototype.naturalAndLandmarkBlock.call(w,x,y,z),
    planScenery:planEnvironmentalScenery,describeScene:describeCandidateObject};
   const cert=createSnowS13CertifiedForest(w,deps);
   const indexed=createSnowS14IndexedForest(w,cert);
   const preview=Object.create(indexed.overlay);
   Object.defineProperty(preview,'snowS15CertifiedNeedleAt',{value:createSnowS15NeedleReader(w,cert.manifest)});
   const needles=cert.manifest.cells.filter(c=>c[3]===407);
   const chunks=new Set(S13_WINDOW.map(([x,z])=>x+','+z));
   for(const [x,,z] of cert.manifest.cells)chunks.add(Math.floor(x/16)+','+Math.floor(z/16));
   let retagged=0,compared=0,unchanged=0;
   for(const k of chunks){
    const [cx,cz]=k.split(',').map(Number);
    assert.deepEqual(bytes(alternate(w,cx,cz)),bytes(meshChunk(w,cx,cz)),'Original no-scope exact byte parity');
    assert.deepEqual(bytes(alternate(indexed.overlay,cx,cz)),bytes(meshChunk(indexed.overlay,cx,cz)),'No certificate exact byte parity');
    const a=meshChunk(preview,cx,cz),b=alternate(preview,cx,cz),aa=bits(a),bb=bits(b);
    assert.equal(a.length,b.length);compared+=a.byteLength;
    for(let i=0;i<a.length;i+=27){
     const offsets=[8,17,26],changed=offsets.filter(o=>aa[i+o]!==bb[i+o]);
     for(let j=0;j<27;j++)if(!offsets.includes(j))assert.equal(aa[i+j],bb[i+j],'Nonmaterial lane changed');
     if(!changed.length){unchanged+=3;continue;}
     assert.equal(changed.length,3);
     for(const o of offsets){assert.equal(a[i+o],18);assert.equal(b[i+o],0);}
     assert.ok(needles.some(([x,y,z])=>[i,i+9,i+18].every(v=>
       a[v]>=x&&a[v]<=x+1&&a[v+1]>=y&&a[v+1]<=y+1&&a[v+2]>=z&&a[v+2]<=z+1)),
       'Retagged triangle outside certified 407 cells');
     retagged+=3;
    }
   }
   assert.ok(retagged>0);total+=retagged;
   assert.equal(JSON.stringify(w.save()),save);
   assert.deepEqual(restoreFourRegionWorld(w.save(),p).save(),w.save());
   const [x,y,z]=needles[0];
   w.set(x,y,z,407);
   assert.equal(w.edits.has(x+','+y+','+z),true);
   assert.equal(preview.snowS15CertifiedNeedleAt(x,y,z),undefined);
   assert.equal(preview.get(x,y,z),407);
   console.log('SNOW_S15_CERTIFIED_NEEDLE_NATIVE '+JSON.stringify({seed,certifiedNeedles:needles.length,
    chunks:chunks.size,comparedBytes:compared,retaggedVertices:retagged,unchangedVertices:unchanged,
    allNonTagBitsExact:true,originalAndUnscopedMeshBytesExact:true,lateEditVeto:true,
    sourceSha256:sha(source),candidateSha256:sha(changed)}));
  }
  assert.ok(total>0);
 }finally{await rm(dir,{recursive:true,force:true});}
});
