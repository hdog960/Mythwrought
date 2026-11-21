// MYTHWROUGHT Builder B 1B: real Pack4 upright opening-pane and 350+ opaque roof-rib source witness.
// Preserves/increases 300+ transparent and 350+ opaque original thresholds; original Pack4 030
// cannot be silently treated as a false horizontal or pitched roof glass tile.
// Source checks DO NOT certify snow/rain sealing, structural load, live mesh or real iPhone.
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildAlderglassTrellisConservatory} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave2.mjs';
import {pack4BuilderAsset} from '../../../src/block-packs/pack-4/builder-handoff.mjs';
const K=a=>a.join(',');
test('Alderglass preserves 371 true transparent upright window panes, 350+ opaque backed roof ribs, and real producer geometry',()=>{
 const b=buildAlderglassTrellisConservatory(),roof=b.placements.filter(p=>p.role==='roof'),
  transparent=b.placements.filter(p=>p.role==='window'&&p.originalGlazing===true),
  frames=roof.filter(p=>p.asset==='pack3:026'),
  voxel=new Map(b.placements.map(p=>[K(p.at),p]));
 assert.ok(transparent.length>=300,'original 300+ transparent source elements lost');
 assert.equal(transparent.length,371,'371 original translucent pane positions must remain present as valid upright opening panes');
 assert.ok(frames.length>=350,'original 350+ opaque source ribs lost');
 assert.equal(frames.length,1097,'original 1097 roof positions changed');
 assert.equal(roof.filter(p=>p.asset.startsWith('pack4:')).length,0,
  'vertical Pack4 opening panes cannot be falsely assigned to horizontal or pitched roof');
 const facades=new Map(),columns=new Map();
 for(const pane of transparent){
  const [x,y,z]=pane.at;
  assert.equal(pane.asset,'pack4:030','translucent source panel is not the genuine Pack4 clear glass family');
  assert.equal(voxel.get(K(pane.at)),pane,'true source pane identity changed');
  assert.ok([2,4,6].includes(y),'Pack4 source pane assigned wrong vertical opening elevation');
  assert.ok(['north','south','east','west'].includes(pane.orientation),
   'physical upright pane must have cardinal builder yaw');
  assert.ok(pane.uprightOpeningPane===true&&pane.roofTile===false&&pane.framedClerestory===true);
  assert.equal(pane.actualWindowWeatherSealCertified,false,'weather seal must remain unapproved');
  assert.equal(pane.glassBreakageAndLiveCollisionCertified,false,'live collision must remain unapproved');
  const part=pack4BuilderAsset('pack4:030',{rotation:pane.orientation});
  assert.equal(part.id,159);assert.equal(part.mount,'opening');
  assert.equal(part.hasRealPhysicalGeometry,true);assert.equal(part.occludesWholeCell,false);
  assert.ok(part.visible.some(x=>x.bounds[4]-x.bounds[1]>.65),
   'genuine Pack4 pane glass has no upright y-span');
  assert.ok(part.collision.length>0&&part.selection.length>0,'real physical pane shape absent');
  const sill=voxel.get(K([x,y-1,z])),lintel=voxel.get(K([x,y+1,z]));
  assert.equal(sill?.role,'wall','pane lacks real wall sill/rib at '+K(pane.at));
  assert.equal(lintel?.role,'wall','pane lacks real wall lintel/rib at '+K(pane.at));
  const delta={north:[0,-1],south:[0,1],west:[-1,0],east:[1,0]}[pane.orientation];
  assert.ok(!voxel.has(K([x+delta[0],0,z+delta[1]])),
   'pane must face genuine exterior daylight rather than another building foundation');
  const column=[x,z].join(','),ys=columns.get(column)??[];ys.push(y);columns.set(column,ys);
  facades.set(pane.orientation,(facades.get(pane.orientation)??0)+1);
 }
 assert.equal(columns.size,124,'original glass source is not arranged in genuine 124 framed exterior bays');
 assert.equal([...columns.values()].filter(ys=>ys.length===3).length,123,
  'all but one source bay must preserve three distinct framed vertical glazing levels');
 assert.equal([...columns.values()].filter(ys=>ys.length===2).length,1,
  'final source bay must preserve two openings to retain exactly 371 total panes');
 assert.equal(facades.size,4,'four different exterior daylight facades not preserved');
 for(const n of facades.values())assert.ok(n>=65,'insufficient physical glazed windows on one facade');
 for(const roofPart of frames){
  const [x,y,z]=roofPart.at,under=voxel.get(K([x,y-1,z]));
  assert.ok(under&&['wall','partition','support'].includes(under.role),
   'original Pack3 roof lacks actual authored immediate source backing '+K(roofPart.at));
 }
 assert.equal(b.architecturalIdentity.sourceUprightGlazingPanels,371);
 assert.equal(b.architecturalIdentity.glassRoofPanels,0);
 assert.equal(b.architecturalIdentity.opaqueRoofSourceCells,1097);
 assert.equal(b.architecturalIdentity.roofWeatherApproved,false);
 assert.equal(b.architecturalIdentity.physicalPackABIApproved,false);
 assert.equal(b.worldPlacement,false);
});
