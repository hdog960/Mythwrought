// MYTHWROUGHT Builder B: real source greenhouse glazed roof span witness.
// Glazing must remain light-transmitting and near physical ribs, never silently replaced by opaque full blocks.
// These checks are NOT a structural load, rain seal, glass-breakage or creator art certification.
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildAlderglassTrellisConservatory} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave2.mjs';
test('Alderglass source translucent panels remain physically bounded by near timber ribs without opaque blanket',()=>{
 const b=buildAlderglassTrellisConservatory(),roof=b.placements.filter(p=>p.role==='roof');
 const transparent=roof.filter(p=>p.glazed===true),frames=roof.filter(p=>p.glazed!==true);
 const voxel=new Map(b.placements.map(p=>[p.at.join(','),p]));
 assert.ok(transparent.length>=300,'greenhouse glass coverage lost');
 assert.ok(frames.length>=350,'insufficient source timber grid');
 for(const pane of transparent){
  const [x,y,z]=pane.at;
  assert.ok(pane.asset.startsWith('pack4:'),'glazed panel not assigned approved transparent family');
  assert.equal(voxel.get([x,y,z].join(',')),pane,'glazed roof identity changed');
  let nearby=false;
  for(const frame of frames){
   const [fx,fy,fz]=frame.at;
   if(Math.abs(fx-x)+Math.abs(fz-z)<=2&&Math.abs(fy-y)<=2){nearby=true;break;}
  }
  assert.ok(nearby,'roof glass lacks within-two-cells real non-glazed rib: '+pane.at.join(','));
 }
 const unsupportedOpaque=frames.filter(p=>!voxel.has([p.at[0],p.at[1]-1,p.at[2]].join(',')));
 assert.equal(unsupportedOpaque.length,0,'opaque timber roof bay lost its actual source backing');
 assert.equal(b.worldPlacement,false);
});
