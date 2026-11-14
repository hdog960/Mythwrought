#!/usr/bin/env node
// Independent candidate-vs-merged-shape API acceptance, not a live game test.
// Run from a COMBINED current-main + Pack3 candidate checkout:
//   node tests/block-packs/pack-3/selection-contract-probe.mjs
// Or supply an exact GitHub-blob-matched merged interaction module:
//   node tests/block-packs/pack-3/selection-contract-probe.mjs /path/to/voxel-shape-interactions.mjs
// This deliberately fails when the merged shared module is absent. It neither
// imports the live save codec nor changes shared engine, world or CI files.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {pathToFileURL,fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {pack3CandidateShape} from '../../../src/block-packs/pack-3/catalog.mjs';

const source=resolve(process.argv[2] || fileURLToPath(new URL('../../../src/voxel-shape-interactions.mjs', import.meta.url)));
const bytes=readFileSync(source);
const sha=createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
const {raycastShapes,canPlaceShape,FULL_CUBE,validateShape}=await import(pathToFileURL(source).href);
assert.equal(typeof raycastShapes,'function');
assert.equal(typeof canPlaceShape,'function');
assert.equal(typeof validateShape,'function');
const assets=[];
for(let id=109;id<=125;id++)for(let yaw=0;yaw<=(id<=112?0:3);yaw++){
  const shape=pack3CandidateShape(id,yaw);
  assert.ok(validateShape(shape),`ID ${id} yaw ${yaw} violated merged descriptor contract`);
  assets.push({id,yaw,shape});
}
assert.equal(assets.length,56);
const EPS=1e-9;
// Standalone analytic slab oracle, not the merged raycast implementation.
function rayBox(origin,d,box){
  let enter=-Infinity,exit=Infinity;
  for(let a=0;a<3;a++){
    if(d[a]===0){if(origin[a]<box[a]||origin[a]>box[a+3])return null;continue}
    const a1=(box[a]-origin[a])/d[a],a2=(box[a+3]-origin[a])/d[a];
    enter=Math.max(enter,Math.min(a1,a2));exit=Math.min(exit,Math.max(a1,a2));
    if(enter>exit+1e-10)return null;
  }
  return exit<0?null:Math.max(0,enter);
}
let raySamples=0,solidTargets=0,seeThrough=0,placements=0,overlaps=0;
for(const a of assets){
  for(let axis=0;axis<3;axis++)for(const direction of [-1,1]){
    const perpendicular=[0,1,2].filter(i=>i!==axis);
    for(let i=0;i<11;i++)for(let j=0;j<11;j++){
      // Avoid grazing any exact AABB boundary: shared targeting uses a 1e-9
      // epsilon around coplanar faces. We test interiors, not tie-breaking.
      const u=.04831+.08511*i,v=.03947+.08737*j;
      const origin=[0,0,0],dir=[0,0,0],back=[0,0,0];
      origin[axis]=direction>0?-.2:1.2;
      origin[perpendicular[0]]=u;origin[perpendicular[1]]=v;
      dir[axis]=direction;back[axis]=direction;
      const reader=(x,y,z)=>x===0&&y===0&&z===0?a.shape:
        x===back[0]&&y===back[1]&&z===back[2]?FULL_CUBE:null;
      const result=raycastShapes(origin,dir,reader,3.1);
      const candidates=a.shape.boxes.map(b=>rayBox(origin,dir,b)).filter(t=>t!==null);
      const expectedDistance=Math.min(1.2,...candidates);
      const expectedCell=candidates.some(t=>t<=1.2+EPS)?[0,0,0]:back;
      assert.ok(result,`Missing ray hit ID ${a.id} yaw ${a.yaw}`);
      assert.deepEqual(result.cell,expectedCell,
        `Ray target mismatch ID ${a.id} yaw ${a.yaw} axis ${axis} dir ${direction} @ ${u},${v}`);
      assert.ok(Math.abs(result.distance-expectedDistance)<1e-7,
        `Ray distance mismatch ID ${a.id} yaw ${a.yaw} axis ${axis} dir ${direction} @ ${u},${v}`);
      raySamples++;
      if(expectedCell[axis]===0)solidTargets++;else seeThrough++;
    }
  }
}
for(const a of assets)for(const b of assets){
  // Independent AABB reference: any 3-axis open-interval intersection is solid.
  const occupied=a.shape.boxes.some(x=>b.shape.boxes.some(y=>
    [0,1,2].every(i=>x[i+3]>y[i]+EPS&&y[i+3]>x[i]+EPS)));
  const placementAllowed=canPlaceShape(a.shape,[0,0,0],()=>b.shape);
  assert.equal(placementAllowed,!occupied,
    `Overlap mismatch proposed ID ${a.id}/${a.yaw} vs existing ${b.id}/${b.yaw}`);
  placements++;if(occupied)overlaps++;
}
assert.equal(raySamples,40656);
assert.equal(placements,3136);
assert.equal(solidTargets+seeThrough,raySamples);
// Separate, NEW oblique camera-targeting acceptance: the legacy 43,792
// straight rays / overlap checks above remain an independent regression.
// This covers glancing sightlines, elevated camera pitch, genuine voids and
// behind-the-opening backstops in a sparse two-cell candidate assembly.
// The oracle checks every box analytically, without reusing the merged DDA.
let obliqueRays=0,obliqueSolids=0,obliqueBackstops=0,obliqueEmpty=0;
for(const a of assets){
  for(const axis of [0,2])for(const direction of [-1,1]){
    const perpendicular=axis===0?2:0;
    const back=[0,0,0];back[axis]=direction>0?2:-2;
    const reader=(x,y,z)=>x===0&&y===0&&z===0?a.shape:
      x===back[0]&&y===back[1]&&z===back[2]?FULL_CUBE:null;
    for(let i=0;i<11;i++)for(let j=0;j<11;j++)for(const slope of [-.57,-.31,-.13,.13,.31,.57]){
      const origin=[.5,.5,.5],ray=[0,0,0];
      origin[axis]=direction>0?-.4:1.4;
      origin[perpendicular]=.05591+.08529*i;
      origin[1]=.05183+.08671*j;
      ray[axis]=direction;ray[perpendicular]=slope;ray[1]=-.09+slope*.18;
      const mag=Math.hypot(...ray);const dir=ray.map(v=>v/mag);
      const actual=raycastShapes(origin,dir,reader,4.6);
      const contacts=[];
      for(const [cell,shape] of [[[0,0,0],a.shape],[back,FULL_CUBE]]){
        for(const b of shape.boxes){
          const shifted=b.map((v,k)=>v+cell[k%3]);
          const t=rayBox(origin,dir,shifted);
          if(t!==null&&t<=4.6)contacts.push({cell,distance:t});
        }
      }
      contacts.sort((x,y)=>x.distance-y.distance);
      const expected=contacts[0]??null;
      assert.equal(Boolean(actual),Boolean(expected),
        `Oblique hit existence mismatch ID ${a.id} yaw ${a.yaw}, axis ${axis}, slope ${slope}`);
      if(expected){
        assert.deepEqual(actual.cell,expected.cell,
          `Oblique wrong target cell ID ${a.id} yaw ${a.yaw}, axis ${axis}, slope ${slope}`);
        assert.ok(Math.abs(actual.distance-expected.distance)<1e-7,
          `Oblique distance mismatch ID ${a.id} yaw ${a.yaw}, axis ${axis}, slope ${slope}`);
        if(expected.cell[axis]===0)obliqueSolids++;else obliqueBackstops++;
      } else obliqueEmpty++;
      obliqueRays++;
    }
  }
}
assert.equal(obliqueRays,162624);
assert.equal(obliqueSolids+obliqueBackstops+obliqueEmpty,obliqueRays);
console.log(JSON.stringify({
  verdict:'PASS',sharedShapeSourceGitBlob:sha,source,
  physicalCandidateFamilies:17,supportedYawAssets:56,
  raySamples,solidTargets,seeThrough,placementPairs:placements,overlapPairs:overlaps,
  legacyIndependentChecks:raySamples+placements,
  obliqueRays,obliqueSolids,obliqueBackstops,obliqueEmpty,
  totalIndependentChecks:raySamples+placements+obliqueRays,
  productionWebGLTested:false,productionSavesModified:false
}));
