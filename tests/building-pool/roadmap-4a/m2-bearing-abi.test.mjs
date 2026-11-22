import test from 'node:test';
import assert from 'node:assert/strict';
import {allM2Exemplars} from '../../../src/building-pool/roadmap-4a/m2-blueprints.mjs';
import {allM2Additional} from '../../../src/building-pool/roadmap-4a/m2-additional.mjs';
import {auditBlueprintMaterials} from '../../../src/building-pool/roadmap-4a/m1-material-audit.mjs';

const key=p=>p.join(',');
test('Temperate civic portico and guild rear wing have added real transverse timber support',()=>{
 const [c,g]=allM2Exemplars();
 const civic=new Map(c.cells.map(c=>[key(c.at),c]));
 const guild=new Map(g.cells.map(c=>[key(c.at),c]));
 assert.equal(civic.get('12,3,1')?.role,'beam');
 assert.equal(guild.get('10,3,19')?.role,'beam');
 assert.equal(guild.get('11,3,19')?.role,'beam');
 for(const [design,face] of [[c,1],[g,1]]){
  const cells=new Map(design.cells.map(c=>[key(c.at),c]));
  for(const z of [1,3]){
   const x=design.type==='civic-hall'?12:10;
   assert.equal(cells.get([x,3,z].join(','))?.role,'beam',design.id);
  }
 }
});
test('every roof tile among four M2 candidates has a nearby source-bearing wall, column or beam',()=>{
 for(const b of [...allM2Exemplars(),...allM2Additional()]){
  const cells=new Map(b.cells.map(c=>[key(c.at),c]));
  for(const c of b.cells.filter(c=>c.role==='roof'&&c.at[1]>=4)){
   let support=false;
   for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++){
    if(Math.abs(dx)+Math.abs(dz)>2)continue;
    const below=cells.get([c.at[0]+dx,c.at[1]-1,c.at[2]+dz].join(','));
    if(below&&['wall','column','beam'].includes(below.role))support=true;
   }
   assert.ok(support,b.id+' roof tile lacks local bearing within 2 cells at '+key(c.at));
  }
 }
});
test('all four new source constructions report real integrated manual physical samples but block production placement',()=>{
 for(const b of [...allM2Exemplars(),...allM2Additional()]){
  const audit=auditBlueprintMaterials(b);
  assert.ok(audit.entries.length>=3&&audit.symbolicCells>=3);
  assert.equal(audit.worldPlaced,false);
  assert.equal(audit.productionReady,false);
  assert.equal(audit.saveWritten,false);
  for(const row of audit.entries){
   assert.ok(row.blockedBy.length>0);
   assert.equal(row.chosenNumericId,null);
   assert.ok(row.status==='source-shape-resolved-for-review'||
      row.status==='numeric-variant-choice-required'||
      row.status==='authored-variant-choice-required'||
      row.status==='source-shape-resolution-failed'||
      row.status==='unregistered-biome130-symbol',row.ref);
  }
 }
});
