import test from 'node:test';
import assert from 'node:assert/strict';
import {cityMaterialOverrideAt,cityFloorAt,cityClearanceAt}
 from '../src/living-underworld/city-floor-proposal.mjs';
import {planUnderworldRegion,UNDERWORLD_REGION_SIDE}
 from '../src/living-underworld/worldwide-network.mjs';
test('bounded city neighborhood cache matches exhaustive uncached neighbor search across seeds and region churn',()=>{
 let compared=0;
 for(const seed of [179,-17,2026,314159,13579])
  for(let rx=-55;rx<=55;rx+=5)for(const rz of [-38,0,38]){
   for(let i=0;i<15;i++){
    const x=rx*UNDERWORLD_REGION_SIDE+((i*41)%255),
      z=rz*UNDERWORLD_REGION_SIDE+((i*71)%255),y=-4-((i*23+rx*31)%207+207)%207;
    let reference=0;
    let clearance=false;
    const crx=Math.floor(x/UNDERWORLD_REGION_SIDE),crz=Math.floor(z/UNDERWORLD_REGION_SIDE);
    for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++){
     const city=planUnderworldRegion(seed,crx+dx,crz+dz).cityCandidate;
     if(!city||Math.abs(x-city.x)>city.rx*.57||Math.abs(z-city.z)>city.rz*.57)continue;
     const nx=(x-city.x)/(city.rx*.55),nz=(z-city.z)/(city.rz*.55);
     if(nx*nx+nz*nz>1)continue;
     const floorY=city.y-8;
     if(y>=floorY-5&&y<=floorY)reference=-1;
     else if(y>=city.y-7&&y<=city.y+4)clearance=true;
    }
    if(reference===0&&clearance)reference=1;
    assert.equal(cityMaterialOverrideAt(seed,x,y,z),reference);
    assert.equal(cityFloorAt(seed,x,y,z),reference===-1);
    assert.equal(cityClearanceAt(seed,x,y,z),clearance);
    compared++;
   }
  }
 assert.ok(compared>=4000);
});
