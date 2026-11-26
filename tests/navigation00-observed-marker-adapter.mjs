import test from 'node:test';
import assert from 'node:assert/strict';
import {createNavigationMarkerHistory} from '../src/navigation00/navigation-marker-history.mjs';
import {pinObservedPlayerMarker} from '../src/navigation00/navigation-observed-marker-adapter.mjs';
test('pins only explicitly observed actual player position',()=>{
 const h=createNavigationMarkerHistory({worldSeed:179});
 assert.throws(()=>pinObservedPlayerMarker(h,'p',{player:{x:3,z:4},worldSeed:179}),/observed/);
 assert.equal(h.list().length,0);
 pinObservedPlayerMarker(h,'p',{observed:true,player:{x:3.5,y:-20,z:4.25},worldSeed:179});
 assert.deepEqual(h.list()[0],{id:'p',x:3.5,z:4.25,y:-20});
});
test('seed mismatch and invalid position cannot mutate marker history',()=>{
 const h=createNavigationMarkerHistory({worldSeed:'real'});
 assert.throws(()=>pinObservedPlayerMarker(h,'p',{observed:true,player:{x:1,z:2},worldSeed:'other'}),/seed/);
 assert.throws(()=>pinObservedPlayerMarker(h,'p',{observed:true,player:{x:Infinity,z:2},worldSeed:'real'}),/observed/);
 assert.equal(h.list().length,0);
 assert.equal(h.undo(),false);
});
test('caller-owned position mutations cannot alter pinned snapshot',()=>{
 const h=createNavigationMarkerHistory({worldSeed:0}); const player={x:1,z:2};
 pinObservedPlayerMarker(h,'p',{observed:true,player,worldSeed:0});player.x=999;
 assert.equal(h.list()[0].x,1);
});
