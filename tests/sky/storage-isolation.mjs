// Sky tests run against a live world. Its independently witnessed navigation
// discoveries may grow, but existing fog, observed material/height, waypoints,
// landmarks, other seeds and every other protected byte must remain intact.
import assert from 'node:assert/strict';
const int=n=>Number.isSafeInteger(n)&&Math.abs(n)<=10000000;
const keys=seed=>({fog:'mythwrought-exploration-v1-'+seed,obs:'mythwrought-navigation00-observations-v1-'+seed});
const cell=k=>typeof k==='string'&&/^-?\d+,-?\d+$/.test(k)&&k.split(',').every(n=>int(Number(n)))&&k.split(',').map(Number).join(',')===k;
function parseFog(raw,seed){
 if(raw===undefined)return new Set();
 const f=JSON.parse(raw);
 assert.deepEqual(Object.keys(f).sort(),['cellSize','cells','seed','version']);
 assert.equal(f.version,1);assert.equal(f.seed,seed);assert.equal(f.cellSize,4);
 assert.ok(Array.isArray(f.cells)&&f.cells.length<=120000&&f.cells.every(cell));
 const set=new Set(f.cells);assert.equal(set.size,f.cells.length);
 return set;
}
function parseObs(raw,seed,fog){
 if(raw===undefined)return {tiles:new Map(),marks:new Map()};
 const o=JSON.parse(raw);
 assert.deepEqual(Object.keys(o).sort(),['marks','seed','tiles','version']);
 assert.equal(o.version,1);assert.equal(o.seed,seed);
 assert.ok(Array.isArray(o.tiles)&&o.tiles.length<=8192);
 assert.ok(Array.isArray(o.marks)&&o.marks.length<=128);
 const tiles=new Map(),marks=new Map();
 for(const t of o.tiles){
  assert.ok(Array.isArray(t)&&t.length===4&&int(t[0])&&int(t[1])&&/^#[0-9a-f]{6}$/i.test(t[2])&&Number.isInteger(t[3])&&t[3]>=-210&&t[3]<=257);
  const k=t[0]+','+t[1];assert.ok(fog.has(k)&&!tiles.has(k));tiles.set(k,t);
 }
 for(const p of o.marks){
  assert.deepEqual(Object.keys(p).sort(),['id','kind','x','y','z']);
  assert.ok(typeof p.id==='string'&&/^[a-zA-Z0-9_-]{1,48}$/.test(p.id)&&['cave','alpine'].includes(p.kind)&&[p.x,p.y,p.z].every(Number.isFinite)&&Math.abs(p.x)<=40000000&&Math.abs(p.z)<=40000000&&p.y>=-210&&p.y<=257);
  assert.ok(fog.has(Math.floor(p.x/4)+','+Math.floor(p.z/4))&&!marks.has(p.id));marks.set(p.id,p);
 }
 return {tiles,marks};
}
export function assertSkyStorageIsolation(after,before,message,seed=179){
 assert.ok(Number.isSafeInteger(seed)&&seed===(seed|0));
 const {fog,obs}=keys(seed);
 const other=s=>Object.fromEntries(Object.entries(s).filter(([k])=>k!==fog&&k!==obs));
 assert.deepEqual(other(after),other(before),message);
 for(const k of [fog,obs])if(Object.hasOwn(before,k))assert.ok(Object.hasOwn(after,k),'Navigation sidecar disappeared: '+k);
 const oldFog=parseFog(before[fog],seed),newFog=parseFog(after[fog],seed);
 for(const k of oldFog)assert.ok(newFog.has(k),'Prior fog cell lost '+k);
 const old=parseObs(before[obs],seed,oldFog),next=parseObs(after[obs],seed,newFog);
 for(const [k,t] of old.tiles)assert.deepEqual(next.tiles.get(k),t,'Prior observed material or height changed '+k);
 for(const [k,p] of old.marks)assert.deepEqual(next.marks.get(k),p,'Prior landmark changed '+k);
 // Tests do not move the player; additional valid landmarks can be witnessed
 // by independent source discovery, but prior ones are immutable.
}
