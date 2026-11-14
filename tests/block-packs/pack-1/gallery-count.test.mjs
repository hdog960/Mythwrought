import test from 'node:test';
import assert from 'node:assert/strict';
import {parseFixtureCount} from './gallery-count.mjs';

const samples=[
  ['masonry','Physical candidate IDs in test fixture: 9, 10, 11, 12, 13, 14\nFixture schema: 1; edits: 6','edits: ',6],
  ['stone','Physically placed test cells: 6\nschema-1 fixture edits: 6','Physically placed test cells: ',6],
  ['garden','Independent placed voxel cells: 3\nCanonical fixture edits: 3','Independent placed voxel cells: ',3],
  ['foliage','Individually placed candidate cells: 8\nCanonical schema-1 fixture edits: 8','Individually placed candidate cells: ',8],
  ['floral','Individually placed physical specimens: 7\nSchema-1-shaped fixture edits: 7','Individually placed physical specimens: ',7]
];

test('all five real gallery status label formats yield exact fixture counts',()=>{
  for(const [name,text,label,expected] of samples)
    assert.equal(parseFixtureCount(text,label),expected,name);
});
test('unrelated numerical IDs and schema values cannot create false placement evidence',()=>{
  assert.ok(Number.isNaN(parseFixtureCount('IDs: 9, 10, 11; schema: 1','edits: ')));
  assert.ok(Number.isNaN(parseFixtureCount('Fixture schema: 1; edits: none','edits: ')));
  assert.ok(Number.isNaN(parseFixtureCount('Physically placed test cells: -1','Physically placed test cells: ')));
  assert.ok(Number.isNaN(parseFixtureCount('Physically placed test cells: ','Physically placed test cells: ')));
});
test('empty and fully placed specimen counts are distinct',()=>{
  for(const [,text,label,count] of samples){
    const initial=text.replace(label+count,label+'0');
    assert.equal(parseFixtureCount(initial,label),0);
    assert.equal(parseFixtureCount(text,label),count);
  }
});
test('parser accepts last exact label and refuses malformed input',()=>{
  assert.equal(parseFixtureCount('edits: 99\nedits: 6','edits: '),6);
  assert.ok(Number.isNaN(parseFixtureCount('', 'edits: ')));
  assert.ok(Number.isNaN(parseFixtureCount(null, 'edits: ')));
  assert.ok(Number.isNaN(parseFixtureCount('edits: 6', '')));
});
