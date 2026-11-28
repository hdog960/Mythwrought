import test from 'node:test';
import assert from 'node:assert/strict';
import {createDurableFixtureLedger} from '../src/path-of-mastery/durable-ledger.mjs';
const scope='fixture:pm4';
function host(){
  let raw=null, fault='',context={scope,mode:'survival',writable:true};
  const tokens=new WeakMap(), storage={async read(){if(fault==='read')throw Error();return raw;},
    async compareExchange(expected,next){if(fault==='before')throw Error();if(raw!==expected)return false;raw=next;if(fault==='after')throw Error();return true;}};
  const rules=[{source:'mine',skill:'pm:mining',amount:30,verify:t=>tokens.get(t)},
    {source:'discover',skill:'pm:exploration',amount:100,verify:t=>tokens.get(t)}];
  const open=(opts={})=>createDurableFixtureLedger({scope,rules,storage,readContext:()=>context,...opts});
  return {open,raw:()=>raw,setRaw:x=>{raw=x;},fault:x=>{fault=x;},context:x=>{context=x;},token:n=>{const t={};tokens.set(t,n);return t;}};
}
test('12000 ordered events, bounded bytes, restart and replay rejection',async()=>{
  const h=host(),l=h.open();for(let n=1;n<=12000;n++)assert.equal((await l.award('mine',h.token(n))).ok,true);
  assert.ok(h.raw().length<2000);const r=h.open(),v=await r.read();assert.equal(v.progress.xp['pm:mining'],360000);
  assert.equal(v.progress.cursors.mine,12000);assert.equal((await r.award('mine',h.token(1))).reason,'duplicate');
  assert.equal((await r.award('mine',h.token(12002))).reason,'gap');assert.equal((await r.award('mine',h.token(12001))).ok,true);
});
test('fault before CAS preserves old bytes; ambiguous post-write recovered exactly once',async()=>{
  const h=host(),l=h.open();assert.equal((await l.award('mine',h.token(1))).ok,true);const old=h.raw();
  h.fault('before');assert.equal((await l.award('mine',h.token(2))).reason,'not-committed');assert.equal(h.raw(),old);
  h.fault('after');assert.equal((await l.award('mine',h.token(2))).ok,true);h.fault('');
  assert.equal((await h.open().award('mine',h.token(2))).reason,'duplicate');assert.equal((await h.open().read()).progress.xp['pm:mining'],60);
});
test('concurrent writers cannot double award or skip a cursor',async()=>{
  const h=host(),a=h.open(),b=h.open();const results=await Promise.all([a.award('mine',h.token(1)),b.award('mine',h.token(1))]);
  assert.equal((await a.read()).progress.xp['pm:mining'],30);assert.equal(results.filter(x=>x.ok).length,1);
  assert.equal((await b.award('mine',h.token(1))).reason,'duplicate');
});
test('corrupt primary retains previous good, explicit restore seals and archives bytes',async()=>{
  const h=host(),l=h.open();await l.award('mine',h.token(1));await l.award('mine',h.token(2));
  const p=JSON.parse(h.raw());p.primary='broken';h.setRaw(JSON.stringify(p));const old=h.raw();
  assert.equal((await l.read()).kind,'recovery');assert.equal((await l.read()).progress.xp['pm:mining'],30);
  assert.equal((await l.award('mine',h.token(3))).reason,'recovery');assert.equal(h.raw(),old);
  assert.equal((await l.restoreBackup(false)).ok,false);assert.equal(h.raw(),old);
  assert.equal((await l.restoreBackup(true)).ok,true);assert.equal(JSON.parse(h.raw()).archived,'broken');
  assert.equal((await h.open().read()).kind,'sealed');assert.equal((await h.open().award('mine',h.token(2))).reason,'sealed');
});
test('malformed outer bytes, backup corruption and mismatched policy are protected',async()=>{
  const h=host(),l=h.open();h.setRaw('not json');assert.equal((await l.award('mine',h.token(1))).reason,'corrupt');assert.equal(h.raw(),'not json');
  h.setRaw(null);await l.award('mine',h.token(1));await l.award('mine',h.token(2));const good=h.raw();
  const p=JSON.parse(good);p.backup='broken';h.setRaw(JSON.stringify(p));assert.equal((await l.read()).kind,'corrupt');
  h.setRaw(good);assert.equal((await h.open({scope:'fixture:other'}).read()).kind,'corrupt');
  h.fault('read');assert.equal((await l.read()).kind,'unavailable');
});
test('fixture-only, source authority, mode isolation, no arbitrary XP',async()=>{
  const h=host(),l=h.open();assert.throws(()=>h.open({scope:'world:real'}));assert.equal((await l.award('mine',{sequence:1,xp:999})).reason,'unverified');
  h.context({scope,mode:'creative',writable:true});assert.equal((await l.award('mine',h.token(1))).ok,false);assert.equal(h.raw(),null);
  h.context({scope,mode:'survival',writable:true});await l.award('discover',h.token(1));
  assert.equal((await l.read()).progress.xp['pm:exploration'],100);assert.equal((await l.read()).progress.xp['pm:mining'],0);
});
test('valid backup rollback is sealed and preserves newer primary bytes',async()=>{
  const h=host(),l=h.open();await l.award('mine',h.token(1));await l.award('mine',h.token(2));const old=JSON.parse(h.raw());
  assert.equal((await l.restoreBackup(true)).ok,true);assert.equal(JSON.parse(h.raw()).archived,old.primary);
  assert.equal((await l.read()).progress.xp['pm:mining'],30);assert.equal((await l.award('mine',h.token(2))).reason,'sealed');
});
