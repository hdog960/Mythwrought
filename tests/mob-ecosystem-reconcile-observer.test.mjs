import test from 'node:test';
import assert from 'node:assert/strict';
import {captureOriginalReconcileObserver,
  assertOriginalReconcileObserverUnchanged}
  from '../src/mobs/ecosystem-reconcile-observer.mjs';

test('copies and freezes a genuine original 3D observer',()=>{
  const point=[8,4,8],token=captureOriginalReconcileObserver(point);
  assert.deepEqual(token.point,[8,4,8]);
  assert.equal(Object.isFrozen(token),true);
  assert.equal(Object.isFrozen(token.point),true);
  assert.equal(assertOriginalReconcileObserverUnchanged(token,point),true);
});

test('all observer axes are checked after callbacks',()=>{
  for(let axis=0;axis<3;axis++){
    const point=[8,4,8],token=captureOriginalReconcileObserver(point);
    point[axis]+=91;
    assert.throws(()=>assertOriginalReconcileObserverUnchanged(token,point),
      /Original reconcile observer changed during inspection/);
    assert.deepEqual(token.point,[8,4,8]);
  }
});

test('changing original signed-zero coordinates fails conservatively',()=>{
  const point=[0,4,8],token=captureOriginalReconcileObserver(point);
  point[0]=-0;
  assert.throws(()=>assertOriginalReconcileObserverUnchanged(token,point),
    /Original reconcile observer changed during inspection/);
});

test('rejects missing, nonfinite, non-3D and out-of-world source positions',()=>{
  for(const point of [null,{},[8,4],[8,4,8,9],
    [Number.NaN,4,8],[Infinity,4,8],[2**26,4,8],[-(2**26),4,8]])
    assert.throws(()=>captureOriginalReconcileObserver(point),
      /Invalid original reconcile observer/);
});

test('forged frozen tokens cannot certify original observer stability',()=>{
  const point=[8,4,8],token=captureOriginalReconcileObserver(point);
  assert.throws(()=>assertOriginalReconcileObserverUnchanged(
    Object.freeze({point:Object.freeze([...point])}),point),
  /Original reconcile observer changed during inspection/);
  assert.equal(assertOriginalReconcileObserverUnchanged(token,point),true);
});

test('the initial capture refuses a source accessor that changes inputs',()=>{
  const values=[8,4,8],point=[...values];
  let reads=0;
  Object.defineProperty(point,'0',{configurable:true, enumerable:true,
    get(){reads++;return reads<=2?8:100;}});
  assert.throws(()=>captureOriginalReconcileObserver(point),
    /Original reconcile observer changed during capture/);
});

test('immutable snapshot remains an observation, not an ABA monitor',()=>{
  const point=[8,4,8],token=captureOriginalReconcileObserver(point);
  point[0]=100;point[0]=8;
  assert.equal(assertOriginalReconcileObserverUnchanged(token,point),true,
    'Edit then exact restoration between reads cannot be detected');
});
