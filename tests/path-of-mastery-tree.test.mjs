import test from 'node:test';
import assert from 'node:assert/strict';
import {compileSkillTree} from '../src/path-of-mastery/skill-tree.mjs';
const n=(id,extra={})=>({id,level:1,costs:[1,2],requires:[],excludes:[],effect:'fixture',...extra});
const compile=nodes=>compileSkillTree({skill:'pm:mining',nodes},{allowedEffects:['fixture']});
test('branch ranks, prerequisite, level, budget and exclusions',()=>{
  const t=compile([n('root'),n('left',{level:5,requires:[{id:'root',rank:2}],excludes:['right']}),n('right',{requires:[{id:'root',rank:1}],excludes:['left']})]);
  const a=t.purchase({},'root',5,5);assert.equal(a.spent,1);assert.throws(()=>t.purchase(a.ranks,'left',5,5));
  const b=t.purchase(a.ranks,'root',5,5);assert.equal(b.spent,3);assert.throws(()=>t.purchase(b.ranks,'left',4,5));
  const c=t.purchase(b.ranks,'left',5,5);assert.equal(c.remaining,1);assert.throws(()=>t.purchase(c.ranks,'left',5,5));
  assert.throws(()=>t.purchase(c.ranks,'right',5,5));assert.deepEqual(b.ranks,{root:2});
});
test('cycles, invalid rank, missing prerequisite, asymmetric exclusion, unsupported effect',()=>{
  for(const nodes of [[n('a',{requires:[{id:'a',rank:1}]})],[n('a',{requires:[{id:'b',rank:1}]}),n('b',{requires:[{id:'a',rank:1}]})],
    [n('a',{requires:[{id:'b',rank:3}]}),n('b')],[n('a',{requires:[{id:'b',rank:1}]})],
    [n('a',{excludes:['b']}),n('b')],[n('a',{effect:'unsupported'})],[n('a',{costs:[0]})],[n('a'),n('a')]])assert.throws(()=>compile(nodes));
});
test('transitive conflicting prerequisites rejected and input mutations do not alter compiled tree',()=>{
  assert.throws(()=>compile([n('a',{excludes:['b']}),n('b',{excludes:['a']}),n('c',{requires:[{id:'a',rank:1},{id:'b',rank:1}]})]));
  const a=n('a');const t=compile([a]);a.costs[0]=99;assert.equal(t.purchase({},'a',1,1).spent,1);assert.ok(Object.isFrozen(t.nodes[0].costs));
  for(const ranks of [{a:0},{a:3},{unknown:1},{a:1.5}])assert.throws(()=>t.inspect(ranks,99,99));
});
