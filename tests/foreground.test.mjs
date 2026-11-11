import test from 'node:test';
import assert from 'node:assert/strict';
import {ForegroundFrameDriver,MeshFrameCadence} from '../src/foreground.mjs';

test('at most one RAF at a time, zero frames scheduled during pause',()=>{
 const calls=new Map(),cancelled=new Set(),renders=[];
 let next=0;
 const driver=new ForegroundFrameDriver(cb=>{calls.set(++next,cb);return next;},id=>cancelled.add(id),
   now=>renders.push(now));
 assert.equal(driver.resume(),true);assert.equal(driver.resume(),false);
 assert.equal(calls.size,1);
 const first=calls.get(1);
 first(20);
 assert.deepEqual(renders,[20]);assert.equal(calls.size,2);
 assert.equal(driver.pause(),true);assert.equal(driver.pause(),false);
 assert.equal(cancelled.has(2),true);
 const scheduleSize=calls.size;
 calls.get(2)(30); // stale browser callback after cancellation
 assert.deepEqual(renders,[20]);assert.equal(calls.size,scheduleSize);
 assert.equal(driver.resume(),true);
 calls.get(3)(40);
 assert.deepEqual(renders,[20,40]);
 assert.deepEqual(driver.snapshot(),{running:true,wakeCount:2,pauseCount:1});
});
test('late callback from an older epoch cannot draw after resume',()=>{
 const calls=[];let draws=0;
 const driver=new ForegroundFrameDriver(cb=>(calls.push(cb),calls.length),()=>{},()=>draws++);
 driver.resume();driver.pause();driver.resume();
 calls[0](100);assert.equal(draws,0);
 calls[1](110);assert.equal(draws,1);
 assert.equal(calls.length,3);
});
test('mesh cadence bounds delay while retaining eventual forward progress',()=>{
 const c=new MeshFrameCadence({budgetMs:8,maxCooldown:2});
 assert.equal(c.ready(),true);
 c.finished(26);
 assert.equal(c.stats().cooldown,2);
 assert.equal(c.ready(),false);assert.equal(c.ready(),false);
 assert.equal(c.ready(),true);
 c.finished(5);assert.equal(c.ready(),true);
 assert.equal(c.stats().meshes,2);
 assert.equal(c.stats().skipped,2);
 assert.ok(c.stats().slowestMs>=26);
 c.finished(20);c.resetCooldown();assert.equal(c.ready(),true);
});
test('invalid budgets and mesh durations are rejected',()=>{
 assert.throws(()=>new MeshFrameCadence({budgetMs:0}),/Invalid/);
 assert.throws(()=>new MeshFrameCadence({maxCooldown:10}),/Invalid/);
 const c=new MeshFrameCadence();
 assert.throws(()=>c.finished(-1),/Invalid/);
 assert.throws(()=>c.finished(NaN),/Invalid/);
});
